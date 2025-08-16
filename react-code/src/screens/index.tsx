import { Link } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedTitle from "@/src/components/ui/AnimatedTitle";
import DismissKeyboardView from "@/src/components/ui/DismissKeyboardView";
import WelcomeTutorial from "@/src/components/ui/WelcomeTutorial";
import IpAddressInput from "@/src/components/welcome/IpAddressInput";
import LedToggle from "@/src/components/welcome/LedToggle";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { checkFirstTimeUser } from "@/src/services/FirstTimeUserService";
import { getIpAddress } from "@/src/services/IpConfigService";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";

function Welcome() {
	const {
		isShelfConnected,
		setIsShelfConnected,
		setHasChanges,
		setSettings,
		settings,
	} = useConfiguration();
	const [isFirstTime, setIsFirstTime] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [ipAddress, setIpAddress] = useState("");
	const [isEnabled, setIsEnabled] = useState(false);

	useEffect(() => {
		const fetchIpAddress = async () => {
			const ip = await getIpAddress();
			if (ip) {
				setIpAddress(ip);
			}
		};

		fetchIpAddress();
	}, []);

	useEffect(() => {
		const determineFirstTimeUser = async () => {
			const firstTime = await checkFirstTimeUser();
			setIsFirstTime(firstTime);
			if (firstTime) {
				setShowTutorial(true);
			}
		};
		determineFirstTimeUser();
	}, []);

	const handleStart = () => {
		if (isFirstTime) {
			setShowTutorial(true);
		}
	};

	const handleTutorialFinish = () => {
		setShowTutorial(false);
	};

	const handleIpSaved = (enabled: boolean, connected: boolean) => {
		setIsEnabled(enabled);
		setIsShelfConnected(connected);
	};

	return (
		<DismissKeyboardView>
			<SafeAreaView style={COMMON_STYLES.container}>
				<View style={COMMON_STYLES.header}>
					<Image
						source={require("../../assets/images/icon.png")}
						style={COMMON_STYLES.logo}
					/>
					<AnimatedTitle text="Luminova" />
				</View>

				<View style={styles.mainContent}>
					<IpAddressInput onIpSaved={handleIpSaved} />
					<LedToggle
						isShelfConnected={isShelfConnected}
						setIsShelfConnected={setIsShelfConnected}
						isEnabled={isEnabled}
						setIsEnabled={setIsEnabled}
					/>
				</View>

				<View style={styles.footer}>
					<Link href="/Settings" asChild>
						<TouchableOpacity
							style={COMMON_STYLES.welcomeButton}
							onPress={handleStart}
						>
							<Text style={COMMON_STYLES.buttonText}>Get Started</Text>
						</TouchableOpacity>
					</Link>
				</View>

				{showTutorial ? (
					<WelcomeTutorial
						visible={showTutorial}
						onComplete={handleTutorialFinish}
					/>
				) : null}
			</SafeAreaView>
		</DismissKeyboardView>
	);
}

const styles = StyleSheet.create({
	mainContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	footer: {
		justifyContent: "flex-end",
		marginBottom: Platform.OS === "ios" ? 20 : 30,
	},
});

export default Welcome;
