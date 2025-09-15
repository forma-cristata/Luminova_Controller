import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, type ViewStyle, StyleSheet } from "react-native";
import { DIMENSIONS } from "@/src/styles/SharedStyles";

interface AddButtonProps {
	onPress?: () => void;
	style?: ViewStyle;
}

export default function AddButton({ onPress, style }: AddButtonProps) {
	const iconSize = DIMENSIONS.SCREEN_HEIGHT * 0.04;

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			onPress={onPress}
			hitSlop={{
				top: DIMENSIONS.SCREEN_HEIGHT * 0.015,
				bottom: DIMENSIONS.SCREEN_HEIGHT * 0.015,
				left: DIMENSIONS.SCREEN_WIDTH * 0.025,
				right: DIMENSIONS.SCREEN_WIDTH * 0.025,
			}}
		>
			<Ionicons name="add-circle-outline" size={iconSize} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});
