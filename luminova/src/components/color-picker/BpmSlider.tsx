import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { COLORS, COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";

interface BpmSliderProps {
	bpm: number;
	disabled: boolean;
	onValueChange: (value: number) => void;
}

export default function BpmSlider({
	bpm,
	disabled,
	onValueChange,
}: BpmSliderProps) {
	return (
		<View style={styles.sliderRow}>
			<Text style={COMMON_STYLES.sliderText}>Speed: {Math.round(bpm)} bpm</Text>
			<Slider
				style={[styles.slider, { opacity: disabled ? 0.5 : 1 }]}
				minimumValue={60}
				maximumValue={200}
				value={bpm}
				disabled={disabled}
				onValueChange={onValueChange}
				minimumTrackTintColor="#ff0000"
				maximumTrackTintColor={COLORS.WHITE}
				thumbTintColor={COLORS.WHITE}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	sliderRow: {
		marginVertical: 5 * DIMENSIONS.SCALE,
	},
	slider: {
		width: "100%",
		height: 30 * DIMENSIONS.SCALE,
	},
});