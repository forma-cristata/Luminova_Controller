import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import AnimatedDots from "@/src/components/animations/AnimatedDots";
import Button from "@/src/components/buttons/Button";
import Header from "@/src/components/common/Header";
import { COLORS, DIMENSIONS } from "@/src/styles/SharedStyles";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

type Props = NativeStackScreenProps<RootStackParamList, "ChooseModification">;

export default function ChooseModification({ navigation, route }: Props) {
	const setting = route.params?.setting;
	const settingIndex = route.params?.settingIndex;

	return (
		<SafeAreaView style={styles.container}>
			<Header />
			<View style={styles.content}>
				<Button
					title="Edit Colors"
					onPress={() => {
						// Create a deep copy to avoid Reanimated shareable object issues
						const settingCopy = JSON.parse(JSON.stringify(setting));
						navigation.navigate("ColorEditor", {
							setting: settingCopy,
							settingIndex: settingIndex,
						});
					}}
					variant="default"
					style={styles.button}
				/>
				<View style={styles.animationContainer}>
					<AnimatedDots
						navigation={navigation}
						setting={setting}
						layout="ring"
					/>
				</View>
				<Button
					title="Edit Flashing Pattern"
					onPress={() => {
						// Create a deep copy to avoid Reanimated shareable object issues
						const settingCopy = JSON.parse(JSON.stringify(setting));
						navigation.navigate("FlashingPatternEditor", {
							setting: settingCopy,
							settingIndex: settingIndex,
						});
					}}
					variant="default"
					style={styles.button}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BLACK,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20 * DIMENSIONS.SCALE,
		paddingVertical: 60 * DIMENSIONS.SCALE,
	},
	button: {
		marginVertical: 40 * DIMENSIONS.SCALE,
		minWidth: 280 * DIMENSIONS.SCALE,
		paddingHorizontal: 15 * DIMENSIONS.SCALE,
		paddingVertical: 5 * DIMENSIONS.SCALE,
	},
	animationContainer: {
		marginVertical: 100 * DIMENSIONS.SCALE,
		transform: [{ scale: 2.2 * DIMENSIONS.SCALE }],
	},
});