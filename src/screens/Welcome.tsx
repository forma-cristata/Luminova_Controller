import Button from "@/src/components/buttons/Button";
import AnimatedTitle from "@/src/components/common/AnimatedTitle";
import Header from "@/src/components/common/Header";
import WelcomeTutorial from "@/src/components/common/WelcomeTutorial";
import IpAddressInput from "@/src/components/welcome/IpAddressInput";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { COLORS, DIMENSIONS, FONTS } from "@/src/styles/SharedStyles";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Keyboard,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "./index";

interface WelcomeProps {
	navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function Welcome({ navigation }: WelcomeProps) {
	const { setLastEdited, setIsShelfConnected } = useConfiguration();
	const [displayText, setDisplayText] = useState("");
	const fullText = "Luminova";
	const [isEnabled, setIsEnabled] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [debugTapCount, setDebugTapCount] = useState(0);

	const scrollViewRef = useRef<ScrollView>(null);
	const tutorialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setLastEdited("0");
	}, [setLastEdited]);

	// Show tutorial only when screen is focused and after delay
	useFocusEffect(
		useCallback(() => {
			// Clear any existing timeout
			if (tutorialTimeoutRef.current) {
				clearTimeout(tutorialTimeoutRef.current);
			}

			// Set tutorial to show after delay, but only if screen is still focused
			tutorialTimeoutRef.current = setTimeout(() => {
				setShowTutorial(true);
			}, 3450);

			// Cleanup function - clear timeout when screen loses focus
			return () => {
				if (tutorialTimeoutRef.current) {
					clearTimeout(tutorialTimeoutRef.current);
					tutorialTimeoutRef.current = null;
				}
				// Hide tutorial if user navigates away
				setShowTutorial(false);
			};
		}, []),
	);

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
				const scrollDistance = DIMENSIONS.SCREEN_HEIGHT * 0.37; // Scroll 31% (61.75% / 2) to move inputs from 81.75% to 20%
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
				<Header isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					style={styles.scrollView}
					scrollEnabled={false}
				>
					{/* 30% - Title Section */}
					<View
						style={{
							height: DIMENSIONS.SCREEN_HEIGHT * 0.25,
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
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
					{/* 30% - Create Button Section */}
					<View
						style={{
							height: DIMENSIONS.SCREEN_HEIGHT * 0.3,
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Button
							title="Create ⟩"
							onPress={createButtonPressed}
							variant="welcome"
							textStyle={styles.buttonText}
						/>
					</View>
					{/* 30% - IP Inputs Section */}
					<View
						style={{
							height: DIMENSIONS.SCREEN_HEIGHT * 0.3,
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
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
		justifyContent: "flex-start",
		paddingBottom: DIMENSIONS.SCREEN_HEIGHT * 0.4, // Extra padding for scroll space
		paddingTop: DIMENSIONS.SCREEN_HEIGHT * 0.1, // 10% for toggle/info area
		minHeight: DIMENSIONS.SCREEN_HEIGHT, // Content fits in 100% screen height
	},
	scrollView: {
		flex: 1,
		width: "100%",
	},
	titleContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: DIMENSIONS.SCREEN_HEIGHT * 0.02,
		paddingHorizontal: DIMENSIONS.SCREEN_WIDTH * 0.02,
		paddingVertical: DIMENSIONS.SCREEN_HEIGHT * 0.02,
		minHeight: DIMENSIONS.SCREEN_HEIGHT * 0.15,
		width: "98%",
	},
	buttonText: {
		color: COLORS.WHITE,
		fontSize: DIMENSIONS.SCALE * 37,
		fontFamily: FONTS.SIGNATURE,
	},
});
