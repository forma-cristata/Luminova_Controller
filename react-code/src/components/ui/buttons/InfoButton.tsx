import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { RootStackParamList } from "@/src/screens/index";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";

export default function InfoButton() {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const handlePress = () => {
		navigation.navigate("Info");
	};

	return (
		<TouchableOpacity
			style={[COMMON_STYLES.navButton, { right: 20 }, styles.glowEffect]}
			onPress={handlePress}
		>
			<Ionicons name="information-circle-outline" size={32} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	glowEffect: {
		shadowColor: "#ffffff",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 8, // For Android
	},
});
