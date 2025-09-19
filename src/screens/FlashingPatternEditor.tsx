import * as React from "react";

const { useEffect, useState } = React;

import AnimatedDots from "@/src/components/animations/AnimatedDots";
import BPMMeasurer from "@/src/components/audio/BPMMeasurer";
import ActionButton from "@/src/components/buttons/ActionButton";
import MetronomeButton from "@/src/components/buttons/MetronomeButton";
import RandomizeButton from "@/src/components/buttons/RandomizeButton";
import { BpmControl, Picker } from "@/src/components/color-picker";
import type { PickerRef } from "@/src/components/color-picker/Picker";
import Header from "@/src/components/common/Header";
import { ANIMATION_PATTERNS } from "@/src/configurations/patterns";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import type { RootStackParamList } from "@/src/screens/index";
import { postConfig, restoreConfiguration } from "@/src/services/ApiService";
import {
	loadSettings,
	saveSettings,
	updateSetting,
} from "@/src/services/SettingsService";
import {
	COLORS,
	COMMON_STYLES,
	DIMENSIONS,
	FONTS,
} from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";
import {
	filterSettingNameInput,
	sanitizeSettingName,
	validateSettingName,
} from "@/src/utils/inputSecurity";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
	Dimensions,
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
		isPreviewing: globalIsPreviewing,
		setIsPreviewing: setGlobalIsPreviewing,
	} = useConfiguration();

	const setting = route.params?.setting;
	const isNew = route.params?.isNew || false;
	const settingIndex = route.params?.settingIndex; // Add support for index-based editing

	const [initialDelayTime] = React.useState(setting.delayTime);
	const [initialFlashingPattern] = React.useState(setting.flashingPattern);

	const [BPM, setBPM] = React.useState(0);
	const debouncedBPM = useDebounce(BPM, 100);
	const [bpmSliderValue, setBpmSliderValue] = React.useState(0); // Separate state for slider to throttle it
	const debouncedBpmSliderValue = useDebounce(bpmSliderValue, 50); // Fast debounce for smooth slider
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

	// Name editing state (now used for both new and existing settings)
	const [settingName, setSettingName] = useState(setting.name);
	const debouncedSettingName = useDebounce(settingName, 300);
	const [nameError, setNameError] = useState<string | null>(null);
	const [hasChanges, setHasChanges] = useState(isNew);
	const [hasBPMBeenManuallySet, setHasBPMBeenManuallySet] = useState(false); // Track if BPM was set by user
	const nameInputRef = React.useRef<TextInput>(null);

	const handleNameChange = (text: string) => {
		// Apply real-time filtering to prevent harmful input
		const filteredText = filterSettingNameInput(text);
		setSettingName(filteredText);
		setHasChanges(true);
	};

	// Debounced name validation
	React.useEffect(() => {
		const validateName = async () => {
			// Sanitize the debounced input before validation
			const sanitizedName = sanitizeSettingName(debouncedSettingName);

			if (sanitizedName === setting.name) {
				setNameError(null);
				return;
			}

			// Apply security validation first
			const securityValidation = validateSettingName(sanitizedName);
			if (!securityValidation.isValid) {
				setNameError(securityValidation.error);
				return;
			}

			// Check for duplicate names
			const settings = await loadSettings();
			const nameExists = settings?.some(
				(s: Setting, index: number) =>
					s.name.toLowerCase() === sanitizedName.toLowerCase() &&
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
		// Only initialize BPM if it hasn't been manually set by user
		if (!hasBPMBeenManuallySet) {
			const initialBpm = parseFloat(calculateBPM(setting.delayTime));
			const bpmValue = Number.isNaN(initialBpm) ? 0 : initialBpm;
			setBPM(bpmValue);
			setBpmSliderValue(bpmValue); // Also set slider value
			setBpmInput(bpmValue.toFixed(0));
		}
	}, [setting.delayTime, hasBPMBeenManuallySet]); // Only depend on setting.delayTime, not calculateBPM

	// Handle debounced slider value changes
	useEffect(() => {
		if (debouncedBpmSliderValue > 0 && !isRandomizing) {
			const roundedValue = Math.round(debouncedBpmSliderValue);
			setBPM(roundedValue);
			setBpmInput(roundedValue.toString());
			setHasBPMBeenManuallySet(true);
			setHasChanges(true);
		}
	}, [debouncedBpmSliderValue, isRandomizing]);

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
				setHasBPMBeenManuallySet(true); // Mark BPM as manually set
				setHasChanges(true);
			}
		}
	}, [debouncedBpmInput, flashingPattern, isRandomizing, BPM]); // Added isRandomizing dependency

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
	}, [debouncedDelayTime, debouncedFlashingPattern, navigation, setting]);

	const handleCancel = () => {
		unPreviewAPI();
		navigation.navigate("Settings");
	};

	const handleReset = () => {
		unPreviewAPI();

		// Set flag to prevent conflicts during reset
		setIsRandomizing(true);
		setDelayTime(initialDelayTime);
		const resetBpm = parseFloat(calculateBPM(initialDelayTime));
		setBPM(resetBpm);
		setBpmSliderValue(resetBpm); // Also reset slider value
		setBpmInput(resetBpm.toFixed(0));
		setHasBPMBeenManuallySet(false); // Reset manual BPM flag
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
		// Sanitize the setting name before saving
		const sanitizedName = sanitizeSettingName(settingName);

		// Create a new setting object to avoid mutating the original
		const updatedSetting = {
			...setting,
			delayTime: Math.round(delayTime),
			flashingPattern: flashingPattern,
			name: sanitizedName,
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
				name: sanitizedName,
				delayTime: Math.round(delayTime),
				flashingPattern: flashingPattern,
			};

			if (settingIndex !== undefined) {
				await updateSetting(settingIndex, updatedSetting);

				const currentIndex = settingIndex; // Use the existing index
				if (currentIndex !== undefined) {
					setLastEdited(currentIndex.toString());
				}
				navigation.navigate("Settings", { setting });
			}
		}
	};

	const previewAPI = async () => {
		if (globalIsPreviewing) {
			console.warn("Cannot preview: Preview operation already in progress");
			return;
		}
		setGlobalIsPreviewing(true);
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
		} finally {
			setGlobalIsPreviewing(false);
		}
	};

	const unPreviewAPI = async () => {
		if (globalIsPreviewing) {
			console.warn("Cannot restore: Preview operation in progress");
			return;
		}
		setPreviewMode(false);
		if (currentConfiguration) {
			setGlobalIsPreviewing(true);
			try {
				await restoreConfiguration(currentConfiguration);
				console.log("Configuration restored");
				setIsShelfConnected(true);
			} catch (error) {
				console.error("Restore error:", error);
				setIsShelfConnected(false);
			} finally {
				setGlobalIsPreviewing(false);
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
				<View style={styles.contentContainer}>
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
								setBpmSliderValue(randomBPM); // Also set slider value
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
								ref={nameInputRef}
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
								spellCheck={false}
								autoCorrect={false}
								importantForAutofill="no"
								textContentType="none"
								selectTextOnFocus={true}
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
								bpm={bpmSliderValue} // Use slider value for smoother display
								bpmInput={bpmInput}
								disabled={false}
								onBpmChange={(value) => {
									// Just update the slider value, let debouncing handle the rest
									setBpmSliderValue(value);
								}}
								onBpmInputChange={(text) => setBpmInput(text)}
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
											setBpmSliderValue(clampedValue); // Also set slider value
											setHasBPMBeenManuallySet(true); // Mark BPM as manually set
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
									globalIsPreviewing
										? "Previewing..."
										: previewMode
											? hasChanges
												? "Update"
												: "Preview"
											: "Preview"
								}
								onPress={() => {
									if (isShelfConnected && !globalIsPreviewing) {
										previewAPI();
										setPreviewMode(true);
									}
								}}
								disabled={!isShelfConnected || globalIsPreviewing}
								variant={!hasChanges && previewMode ? "disabled" : "primary"}
								opacity={
									!isShelfConnected || globalIsPreviewing
										? COLORS.DISABLED_OPACITY
										: undefined
								}
							/>
						</View>
					</View>
					{/* Extra space to ensure BPM input is visible when keyboard appears */}
					<View style={styles.keyboardSpacer} />
				</View>
				<BPMMeasurer
					isVisible={showBPMMeasurer}
					onClose={() => setShowBPMMeasurer(false)}
					onBPMDetected={(bpm) => {
						setBPM(bpm);
						setBpmSliderValue(bpm); // Also set slider value
						setHasBPMBeenManuallySet(true); // Mark BPM as manually set
						setHasChanges(true);
					}}
				/>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		paddingHorizontal: 20 * DIMENSIONS.SCALE,
		paddingBottom: 20 * DIMENSIONS.SCALE,
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
});
