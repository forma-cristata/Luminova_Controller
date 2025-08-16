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

import AnimatedTitle from "@/src/components/ui/AnimatedTitle";
import Button from "@/src/components/ui/buttons/Button";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import WelcomeTutorial from "@/src/components/ui/WelcomeTutorial";
import { COLORS, FONTS } from "@/src/styles/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { FirstTimeUserService } from "@/src/services/FirstTimeUserService";
import IpAddressInput from "@/src/components/welcome/IpAddressInput";
import LedToggle from "@/src/components/welcome/LedToggle";
import React from "react";

export default function Welcome({ navigation }: any) {
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
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			scrollViewRef.current?.scrollTo({ y: 0, animated: true });
		});

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
					<TouchableOpacity
						style={styles.titleContainer}
						onPress={handleDebugTap}
						activeOpacity={1}
					>
						<AnimatedTitle text={displayText} fontSize={130} marginBottom="10%" />
					</TouchableOpacity>
					<Button
						title="Create ⟩"
						onPress={createButtonPressed}
						variant="welcome"
						textStyle={styles.buttonText}
					/>
					<IpAddressInput onIpSaved={handleIpSaved} />
					<View style={{ height: 250 }} />
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
		paddingBottom: 50,
		paddingTop: 120,
		minHeight: "100%",
	},
	scrollView: {
		flex: 1,
		width: "100%",
	},
	titleContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	buttonText: {
		color: COLORS.WHITE,
		fontSize: 40,
		fontFamily: FONTS.SIGNATURE,
	},
});