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