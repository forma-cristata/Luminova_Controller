import {
	Dimensions,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import AnimatedDots from "@/src/components/AnimatedDots";
import BackButton from "@/src/components/buttons/BackButton";
import ColorDots from "@/src/components/ColorDots";
import InfoButton from "@/src/components/buttons/InfoButton";
import React from "react";

export default function ChooseModification({ navigation, route }: any) {
	const setting = route.params!.setting;
	const settingIndex = route.params!.settingIndex;
	const modeDots = () => {
		return <AnimatedDots navigation={navigation} setting={setting} />;
	};

	return (
		<SafeAreaView style={styles.container}>
			<InfoButton />
			<BackButton onPress={() => navigation.goBack()} />
			<View style={styles.notBackButton}>
				<View style={styles.modeSection}>
					<Text style={styles.whiteText}>Flashing Pattern</Text>
					<View style={styles.dotContainer}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("FlashingPatternEditor", {
									setting: setting,
									settingIndex: settingIndex,
								})
							}
						>
							{modeDots()}
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.colorSection}>
					<View style={styles.dotContainer}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("ColorEditor", {
									setting: setting,
									settingIndex: settingIndex,
								})
							}
						>
							<ColorDots colors={setting.colors} />
						</TouchableOpacity>
					</View>
					<Text style={styles.whiteTextColor}>Colors</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	dotContainer: {
		transformOrigin: "left center",
		transform: "rotate(90deg) scale(1.7)",
		marginTop: "5%",
		marginLeft: "50%",
	},
	whiteText: {
		color: "white",
		fontFamily: "Thesignature",
		fontSize: 29,
		textAlign: "right",
		borderStyle: "solid",
		borderRightWidth: 2,
		borderBottomWidth: 2,
		borderColor: "white",
		width: "70%",
	},
	whiteTextColor: {
		color: "white",
		fontFamily: "Thesignature",
		fontSize: 29,
		marginTop: "290%",
		textAlign: "left",
		borderStyle: "solid",
		borderLeftWidth: 2,
		borderTopWidth: 2,
		borderColor: "white",
		width: "70%",
		paddingLeft: 5,
		alignSelf: "flex-end",
	},
	modeSection: {
		height: Dimensions.get("window").height * 0.86,
		width: Dimensions.get("window").width * 0.5,
	},
	colorSection: {
		height: Dimensions.get("window").height * 0.88,
		width: Dimensions.get("window").width * 0.5,
	},
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	notBackButton: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: "30%",
	},
	title: {
		marginTop: 50,
	},
	text: {
		color: "white",
		fontSize: 30,
	},
});
