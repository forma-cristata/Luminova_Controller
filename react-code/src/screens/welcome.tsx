import { useEffect, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	TextInput,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";

import AnimatedTitle from "@/src/components/ui/AnimatedTitle";
import Button from "@/src/components/ui/buttons/Button";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import { COLORS, FONTS } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";
import { ApiService } from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import React from "react";
import { IpConfigService } from "../services/IpConfigService";

export default function Welcome({ navigation }: any) {
	const { currentConfiguration, setCurrentConfiguration, setLastEdited } =
		useConfiguration();
	const [displayText, setDisplayText] = useState("");
	const fullText = "Hello";
	const [ipAddress, setIpAddress] = useState("");
	const [isIpValid, setIsIpValid] = useState(true);

	useEffect(() => {
		const loadIp = async () => {
			const ip = await IpConfigService.getCurrentIp();
			setIpAddress(ip);
		};
		loadIp();
	}, []);

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

	const validateIp = (ip: string) => {
		const ipRegex =
			/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return ipRegex.test(ip);
	};

	const handleIpChange = (ip: string) => {
		setIpAddress(ip);
		setIsIpValid(validateIp(ip));
	};

	const handleSaveIp = async () => {
		if (!isIpValid) {
			Alert.alert("Invalid IP", "Please enter a valid IP address.");
			return;
		}
		await IpConfigService.saveIpAddress(ipAddress);
		Alert.alert("IP Address Saved", `The new IP address is ${ipAddress}`);
		// Re-check status after saving new IP
		setIsLoading(true);
		try {
			const data = await ApiService.getStatus();
			setIsEnabled(data.shelfOn);
		} catch (error) {
			console.error("Error fetching status after IP change:", error);
			setIsEnabled(false); // Assume off if status check fails
		} finally {
			setIsLoading(false);
		}
	};

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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView style={styles.container}>
				<InfoButton />
				<AnimatedTitle text={displayText} fontSize={130} marginBottom="20%" />
				<TextInput
					style={[styles.ipInput, !isIpValid && styles.ipInputError]}
					value={ipAddress}
					onChangeText={handleIpChange}
					placeholder="Enter Shelf IP Address"
					placeholderTextColor="#888"
					onSubmitEditing={handleSaveIp}
					autoCapitalize="none"
					keyboardType="numeric"
				/>
				<Button
					title="Save IP"
					onPress={handleSaveIp}
					variant="secondary"
					style={styles.saveButton}
				/>
				<Button
					title="Create ⟩"
					onPress={createButtonPressed}
					variant="welcome"
					textStyle={styles.buttonText}
				/>
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
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.BLACK,
	},
	ipInput: {
		backgroundColor: "#333",
		color: COLORS.WHITE,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 8,
		width: "80%",
		textAlign: "center",
		marginBottom: 10,
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#555",
	},
	ipInputError: {
		borderColor: COLORS.ERROR,
	},
	saveButton: {
		marginBottom: 20,
	},
	buttonText: {
		color: COLORS.WHITE,
		fontSize: 40,
		fontFamily: FONTS.SIGNATURE,
	},
	switch: {
		transformOrigin: "center",
		transform: "scale(1.5)",
	},
});
