import {TouchableOpacity, View} from "react-native";
import React from "react";


interface ColorProps {
    colors: string[],
}

const ColorDotsEditorEdition = (props: ColorProps) => {
    const [scale_0, setScale_0] = React.useState(1);
    const [scale_1, setScale_1] = React.useState(1);
    const [scale_2, setScale_2] = React.useState(1);
    const [scale_3, setScale_3] = React.useState(1);
    const [scale_4, setScale_4] = React.useState(1);
    const [scale_5, setScale_5] = React.useState(1);
    const [scale_6, setScale_6] = React.useState(1);
    const [scale_7, setScale_7] = React.useState(1);
    const [scale_8, setScale_8] = React.useState(1);
    const [scale_9, setScale_9] = React.useState(1);
    const [scale_10, setScale_10] = React.useState(1);
    const [scale_11, setScale_11] = React.useState(1);
    const [scale_12, setScale_12] = React.useState(1);
    const [scale_13, setScale_13] = React.useState(1);
    const [scale_14, setScale_14] = React.useState(1);
    const [scale_15, setScale_15] = React.useState(1);


    const setScales = (index: number, color: string) => {
        switch(index) {
            case 0:
                setScale_0(1.5);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 1:
                setScale_1(1.5);
                setScale_0(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 2:
                setScale_2(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 3:
                setScale_3(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 4:
                setScale_4(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 5:
                setScale_5(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 6:
                setScale_6(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 7:
                setScale_7(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 8:
                setScale_8(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 9:
                setScale_9(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 10:
                setScale_10(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 11:
                setScale_11(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 12:
                setScale_12(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_13(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 13:
                setScale_13(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_14(1);
                setScale_15(1);
                break;
            case 14:
                setScale_14(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_15(1);
                break;
            case 15:
                setScale_15(1.5);
                setScale_0(1);
                setScale_1(1);
                setScale_2(1);
                setScale_3(1);
                setScale_4(1);
                setScale_5(1);
                setScale_6(1);
                setScale_7(1);
                setScale_8(1);
                setScale_9(1);
                setScale_10(1);
                setScale_11(1);
                setScale_12(1);
                setScale_13(1);
                setScale_14(1);
                break;
        }
    }



    return (
        <>
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => {setScales(0, props.colors[0])}}>
            <View key={0} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[0],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_0}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(1, props.colors[1])}}>
            <View key={1} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[1],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_1}],
            }} />
            </TouchableOpacity>
                <TouchableOpacity onPress={() => {setScales(2, props.colors[2])}}>

                <View key={2} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[2],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_2}],
            }} />
                </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(3, props.colors[3])}}>

            <View key={3} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[3],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_3}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(4, props.colors[4])}}>

            <View key={4} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[4],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_4}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(5, props.colors[5])}}>

            <View key={5} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[5],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_5}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(6, props.colors[6])}}>

            <View key={6} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[6],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_6}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(7, props.colors[7])}}>

            <View key={7} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[7],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_7}],
            }} />
            </TouchableOpacity>
        </View>
    <View style={{
        flexDirection: "row",
        marginTop: 30,
    }}>

    <TouchableOpacity onPress={() => {setScales(8, props.colors[8])}}>

            <View key={8} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[8],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_8}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(9, props.colors[9])}}>

            <View key={9} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[9],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_9}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(10, props.colors[10])}}>

            <View key={10} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[10],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_10}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(11, props.colors[11])}}>

            <View key={11} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[11],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_11}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(12, props.colors[12])}}>

            <View key={12} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[12],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_12}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(13, props.colors[13])}}>

            <View key={13} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[13],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_13}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(14, props.colors[14])}}>

            <View key={14} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[14],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_14}],
            }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setScales(15, props.colors[15])}}>

            <View key={15} style={{
                width: 55,
                height: 55,
                backgroundColor: props.colors[15],
                borderRadius: "50%",
                marginHorizontal: -7,
                transform: [{scale: scale_15}],
            }} />
            </TouchableOpacity>
        </View>
    </>
    );
};

export default ColorDotsEditorEdition;