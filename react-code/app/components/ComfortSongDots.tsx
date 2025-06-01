import {useState, useEffect} from "react";
import Dot from "@/app/components/Dot";
import {SafeAreaView, StyleSheet} from "react-native";
import Setting from "@/app/interface/setting-interface";

interface SettingItemProps {
    navigation: any
    setting: Setting,
}

// THE PIANO MAN - 2

export default function ComfortSongDots({setting}: SettingItemProps) {

    const COLOR_COUNT = setting.colors.length;

    const black = "#000000";

    const [dot0Color, setLED0Color] = useState(black);
    const [dot1Color, setLED1Color] = useState(black);
    const [dot2Color, setLED2Color] = useState(black);
    const [dot3Color, setLED3Color] = useState(black);
    const [dot4Color, setLED4Color] = useState(black);
    const [dot5Color, setLED5Color] = useState(black);
    const [dot6Color, setLED6Color] = useState(black);
    const [dot7Color, setLED7Color] = useState(black);
    const [dot8Color, setLED8Color] = useState(black);
    const [dot9Color, setLED9Color] = useState(black);
    const [dot10Color, setLED10Color] = useState(black);
    const [dot11Color, setLED11Color] = useState(black);
    const [dot12Color, setLED12Color] = useState(black);
    const [dot13Color, setLED13Color] = useState(black);
    const [dot14Color, setLED14Color] = useState(black);
    const [dot15Color, setLED15Color] = useState(black);

    type led = (color: string) => void;

    const setLed: led[] = [
        setLED0Color, setLED1Color, setLED2Color, setLED3Color,
        setLED4Color, setLED5Color, setLED6Color, setLED7Color,
        setLED8Color, setLED9Color, setLED10Color, setLED11Color,
        setLED12Color, setLED13Color, setLED14Color, setLED15Color
    ];

    const LIGHT_COUNT = setLed.length;
    const patternIndices= [1, 2, 3, 2, 4, 3, 2, 1, 0, 1, 2, 1, 3, 2, 1, 0 ];
    const pattern2Indices= [7, 8, 9, 8, 10, 9, 8, 7, 6, 7, 8, 7, 9, 8, 7, 6];
    const pattern3Indices= [13, 14, 15, 14, 16, 15, 14, 13, 12, 13, 14, 13, 15, 14, 13, 12];

    useEffect(() => {
        let isActive = true;

        const animate = async () => {
            if (!isActive) return;

            for (let x = 0; x < COLOR_COUNT; x++) {
                for (let i = 0; i < 2; i++) {
                    if (!isActive) return;

                    let index1 = patternIndices[x % LIGHT_COUNT] % LIGHT_COUNT;
                    let index2 = pattern2Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
                    let index3 = pattern3Indices[x % LIGHT_COUNT] % LIGHT_COUNT;

                    if (index1 < 0) index1 += LIGHT_COUNT;
                    if (index2 < 0) index2 += LIGHT_COUNT;
                    if (index3 < 0) index3 += LIGHT_COUNT;

                    setLed[index1](setting.colors[x % LIGHT_COUNT]);
                    await new Promise(resolve => setTimeout(resolve, setting.delayTime * 4));
                    setLed[index1](black);

                    setLed[index2](setting.colors[x % LIGHT_COUNT]);
                    await new Promise(resolve => setTimeout(resolve, setting.delayTime * 4));
                    setLed[index2](black);

                    setLed[index3](setting.colors[x % LIGHT_COUNT]);
                    await new Promise(resolve => setTimeout(resolve, setting.delayTime * 4));
                    setLed[index3](black);

                }
            }

            setTimeout(animate, setting.delayTime);
        };

        animate().then(() => {});

        return () => {
            isActive = false;
        };
    }, [setting.colors, setting.delayTime]);

    return (
        <SafeAreaView style={styles.background}>
            <Dot color={dot0Color} id={"dot_1"} />
            <Dot color={dot1Color} id={"dot_2"} />
            <Dot color={dot2Color} id={"dot_3"} />
            <Dot color={dot3Color} id={"dot_4"} />
            <Dot color={dot4Color} id={"dot_5"} />
            <Dot color={dot5Color} id={"dot_6"} />
            <Dot color={dot6Color} id={"dot_7"} />
            <Dot color={dot7Color} id={"dot_8"} />
            <Dot color={dot8Color} id={"dot_9"} />
            <Dot color={dot9Color} id={"dot_10"} />
            <Dot color={dot10Color} id={"dot_11"} />
            <Dot color={dot11Color} id={"dot_12"} />
            <Dot color={dot12Color} id={"dot_13"} />
            <Dot color={dot13Color} id={"dot_14"} />
            <Dot color={dot14Color} id={"dot_15"} />
            <Dot color={dot15Color} id={"dot_16"} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flexDirection: "row",
    },

})