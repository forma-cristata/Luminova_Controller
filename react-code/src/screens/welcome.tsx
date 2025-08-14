import { useEffect, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
} from "react-native";

import AnimatedTitle from "@/src/components/AnimatedTitle";
import InfoButton from "@/src/components/InfoButton";
import { COLORS, COMMON_STYLES, FONTS } from "@/src/components/SharedStyles";
import type { Setting } from "@/src/interface/SettingInterface";
import { ApiService } from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import React from "react";

export default function Welcome({ navigation }: any) {
	const { currentConfiguration, setCurrentConfiguration, setLastEdited } =
		useConfiguration();
	const [displayText, setDisplayText] = useState("");
	const fullText = "Hello";

	useEffect(() => {
		setLastEdited("0");
	}, [setLastEdited]);

	useEffect(() => {
		if (displayText.length < fullText.length) {
			const timeout1 = setTimeout(() => {
				setDisplayText(fullText.substring(0, displayText.length + 1));
			}, 300);

			return () => {
				clearTimeout(timeout1);
			};
		}
	}, [displayText]);

	function createButtonPressed() {
		navigation.navigate("Settings");
	}

	const [isEnabled, setIsEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchInitialStatus = async () => {
			try {
				const data = await ApiService.getStatus();
				setIsEnabled(data.shelfOn);
			} catch (error) {
				console.error("Error fetching status:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialStatus();
	}, []);

	const toggleSwitch = async () => {
		const newState = !isEnabled;
		setIsEnabled(newState);

		if (!currentConfiguration) {
			const startConfig: Setting = {
				name: "still",
				colors: [
					"#ff0000",
					"#ff4400",
					"#ff6a00",
					"#ff9100",
					"#ffee00",
					"#00ff1e",
					"#00ff44",
					"#00ff95",
					"#00ffff",
					"#0088ff",
					"#0000ff",
					"#8800ff",
					"#ff00ff",
					"#ff00bb",
					"#ff0088",
					"#ff0044",
				],
				whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				brightnessValues: [
					255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
					255, 255,
				],
				flashingPattern: "6",
				delayTime: 3,
			};
			setCurrentConfiguration(startConfig);
		} else {
			const startConfig: Setting = {
				name: currentConfiguration.name,
				colors: currentConfiguration.colors,
				whiteValues: currentConfiguration.whiteValues,
				brightnessValues: currentConfiguration.brightnessValues,
				flashingPattern: currentConfiguration.flashingPattern,
				delayTime: currentConfiguration.delayTime,
			};
			setCurrentConfiguration(startConfig);
		}

		try {
			const endpoint = newState ? "on" : "off";
			await ApiService.toggleLed(endpoint);
			console.log(`LED toggled ${endpoint}`);
		} catch (error) {
			console.error("Error toggling LED:", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<InfoButton />
			<AnimatedTitle text={displayText} fontSize={130} marginBottom="20%" />
			<TouchableOpacity
				style={COMMON_STYLES.welcomeButton}
				onPress={createButtonPressed}
			>
				<Text style={styles.button}>Create ⟩</Text>
			</TouchableOpacity>
			<Switch
				onValueChange={toggleSwitch}
				value={isEnabled}
				trackColor={{ false: "#665e73", true: "#ffffff" }}
				thumbColor={isEnabled ? "#665e73" : "#f4f3f4"}
				ios_backgroundColor="#3e3e3e"
				style={styles.switch}
				disabled={isLoading}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.BLACK,
	},
	button: {
		color: COLORS.WHITE,
		fontSize: 40,
		fontFamily: FONTS.SIGNATURE,
	},
	switch: {
		transformOrigin: "center",
		transform: "scale(1.5)",
	},
});
