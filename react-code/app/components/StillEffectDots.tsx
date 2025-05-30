import {useState} from "react";
import Dot from "@/app/components/Dot";
import {SafeAreaView, StyleSheet, View} from "react-native";
import Setting from "@/app/interface/setting-interface";

interface SettingItemProps {
    navigation: any
    setting: Setting,
}

// STILL - 6

export default function StillEffectDots({navigation, setting}: SettingItemProps) {

    const black = "#000000";

    const [dot0Color, setLED0Color] = useState(setting.colors[0]);
    const [dot1Color, setLED1Color] = useState(setting.colors[1]);
    const [dot2Color, setLED2Color] = useState(setting.colors[2]);
    const [dot3Color, setLED3Color] = useState(setting.colors[3]);
    const [dot4Color, setLED4Color] = useState(setting.colors[4]);
    const [dot5Color, setLED5Color] = useState(setting.colors[5]);
    const [dot6Color, setLED6Color] = useState(setting.colors[6]);
    const [dot7Color, setLED7Color] = useState(setting.colors[7]);
    const [dot8Color, setLED8Color] = useState(setting.colors[8]);
    const [dot9Color, setLED9Color] = useState(setting.colors[9]);
    const [dot10Color, setLED10Color] = useState(setting.colors[10]);
    const [dot11Color, setLED11Color] = useState(setting.colors[11]);
    const [dot12Color, setLED12Color] = useState(setting.colors[12]);
    const [dot13Color, setLED13Color] = useState(setting.colors[13]);
    const [dot14Color, setLED14Color] = useState(setting.colors[14]);
    const [dot15Color, setLED15Color] = useState(setting.colors[15]);

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
    
    // No ANIMATION for still effect
    // Will need to use passed in stuff though
    
}

const styles = StyleSheet.create({
    background: {
        flexDirection: "row",
    },

})