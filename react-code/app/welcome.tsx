import {Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { useState} from "react";

export default function Welcome({navigation}: any) {

    function createButtonPressed() {
        navigation.navigate("Settings");
    }

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    // When switch is toggled, send on/off API

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Hello</Text>
                <TouchableOpacity style={styles.styleAButton} onPress={createButtonPressed}>
                    <Text style={styles.button}>Create     ⟩</Text>
                </TouchableOpacity>
                <Switch onValueChange={toggleSwitch} value={isEnabled}
                        trackColor={{false: '#665e73', true: '#ffffff'}}
                        thumbColor={isEnabled ? '#665e73' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        style={styles.switch}/>
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
    switch: {},
    styleAButton: {
        marginBottom: "20%",
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
