import {StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Dimensions} from "react-native";
import ColorDots from "@/app/components/ColorDots";
import {Setting} from "@/app/interface/setting-interface";
import AnimatedDots from "@/app/components/AnimatedDots";
import InfoButton from "@/app/components/InfoButton";
import BackButton from "@/app/components/BackButton";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ChooseModificatioon({navigation, route}: any) {
    const setting = route.params?.setting as Setting;
    const modeDots = () => {
        return <AnimatedDots navigation={navigation} setting={setting}/>;
    };

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>            
        <InfoButton />
            <BackButton onPress={() => navigation.goBack()} />
            <View style={styles.notBackButton}>
                <View style={styles.modeSection}>
                    <Text style={styles.whiteText}>Flashing Pattern</Text>
                    <View style={styles.dotContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("FlashingPatternEditor", {setting: setting})}>
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
        </SafeAreaProvider>
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
    },
    colorSection: {
        height: Dimensions.get('window').height * 0.88,
        width: Dimensions.get('window').width * 0.5,
    },
    container: {
        flex: 1,
        backgroundColor: "#000000",
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
    }
});
