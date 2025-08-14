import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { COLORS, COMMON_STYLES, FONTS } from "@/src/components/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/interface/SettingInterface";
import { ApiService } from "@/src/services/ApiService";

interface FlashButtonProps {
	setting: Setting;
	style?: any;
	disabled?: boolean;
	onPress?: () => void;
	onSuccess?: (setting: Setting) => void;
	onError?: (error: any) => void;
	textStyle?: any;
}

const FlashButton = React.memo(({
	setting,
	style = COMMON_STYLES.wideButton,
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
		<TouchableOpacity
			style={style}
			onPress={handleFlash}
			disabled={disabled}
		>
			<Text style={textStyle || defaultTextStyle}>Flash</Text>
		</TouchableOpacity>
	);
});

FlashButton.displayName = "FlashButton";

export default FlashButton;
