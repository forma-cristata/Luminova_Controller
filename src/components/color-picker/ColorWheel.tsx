import { COLORS, DIMENSIONS } from "@/src/styles/SharedStyles";
import React, { useCallback, useMemo, useRef } from "react";
import {
	Dimensions,
	GestureResponderEvent,
	PanResponder,
	PanResponderGestureState,
	StyleSheet,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ColorWheelProps {
	hue: number; // 0-360
	saturation: number; // 0-100
	disabled: boolean;
	onColorChange: (hue: number, saturation: number) => void;
	onColorChangeComplete: (hue: number, saturation: number) => void;
}

export default React.memo(function ColorWheel({
	hue,
	saturation,
	disabled,
	onColorChange,
	onColorChangeComplete,
}: ColorWheelProps) {
	const wheelRef = useRef<View>(null);
	const isDragging = useRef(false);

	// Calculate wheel dimensions
	const wheelDiameter = useMemo(() => {
		const containerWidth = width * 0.85 - 16 * DIMENSIONS.SCALE; // Account for reduced container padding
		return Math.min(containerWidth, 180 * DIMENSIONS.SCALE); // Reduced from 240 to fit viewport
	}, []);

	const wheelRadius = wheelDiameter / 2;
	const centerX = wheelRadius;
	const centerY = wheelRadius;

	// Calculate the exact color at a given position using grid-based sampling
	const calculateExactColor = useCallback(
		(x: number, y: number) => {
			const deltaX = x - centerX;
			const deltaY = y - centerY;
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			let angle = Math.atan2(deltaY, deltaX);

			// Convert angle to degrees and ensure positive
			angle = (angle * 180) / Math.PI;
			if (angle < 0) angle += 360;

			// Calculate the exact hue based on continuous color space (0-360)
			const exactHue = angle % 360;

			// Calculate saturation based on distance from center with hard-coded ring boundaries
			// Match the visual ring layout where outer rings are much larger
			const clampedDistance = Math.min(distance, wheelRadius);
			const distanceRatio = clampedDistance / wheelRadius;

			// Hard-coded boundaries matching the visual rings (as fractions of wheel radius)
			const ringBoundaries = [
				0.05, 0.06, 0.08, 0.11, 0.15, 0.2, 0.28, 0.4, 0.55, 0.7, 0.85, 0.95,
				1.0,
			];

			// Find which ring the distance falls into and calculate saturation
			let exactSaturation = 0;
			for (let i = 0; i < ringBoundaries.length - 1; i++) {
				if (
					distanceRatio >= ringBoundaries[i] &&
					distanceRatio <= ringBoundaries[i + 1]
				) {
					// Linear interpolation within the ring
					const ringProgress =
						(distanceRatio - ringBoundaries[i]) /
						(ringBoundaries[i + 1] - ringBoundaries[i]);
					exactSaturation =
						(i + ringProgress) * (100 / (ringBoundaries.length - 2));
					break;
				}
			}

			return {
				hue: exactHue,
				saturation: Math.max(0, Math.min(100, exactSaturation)),
				isWithinBounds: distance <= wheelRadius,
			};
		},
		[centerX, centerY, wheelRadius],
	);

	// Convert touch coordinates to polar coordinates with smooth, continuous color calculation
	const coordinatesToPolar = useCallback(
		(x: number, y: number) => {
			return calculateExactColor(x, y);
		},
		[calculateExactColor],
	);

	// Convert polar coordinates to cartesian for indicator positioning
	const polarToCoordinates = useCallback(
		(hueValue: number, saturationValue: number) => {
			const angleRad = (hueValue * Math.PI) / 180;

			// Hard-coded ring boundaries matching the visual layout
			const ringBoundaries = [
				0.05, 0.06, 0.08, 0.11, 0.15, 0.2, 0.28, 0.4, 0.55, 0.7, 0.85, 0.95,
				1.0,
			];

			// Map saturation to the correct ring boundary
			const saturationRatio = saturationValue / 100;
			const ringIndex = saturationRatio * (ringBoundaries.length - 2);
			const lowerIndex = Math.floor(ringIndex);
			const upperIndex = Math.min(lowerIndex + 1, ringBoundaries.length - 2);
			const ringProgress = ringIndex - lowerIndex;

			// Interpolate between ring boundaries
			const radiusRatio =
				ringBoundaries[lowerIndex] +
				ringProgress *
					(ringBoundaries[upperIndex] - ringBoundaries[lowerIndex]);
			const effectiveRadius = radiusRatio * wheelRadius;

			return {
				x: centerX + effectiveRadius * Math.cos(angleRad),
				y: centerY + effectiveRadius * Math.sin(angleRad),
			};
		},
		[centerX, centerY, wheelRadius],
	);
	// Handle touch events
	const handleTouch = useCallback(
		(x: number, y: number, isComplete = false) => {
			if (disabled) return;

			const polar = coordinatesToPolar(x, y);
			if (polar.isWithinBounds) {
				if (isComplete) {
					onColorChangeComplete(polar.hue, polar.saturation);
				} else {
					onColorChange(polar.hue, polar.saturation);
				}
			}
		},
		[disabled, coordinatesToPolar, onColorChange, onColorChangeComplete],
	);

	// Pan responder for gesture handling
	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => !disabled,
				onMoveShouldSetPanResponder: () => !disabled,
				onPanResponderGrant: (evt: GestureResponderEvent) => {
					isDragging.current = true;
					const { locationX, locationY } = evt.nativeEvent;
					handleTouch(locationX, locationY, false);
				},
				onPanResponderMove: (
					evt: GestureResponderEvent,
					_gestureState: PanResponderGestureState,
				) => {
					if (isDragging.current) {
						const { locationX, locationY } = evt.nativeEvent;
						handleTouch(locationX, locationY, false);
					}
				},
				onPanResponderRelease: (evt: GestureResponderEvent) => {
					if (isDragging.current) {
						const { locationX, locationY } = evt.nativeEvent;
						handleTouch(locationX, locationY, true);
						isDragging.current = false;
					}
				},
				onPanResponderTerminate: () => {
					isDragging.current = false;
				},
			}),
		[disabled, handleTouch],
	);

	// Calculate indicator position
	const indicatorPosition = useMemo(() => {
		return polarToCoordinates(hue, saturation);
	}, [hue, saturation, polarToCoordinates]);

	return (
		<View style={styles.container}>
			{/* Main wheel container */}
			<View
				style={[
					styles.wheelContainer,
					{
						width: wheelDiameter,
						height: wheelDiameter,
						borderRadius: wheelRadius,
						opacity: disabled ? COLORS.DISABLED_OPACITY : 1,
					},
				]}
				ref={wheelRef}
				{...panResponder.panHandlers}
			>
				{/* Continuous color wheel using fine-grained degree slices */}
				{Array.from({ length: 360 }, (_, degree) => {
					// Use the exact degree for continuous color transitions
					const hue = degree;

					return (
						<View
							key={`color-slice-hue-${hue}`}
							style={[
								styles.degreeSlice,
								{
									backgroundColor: `hsl(${hue}, 100%, 50%)`,
									transform: [{ rotate: `${degree}deg` }],
								},
							]}
						/>
					);
				})}
				{/* White center circle for saturation gradient effect - minimal size */}
				<View
					style={[
						styles.centerWhite,
						{
							width: wheelDiameter * 0.05,
							height: wheelDiameter * 0.05,
							borderRadius: (wheelDiameter * 0.05) / 2,
							top: wheelDiameter * 0.475,
							left: wheelDiameter * 0.475,
						},
					]}
				/>
				{/* Hard-coded saturation rings - inner rings small, outer rings much larger */}
				{[
					{ size: 0.06, opacity: 0.9 }, // Tiny inner ring
					{ size: 0.08, opacity: 0.8 }, // Small
					{ size: 0.11, opacity: 0.7 }, // Small
					{ size: 0.15, opacity: 0.6 }, // Medium-small
					{ size: 0.2, opacity: 0.5 }, // Medium
					{ size: 0.28, opacity: 0.4 }, // Medium-large
					{ size: 0.4, opacity: 0.3 }, // Large
					{ size: 0.55, opacity: 0.25 }, // Larger
					{ size: 0.7, opacity: 0.2 }, // Much larger
					{ size: 0.85, opacity: 0.15 }, // Very large
					{ size: 0.95, opacity: 0.1 }, // Huge outer ring
				].map((ring, i) => (
					<View
						key={`saturation-ring-${i}-${ring.size}-${ring.opacity}`}
						style={[
							styles.saturationRing,
							{
								width: wheelDiameter * ring.size,
								height: wheelDiameter * ring.size,
								borderRadius: (wheelDiameter * ring.size) / 2,
								backgroundColor: `rgba(255, 255, 255, ${ring.opacity})`,
								top: (wheelDiameter - wheelDiameter * ring.size) / 2,
								left: (wheelDiameter - wheelDiameter * ring.size) / 2,
							},
						]}
					/>
				))}
				{/* Inner 3D highlight ring */}
				<View
					style={[
						styles.innerHighlight,
						{
							width: wheelDiameter - 12 * DIMENSIONS.SCALE,
							height: wheelDiameter - 12 * DIMENSIONS.SCALE,
							borderRadius: (wheelDiameter - 12 * DIMENSIONS.SCALE) / 2,
						},
					]}
				/>
				{/* Glass marble indicator */}
				<View
					style={[
						styles.marbleContainer,
						{
							left: indicatorPosition.x - 10 * DIMENSIONS.SCALE, // Adjusted for smaller marble
							top: indicatorPosition.y - 10 * DIMENSIONS.SCALE, // Adjusted for smaller marble
						},
					]}
				>
					{/* Transparent base marble circle - shows color wheel behind it */}
					<View style={styles.marbleBase} />
					{/* Glass highlight layer */}
					<View style={styles.marbleHighlight} />
					{/* Refraction dot */}
					<View style={styles.marbleRefraction} />
					{/* Outer glass border */}
					<View style={styles.marbleBorder} />
				</View>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		// Removed all padding
	},
	wheelContainer: {
		position: "relative",
		overflow: "hidden",
		// Removed border
	},
	colorWedge: {
		position: "absolute",
		width: "50%",
		height: "50%",
		top: "50%",
		left: "50%",
		transformOrigin: "0 0",
	},
	degreeSlice: {
		position: "absolute",
		width: "50%",
		height: 1 * DIMENSIONS.SCALE, // Very thin slice
		top: "50%",
		left: "50%",
		transformOrigin: "0 0",
	},
	centerWhite: {
		position: "absolute",
		backgroundColor: COLORS.WHITE,
	},
	saturationRing: {
		position: "absolute",
	},
	innerHighlight: {
		position: "absolute",
		top: 6 * DIMENSIONS.SCALE,
		left: 6 * DIMENSIONS.SCALE,
		borderWidth: 1 * DIMENSIONS.SCALE,
		borderColor: "rgba(255, 255, 255, 0.3)",
		backgroundColor: "transparent",
	},
	marbleContainer: {
		position: "absolute",
		width: 20 * DIMENSIONS.SCALE, // Reduced from 24
		height: 20 * DIMENSIONS.SCALE, // Reduced from 24
	},
	marbleBase: {
		position: "absolute",
		width: "100%",
		height: "100%",
		borderRadius: 10 * DIMENSIONS.SCALE, // Reduced from 12
		backgroundColor: "transparent", // Transparent to show wheel color behind
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2 * DIMENSIONS.SCALE,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4 * DIMENSIONS.SCALE,
		elevation: 4,
	},
	marbleHighlight: {
		position: "absolute",
		top: 2 * DIMENSIONS.SCALE, // Reduced from 3
		left: 5 * DIMENSIONS.SCALE, // Reduced from 6
		width: 10 * DIMENSIONS.SCALE, // Reduced from 12
		height: 6 * DIMENSIONS.SCALE, // Reduced from 8
		borderRadius: 5 * DIMENSIONS.SCALE, // Reduced from 6
		backgroundColor: "rgba(255, 255, 255, 0.8)", // Increased opacity for better glass effect
		transform: [{ rotate: "-20deg" }],
	},
	marbleRefraction: {
		position: "absolute",
		top: 3 * DIMENSIONS.SCALE, // Reduced from 4
		left: 6 * DIMENSIONS.SCALE, // Reduced from 7
		width: 3 * DIMENSIONS.SCALE, // Reduced from 4
		height: 3 * DIMENSIONS.SCALE, // Reduced from 4
		borderRadius: 1.5 * DIMENSIONS.SCALE, // Reduced from 2
		backgroundColor: "rgba(255, 255, 255, 0.95)", // Increased opacity for better visibility
	},
	marbleBorder: {
		position: "absolute",
		width: "100%",
		height: "100%",
		borderRadius: 10 * DIMENSIONS.SCALE, // Reduced from 12
		borderWidth: 1 * DIMENSIONS.SCALE, // Slightly thicker for better definition
		borderColor: "rgba(0, 0, 0, 0.2)", // Slightly darker for better contrast
		backgroundColor: "transparent",
	},
});
