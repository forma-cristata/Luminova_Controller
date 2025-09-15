import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import ColorWheel from "./ColorWheel";
import BrightnessSlider from "./BrightnessSlider";
import { DIMENSIONS } from "@/src/styles/SharedStyles";

interface ColorWheelControlProps {
	hue: number; // 0-360
	saturation: number; // 0-100
	brightness: number; // 0-100
	disabled: boolean;
	onValueChange: (hue: number, saturation: number, brightness: number) => void;
	onSlidingComplete: (hue: number, saturation: number, brightness: number) => void;
}

export default React.memo(function ColorWheelControl({
	hue,
	saturation,
	brightness,
	disabled,
	onValueChange,
	onSlidingComplete,
}: ColorWheelControlProps) {
	const handleColorWheelChange = useCallback(
		(newHue: number, newSaturation: number) => {
			onValueChange(newHue, newSaturation, brightness);
		},
		[brightness, onValueChange],
	);

	const handleColorWheelComplete = useCallback(
		(newHue: number, newSaturation: number) => {
			onSlidingComplete(newHue, newSaturation, brightness);
		},
		[brightness, onSlidingComplete],
	);

	const handleBrightnessChange = useCallback(
		(newBrightness: number) => {
			onValueChange(hue, saturation, newBrightness);
		},
		[hue, saturation, onValueChange],
	);

	const handleBrightnessComplete = useCallback(
		(newBrightness: number) => {
			onSlidingComplete(hue, saturation, newBrightness);
		},
		[hue, saturation, onSlidingComplete],
	);

	return (
		<View style={styles.container}>
			{/* Color Wheel for Hue and Saturation */}
			<ColorWheel
				hue={hue}
				saturation={saturation}
				brightness={brightness}
				disabled={disabled}
				onColorChange={handleColorWheelChange}
				onColorChangeComplete={handleColorWheelComplete}
			/>

			{/* Brightness Slider */}
			<View style={styles.brightnessContainer}>
				<BrightnessSlider
					brightness={brightness}
					hue={hue}
					saturation={saturation}
					disabled={disabled}
					onValueChange={handleBrightnessChange}
					onSlidingComplete={handleBrightnessComplete}
				/>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignItems: "center",
	},
	brightnessContainer: {
		width: "100%",
		marginTop: 8 * DIMENSIONS.SCALE, // Reduced from 15
	},
});
