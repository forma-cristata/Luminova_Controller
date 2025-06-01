import {TouchableOpacity, View} from "react-native";
import React from "react";

interface ColorProps {
    colors: string[],
    onDotSelect: (index: number) => void;
    selectedDot: number | null;
}

const ColorDotsEditorEdition = (props: ColorProps) => {
    const scales = Array(16).fill(1);
    if (props.selectedDot !== null) {
        scales[props.selectedDot] = 1.5;
    }

    const handleDotPress = (index: number) => {
        props.onDotSelect(index);
    };

    const getFirstNonBlackColor = () => {
        const nonBlackColor = props.colors.find(color => color !== "#000000");
        return nonBlackColor || "#FFFFFF";
    };

    const getDotStyle = (index: number) => {
        const isBlack = props.colors[index] === "#000000";

        return {
            width: 55,
            height: 55,
            backgroundColor: props.colors[index],
            borderRadius: "50%",
            marginHorizontal: -7,
            transform: [{scale: scales[index]}],
            ...(isBlack ? {
                shadowColor: getFirstNonBlackColor(),
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 5,
                elevation: 5,
            } : {})
        };
    };

    return (
        <>
            <View style={{ flexDirection: "row" }}>
                {[...Array(8)].map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
                        <View style={getDotStyle(index)} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{
                flexDirection: "row",
                marginTop: 30,
            }}>
                {[...Array(8)].map((_, index) => {
                    const dotIndex = index + 8;
                    return (
                        <TouchableOpacity key={dotIndex} onPress={() => handleDotPress(dotIndex)}>
                            <View style={getDotStyle(dotIndex)} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    );
};

export default ColorDotsEditorEdition;