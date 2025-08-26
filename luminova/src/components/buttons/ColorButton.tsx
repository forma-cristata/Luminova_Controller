import React from "react";
import {
	Text,
	TouchableOpacity,
	type ViewStyle,
	type TextStyle,
} from "react-native";
import { COLORS } from "@/src/styles/SharedStyles";

interface ColorButtonProps {
	color: "white" | "black";
	onPress: () => void;
	disabled?: boolean;
	style?: ViewStyle;
	textStyle?: TextStyle;
	scale?: number;
}

/**
 * Reusable color button component for the White/Black color selection buttons
 * used in ColorEditor
 */
const ColorButton = React.memo(
	({
		color,
		onPress,
		disabled = false,
		style,
		textStyle,
		scale = 1,
	}: ColorButtonProps) => {
		const buttonStyle = {
			width: 40 * scale,
			height: 40 * scale,
			borderRadius: 15 * scale,
			justifyContent: "center" as const,
			alignItems: "center" as const,
			marginLeft: 10 * scale,
			backgroundColor: color === "white" ? COLORS.WHITE : COLORS.BLACK,
			...(color === "black" && {
				borderColor: COLORS.WHITE,
				borderWidth: 1,
			}),
		};

		const defaultTextStyle = {
			color: COLORS.PLACEHOLDER,
			fontSize: 14 * scale,
			fontWeight: "bold" as const,
		};

		return (
			<TouchableOpacity
				style={[buttonStyle, style]}
				disabled={disabled}
				onPress={onPress}
			>
				<Text style={[defaultTextStyle, textStyle]}>
					{color === "white" ? "W" : "B"}
				</Text>
			</TouchableOpacity>
		);
	},
);
ColorButton.displayName = "ColorButton";

export default ColorButton;
