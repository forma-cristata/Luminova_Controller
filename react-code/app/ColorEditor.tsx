import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ColorDotsEditorEdition from "@/app/components/ColorDotEditorEdition";

export default function ColorEditor({navigation, route}: any) {
    const setting = route.params?.setting;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.navigate("ChooseModification", { setting })}>
                    <Text style={styles.backB}>    ⟨    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.whiteText}>{setting.name}</Text>
            <ColorDotsEditorEdition colors={setting.colors} />
        </SafeAreaView>
    )

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
    },
    whiteText: {
        color: "white",
        fontSize: 130,
        fontFamily: "Thesignature",
        textAlign: "center",
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
});