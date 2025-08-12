import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Slider from "@react-native-community/slider";
import React, {useEffect, useState} from "react";
import AnimatedDots from "@/app/components/AnimatedDots";
import Picker from "@/app/components/Picker";
import {useThrottle} from "expo-dev-launcher/bundle/hooks/useDebounce";
import {loadData, saveData} from "@/app/settings";
import {useConfiguration} from "@/app/context/ConfigurationContext";
import {IP} from "@/app/configurations/constants";
import {Ionicons} from "@expo/vector-icons";


/**
 * This page should edit:
 *      The effect number - everything else should be disabled until the user has selected a setting other than STILL (6)
 *      Then...
 *      The delayTime - this should be a ratio of the value the user chooses.
 *          The user should choose the 'speed'
 *          The greater the speed, the shorter the delay time.*/

export default function FlashingPatternEditor({ route, navigation }: any) {
    const { currentConfiguration, setLastEdited } = useConfiguration();

    const setting  = route.params?.setting;

    const [initialDelayTime] = React.useState(setting.delayTime);
    const [initialFlashingPattern] = React.useState(setting.flashingPattern);

    const [BPM, setBPM] = React.useState(0);
    const throttledBPM = useThrottle(BPM);
    const [delayTime, setDelayTime] = React.useState(setting.delayTime);
    const throttledDelayTime = useThrottle(delayTime);
    const [flashingPattern, setFlashingPattern] = React.useState(setting.flashingPattern);
    const throttledFlashingPattern = useThrottle(flashingPattern);

    const [previewMode, setPreviewMode] = useState(false);


    useEffect(() => {
        const initialBpm = parseFloat(calculateBPM(setting.delayTime));
        setBPM(isNaN(initialBpm) ? 0 : initialBpm);
    }, []);

    const calculateBPM = (delayTime: number) : string => {
        return ((60000 / (64 * delayTime))).toFixed(0);
    }

    const calculateDelayTime = (bpm: number): number => {
        return Math.round(60000 / (64 * bpm));
    }

    const modeDots = () => {
        const newSetting = {
            ...setting,
            delayTime: throttledDelayTime,
            flashingPattern: flashingPattern,
        }

        return <AnimatedDots navigation={navigation} setting={newSetting} key={`${flashingPattern}-${delayTime}`}/>;
    }

    const handleSave = async () => {
        setting.delayTime = Math.round(delayTime);
        setting.flashingPattern = flashingPattern;

        if (route.params?.isNew) {
            const settings = await loadData();

            const updatedSettings = [...settings, setting];
            await saveData(updatedSettings);

            const newIndex = updatedSettings.length - 1;
            setLastEdited(newIndex.toString());

            navigation.navigate("Settings", {setting});
        } else {
            const settings = await loadData();
            const updatedSettings = settings!.map(s =>
                s.name === setting.name ?
                {...s, delayTime: Math.round(delayTime), flashingPattern: flashingPattern} : s
            );
            await saveData(updatedSettings);
            const currentIndex = updatedSettings.findIndex(s => s.name === setting.name);
            setLastEdited(currentIndex.toString());
            navigation.navigate("Settings", {setting});
        }
    };

    const previewAPI = () => {
        fetch(`http://${IP}/api/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                colors: setting.colors,
                whiteValues: setting.whiteValues,
                brightnessValues: setting.brightnessValues,
                effectNumber: flashingPattern,
                delayTime: delayTime,
            })
        }).then(response => response.json())
            .then(data => console.log("success: ", data))
            .catch(error => console.error('Error: ', error));
    };

    const unPreviewAPI = () => {
        setPreviewMode(false);
        fetch(`http://${IP}/api/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                delayTime: currentConfiguration?.delayTime,
                effectNumber: currentConfiguration?.flashingPattern,
                whiteValues: currentConfiguration?.whiteValues,
                brightnessValues: currentConfiguration?.brightnessValues,
                colors: currentConfiguration?.colors,
            })
        }).then(response => response.json())
            .then(data => console.log("success: ", data))
            .catch(error => console.error('Error: ', error));
    };

    function navigateToInfo() {
        navigation.navigate("Info");
    }

    return (
        <SafeAreaView  style={styles.container}>
            <TouchableOpacity
                style={styles.infoButton}
                onPress={navigateToInfo}
            >
                <Ionicons name="information-circle-outline" size={32} color="white" />
            </TouchableOpacity>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => {
                    unPreviewAPI();
                    navigation.goBack();
                }}>
                    <Text style={styles.backB}>    ⪡    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.whiteText}>{setting.name}</Text>


            <View>
                {modeDots()}
            </View>

            <View style={styles.fpContainer}>
                {/*<Text style={styles.flashingPatternText}>{setting.delayTime}</Text>*/}
                <Picker
                    navigation={navigation}
                    setting={setting}
                    selectedPattern={throttledFlashingPattern}
                    setSelectedPattern={setFlashingPattern}
                />                {/*<Text style={styles.sliderText}>Hex: #</Text>
                <TextInput
                    style={[styles.hexInput]}
                    value={hexInput}
                    onChangeText={handleHexInput}
                    placeholder="FFFFFF"
                    placeholderTextColor="#666"
                    maxLength={6}
                    editable={selectedDot !== null}
                />

                TODO: This needs edited to display a vertical carousel of the flashing pattern options

                */}
            </View>

            <View style={styles.sliderContainer}>
                <View style={styles.sliderRow}>
                    <Text style={styles.sliderText}>Speed: {BPM.toFixed(0)} bpm</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={40}
                        maximumValue={180}
                        value={throttledBPM}
                        onValueChange={value => {
                            setBPM(value);
                            const newDelayTime = calculateDelayTime(value);
                            setDelayTime(newDelayTime);
                        }}
                        minimumTrackTintColor="#ff0000"
                        maximumTrackTintColor="#ffffff"
                        thumbTintColor="#ffffff"

                    />
                </View>

            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.styleAButton, { opacity: (delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern) ? 1 : 0.5 }]}
                        onPress={() => {
                            setDelayTime(initialDelayTime);
                            setBPM(parseFloat(calculateBPM(initialDelayTime)));
                            setFlashingPattern(initialFlashingPattern);
                            unPreviewAPI();
                        }}
                        disabled={delayTime === initialDelayTime && flashingPattern === initialFlashingPattern}
                    >
                        <Text style={styles.button}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.styleAButton, { opacity: delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern ? 1 : 0.5 }]}
                        onPress={handleSave}
                        disabled={delayTime === initialDelayTime && flashingPattern === initialFlashingPattern}
                    >
                        <Text style={styles.button}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={!(delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern) && previewMode ? styles.styleADisabledButton : styles.styleAButton}
                        key={(delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern).toString()}
                        onPress={
                            () => {
                                previewAPI();
                                setPreviewMode(true);
                            }
                        }
                    >
                        <Text style={styles.button}>{previewMode && (delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern) ? "Update" : "Preview"}</Text>
                    </TouchableOpacity>


                </View>
            </View>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;


