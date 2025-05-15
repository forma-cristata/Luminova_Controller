import { Dimensions, SafeAreaView, Text, StyleSheet, TouchableOpacity, View} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
} from "react-native-reanimated-carousel";
import React from "react";
import Setting from "@/app/interface/setting-interface";
import SettingBlock from "@/app/components/settingBlock";

import jsonData from './configurations/modes.json';
console.log("jsonData: " + jsonData);
// If settings has changed, save the json file back.
const data = jsonData.settings as Setting[];

let primKey: number[] = Array.from({ length: data.length }, (_, i) => i);
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Settings({navigation}: any) {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    return (
        <SafeAreaView style={styles.container}>
            {/*Back Button*/}
            <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backB}>    ⟨    </Text>
            </TouchableOpacity>
            </View>

            <View style={styles.notBackButton}>
                {/*Title*/}
                <View style={styles.title}>
                    <Text style={styles.text}>Settings</Text>
                </View>

                {/*See: https://reactnative.dev/docs/intro-react*/}
                {/*Carousel Focus Item*/}

                    <View style={styles.focusedItem}>
                    <SettingBlock navigation={navigation} animated={true} style={styles.nothing} setting={data[currentIndex % data.length]} />
{/*
                    <Text style={styles.whiteText}>{data[currentIndex % data.length].delayTime} Insert delay shower here</Text>
*/}
                    </View>

                {/*Carousel*/}
                <View style={styles.carCont}>
                    <Carousel
                        ref={ref}
                        data={primKey}
                        width={width}
                        defaultIndex={0}
                        enabled={true}
                        onProgressChange={(offset, absoluteProgress) => {
                            progress.value = offset;
                            setCurrentIndex(Math.round(absoluteProgress));
                        }}
                        renderItem={({item}: {item: number}) => (
                            <SettingBlock navigation={navigation} animated={false} style={styles.renderItem} setting={data[item]} />
                        )}
                        mode="parallax"
                        style={styles.carousel}
                    />

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    text: {
        fontFamily: "Thesignature",
        fontSize: 130,
        color: "#ffffff",
    },
    backButton: {
        height: height / 10,
        width: "100%",
    },
    notBackButton: {
        height: "90%",
    },
    renderItem: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 7,
        width: width,
        height: height * 9 / 50,
        justifyContent: "center",
        alignItems: "center"
    },
    whiteText: {
        color: "white",
    },
    carCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    carousel: {
        flex: 1,
        height: height * 2 /10,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    focusedItem: {
        height: height / 2.5,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        height: height * 2/10,
        justifyContent: "center",
        alignItems: "center"
    },
    backB: {
        color: '#ffffff',
        textAlign: 'left',
        fontSize: 30
    },
    nothing: {
        justifyContent: "center",
        alignItems: "center"    }
});