
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { COLORS, COMMON_STYLES } from "@/src/styles/SharedStyles";

export default function MetronomeButton({ onPress }: { onPress: () => void }) {
	return (
		<TouchableOpacity
			style={[COMMON_STYLES.utilityButton, { marginLeft: 20 }]}
			onPress={onPress}
		>
			<Ionicons name="timer-outline" size={32} color={COLORS.WHITE} />
		</TouchableOpacity>
	);
}
