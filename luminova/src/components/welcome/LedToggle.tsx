import React from "react";
import { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatus, toggleLed } from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";

interface LedToggleProps {
	isShelfConnected: boolean;
	setIsShelfConnected: (isConnected: boolean) => void;
	isEnabled: boolean;
	setIsEnabled: (isEnabled: boolean) => void;
	disableAnimation?: boolean; // For tutorial demos
	containerStyle?: object; // Custom container styling for different contexts
}

export default function LedToggle({
	isShelfConnected,
	setIsShelfConnected,
	isEnabled,
	setIsEnabled,
	disableAnimation = false,
	containerStyle,
}: LedToggleProps) {
	const { currentConfiguration, setCurrentConfiguration } = useConfiguration();
	const [isLoading, setIsLoading] = useState(!disableAnimation); // Skip loading for tutorial demos
	const [pendingToggle, setPendingToggle] = useState(false);
	const debouncedPendingToggle = useDebounce(pendingToggle, 300);

	const toggleOpacity = useRef(
		new Animated.Value(disableAnimation ? 1 : 0.3),
	).current;
	const thumbPosition = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchInitialStatus = async () => {
			try {
				const data = await getStatus();
				setIsEnabled(data.shelfOn);
				setIsShelfConnected(true);
			} catch (error) {
				console.error("Error fetching status:", error);
				setIsShelfConnected(false);
			} finally {
				setIsLoading(false);
			}
		};

		// Only fetch status for real toggles, not tutorial demos
		if (!disableAnimation) {
			fetchInitialStatus();
		}
	}, [setIsEnabled, setIsShelfConnected, disableAnimation]);

	useEffect(() => {
		// Skip loading animations for tutorial demos
		if (!disableAnimation) {
			Animated.timing(toggleOpacity, {
				toValue: isLoading ? 0.3 : 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isLoading, toggleOpacity, disableAnimation]);

	useEffect(() => {
		// Skip connection status animations for tutorial demos
		if (!disableAnimation && !isLoading) {
			Animated.timing(toggleOpacity, {
				toValue: isShelfConnected ? 1 : 0.7,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [isShelfConnected, isLoading, toggleOpacity, disableAnimation]);

	useEffect(() => {
		Animated.timing(thumbPosition, {
			toValue: isEnabled ? 2 : 28,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [isEnabled, thumbPosition]);

	useEffect(() => {
		thumbPosition.setValue(isEnabled ? 2 : 28);
	}, [isEnabled, thumbPosition.setValue]); // eslint-disable-line react-hooks/exhaustive-deps

	const toggleSwitch = async () => {
		if (isLoading) {
			return;
		}

		// For tutorial demos, just toggle the state without loading/API calls
		if (disableAnimation) {
			const newState = !isEnabled;
			setIsEnabled(newState);
			return;
		}

		setPendingToggle(true);
		const newState = !isEnabled;
		setIsEnabled(newState);
		setIsLoading(true);

		if (!currentConfiguration) {
			const startConfig: Setting = {
				name: "still",
				colors: [
					"#ff0000",
					"#ff4400",
					"#ff6a00",
					"#ff9100",
					"#ffee00",
					"#00ff1e",
					"#00ff44",
					"#00ff95",
					"#00ffff",
					"#0088ff",
					"#0000ff",
					"#8800ff",
					"#ff00ff",
					"#ff00bb",
					"#ff0088",
					"#ff0044",
				],
				whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				brightnessValues: [
					255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
					255, 255,
				],
				flashingPattern: "6",
				delayTime: 3,
			};
			setCurrentConfiguration(startConfig);
		} else {
			const startConfig: Setting = {
				name: currentConfiguration.name,
				colors: currentConfiguration.colors,
				whiteValues: currentConfiguration.whiteValues,
				brightnessValues: currentConfiguration.brightnessValues,
				flashingPattern: currentConfiguration.flashingPattern,
				delayTime: currentConfiguration.delayTime,
			};
			setCurrentConfiguration(startConfig);
		}

		try {
			if (newState) {
				// When turning on, send the current configuration
				if (currentConfiguration) {
					await toggleLed("on", {
						colors: currentConfiguration.colors,
						whiteValues: currentConfiguration.whiteValues,
						brightnessValues: currentConfiguration.brightnessValues,
						effectNumber: currentConfiguration.flashingPattern,
						delayTime: currentConfiguration.delayTime,
					});
				} else {
					// Use default homeostasis configuration
					await toggleLed("on");
				}
			} else {
				await toggleLed("off");
			}
			console.log(`LED toggled ${newState ? "on" : "off"}`);
			setIsShelfConnected(true);
		} catch (error) {
			console.error("Error toggling LED:", error);
			setIsShelfConnected(false);
		} finally {
			setIsLoading(false);
			setPendingToggle(false);
		}
	};

	return (
		<Animated.View
			style={[
				containerStyle ? {} : COMMON_STYLES.navButton,
				containerStyle ? containerStyle : { left: 20 },
				{ opacity: toggleOpacity },
			]}
		>
			<View style={styles.toggleContainer}>
				<TouchableOpacity
					style={[
						styles.customToggle,
						{
							backgroundColor: isEnabled
								? "#ffffff"
								: isShelfConnected
									? "#665e73"
									: "#444",
						},
					]}
					onPress={toggleSwitch}
					disabled={isLoading || debouncedPendingToggle || !isShelfConnected}
					activeOpacity={0.8}
				>
					<View
						style={[
							styles.iconContainer,
							styles.sunContainer,
							{ opacity: isEnabled ? 1 : 0.3 },
						]}
					>
						<Ionicons name="sunny" size={16} color="#000000" />
					</View>
					<View
						style={[
							styles.iconContainer,
							styles.moonContainer,
							{ opacity: !isEnabled ? 1 : 0.3 },
						]}
					>
						<Ionicons
							name="moon"
							size={16}
							color={isShelfConnected ? "#00ff00" : "#ff4444"}
						/>
					</View>
					<Animated.View
						style={[
							styles.toggleThumb,
							{
								backgroundColor: !isShelfConnected
									? "#666"
									: isEnabled
										? "#665e73"
										: "#f4f3f4",
								transform: [{ translateX: thumbPosition }],
							},
						]}
					/>
				</TouchableOpacity>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	toggleContainer: {
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	customToggle: {
		width: 60,
		height: 32,
		borderRadius: 16,
		position: "relative",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#333",
	},
	iconContainer: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		width: 20,
		height: 20,
	},
	sunContainer: {
		right: 6,
	},
	moonContainer: {
		left: 6,
	},
	toggleThumb: {
		width: 24,
		height: 24,
		borderRadius: 12,
		position: "absolute",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 3,
	},
});
