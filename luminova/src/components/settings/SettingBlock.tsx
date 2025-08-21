import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AnimatedDots from "@/src/components/animations/AnimatedDots";
import ColorDots from "@/src/components/color-picker/ColorDots";
import FlashButton from "@/src/components/buttons/FlashButton";
import type { Setting } from "@/src/types/SettingInterface";
import { COMMON_STYLES, DIMENSIONS, COLORS } from "@/src/styles/SharedStyles";
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

	// Calculate target container width for dots (90% of screen width)
	const containerWidth = DIMENSIONS.SCREEN_WIDTH * 0.9;

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
				containerWidth={containerWidth}
			/>
		) : (
			<ColorDots key={`static-${stableId}`} colors={setting.colors} containerWidth={containerWidth} />
		);
	}, [isAnimated, stableId, setting, navigation, containerWidth]);

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
		const BASE_FONT_SIZE = 60 * DIMENSIONS.SCALE;
		const MIN_FONT_SIZE = 50 * DIMENSIONS.SCALE;

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

	// Dynamic padding based on font size to prevent clipping
	// The Thesignature font has glyphs that bleed to the left of their bounding box
	const dynamicHeaderStyle = {
		paddingHorizontal: Math.max(20, titleFontSize * 0.3) * DIMENSIONS.SCALE, // Symmetric padding for the background
		paddingVertical: Math.max(6, titleFontSize * 0.1) * DIMENSIONS.SCALE,
		borderRadius: Math.max(6, titleFontSize * 0.08) * DIMENSIONS.SCALE,
	};

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
							style={[
								COMMON_STYLES.whiteText,
								styles.headerText,
								dynamicHeaderStyle,
								{
									fontSize: titleFontSize,
									textAlign: 'center', // Back to center alignment
									includeFontPadding: false, // Android-specific: remove extra font padding
									textAlignVertical: 'center', // Android-specific: center vertically
								}
							]}
							numberOfLines={1}
							adjustsFontSizeToFit={true}
							minimumFontScale={0.7}
						>
							{displayTitle || ""}
						</Text>
					</View>

					<View style={[styles.dotsContainer, { width: containerWidth }]}>{dotsRendered}</View>
					<View style={styles.tapToEditContainer}>
						<Text style={COMMON_STYLES.hintText}>tap to edit</Text>
					</View>
				</TouchableOpacity>
			) : null}

			{layout === "compact" ? (
				<View style={style}>
					{/* Constrain dots to 90% of screen width while keeping internal overlapping */}
					<View style={[styles.compactDotsContainer, { width: containerWidth }]}>
						{dotsRendered}
					</View>
					<FlashButton setting={setting} style={styles.flashButtonCompact} variant="secondary" />
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
		overflow: "visible",
	},
	headerContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 0, // Remove padding that clips the text container
		position: "relative",
		zIndex: 10,
		elevation: 10,
	},
	dotsContainer: {
		paddingHorizontal: 15 * DIMENSIONS.SCALE,
		paddingVertical: 20 * DIMENSIONS.SCALE,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 0,
	},
	headerText: {
		backgroundColor: COLORS.BLACK,
		zIndex: 20,
		elevation: 20,
	},
	tapToEditContainer: {
		marginTop: 30 * DIMENSIONS.SCALE,
		alignItems: "center",
		justifyContent: "center",
	},
	flashButtonCompact: {
		...COMMON_STYLES.secondaryButton,
		marginTop: 10 * DIMENSIONS.SCALE,
		marginBottom: 10 * DIMENSIONS.SCALE,
		alignSelf: "center",
	},
	deleteButton: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 1,
	},
	compactDotsContainer: {
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		// allow children to overflow slightly if they use negative margins for overlap
		overflow: "visible",
	},
});

export default React.memo(SettingBlock, areEqual);
