import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AnimatedDots from "@/src/components/AnimatedDots";
import ColorDots from "@/src/components/ColorDots";
import EditButton from "@/src/components/buttons/EditButton";
import FlashButton from "@/src/components/buttons/FlashButton";
import type { Setting } from "../interface/SettingInterface";
import { COLORS, COMMON_STYLES, FONTS } from "./SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";

interface SettingItemProps {
	navigation: any;
	setting: Setting;
	style: any;
	layout: "full" | "compact";
	isAnimated: boolean;
	index?: number;
}

// Custom comparison function to prevent unnecessary re-renders
const areEqual = (prevProps: SettingItemProps, nextProps: SettingItemProps) => {
	return (
		prevProps.setting?.name === nextProps.setting?.name &&
		prevProps.layout === nextProps.layout &&
		prevProps.isAnimated === nextProps.isAnimated &&
		prevProps.index === nextProps.index &&
		JSON.stringify(prevProps.setting?.colors) ===
			JSON.stringify(nextProps.setting?.colors)
	);
};

const SettingBlock = ({
	navigation,
	setting,
	style,
	layout,
	isAnimated,
	index,
}: SettingItemProps) => {
	const { setLastEdited } = useConfiguration();

	if (!setting) {
		return null;
	}

	const handleEdit = () => {
		setLastEdited(index?.toString() ?? null);
		navigation.navigate("ChooseModification", {
			setting: setting,
			settingIndex: index,
		});
	};
	// Memoize the dots rendering to prevent unnecessary re-renders
	const dotsRendered = React.useMemo(() => {
		return isAnimated ? (
			<AnimatedDots
				key={`animated-${setting.name}-${index}`}
				navigation={navigation}
				setting={setting}
			/>
		) : (
			<ColorDots colors={setting.colors} />
		);
	}, [
		isAnimated,
		setting.name,
		setting.colors,
		setting.delayTime,
		setting.flashingPattern,
		index,
		navigation,
	]);

	return (
		<>
			{layout === "full" ? (
				<TouchableOpacity 
					style={[styles.fullTouchableContainer, style]} 
					onPress={handleEdit}
					activeOpacity={0.8}
				>
					<View style={styles.headerContainer}>
						<Text
							style={styles.whiteText}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{setting.name.toLowerCase()}
						</Text>
					</View>

					<View style={styles.dotsContainer}>{dotsRendered}</View>
					<View style={styles.tapToEditContainer}>
						<Text style={styles.tapToEditText}>tap to edit</Text>
					</View>
				</TouchableOpacity>
			) : null}

			{layout === "compact" ? (
				<View style={style}>
					{dotsRendered}
					<FlashButton setting={setting} style={styles.flashButtonCompact} />
				</View>
			) : null}
		</>
	);
};

const styles = StyleSheet.create({
	fullTouchableContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	whiteText: {
		color: COLORS.WHITE,
		fontSize: 70,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		flexWrap: "nowrap",
	},
	whiteTextSmaller: {
		color: COLORS.WHITE,
		fontSize: 60,
		fontFamily: FONTS.SIGNATURE,
		paddingHorizontal: 20,
	},
	headerContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
		position: "relative",
	},
	dotsContainer: {
		paddingHorizontal: 15,
		paddingVertical: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	tapToEditContainer: {
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	tapToEditText: {
		color: COLORS.WHITE,
		fontSize: 20,
		fontFamily: FONTS.CLEAR,
		opacity: 0.7,
	},
	flashButtonCompact: {
		...COMMON_STYLES.wideButton,
		marginTop: 10,
		paddingVertical: 5,
		paddingHorizontal: 15,
	},
	deleteButton: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 1,
	},
});

export default React.memo(SettingBlock, areEqual);
