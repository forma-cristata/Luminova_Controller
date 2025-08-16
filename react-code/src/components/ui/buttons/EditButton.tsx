import React from "react";
import Button, {
	type BaseButtonProps,
} from "@/src/components/ui/buttons/Button";
import { COLORS, FONTS } from "@/src/styles/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/types/SettingInterface";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

interface EditButtonProps extends Omit<BaseButtonProps, "title" | "onPress"> {
	navigation: NativeStackNavigationProp<RootStackParamList>;
	setting: Setting;
	settingIndex?: number;
	onPress?: () => void;
}

const EditButton = React.memo(
	({
		navigation,
		setting,
		settingIndex,
		style,
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
			<Button
				title="Edit"
				onPress={handleEdit}
				disabled={disabled}
				variant="wide"
				style={style}
				textStyle={textStyle || defaultTextStyle}
			/>
		);
	},
);

EditButton.displayName = "EditButton";

export default EditButton;
