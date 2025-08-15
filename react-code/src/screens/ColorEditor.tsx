import Slider from "@react-native-community/slider";
import { ApiService } from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import { SettingsService } from "@/src/services/SettingsService";
import { useState } from "react";
import {
	Dimensions,
	Keyboard,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	TouchableWithoutFeedback,
} from "react-native";
import {
	GestureHandlerRootView,
	PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedGestureHandler,
	useSharedValue,
} from "react-native-reanimated";

import ActionButton from "@/src/components/ui/buttons/ActionButton";
import BackButton from "@/src/components/ui/buttons/BackButton";
import ColorButton from "@/src/components/ui/buttons/ColorButton";
import ColorDots from "@/src/components/color-picker/ColorDots";
import DismissKeyboardView from "@/src/components/ui/DismissKeyboardView";
import HueSliderBackground from "@/src/components/color-picker/HueSliderBackground";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import RandomizeButton from "@/src/components/ui/buttons/RandomizeButton";
import { COLORS, COMMON_STYLES, FONTS } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";
import React from "react";

export default function ColorEditor({ navigation, route }: any) {
	const { currentConfiguration, setLastEdited } = useConfiguration();

	const setting = route.params?.setting;
	const isNew = route.params?.isNew || false;
	const originalName = route.params?.originalName || setting.name;
	const settingIndex = route.params?.settingIndex; // Add support for index-based editing

	const [colors, setColors] = useState([...setting.colors]);
	const [selectedDot, setSelectedDot] = useState<number | null>(null);
	const [hue, setHue] = useState(0);
	const debouncedHue = useDebounce(hue, 50);

	const [brightness, setBrightness] = useState(100);
	const debouncedBrightness = useDebounce(brightness, 50);

	const [saturation, setSaturation] = useState(0);
	const debouncedSaturation = useDebounce(saturation, 50);

	const [hexInput, setHexInput] = useState("");
	const [colorHistory, setColorHistory] = useState<string[][]>([]);
	const [hasChanges, setHasChanges] = useState(isNew);

	const startY = useSharedValue(0);
	const startX = useSharedValue(0);

	const [previewMode, setPreviewMode] = useState(false);

	// Name editing state (now used for both new and existing settings)
	const [settingName, setSettingName] = useState(setting.name);
	const [nameError, setNameError] = useState<string | null>(null);

	const handleNameChange = async (text: string) => {
		setSettingName(text);
		setHasChanges(true);

		// Check for duplicate names
		const settings = await SettingsService.loadSettings();
		const nameExists = settings?.some(
			(s: Setting, index: number) =>
				s.name.toLowerCase() === text.toLowerCase() &&
				s.name !== originalName &&
				(!isNew || index !== settingIndex), // Exclude current setting for existing settings
		);
		setNameError(nameExists ? "Name already exists." : null);
	};

	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
			: null;
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
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			case 5:
				r = v;
				g = p;
				b = q;
				break;
		}

		const toHex = (n: number) =>
			Math.round(n! * 255)
				.toString(16)
				.padStart(2, "0");
		return `#${toHex(r!)}${toHex(g!)}${toHex(b!)}`;
	};

	const updateColor = (h: number, s: number, v: number) => {
		if (selectedDot !== null) {
			const newColor = hsvToHex(h, s, v);
			setColorHistory([...colorHistory, [...colors]]);
			const newColors = [...colors];
			newColors[selectedDot] = newColor;
			setColors(newColors);
			setHexInput(newColor.replace("#", ""));
			setHasChanges(true);
		}
	};

	const handleDotSelect = (index: number) => {
		try {
			Keyboard.dismiss();
		} catch {
			console.log("no keyboard to dismiss");
		}

		setSelectedDot(index);
		setHexInput(colors[index].replace("#", ""));
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
		const hexValue = text.startsWith("#") ? text : `#${text}`;
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

	const handleCancel = () => {
		unPreviewAPI();
		const newSettingCarouselIndex = route.params?.newSettingCarouselIndex;
		if (newSettingCarouselIndex !== undefined) {
			setLastEdited(newSettingCarouselIndex.toString());
		}
		navigation.navigate("Settings");
	};

	const handleReset = () => {
		unPreviewAPI();
		if (hasChanges) {
			setColors([...setting.colors]);
			setColorHistory([]);
			setHasChanges(false);

			// Reset name for both new and existing settings
			setSettingName(setting.name);
			setNameError(null);

			if (selectedDot !== null) {
				setHexInput(setting.colors[selectedDot].replace("#", ""));
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
		// Always update the setting name
		setting.name = settingName;
		setting.colors = [...colors];

		if (isNew) {
			navigation.navigate("FlashingPatternEditor", {
				setting: setting,
				isNew: true,
			});
		} else {
			const updatedSetting = {
				...setting,
				name: settingName,
				colors: [...colors],
			};
			const updatedSettings = await SettingsService.updateSetting(
				settingIndex,
				updatedSetting,
			);

			const currentIndex = settingIndex; // Use the existing index
			setLastEdited(currentIndex.toString());

			// Navigate directly to Settings
			navigation.navigate("Settings");
		}
	};

	const handleSliderComplete = (h: number, s: number, v: number) => {
		if (selectedDot !== null) {
			setColorHistory([...colorHistory, [...colors]]);
			const newColor = hsvToHex(h, s, v);
			const newColors = [...colors];
			newColors[selectedDot] = newColor;
			setColors(newColors);
			setHexInput(newColor.replace("#", ""));
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
	};

	const handleReverseBottomRow = () => {
		const newColors = [...colors];
		for (let i = 0; i < 8; i++) {
			newColors[i + 8] = colors[15 - i];
		}
		setColors(newColors);
		setColorHistory([...colorHistory, [...colors]]);
		setHasChanges(true);
	};

	const panGestureEvent = useAnimatedGestureHandler({
		onStart: (event) => {
			startY.value = event.absoluteY;
			startX.value = event.absoluteX;
		},
		onActive: () => { },
		onEnd: (event) => {
			const initY = startY.value;
			const initX = startX.value;
			const deltaY = event.absoluteY - initY;
			const deltaX = event.absoluteX - initX;
			if (Math.abs(deltaX) < 50) {
				if (deltaY > 100) {
					runOnJS(handleCopyToBottom)();
				} else if (deltaY < -100) {
					runOnJS(handleCopyToTop)();
				}
			} else {
				if (Math.abs(deltaY) < 100) {
					if (startY.value > 180 && startY.value < 260) {
						runOnJS(handleReverseTopRow)();
					} else if (startY.value > 260 && startY.value < 360) {
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
		},
	});

	const previewAPI = async () => {
		try {
			await ApiService.previewSetting({
				colors: colors,
				flashingPattern: setting.flashingPattern,
				delayTime: setting.delayTime,
			});
			console.log("Preview successful");
		} catch (error) {
			console.error("Preview error:", error);
		}
	};

	const unPreviewAPI = async () => {
		setPreviewMode(false);
		if (currentConfiguration) {
			try {
				await ApiService.restoreConfiguration(currentConfiguration);
				console.log("Configuration restored");
			} catch (error) {
				console.error("Restore error:", error);
			}
		}
	};

	const sortColorsByHue = () => {
		const colorsWithHSV = colors.map((color) => {
			const rgb = hexToRgb(color);
			if (rgb) {
				const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
				return { color, h: hsv.h, s: hsv.s, v: hsv.v };
			}
			return { color, h: 0, s: 0, v: 0 };
		});
		colorsWithHSV.sort((a, b) => a.h - b.h);
		const sortedColors = colorsWithHSV.map((item) => item.color);
		setColorHistory([...colorHistory, [...colors]]);
		setColors(sortedColors);
		setHasChanges(true);
	};

	const renderTitle = () => {
		// Always show name input for both new and existing settings
		return (
			<View style={styles.titleContainer}>
				<RandomizeButton
					onPress={() => {
						const shuffled = [...colors];
						for (let i = shuffled.length - 1; i > 0; i--) {
							const j = Math.floor(Math.random() * (i + 1));
							[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
						}
						setColors(shuffled);
						setColorHistory([...colorHistory, [...colors]]);
						setHasChanges(true);
					}}
				/>
				<View style={styles.nameInputContainer}>
					<Text style={COMMON_STYLES.sliderText}>Setting Name:</Text>
					<TextInput
						style={[
							styles.nameInput,
							nameError ? { color: COLORS.ERROR } : null,
						]}
						value={settingName}
						onChangeText={handleNameChange}
						placeholder="Enter setting name"
						placeholderTextColor={COLORS.PLACEHOLDER}
						maxLength={20}
					/>
				</View>
				<TouchableOpacity style={styles.sortButton} onPress={sortColorsByHue}>
					<Text style={styles.sortIcon}>↹</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<PanGestureHandler onGestureEvent={panGestureEvent}>
					<Animated.View style={{ flex: 1 }}>
						<SafeAreaView style={COMMON_STYLES.container}>
							<InfoButton />
							<BackButton beforePress={previewMode ? unPreviewAPI : undefined} />
							{renderTitle()}
							<ColorDots
								colors={colors}
								onDotSelect={handleDotSelect}
								selectedDot={selectedDot}
								layout="two-rows"
								key={colors.join(",")}
							/>
							<View
								style={[
									styles.hexContainer,
									{ opacity: selectedDot !== null ? 1 : 0.5 },
								]}
							>
								<Text style={COMMON_STYLES.sliderText}>Hex: #</Text>
								<TextInput
									style={[styles.hexInput]}
									value={hexInput.toUpperCase()}
									onChangeText={(text) => {
										const hex = text.slice(0, 6).replace(/[^0-9A-Fa-f]/g, "");
										handleHexInput(hex);
									}}
									placeholder="FFFFFF"
									placeholderTextColor={COLORS.PLACEHOLDER}
									editable={selectedDot !== null}
									onBlur={() => {
										Keyboard.dismiss();
									}}
									autoCapitalize="characters"
									keyboardAppearance="dark"
									keyboardType="default"
								/>
								<View style={styles.colorButtons}>
									<ColorButton
										color="white"
										disabled={selectedDot === null}
										onPress={() => {
											if (selectedDot !== null) {
												handleHexInput("FFFFFF");
											}
										}}
										scale={scale}
									/>
									<ColorButton
										color="black"
										disabled={selectedDot === null}
										onPress={() => {
											if (selectedDot !== null) {
												handleHexInput("000000");
											}
										}}
										scale={scale}
									/>
								</View>
							</View>
							<View
								style={[
									COMMON_STYLES.sliderContainer,
									{ opacity: selectedDot !== null ? 1 : 0.5 },
								]}
							>
								<View style={styles.sliderRow}>
									<Text style={COMMON_STYLES.sliderText}>
										Hue: {Math.round(hue)}°
									</Text>
									<View style={styles.sliderWrapper}>
										<HueSliderBackground />
										<Slider
											style={[
												styles.slider,
												{ opacity: selectedDot !== null ? 1 : 0.5 },
											]}
											minimumValue={0}
											maximumValue={360}
											value={debouncedHue}
											disabled={selectedDot === null}
											onValueChange={(value) => {
												if (selectedDot !== null) {
													try {
														Keyboard.dismiss();
													} catch {
														console.log("no keyboard to dismiss");
													}
													setHue(value);
													updateColor(value, saturation, brightness);
												}
											}}
											onSlidingComplete={(value) => {
												if (selectedDot !== null) {
													handleSliderComplete(value, saturation, brightness);
												}
											}}
											minimumTrackTintColor="#ff0000"
											maximumTrackTintColor={COLORS.WHITE}
											thumbTintColor={COLORS.WHITE}
										/>
									</View>
								</View>
								<View style={styles.sliderRow}>
									<Text style={COMMON_STYLES.sliderText}>
										Saturation: {Math.round(saturation)}%
									</Text>
									<Slider
										style={[
											styles.slider,
											{ opacity: selectedDot !== null ? 1 : 0.5 },
										]}
										minimumValue={0}
										maximumValue={100}
										disabled={selectedDot === null}
										value={debouncedSaturation}
										onValueChange={(value) => {
											if (selectedDot !== null) {
												setSaturation(value);
												updateColor(hue, value, brightness);
											}
										}}
										onSlidingComplete={(value) => {
											if (selectedDot !== null) {
												handleSliderComplete(hue, value, brightness);
											}
										}}
										minimumTrackTintColor={COLORS.WHITE}
										maximumTrackTintColor="#333333"
										thumbTintColor={COLORS.WHITE}
									/>
								</View>
								<View style={styles.sliderRow}>
									<Text style={COMMON_STYLES.sliderText}>
										Brightness: {Math.round(brightness)}%
									</Text>
									<Slider
										style={[
											styles.slider,
											{ opacity: selectedDot !== null ? 1 : 0.5 },
										]}
										minimumValue={0}
										maximumValue={100}
										disabled={selectedDot === null}
										value={debouncedBrightness}
										onValueChange={(value) => {
											if (selectedDot !== null) {
												setBrightness(value);
												updateColor(hue, saturation, value);
											}
										}}
										onSlidingComplete={(value) => {
											if (selectedDot !== null) {
												handleSliderComplete(hue, saturation, value);
											}
										}}
										minimumTrackTintColor={COLORS.WHITE}
										maximumTrackTintColor="#333333"
										thumbTintColor={COLORS.WHITE}
									/>
								</View>
							</View>
							<View style={COMMON_STYLES.buttonContainer}>
								<View style={COMMON_STYLES.buttonRow}>
									<ActionButton
										title={isNew ? "Cancel" : "Reset"}
										onPress={isNew ? handleCancel : handleReset}
										disabled={!isNew && !hasChanges}
										opacity={
											isNew ? 1 : hasChanges ? 1 : COLORS.DISABLED_OPACITY
										}
									/>

									<ActionButton
										title="Save"
										onPress={handleSave}
										disabled={!hasChanges || !!nameError}
										opacity={
											hasChanges
												? !nameError
													? 1
													: COLORS.DISABLED_OPACITY
												: COLORS.DISABLED_OPACITY
										}
									/>

									<ActionButton
										title={
											previewMode
												? hasChanges
													? "Update"
													: "Preview"
												: "Preview"
										}
										onPress={() => {
											previewAPI();
											setPreviewMode(true);
										}}
										variant={!hasChanges && previewMode ? "disabled" : "primary"}
									/>
								</View>
							</View>
						</SafeAreaView>
					</Animated.View>
				</PanGestureHandler>
			</GestureHandlerRootView>
		</TouchableWithoutFeedback>
	);
}

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

const styles = StyleSheet.create({
	whiteText: {
		color: COLORS.WHITE,
		fontSize: 30 * scale,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
	},
	sliderRow: {
		marginVertical: 5 * scale,
	},
	slider: {
		width: "100%",
		height: 50 * scale,
	},
	hexContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: scale * 30,
		width: width * 0.85,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: COLORS.WHITE,
		padding: 10 * scale,
		borderRadius: 10,
	},
	hexInput: {
		color: COLORS.WHITE,
		fontSize: 22 * scale,
		fontFamily: FONTS.CLEAR,
		textTransform: "uppercase",
		letterSpacing: 3,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.WHITE,
		paddingVertical: 4,
		paddingHorizontal: 8,
		minWidth: width * 0.3,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: width * 0.9,
		marginTop: 40,
		marginBottom: height * 0.03,
		borderStyle: "solid",
		borderBottomWidth: 2,
		borderColor: COLORS.WHITE,
	},
	sliderWrapper: {
		position: "relative",
		width: "100%",
		height: 40 * scale,
		justifyContent: "center",
	}, // Removed styles for shuffle button as they are now in the RandomizeButton component
	sortButton: {
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 20 * scale,
		width: 60 * scale,
		height: 60 * scale,
	},
	sortIcon: {
		color: COLORS.WHITE,
		fontSize: 20 * scale,
		fontWeight: "ultralight",
		textAlign: "center",
	},
	colorButtons: {
		flexDirection: "row",
		marginLeft: 30 * scale,
	},
	nameInputContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	nameInput: {
		color: COLORS.WHITE,
		fontSize: 30 * scale,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		minWidth: width * 0.6,
		padding: 10,
	},
});
