import React from "react";
import { useState, useEffect, useRef } from "react";
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	Keyboard,
	Alert,
} from "react-native";
import { getStatus } from "@/src/services/ApiService";
import { getCurrentIp, saveIpAddress } from "@/src/services/IpConfigService";
import { useDebounce } from "@/src/hooks/useDebounce";
import Button from "@/src/components/buttons/Button";
import { COLORS, FONTS, DIMENSIONS } from "@/src/styles/SharedStyles";

interface IpAddressInputProps {
	onIpSaved: (isEnabled: boolean, isConnected: boolean) => void;
}

export default function IpAddressInput({ onIpSaved }: IpAddressInputProps) {
	const [octet1Chars, setOctet1Chars] = useState<string[]>([]);
	const [octet2Chars, setOctet2Chars] = useState<string[]>([]);
	const [octet3Chars, setOctet3Chars] = useState<string[]>([]);
	const [octet4Chars, setOctet4Chars] = useState<string[]>([]);

	const [savedIpAddress, setSavedIpAddress] = useState("");
	const [isSavingIp, setIsSavingIp] = useState(false);

	const octet1Ref = useRef<TextInput>(null);
	const octet2Ref = useRef<TextInput>(null);
	const octet3Ref = useRef<TextInput>(null);
	const octet4Ref = useRef<TextInput>(null);

	const getOctetValue = (chars: string[]) => {
		let returnOctet = "0";
		returnOctet =
			chars[3] !== undefined && chars[0] === "0"
				? chars.join("").slice(1, 4)
				: chars[0]
					? chars.join("")
					: "0";
		return returnOctet;
	};

	const ipOctet1 = getOctetValue(octet1Chars);
	const ipOctet2 = getOctetValue(octet2Chars);
	const ipOctet3 = getOctetValue(octet3Chars);
	const ipOctet4 = getOctetValue(octet4Chars);

	const isOctet1Valid =
		ipOctet1 === "" ||
		(parseInt(ipOctet1, 10) >= 0 && parseInt(ipOctet1, 10) <= 255);
	const isOctet2Valid =
		ipOctet2 === "" ||
		(parseInt(ipOctet2, 10) >= 0 && parseInt(ipOctet2, 10) <= 255);
	const isOctet3Valid =
		ipOctet3 === "" ||
		(parseInt(ipOctet3, 10) >= 0 && parseInt(ipOctet3, 10) <= 255);
	const isOctet4Valid =
		ipOctet4 === "" ||
		(parseInt(ipOctet4, 10) >= 0 && parseInt(ipOctet4, 10) <= 255);

	const ipAddress = `${ipOctet1}.${ipOctet2}.${ipOctet3}.${ipOctet4}`;
	const debouncedIpAddress = useDebounce(ipAddress, 100);

	useEffect(() => {
		const loadIp = async () => {
			const ip = await getCurrentIp();
			const parts = ip.split(".");
			setOctet1Chars((parts[0] || "0").split(""));
			setOctet2Chars((parts[1] || "0").split(""));
			setOctet3Chars((parts[2] || "0").split(""));
			setOctet4Chars((parts[3] || "0").split(""));
			setSavedIpAddress(ip);
		};
		loadIp();
	}, []);

	const validateIp = (ip: string) => {
		const ipRegex =
			/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return ipRegex.test(ip);
	};

	const isIpChanged = debouncedIpAddress !== savedIpAddress;
	const canSaveIp =
		isIpChanged && validateIp(debouncedIpAddress) && !isSavingIp;

	const getSaveButtonText = () => {
		return isSavingIp
			? "Saving..."
			: !isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid
				? "Invalid IP"
				: !isIpChanged && validateIp(debouncedIpAddress)
					? "Saved"
					: "Save IP";
	};

	const getSaveButtonStyle = () => {
		if (!isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid)
			return styles.saveButtonInvalid;
		if (canSaveIp) return styles.saveButton;
		return styles.saveButtonDisabled;
	};

	const getSaveButtonTextStyle = () => {
		if (!isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid)
			return styles.saveButtonInvalidText;
		if (canSaveIp) return styles.saveButtonText;
		return styles.saveButtonDisabledText;
	};

	const handleOctetChange = (
		value: string,
		setter: React.Dispatch<React.SetStateAction<string[]>>,
		nextRef?: React.RefObject<TextInput | null>,
	) => {
		// Limit input length based on first character
		const maxLength = value[0] === "0" ? 4 : 3;
		const chars = value.split("").slice(0, maxLength);
		setter(chars);
		if (
			(chars.length === 3 && chars[0] !== "0") ||
			(chars.length === 4 && chars[0] === "0")
		) {
			nextRef?.current?.focus();
		}
	};

	const handleOctetBlur = (
		chars: string[],
		setter: React.Dispatch<React.SetStateAction<string[]>>,
	) => {
		// Trim leading zeros when focus is lost
		if (chars.length > 1 && chars[0] === "0") {
			const trimmed = chars.join("").replace(/^0+/, "") || "0";
			setter(trimmed.split(""));
		}
	};

	const handleSaveIp = async () => {
		if (!canSaveIp) {
			return;
		}

		const finalIpAddress = debouncedIpAddress;

		setIsSavingIp(true);
		try {
			// Save IP address to storage (this is fast)
			await saveIpAddress(finalIpAddress);
			setSavedIpAddress(finalIpAddress);
			Keyboard.dismiss();

			// Update UI immediately to show IP is saved
			setIsSavingIp(false);

			// Test connection in background with shorter timeout
			const connectionTest = async () => {
				try {
					// Create a promise that resolves faster than the default 5s timeout
					const timeoutPromise = new Promise((_, reject) =>
						setTimeout(() => reject(new Error("Connection timeout")), 2000),
					);

					const statusPromise = getStatus();
					const data = (await Promise.race([
						statusPromise,
						timeoutPromise,
					])) as { shelfOn: boolean };
					onIpSaved(data.shelfOn, true);
				} catch (error) {
					console.error("Error testing connection after IP change:", error);
					onIpSaved(false, false);
				}
			};

			// Run connection test in background without blocking UI
			connectionTest();
		} catch (error) {
			console.error("Error saving IP address:", error);
			Alert.alert("Error", "Failed to save IP address. Please try again.");
			setIsSavingIp(false);
		}
	};

	return (
		<>
			<View style={styles.ipContainer}>
				<TextInput
					ref={octet1Ref}
					style={[styles.ipOctet, !isOctet1Valid ? styles.ipInputError : null]}
					value={ipOctet1}
					onChangeText={(text) =>
						handleOctetChange(text, setOctet1Chars, octet2Ref)
					}
					onBlur={() => handleOctetBlur(octet1Chars, setOctet1Chars)}
					placeholder="192"
					placeholderTextColor={COLORS.PLACEHOLDER}
					keyboardType="numeric"
					textAlign="center"
					returnKeyType="next"
					clearButtonMode="while-editing"
					blurOnSubmit={false}
					keyboardAppearance="dark"
					onSubmitEditing={() => octet2Ref.current?.focus()}
				/>
				<Text style={styles.ipDot}>.</Text>
				<TextInput
					ref={octet2Ref}
					style={[styles.ipOctet, !isOctet2Valid ? styles.ipInputError : null]}
					value={ipOctet2}
					onChangeText={(text) =>
						handleOctetChange(text, setOctet2Chars, octet3Ref)
					}
					onBlur={() => handleOctetBlur(octet2Chars, setOctet2Chars)}
					placeholder="168"
					placeholderTextColor={COLORS.PLACEHOLDER}
					keyboardType="numeric"
					textAlign="center"
					returnKeyType="next"
					clearButtonMode="while-editing"
					blurOnSubmit={false}
					keyboardAppearance="dark"
					onSubmitEditing={() => octet3Ref.current?.focus()}
				/>
				<Text style={styles.ipDot}>.</Text>
				<TextInput
					ref={octet3Ref}
					style={[styles.ipOctet, !isOctet3Valid ? styles.ipInputError : null]}
					value={ipOctet3}
					onChangeText={(text) =>
						handleOctetChange(text, setOctet3Chars, octet4Ref)
					}
					onBlur={() => handleOctetBlur(octet3Chars, setOctet3Chars)}
					placeholder="1"
					placeholderTextColor={COLORS.PLACEHOLDER}
					keyboardType="numeric"
					textAlign="center"
					returnKeyType="next"
					clearButtonMode="while-editing"
					blurOnSubmit={false}
					keyboardAppearance="dark"
					onSubmitEditing={() => octet4Ref.current?.focus()}
				/>
				<Text style={styles.ipDot}>.</Text>
				<TextInput
					ref={octet4Ref}
					style={[styles.ipOctet, !isOctet4Valid ? styles.ipInputError : null]}
					value={ipOctet4}
					onChangeText={(text) =>
						handleOctetChange(text, setOctet4Chars, undefined)
					}
					onBlur={() => handleOctetBlur(octet4Chars, setOctet4Chars)}
					placeholder="100"
					placeholderTextColor={COLORS.PLACEHOLDER}
					keyboardType="numeric"
					textAlign="center"
					returnKeyType="done"
					clearButtonMode="while-editing"
					keyboardAppearance="dark"
					onSubmitEditing={handleSaveIp}
				/>
			</View>
			<Button
				title={getSaveButtonText()}
				onPress={handleSaveIp}
				variant="secondary"
				style={getSaveButtonStyle()}
				textStyle={getSaveButtonTextStyle()}
				disabled={!canSaveIp}
			/>
		</>
	);
}

