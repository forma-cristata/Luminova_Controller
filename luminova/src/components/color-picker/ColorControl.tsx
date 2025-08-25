import React, { useCallback, useMemo } from "react";
import { Platform, Keyboard } from "react-native";
import HsvSlider from "./HsvSlider";
import PlusMinusControl from "./PlusMinusControl";

interface ColorControlProps {
	type: "hue" | "saturation" | "brightness";
	value: number;
	disabled: boolean;
	onValueChange: (value: number) => void;
	onSlidingComplete: (value: number) => void;
}

export default function ColorControl({
	type,
	value,
	disabled,
	onValueChange,
	onSlidingComplete,
}: ColorControlProps) {
	const getStep = useMemo(() => {
		switch (type) {
			case "hue":
				return 10; // 10 degree steps for hue
			case "saturation":
			case "brightness":
				return 5; // 5% steps for saturation and brightness
			default:
				return 1;
		}
	}, [type]);

	const getMinMax = useMemo(() => {
		switch (type) {
			case "hue":
				return { min: 0, max: 360 };
			case "saturation":
			case "brightness":
				return { min: 0, max: 100 };
			default:
				return { min: 0, max: 100 };
		}
	}, [type]);

	const handleMinus = useCallback(() => {
		if (disabled) return;
		const step = getStep;
		const { min } = getMinMax;
		const newValue = Math.max(min, value - step);
		onValueChange(newValue);
		onSlidingComplete(newValue);
	}, [disabled, value, onValueChange, onSlidingComplete, getStep, getMinMax]);

	const handlePlus = useCallback(() => {
		if (disabled) return;
		const step = getStep;
		const { max } = getMinMax;
		const newValue = Math.min(max, value + step);
		onValueChange(newValue);
		onSlidingComplete(newValue);
	}, [disabled, value, onValueChange, onSlidingComplete, getStep, getMinMax]);

	const handleSliderValueChange = useCallback(
		(newValue: number) => {
			if (disabled) return;
			try {
				Keyboard.dismiss();
			} catch {
				// Keyboard was not visible or other error
			}
			onValueChange(newValue);
		},
		[disabled, onValueChange],
	);

	const handleSliderComplete = useCallback(
		(newValue: number) => {
			if (disabled) return;
			onSlidingComplete(newValue);
		},
		[disabled, onSlidingComplete],
	);

	if (Platform.OS === "android") {
		return (
			<PlusMinusControl
				type={type}
				value={value}
				disabled={disabled}
				onMinus={handleMinus}
				onPlus={handlePlus}
			/>
		);
	}

	return (
		<HsvSlider
			type={type}
			value={value}
			disabled={disabled}
			onValueChange={handleSliderValueChange}
			onSlidingComplete={handleSliderComplete}
		/>
	);
}
