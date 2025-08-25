import * as React from "react";

const { useEffect, useState } = React;

import {
	Dimensions,
	Keyboard,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	TouchableWithoutFeedback,
} from "react-native";

import ActionButton from "@/src/components/buttons/ActionButton";
import AnimatedDots from "@/src/components/animations/AnimatedDots";
import Header from "@/src/components/common/Header";
import BPMMeasurer from "@/src/components/audio/BPMMeasurer";
import MetronomeButton from "@/src/components/buttons/MetronomeButton";
import { Picker, BpmControl } from "@/src/components/color-picker";
import type { PickerRef } from "@/src/components/color-picker/Picker";
import RandomizeButton from "@/src/components/buttons/RandomizeButton";
import {
	COLORS,
	COMMON_STYLES,
	FONTS,
	DIMENSIONS,
} from "@/src/styles/SharedStyles";
import { ANIMATION_PATTERNS } from "@/src/configurations/patterns";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import type { Setting } from "@/src/types/SettingInterface";
import { postConfig, restoreConfiguration } from "@/src/services/ApiService";
import {
	loadSettings,
	saveSettings,
	updateSetting,
} from "@/src/services/SettingsService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

type FlashingPatternEditorProps = NativeStackScreenProps<
	RootStackParamList,
	"FlashingPatternEditor"
>;

/**
 * This page should edit:
 *      The effect number - everything else should be disabled until the user has selected a setting other than STILL (6)
 *      Then...
 *      The delayTime - this should be a ratio of the value the user chooses.
 *          The user should choose the 'speed'
 *          The greater the speed, the shorter the delay time.*/
