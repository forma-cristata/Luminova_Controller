import { TextInput } from 'react-native';
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ColorDotsEditorEdition from "@/app/components/ColorDotEditorEdition";
import Slider from "@react-native-community/slider";
import {useState} from "react";

export default function ColorEditor({navigation, route}: any) {
    const setting = route.params?.setting;
    const [colors, setColors] = useState([...setting.colors]);
    const [selectedDot, setSelectedDot] = useState<number | null>(null);
    const [hue, setHue] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [whiteBalance, setWhiteBalance] = useState(0);
    const [hexInput, setHexInput] = useState('');
    const [colorHistory, setColorHistory] = useState<string[][]>([]);
    const [hasChanges, setHasChanges] = useState(false);




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

    const handleDotSelect = (index: number) => {
        setSelectedDot(index);
        setHexInput(colors[index].replace('#', ''));
        const rgb = hexToRgb(colors[index]);
        if (rgb) {
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            setHue(hsv.h);
            setBrightness(hsv.v);
            setWhiteBalance(100 - hsv.s);
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
                setWhiteBalance(100 - hsv.s);
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
                    setWhiteBalance(100 - hsv.s);
                }
            }
        }
    };

    const handleSave = () => {
/*
        setting.colors = [...colors];
*/
        navigation.navigate("Settings", { setting });
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



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.navigate("ChooseModification", { setting })}>
                    <Text style={styles.backB}>    ⟨    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.whiteText}>{setting.name}</Text>
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
                    onChangeText={handleHexInput}
                    placeholder="FFFFFF"
                    placeholderTextColor="#666"
                    maxLength={6}
                    editable={selectedDot !== null}
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
                            if (selectedDot !== null) {
                                setHue(value);
                                updateColor(value, 100 - whiteBalance, brightness);
                            }
                        }}
                        onSlidingComplete={value => {
                            if (selectedDot !== null) {
                                handleSliderComplete(value, 100 - whiteBalance, brightness);
                            }
                        }}
                        minimumTrackTintColor="#ff0000"
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
                                updateColor(hue, 100 - whiteBalance, value);
                            }
                        }}
                        onSlidingComplete={value => {
                            if (selectedDot !== null) {
                                handleSliderComplete(hue, 100 - whiteBalance, value);
                            }
                        }}
                        minimumTrackTintColor="#333333"
                        maximumTrackTintColor="#ffffff"
                    />
                </View>
                <View style={styles.sliderRow}>
                    <Text style={styles.sliderText}>White: {Math.round(whiteBalance)}%</Text>
                    <Slider
                        style={[styles.slider, { opacity: selectedDot !== null ? 1 : 0.5 }]}
                        minimumValue={0}
                        maximumValue={100}
                        value={whiteBalance}
                        onValueChange={value => {
                            if (selectedDot !== null) {
                                setWhiteBalance(value);
                                updateColor(hue, 100 - value, brightness);
                            }
                        }}
                        onSlidingComplete={value => {
                            if (selectedDot !== null) {
                                handleSliderComplete(hue, 100 - value, brightness);
                            }
                        }}
                        minimumTrackTintColor="#cccccc"
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
                        style={[styles.styleAButton, { opacity: hasChanges ? 1 : 0.5 }]}
                        onPress={handleSave}
                        disabled={!hasChanges}
                    >
                        <Text style={styles.button}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
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
        fontSize: 20 * scale,
        fontFamily: "Thesignature",
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
        fontSize: 20 * scale,
        fontFamily: "Thesignature",
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
        width: "48%",
    },
    button: {
        color: "white",
        fontSize: 30 * scale,
        fontFamily: "Thesignature",
    }
});