const scale = DIMENSIONS.SCALE;

const styles = StyleSheet.create({
	ipContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10,
	},
	ipOctet: {
		color: COLORS.WHITE,
		fontSize: 22 * scale,
		fontFamily: FONTS.CLEAR,
		textTransform: "uppercase",
		letterSpacing: 2,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.WHITE,
		paddingVertical: 4,
		paddingHorizontal: 8,
		width: 70 * scale,
		textAlign: "center",
		backgroundColor: "transparent",
	},
	ipDot: {
		color: COLORS.WHITE,
		fontSize: 22 * scale,
		marginHorizontal: 5,
		fontFamily: FONTS.CLEAR,
		fontWeight: "bold",
	},
	ipInputError: {
		borderBottomColor: COLORS.ERROR,
	},
	saveButton: {
		marginBottom: 20,
		borderWidth: 0,
	},
	saveButtonText: {
		color: COLORS.WHITE,
	},
	saveButtonDisabled: {
		marginBottom: 20,
		opacity: 0.5,
		borderWidth: 0,
	},
	saveButtonDisabledText: {
		color: COLORS.WHITE,
	},
	saveButtonInvalid: {
		marginBottom: 20,
		opacity: 0.5,
		borderWidth: 0,
	},
	saveButtonInvalidText: {
		color: COLORS.ERROR,
	},
});
