import React, { useCallback } from "react";
import { Platform, View, Text, TextInput, StyleSheet } from "react-native";
import BpmSlider from "./BpmSlider";
import BpmPlusMinusControl from "./BpmPlusMinusControl";
import {
	COLORS,
	COMMON_STYLES,
	FONTS,
	DIMENSIONS,
} from "@/src/styles/SharedStyles";

interface BpmControlProps {
	bpm: number;
	bpmInput: string;
	disabled: boolean;
	onBpmChange: (value: number) => void;
	onBpmInputChange: (text: string) => void;
	onBpmInputBlur: () => void;
}

export default function BpmControl({
	bpm,
	bpmInput,
	disabled,
	onBpmChange,
	onBpmInputChange,
	onBpmInputBlur,
}: BpmControlProps) {
	const adjustBPM = useCallback(
		(increment: boolean) => {
			const step = 5; // 5 BPM steps
			const newValue = increment
				? Math.min(200, bpm + step)
				: Math.max(60, bpm - step);
			onBpmChange(newValue);
		},
		[bpm, onBpmChange],
	);

	const handleMinus = useCallback(() => adjustBPM(false), [adjustBPM]);
	const handlePlus = useCallback(() => adjustBPM(true), [adjustBPM]);

	if (Platform.OS === "android") {
		return (
			<BpmPlusMinusControl
				bpm={bpm}
				disabled={disabled}
				onMinus={handleMinus}
				onPlus={handlePlus}
			/>
		);
	}

	return (
		<View style={styles.iosContainer}>
			<View style={styles.bpmRow}>
				<Text style={[COMMON_STYLES.sliderText, styles.bpmLabel]}>Speed:</Text>
				<TextInput
					style={[styles.bpmInput, { opacity: disabled ? 0.5 : 1 }]}
					value={bpmInput}
					onChangeText={(text) => {
						// Allow only numbers and decimal point
						const numericText = text.replace(/[^0-9.]/g, "");
						onBpmInputChange(numericText);
					}}
					placeholder="BPM"
					placeholderTextColor={COLORS.PLACEHOLDER}
					keyboardType="numeric"
					maxLength={4}
					clearButtonMode="while-editing"
					onBlur={onBpmInputBlur}
					keyboardAppearance="dark"
					editable={!disabled}
				/>
				<Text style={COMMON_STYLES.sliderText}>bpm</Text>
			</View>
			<BpmSlider bpm={bpm} disabled={disabled} onValueChange={onBpmChange} />
		</View>
	);
}

const styles = StyleSheet.create({
	iosContainer: {
		marginVertical: 5 * DIMENSIONS.SCALE,
	},
	bpmRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginBottom: 10 * DIMENSIONS.SCALE,
	},
	bpmLabel: {
		marginRight: 10 * DIMENSIONS.SCALE,
	},
	bpmInput: {
		color: COLORS.WHITE,
		fontSize: 22 * DIMENSIONS.SCALE,
		fontFamily: FONTS.CLEAR,
		textAlign: "center",
		borderBottomWidth: 1 * DIMENSIONS.SCALE,
		borderBottomColor: COLORS.WHITE,
		paddingHorizontal: 10 * DIMENSIONS.SCALE,
		paddingVertical: 5 * DIMENSIONS.SCALE,
		marginHorizontal: 10 * DIMENSIONS.SCALE,
		minWidth: 80 * DIMENSIONS.SCALE,
		letterSpacing: 2 * DIMENSIONS.SCALE,
	},
});
