import React from "react";
import { Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { COLORS, COMMON_STYLES } from "./SharedStyles";

export type ActionButtonVariant = "primary" | "disabled" | "preview";

interface ActionButtonProps {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	variant?: ActionButtonVariant;
	style?: ViewStyle;
	textStyle?: TextStyle;
	opacity?: number;
}

/**
 * Reusable action button component that handles the common button patterns
 * used throughout the app (Reset, Save, Preview, etc.)
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
		// Determine the button style based on variant and state
		const getButtonStyle = () => {
			if (variant === "disabled") {
				return COMMON_STYLES.styleADisabledButton;
			}
			return COMMON_STYLES.styleAButton;
		};

		// Calculate opacity based on props and state
		const getOpacity = () => {
			if (opacity !== undefined) {
				return opacity;
			}
			if (disabled) {
				return COLORS.DISABLED_OPACITY;
			}
			return 1;
		};

		return (
			<TouchableOpacity
				style={[getButtonStyle(), { opacity: getOpacity() }, style]}
				onPress={onPress}
				disabled={disabled}
			>
				<Text style={[COMMON_STYLES.buttonText, textStyle]}>{title}</Text>
			</TouchableOpacity>
		);
	},
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
