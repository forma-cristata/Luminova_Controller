import React, { useCallback, useMemo, useRef } from "react";
import {
	View,
	StyleSheet,
	PanResponder,
	Dimensions,
	GestureResponderEvent,
	PanResponderGestureState,
} from "react-native";
import { COLORS, DIMENSIONS } from "@/src/styles/SharedStyles";

const { width } = Dimensions.get("window");

interface ColorWheelProps {
	hue: number; // 0-360
	saturation: number; // 0-100
	brightness: number; // 0-100 (for display purposes)
	disabled: boolean;
	onColorChange: (hue: number, saturation: number) => void;
	onColorChangeComplete: (hue: number, saturation: number) => void;
}

// Generate color stops for the hue wheel
const generateHueStops = (): string[] => {
	const stops: string[] = [];
	for (let i = 0; i <= 360; i += 30) {
		const hue = i % 360;
		stops.push(`hsl(${hue}, 100%, 50%)`);
	}
	return stops;
};

export default React.memo(function ColorWheel({
	hue,
	saturation,
	brightness,
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

	// Convert touch coordinates to polar coordinates
	const coordinatesToPolar = useCallback(
		(x: number, y: number) => {
			const deltaX = x - centerX;
			const deltaY = y - centerY;
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			let angle = Math.atan2(deltaY, deltaX);

			// Convert angle to degrees and ensure positive
			angle = (angle * 180) / Math.PI;
			if (angle < 0) angle += 360;

			// Clamp distance to wheel radius
			const clampedDistance = Math.min(distance, wheelRadius);
			const saturationValue = (clampedDistance / wheelRadius) * 100;

			return {
				hue: angle,
				saturation: Math.max(0, Math.min(100, saturationValue)),
				isWithinBounds: distance <= wheelRadius,
			};
		},
		[centerX, centerY, wheelRadius],
	);

	// Convert polar coordinates to cartesian for indicator positioning
	const polarToCoordinates = useCallback(
		(hueValue: number, saturationValue: number) => {
			const angleRad = (hueValue * Math.PI) / 180;
			const radius = (saturationValue / 100) * wheelRadius;
			return {
				x: centerX + radius * Math.cos(angleRad),
				y: centerY + radius * Math.sin(angleRad),
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

	// Generate the color wheel background using multiple layers
	const hueStops = useMemo(() => generateHueStops(), []);

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
			{/* Hue ring layers */}
			{hueStops.map((color, index) => (
				<View
					key={`hue-segment-${color.replace(/[^\w]/g, "")}`}
					style={[
						styles.hueSegment,
						{
							backgroundColor: color,
							transform: [{ rotate: `${index * 30}deg` }],
						},
					]}
				/>
			))}

			{/* White center circle for saturation gradient effect */}
			<View
				style={[
					styles.centerWhite,
					{
						width: wheelDiameter * 0.3,
						height: wheelDiameter * 0.3,
						borderRadius: (wheelDiameter * 0.3) / 2,
						top: wheelDiameter * 0.35,
						left: wheelDiameter * 0.35,
					},
				]}
			/>

			{/* Multiple saturation overlay rings to simulate radial gradient */}
			{Array.from({ length: 8 }, (_, i) => {
				const opacity = 1 - i * 0.12;
				const size = wheelDiameter * (0.3 + i * 0.09);
				return (
					<View
						key={`saturation-ring-${size}-${opacity}`}
						style={[
							styles.saturationRing,
							{
								width: size,
								height: size,
								borderRadius: size / 2,
								backgroundColor: `rgba(255, 255, 255, ${opacity})`,
								top: (wheelDiameter - size) / 2,
								left: (wheelDiameter - size) / 2,
							},
						]}
					/>
				);
			})}				{/* Inner 3D highlight ring */}
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
					{/* Base marble circle with current color */}
					<View
						style={[
							styles.marbleBase,
							{
								backgroundColor: `hsl(${hue}, ${saturation}%, ${brightness}%)`,
							},
						]}
					/>
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
	hueSegment: {
		position: "absolute",
		width: "50%",
		height: "50%",
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
		opacity: 0.7,
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
		backgroundColor: "rgba(255, 255, 255, 0.6)",
		transform: [{ rotate: "-20deg" }],
	},
	marbleRefraction: {
		position: "absolute",
		top: 3 * DIMENSIONS.SCALE, // Reduced from 4
		left: 6 * DIMENSIONS.SCALE, // Reduced from 7
		width: 3 * DIMENSIONS.SCALE, // Reduced from 4
		height: 3 * DIMENSIONS.SCALE, // Reduced from 4
		borderRadius: 1.5 * DIMENSIONS.SCALE, // Reduced from 2
		backgroundColor: "rgba(255, 255, 255, 0.9)",
	},
	marbleBorder: {
		position: "absolute",
		width: "100%",
		height: "100%",
		borderRadius: 10 * DIMENSIONS.SCALE, // Reduced from 12
		borderWidth: 1 * DIMENSIONS.SCALE,
		borderColor: "rgba(0, 0, 0, 0.2)",
		backgroundColor: "transparent",
	},
});