export default function FlashingPatternEditor({
	route,
	navigation,
}: FlashingPatternEditorProps) {
	const {
		currentConfiguration,
		setLastEdited,
		isShelfConnected,
		setIsShelfConnected,
	} = useConfiguration();

	const setting = route.params?.setting;
	const isNew = route.params?.isNew || false;
	const settingIndex = route.params?.settingIndex; // Add support for index-based editing

	const [initialDelayTime] = React.useState(setting.delayTime);
	const [initialFlashingPattern] = React.useState(setting.flashingPattern);

	const [BPM, setBPM] = React.useState(0);
	const debouncedBPM = useDebounce(BPM, 100);
	const [bpmInput, setBpmInput] = React.useState("");
	const debouncedBpmInput = useDebounce(bpmInput, 300);
	const [delayTime, setDelayTime] = React.useState(setting.delayTime);
	const debouncedDelayTime = useDebounce(delayTime, 100);
	const [flashingPattern, setFlashingPattern] = React.useState(
		setting.flashingPattern,
	);
	const debouncedFlashingPattern = useDebounce(flashingPattern, 50);

	const [previewMode, setPreviewMode] = useState(false);
	const [showBPMMeasurer, setShowBPMMeasurer] = useState(false);
	const [isRandomizing, setIsRandomizing] = useState(false); // Flag to prevent conflicts during randomization
	const pickerRef = React.useRef<PickerRef>(null);
	const scrollViewRef = React.useRef<ScrollView>(null);

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
			const settings = await loadSettings();
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
			// Only set hasChanges if the new delay time is different from initial
			if (Math.round(newDelayTime) !== initialDelayTime) {
				setHasChanges(true);
			}
		}
	}, [debouncedBPM, initialDelayTime]);

	// Track flashing pattern changes
	useEffect(() => {
		if (flashingPattern !== initialFlashingPattern) {
			setHasChanges(true);
		} else if (
			flashingPattern === initialFlashingPattern &&
			delayTime === initialDelayTime &&
			settingName === setting.name
		) {
			// Reset hasChanges when all values are back to initial state
			setHasChanges(isNew);
		}
	}, [
		flashingPattern,
		initialFlashingPattern,
		delayTime,
		initialDelayTime,
		settingName,
		setting.name,
		isNew,
	]);

	useEffect(() => {
		const initialBpm = parseFloat(calculateBPM(setting.delayTime));
		const bpmValue = Number.isNaN(initialBpm) ? 0 : initialBpm;
		setBPM(bpmValue);
		setBpmInput(bpmValue.toFixed(0));
	}, [setting.delayTime]); // Only depend on setting.delayTime, not calculateBPM

	// Handle BPM text input changes
	useEffect(() => {
		if (debouncedBpmInput.trim() === "" || isRandomizing) return;

		const inputValue = parseFloat(debouncedBpmInput);
		if (!Number.isNaN(inputValue)) {
			// Clamp the value within 60-200 BPM range
			const clampedValue = Math.max(60, Math.min(200, inputValue));
			// Only update if significantly different to avoid slider conflicts
			if (Math.abs(clampedValue - BPM) > 0.5) {
				setBPM(clampedValue);
				setHasChanges(true);
			}
		}
	}, [debouncedBpmInput, flashingPattern, isRandomizing]); // Added isRandomizing dependency

	// Update text input when BPM slider changes
	useEffect(() => {
		if (isRandomizing) return; // Don't interfere during randomization

		const currentInputValue = parseFloat(bpmInput);
		// Only update if the input is significantly different or invalid
		if (
			Number.isNaN(currentInputValue) ||
			Math.abs(currentInputValue - BPM) > 1
		) {
			setBpmInput(BPM.toFixed(0));
		}
	}, [BPM, bpmInput, isRandomizing]);

	// Auto-scroll with keyboard show/hide for BPM input visibility
	React.useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				// Scroll to show the BPM input area with more aggressive scrolling
				setTimeout(() => {
					scrollViewRef.current?.scrollToEnd({ animated: true });
				}, 100);
				// Also try a second scroll attempt in case the first one wasn't enough
				setTimeout(() => {
					scrollViewRef.current?.scrollTo({ y: 1000, animated: true });
				}, 50);
			},
		);

		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				// Scroll back to top when keyboard hides
				setTimeout(() => {
					scrollViewRef.current?.scrollTo({ y: 0, animated: true });
				}, 40);
			},
		);

		return () => {
			keyboardDidShowListener?.remove();
			keyboardDidHideListener?.remove();
		};
	}, []);

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
	}, [
		debouncedDelayTime,
		debouncedFlashingPattern,
		setting.colors,
		navigation,
		setting,
	]);

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

		// Set flag to prevent conflicts during reset
		setIsRandomizing(true);

		setDelayTime(initialDelayTime);
		const resetBpm = parseFloat(calculateBPM(initialDelayTime));
		setBPM(resetBpm);
		setBpmInput(resetBpm.toFixed(0));
		setFlashingPattern(initialFlashingPattern);
		setSettingName(setting.name); // Reset name
		setNameError(null); // Clear name error

		// Use setTimeout to ensure all state updates complete before setting hasChanges to false
		setTimeout(() => {
			setHasChanges(false); // Reset the changes flag
		}, 0);

		// Clear the randomizing flag after debounce period
		setTimeout(() => {
			setIsRandomizing(false);
		}, 350); // Wait for debounce period to complete

		// Refocus the picker to the reset pattern
		setTimeout(() => {
			pickerRef.current?.refocus();
		}, 200); // Small delay to ensure state has updated
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
			const settings = await loadSettings();
			const updatedSettings = [...settings, updatedSetting];
			await saveSettings(updatedSettings);

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

			if (settingIndex !== undefined) {
				const _updatedSettings = await updateSetting(
					settingIndex,
					updatedSetting,
				);

				const currentIndex = settingIndex; // Use the existing index
				if (currentIndex !== undefined) {
					setLastEdited(currentIndex.toString());
				}
				navigation.navigate("Settings", { setting });
			}
		}
	};

	const previewAPI = async () => {
		try {
			await postConfig({
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
				await restoreConfiguration(currentConfiguration);
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
				<Header
					backButtonProps={{
						beforePress: previewMode ? unPreviewAPI : undefined,
					}}
				/>
				<ScrollView
					ref={scrollViewRef}
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.titleContainer}>
						<RandomizeButton
							onPress={() => {
								// Set flag to prevent conflicts during randomization
								setIsRandomizing(true);

								// Random pattern from valid animation patterns (excluding current one)
								const availablePatterns = ANIMATION_PATTERNS.filter(
									(pattern) => pattern !== flashingPattern,
								);

								// If all patterns are the same or only one pattern exists, use any pattern
								const patternsToChooseFrom =
									availablePatterns.length > 0
										? availablePatterns
										: ANIMATION_PATTERNS;

								const randomPattern =
									patternsToChooseFrom[
									Math.floor(Math.random() * patternsToChooseFrom.length)
									];
								setFlashingPattern(randomPattern);

								// Random BPM within 60-200 range
								const randomBPM = Math.floor(Math.random() * (200 - 60) + 60);
								setBPM(randomBPM);
								setBpmInput(randomBPM.toString());

								setHasChanges(true);

								// Clear the randomizing flag after all state updates
								setTimeout(() => {
									setIsRandomizing(false);
								}, 350); // Wait for debounce period to complete

								// Focus picker on the new random pattern
								setTimeout(() => {
									pickerRef.current?.refocus();
								}, 100);
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
							setting={setting}
							selectedPattern={debouncedFlashingPattern}
							setSelectedPattern={setFlashingPattern}
						/>
					</View>
					<View style={styles.sliderPadding}>
						<View style={COMMON_STYLES.sliderContainer}>
							<BpmControl
								bpm={BPM}
								bpmInput={bpmInput}
								disabled={false}
								onBpmChange={(value) => {
									const roundedValue = Math.round(value);
									setBPM(roundedValue);
									setBpmInput(roundedValue.toString());
									setHasChanges(true);
								}}
								onBpmInputChange={setBpmInput}
								onBpmInputBlur={() => {
									// Ensure the input is properly formatted when user finishes editing
									const inputValue = parseFloat(bpmInput);
									if (!Number.isNaN(inputValue)) {
										const clampedValue = Math.max(
											60,
											Math.min(200, inputValue),
										);
										setBpmInput(clampedValue.toFixed(0));
										if (clampedValue !== BPM) {
											setBPM(clampedValue);
											setHasChanges(true);
										}
									} else if (bpmInput.trim() === "") {
										setBpmInput(BPM.toFixed(0));
									}
									Keyboard.dismiss();
								}}
							/>
						</View>
					</View>
					<View style={COMMON_STYLES.buttonContainer}>
						<View style={COMMON_STYLES.buttonRow}>
							<ActionButton
								title={isNew ? "Cancel" : "Reset"}
								onPress={isNew ? handleCancel : handleReset}
								disabled={!isNew && !hasChanges}
								opacity={isNew ? 1 : hasChanges ? 1 : COLORS.DISABLED_OPACITY}
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
								opacity={
									!isShelfConnected ? COLORS.DISABLED_OPACITY : undefined
								}
							/>
						</View>
					</View>
					{/* Extra space to ensure BPM input is visible when keyboard appears */}
					<View style={styles.keyboardSpacer} />
				</ScrollView>
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
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 200 * DIMENSIONS.SCALE, // Extra space to ensure scrolling works with keyboard
	},
	keyboardSpacer: {
		height: 50 * DIMENSIONS.SCALE, // Additional space for keyboard visibility
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: width * 0.9,
		marginTop: 40 * DIMENSIONS.SCALE,
		marginBottom: height * 0.03,
		borderStyle: "solid",
		borderBottomWidth: 2 * DIMENSIONS.SCALE,
		borderColor: COLORS.WHITE,
	},
	whiteText: {
		color: COLORS.WHITE,
		fontSize: 30 * DIMENSIONS.SCALE,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		flex: 1,
	},
	fpContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20 * DIMENSIONS.SCALE,
		marginBottom: 20 * DIMENSIONS.SCALE,
		width: width * 0.85,
		borderStyle: "solid",
		borderWidth: 2 * DIMENSIONS.SCALE,
		borderColor: COLORS.WHITE,
		padding: 10 * DIMENSIONS.SCALE,
		borderRadius: 10 * DIMENSIONS.SCALE,
	},
	dotPadding: {
		marginTop: 20 * DIMENSIONS.SCALE,
		marginBottom: 20 * DIMENSIONS.SCALE,
	},
	sliderPadding: {
		marginBottom: 20 * DIMENSIONS.SCALE,
	},
	nameInputContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	nameInput: {
		color: COLORS.WHITE,
		fontSize: 30 * DIMENSIONS.SCALE,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		minWidth: width * 0.6,
		padding: 10 * DIMENSIONS.SCALE,
	},
	bpmRangeText: {
		color: COLORS.WHITE,
		fontSize: 14 * DIMENSIONS.SCALE,
		fontFamily: FONTS.CLEAR,
		textAlign: "center",
		marginTop: 5 * DIMENSIONS.SCALE,
		opacity: 0.7,
	},
});
