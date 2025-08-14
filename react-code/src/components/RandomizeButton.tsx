import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "./SharedStyles";

interface RandomizeButtonProps {
	onPress: () => void;
	scale?: number;
}

const RandomizeButton = ({
	onPress,
	scale = Math.min(width, height) / 375,
}: RandomizeButtonProps) => {
	return (
		<TouchableOpacity style={styles(scale).shuffleButton} onPress={onPress}>
			<Text style={styles(scale).shuffleIcon}>⟳</Text>
		</TouchableOpacity>
	);
};

const { width, height } = Dimensions.get("window");

const styles = (scale: number) =>
	StyleSheet.create({
		shuffleButton: {
			justifyContent: "center",
			alignItems: "center",
			marginRight: 20 * scale,
			width: 60 * scale,
			height: 60 * scale,
		},
		shuffleIcon: {
			color: COLORS.WHITE,
			fontSize: 35 * scale,
			fontWeight: "ultralight",
			textAlign: "center",
		},
	});

export default RandomizeButton;
