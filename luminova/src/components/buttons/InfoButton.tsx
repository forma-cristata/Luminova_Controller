import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { RootStackParamList } from "@/src/screens/index";
import { COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";

export default function InfoButton() {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const handlePress = () => {
		navigation.navigate("Info");
	};

	return (
		<TouchableOpacity
			style={[
				COMMON_STYLES.navButton,
				{
					right: DIMENSIONS.SCREEN_WIDTH * 0.05,
					top: Math.max(60, DIMENSIONS.SCREEN_HEIGHT * 0.05),
				},
				styles.glowEffect,
			]}
			onPress={handlePress}
			hitSlop={{
				top: DIMENSIONS.SCREEN_HEIGHT * 0.015,
				bottom: DIMENSIONS.SCREEN_HEIGHT * 0.015,
				left: DIMENSIONS.SCREEN_WIDTH * 0.025,
				right: DIMENSIONS.SCREEN_WIDTH * 0.025,
			}}
		>
			<Ionicons
				name="information-circle-outline"
				size={Math.min(78, DIMENSIONS.SCREEN_HEIGHT * 0.04)}
				color="white"
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	glowEffect: {
		shadowColor: "#ffffff",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: Math.max(6, DIMENSIONS.SCREEN_HEIGHT * 0.01),
		elevation: 8, // For Android
	},
});
