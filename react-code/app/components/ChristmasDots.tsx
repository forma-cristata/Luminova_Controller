import {useState, useEffect} from "react";
import Dot from "@/app/components/Dot";
import {SafeAreaView, StyleSheet, View} from "react-native";

interface ColorProps {
    colors: string[],
}

export default function ChristmasDots(props: ColorProps) {

    const COLOR_COUNT = props.colors.length;

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
    const delayTime = 10;

    useEffect(() => {
        let isActive = true;

        const animate = async () => {
            for (let xy = 0; xy < COLOR_COUNT; xy++) {
                if (!isActive) return;

                for (let j = 0; j < LIGHT_COUNT; j += 2) {
                    if (!isActive) return;
                    await new Promise(resolve => setTimeout(resolve, delayTime));

                    setLed[j](props.colors[xy]);
                    if (j === 8) {
                        setLed[j](props.colors[(xy + 1) % COLOR_COUNT]);
                    }
                    if (j === 12) {
                        setLed[j](props.colors[(xy + 2) % COLOR_COUNT]);
                    }
                    setLed[(j + 1) % LIGHT_COUNT](props.colors[(xy + 3) % LIGHT_COUNT]);
                }

                for (let j = 1; j < LIGHT_COUNT; j += 2) {
                    if (!isActive) return;
                    await new Promise(resolve => setTimeout(resolve, delayTime));

                    setLed[j](props.colors[xy]);
                    setLed[j - 1](props.colors[(xy + 3) % COLOR_COUNT]);
                }
            }

            setTimeout(animate, delayTime);
        };

        animate();

        return () => {
            isActive = false;
        };
    }, [props.colors]);

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

    // TRACE ONE ANIMATION


}

const styles = StyleSheet.create({
    background: {
        flexDirection: "row",
    },

})