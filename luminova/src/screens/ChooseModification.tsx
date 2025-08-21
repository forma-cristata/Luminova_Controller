import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import AnimatedDots from "@/src/components/animations/AnimatedDots";
import Button from "@/src/components/buttons/Button";
import Header from "@/src/components/common/Header";
import { COLORS } from "@/src/styles/SharedStyles";
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
					onPress={() =>
						navigation.navigate("ColorEditor", {
							setting: setting,
							settingIndex: settingIndex,
						})
					}
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
					onPress={() =>
						navigation.navigate("FlashingPatternEditor", {
							setting: setting,
							settingIndex: settingIndex,
						})
					}
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
		paddingHorizontal: 20,
		paddingVertical: 60,
	},
	button: {
		marginVertical: 40,
		minWidth: 280,
		paddingHorizontal: 15,
		paddingVertical: 5,
	},
	animationContainer: {
		marginVertical: 100,
		transform: [{ scale: 2.2 }],
	},
});
