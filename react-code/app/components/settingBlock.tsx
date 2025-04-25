import {View, Text, StyleSheet} from "react-native";
import Setting from "@/app/interface/setting-interface";
import ColorDots from "@/app/components/ColorDots";

interface SettingItemProps{
        setting: Setting,
        style: any,
}


const SettingBlock = (props: SettingItemProps) => {
    // Assuming props.setting.colors is an array of color objects

    return (
        <View style={props.style}>
            <Text style={styles.whiteText}>{props.setting.name.toLowerCase()}</Text>
            <ColorDots
                colors={props.setting.colors}
            />
{/*
            <Text style={styles.whiteText}>{props.setting.flashingPattern}</Text>
*/}
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
