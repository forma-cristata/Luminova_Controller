import Setting from "@/app/interface/setting-interface";
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/index';


/**
 * This page should edit:
 *      The effect number - everything else should be disabled until the user has selected a setting other than STILL (6)
 *      Then...
 *      The delayTime - this should be a ratio of the value the user chooses.
 *          The user should choose the 'speed'
 *          The greater the speed, the shorter the delay time.*/

export default function FlashingPatternEditor({ route, navigation }: any) {
    const setting  = route.params?.setting;

    return (
        <SafeAreaView  style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backB}>    ⟨    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles=StyleSheet.create({
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
    },
    backB: {
        color: "white",
        fontSize: 30,
    },
});