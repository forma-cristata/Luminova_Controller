import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";

interface BpmPlusMinusControlProps {
	bpm: number;
	disabled: boolean;
	onMinus: () => void;
	onPlus: () => void;
}

export default function BpmPlusMinusControl({
	bpm,
	disabled,
	onMinus,
	onPlus,
}: BpmPlusMinusControlProps) {
	return (
		<View style={styles.androidSliderRow}>
			<Text style={COMMON_STYLES.sliderText}>Speed</Text>
			<View style={styles.plusMinusContainer}>
				<TouchableOpacity
					style={[
						COMMON_STYLES.utilityButton,
						styles.plusMinusButton,
						{ opacity: disabled ? COLORS.DISABLED_OPACITY : 1 },
					]}
					onPress={onMinus}
					disabled={disabled}
				>
					<Text style={[COMMON_STYLES.buttonText, styles.plusMinusText]}>
						−
					</Text>
				</TouchableOpacity>
				<View style={styles.valueDisplay}>
					<Text
						style={[
							COMMON_STYLES.sliderText,
							{ fontSize: 18 * DIMENSIONS.SCALE },
						]}
					>
						{Math.round(bpm)} bpm
					</Text>
				</View>
				<TouchableOpacity
					style={[
						COMMON_STYLES.utilityButton,
						styles.plusMinusButton,
						{ opacity: disabled ? COLORS.DISABLED_OPACITY : 1 },
					]}
					onPress={onPlus}
					disabled={disabled}
				>
					<Text style={[COMMON_STYLES.buttonText, styles.plusMinusText]}>
						+
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	// Android-specific slider row with more spacing
	androidSliderRow: {
		marginVertical: 8 * DIMENSIONS.SCALE,
		minHeight: 50 * DIMENSIONS.SCALE,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	// Android plus/minus control styles
	plusMinusContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		flex: 1,
		marginLeft: 20 * DIMENSIONS.SCALE,
		minHeight: 50 * DIMENSIONS.SCALE,
	},
	plusMinusButton: {
		width: 50 * DIMENSIONS.SCALE,
		height: 50 * DIMENSIONS.SCALE,
		borderRadius: 25 * DIMENSIONS.SCALE,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 8 * DIMENSIONS.SCALE,
		borderWidth: 1 * DIMENSIONS.SCALE,
		borderColor: COLORS.WHITE,
	},
	plusMinusText: {
		fontSize: 28 * DIMENSIONS.SCALE,
		fontWeight: "bold",
		textAlign: "center",
		lineHeight: 30 * DIMENSIONS.SCALE,
	},
	valueDisplay: {
		minWidth: 80 * DIMENSIONS.SCALE,
		paddingHorizontal: 15 * DIMENSIONS.SCALE,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 40 * DIMENSIONS.SCALE,
	},
});