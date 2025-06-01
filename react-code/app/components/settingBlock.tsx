import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import { IP } from "@/app/configurations/constants";
import { useConfiguration } from "@/app/context/ConfigurationContext";

interface SettingItemProps {
    navigation: any
    setting: Setting,
    style: any,
    animated: boolean,
    index?: number,
}



const SettingBlock = ({navigation, setting, style, animated, index}: SettingItemProps) => {
    const { currentConfiguration, setCurrentConfiguration, setLastEdited } = useConfiguration();

    if(!setting){
        return null;
    }




    const dotsRendered = () => {
        if (animated) {
            switch (setting!.flashingPattern) {
                case "0":
                    return <BlenderDots navigation={navigation} setting={setting}/>;
                case "1":
                    return <ChristmasDots navigation={navigation} setting={setting}/>;
                case "2":
                    return <ComfortSongDots navigation={navigation} setting={setting}/>;
                case "3":
                    return <FunkyDots navigation={navigation} setting={setting}/>;
                case "4":
                    return <MoldDots navigation={navigation} setting={setting}/>;
                case "5":
                    return <ProgressiveDots navigation={navigation} setting={setting}/>;
                case "6":
                    return <StillEffectDots navigation={navigation} setting={setting}/>;
                case "7":
                    return <StrobeChangeDots navigation={navigation} setting={setting}/>;
                case "8":
                    return <TechnoDots navigation={navigation} setting={setting}/>;
                case "9":
                    return <TraceManyDots navigation={navigation} setting={setting}/>;
                case "10":
                    return <TraceOneDots navigation={navigation} setting={setting}/>;
                case "11":
                    return <TranceDots navigation={navigation} setting={setting}/>;
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
            {animated && (
                <View style={[style]}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.whiteText}>{setting.name.toLowerCase()}</Text>
                    </View>

                    {dotsRendered()}
                    <View style={styles.buttonsContainer}>

                    <TouchableOpacity style={styles.styleAButton} onPress={() => {
                            setLastEdited(index!.toString());
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
                                    delayTime: parseInt(String(setting.delayTime)),
                                    effectNumber: effectNumber(setting.flashingPattern),
                                    whiteValues: setting.whiteValues,
                                    brightnessValues: setting.brightnessValues,
                                    colors: setting.colors,
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log("success: ", data);
                                    setCurrentConfiguration(setting)
                                    console.log("\"\u001b[39m\"Current Configuration: " + currentConfiguration?.name);
                                })
                                .catch(error => console.error('Error: ', error));
                        }}>
                            <Text style={styles.buttons}>Flash</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!animated && (
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
        fontSize: 50,
        fontFamily: "Thesignature",
        textAlign: "center", // Add this to center the text
        flexWrap: "nowrap",
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
    },
    headerContainer: {
        width: "100%",
        alignItems: "center", // Center children horizontally
        justifyContent: "center", // Center children vertically
        paddingHorizontal: 40, // Add extra padding to account for the delete button
        position: "relative", // Make sure positioning context is established
    },
    // Update styles in settingBlock.tsx
    deleteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default SettingBlock;