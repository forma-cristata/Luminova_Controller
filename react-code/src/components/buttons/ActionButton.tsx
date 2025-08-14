import React from "react";
import { ViewStyle, TextStyle } from "react-native";
import Button, { BaseButtonProps } from "./Button";
import { COLORS } from "../SharedStyles";

export type ActionButtonVariant = "primary" | "disabled" | "preview";

interface ActionButtonProps extends Omit<BaseButtonProps, "variant"> {
	variant?: ActionButtonVariant;
}

/**
 * Action button component for common operations (Reset, Save, Preview, etc.)
 * Extends the base Button component with action-specific styling and behavior.
 */
const ActionButton = React.memo(
	({
		title,
		onPress,
		disabled = false,
		variant = "primary",
		style,
		textStyle,
		opacity,
	}: ActionButtonProps) => {
		// Convert action variant to base button styling
		const getButtonVariant = () => {
			return "default"; // Action buttons use the default (styleAButton) variant
		};

		// Handle action-specific opacity logic
		const getActionOpacity = () => {
			if (opacity !== undefined) {
				return opacity;
			}
			if (variant === "disabled") {
				return COLORS.DISABLED_OPACITY;
			}
			return undefined; // Let base Button handle opacity
		};

		return (
			<Button
				title={title}
				onPress={onPress}
				disabled={disabled}
				variant={getButtonVariant()}
				style={style}
				textStyle={textStyle}
				opacity={getActionOpacity()}
			/>
		);
	},
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
