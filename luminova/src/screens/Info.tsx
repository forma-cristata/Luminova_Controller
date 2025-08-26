import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
	Alert,
	Linking,
	Platform,
	SafeAreaView,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import AnimatedTitle from "@/src/components/common/AnimatedTitle";
import Header from "@/src/components/common/Header";
import { FONTS, COLORS, DIMENSIONS } from "@/src/styles/SharedStyles";
import { FirstTimeUserService } from "@/src/services/FirstTimeUserService";
import React from "react";

export default function Info() {
	const [debugTapCount, setDebugTapCount] = useState(0);

	const sendFeedback = () => {
		// App Store URLs for leaving reviews
		const appStoreUrl =
			Platform.OS === "ios"
				? "itms-apps://itunes.apple.com/app/viewContentsUserReviews?id=YOUR_APP_ID" // Replace YOUR_APP_ID with actual App Store ID when published
				: "market://details?id=com.formacristata.luminovacontroller";

		Linking.canOpenURL(appStoreUrl)
			.then((supported) => {
				if (supported) {
					return Linking.openURL(appStoreUrl);
				} else {
					// Fallback to web URLs if native apps aren't available
					const webUrl =
						Platform.OS === "ios"
							? "https://apps.apple.com/app/YOUR_APP_ID" // Replace YOUR_APP_ID with actual App Store ID when published
							: "https://play.google.com/store/apps/details?id=com.formacristata.luminovacontroller";
					return Linking.openURL(webUrl);
				}
			})
			.catch((error) => {
				console.error("Error opening App Store:", error);
				Alert.alert(
					"Error",
					"Unable to open App Store. Please search for 'Luminova Controller' to leave a review.",
				);
			});
	};

	const showFeedbackAlert = () => {
		Alert.alert(
			"Leave a Review",
			`Help us improve by leaving a review on the ${Platform.OS === "ios" ? "App Store" : "Google Play Store"}!`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Review App",
					onPress: sendFeedback,
				},
			],
		);
	};

	const handleDebugTap = () => {
		const newCount = debugTapCount + 1;
		setDebugTapCount(newCount);

		if (newCount >= 5) {
			// Reset the count and show debug options
			setDebugTapCount(0);
			Alert.alert("Debug Mode", "Reset tutorial for new users?", [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Reset Tutorial",
					onPress: async () => {
						await FirstTimeUserService.resetFirstTimeUser();
						Alert.alert(
							"Success",
							"Tutorial state has been reset. The welcome tutorial will show again on the next app visit to the Welcome screen.",
						);
					},
				},
			]);
		}
	};

	const sections = [
		{
			title: "Welcome Screen",
			data: [
				"New users will see a helpful tutorial - you can skip it or follow along.",
				"Re-access the welcome tutorial by tapping 'Hello' 5 times on the Welcome screen.",
				"Enter your device's IP address in the text field if it differs from the default.",
				"Wait for the LED status toggle to synchronize with your device's state.",
				"Use the toggle to control turning your device on and off.",
				"Access your saved settings by tapping 'Create Settings'.",
			],
		},
		{
			title: "Settings Screen",
			data: [
				"Navigate settings by swiping left or right, or using the chevron arrows to switch between your saved settings.",
				"The focused setting displays above your saved settings carousel. This can be tapped anywhere to edit that setting.",
				"Create new settings by tapping the plus button at the end of the carousel.",
				"Duplicate existing settings using the copy icon. From here, you can edit them further.",
				"Delete custom settings using the trash icon",
				"Default settings can be modified but not deleted. This behavior will be improved in the future. Feel free to edit them in the meantime.",
				"Send settings to your device by tapping 'Flash' on carousel items.",
				"The app automatically disables Flash/Preview when your device is not connected.",
			],
		},
		{
			title: "Choose Modification",
			data: [
				"Select 'Edit Colors' to modify the 16-dot color grid.",
				"Choose 'Edit Flashing Pattern' to change animations and timing.",
				"Preview your setting with the animated dots display in the center or using the preview buttons in the editor pages.",
			],
		},
		{
			title: "Color Editor",
			data: [
				"Tap any dot to select it. The dot being edited will appear larger and focused.",
				"Use the HSB ( Hue, Saturation, Brightness ) sliders to adjust the respective values.",
				"Enter hex codes by tapping the hex field. This will open a custom hex keyboard where you gain full control over every dot's color.",
				"Quickly set monochrome colors using the 'White' and 'Black' preset buttons while a dot is selected.",
				"Black dots create interesting contrast and spacing in your designs.",
				"Reverse dot order in independent rows by swiping left or right across the respective 8-point dot grid.",
				"Copy colors from one row to another by swiping up or down from one row to another.",
				"Randomize colors using the button to the left of the setting's name.",
				"Sort colors by hue using the sort button to the right of the setting's name.",
				"Edit the setting name using the text input at the top of the page.",
				"Return to original values using 'Reset' (available in both editors).",
				"Save changes permanently using 'Save' (available in both editors).",
				"Preview changes temporarily using 'Preview'. This will send the customized setting to your device without saving. The original setting will be restored when you back out or save.",
				"Tap outside text inputs to dismiss the keyboard on any screen.",
			],
		},
		{
			title: "Flashing Pattern Editor",
			data: [
				"Select animation patterns by tapping them in the scrollable pattern picker.",
				"Adjust speed using the BPM slider to match music tempo.",
				"Use the metronome button to measure live audio BPM. This component requires four clear beats to register and uses volume changes to detect beats, so it works best with music that has distinct percussion. Unfortunately, it cannot measure music playing from the same device running the app, but this feature will be implemented in the future as soon as I figure it out 😉. A word of advice says to slap your thigh four or five times if you want something very specific.",
				"Edit the setting name using the text input at the top of this page.",
			],
		},
	];

	return (
		<SafeAreaView style={styles.container}>
			<Header />
			<AnimatedTitle
				text="How to Use This App"
				fontSize={45 * DIMENSIONS.SCALE}
				marginBottom={15 * DIMENSIONS.SCALE}
				marginTop={50 * DIMENSIONS.SCALE}
			/>
			<View style={styles.feedbackContainer}>
				<TouchableOpacity
					style={styles.debugTouchArea}
					onPress={handleDebugTap}
					activeOpacity={0.8}
				>
					<Text style={styles.supportText}>
						We love you! Please help us improve by leaving a review!
					</Text>
					<TouchableOpacity
						style={styles.feedbackButton}
						onPress={showFeedbackAlert}
					>
						<Ionicons name="chatbubble-outline" size={24} color="white" />
						<Text style={styles.feedbackText}>Review App</Text>
					</TouchableOpacity>
				</TouchableOpacity>
			</View>
			<SectionList
				sections={sections}
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				stickySectionHeadersEnabled={true}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.sectionHeaderWrapper}>
						<View style={styles.sectionTitleContainer}>
							<Text style={styles.sectionTitle}>{title}</Text>
						</View>
						<LinearGradient
							colors={["#000000", "transparent"]}
							style={styles.fadeGradient}
						/>
					</View>
				)}
				renderItem={({ item }) => <BulletPoint text={item} />}
				keyExtractor={(item) => item}
				SectionSeparatorComponent={() => (
					<View style={styles.sectionSeparator} />
				)}
			/>
		</SafeAreaView>
	);
}

