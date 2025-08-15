import { useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	TextInput,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	Animated,
	View,
	ScrollView,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AnimatedTitle from "@/src/components/ui/AnimatedTitle";
import Button from "@/src/components/ui/buttons/Button";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import { COLORS, FONTS, COMMON_STYLES } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";
import { ApiService } from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import React from "react";
import { IpConfigService } from "../services/IpConfigService";
import { useDebounce } from "@/src/hooks/useDebounce";

export default function Welcome({ navigation }: any) {
	const { currentConfiguration, setCurrentConfiguration, setLastEdited, isShelfConnected, setIsShelfConnected } =
		useConfiguration();
	const [displayText, setDisplayText] = useState("");
	const fullText = "Hello";

	// Track each octet as an array of up to 4 characters
	const [octet1Chars, setOctet1Chars] = useState<string[]>([]);
	const [octet2Chars, setOctet2Chars] = useState<string[]>([]);
	const [octet3Chars, setOctet3Chars] = useState<string[]>([]);
	const [octet4Chars, setOctet4Chars] = useState<string[]>([]);

	const [savedIpAddress, setSavedIpAddress] = useState("");
	const [isIpValid, setIsIpValid] = useState(true);
	const [isSavingIp, setIsSavingIp] = useState(false);

	// Refs for auto-focusing between inputs
	const octet1Ref = useRef<TextInput>(null);
	const octet2Ref = useRef<TextInput>(null);
	const octet3Ref = useRef<TextInput>(null);
	const octet4Ref = useRef<TextInput>(null);
	const scrollViewRef = useRef<ScrollView>(null);

	// Convert character arrays to display/final values (handles leading zero removal)
	const getOctetValue = (chars: string[]) => {
		let returnOctet = '0';
		returnOctet = chars[3] !== undefined ? chars.join('').slice(1, 4) : chars[0] ? chars.join('') : '0';
		return returnOctet;
	};

	const ipOctet1 = getOctetValue(octet1Chars);
	const ipOctet2 = getOctetValue(octet2Chars);
	const ipOctet3 = getOctetValue(octet3Chars);
	const ipOctet4 = getOctetValue(octet4Chars);

	// Individual octet validation
	const isOctet1Valid = ipOctet1 === '' || (parseInt(ipOctet1, 10) >= 0 && parseInt(ipOctet1, 10) <= 255);
	const isOctet2Valid = ipOctet2 === '' || (parseInt(ipOctet2, 10) >= 0 && parseInt(ipOctet2, 10) <= 255);
	const isOctet3Valid = ipOctet3 === '' || (parseInt(ipOctet3, 10) >= 0 && parseInt(ipOctet3, 10) <= 255);
	const isOctet4Valid = ipOctet4 === '' || (parseInt(ipOctet4, 10) >= 0 && parseInt(ipOctet4, 10) <= 255);

	// Combine octets into full IP address (no individual debouncing)
	const ipAddress = `${ipOctet1}.${ipOctet2}.${ipOctet3}.${ipOctet4}`;
	const debouncedIpAddress = useDebounce(ipAddress, 100);

	useEffect(() => {
		const loadIp = async () => {
			const ip = await IpConfigService.getCurrentIp();
			const parts = ip.split('.');
			setOctet1Chars((parts[0] || '0').split(''));
			setOctet2Chars((parts[1] || '0').split(''));
			setOctet3Chars((parts[2] || '0').split(''));
			setOctet4Chars((parts[3] || '0').split(''));
			setSavedIpAddress(ip);
		};
		loadIp();
	}, []);

	useEffect(() => {
		setLastEdited("0");
	}, [setLastEdited]);

	useEffect(() => {
		if (displayText.length < fullText.length) {
			const timeout1 = setTimeout(() => {
				setDisplayText(fullText.substring(0, displayText.length + 1));
			}, 300);

			return () => {
				clearTimeout(timeout1);
			};
		}
	}, [displayText]);

	function createButtonPressed() {
		navigation.navigate("Settings");
	}

	const [isEnabled, setIsEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [pendingToggle, setPendingToggle] = useState(false);
	const debouncedPendingToggle = useDebounce(pendingToggle, 300);

	// Animation for toggle switch fade-in and connection feedback
	const toggleOpacity = useRef(new Animated.Value(0.3)).current;
	const thumbPosition = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const fetchInitialStatus = async () => {
			try {
				const data = await ApiService.getStatus();
				setIsEnabled(data.shelfOn);
				setIsShelfConnected(true);
			} catch (error) {
				console.error("Error fetching status:", error);
				setIsShelfConnected(false);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialStatus();
	}, [setIsShelfConnected]);

	// Animate toggle switch when it becomes available (only for initial load, not IP saves)
	useEffect(() => {
		// Only animate on initial load, not during IP save operations
		if (!isSavingIp) {
			Animated.timing(toggleOpacity, {
				toValue: isLoading ? 0.3 : 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isLoading, toggleOpacity, isSavingIp]);

	// Keep toggle dimmed when not connected
	useEffect(() => {
		if (!isSavingIp && !isLoading) {
			Animated.timing(toggleOpacity, {
				toValue: isShelfConnected ? 1 : 0.7,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [isShelfConnected, isSavingIp, isLoading, toggleOpacity]);

	// Animate thumb position when toggle state changes
	useEffect(() => {
		Animated.timing(thumbPosition, {
			toValue: isEnabled ? 28 : 2,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [isEnabled, thumbPosition]);

	// Initialize thumb position on component mount
	useEffect(() => {
		thumbPosition.setValue(isEnabled ? 28 : 2);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Auto-scroll with keyboard show/hide
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			scrollViewRef.current?.scrollTo({ y: 0, animated: true });
		});

		return () => {
			keyboardDidShowListener?.remove();
			keyboardDidHideListener?.remove();
		};
	}, []);

	const validateIp = (ip: string) => {
		const ipRegex =
			/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return ipRegex.test(ip);
	};

	// Check if IP has changed and is valid for enabling save button
	const isIpChanged = debouncedIpAddress !== savedIpAddress;
	const canSaveIp = isIpChanged && validateIp(debouncedIpAddress) && !isSavingIp;

	// Determine button text based on state
	const getSaveButtonText = () => {
		if (isSavingIp) return "Saving...";
		if (!isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid) return "Invalid IP";
		if (!isIpChanged && validateIp(debouncedIpAddress)) return "Saved";
		return "Save IP";
	};

	// Determine button style based on state
	const getSaveButtonStyle = () => {
		if (!isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid) return styles.saveButtonInvalid;
		if (canSaveIp) return styles.saveButton;
		return styles.saveButtonDisabled;
	};

	// Handle individual octet changes with auto-focus
	const handleOctet1Change = (value: string) => {
		const chars = value.split('').slice(0, 4);
		setOctet1Chars(chars);
		if ((chars.length === 3 && chars[0] !== '0') || (chars.length === 4 && chars[0] === '0')) {
			octet2Ref.current?.focus();
		}
	}; const handleOctet2Change = (value: string) => {
		const chars = value.split('').slice(0, 4);
		setOctet2Chars(chars);
		if ((chars.length === 3 && chars[0] !== '0') || (chars.length === 4 && chars[0] === '0')) {
			octet3Ref.current?.focus();
		}
	};

	const handleOctet3Change = (value: string) => {
		const chars = value.split('').slice(0, 4);
		setOctet3Chars(chars);
		if ((chars.length === 3 && chars[0] !== '0') || (chars.length === 4 && chars[0] === '0')) {
			octet4Ref.current?.focus();
		}
	};

	const handleOctet4Change = (value: string) => {
		const chars = value.split('').slice(0, 4);
		setOctet4Chars(chars);
	};

	// Update validation when values change
	useEffect(() => {
		setIsIpValid(validateIp(ipAddress));
	}, [ipAddress]);

	const handleSaveIp = async () => {
		if (!canSaveIp) {
			return;
		}

		// Use the current debounced IP address (already cleaned by getOctetValue)
		const finalIpAddress = debouncedIpAddress;

		setIsSavingIp(true);
		try {
			await IpConfigService.saveIpAddress(finalIpAddress);
			setSavedIpAddress(finalIpAddress);
			Keyboard.dismiss();
			// Re-check status after saving new IP
			try {
				const data = await ApiService.getStatus();
				setIsEnabled(data.shelfOn);
				setIsShelfConnected(true);
			} catch (error) {
				console.error("Error fetching status after IP change:", error);
				setIsEnabled(false); // Assume off if status check fails
				setIsShelfConnected(false);
			}
		} catch (error) {
			console.error("Error saving IP address:", error);
			Alert.alert("Error", "Failed to save IP address. Please try again.");
		} finally {
			setIsSavingIp(false);
		}
	};

	const toggleSwitch = async () => {
		// Prevent rapid toggling using debouncing
		if (isLoading) {
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
			const endpoint = newState ? "on" : "off";
			await ApiService.toggleLed(endpoint);
			console.log(`LED toggled ${endpoint}`);
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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView style={styles.container}>
				{/* Fixed elements that don't scroll */}
				<InfoButton />

				{/* LED Toggle in top left corner with connection status */}
				<Animated.View style={[COMMON_STYLES.navButton, { left: 20, opacity: toggleOpacity }]}>
					<View style={styles.toggleContainer}>
						{/* Custom Toggle with Sun/Moon Icons */}
						<TouchableOpacity
							style={[
								styles.customToggle,
								{ backgroundColor: isEnabled ? "#ffffff" : (isShelfConnected ? "#665e73" : "#444") }
							]}
							onPress={toggleSwitch}
							disabled={isLoading || debouncedPendingToggle || !isShelfConnected}
							activeOpacity={0.8}
						>
							{/* Sun Icon (Always black when on) */}
							<View style={[
								styles.iconContainer,
								styles.sunContainer,
								{ opacity: isEnabled ? 1 : 0.3 }
							]}>
								<Ionicons 
									name="sunny" 
									size={16} 
									color="#000000" 
								/>
							</View>
							
							{/* Moon Icon (Green when available/off, Red when unavailable) */}
							<View style={[
								styles.iconContainer,
								styles.moonContainer,
								{ opacity: !isEnabled ? 1 : 0.3 }
							]}>
								<Ionicons 
									name="moon" 
									size={16} 
									color={isShelfConnected ? "#00ff00" : "#ff4444"} 
								/>
							</View>
							
							{/* Toggle Thumb */}
							<Animated.View style={[
								styles.toggleThumb,
								{
									backgroundColor: !isShelfConnected ? "#666" : (isEnabled ? "#665e73" : "#f4f3f4"),
									transform: [{ translateX: thumbPosition }]
								}
							]} />
						</TouchableOpacity>
					</View>
				</Animated.View>

				{/* Scrollable content area */}
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					style={styles.scrollView}
					scrollEnabled={false}
				>
					<View style={styles.titleContainer}>
						<AnimatedTitle text={displayText} fontSize={130} marginBottom="10%" />
					</View>
					<Button
						title="Create ⟩"
						onPress={createButtonPressed}
						variant="welcome"
						textStyle={styles.buttonText}
					/>
					<View style={styles.ipContainer}>
						<TextInput
							ref={octet1Ref}
							style={[styles.ipOctet, !isOctet1Valid ? styles.ipInputError : null]}
							value={ipOctet1}
							onChangeText={handleOctet1Change}
							placeholder="192"
							placeholderTextColor="#888"
							keyboardType="numeric"
							textAlign="center"
							returnKeyType="next"
							clearButtonMode="while-editing"
							onSubmitEditing={() => octet2Ref.current?.focus()}
						/>
						<Text style={styles.ipDot}>.</Text>
						<TextInput
							ref={octet2Ref}
							style={[styles.ipOctet, !isOctet2Valid ? styles.ipInputError : null]}
							value={ipOctet2}
							onChangeText={handleOctet2Change}
							placeholder="168"
							placeholderTextColor="#888"
							keyboardType="numeric"
							textAlign="center"
							returnKeyType="next"
							clearButtonMode="while-editing"
							onSubmitEditing={() => octet3Ref.current?.focus()}
						/>
						<Text style={styles.ipDot}>.</Text>
						<TextInput
							ref={octet3Ref}
							style={[styles.ipOctet, !isOctet3Valid ? styles.ipInputError : null]}
							value={ipOctet3}
							onChangeText={handleOctet3Change}
							placeholder="1"
							placeholderTextColor="#888"
							keyboardType="numeric"
							textAlign="center"
							returnKeyType="next"
							clearButtonMode="while-editing"
							onSubmitEditing={() => octet4Ref.current?.focus()}
						/>
						<Text style={styles.ipDot}>.</Text>
						<TextInput
							ref={octet4Ref}
							style={[styles.ipOctet, !isOctet4Valid ? styles.ipInputError : null]}
							value={ipOctet4}
							onChangeText={handleOctet4Change}
							placeholder="100"
							placeholderTextColor="#888"
							keyboardType="numeric"
							textAlign="center"
							returnKeyType="done"
							clearButtonMode="while-editing"
							onSubmitEditing={handleSaveIp}
						/>
					</View>
					<Button
						title={getSaveButtonText()}
						onPress={handleSaveIp}
						variant="secondary"
						style={getSaveButtonStyle()}
						disabled={!canSaveIp}
					/>

					{/* Extra spacing to ensure keyboard clearance */}
					<View style={{ height: 250 }} />
				</ScrollView>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.BLACK,
	},
	keyboardAvoidingView: {
		flex: 1,
		width: "100%",
	},
	scrollContent: {
		flexGrow: 1,
		alignItems: "center",
		paddingBottom: 50,
		paddingTop: 120, // Space for fixed elements at top
		minHeight: "100%", // Ensure content can scroll
	},
	scrollView: {
		flex: 1,
		width: "100%",
	},
	titleContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	ipContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10,
	},
	ipOctet: {
		backgroundColor: "#333",
		color: COLORS.WHITE,
		paddingHorizontal: 8,
		paddingVertical: 10,
		borderRadius: 8,
		width: 70,
		textAlign: "center",
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#555",
	},
	ipDot: {
		color: COLORS.WHITE,
		fontSize: 18,
		marginHorizontal: 5,
		fontWeight: "bold",
	},
	ipInput: {
		backgroundColor: "#333",
		color: COLORS.WHITE,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 8,
		width: "80%",
		textAlign: "center",
		marginBottom: 10,
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#555",
	},
	ipInputError: {
		borderColor: COLORS.ERROR,
	},
	saveButton: {
		marginBottom: 20,
	},
	saveButtonDisabled: {
		marginBottom: 20,
		opacity: 0.5,
	},
	saveButtonInvalid: {
		marginBottom: 20,
		opacity: 0.5,
		borderColor: COLORS.ERROR,
		borderWidth: 1,
	},
	buttonText: {
		color: COLORS.WHITE,
		fontSize: 40,
		fontFamily: FONTS.SIGNATURE,
	},
	switch: {
		transformOrigin: "center",
		transform: "scale(1.5)",
		marginTop: 30,
	},
	toggleContainer: {
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	customToggle: {
		width: 60,
		height: 32,
		borderRadius: 16,
		position: 'relative',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: '#333',
	},
	iconContainer: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		width: 20,
		height: 20,
	},
	sunContainer: {
		left: 6,
	},
	moonContainer: {
		right: 6,
	},
	toggleThumb: {
		width: 24,
		height: 24,
		borderRadius: 12,
		position: 'absolute',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 3,
	},
});
