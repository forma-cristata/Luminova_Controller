import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AnimatedDots from "@/src/components/animations/AnimatedDots";
import ColorDots from "@/src/components/color-picker/ColorDots";
import FlashButton from "@/src/components/buttons/FlashButton";
import type { Setting } from "@/src/types/SettingInterface";
import { COMMON_STYLES, DIMENSIONS, COLORS, FONTS } from "@/src/styles/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { getStableSettingId } from "@/src/utils/settingUtils";
import type { ViewStyle } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

interface SettingItemProps {
	navigation: NativeStackNavigationProp<RootStackParamList>;
	setting: Setting;
	style: ViewStyle;
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

	// Generate stable ID for the setting using utility function (even for null settings)
	const stableId = setting ? getStableSettingId(setting) : "null-setting";

	// Memoize the dots rendering to prevent unnecessary re-renders
	const dotsRendered = React.useMemo(() => {
		// Additional safety check to ensure setting has required properties
		if (!setting || !setting.colors) {
			return null;
		}

		// Calculate responsive sizing while maintaining overlapping behavior
		// Original: size=35, overlap=7, effective spacing between centers = 35-14 = 21px
		// For 16 dots: total width = 21 * 15 + 35 = 350px (15 spacings + 1 dot width)
		
		// Target widths: 90% for focused (full), 80% for carousel (compact)
		const targetWidth = layout === "full" 
			? DIMENSIONS.SCREEN_WIDTH * 0.90 
			: DIMENSIONS.SCREEN_WIDTH * 0.80;
		
		// Calculate scale factor to fit target width
		const originalTotalWidth = 21 * 15 + 35; // 350px
		const scaleFactor = targetWidth / originalTotalWidth;
		
		// Scale the size and overlap proportionally
		const responsiveSize = Math.floor(35 * scaleFactor);
		const responsiveOverlap = Math.floor(7 * scaleFactor);

		return isAnimated ? (
			<AnimatedDots
				key={`animated-${stableId}`}
				navigation={navigation}
				setting={setting}
				dotSize={responsiveSize}
				overlap={responsiveOverlap}
			/>
		) : (
			<ColorDots 
				key={`static-${stableId}`} 
				colors={setting.colors}
				dotSize={responsiveSize}
				overlap={responsiveOverlap}
			/>
		);
	}, [isAnimated, stableId, setting, navigation, layout]);

	// Early return if setting is null, undefined, or missing required properties
	if (!setting || !setting.name || !setting.colors) {
		return null;
	}

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
		const displayTitle =
			safeTitle.length > MAX_CHARACTERS
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
			fontSize: fontSize,
		};
	};

	const { text: displayTitle, fontSize: titleFontSize } = processTitle(
		setting.name,
	);

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
		width: DIMENSIONS.SCREEN_WIDTH * 0.3,
		height: 40,
	},
	tapToEditText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		opacity: 0.7,
		fontSize: 36,
		textAlign: "center",
		includeFontPadding: false,
		textAlignVertical: "center",
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
