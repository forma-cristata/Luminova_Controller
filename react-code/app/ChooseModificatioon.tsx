import {StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Dimensions} from "react-native";
import ColorDots from "@/app/components/ColorDots";
import Setting from "@/app/interface/setting-interface";

interface ChooseModificatioonProps {
    navigation: any;
}

export default function ChooseModificatioon({navigation, route}: any) {
    const setting = route.params?.setting as Setting;


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
                    <Text style={styles.text}>Insert mode section here</Text>
                </View>

                <View style={styles.colorSection}>
                    <View style={styles.dotContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("ColorEditor", {setting: setting})}>
                            <ColorDots colors={setting.colors} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dotContainer: {
        transformOrigin: "left center",
        transform: "rotate(90deg) scale(1.8)",
        marginTop: "10%",
        marginLeft: "50%",

    },
    modeSection: {
        height: Dimensions.get('window').height * 0.86,
        width: Dimensions.get('window').width * 0.5,
        marginTop: Dimensions.get('window').height * 0.05 + 40,
/*
        backgroundColor: "blue",
*/
    },
    colorSection: {
        height: Dimensions.get('window').height * 0.88,
        width: Dimensions.get('window').width * 0.5,
        marginTop: 100,
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