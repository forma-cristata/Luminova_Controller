import React, { useCallback, useMemo } from "react";
import { Platform, Keyboard } from "react-native";
import HsvSlider from "./HsvSlider";
import PlusMinusControl from "./PlusMinusControl";

interface BrightnessSliderProps {
	brightness: number; // 0-100
	hue: number; // For preview gradient
	saturation: number; // For preview gradient
	disabled: boolean;
	onValueChange: (brightness: number) => void;
	onSlidingComplete: (brightness: number) => void;
}

export default function BrightnessSlider({
	brightness,
	hue: _hue, // For future gradient implementation
	saturation: _saturation, // For future gradient implementation
	disabled,
	onValueChange,
	onSlidingComplete,
}: BrightnessSliderProps) {
	const getStep = useMemo(() => 5, []); // 5% steps for brightness

	const getMinMax = useMemo(() => ({ min: 0, max: 100 }), []);

	const handleMinus = useCallback(() => {
		if (disabled) return;
		const step = getStep;
		const { min } = getMinMax;
		const newValue = Math.max(min, brightness - step);
		onValueChange(newValue);
		onSlidingComplete(newValue);
	}, [
		disabled,
		brightness,
		onValueChange,
		onSlidingComplete,
		getStep,
		getMinMax,
	]);

	const handlePlus = useCallback(() => {
		if (disabled) return;
		const step = getStep;
		const { max } = getMinMax;
		const newValue = Math.min(max, brightness + step);
		onValueChange(newValue);
		onSlidingComplete(newValue);
	}, [
		disabled,
		brightness,
		onValueChange,
		onSlidingComplete,
		getStep,
		getMinMax,
	]);

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
				type="brightness"
				value={brightness}
				disabled={disabled}
				onMinus={handleMinus}
				onPlus={handlePlus}
			/>
		);
	}

	return (
		<HsvSlider
			type="brightness"
			value={brightness}
			disabled={disabled}
			onValueChange={handleSliderValueChange}
			onSlidingComplete={handleSliderComplete}
		/>
	);
}
