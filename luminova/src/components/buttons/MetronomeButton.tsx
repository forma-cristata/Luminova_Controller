import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { COLORS, COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";

export default function MetronomeButton({ onPress }: { onPress: () => void }) {
	return (
		<TouchableOpacity
			style={[COMMON_STYLES.utilityButton, { marginLeft: 20 * DIMENSIONS.SCALE }]}
			onPress={onPress}
		>
			<Ionicons name="timer-outline" size={32 * DIMENSIONS.SCALE} color={COLORS.WHITE} />
		</TouchableOpacity>
	);
}
