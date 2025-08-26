import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, type ViewStyle, StyleSheet } from "react-native";
import { COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";

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

	const iconSize = DIMENSIONS.SCREEN_HEIGHT * 0.04;

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			onPress={handlePress}
			hitSlop={{
				top: DIMENSIONS.SCREEN_HEIGHT * 0.015,
				bottom: DIMENSIONS.SCREEN_HEIGHT * 0.015,
				left: DIMENSIONS.SCREEN_WIDTH * 0.025,
				right: DIMENSIONS.SCREEN_WIDTH * 0.025,
			}}
		>
			<Ionicons
				name="chevron-back-circle-outline"
				size={iconSize}
				color="white"
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});