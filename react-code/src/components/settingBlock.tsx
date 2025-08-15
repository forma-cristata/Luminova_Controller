import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AnimatedDots from "@/src/components/AnimatedDots";
import ColorDots from "@/src/components/ColorDots";
import EditButton from "@/src/components/buttons/EditButton";
import FlashButton from "@/src/components/buttons/FlashButton";
import type { Setting } from "../interface/SettingInterface";
import { COLORS, COMMON_STYLES, FONTS } from "./SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { getStableSettingId } from "@/src/utils/settingUtils";

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

	// Early return if setting is null, undefined, or missing required properties
	if (!setting || !setting.name || !setting.colors) {
		return null;
	}

	// Generate stable ID for the setting using utility function
	const stableId = getStableSettingId(setting);

	const handleEdit = () => {
		setLastEdited(index?.toString() ?? null);
		navigation.navigate("ChooseModification", {
			setting: setting,
			settingIndex: index,
		});
	};

	// Dynamic title processing with character limit and font sizing
	const processTitle = (title: string | undefined | null) => {
		const MAX_CHARACTERS = 20; // Slightly longer than "Toter Schmetterling" (18 chars)
		const BASE_FONT_SIZE = 70;
		const MIN_FONT_SIZE = 45;

		// Ensure title is a valid string
		const safeTitle = String(title || "");

		// Truncate if longer than character limit
		const displayTitle = safeTitle.length > MAX_CHARACTERS
			? safeTitle.substring(0, MAX_CHARACTERS).trim()
			: safeTitle;

		// Calculate dynamic font size based on length
		let fontSize = BASE_FONT_SIZE;
		if (displayTitle.length > 12) {
			// Gradually reduce font size for longer titles
			const reductionFactor = (displayTitle.length - 12) * 2.5;
			fontSize = Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE - reductionFactor);
		}

		return {
			text: displayTitle.toLowerCase(),
			fontSize: fontSize
		};
	};

	const { text: displayTitle, fontSize: titleFontSize } = processTitle(setting.name);
	// Memoize the dots rendering to prevent unnecessary re-renders
	const dotsRendered = React.useMemo(() => {
		// Additional safety check to ensure setting has required properties
		if (!setting || !setting.colors) {
			return null;
		}

		return isAnimated ? (
			<AnimatedDots
				key={`animated-${stableId}`}
				navigation={navigation}
				setting={setting}
			/>
		) : (
			<ColorDots
				key={`static-${stableId}`}
				colors={setting.colors}
			/>
		);
	}, [
		isAnimated,
		stableId,
		setting?.name,
		setting?.colors,
		setting?.delayTime,
		setting?.flashingPattern,
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
							style={[COMMON_STYLES.whiteText, { fontSize: titleFontSize }]}
							numberOfLines={1}
							adjustsFontSizeToFit={true}
							minimumFontScale={0.7}
						>
							{displayTitle || ""}
						</Text>
					</View>

					<View style={styles.dotsContainer}>{dotsRendered}</View>
					<View style={styles.tapToEditContainer}>
						<Text style={COMMON_STYLES.hintText}>tap to edit</Text>
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
