import { Dimensions, SafeAreaView, Text, StyleSheet, TouchableOpacity, View} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
} from "react-native-reanimated-carousel";
import React from "react";
import Setting from "@/app/interface/setting-interface";
import SettingBlock from "@/app/components/settingBlock";

let data: Setting[] = [
    { // stillOne (0) stillMany (1)
        name: "Stasis",
        colors: [
            "#ff0000",
            "#ff4400",
            "#ff6a00",
            "#ff9100",
            "#ffee00",
            "#00ff1e",
            "#00ff44",
            "#00ff95",
            "#00ffff",
            "#0088ff",
            "#0000ff",
            "#8800ff",
            "#ff00ff",
            "#ff00bb",
            "#ff0088",
            "#ff0044"],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "STILL",
        delayTime: 3,
    },
    { // traceOne (2)
        name: "Trace One",
        colors: [
            "#FF3366",
            "#FF6B3D",
            "#FF9F33",
            "#FFD433",
            "#B4DE2C",
            "#44D492",
            "#2CC4DE",
            "#3399FF",
            "#5B7CFF",
            "#8A5CFF",
            "#B94DFF",
            "#E633FF",
            "#FF339F",
            "#FF3366",
            "#FF4D4D",
            "#FF3366"
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "TRACE ONE",
        delayTime: 3,
    },
    { // traceMany (4)
        name: "Trace Many",
        colors: [
            "#A10000",
            "#CD3400",
            "#AC132A",
            "#131534",
            "#470023",
            "#D72300",
            "#CD260F",
            "#BE2852",
            "#BE1452",
            "#CD2623",
            "#D72100",
            "#470041",
            "#13374B",
            "#AC130A",
            "#CD3400",
            "#A1000C"
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "TRACE MANY",
        delayTime: 3,
    },
    { // progressive (3)
        name: "Progressive",
        colors: [
            "#FF0000",
            "#FF5501",
            "#FF2800",
            "#FF0F02",
            "#0000EF",
            "#FF2D03",
            "#FF3B00",
            "#FF0200",
            "#FF0000",
            "#FF5501",
            "#FF2800",
            "#FF0F02",
            "#0000EF",
            "#FF2D03",
            "#FF3B00",
            "#FF0200"
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "PROGRESSIVE",
        delayTime: 3,
    },
    { // strobeChange (5)
        name: "Strobe Change",
        colors: [
            "#FF5F6D", // Coral Pink
            "#FF817E", // Salmon
            "#FFA194", // Peach
            "#FFB5A6", // Light Peach
            "#FFD0B5", // Soft Orange
            "#FFE4C8", // Cream
            "#F8D5A3", // Sand
            "#E5B78F", // Tan
            "#D49B7C", // Light Brown
            "#C37F6A", // Terracotta
            "#B26459", // Rust
            "#A14B4B", // Dark Red
            "#8F3B3B", // Deep Red
            "#7D2F2F", // Burgundy
            "#6B2424", // Dark Burgundy
            "#591919"  // Deep Brown
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "STROBE CHANGE",
        delayTime: 3,
    },
    { // comfortSongStrobe (6)
        name: "Comfort Song",
        colors: [
            "#FF003C", // Neon Red
            "#00FF3C", // Matrix Green
            "#3C00FF", // Electric Blue
            "#FF003C", // Neon Red
            "#00FF3C", // Matrix Green
            "#3C00FF", // Electric Blue
            "#FF00FF", // Magenta
            "#00FFFF", // Cyan
            "#FF003C", // Neon Red
            "#00FF3C", // Matrix Green
            "#3C00FF", // Electric Blue
            "#FF00FF", // Magenta
            "#00FFFF", // Cyan
            "#FF003C", // Neon Red
            "#00FF3C", // Matrix Green
            "#3C00FF"  // Electric Blue
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "COMFORT SONG",
        delayTime: 3,
    },
    { // blender (7)
        name: "Blender",
        colors: [
            "#FF00FF",
            "#000000",
            "#FF00FF",
            "#0000FF",
            "#FF00FF",
            "#FF0000",
            "#0000FF",
            "#0000FF",
            "#0000FF",
            "#FF00FF",
            "#FF0000",
            "#0000FF",
            "#0000FF",
            "#FF00FF",
            "#000000",
            "#FF0000"
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "BLENDER",
        delayTime: 3,
    },
    { // techno (8)
        name: "Techno",
        colors: [
            "#00BFFF", // Electric Blue
            "#FF8C00", // Dark Orange
            "#4169E1", // Royal Blue
            "#FFA500", // Pure Orange
            "#1E90FF", // Dodger Blue
            "#FF4500", // Orange Red
            "#0047AB", // Cobalt Blue
            "#FF6B00", // Bright Orange
            "#000080", // Navy Blue
            "#FFB347", // Pastel Orange
            "#4682B4", // Steel Blue
            "#FF7F50", // Coral Orange
            "#0F52BA", // Sapphire Blue
            "#FF5F1F", // Vivid Orange
            "#000F89", // Deep Space Blue
            "#FF4000"  // Burnt Orange
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "TECHNO",
        delayTime: 2,
    },
    { // trance (9)
        name: "Trance",
        colors: ["#00FF00", "#00C800", "#006400", "#009600", "#003200", "#00FF00", "#00B400", "#00E600", "#005A00", "#003200", "#00B400", "#00D200", "#000000", "#007800", "#006400", "#00FF00"],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "TRANCE",
        delayTime: 3,
    },
    { // mold (10)
        name: "Mold",
        colors: [
            "#FF4C00", // Pumpkin Orange
            "#6F00FF", // Deep Purple
            "#FF4C00", // Pumpkin Orange
            "#6F00FF", // Deep Purple
            "#39FF14", // Toxic Green
            "#FF0000", // Blood Red
            "#39FF14", // Toxic Green
            "#FF0000", // Blood Red
            "#FF4C00", // Pumpkin Orange
            "#6F00FF", // Deep Purple
            "#FF4C00", // Pumpkin Orange
            "#6F00FF", // Deep Purple
            "#39FF14", // Toxic Green
            "#FF0000", // Blood Red
            "#39FF14", // Toxic Green
            "#FF0000"  // Blood Red
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "MOLD",
        delayTime: 3,
    },
    { // funky (11)
        name: "Funky",
        colors: [
            "#2E8B57", // Sea Green
            "#1B4D3E", // Deep Pine
            "#50C878", // Emerald
            "#228B22", // Forest Green
            "#355E3B", // Hunter Green
            "#90EE90", // Light Green
            "#32CD32", // Lime Green
            "#006400", // Dark Green
            "#2E8B57", // Sea Green
            "#1B4D3E", // Deep Pine
            "#50C878", // Emerald
            "#228B22", // Forest Green
            "#355E3B", // Hunter Green
            "#90EE90", // Light Green
            "#32CD32", // Lime Green
            "#006400"  // Dark Green
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "FUNKY",
        delayTime: 3,
    },
    { // christmas (12)
        name: "Christmas",
        colors: [
            "#FF1493", // Deep Pink
            "#FF69B4", // Hot Pink
            "#DA70D6", // Orchid
            "#BA55D3", // Medium Orchid
            "#9932CC", // Dark Orchid
            "#8B008B", // Dark Magenta
            "#800080", // Purple
            "#9400D3", // Dark Violet
            "#FF1493", // Deep Pink
            "#FF69B4", // Hot Pink
            "#DA70D6", // Orchid
            "#BA55D3", // Medium Orchid
            "#9932CC", // Dark Orchid
            "#8B008B", // Dark Magenta
            "#800080", // Purple
            "#9400D3"  // Dark Violet
        ],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        flashingPattern: "CHRISTMAS",
        delayTime: 3,
    },
    {
        name: "+",
        colors: ["#000000", "#000000","#000000", "#000000","#000000", "#000000","#000000", "#000000","#000000", "#000000","#000000", "#000000","#000000", "#000000","#000000", "#000000"],
        whiteValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        brightnessValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        flashingPattern: "",
        delayTime: 0,
    }
];
let primKey: number[] = Array.from({ length: data.length }, (_, i) => i);
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Settings({navigation}: any) {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // TODO
    // Read from file
    // for each item in data, push the index to primKey

    return (
        <SafeAreaView style={styles.container}>
            {/*Back Button*/}
            <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
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
                <TouchableOpacity onPress={() => navigation.navigate("ChooseModification", {
                    setting: data[currentIndex % data.length]
                })}>
                    <View style={styles.focusedItem}>
                    <SettingBlock animated={true} style={styles.nothing} setting={data[currentIndex % data.length]} />
{/*
                    <Text style={styles.whiteText}>{data[currentIndex % data.length].delayTime} Insert delay shower here</Text>
*/}
                    </View>
                </TouchableOpacity>

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
                            <SettingBlock animated={false} style={styles.renderItem} setting={data[item]} />
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