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
	TouchableOpacity,
	View,
} from "react-native";

import ActionButton from "@/src/components/ui/buttons/ActionButton";
import AnimatedDots from "@/src/components/animations/AnimatedDots";
import BackButton from "@/src/components/ui/buttons/BackButton";
import BPMMeasurer from "@/src/components/audio/BPMMeasurer";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import MetronomeButton from "@/src/components/ui/buttons/MetronomeButton";
import Picker from "@/src/components/color-picker/Picker";
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
	const { currentConfiguration, setLastEdited } = useConfiguration();

	const setting = route.params?.setting;
	const isNew = route.params?.isNew || false;
	const settingIndex = route.params?.settingIndex; // Add support for index-based editing

	const [initialDelayTime] = React.useState(setting.delayTime);
	const [initialFlashingPattern] = React.useState(setting.flashingPattern);

	const [BPM, setBPM] = React.useState(0);
	const debouncedBPM = useDebounce(BPM, 200);
	const [delayTime, setDelayTime] = React.useState(setting.delayTime);
	const debouncedDelayTime = useDebounce(delayTime, 200);
	const [flashingPattern, setFlashingPattern] = React.useState(
		setting.flashingPattern,
	);
	const debouncedFlashingPattern = useDebounce(flashingPattern, 50);

	const [previewMode, setPreviewMode] = useState(false);
	const [showBPMMeasurer, setShowBPMMeasurer] = useState(false);

	// Name editing state (now used for both new and existing settings)
	const [settingName, setSettingName] = useState(setting.name);
	const [nameError, setNameError] = useState<string | null>(null);
	const [hasChanges, setHasChanges] = useState(false);

	const handleNameChange = async (text: string) => {
		setSettingName(text);
		setHasChanges(true);

		// Check for duplicate names
		const settings = await SettingsService.loadSettings();
		const nameExists = settings?.some(
			(s: Setting, index: number) =>
				s.name.toLowerCase() === text.toLowerCase() &&
				s.name !== setting.name &&
				(!isNew || index !== settingIndex), // Exclude current setting for existing settings
		);
		setNameError(nameExists ? "Name already exists." : null);
	};

	const calculateBPM = (delayTime: number): string => {
		return (60000 / (64 * delayTime)).toFixed(0);
	};

	const calculateDelayTime = (bpm: number): number => {
		return Math.round(60000 / (64 * bpm));
	};

	// Throttle expensive operations but keep slider responsive
	const throttledSetDelayTime = React.useCallback(
		React.useMemo(() => {
			let timeoutId: ReturnType<typeof setTimeout> | null = null;
			return (bpm: number) => {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				timeoutId = setTimeout(() => {
					const newDelayTime = calculateDelayTime(bpm);
					setDelayTime(newDelayTime);
				}, 50);
			};
		}, []),
		[],
	);

	useEffect(() => {
		const initialBpm = parseFloat(calculateBPM(setting.delayTime));
		setBPM(Number.isNaN(initialBpm) ? 0 : initialBpm);
	}, [setting.delayTime]); // Only depend on setting.delayTime, not calculateBPM

	// Track changes when values differ from initial values
	useEffect(() => {
		const hasPatternChanges =
			delayTime !== initialDelayTime ||
			flashingPattern !== initialFlashingPattern;
		const hasNameChanges = settingName !== setting.name;
		setHasChanges(hasPatternChanges || hasNameChanges);
	}, [
		delayTime,
		initialDelayTime,
		flashingPattern,
		initialFlashingPattern,
		settingName,
		setting.name,
	]);
	const modeDots = () => {
		const newSetting = {
			...setting,
			delayTime: debouncedDelayTime, // Use throttled/debounced value for consistency
			flashingPattern: flashingPattern,
		};
		return (
			<AnimatedDots
				key={`${debouncedDelayTime}-${flashingPattern}`}
				navigation={navigation}
				setting={newSetting}
			/>
		);
	};

	const handleSave = async () => {
		setting.delayTime = Math.round(delayTime);
		setting.flashingPattern = flashingPattern;
		setting.name = settingName; // Update name for both new and existing settings

		if (isNew) {
			const settings = await SettingsService.loadSettings();
			const updatedSettings = [...settings, setting];
			await SettingsService.saveSettings(updatedSettings);

			const newIndex = updatedSettings.length - 1;
			setLastEdited(newIndex.toString());

			navigation.navigate("Settings", { setting });
		} else {
			const updatedSetting = {
				...setting,
				name: settingName,
				delayTime: Math.round(delayTime),
				flashingPattern: flashingPattern,
			};
			const updatedSettings = await SettingsService.updateSetting(
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
		} catch (error) {
			console.error("Preview error:", error);
		}
	};

	const unPreviewAPI = async () => {
		setPreviewMode(false);
		if (currentConfiguration) {
			try {
				await ApiService.restoreConfiguration(currentConfiguration);
				console.log("Configuration restored");
			} catch (error) {
				console.error("Restore error:", error);
			}
		}
	};

	return (
		<SafeAreaView style={COMMON_STYLES.container}>
			<InfoButton />
			<BackButton beforePress={previewMode ? unPreviewAPI : undefined} />
			<View style={styles.titleContainer}>
				<RandomizeButton
					onPress={() => {
						// Random BPM between 40 and 180
						const randomBPM = Math.floor(Math.random() * (180 - 40) + 40);
						setBPM(randomBPM);
						setDelayTime(calculateDelayTime(randomBPM));

						// Random pattern from valid animation patterns (excluding STILL)
						const randomPattern =
							ANIMATION_PATTERNS[
							Math.floor(Math.random() * ANIMATION_PATTERNS.length)
							];
						setFlashingPattern(randomPattern);
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
			<View style={styles.dotPadding}>{modeDots()}</View>
			<View style={styles.fpContainer}>
				<Picker
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
								throttledSetDelayTime(value);
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
						title="Reset"
						onPress={() => {
							setDelayTime(initialDelayTime);
							setBPM(parseFloat(calculateBPM(initialDelayTime)));
							setFlashingPattern(initialFlashingPattern);
							setSettingName(setting.name); // Reset name
							setNameError(null); // Clear name error
							unPreviewAPI();
						}}
						disabled={!hasChanges}
						opacity={hasChanges ? 1 : COLORS.DISABLED_OPACITY}
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
							previewAPI();
							setPreviewMode(true);
						}}
						variant={!hasChanges && previewMode ? "disabled" : "primary"}
					/>
				</View>
			</View>
			<BPMMeasurer
				isVisible={showBPMMeasurer}
				onClose={() => setShowBPMMeasurer(false)}
				onBPMDetected={(bpm) => {
					setBPM(bpm);
					setDelayTime(calculateDelayTime(bpm));
				}}
			/>
		</SafeAreaView>
	);
}

const { width, height } = Dimensions.get("window");
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
