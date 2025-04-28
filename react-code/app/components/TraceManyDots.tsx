import {useState, useEffect} from "react";
import Dot from "@/app/components/Dot";
import {SafeAreaView, StyleSheet, View} from "react-native";

interface ColorProps {
    colors: string[],
}

export default function TraceManyDots(props: ColorProps) {

    const COLOR_COUNT = props.colors.length;

    const [dot0Color, setLED0Color] = useState(props.colors[0]);
    const [dot1Color, setLED1Color] = useState(props.colors[1]);
    const [dot2Color, setLED2Color] = useState(props.colors[2]);
    const [dot3Color, setLED3Color] = useState(props.colors[3]);
    const [dot4Color, setLED4Color] = useState(props.colors[4]);
    const [dot5Color, setLED5Color] = useState(props.colors[5]);
    const [dot6Color, setLED6Color] = useState(props.colors[6]);
    const [dot7Color, setLED7Color] = useState(props.colors[7]);
    const [dot8Color, setLED8Color] = useState(props.colors[8]);
    const [dot9Color, setLED9Color] = useState(props.colors[9]);
    const [dot10Color, setLED10Color] = useState(props.colors[10]);
    const [dot11Color, setLED11Color] = useState(props.colors[11]);
    const [dot12Color, setLED12Color] = useState(props.colors[12]);
    const [dot13Color, setLED13Color] = useState(props.colors[13]);
    const [dot14Color, setLED14Color] = useState(props.colors[14]);
    const [dot15Color, setLED15Color] = useState(props.colors[15]);

    type led = (color: string) => void;

    const setLed: led[] = [
        setLED0Color, setLED1Color, setLED2Color, setLED3Color,
        setLED4Color, setLED5Color, setLED6Color, setLED7Color,
        setLED8Color, setLED9Color, setLED10Color, setLED11Color,
        setLED12Color, setLED13Color, setLED14Color, setLED15Color
    ];

    const LIGHT_COUNT = setLed.length;


    useEffect(() => {
        let isActive = true;

        const animate = async () => {
            if (!isActive) return;

            // Set all LEDs to black
            for (let i = 0; i < LIGHT_COUNT; i++) {
                setLed[i](props.colors[0]);
            }

            for (let i = 0; i < LIGHT_COUNT; i++) {
                for (let j = 0; j < LIGHT_COUNT/2; j++) {
                    let offset = (i + j * 2) % LIGHT_COUNT;
                    let colInd1 = ((i+1) % (COLOR_COUNT / 2));
                    let colInd2 = ((i+2) % COLOR_COUNT);

                    setLed[offset](props.colors[colInd1]);
                    await new Promise(resolve => setTimeout(resolve, 15));

                    offset = (i + j*2 + 8) % LIGHT_COUNT;
                    setLed[offset](props.colors[colInd2]);
                    await new Promise(resolve => setTimeout(resolve, 15));
                }
            }

            // Schedule next animation
            setTimeout(animate, 15);
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