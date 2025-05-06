import {Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import React, { useState, useEffect} from "react";
import {IP} from "@/app/configurations/constants";

export default function Welcome({navigation}: any) {

    function createButtonPressed() {
        navigation.navigate("Settings");
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

        fetchInitialStatus();
    }, []);

    const toggleSwitch = async() => {
        const newState = !isEnabled;
        setIsEnabled(newState);

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
    // When switch is toggled, send on/off API

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Hello</Text>
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
        color: "#ffffff",
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
    }
});
