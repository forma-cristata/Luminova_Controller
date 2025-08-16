import Slider from "@react-native-community/slider";
import * as React from "react";

const { useEffect, useState } = React;

import {
	Dimensions,
	Keyboard,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableWithoutFeedback,
} from "react-native";

import ActionButton from "@/src/components/ui/buttons/ActionButton";
import AnimatedDots from "@/src/components/animations/AnimatedDots";
import BackButton from "@/src/components/ui/buttons/BackButton";
import BPMMeasurer from "@/src/components/audio/BPMMeasurer";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import MetronomeButton from "@/src/components/ui/buttons/MetronomeButton";
import Picker, { type PickerRef } from "@/src/components/color-picker/Picker";
import RandomizeButton from "@/src/components/ui/buttons/RandomizeButton";
import { COLORS, COMMON_STYLES, FONTS } from "@/src/styles/SharedStyles";
import { ANIMATION_PATTERNS } from "@/src/configurations/patterns";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import type { Setting } from "@/src/types/SettingInterface";
import { ApiService } from "@/src/services/ApiService";
import { SettingsService } from "@/src/services/SettingsService";

/**
 * This page should edit:
 *      The effect number - everything else should be disabled until the user has selected a setting other than STILL (6)
 *      Then...
 *      The delayTime - this should be a ratio of the value the user chooses.
 *          The user should choose the 'speed'
 *          The greater the speed, the shorter the delay time.*/
