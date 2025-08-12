import {StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Dimensions} from "react-native";
import ColorDots from "@/app/components/ColorDots";
import Setting from "@/app/interface/setting-interface";
import AnimatedDots from "@/app/components/AnimatedDots";
import {Ionicons} from "@expo/vector-icons";

export default function ChooseModificatioon({navigation, route}: any) {
    const setting = route.params?.setting as Setting;
    const modeDots = () => {
        return <AnimatedDots navigation={navigation} setting={setting}/>;
    };

    function navigateToInfo() {
        navigation.navigate("Info");
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.infoButton}
                onPress={navigateToInfo}
            >
                <Ionicons name="information-circle-outline" size={32} color="white" />
            </TouchableOpacity>
            {/*Back Button*/}
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backB}>    ⪡    </Text>
                </TouchableOpacity>
            </View>
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
    infoButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    }
})

