import React from "react";
import {
	Text,
	TouchableOpacity,
	type ViewStyle,
	type TextStyle,
} from "react-native";
import { COLORS, COMMON_STYLES } from "@/src/styles/SharedStyles";

export interface BaseButtonProps {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	style?: ViewStyle;
	textStyle?: TextStyle;
	opacity?: number;
	variant?: "default" | "wide" | "welcome" | "secondary";
}

/**
 * Base button component that provides consistent styling and behavior
 * for all buttons in the app. Other button components should extend this.
 */
const Button = React.memo(
	({
		title,
		onPress,
		disabled = false,
		style,
		textStyle,
		opacity,
		variant = "default",
	}: BaseButtonProps) => {
		// Get base style based on variant
		const getBaseStyle = () => {
			switch (variant) {
				case "wide":
					return COMMON_STYLES.wideButton;
				case "welcome":
					return COMMON_STYLES.welcomeButton;
				case "secondary":
					return COMMON_STYLES.secondaryButton;
				default:
					return COMMON_STYLES.styleAButton;
			}
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
				style={[getBaseStyle(), { opacity: getOpacity() }, style]}
				onPress={onPress}
				disabled={disabled}
			>
				<Text
					style={[COMMON_STYLES.buttonText, textStyle]}
					adjustsFontSizeToFit={true}
					numberOfLines={1}
				>
					{title}
				</Text>
			</TouchableOpacity>
		);
	},
);
Button.displayName = "Button";

export default Button;
