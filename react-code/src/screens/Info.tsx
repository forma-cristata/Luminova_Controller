import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
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

import AnimatedTitle from "@/src/components/AnimatedTitle";
import BackButton from "@/src/components/BackButton";
import { FONTS } from "@/src/components/SharedStyles";
import React from "react";

export default function Info() {
	const [_textColor, setTextColor] = useState("#ffffff");
	useEffect(() => {
		const animationColors = [
			"#ff0000",
			"#000000",
			"#ff4400",
			"#000000",
			"#ff6a00",
			"#000000",
			"#ff9100",
			"#000000",
			"#ffee00",
			"#000000",
			"#00ff1e",
			"#000000",
			"#00ff44",
			"#000000",
			"#00ff95",
			"#000000",
			"#00ffff",
			"#000000",
			"#0088ff",
			"#000000",
			"#0000ff",
			"#000000",
			"#8800ff",
			"#000000",
			"#d300ff",
			"#000000",
			"#ff00BB",
			"#000000",
			"#ff0088",
			"#000000",
			"#ff0031",
			"#000000",
		];
		let colorIndex = 0;

		const colorInterval = setInterval(() => {
			setTextColor(animationColors[colorIndex]);
			colorIndex = (colorIndex + 1) % animationColors.length;
		}, 10);

		return () => {
			clearInterval(colorInterval);
		};
	}, []);

	const sendFeedback = () => {
		const phoneNumber = "720-665-3101";
		const message = "Feedback for Pixel Controller: ";

		let url = "";
		if (Platform.OS === "ios") {
			url = `sms:${phoneNumber}&body=${encodeURIComponent(message)}`;
		} else {
			url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
		}

		Linking.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					return Linking.openURL(url);
				} else {
					Alert.alert("Error", "SMS messaging is not supported on this device");
				}
			})
			.catch((error) => {
				console.error("Error opening SMS app:", error);
			});
	};

	const showFeedbackAlert = () => {
		Alert.alert(
			"Send Feedback",
			"Would you like to send feedback via text message?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Send Feedback",
					onPress: sendFeedback,
				},
			],
			{ cancelable: true },
		);
	};

	const sections = [
		{
			title: "Home Screen",
			data: [
				"Wait for the power toggle to synchronize with your device's state - the toggle will then control turning your device on and off.",
				"Access your saved settings and customization options by tapping the 'Create' button.",
			],
		},
		{
			title: "Settings Screen",
			data: [
				"Navigate settings by swiping left or right on the bottom menu.",
				"The selected setting displays in the center of the screen.",
				"Create a new setting by tapping the plus sign (+) at the carousel's end.",
				"Duplicate settings using the copy icon for easy editing.",
				"Remove custom settings using the trash icon.",
				"Broadcast settings to your device by tapping 'Flash'.",
				"Access settings editor by tapping 'Edit'.",
			],
		},
		{
			title: "Color Modification",
			data: [
				"Select a color by tapping it - selected colors appear larger.",
				"Use HSB sliders to adjust Hue, Saturation, and Brightness values.",
				"Enter hex codes manually - values update with slider changes.",
				"Reverse dot order by swiping left or right.",
				"Copy colors between rows by swiping vertically.",
				"Randomize colors using the shuffle button.",
				"Organize colors by hue with the sort button.",
				"Return to original settings using 'Reset'.",
				"Preserve changes by tapping 'Save'.",
				"Preview changes temporarily using 'Preview'.",
			],
		},
		{
			title: "Flashing Pattern Modification",
			data: [
				"Select patterns using the pattern picker.",
				"Match music tempo using the BPM slider.",
				"Return to original settings using 'Reset'.",
				"Save changes by tapping 'Save'.",
				"Preview changes temporarily using 'Preview'.",
			],
		},
		{
			title: "Tips & Tricks",
			data: [
				"Default settings can be modified but not deleted.",
				"Using black can create distinct setting variations.",
			],
		},
	];

	return (
		<SafeAreaView style={styles.container}>
				<BackButton />
				<TouchableOpacity
					style={styles.feedbackButton}
					onPress={showFeedbackAlert}
				>
					<Ionicons name="chatbubble-outline" size={24} color="white" />
					<Text style={styles.feedbackText}>Feedback</Text>
				</TouchableOpacity>{" "}
				<AnimatedTitle
					text="How to Use This App"
					fontSize={50}
					marginBottom={15}
					marginTop={50}
				/>
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
					keyExtractor={(item, index) => index.toString() + item.toString()}
					SectionSeparatorComponent={() => (
						<View style={styles.sectionSeparator} />			)}
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
		backgroundColor: "#000000",
		padding: 20,
	},
	title: {
		color: "white",
		fontFamily: "Thesignature",
		fontSize: 50,
		textAlign: "center",
		marginBottom: 15,
		marginTop: 50,
	},
	scrollView: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 15,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	section: {
		marginBottom: 20,
		paddingHorizontal: 15,
	},
	sectionHeaderWrapper: {
		position: "relative",
	},
	sectionTitleContainer: {
		backgroundColor: "#000000",
		paddingBottom: 20,
		zIndex: 2,
		elevation: 2,
	},
	sectionTitle: {
		color: "white",
		fontFamily: FONTS.CLEAR,
		fontSize: 36,
		borderBottomWidth: 1,
		borderBottomColor: "#333",
		paddingBottom: 5,
		paddingHorizontal: 15,
	},
	fadeGradient: {
		position: "absolute",
		bottom: -40,
		left: 0,
		right: 0,
		height: 40,
		zIndex: 1,
	},
	sectionSeparator: {
		height: 20,
	},
	bulletPoint: {
		flexDirection: "row",
		marginBottom: 10,
		paddingLeft: 10,
		paddingTop: 10,
	},
	bulletDot: {
		color: "white",
		fontSize: 18,
		marginRight: 10,
	},
	bulletText: {
		color: "white",
		fontFamily: FONTS.CLEAR,
		fontSize: 26,
		flex: 1,
	},
	feedbackButton: {
		position: "absolute",
		top: 60,
		right: 20,
		zIndex: 10,
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
	},
	feedbackText: {
		color: "white",
		fontFamily: FONTS.CLEAR,
		fontSize: 16,
		marginLeft: 5,
	},
	spacer: {
		height: 10,
	},
});
