import React from "react";
import { Text, TouchableOpacity, type ViewStyle, type TextStyle } from "react-native";
import { COLORS, FONTS } from "../SharedStyles";

interface CreateButtonProps {
	onPress: () => void;
	style?: ViewStyle;
	textStyle?: TextStyle;
	symbol?: string;
}

/**
 * Specialized create button for adding new settings.
 * Uses a unique large "+" design with custom styling.
 */
const CreateButton = React.memo(
	({ onPress, style, textStyle, symbol = "+" }: CreateButtonProps) => {
		const defaultStyle: ViewStyle = {
			width: "80%",
			height: "40%",
			justifyContent: "center",
			alignItems: "center",
		};

		const defaultTextStyle: TextStyle = {
			color: COLORS.WHITE,
			fontSize: 100,
			fontFamily: FONTS.CLEAR,
		};

		return (
			<TouchableOpacity style={[defaultStyle, style]} onPress={onPress}>
				<Text style={[defaultTextStyle, textStyle]}>{symbol}</Text>
			</TouchableOpacity>
		);
	},
);

CreateButton.displayName = "CreateButton";

export default CreateButton;
