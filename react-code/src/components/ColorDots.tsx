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
				...(isInteractive ? (isBlack
					? {
							shadowColor: getFirstNonBlackColor(),
							shadowOffset: { width: 0, height: 0 },
							shadowOpacity: 0.6,
							shadowRadius: 5,
							elevation: 5,
						}
					: {}) : {}),
			};
		};

		const renderDot = (index: number) => {
			const dotStyle = getDotStyle(index);

			return isInteractive ? (
				<TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
					<View style={dotStyle} />
				</TouchableOpacity>
			) : (
				<View key={index} style={dotStyle} />
			);
		};

		// Single row layout (original ColorDots behavior)
		if (layout === "single-row") {
			return (
				<View style={{ flexDirection: "row" }}>
					{colors.map((_, index) => renderDot(index))}
				</View>
			);
		}

		// Two rows layout (original ColorDotEditorEdition behavior)
		return (
			<>
				<View style={{ flexDirection: "row" }}>
					{[...Array(8)].map((_, index) => renderDot(index))}
				</View>
				<View
					style={{
						flexDirection: "row",
						marginTop: 30,
					}}
				>
					{[...Array(8)].map((_, index) => {
						const dotIndex = index + 8;
						return renderDot(dotIndex);
					})}
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
