import Slider from "@react-native-community/slider";
import { useThrottle } from "expo-dev-launcher/bundle/hooks/useDebounce";
import * as React from "react";

const { useEffect, useState } = React;

import {
	Dimensions,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimatedDots from "@/app/components/AnimatedDots";
import BackButton from "@/app/components/BackButton";
import BPMMeasurer from "@/app/components/BPMMeasurer";
import InfoButton from "@/app/components/InfoButton";
import MetronomeButton from "@/app/components/MetronomeButton";
import Picker from "@/app/components/Picker";
import RandomizeButton from "@/app/components/RandomizeButton";
import { COLORS, COMMON_STYLES, FONTS } from "@/app/components/SharedStyles";
import { useConfiguration } from "@/app/context/ConfigurationContext";
import { ApiService } from "@/services/ApiService";
import { loadData, saveData } from "@/app/settings";

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

	const [initialDelayTime] = React.useState(setting.delayTime);
	const [initialFlashingPattern] = React.useState(setting.flashingPattern);

	const [BPM, setBPM] = React.useState(0);
	const throttledBPM = useThrottle(BPM);
	const [delayTime, setDelayTime] = React.useState(setting.delayTime);
	const throttledDelayTime = useThrottle(delayTime);
	const [flashingPattern, setFlashingPattern] = React.useState(
		setting.flashingPattern,
	);
	const throttledFlashingPattern = useThrottle(flashingPattern);

	const [previewMode, setPreviewMode] = useState(false);
	const [showBPMMeasurer, setShowBPMMeasurer] = useState(false);
	const calculateBPM = (delayTime: number): string => {
		return (60000 / (64 * delayTime)).toFixed(0);
	};

	useEffect(() => {
		const initialBpm = parseFloat(calculateBPM(setting.delayTime));
		setBPM(Number.isNaN(initialBpm) ? 0 : initialBpm);
	}, [calculateBPM, setting.delayTime]);

	const calculateDelayTime = (bpm: number): number => {
		return Math.round(60000 / (64 * bpm));
	};
	const modeDots = () => {
		const newSetting = {
			...setting,
			delayTime: throttledDelayTime,
			flashingPattern: flashingPattern,
		};
		return <AnimatedDots navigation={navigation} setting={newSetting} />;
	};

	const handleSave = async () => {
		setting.delayTime = Math.round(delayTime);
		setting.flashingPattern = flashingPattern;

		if (isNew) {
			const settings = await loadData();
			const updatedSettings = [...settings, setting];
			await saveData(updatedSettings);

			const newIndex = updatedSettings.length - 1;
			setLastEdited(newIndex.toString());

			navigation.navigate("Settings", { setting });
		} else {
			const settings = await loadData();
			const updatedSettings = settings?.map((s) =>
				s.name === setting.name
					? {
							...s,
							delayTime: Math.round(delayTime),
							flashingPattern: flashingPattern,
						}
					: s,
			);
			await saveData(updatedSettings);
			const currentIndex = updatedSettings.findIndex(
				(s) => s.name === setting.name,
			);
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

	// Pattern IDs (excluding "Still" which is "6")
	const ANIMATION_PATTERNS = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"7",
		"8",
		"9",
		"10",
		"11",
	];

	return (
		<SafeAreaProvider>
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
					<Text style={styles.whiteText}>{setting.name}</Text>{" "}
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
						selectedPattern={throttledFlashingPattern}
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
								value={throttledBPM}
								onValueChange={(value) => {
									setBPM(value);
									const newDelayTime = calculateDelayTime(value);
									setDelayTime(newDelayTime);
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
						<TouchableOpacity
							style={[
								COMMON_STYLES.styleAButton,
								{
									opacity:
										delayTime !== initialDelayTime ||
										flashingPattern !== initialFlashingPattern
											? 1
											: COLORS.DISABLED_OPACITY,
								},
							]}
							onPress={() => {
								setDelayTime(initialDelayTime);
								setBPM(parseFloat(calculateBPM(initialDelayTime)));
								setFlashingPattern(initialFlashingPattern);
								unPreviewAPI();
							}}
							disabled={
								delayTime === initialDelayTime &&
								flashingPattern === initialFlashingPattern
							}
						>
							<Text style={COMMON_STYLES.buttonText}>Reset</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								COMMON_STYLES.styleAButton,
								{
									opacity:
										delayTime !== initialDelayTime ||
										flashingPattern !== initialFlashingPattern ||
										isNew
											? 1
											: COLORS.DISABLED_OPACITY,
								},
							]}
							onPress={handleSave}
							disabled={
								!isNew &&
								delayTime === initialDelayTime &&
								flashingPattern === initialFlashingPattern
							}
						>
							<Text style={COMMON_STYLES.buttonText}>Save</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={
								!(
									delayTime !== initialDelayTime ||
									flashingPattern !== initialFlashingPattern
								) && previewMode
									? COMMON_STYLES.styleADisabledButton
									: COMMON_STYLES.styleAButton
							}
							key={(
								delayTime !== initialDelayTime ||
								flashingPattern !== initialFlashingPattern
							).toString()}
							onPress={() => {
								previewAPI();
								setPreviewMode(true);
							}}
						>
							<Text style={COMMON_STYLES.buttonText}>
								{previewMode &&
								(delayTime !== initialDelayTime ||
									flashingPattern !== initialFlashingPattern)
									? "Update"
									: "Preview"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>{" "}
				<BPMMeasurer
					isVisible={showBPMMeasurer}
					onClose={() => setShowBPMMeasurer(false)}
					onBPMDetected={(bpm) => {
						setBPM(bpm);
						setDelayTime(calculateDelayTime(bpm));
					}}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
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
});
