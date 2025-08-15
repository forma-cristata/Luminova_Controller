import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

interface ColorDotsProps {
	colors: string[];
	// Interactive mode props (optional)
	onDotSelect?: (index: number) => void;
	selectedDot?: number | null;
	// Layout props (optional)
	layout?: "single-row" | "two-rows";
	dotSize?: number;
	spacing?: number;
}

const ColorDots = React.memo(
	(props: ColorDotsProps) => {
		const {
			colors,
			onDotSelect,
			selectedDot = null,
			layout = "single-row",
			dotSize = 35,
			spacing = -7,
		} = props;

		// Early return with safety check
		if (!colors || !Array.isArray(colors) || colors.length === 0) {
			return null;
		}

		// Generate stable ID for the colors array using hash-based approach
		const getStableColorsId = (colors: string[]): string => {
			const content = colors.join(',');
			let hash = 0;
			for (let i = 0; i < content.length; i++) {
				const char = content.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32-bit integer
			}
			return `colors-${Math.abs(hash)}`;
		};

		const colorsId = getStableColorsId(colors);

		const isInteractive = !!onDotSelect;

		// Memoize scales to prevent unnecessary re-renders
		const scales = useMemo(() => {
			const scaleArray = Array(16).fill(1);
			if (selectedDot !== null && isInteractive) {
				scaleArray[selectedDot] = 1.5;
			}
			return scaleArray;
		}, [selectedDot, isInteractive]);

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
					width: dotSize,
					height: dotSize,
					backgroundColor: "#000000",
					borderRadius: "50%",
					marginHorizontal: spacing,
				};
			}

			const isBlack = colors[index] === "#000000";
			const baseSize = isInteractive ? 55 : dotSize;

			return {
				width: baseSize,
				height: baseSize,
				backgroundColor: colors[index],
				borderRadius: "50%",
				marginHorizontal: spacing,
				transform: isInteractive ? [{ scale: scales[index] }] : [],
				// Add shadow for black dots in interactive mode
				...(isInteractive
					? isBlack
						? {
								shadowColor: getFirstNonBlackColor(),
								shadowOffset: { width: 0, height: 0 },
								shadowOpacity: 0.6,
								shadowRadius: 5,
								elevation: 5,
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
			const colorValue = colors[index] || 'black';
			const uniqueId = `${colorValue}-${colors.slice(0, index + 1).join('')}`;
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
					{[...Array(Math.min(8, colors.length))].map((_, index) => renderDot(index)).filter(Boolean)}
				</View>
				<View
					style={{
						flexDirection: "row",
						marginTop: 30,
					}}
				>
					{[...Array(Math.min(8, Math.max(0, colors.length - 8)))].map((_, index) => {
						const dotIndex = index + 8;
						return renderDot(dotIndex);
					}).filter(Boolean)}
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
