import {SafeAreaView, StyleSheet, Text} from "react-native";
import ColorDotsEditorEdition from "@/app/components/ColorDotEditorEdition";

export default function ColorEditor({navigation, route}: any) {
    const setting = route.params?.setting;
    return (
        <SafeAreaView style={styles.container}>

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
    }
});