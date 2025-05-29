import {Keyboard, TextInput} from 'react-native';
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ColorDotsEditorEdition from "@/app/components/ColorDotEditorEdition";
import Slider from "@react-native-community/slider";
import {useState} from "react";
import {useThrottle} from "expo-dev-launcher/bundle/hooks/useDebounce";
import {loadData, saveData} from "@/app/settings";
import { GestureResponderEvent } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    runOnJS
} from 'react-native-reanimated';

export default function ColorEditor({navigation, route}: any) {
    const setting = route.params?.setting;
    const [colors, setColors] = useState([...setting.colors]);
    const [selectedDot, setSelectedDot] = useState<number | null>(null);
    const [hue, setHue] = useState(0);
    const throttledHue = useThrottle(hue);

    const [brightness, setBrightness] = useState(100);
    const throttledBrightness = useThrottle(brightness);

    const [saturation, setSaturation] = useState(0);
    const throttledSaturation = useThrottle(saturation);

    const [hexInput, setHexInput] = useState('');
    const [colorHistory, setColorHistory] = useState<string[][]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const startY = useSharedValue(0);
    const startX = useSharedValue(0);


    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHsv = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let h = 0;
        if (diff === 0) h = 0;
        else if (max === r) h = ((g - b) / diff) % 6;
        else if (max === g) h = (b - r) / diff + 2;
        else if (max === b) h = (r - g) / diff + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;

        const s = max === 0 ? 0 : Math.round((diff / max) * 100);
        const v = Math.round(max * 100);

        return { h, s, v };
    };

    const hsvToHex = (h: number, s: number, v: number) => {
        h = h / 360;
        s = s / 100;
        v = v / 100;

        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        const toHex = (n: number) => Math.round(n! * 255).toString(16).padStart(2, '0');
        return `#${toHex(r!)}${toHex(g!)}${toHex(b!)}`;
    };

    const updateColor = (h: number, s: number, v: number) => {
        if (selectedDot !== null) {
            const newColor = hsvToHex(h, s, v);
            setColorHistory([...colorHistory, [...colors]]);
            const newColors = [...colors];
            newColors[selectedDot] = newColor;
            setColors(newColors);
            setHexInput(newColor.replace('#', ''));
            setHasChanges(true);
        }
    };

    const handleDotSelect = (index: number, event?: GestureResponderEvent) => {
        try{
            Keyboard.dismiss();
        }
        catch{
            console.log("no keyboard to dismiss");
        }


        setSelectedDot(index);
        setHexInput(colors[index].replace('#', ''));
        const rgb = hexToRgb(colors[index]);
        if (rgb) {
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            setHue(hsv.h);
            setBrightness(hsv.v);
            setSaturation(hsv.s);
        }
    };

    const handleHexInput = (text: string) => {
        const hexRegex = /^#?([A-Fa-f0-9]{6})$/;
        const hexValue = text.startsWith('#') ? text : `#${text}`;
        setHexInput(text);

        if (hexRegex.test(hexValue) && selectedDot !== null) {
            setColorHistory([...colorHistory, [...colors]]);
            const newColors = [...colors];
            newColors[selectedDot] = hexValue;
            setColors(newColors);
            setHasChanges(true);

            const rgb = hexToRgb(hexValue);
            if (rgb) {
                const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                setHue(hsv.h);
                setBrightness(hsv.v);
                setSaturation(hsv.s);
            }
        }
    };

    const handleReset = () => {
        if (hasChanges) {
            setColors([...setting.colors]);
            setColorHistory([]);
            setHasChanges(false);
            if (selectedDot !== null) {
                setHexInput(setting.colors[selectedDot].replace('#', ''));
                const rgb = hexToRgb(setting.colors[selectedDot]);
                if (rgb) {
                    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                    setHue(hsv.h);
                    setBrightness(hsv.v);
                    setSaturation(hsv.s);
                }
            }
        }
    };

    const handleSave = async () => {

        setting.colors = [...colors];
        const settings = await loadData();

        const updatedSettings = settings!.map(s => s.name === setting.name ? {...s, colors: [...colors]} : s);
        await saveData(updatedSettings);
        navigation.navigate("Settings", {setting});
    };

    const handleSliderComplete = (h: number, s: number, v: number) => {
        if (selectedDot !== null) {
            // Save the current state before updating
            setColorHistory([...colorHistory, [...colors]]);
            const newColor = hsvToHex(h, s, v);
            const newColors = [...colors];
            newColors[selectedDot] = newColor;
            setColors(newColors);
            setHexInput(newColor.replace('#', ''));
        }
    };

    const handleCopyToBottom = () => {
        const newColors = [...colors];
        for (let i = 0; i < 8; i++) {
            newColors[i + 8] = newColors[i];
        }
        setColors(newColors);
        setColorHistory([...colorHistory, [...colors]]);
        setHasChanges(true);
    };

    const handleCopyToTop = () => {
        const newColors = [...colors];
        for (let i = 8; i < 16; i++) {
            newColors[i - 8] = newColors[i];
        }
        setColors(newColors);
        setColorHistory([...colorHistory, [...colors]]);
        setHasChanges(true);
    };

    const handleReverseTopRow = () => {
        /*if(pixels > 200 && < 260)*/
        const newColors = [...colors];
        for (let i = 0; i < 8; i++) {
            newColors[i] = colors[7 - i];
        }

        setColors(newColors);
        setColorHistory([...colorHistory, [...colors]]);
        setHasChanges(true);
    }

    const handleReverseBottomRow = () => {
        const newColors = [...colors];
        for (let i = 0; i < 8; i++) {
            newColors[i+8] = colors[15 - i];
        }

        setColors(newColors);
        setColorHistory([...colorHistory, [...colors]]);
        setHasChanges(true);
    }


    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (event) => {
            startY.value = event.absoluteY;
            startX.value = event.absoluteX;
        },
        onActive: (event) => {},
        onEnd: (event) => {
            const initY = startY.value;
            const initX = startX.value;
            const deltaY = event.absoluteY - initY;
            const deltaX = event.absoluteX - initX;

            if((Math.abs(deltaX)) < 50) {
                if (deltaY > 100) {
                    // Swiped down - copy from top to bottom
                    runOnJS(handleCopyToBottom)();
                }
                else if (deltaY < -100) {
                    // Swiped up - copy from bottom to top
                    runOnJS(handleCopyToTop)();
                }
            }
            else{
                if(Math.abs(deltaY) < 100) {
                    if (startY.value > 180 && startY.value < 260) {
                        // Swiped right - reverse colors
                        runOnJS(handleReverseTopRow)();
                    }
                    else if (startY.value > 260 && startY.value < 360) {
                        // Swiped left - reverse colors
                        runOnJS(handleReverseBottomRow)();
                        console.log("Reversed bottom row");
                    }
                }

            }
            startY.value = 0;
            startX.value = 0;

        },
        onFinish: () => {
            startY.value = 0;
            startX.value = 0;
        },
        onCancel: () => {
            startY.value = 0;
            startX.value = 0;
        }
    });


    return (
        <GestureHandlerRootView style={{flex:1}}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={{flex:1}}>
                    <SafeAreaView style={styles.container}>
                    <View style={styles.backButton}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backB}>    ⟨    </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer} >
                        <Text style={styles.whiteText}>{setting.name}</Text>

                    </View>
                    <ColorDotsEditorEdition
                        colors={colors}
                        onDotSelect={handleDotSelect}
                        selectedDot={selectedDot}
                        key={colors.join(',')} // Force re-render when colors change
                    />

                    <View style={[styles.hexContainer, { opacity: selectedDot !== null ? 1 : 0.5 }]}>
                        <Text style={styles.sliderText}>Hex: #</Text>
                        <TextInput
                            style={[styles.hexInput]}
                            value={hexInput}
                            onChangeText={(text) => {
                                const hex = text.slice(0, 6).replace(/[^0-9A-Fa-f]/g, '');
                                handleHexInput(hex);
                            }}
                            placeholder="FFFFFF"
                            placeholderTextColor="#666"
                            editable={selectedDot !== null}
                            onBlur={() => {Keyboard.dismiss()}}
                            autoCapitalize="characters"
                            keyboardAppearance="dark"
                            keyboardType="default"
                        />

                    </View>



                    <View style={[styles.sliderContainer, { opacity: selectedDot !== null ? 1 : 0.5 }]}>
                        <View style={styles.sliderRow}>
                            <Text style={styles.sliderText}>Hue: {Math.round(hue)}°</Text>
                            <Slider
                                style={[styles.slider, { opacity: selectedDot !== null ? 1 : 0.5 }]}
                                minimumValue={0}
                                maximumValue={360}
                                value={hue}
                                onValueChange={value => {
                                    try{
                                        Keyboard.dismiss();
                                    }
                                    catch{
                                        console.log("no keyboard to dismiss");
                                    }
                                    if (selectedDot !== null) {
                                        setHue(value);
                                        updateColor(value, saturation, brightness); // Here
                                    }
                                }}
                                onSlidingComplete={value => {
                                    if (selectedDot !== null) {
                                        handleSliderComplete(value, saturation, brightness);
                                    }
                                }}
                                minimumTrackTintColor="#ff0000"
                                maximumTrackTintColor="#ffffff"
                            />
                        </View>
                        <View style={styles.sliderRow}>
                            <Text style={styles.sliderText}>Saturation: {Math.round(saturation)}%</Text>
                            <Slider
                                style={[styles.slider, { opacity: selectedDot !== null ? 1 : 0.5 }]}
                                minimumValue={0}
                                maximumValue={100}
                                value={saturation}
                                onValueChange={value => {
                                    if (selectedDot !== null) {
                                        setSaturation(value);
                                        updateColor(hue, value, brightness); // Inverse of saturation
                                    }
                                }}
                                onSlidingComplete={value => {
                                    if (selectedDot !== null) {
                                        handleSliderComplete(hue, value, brightness);
                                    }
                                }}
                                minimumTrackTintColor="#cccccc"
                                maximumTrackTintColor="#ffffff"
                            />
                        </View>
                        <View style={styles.sliderRow}>
                            <Text style={styles.sliderText}>Brightness: {Math.round(brightness)}%</Text>
                            <Slider
                                style={[styles.slider, { opacity: selectedDot !== null ? 1 : 0.5 }]}
                                minimumValue={0}
                                maximumValue={100}
                                value={brightness}
                                onValueChange={value => {
                                    if (selectedDot !== null) {
                                        setBrightness(value);
                                        updateColor(hue, saturation, value); // Here
                                    }
                                }}
                                onSlidingComplete={value => {
                                    if (selectedDot !== null) {
                                        handleSliderComplete(hue, saturation, value);
                                    }
                                }}
                                minimumTrackTintColor="#333333"
                                maximumTrackTintColor="#ffffff"
                            />
                        </View>

                    </View>

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.styleAButton, { opacity: hasChanges ? 1 : 0.5 }]}
                                onPress={handleReset}
                                disabled={!hasChanges}
                            >
                                <Text style={styles.button}>Reset</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.styleAButton}
                                /*onPress={}TODO*/
                            >
                                <Text style={styles.button}>Preview</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.styleAButton, { opacity: hasChanges ? 1 : 0.5 }]}
                                onPress={handleSave}
                                disabled={!hasChanges}
                            >
                                <Text style={styles.button}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </SafeAreaView>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}
