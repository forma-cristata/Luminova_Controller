import Setting from "@/app/interface/setting-interface";
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/index';

type Props = NativeStackScreenProps<RootStackParamList, 'FlashingPatternEditor'>;

export default function FlashingPatternEditor({ route, navigation }: Props) {
    const { setting } = route.params;

    return (
        <SafeAreaView>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.navigate("ChooseModification", { setting })}>
                    <Text style={styles.backB}>    ⟨    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles=StyleSheet.create({
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