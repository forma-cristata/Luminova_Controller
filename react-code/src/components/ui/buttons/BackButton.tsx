import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, type ViewStyle } from "react-native";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";

interface BackButtonProps {
	beforePress?: () => void | Promise<void>;
	afterPress?: () => void;
	onPress?: () => void;
	style?: ViewStyle;
}

export default function BackButton({
	beforePress,
	afterPress,
	onPress,
	style,
}: BackButtonProps) {
	const navigation = useNavigation();

	const handlePress = async () => {
		if (beforePress) {
			await beforePress();
		}
		if (onPress) {
			onPress();
		} else {
			navigation.goBack();
		}
		if (afterPress) {
			setTimeout(afterPress, 0);
		}
	};

	return (
		<TouchableOpacity
			style={[COMMON_STYLES.navButton, { left: 20 }, style]}
			onPress={handlePress}
		>
			<Ionicons name="chevron-back-circle-outline" size={32} color="white" />
		</TouchableOpacity>
	);
}