const BulletPoint = ({ text }: { text: string }) => (
	<View style={styles.bulletPoint}>
		<Text style={styles.bulletDot}>•</Text>
		<Text style={styles.bulletText}>{text}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BLACK,
		padding: 20 * DIMENSIONS.SCALE,
	},
	scrollView: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 15 * DIMENSIONS.SCALE,
	},
	scrollContent: {
		paddingBottom: 40 * DIMENSIONS.SCALE,
	},
	sectionHeaderWrapper: {
		position: "relative",
	},
	sectionTitleContainer: {
		backgroundColor: COLORS.BLACK,
		paddingBottom: 20 * DIMENSIONS.SCALE,
		zIndex: 2,
		elevation: 2,
	},
	sectionTitle: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 36 * DIMENSIONS.SCALE,
		borderBottomWidth: 1 * DIMENSIONS.SCALE,
		borderBottomColor: "#333",
		paddingBottom: 5 * DIMENSIONS.SCALE,
		paddingHorizontal: 15 * DIMENSIONS.SCALE,
	},
	fadeGradient: {
		position: "absolute",
		bottom: -40 * DIMENSIONS.SCALE,
		left: 0,
		right: 0,
		height: 40 * DIMENSIONS.SCALE,
		zIndex: 1,
	},
	sectionSeparator: {
		height: 20 * DIMENSIONS.SCALE,
	},
	bulletPoint: {
		flexDirection: "row",
		marginBottom: 10 * DIMENSIONS.SCALE,
		paddingLeft: 10 * DIMENSIONS.SCALE,
		paddingTop: 10 * DIMENSIONS.SCALE,
	},
	bulletDot: {
		color: COLORS.WHITE,
		fontSize: 18 * DIMENSIONS.SCALE,
		marginRight: 10 * DIMENSIONS.SCALE,
	},
	bulletText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 26 * DIMENSIONS.SCALE,
		flex: 1,
	},
	feedbackButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8 * DIMENSIONS.SCALE,
	},
	feedbackText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 16 * DIMENSIONS.SCALE,
		marginLeft: 5 * DIMENSIONS.SCALE,
	},
	feedbackContainer: {
		alignItems: "center",
		marginBottom: 20 * DIMENSIONS.SCALE,
	},
	debugTouchArea: {
		alignItems: "center",
		padding: 10 * DIMENSIONS.SCALE,
	},
	supportText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 18 * DIMENSIONS.SCALE,
		textAlign: "center",
		marginBottom: 10 * DIMENSIONS.SCALE,
	},
});
