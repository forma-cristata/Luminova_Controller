import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";

interface RandomizeButtonProps {
	onPress: () => void;
}

const RandomizeButton = ({ onPress }: RandomizeButtonProps) => {
	return (
		<TouchableOpacity
			style={[COMMON_STYLES.utilityButton, { marginRight: 20 }]}
			onPress={onPress}
		>
			<Text style={COMMON_STYLES.utilityButtonIcon}>⟳</Text>
		</TouchableOpacity>
	);
};

export default RandomizeButton;
