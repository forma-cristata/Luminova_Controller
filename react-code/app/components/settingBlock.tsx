import {View, Text, StyleSheet} from "react-native";
import Setting from "@/app/interface/setting-interface";
import ColorDots from "@/app/components/ColorDots";
import StillEffectDots from "@/app/components/StillEffectDots";
import BlenderDots from "@/app/components/BlenderDots";
import ChristmasDots from "@/app/components/ChristmasDots";
import ComfortSongDots from "@/app/components/ComfortSongDots";
import FunkyDots from "@/app/components/FunkyDots";
import MoldDots from "@/app/components/MoldDots";
import ProgressiveDots from "@/app/components/ProgressiveDots";
import StrobeChangeDots from "@/app/components/StrobeChangeDots";
import TechnoDots from "@/app/components/TechnoDots";
import TranceDots from "@/app/components/TranceDots";
import TraceManyDots from "@/app/components/TraceManyDots";
import TraceOneDots from "@/app/components/TraceOneDots";

interface SettingItemProps{
        setting: Setting,
        style: any,
}


const SettingBlock = (props: SettingItemProps) => {
    // Assuming props.setting.colors is an array of color objects

    const dotsRendered = () => {
        switch (props.setting.flashingPattern) {
            case "BLENDER":
                return <BlenderDots colors={props.setting.colors}/>;
            case "CHRISTMAS":
                return <ChristmasDots colors={props.setting.colors}/>;
            case "COMFORT SONG":
                return <ComfortSongDots colors={props.setting.colors}/>;
            case "FUNKY":
                return <FunkyDots colors={props.setting.colors}/>;
            case "MOLD":
                return <MoldDots colors={props.setting.colors}/>;
            case "PROGRESSIVE":
                return <ProgressiveDots colors={props.setting.colors}/>;
            case "STILL":
                return <StillEffectDots colors={props.setting.colors}/>;
            case "STROBE CHANGE":
                return <StrobeChangeDots colors={props.setting.colors}/>;
            case "TECHNO":
                return <TechnoDots colors={props.setting.colors}/>;
            case "TRACE MANY":
                return <TraceManyDots colors={props.setting.colors}/>;
            case "TRACE ONE":
                return <TraceOneDots colors={props.setting.colors}/>;
            case "TRANCE":
                return <TranceDots colors={props.setting.colors}/>;
            default:
                return <ColorDots colors={props.setting.colors}/>;
        }
    }

    return (
        <View style={props.style}>
            <Text style={styles.whiteText}>{props.setting.name.toLowerCase()}</Text>

            {dotsRendered()}

        </View>
    );
}

const styles = StyleSheet.create({
    whiteText: {
        color: "white",
        fontSize: 50,
        fontFamily: "Thesignature",
    },
});

export default SettingBlock;

// Read from the saved settings in the file for the settings page.
// format as an object that displays the settings in a list
// Pass those into each settingBlock

// Once a setting is SELECTED, PASS IN ITS VARIABLES TO THE page being shown
// and allow modification to these values while viewing this page.
// If they save, save the settings to the file.
