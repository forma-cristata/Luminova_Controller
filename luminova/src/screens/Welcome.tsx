import { useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	View,
	ScrollView,
	TouchableOpacity,
} from "react-native";

import AnimatedTitle from "@/src/components/common/AnimatedTitle";
import Button from "@/src/components/buttons/Button";
import InfoButton from "@/src/components/buttons/InfoButton";
import WelcomeTutorial from "@/src/components/common/WelcomeTutorial";
import { COLORS, FONTS, DIMENSIONS } from "@/src/styles/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { FirstTimeUserService } from "@/src/services/FirstTimeUserService";
import IpAddressInput from "@/src/components/welcome/IpAddressInput";
import LedToggle from "@/src/components/welcome/LedToggle";
import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./index";

interface WelcomeProps {
	navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function Welcome({ navigation }: WelcomeProps) {
	const { setLastEdited, isShelfConnected, setIsShelfConnected } =
		useConfiguration();
	const [displayText, setDisplayText] = useState("");
	const fullText = "Hello";
	const [isEnabled, setIsEnabled] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [debugTapCount, setDebugTapCount] = useState(0);

	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		setLastEdited("0");
	}, [setLastEdited]);

	// Check for first-time user on component mount
	useEffect(() => {
		const checkFirstTimeUser = async () => {
			const isFirstTime = await FirstTimeUserService.isFirstTimeUser();
			if (isFirstTime) {
				// Small delay to let the screen render first
				setTimeout(() => {
					setShowTutorial(true);
				}, 1000);
			}
		};

		checkFirstTimeUser();
	}, []);

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

	// Auto-scroll with keyboard show/hide
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				// Scroll distance to show inputs above keyboard
				const scrollDistance = DIMENSIONS.SCREEN_HEIGHT * 0.15; // Reduced to keep inputs visible
				scrollViewRef.current?.scrollTo({ y: scrollDistance, animated: true });
			},
		);

		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				scrollViewRef.current?.scrollTo({ y: 0, animated: true });
			},
		);

		return () => {
			keyboardDidShowListener?.remove();
			keyboardDidHideListener?.remove();
		};
	}, []);

	const handleIpSaved = (newIsEnabled: boolean, newIsConnected: boolean) => {
		setIsEnabled(newIsEnabled);
		setIsShelfConnected(newIsConnected);
	};

	const handleTutorialComplete = () => {
		setShowTutorial(false);
	};

	const handleDebugTap = () => {
		const newCount = debugTapCount + 1;
		setDebugTapCount(newCount);

		if (newCount >= 5) {
			setDebugTapCount(0);
			setShowTutorial(true);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView style={styles.container}>
				<InfoButton />
				<LedToggle
					isShelfConnected={isShelfConnected}
					setIsShelfConnected={setIsShelfConnected}
					isEnabled={isEnabled}
					setIsEnabled={setIsEnabled}
				/>

				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					style={styles.scrollView}
					scrollEnabled={false}
				>
					<View style={styles.topSection}>
						<TouchableOpacity
							style={styles.titleContainer}
							onPress={handleDebugTap}
							activeOpacity={1}
							hitSlop={{
								top: DIMENSIONS.SCREEN_HEIGHT * 0.02,
								bottom: DIMENSIONS.SCREEN_HEIGHT * 0.02,
								left: DIMENSIONS.SCREEN_WIDTH * 0.05,
								right: DIMENSIONS.SCREEN_WIDTH * 0.05,
							}}
						>
							<AnimatedTitle
								text={displayText}
								fontSize={Math.min(240, DIMENSIONS.SCREEN_HEIGHT * 0.12)}
								marginBottom={DIMENSIONS.SCREEN_HEIGHT * 0.02}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.middleSection}>
						<Button
							title="Create ⟩"
							onPress={createButtonPressed}
							variant="welcome"
							textStyle={styles.buttonText}
						/>
					</View>

					<View style={styles.bottomSection}>
						<IpAddressInput onIpSaved={handleIpSaved} />
					</View>
				</ScrollView>

				{/* Welcome Tutorial Modal */}
				<WelcomeTutorial
					visible={showTutorial}
					onComplete={handleTutorialComplete}
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
	scrollContent: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: DIMENSIONS.SCREEN_HEIGHT * 0.4, // Extra padding for scroll space
		paddingTop: DIMENSIONS.SCREEN_HEIGHT * 0.12,
		minHeight: DIMENSIONS.SCREEN_HEIGHT, // Content fits in 100% screen height
	},
	scrollView: {
		flex: 1,
		width: "100%",
	},
	titleContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: DIMENSIONS.SCREEN_HEIGHT * 0.03,
		paddingHorizontal: DIMENSIONS.SCREEN_WIDTH * 0.05,
		paddingVertical: DIMENSIONS.SCREEN_HEIGHT * 0.02,
		minHeight: DIMENSIONS.SCREEN_HEIGHT * 0.15,
	},
	topSection: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		minHeight: DIMENSIONS.SCREEN_HEIGHT * 0.25,
	},
	middleSection: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	bottomSection: {
		flex: 2,
		justifyContent: "flex-start",
		alignItems: "center",
		width: "100%",
	},
	buttonText: {
		color: COLORS.WHITE,
		fontSize: Math.min(75, DIMENSIONS.SCREEN_HEIGHT * 0.0375),
		fontFamily: FONTS.SIGNATURE,
	},
});
