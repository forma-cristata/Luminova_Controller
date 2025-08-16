import React from "react";
import type { ViewStyle } from "react-native";
import Button, {
	type BaseButtonProps,
} from "@/src/components/buttons/Button";
import { COLORS, FONTS } from "@/src/styles/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/types/SettingInterface";
import { flashSetting } from "@/src/services/ApiService";

interface FlashButtonProps extends Omit<BaseButtonProps, "title" | "onPress"> {
	setting: Setting;
	onPress?: () => void;
	onSuccess?: (setting: Setting) => void;
	onError?: (error: Error) => void;
}

const FlashButton = React.memo(
	({
		setting,
		style,
		disabled = false,
		onPress,
		onSuccess,
		onError,
		textStyle,
	}: FlashButtonProps) => {
		const { setCurrentConfiguration, isShelfConnected, setIsShelfConnected } =
			useConfiguration();

		const handleFlash = async () => {
			// Don't proceed if shelf is not connected
			if (!isShelfConnected) {
				console.warn("Cannot flash: Shelf is not connected");
				return;
			}

			// Call custom onPress if provided
			if (onPress) {
				onPress();
			}

			try {
				await flashSetting(setting);
				setCurrentConfiguration(setting);
				setIsShelfConnected(true);
				console.log(`Current Configuration: ${setting.name}`);

				// Call success callback if provided
				if (onSuccess) {
					onSuccess(setting);
				}
			} catch (error) {
				console.error("Flash error:", error);
				setIsShelfConnected(false);

				// Call error callback if provided
				if (onError) {
					const errorToPass =
						error instanceof Error ? error : new Error(String(error));
					onError(errorToPass);
				}
			}
		};

		// Default text style that matches SettingBlock buttons
		const defaultTextStyle = {
			color: COLORS.WHITE,
			fontSize: 40,
			fontFamily: FONTS.CLEAR,
		};

		// Combine external disabled prop with shelf connectivity
		const isDisabled = disabled || !isShelfConnected;

		// Create combined style with opacity for disabled state
		const combinedStyle: ViewStyle = {
			...style,
			...(isDisabled && { opacity: COLORS.DISABLED_OPACITY }),
		};

		return (
			<Button
				title="Flash"
				onPress={handleFlash}
				disabled={isDisabled}
				variant="wide"
				style={combinedStyle}
				textStyle={textStyle || defaultTextStyle}
			/>
		);
	},
);

FlashButton.displayName = "FlashButton";

export default FlashButton;
