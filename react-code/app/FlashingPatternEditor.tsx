import Setting from "@/app/interface/setting-interface";
import {Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/index';
import ColorDotsEditorEdition from "@/app/components/ColorDotEditorEdition";
import Slider from "@react-native-community/slider";
import React from "react";


/**
 * This page should edit:
 *      The effect number - everything else should be disabled until the user has selected a setting other than STILL (6)
 *      Then...
 *      The delayTime - this should be a ratio of the value the user chooses.
 *          The user should choose the 'speed'
 *          The greater the speed, the shorter the delay time.*/

export default function FlashingPatternEditor({ route, navigation }: any) {
    const setting  = route.params?.setting;
    const [BPM, setBPM] = React.useState(0);

    const calculateBPM = (delayTime: number) : string => {

        switch(setting.flashingPattern) {
            case 0:
                // Stuck in a blender
                return (30000 / delayTime).toString();
            case 1:
                // Smolder
                // BPM = 60000 / (16 * delayTime * 72.5)
                return (60000 / (16 * delayTime * 72.5)).toString();
            case 2:
                // The Piano Man
                // BPM = (60000 ms/min) / 16 * (setting.delayTime / 2) * 4ms
                return (60000 / (16 * (delayTime / 2) * 4)).toString();
            case 3:
                // Feel the Funk
                // BPM = 60000 / (delayTime * 1.4996)
                return (60000 / (delayTime * 1.4996)).toString();
            case 4:
                // Decay
                // BPM = 125 / delayTime
                return (125 / delayTime).toString();
            case 5:
                // Cortez
                // Total cycle time =
                // BPM = 60000 / (16 * 16 * delayTime * 2)
                return (60000 / (16 * 16 * delayTime * 2)).toString();
            case 7:
                // The Underground
                // BPM = 60000 / (16 * 16 * setting.delayTime * 6)
                return (60000 / (16 * 16 * delayTime * 6)).toString();
            case 8:
                // Berghain Bitte
                // BPM = 60000 / (16 × 16 × 2 × 5 × setting.delayTime)
                return (60000 / (16 * 16 * 2 * 5 * delayTime)).toString();
            case 9:
                // Lapis Lazuli
                // BPM = (60000) ÷ (256 × setting.delayTime)
                return (60000 / (256 * delayTime)).toString();
            case 10:
                // Medusa
                // BPM = 60000 / (16 × 4 × 16 × setting.delayTime)
                return (60000 / (16 * 4 * 16 * delayTime)).toString();
            case 11:
                // State of Trance
                // BPM = 312.5 / setting.delayTime
                return (312.5 / delayTime).toString();
            default:
                // Still (replaces case 6)
                // No BPM calculation needed
                return "0";
        }
    }

    return (
        <SafeAreaView  style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backB}>    ⟨    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.whiteText}>{setting.name}</Text>
            {/*<ColorDotsEditorEdition
                colors={colors}
                onDotSelect={handleDotSelect}
                selectedDot={selectedDot}
                key={colors.join(',')} // Force re-render when colors change
            />

            TODO: This needs edited to show the animation the same way as in ChooseModification

            */}

            <View style={styles.fpContainer}>
                <Text style={styles.flashingPatternText}>TODO</Text>
                {/*<Text style={styles.sliderText}>Hex: #</Text>
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
                    <Text style={styles.sliderText}>Speed: {calculateBPM(setting.delayTime)} bpm</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={200}
                        value={BPM}
                        /*
                        TODO:
                            onValueChange={ value => {
                            onSlidingComplete={}}*/
                        minimumTrackTintColor="#ff0000"
                        maximumTrackTintColor="#ffffff"
                    />
                </View>

            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.styleAButton}
/*
                        TODO: onPress={}
*/
/*
                        TODO: disabled={}
*/
                    >
                        <Text style={styles.button}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.styleAButton}
                        /*
                        TODO:
                            onPress={}
                            disabled={}
                        */
                    >
                        <Text style={styles.button}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375; // Base scale factor


const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 0,
        width: "100%",
        height: Dimensions.get('window').height * 0.05,
    },
    backB: {
        color: "white",
        fontSize: 30,
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
        width: "48%",
    },
    button: {
        color: "white",
        fontSize: 30 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,

    }
});