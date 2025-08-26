import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import HueSliderBackground from "./HueSliderBackground";
import { COLORS, COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";

interface HsvSliderProps {
	type: "hue" | "saturation" | "brightness";
	value: number;
	disabled: boolean;
	onValueChange: (value: number) => void;
	onSlidingComplete: (value: number) => void;
}

export default function HsvSlider({
	type,
	value,
	disabled,
	onValueChange,
	onSlidingComplete,
}: HsvSliderProps) {
	const getSliderConfig = () => {
		switch (type) {
			case "hue":
				return {
					label: `Hue: ${Math.round(value)}°`,
					min: 0,
					max: 360,
					minimumTrackTintColor: "#ff0000",
					maximumTrackTintColor: COLORS.WHITE,
					showBackground: true,
				};
			case "saturation":
				return {
					label: `Saturation: ${Math.round(value)}%`,
					min: 0,
					max: 100,
					minimumTrackTintColor: COLORS.WHITE,
					maximumTrackTintColor: "#333333",
					showBackground: false,
				};
			case "brightness":
				return {
					label: `Brightness: ${Math.round(value)}%`,
					min: 0,
					max: 100,
					minimumTrackTintColor: COLORS.WHITE,
					maximumTrackTintColor: "#333333",
					showBackground: false,
				};
			default:
				return {
					label: "",
					min: 0,
					max: 100,
					minimumTrackTintColor: COLORS.WHITE,
					maximumTrackTintColor: "#333333",
					showBackground: false,
				};
		}
	};

	const config = getSliderConfig();

	return (
		<View style={styles.sliderRow}>
			<Text style={COMMON_STYLES.sliderText}>{config.label}</Text>
			{config.showBackground ? (
				<View style={styles.sliderWrapper}>
					<HueSliderBackground />
					<Slider
						style={[styles.slider, { opacity: disabled ? 0.5 : 1 }]}
						minimumValue={config.min}
						maximumValue={config.max}
						value={value}
						disabled={disabled}
						onValueChange={onValueChange}
						onSlidingComplete={onSlidingComplete}
						minimumTrackTintColor={config.minimumTrackTintColor}
						maximumTrackTintColor={config.maximumTrackTintColor}
						thumbTintColor={COLORS.WHITE}
					/>
				</View>
			) : (
				<Slider
					style={[styles.slider, { opacity: disabled ? 0.5 : 1 }]}
					minimumValue={config.min}
					maximumValue={config.max}
					value={value}
					disabled={disabled}
					onValueChange={onValueChange}
					onSlidingComplete={onSlidingComplete}
					minimumTrackTintColor={config.minimumTrackTintColor}
					maximumTrackTintColor={config.maximumTrackTintColor}
					thumbTintColor={COLORS.WHITE}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	sliderRow: {
		marginVertical: 3 * DIMENSIONS.SCALE,
	},
	slider: {
		width: "100%",
		height: 50 * DIMENSIONS.SCALE,
	},
	sliderWrapper: {
		position: "relative",
		width: "100%",
		height: 40 * DIMENSIONS.SCALE,
		justifyContent: "center",
	},
});