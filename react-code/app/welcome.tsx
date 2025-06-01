import { useConfiguration } from './context/ConfigurationContext';
import {Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, { useState, useEffect} from "react";
import {IP} from "@/app/configurations/constants";
import Setting from "@/app/interface/setting-interface";
import { Ionicons } from '@expo/vector-icons';

export default function Welcome({navigation}: any) {

    const { currentConfiguration, setCurrentConfiguration, setLastEdited } = useConfiguration();

    const [displayText, setDisplayText] = useState("");
    const [textColor, setTextColor] = useState("#ffffff");
    const fullText = "Hello";

    useEffect(() => {
        setLastEdited("0");
    }, []);

    useEffect(() => {
        if (displayText.length < fullText.length) {
            const timeout1 = setTimeout(() => {
                setDisplayText(fullText.substring(0, displayText.length + 1));
            }, 300);

            return () => {
                clearTimeout(timeout1);
            }
        }
    }, [displayText, fullText]);

    useEffect(() => {
        const animationColors = ['#ff0000', '#000000', '#ff4400', '#000000', '#ff6a00', '#000000', '#ff9100', '#000000', '#ffee00', '#000000', '#00ff1e', '#000000', '#00ff44', '#000000', '#00ff95', '#000000', '#00ffff', '#000000', '#0088ff', '#000000', '#0000ff', '#000000', '#8800ff', '#000000', '#d300ff', '#000000', '#ff00BB', '#000000', '#ff0088', '#000000', '#ff0031', '#000000'];
        let colorIndex = 0;

        const colorInterval = setInterval(() => {
            setTextColor(animationColors[colorIndex]);
            colorIndex = (colorIndex + 1) % animationColors.length;
        }, 5);

        return () => {
            clearInterval(colorInterval);
        }
    }, []);

    function createButtonPressed() {
        navigation.navigate("Settings");
    }

    function navigateToInfo() {
        navigation.navigate("Info");
    }

    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialStatus = async () => {
            try {
                const response = await fetch(`http://${IP}/api/status`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsEnabled(data.shelfOn);
                } else {
                    console.error("Failed to fetch initial status");
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialStatus().then(() => {});
    }, []);

    const toggleSwitch = async() => {
        const newState = !isEnabled;
        setIsEnabled(newState);

        if(!currentConfiguration) {
            let startConfig: Setting = {
                name: "still",
                colors: [
                    "#ff0000", "#ff4400", "#ff6a00", "#ff9100", "#ffee00",
                    "#00ff1e", "#00ff44", "#00ff95", "#00ffff", "#0088ff",
                    "#0000ff", "#8800ff", "#ff00ff", "#ff00bb", "#ff0088", "#ff0044"
                ],
                whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
                flashingPattern: "6",
                delayTime: 3
            }

            setCurrentConfiguration(startConfig);

        }
        else {
            let startConfig: Setting = {
                name: currentConfiguration.name,
                colors: currentConfiguration.colors,
                whiteValues: currentConfiguration.whiteValues,
                brightnessValues: currentConfiguration.brightnessValues,
                flashingPattern: currentConfiguration.flashingPattern,
                delayTime: currentConfiguration.delayTime
            }
            setCurrentConfiguration(startConfig);
        }


        try{
            const endpoint = newState ? 'on': 'off';
            const response = await fetch(`http://${IP}/api/led/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if(!response.ok) {
                console.error("API request failed");
            }
        }
        catch (error){
            console.error("error toggling");
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={navigateToInfo}
                >
                    <Ionicons name="information-circle-outline" size={32} color="white" />
                </TouchableOpacity>
                <Text style={[styles.text, {color: textColor}]} key={textColor}>{displayText}</Text>
                <TouchableOpacity style={styles.styleAButton} onPress={createButtonPressed}>
                    <Text style={styles.button}>Create     ⟩</Text>
                </TouchableOpacity>
                <Switch onValueChange={toggleSwitch}
                        value={isEnabled}
                        trackColor={{false: '#665e73', true: '#ffffff'}}
                        thumbColor={isEnabled ? '#665e73' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        style={styles.switch}
                        disabled={isLoading}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    text: {
        marginBottom: "20%",
        fontFamily: "Thesignature",
        fontSize: 130,
    },
    button: {
        color: "white",
        fontSize: 40,
        fontFamily: "Thesignature",
    },
    switch: {
        transformOrigin: "center",
        transform: "scale(1.5)",
    },
    styleAButton: {
        marginBottom: "25%",
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ffffff",
    },
    infoButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    }
});
