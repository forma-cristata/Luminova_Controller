import React from "react";
import type { ViewStyle } from "react-native";
import Button, { type BaseButtonProps } from "@/src/components/buttons/Button";
import { COLORS, FONTS, DIMENSIONS } from "@/src/styles/SharedStyles";
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
		variant = "wide",
	}: FlashButtonProps) => {
		const { currentConfiguration, setCurrentConfiguration, isShelfConnected, setIsShelfConnected } =
			useConfiguration();

		const [isFlashing, setIsFlashing] = React.useState(false);

		// Check if the setting is the same as the current configuration
		const isSameAsCurrentConfig = React.useMemo(() => {
			if (!currentConfiguration || !setting) return false;

			return (
				currentConfiguration.name === setting.name &&
				currentConfiguration.delayTime === setting.delayTime &&
				currentConfiguration.flashingPattern === setting.flashingPattern &&
				JSON.stringify(currentConfiguration.colors) === JSON.stringify(setting.colors) &&
				JSON.stringify(currentConfiguration.whiteValues) === JSON.stringify(setting.whiteValues) &&
				JSON.stringify(currentConfiguration.brightnessValues) === JSON.stringify(setting.brightnessValues)
			);
		}, [currentConfiguration, setting]);

		const handleFlash = async () => {
			// Don't proceed if shelf is not connected, already flashing, or no changes
			if (!isShelfConnected || isFlashing || isSameAsCurrentConfig) {
				console.warn("Cannot flash: Shelf is not connected, request in progress, or no changes detected");
				return;
			}

			// Call custom onPress if provided
			if (onPress) {
				onPress();
			}

			setIsFlashing(true);

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
			} finally {
				setIsFlashing(false);
			}
		};

		// Default text style that matches SettingBlock buttons with responsive sizing
		const defaultTextStyle = {
			color: COLORS.WHITE,
			fontSize: 40 * DIMENSIONS.SCALE, // Responsive sizing with max cap
			fontFamily: FONTS.CLEAR,
		};

		// Combine external disabled prop with shelf connectivity, loading state, and no-changes check
		const isDisabled = disabled || !isShelfConnected || isFlashing || isSameAsCurrentConfig;

		// Create combined style with opacity for disabled state
		const combinedStyle: ViewStyle = {
			...style,
			...(isDisabled && { opacity: COLORS.DISABLED_OPACITY }),
		};

		return (
			<Button
				title={isFlashing ? "Flashing..." : "Flash"}
				onPress={handleFlash}
				disabled={isDisabled}
				variant={variant}
				style={combinedStyle}
				textStyle={textStyle || defaultTextStyle}
			/>
		);
	},
);

FlashButton.displayName = "FlashButton";

export default FlashButton;
