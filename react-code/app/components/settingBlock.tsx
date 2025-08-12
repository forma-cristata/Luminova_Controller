import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Setting from "@/app/interface/setting-interface";
import ColorDots from "@/app/components/ColorDots";
import AnimatedDots from "@/app/components/AnimatedDots";
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
            return <AnimatedDots navigation={navigation} setting={setting}/>;
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
        textAlign: "center",
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
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        position: "relative",
    },
    deleteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default SettingBlock;

