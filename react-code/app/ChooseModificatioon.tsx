import {StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Dimensions} from "react-native";
import ColorDots from "@/app/components/ColorDots";
import Setting from "@/app/interface/setting-interface";
import BlenderDots from "@/app/components/BlenderDots";
import ChristmasDots from "@/app/components/ChristmasDots";
import ComfortSongDots from "@/app/components/ComfortSongDots";
import FunkyDots from "@/app/components/FunkyDots";
import MoldDots from "@/app/components/MoldDots";
import ProgressiveDots from "@/app/components/ProgressiveDots";
import StillEffectDots from "@/app/components/StillEffectDots";
import StrobeChangeDots from "@/app/components/StrobeChangeDots";
import TechnoDots from "@/app/components/TechnoDots";
import TraceManyDots from "@/app/components/TraceManyDots";
import TraceOneDots from "@/app/components/TraceOneDots";
import TranceDots from "@/app/components/TranceDots";

interface ChooseModificatioonProps {
    navigation: any;
}

export default function ChooseModificatioon({navigation, route}: any) {
    const setting = route.params?.setting as Setting;
    const modeDots = () => {
        switch (setting!.flashingPattern) {
            case "BLENDER":
                return <BlenderDots colors={setting.colors}/>;
            case "CHRISTMAS":
                return <ChristmasDots colors={setting.colors}/>;
            case "COMFORT SONG":
                return <ComfortSongDots colors={setting.colors}/>;
            case "FUNKY":
                return <FunkyDots colors={setting.colors}/>;
            case "MOLD":
                return <MoldDots colors={setting.colors}/>;
            case "PROGRESSIVE":
                return <ProgressiveDots colors={setting.colors}/>;
            case "STILL":
                return <StillEffectDots colors={setting.colors}/>;
            case "STROBE CHANGE":
                return <StrobeChangeDots colors={setting.colors}/>;
            case "TECHNO":
                return <TechnoDots colors={setting.colors}/>;
            case "TRACE MANY":
                return <TraceManyDots colors={setting.colors}/>;
            case "TRACE ONE":
                return <TraceOneDots colors={setting.colors}/>;
            case "TRANCE":
                return <TranceDots colors={setting.colors}/>;
            default:
                return <ColorDots colors={setting.colors}/>;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {/*Back Button*/}
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Text style={styles.backB}>    ⟨    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.notBackButton}>
                <View style={styles.modeSection}>
                    <Text style={styles.whiteText}>Flashing Pattern</Text>

                    <View style={styles.dotContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("ColorEditor", {setting: setting})}>
                            {modeDots()}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.colorSection}>
                    <View style={styles.dotContainer}>

                        <TouchableOpacity onPress={() => navigation.navigate("ColorEditor", {setting: setting})}>
                            <ColorDots colors={setting.colors} />
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.whiteTextColor}>Colors</Text>

                </View>
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dotContainer: {
        transformOrigin: "left center",
        transform: "rotate(90deg) scale(1.7)",
        marginTop: "5%",
        marginLeft: "50%",


    },
    whiteText: {
        color: "white",
        fontFamily: "Thesignature",
        fontSize: 29,

        textAlign: "right",

        borderStyle: "solid",
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: "white",
        width: "70%",
    },
    whiteTextColor: {
        color: "white",
        fontFamily: "Thesignature",
        fontSize: 29,
        marginTop: "290%",
        textAlign: "left",
        borderStyle: "solid",
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: "white",
        width: "70%",
        paddingLeft: 5,
        alignSelf: "flex-end"
    },


        modeSection: {
        height: Dimensions.get('window').height * 0.86,
        width: Dimensions.get('window').width * 0.5,

/*
        backgroundColor: "blue",
*/
    },
    colorSection: {
        height: Dimensions.get('window').height * 0.88,
        width: Dimensions.get('window').width * 0.5,

    },
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 0,
        width: "100%",
        height: Dimensions.get('window').height * 0.05,
/*
        backgroundColor: "red"
*/
    },
    notBackButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "30%",
    },
    title: {
        marginTop: 50,
    },
    text: {
        color: "white",
        fontSize: 30,
    },
    backB: {
        color: "white",
        fontSize: 30,
    },
})