const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375; // Base scale factor

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
    },
    whiteText: {
        color: "white",
        fontSize: 50 * scale,
        fontFamily: "Thesignature",
        textAlign: "center",
        marginTop: height * 0.05,
        marginBottom: height * 0.03,
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderColor: "white",
        width: width * 0.8,
    },
    backButton: {
        position: "absolute",
        top: height * 0.05,
        left: 0,
        width: "100%",
        height: height * 0.05,
    },
    backB: {
        color: "white",
        fontSize: 30 * scale,
    },
    sliderContainer: {
        width: width * 0.85,
        marginTop: height * 0.02,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#ffffff",
        padding: 15 * scale,
        borderRadius: 10,
    },
    sliderRow: {
        marginVertical: 5 * scale,
    },
    slider: {
        width: "100%",
        height: 30 * scale,
    },
    sliderText: {
        color: "white",
        fontSize: 22 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,
    },
    hexContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.02,
        width: width * 0.85,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#ffffff",
        padding: 10 * scale,
        borderRadius: 10,
    },
    hexInput: {
        color: 'white',
        fontSize: 22 * scale,
        fontFamily: "Clearlight-lJlq",
        textTransform: "uppercase",
        letterSpacing: 3,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingVertical: 4,
        paddingHorizontal: 8,
        minWidth: width * 0.3,
    },
    buttonContainer: {
        width: width * 0.85,
        marginTop: height * 0.02,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8 * scale,
    },
    styleAButton: {
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 8 * scale,
        paddingHorizontal: 15 * scale,
        alignItems: "center",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ffffff",
        width: "30%",
    },
    button: {
        color: "white",
        fontSize: 25 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,

    },
    hexApplyButton: {
        backgroundColor: "#333",
        paddingVertical: 6 * scale,
        paddingHorizontal: 10 * scale,
        borderRadius: 5,
        marginLeft: 8 * scale,
    },
    hexApplyText: {
        color: "white",
        fontSize: 16 * scale,
        fontFamily: "Clearlight-lJlq",
    },
    titleContainer: {
        flexDirection: "row",
    },
    copyButton: {
        marginTop: height * 0.02,
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingVertical: 8 * scale,
        paddingHorizontal: 15 * scale,
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#ffffff",
    },
    copyButtonText: {
        color: "white",
        fontSize: 18 * scale,
        fontFamily: "Clearlight-lJlq",
        letterSpacing: 2,
    }
});