import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { DIMENSIONS } from "@/src/styles/SharedStyles";

interface ColorDotsProps {
	colors: string[];
	// Interactive mode props (optional)
	onDotSelect?: (index: number) => void;
	selectedDot?: number | null;
	// Layout props (optional)
	layout?: "single-row" | "two-rows";
	dotSize?: number;
	spacing?: number;
	// Optional container width in pixels so dot sizing can be responsive
	containerWidth?: number;
}

const ColorDots = React.memo(
	(props: ColorDotsProps) => {
		const {
			colors,
			onDotSelect,
			selectedDot = null,
			layout = "single-row",
			dotSize: dotSizeProp,
			spacing: spacingProp,
			containerWidth,
		} = props;

		// If a containerWidth is provided and dotSize/spacing not explicitly set,
		// compute sizes so 16 dots (single row) fill ~90% of container width with overlap.
		let computedDotSize = 35 * DIMENSIONS.SCALE;
		let computedSpacing = -7 * DIMENSIONS.SCALE;

		if (containerWidth && !props.dotSize && !props.spacing) {
			const n = Math.min(16, colors.length || 16);
			// Aim to fill most of container; allow some overlap. Use overlap fraction 0.2
			const overlapFraction = 0.2;
			const stepFraction = 1 - 2 * overlapFraction; // effective step per dot
			const sizeEstimate = containerWidth / (1 + (n - 1) * stepFraction);
			computedDotSize = Math.max(
				10 * DIMENSIONS.SCALE,
				Math.round(sizeEstimate),
			);
			// spacing should be negative for overlap
			computedSpacing = Math.round(-overlapFraction * computedDotSize);
		} else {
			computedDotSize = dotSizeProp
				? dotSizeProp * DIMENSIONS.SCALE
				: 35 * DIMENSIONS.SCALE;
			computedSpacing = spacingProp
				? spacingProp * DIMENSIONS.SCALE
				: -7 * DIMENSIONS.SCALE;
		}

		// Generate stable ID for the colors array using hash-based approach
		const getStableColorsId = (colors: string[]): string => {
			const content = colors.join(",");
			let hash = 0;
			for (let i = 0; i < content.length; i++) {
				const char = content.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash = hash & hash; // Convert to 32-bit integer
			}
			return `colors-${Math.abs(hash)}`;
		};

		const colorsId = getStableColorsId(colors || []);
		const isInteractive = !!onDotSelect;

		// Memoize scales to prevent unnecessary re-renders
		const scales = useMemo(() => {
			const scaleArray = Array(16).fill(1);
			if (selectedDot !== null && isInteractive) {
				scaleArray[selectedDot] = 1.5;
			}
			return scaleArray;
		}, [selectedDot, isInteractive]);

		// Early return with safety check
		if (!colors || !Array.isArray(colors) || colors.length === 0) {
			return null;
		}

		const handleDotPress = (index: number) => {
			if (onDotSelect) {
				onDotSelect(index);
			}
		};

		const getFirstNonBlackColor = () => {
			const nonBlackColor = colors.find((color) => color !== "#000000");
			return nonBlackColor || "#FFFFFF";
		};

		const getDotStyle = (index: number) => {
			// Safety check for colors array bounds
			if (!colors || index >= colors.length) {
				return {
					width: computedDotSize,
					height: computedDotSize,
					backgroundColor: "#000000",
					borderRadius: "50%",
					marginHorizontal: computedSpacing,
				};
			}

			const isBlack = colors[index] === "#000000";
			const baseSize = isInteractive ? 55 * DIMENSIONS.SCALE : computedDotSize;

			return {
				width: baseSize,
				height: baseSize,
				backgroundColor: colors[index],
				borderRadius: "50%",
				marginHorizontal: computedSpacing,
				transform: isInteractive ? [{ scale: scales[index] }] : [],
				// Add shadow for black dots in interactive mode
				...(isInteractive
					? isBlack
						? {
								shadowColor: getFirstNonBlackColor(),
								shadowOffset: { width: 0, height: 0 },
								shadowOpacity: 0.6,
								shadowRadius: 5 * DIMENSIONS.SCALE,
								elevation: 5 * DIMENSIONS.SCALE,
							}
						: {}
					: {}),
			};
		};

		const renderDot = (index: number) => {
			// Safety check before rendering
			if (!colors || index >= colors.length) {
				return null;
			}

			const dotStyle = getDotStyle(index);
			// Create stable key using colors array hash + color value + unique identifier
			const colorValue = colors[index] || "black";
			const uniqueId = `${colorValue}-${colors.slice(0, index + 1).join("")}`;
			const stableKey = `${colorsId}-${uniqueId}`;

			return isInteractive ? (
				<TouchableOpacity key={stableKey} onPress={() => handleDotPress(index)}>
					<View style={dotStyle} />
				</TouchableOpacity>
			) : (
				<View key={stableKey} style={dotStyle} />
			);
		};

		// Single row layout (original ColorDots behavior)
		if (layout === "single-row") {
			return (
				<View style={{ flexDirection: "row" }}>
					{colors.map((_, index) => renderDot(index)).filter(Boolean)}
				</View>
			);
		}

		// Two rows layout (original ColorDotEditorEdition behavior)
		return (
			<>
				<View style={{ flexDirection: "row" }}>
					{[...Array(Math.min(8, colors.length))]
						.map((_, index) => renderDot(index))
						.filter(Boolean)}
				</View>
				<View
					style={{
						flexDirection: "row",
						marginTop: 30 * DIMENSIONS.SCALE,
					}}
				>
					{[...Array(Math.min(8, Math.max(0, colors.length - 8)))]
						.map((_, index) => {
							const dotIndex = index + 8;
							return renderDot(dotIndex);
						})
						.filter(Boolean)}
				</View>
			</>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison function to prevent color bleeding
		return (
			JSON.stringify(prevProps.colors) === JSON.stringify(nextProps.colors) &&
			prevProps.onDotSelect === nextProps.onDotSelect &&
			prevProps.selectedDot === nextProps.selectedDot &&
			prevProps.layout === nextProps.layout &&
			prevProps.dotSize === nextProps.dotSize &&
			prevProps.spacing === nextProps.spacing
		);
	},
);

ColorDots.displayName = "ColorDots";

export default ColorDots;
