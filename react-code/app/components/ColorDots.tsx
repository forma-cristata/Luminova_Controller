import {View} from "react-native";


interface ColorProps {
    colors: string[],
}

const ColorDots = (props: ColorProps) => {
    return (
        <View style={{ flexDirection: "row" }}>
            {props.colors.map((color, index) => (
                <View
                    key={index}
                    style={{
                        width: 35,
                        height: 35,
                        backgroundColor: color,
                        borderRadius: "50%",
                        marginHorizontal: -7,
                    }}
                />
            ))}
        </View>
    );
};

export default ColorDots;



/*
import {View} from "react-native";
import React from "react";

interface ColorProps {
    colors_R: number[],
    colors_G: number[],
    colors_B: number[],
    whiteValues: number[],
    brightnessValues: number[],
    delayTime: number,
}

const ColorDots = (props: ColorProps) => {
    // Get saved values from JSON file unless no saved -> then use default values.
    const convertToHex = (r: number, g: number, b: number, w: number, brightness: number) => {
        const red = Math.min(Math.round((r * brightness) / 255), 255);
        const green = Math.min(Math.round((g * brightness) / 255), 255);
        const blue = Math.min(Math.round((b * brightness) / 255), 255);
        const white = Math.min(Math.round(w * brightness), 255);

        return `#${((1 << 24) + (red << 16) + (green << 8) + blue + (white << 0)).toString(16).slice(1)}`;
    }

    //const setLedWithBrightness = ()

    const colors: string[] = props.colors_R.map((_, index) => convertToHex(props.colors_R[index], props.colors_G[index], props.colors_B[index], props.whiteValues[index], props.brightnessValues[index]));


    const dotStates = Array.from({ length: 16 }, (_, i) => React.useState<string>(colors[i]));

    const allDots =
        <View style={{ flexDirection: "row" }}>
            {dotStates.map(([color, setColor], index) => (
                <View
                    key={index}
                    style={{
                        width: 29,
                        height: 29,
                        backgroundColor: color,
                        borderRadius: 15,
                        marginHorizontal: -3,
                    }}
                />
            ))}
        </View>

    const setLedWithBrightness = (index: number, r: number, g: number, b: number, w: number, brightness: number) => {
        const newColor = convertToHex(r, g, b, w, brightness);
        const [_, setColor] = dotStates[index];
        setColor(newColor);
    }
    const TraceOneAnimation = () => {
        let i = 0;
        while(i < 16){

            setLedWithBrightness(i, props.colors_R[0], props.colors_G[0], props.colors_B[0], props.whiteValues[0], props.brightnessValues[0]);

            i++;
        }

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                setLedWithBrightness(j, props.colors_R[i], props.colors_G[i], props.colors_B[i], props.whiteValues[i], props.brightnessValues[i]);

                setTimeout(() => {
                }, props.delayTime * 2);

                setLedWithBrightness(j, props.colors_R[0], props.colors_G[0], props.colors_B[0], props.whiteValues[0], props.brightnessValues[0]);
            }
        }


/!*

                delay(delayTime * 2);

                // Reset LED to first color in array
                if (pattern.brightness != nullptr) {
                    ledController.setLedWithBrightness(
                        j,
                        pattern.red[0],
                        pattern.green[0],
                        pattern.blue[0],
                        pattern.white[0],
                        pattern.brightness[0]
                    );
                }
                else {
                    ledController.setLed(
                        j,
                        pattern.red[0],
                        pattern.green[0],
                        pattern.blue[0],
                        pattern.white[0]
                    );
*!/

                    /!*for (int i = 0; i < LIGHT_COUNT; i++) {
                        if (pattern.brightness != nullptr) {
                            ledController.setLedWithBrightness(
                                i,
                                pattern.red[0],
                                pattern.green[0],
                                pattern.blue[0],
                                pattern.white[0],
                                pattern.brightness[0]
                            );
                        }
                        else {
                            ledController.setLed(
                                i,
                                pattern.red[0],
                                pattern.green[0],
                                pattern.blue[0],
                                pattern.white[0]
                            );
                        }
                    }*!/
    }

    TraceOneAnimation();
    return allDots;


};

export default ColorDots;
*/
