import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Keyboard,
    Alert,
    Platform,
} from "react-native";
import { ApiService } from "@/src/services/ApiService";
import { IpConfigService } from "@/src/services/IpConfigService";
import { useDebounce } from "@/src/hooks/useDebounce";
import Button from "@/src/components/ui/buttons/Button";
import { COLORS } from "@/src/styles/SharedStyles";

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
            const ip = await IpConfigService.getCurrentIp();
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
        if (isSavingIp) return "Saving...";
        if (!isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid)
            return "Invalid IP";
        if (!isIpChanged && validateIp(debouncedIpAddress)) return "Saved";
        return "Save IP";
    };

    const getSaveButtonStyle = () => {
        if (!isOctet1Valid || !isOctet2Valid || !isOctet3Valid || !isOctet4Valid)
            return styles.saveButtonInvalid;
        if (canSaveIp) return styles.saveButton;
        return styles.saveButtonDisabled;
    };

    const handleOctetChange = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        nextRef?: React.RefObject<TextInput | null>
    ) => {
        const chars = value.split("").slice(0, 4);
        setter(chars);
        if (
            (chars.length === 3 && chars[0] !== "0") ||
            (chars.length === 4 && chars[0] === "0")
        ) {
            nextRef?.current?.focus();
        }
    };

    const handleSaveIp = async () => {
        if (!canSaveIp) {
            return;
        }

        const finalIpAddress = debouncedIpAddress;

        setIsSavingIp(true);
        try {
            await IpConfigService.saveIpAddress(finalIpAddress);
            setSavedIpAddress(finalIpAddress);
            Keyboard.dismiss();
            try {
                const data = await ApiService.getStatus();
                onIpSaved(data.shelfOn, true);
            } catch (error) {
                console.error("Error fetching status after IP change:", error);
                onIpSaved(false, false);
            }
        } catch (error) {
            console.error("Error saving IP address:", error);
            Alert.alert("Error", "Failed to save IP address. Please try again.");
        } finally {
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
                    onChangeText={(text) => handleOctetChange(text, setOctet1Chars, octet2Ref)}
                    placeholder="192"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    textAlign="center"
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    blurOnSubmit={false}
                    onSubmitEditing={() => octet2Ref.current?.focus()}
                />
                <Text style={styles.ipDot}>.</Text>
                <TextInput
                    ref={octet2Ref}
                    style={[styles.ipOctet, !isOctet2Valid ? styles.ipInputError : null]}
                    value={ipOctet2}
                    onChangeText={(text) => handleOctetChange(text, setOctet2Chars, octet3Ref)}
                    placeholder="168"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    textAlign="center"
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    blurOnSubmit={false}
                    onSubmitEditing={() => octet3Ref.current?.focus()}
                />
                <Text style={styles.ipDot}>.</Text>
                <TextInput
                    ref={octet3Ref}
                    style={[styles.ipOctet, !isOctet3Valid ? styles.ipInputError : null]}
                    value={ipOctet3}
                    onChangeText={(text) => handleOctetChange(text, setOctet3Chars, octet4Ref)}
                    placeholder="1"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    textAlign="center"
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    blurOnSubmit={false}
                    onSubmitEditing={() => octet4Ref.current?.focus()}
                />
                <Text style={styles.ipDot}>.</Text>
                <TextInput
                    ref={octet4Ref}
                    style={[styles.ipOctet, !isOctet4Valid ? styles.ipInputError : null]}
                    value={ipOctet4}
                    onChangeText={(text) => handleOctetChange(text, setOctet4Chars, undefined)}
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
        </>
    );
}

const styles = StyleSheet.create({
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
});
