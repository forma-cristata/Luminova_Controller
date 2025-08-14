import React from "react";
import Button, { type BaseButtonProps } from "./Button";
import { COLORS, FONTS } from "../SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/interface/SettingInterface";
import { ApiService } from "@/src/services/ApiService";

interface FlashButtonProps extends Omit<BaseButtonProps, "title" | "onPress"> {
	setting: Setting;
	onPress?: () => void;
	onSuccess?: (setting: Setting) => void;
	onError?: (error: any) => void;
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
		const { setCurrentConfiguration } = useConfiguration();

		const handleFlash = async () => {
			// Call custom onPress if provided
			if (onPress) {
				onPress();
			}

			try {
				await ApiService.flashSetting(setting);
				setCurrentConfiguration(setting);
				console.log(`Current Configuration: ${setting.name}`);

				// Call success callback if provided
				if (onSuccess) {
					onSuccess(setting);
				}
			} catch (error) {
				console.error("Flash error:", error);

				// Call error callback if provided
				if (onError) {
					onError(error);
				}
			}
		};

		// Default text style that matches SettingBlock buttons
		const defaultTextStyle = {
			color: COLORS.WHITE,
			fontSize: 40,
			fontFamily: FONTS.CLEAR,
		};

		return (
			<Button
				title="Flash"
				onPress={handleFlash}
				disabled={disabled}
				variant="wide"
				style={style}
				textStyle={textStyle || defaultTextStyle}
			/>
		);
	},
);

FlashButton.displayName = "FlashButton";

export default FlashButton;
