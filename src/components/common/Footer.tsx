import { DIMENSIONS } from "@/src/styles/SharedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FooterProps {
	onLeftPress?: () => void;
	onRightPress?: () => void;
	leftDisabled?: boolean;
	rightDisabled?: boolean;
	containerStyle?: object;
}

export default function Footer({
	onLeftPress = () => {},
	onRightPress = () => {},
	leftDisabled = false,
	rightDisabled = false,
	containerStyle,
}: FooterProps) {
	const topOffset = DIMENSIONS.SCREEN_HEIGHT * 0.005;
	const iconSize = DIMENSIONS.SCREEN_HEIGHT * 0.04;
	const footerHeight = topOffset * 2 + iconSize;

	return (
		<View
			style={[styles.footerWrapper, { height: footerHeight }, containerStyle]}
		>
			<View style={styles.footerBar}>
				<View style={styles.left}>
					<TouchableOpacity
						style={styles.sideButton}
						onPress={onLeftPress}
						activeOpacity={0.6}
						disabled={leftDisabled}
					>
						<Ionicons name="chevron-back" size={iconSize} color="white" />
					</TouchableOpacity>
				</View>
				<View style={styles.center} />
				<View style={styles.right}>
					<TouchableOpacity
						style={styles.sideButton}
						onPress={onRightPress}
						activeOpacity={0.6}
						disabled={rightDisabled}
					>
						<Ionicons name="chevron-forward" size={iconSize} color="white" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	footerWrapper: {
		width: "100%",
		position: "absolute",
		bottom: 0,
	},
	footerBar: {
		flex: 0.7 * DIMENSIONS.SCALE,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: DIMENSIONS.SCREEN_WIDTH * 0.05,
	},
	left: {
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	center: {
		flex: 1,
	},
	right: {
		flex: 1,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	sideButton: {
		width: 40 * DIMENSIONS.SCALE,
		height: 40 * DIMENSIONS.SCALE,
		justifyContent: "center",
		alignItems: "center",
	},
});