const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
    },
    styleADisabledButton: {
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 8 * scale,
        paddingHorizontal: 15 * scale,
        alignItems: "center",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ffffff",
        width: "30%",
        opacity: 0.5,
    },
    backButton: {
        height: height / 12,
        width: "100%",
        marginBottom: scale*10,
    },
    backB: {
        color: "white",
        fontSize: 30 * scale,
    },
    whiteText: {
        color: "white",
        fontSize: 50 * scale,
        fontFamily: "Thesignature",
        textAlign: "center",
        marginTop: height * 0.05,
        marginBottom: height * 0.03,
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderColor: "white",
        width: width * 0.8,
    },
    flashingPatternText: {
        color: "white",
        fontSize: 22 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,
        padding: 15 * scale,

    },
    fpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.02,
        width: width * 0.85,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#ffffff",
        padding: 10 * scale,
        borderRadius: 10,
    },
    sliderContainer: {
        width: width * 0.85,
        marginTop: height * 0.02,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#ffffff",
        padding: 15 * scale,
        borderRadius: 10,
    },
    sliderRow: {
        marginVertical: 5 * scale,
    },
    slider: {
        width: "100%",
        height: 30 * scale,
    },
    sliderText: {
        color: "white",
        fontSize: 22 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,
    },
    buttonContainer: {
        width: width * 0.85,
        marginTop: height * 0.02,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8 * scale,
    },
    styleAButton: {
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 8 * scale,
        paddingHorizontal: 15 * scale,
        alignItems: "center",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ffffff",
        width: "30%",
    },
    button: {
        color: "white",
        fontSize: 25 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,

    },
    infoButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    }
});
