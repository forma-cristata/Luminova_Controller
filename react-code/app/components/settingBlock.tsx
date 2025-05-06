import {View, Text, StyleSheet, Button, Dimensions, TouchableOpacity} from "react-native";
import Setting from "@/app/interface/setting-interface";
import ColorDots from "@/app/components/ColorDots";
import StillEffectDots from "@/app/components/StillEffectDots";
import BlenderDots from "@/app/components/BlenderDots";
import ChristmasDots from "@/app/components/ChristmasDots";
import ComfortSongDots from "@/app/components/ComfortSongDots";
import FunkyDots from "@/app/components/FunkyDots";
import MoldDots from "@/app/components/MoldDots";
import ProgressiveDots from "@/app/components/ProgressiveDots";
import StrobeChangeDots from "@/app/components/StrobeChangeDots";
import TechnoDots from "@/app/components/TechnoDots";
import TranceDots from "@/app/components/TranceDots";
import TraceManyDots from "@/app/components/TraceManyDots";
import TraceOneDots from "@/app/components/TraceOneDots";
import {navigate} from "expo-router/build/global-state/routing";
import {IP} from "@/app/configurations/constants";

interface SettingItemProps {
    navigation: any
    setting: Setting,
    style: any,
    animated: boolean,
}



const SettingBlock = ({navigation, setting, style, animated}: SettingItemProps) => {
    // Assuming props.setting.colors is an array of color objects

    const dotsRendered = () => {
        if (animated) {
            switch (setting.flashingPattern) {
                case "0":
                    return <BlenderDots colors={setting.colors}/>;
                case "1":
                    return <ChristmasDots colors={setting.colors}/>;
                case "2":
                    return <ComfortSongDots colors={setting.colors}/>;
                case "3":
                    return <FunkyDots colors={setting.colors}/>;
                case "4":
                    return <MoldDots colors={setting.colors}/>;
                case "5":
                    return <ProgressiveDots colors={setting.colors}/>;
                case "6":
                    return <StillEffectDots colors={setting.colors}/>;
                case "7":
                    return <StrobeChangeDots colors={setting.colors}/>;
                case "8":
                    return <TechnoDots colors={setting.colors}/>;
                case "9":
                    return <TraceManyDots colors={setting.colors}/>;
                case "10":
                    return <TraceOneDots colors={setting.colors}/>;
                case "11":
                    return <TranceDots colors={setting.colors}/>;
                default:
                    return <ColorDots colors={setting.colors}/>;
            }
        } else {
            return <ColorDots colors={setting.colors}/>;
        }
    }


    const effectNumber = (flashingPattern: string) => {
        return parseInt(flashingPattern);
    }



    return (
        <>
            {/*Top Section*/}
            {animated &&
            (
                <View style={style}>
                    <Text style={styles.whiteText}>{setting.name.toLowerCase()}</Text>

                    {dotsRendered()}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.styleAButton} onPress={() => {
                            navigation.navigate("ChooseModification", {setting: setting});
                        }}>
                            <Text style={styles.buttons}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.styleAButton} onPress={() => {
                            fetch(`http://${IP}/api/config`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    delayTime: setting.delayTime,
                                    effectNumber: effectNumber(setting.flashingPattern),
                                    whiteValues: setting.whiteValues,
                                    brightnessValues: setting.brightnessValues,
                                    colors: setting.colors,
                                })
                            })
                                .then(response => response.json())
                                .then(data => console.log("success: ", data))
                                .catch(error => console.error('Error: ', error));
                        }}>
                            <Text style={styles.buttons}>Flash</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )}

            {/*Carousel Section*/}
            {!animated &&
            (
                <View style={style}>
                    <Text style={styles.whiteTextSmaller}>{setting.name.toLowerCase()}</Text>

                    {dotsRendered()}

                </View>
            )}


        </>


    );
}

const styles = StyleSheet.create({
    whiteText: {
        color: "white",
        fontSize: 80,
        fontFamily: "Thesignature",
    },
    whiteTextSmaller: {
        color: "white",
        fontSize: 60,
        fontFamily: "Thesignature",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
        width: "100%",
        paddingHorizontal: 20,

    },
    buttons: {
        color: "white",
        fontSize: 40,
        fontFamily: "Clearlight-lJlq",

    },
    styleAButton: {
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        width: "45%",
        alignItems: "center",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ffffff",
    }
});

export default SettingBlock;

// Read from the saved settings in the file for the settings page.
// format as an object that displays the settings in a list
// Pass those into each settingBlock

// Once a setting is SELECTED, PASS IN ITS VARIABLES TO THE page being shown
// and allow modification to these values while viewing this page.
// If they save, save the settings to the file.
