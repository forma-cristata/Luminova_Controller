import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { RootStackParamList } from "../../screens/index";
import React from "react";

export default function InfoButton(   ) {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const handlePress = () => {
		navigation.navigate("Info");
	};

	return (
		<TouchableOpacity style={styles.infoButton} onPress={handlePress}>
			<Ionicons name="information-circle-outline" size={32} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	infoButton: {
		position: "absolute",
		top: 60,
		right: 20,
		zIndex: 10,
	},
});
