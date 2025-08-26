import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "@/src/screens/index";
import { DIMENSIONS } from "@/src/styles/SharedStyles";

export default function InfoButton() {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const handlePress = () => {
		navigation.navigate("Info");
	};

	const iconSize = DIMENSIONS.SCREEN_HEIGHT * 0.04;

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.button}
				onPress={handlePress}
				hitSlop={{
					top: DIMENSIONS.SCREEN_HEIGHT * 0.015,
					bottom: DIMENSIONS.SCREEN_HEIGHT * 0.015,
					left: DIMENSIONS.SCREEN_WIDTH * 0.025,
					right: DIMENSIONS.SCREEN_WIDTH * 0.025,
				}}
			>
				<Ionicons
					name="information-circle-outline"
					size={iconSize}
					color="white"
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
	},
});