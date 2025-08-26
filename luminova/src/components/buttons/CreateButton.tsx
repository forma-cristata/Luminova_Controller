import React from "react";
import type { ViewStyle, TextStyle } from "react-native";
import { COLORS, FONTS } from "@/src/styles/SharedStyles";
import Button, { type BaseButtonProps } from "./Button";

interface CreateButtonProps extends Omit<BaseButtonProps, "title"> {
	symbol?: string;
}

/**
 * Specialized create button for adding new settings.
 * Uses a unique large "+" design with custom styling.
 * Built on top of the base Button component for consistency.
 */
const CreateButton = React.memo(
	({
		onPress,
		style,
		textStyle,
		symbol = "+",
		...buttonProps
	}: CreateButtonProps) => {
		const createButtonStyle: ViewStyle = {
			width: 365,
			height: "100%",
			justifyContent: "center",
			alignItems: "center",
		};

		const createButtonTextStyle: TextStyle = {
			color: COLORS.WHITE,
			fontSize: 100,
			fontFamily: FONTS.CLEAR,
		};

		return (
			<Button
				title={symbol}
				onPress={onPress}
				style={{ ...createButtonStyle, ...style }}
				textStyle={{ ...createButtonTextStyle, ...textStyle }}
				{...buttonProps}
			/>
		);
	},
);
CreateButton.displayName = "CreateButton";

export default CreateButton;
