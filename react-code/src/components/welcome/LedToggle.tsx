import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ApiService } from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";

interface LedToggleProps {
    isShelfConnected: boolean;
    setIsShelfConnected: (isConnected: boolean) => void;
    isEnabled: boolean;
    setIsEnabled: (isEnabled: boolean) => void;
}

export default function LedToggle({
    isShelfConnected,
    setIsShelfConnected,
    isEnabled,
    setIsEnabled,
}: LedToggleProps) {
    const { currentConfiguration, setCurrentConfiguration } = useConfiguration();
    const [isLoading, setIsLoading] = useState(true);
    const [pendingToggle, setPendingToggle] = useState(false);
    const debouncedPendingToggle = useDebounce(pendingToggle, 300);

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
    }, [setIsEnabled, setIsShelfConnected]);

    useEffect(() => {
        Animated.timing(toggleOpacity, {
            toValue: isLoading ? 0.3 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [isLoading, toggleOpacity]);

    useEffect(() => {
        if (!isLoading) {
            Animated.timing(toggleOpacity, {
                toValue: isShelfConnected ? 1 : 0.7,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isShelfConnected, isLoading, toggleOpacity]);

    useEffect(() => {
        Animated.timing(thumbPosition, {
            toValue: isEnabled ? 2 : 28,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isEnabled, thumbPosition]);

    useEffect(() => {
        thumbPosition.setValue(isEnabled ? 2 : 28);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleSwitch = async () => {
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
                    "#ff0000", "#ff4400", "#ff6a00", "#ff9100", "#ffee00", "#00ff1e",
                    "#00ff44", "#00ff95", "#00ffff", "#0088ff", "#0000ff", "#8800ff",
                    "#ff00ff", "#ff00bb", "#ff0088", "#ff0044",
                ],
                whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
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
        <Animated.View style={[COMMON_STYLES.navButton, { left: 20, opacity: toggleOpacity }]}>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[
                        styles.customToggle,
                        { backgroundColor: isEnabled ? "#ffffff" : (isShelfConnected ? "#665e73" : "#444") }
                    ]}
                    onPress={toggleSwitch}
                    disabled={isLoading || debouncedPendingToggle || !isShelfConnected}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, styles.sunContainer, { opacity: isEnabled ? 1 : 0.3 }]}>
                        <Ionicons name="sunny" size={16} color="#000000" />
                    </View>
                    <View style={[styles.iconContainer, styles.moonContainer, { opacity: !isEnabled ? 1 : 0.3 }]}>
                        <Ionicons name="moon" size={16} color={isShelfConnected ? "#00ff00" : "#ff4444"} />
                    </View>
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
    );
}

const styles = StyleSheet.create({
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
        right: 6,
    },
    moonContainer: {
        left: 6,
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
