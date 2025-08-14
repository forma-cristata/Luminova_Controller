import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { COLORS, COMMON_STYLES, FONTS } from "@/src/components/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/interface/SettingInterface";

interface EditButtonProps {
	navigation: any;
	setting: Setting;
	settingIndex?: number;
	style?: any;
	disabled?: boolean;
	onPress?: () => void;
	textStyle?: any;
}

const EditButton = React.memo(
	({
		navigation,
		setting,
		settingIndex,
		style = COMMON_STYLES.wideButton,
		disabled = false,
		onPress,
		textStyle,
	}: EditButtonProps) => {
		const { setLastEdited } = useConfiguration();

		const handleEdit = () => {
			// Call custom onPress if provided
			if (onPress) {
				onPress();
			}

			setLastEdited(settingIndex?.toString() ?? null);
			navigation.navigate("ChooseModification", {
				setting: setting,
				settingIndex: settingIndex,
			});
		};

		// Default text style that matches SettingBlock buttons
		const defaultTextStyle = {
			color: COLORS.WHITE,
			fontSize: 40,
			fontFamily: FONTS.CLEAR,
		};

		return (
			<TouchableOpacity style={style} onPress={handleEdit} disabled={disabled}>
				<Text style={textStyle || defaultTextStyle}>Edit</Text>
			</TouchableOpacity>
		);
	},
);

EditButton.displayName = "EditButton";

export default EditButton;
