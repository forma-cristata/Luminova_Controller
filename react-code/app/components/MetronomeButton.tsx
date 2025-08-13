import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "./SharedStyles";

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

export default function MetronomeButton({ onPress }: { onPress: () => void }) {
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Ionicons name="timer-outline" size={32} color={COLORS.WHITE} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 20 * scale,
		width: 60 * scale,
		height: 60 * scale,
	},
});