export default function FlashingPatternEditor({ route, navigation }: any) {
	const { currentConfiguration, setLastEdited, isShelfConnected, setIsShelfConnected } = useConfiguration();

	const setting = route.params?.setting;
	const isNew = route.params?.isNew || false;
	const settingIndex = route.params?.settingIndex; // Add support for index-based editing

	const [initialDelayTime] = React.useState(setting.delayTime);
	const [initialFlashingPattern] = React.useState(setting.flashingPattern);

	const [BPM, setBPM] = React.useState(0);
	const debouncedBPM = useDebounce(BPM, 100);
	const [delayTime, setDelayTime] = React.useState(setting.delayTime);
	const debouncedDelayTime = useDebounce(delayTime, 100);
	const [flashingPattern, setFlashingPattern] = React.useState(
		setting.flashingPattern,
	);
	const debouncedFlashingPattern = useDebounce(flashingPattern, 50);

	const [previewMode, setPreviewMode] = useState(false);
	const [showBPMMeasurer, setShowBPMMeasurer] = useState(false);
	const pickerRef = React.useRef<PickerRef>(null);

	// Name editing state (now used for both new and existing settings)
	const [settingName, setSettingName] = useState(setting.name);
	const debouncedSettingName = useDebounce(settingName, 300);
	const [nameError, setNameError] = useState<string | null>(null);
	const [hasChanges, setHasChanges] = useState(isNew);

	const handleNameChange = (text: string) => {
		setSettingName(text);
		setHasChanges(true);
	};

	// Debounced name validation
	React.useEffect(() => {
		const validateName = async () => {
			if (debouncedSettingName === setting.name) {
				setNameError(null);
				return;
			}

			// Check for duplicate names
			const settings = await SettingsService.loadSettings();
			const nameExists = settings?.some(
				(s: Setting, index: number) =>
					s.name.toLowerCase() === debouncedSettingName.toLowerCase() &&
					s.name !== setting.name &&
					(!isNew || index !== settingIndex), // Exclude current setting for existing settings
			);
			setNameError(nameExists ? "Name already exists." : null);
		};

		if (debouncedSettingName.trim()) {
			validateName();
		}
	}, [debouncedSettingName, setting.name, isNew, settingIndex, setNameError]);

	const calculateBPM = (delayTime: number): string => {
		return (60000 / (64 * delayTime)).toFixed(0);
	};

	const calculateDelayTime = (bpm: number): number => {
		return Math.round(60000 / (64 * bpm));
	};

	// Update delayTime when debounced BPM changes
	useEffect(() => {
		if (debouncedBPM > 0) {
			const newDelayTime = calculateDelayTime(debouncedBPM);
			setDelayTime(newDelayTime);
			setHasChanges(true);
		}
	}, [debouncedBPM]);

	// Track flashing pattern changes
	useEffect(() => {
		if (flashingPattern !== initialFlashingPattern) {
			setHasChanges(true);
		}
	}, [flashingPattern, initialFlashingPattern]);

	useEffect(() => {
		const initialBpm = parseFloat(calculateBPM(setting.delayTime));
		setBPM(Number.isNaN(initialBpm) ? 0 : initialBpm);
	}, [setting.delayTime]); // Only depend on setting.delayTime, not calculateBPM

	// Memoized animated dots that only updates when debounced values change
	const modeDots = React.useMemo(() => {
		const newSetting = {
			...setting,
			delayTime: debouncedDelayTime, // Use debounced value
			flashingPattern: debouncedFlashingPattern, // Use debounced value
		};
		return (
			<AnimatedDots
				key={`${debouncedDelayTime}-${debouncedFlashingPattern}`}
				navigation={navigation}
				setting={newSetting}
			/>
		);
	}, [debouncedDelayTime, debouncedFlashingPattern, setting.colors, navigation, setting]);

	const handleCancel = () => {
		unPreviewAPI();
		const newSettingCarouselIndex = route.params?.newSettingCarouselIndex;
		if (newSettingCarouselIndex !== undefined) {
			setLastEdited(newSettingCarouselIndex.toString());
		}
		navigation.navigate("Settings");
	};

	const handleReset = () => {
		unPreviewAPI();
		if (hasChanges) {
			setDelayTime(initialDelayTime);
			setBPM(parseFloat(calculateBPM(initialDelayTime)));
			setFlashingPattern(initialFlashingPattern);
			setSettingName(setting.name); // Reset name
			setNameError(null); // Clear name error
			setHasChanges(false); // Reset the changes flag

			// Refocus the picker to the reset pattern
			setTimeout(() => {
				pickerRef.current?.refocus();
			}, 200); // Small delay to ensure state has updated
		}
	};

	const handleSave = async () => {
		// Create a new setting object to avoid mutating the original
		const updatedSetting = {
			...setting,
			delayTime: Math.round(delayTime),
			flashingPattern: flashingPattern,
			name: settingName,
		};

		if (isNew) {
			const settings = await SettingsService.loadSettings();
			const updatedSettings = [...settings, updatedSetting];
			await SettingsService.saveSettings(updatedSettings);

			const newIndex = updatedSettings.length - 1;
			setLastEdited(newIndex.toString());

			navigation.navigate("Settings", { setting: updatedSetting });
		} else {
			const updatedSetting = {
				...setting,
				name: settingName,
				delayTime: Math.round(delayTime),
				flashingPattern: flashingPattern,
			};
			const _updatedSettings = await SettingsService.updateSetting(
				settingIndex,
				updatedSetting,
			);

			const currentIndex = settingIndex; // Use the existing index
			setLastEdited(currentIndex.toString());
			navigation.navigate("Settings", { setting });
		}
	};

	const previewAPI = async () => {
		try {
			await ApiService.postConfig({
				colors: setting.colors,
				whiteValues: setting.whiteValues,
				brightnessValues: setting.brightnessValues,
				effectNumber: flashingPattern,
				delayTime: delayTime,
			});
			console.log("Preview successful");
			setIsShelfConnected(true);
		} catch (error) {
			console.error("Preview error:", error);
			setIsShelfConnected(false);
		}
	};

	const unPreviewAPI = async () => {
		setPreviewMode(false);
		if (currentConfiguration) {
			try {
				await ApiService.restoreConfiguration(currentConfiguration);
				console.log("Configuration restored");
				setIsShelfConnected(true);
			} catch (error) {
				console.error("Restore error:", error);
				setIsShelfConnected(false);
			}
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView style={COMMON_STYLES.container}>
				<InfoButton />
				<BackButton beforePress={previewMode ? unPreviewAPI : undefined} />
				<View style={styles.titleContainer}>
					<RandomizeButton
						onPress={() => {
							// Random BPM between 40 and 180
							const randomBPM = Math.floor(Math.random() * (180 - 40) + 40);
							setBPM(randomBPM);

							// Random pattern from valid animation patterns (excluding STILL)
							const randomPattern =
								ANIMATION_PATTERNS[
								Math.floor(Math.random() * ANIMATION_PATTERNS.length)
								];
							setFlashingPattern(randomPattern);
							setHasChanges(true);
						}}
					/>
					<View style={styles.nameInputContainer}>
						<Text style={COMMON_STYLES.sliderText}>Setting Name:</Text>
						<TextInput
							style={[
								styles.nameInput,
								nameError ? { color: COLORS.ERROR } : null,
							]}
							value={settingName}
							onChangeText={handleNameChange}
							placeholder="Enter setting name"
							placeholderTextColor={COLORS.PLACEHOLDER}
							maxLength={20}
							onBlur={() => {
								Keyboard.dismiss();
							}}
							autoCapitalize="words"
							keyboardAppearance="dark"
						/>
					</View>
					<MetronomeButton
						onPress={() => {
							setShowBPMMeasurer(true);
						}}
					/>
				</View>
				<View style={styles.dotPadding}>{modeDots}</View>
				<View style={styles.fpContainer}>
					<Picker
						ref={pickerRef}
						navigation={navigation}
						setting={setting}
						selectedPattern={debouncedFlashingPattern}
						setSelectedPattern={setFlashingPattern}
					/>
				</View>
				<View style={styles.sliderPadding}>
					<View style={COMMON_STYLES.sliderContainer}>
						<View style={styles.sliderRow}>
							<Text style={COMMON_STYLES.sliderText}>
								Speed: {BPM.toFixed(0)} bpm
							</Text>
							<Slider
								style={styles.slider}
								minimumValue={40}
								maximumValue={180}
								value={BPM}
								onValueChange={(value) => {
									setBPM(value);
									setHasChanges(true);
								}}
								minimumTrackTintColor="#ff0000"
								maximumTrackTintColor={COLORS.WHITE}
								thumbTintColor={COLORS.WHITE}
							/>
						</View>
					</View>
				</View>
				<View style={COMMON_STYLES.buttonContainer}>
					<View style={COMMON_STYLES.buttonRow}>
						<ActionButton
							title={isNew ? "Cancel" : "Reset"}
							onPress={isNew ? handleCancel : handleReset}
							disabled={!isNew && !hasChanges}
							opacity={
								isNew ? 1 : hasChanges ? 1 : COLORS.DISABLED_OPACITY
							}
						/>

						<ActionButton
							title="Save"
							onPress={handleSave}
							disabled={!hasChanges || !!nameError}
							opacity={
								hasChanges
									? !nameError
										? 1
										: COLORS.DISABLED_OPACITY
									: COLORS.DISABLED_OPACITY
							}
						/>

						<ActionButton
							title={
								previewMode ? (hasChanges ? "Update" : "Preview") : "Preview"
							}
							onPress={() => {
								if (isShelfConnected) {
									previewAPI();
									setPreviewMode(true);
								}
							}}
							disabled={!isShelfConnected}
							variant={!hasChanges && previewMode ? "disabled" : "primary"}
							opacity={!isShelfConnected ? COLORS.DISABLED_OPACITY : undefined}
						/>
					</View>
				</View>
				<BPMMeasurer
					isVisible={showBPMMeasurer}
					onClose={() => setShowBPMMeasurer(false)}
					onBPMDetected={(bpm) => {
						setBPM(bpm);
						setHasChanges(true);
					}}
				/>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
} const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: width * 0.9,
		marginTop: 40,
		marginBottom: height * 0.03,
		borderStyle: "solid",
		borderBottomWidth: 2,
		borderColor: COLORS.WHITE,
	},
	whiteText: {
		color: COLORS.WHITE,
		fontSize: 30 * scale,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		flex: 1,
	},
	fpContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 20,
		width: width * 0.85,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: COLORS.WHITE,
		padding: 10 * scale,
		borderRadius: 10,
	},
	sliderRow: {
		marginVertical: 5 * scale,
	},
	slider: {
		width: "100%",
		height: 30 * scale,
	},
	dotPadding: {
		marginTop: 20,
		marginBottom: 20,
	},
	sliderPadding: {
		marginBottom: 20,
	},
	nameInputContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	nameInput: {
		color: COLORS.WHITE,
		fontSize: 30 * scale,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		minWidth: width * 0.6,
		padding: 10,
	},
});
