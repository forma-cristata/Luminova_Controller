import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Slider from "@react-native-community/slider";
import React, {useEffect, useState} from "react";
import AnimatedDots from "@/app/components/AnimatedDots";
import Picker from "@/app/components/Picker";
import {useThrottle} from "expo-dev-launcher/bundle/hooks/useDebounce";
import {loadData, saveData} from "@/app/settings";
import {useConfiguration} from "@/app/context/ConfigurationContext";
import {IP} from "@/app/configurations/constants";
import InfoButton from "@/app/components/InfoButton";
import BackButton from "@/app/components/BackButton";
import { COMMON_STYLES, COLORS, FONTS, DIMENSIONS } from "@/app/components/SharedStyles";
import { ApiService } from "@/app/services/ApiService";


/**
 * This page should edit:
 *      The effect number - everything else should be disabled until the user has selected a setting other than STILL (6)
 *      Then...
 *      The delayTime - this should be a ratio of the value the user chooses.
 *          The user should choose the 'speed'
 *          The greater the speed, the shorter the delay time.*/

export default function FlashingPatternEditor({ route, navigation }: any) {
    const { currentConfiguration, setLastEdited } = useConfiguration();

    const setting = route.params?.setting;
    const isNew = route.params?.isNew || false;

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

        if (isNew) {
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

    const previewAPI = async () => {
        try {
            await ApiService.postConfig({
                colors: setting.colors,
                whiteValues: setting.whiteValues,
                brightnessValues: setting.brightnessValues,
                effectNumber: flashingPattern,
                delayTime: delayTime,
            });
            console.log("Preview successful");
        } catch (error) {
            console.error('Preview error:', error);
        }
    };

    const unPreviewAPI = async () => {
        setPreviewMode(false);
        if (currentConfiguration) {
            try {
                await ApiService.restoreConfiguration(currentConfiguration);
                console.log("Configuration restored");
            } catch (error) {
                console.error('Restore error:', error);
            }
        }
    };

    function navigateToInfo() {
        navigation.navigate("Info");
    }

    return (
        <SafeAreaView style={COMMON_STYLES.container}>
            <InfoButton onPress={navigateToInfo} />            <BackButton 
                onPress={() => {
                    unPreviewAPI();
                    navigation.goBack();
                }}
                style={styles.backButton}
            />
            <Text style={styles.whiteText}>{setting.name}</Text>

            <View>
                {modeDots()}
            </View>

            <View style={styles.fpContainer}>
                <Picker
                    navigation={navigation}
                    setting={setting}
                    selectedPattern={throttledFlashingPattern}
                    setSelectedPattern={setFlashingPattern}
                />
            </View>

            <View style={COMMON_STYLES.sliderContainer}>
                <View style={styles.sliderRow}>
                    <Text style={COMMON_STYLES.sliderText}>Speed: {BPM.toFixed(0)} bpm</Text>
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
                        maximumTrackTintColor={COLORS.WHITE}
                        thumbTintColor={COLORS.WHITE}
                    />
                </View>
            </View>

            <View style={COMMON_STYLES.buttonContainer}>
                <View style={COMMON_STYLES.buttonRow}>
                    <TouchableOpacity
                        style={[COMMON_STYLES.styleAButton, { opacity: (delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern) ? 1 : COLORS.DISABLED_OPACITY }]}
                        onPress={() => {
                            setDelayTime(initialDelayTime);
                            setBPM(parseFloat(calculateBPM(initialDelayTime)));
                            setFlashingPattern(initialFlashingPattern);
                            unPreviewAPI();
                        }}
                        disabled={delayTime === initialDelayTime && flashingPattern === initialFlashingPattern}
                    >
                        <Text style={COMMON_STYLES.buttonText}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[COMMON_STYLES.styleAButton, { opacity: (delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern || isNew) ? 1 : COLORS.DISABLED_OPACITY }]}
                        onPress={handleSave}
                        disabled={!isNew && delayTime === initialDelayTime && flashingPattern === initialFlashingPattern}
                    >
                        <Text style={COMMON_STYLES.buttonText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={!(delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern) && previewMode ? COMMON_STYLES.styleADisabledButton : COMMON_STYLES.styleAButton}
                        key={(delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern).toString()}
                        onPress={() => {
                            previewAPI();
                            setPreviewMode(true);
                        }}
                    >
                        <Text style={COMMON_STYLES.buttonText}>{previewMode && (delayTime !== initialDelayTime || flashingPattern !== initialFlashingPattern) ? "Update" : "Preview"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;

const styles = StyleSheet.create({
    backButton: {
        height: height / 12,
        width: "100%",
        marginBottom: scale * 10,
    },
    backB: {
        color: COLORS.WHITE,
        fontSize: 30 * scale,
    },
    whiteText: {
        color: COLORS.WHITE,
        fontSize: 50 * scale,
        fontFamily: FONTS.SIGNATURE,
        textAlign: "center",
        marginTop: height * 0.05,
        marginBottom: height * 0.03,
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderColor: COLORS.WHITE,
        width: width * 0.8,
    },
    flashingPatternText: {
        color: COLORS.WHITE,
        fontSize: 22 * scale,
        fontFamily: FONTS.CLEAR,
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
        borderColor: COLORS.WHITE,
        padding: 10 * scale,
        borderRadius: 10,
    },
    sliderRow: {
        marginVertical: 5 * scale,
    },
    slider: {
        width: "100%",
        height: 30 * scale,
    }
});
