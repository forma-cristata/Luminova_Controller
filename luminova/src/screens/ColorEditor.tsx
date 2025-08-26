import {
	previewSetting,
	restoreConfiguration,
} from "@/src/services/ApiService";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
	loadSettings,
	saveSettings,
	updateSetting,
} from "@/src/services/SettingsService";
import { useState, useCallback } from "react";
import {
	Dimensions,
	Keyboard,
	SafeAreaView,
	ScrollView,
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

import ActionButton from "@/src/components/buttons/ActionButton";
import Header from "@/src/components/common/Header";
import ColorButton from "@/src/components/buttons/ColorButton";
import { ColorDots, ColorControl } from "@/src/components/color-picker";
import HexKeyboard from "@/src/components/common/HexKeyboard";
import RandomizeButton from "@/src/components/buttons/RandomizeButton";
import {
	COLORS,
	COMMON_STYLES,
	FONTS,
	DIMENSIONS,
} from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

type ColorEditorProps = NativeStackScreenProps<
	RootStackParamList,
	"ColorEditor"
>;

export default function ColorEditor({ navigation, route }: ColorEditorProps) {
	const {
		currentConfiguration,
		setLastEdited,
		isShelfConnected,
		setIsShelfConnected,
		isPreviewing: globalIsPreviewing,
		setIsPreviewing: setGlobalIsPreviewing,
	} = useConfiguration();

	const setting = route.params?.setting;
	const isNew = route.params?.isNew || false;
	const originalName = route.params?.originalName || setting.name;
	const settingIndex = route.params?.settingIndex; // Add support for index-based editing

	const [colors, setColors] = useState([...setting.colors]);
	const [selectedDot, setSelectedDot] = useState<number | null>(null);
	const [hue, setHue] = useState(0);
	const [brightness, setBrightness] = useState(100);
	const [saturation, setSaturation] = useState(0);

	const [hexInput, setHexInput] = useState("");
	const debouncedHexInput = useDebounce(hexInput, 200);
	// When a dot is selected we set hexInput from the existing color value.
	// That can race with the debounced-hex effect and cause the previous
	// debounced value to be applied to the newly-selected dot. Use a
	// suppression ref to ignore the next debounced hex update when it
	// originated from selecting a dot.
	const suppressDebouncedHexRef = React.useRef(false);
	const suppressTimeoutRef = React.useRef<number | null>(null);
	// Palette selection applied immediately (no debounce) to avoid race conditions
	const [colorHistory, setColorHistory] = useState<string[][]>([]);
	const [hasChanges, setHasChanges] = useState(isNew);
	const [hexKeyboardVisible, setHexKeyboardVisible] = useState(false);

	const startY = useSharedValue(0);
	const startX = useSharedValue(0);

	const [previewMode, setPreviewMode] = useState(false);

	// Name editing state (now used for both new and existing settings)
	const [settingName, setSettingName] = useState(setting.name);
	const debouncedSettingName = useDebounce(settingName, 300);
	const [nameError, setNameError] = useState<string | null>(null);

	const handleNameChange = (text: string) => {
		setSettingName(text);
		setHasChanges(true);
	};

	// Debounced name validation
	React.useEffect(() => {
		const validateName = async () => {
			if (debouncedSettingName === setting.name) {
				setNameError(null);
				return;
			}

			// Check for duplicate names
			const settings = await loadSettings();
			const nameExists = settings?.some(
				(s: Setting, index: number) =>
					s.name.toLowerCase() === debouncedSettingName.toLowerCase() &&
					s.name !== originalName &&
					(!isNew || index !== settingIndex), // Exclude current setting for existing settings
			);
			setNameError(nameExists ? "Name already exists." : null);
		};

		if (debouncedSettingName.trim()) {
			validateName();
		}
	}, [debouncedSettingName, setting.name, originalName, isNew, settingIndex]);

	const hexToRgb = useCallback((hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
			: null;
	}, []);

	const rgbToHsv = useCallback((r: number, g: number, b: number) => {
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
	}, []);

	const hsvToHex = useCallback((h: number, s: number, v: number) => {
		h = h / 360;
		s = s / 100;
		v = v / 100;

		let r: number = 0,
			g: number = 0,
			b: number = 0;
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
			Math.round(n * 255)
				.toString(16)
				.padStart(2, "0");
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}, []);

	const updateColor = useCallback(
		(h: number, s: number, v: number) => {
			if (selectedDot !== null) {
				const newColor = hsvToHex(h, s, v);
				setColorHistory((prev) => [...prev, [...colors]]);
				const newColors = [...colors];
				newColors[selectedDot] = newColor;
				setColors(newColors);
				setHexInput(newColor.replace("#", ""));
				setHasChanges(true);
			}
		},
		[selectedDot, colors, hsvToHex],
	);

	const handleDotSelect = (index: number) => {
		try {
			Keyboard.dismiss();
		} catch {
			// Keyboard was not visible or other error
		}
		// Suppress the debounced hex-effect for a short window so the
		// debounced value from a previous selection doesn't get applied
		// to the newly-selected dot.
		suppressDebouncedHexRef.current = true;
		if (suppressTimeoutRef.current) {
			clearTimeout(suppressTimeoutRef.current);
		}
		suppressTimeoutRef.current = setTimeout(() => {
			suppressDebouncedHexRef.current = false;
			suppressTimeoutRef.current = null;
		}, 100) as unknown as number;

		setHexInput(colors[index].replace("#", ""));

		const rgb = hexToRgb(colors[index]);
		if (rgb) {
			const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
			setHue(hsv.h);
			setBrightness(hsv.v);
			setSaturation(hsv.s);
		}
		setSelectedDot(index);
	};

	const handleHexKeyPress = (key: string) => {
		if (hexInput.length < 6) {
			const newHex = hexInput + key;
			setHexInput(newHex);
			if (newHex.length === 6) {
				applyHexColor(`#${newHex}`);
			}
		}
	};

	const handleHexBackspace = () => {
		if (hexInput.length > 0) {
			const newHex = hexInput.slice(0, -1);
			setHexInput(newHex);
			if (newHex.length === 6) {
				applyHexColor(`#${newHex}`);
			}
		}
	};

	const handleHexClear = () => {
		setHexInput("");
	};

	const openHexKeyboard = () => {
		if (selectedDot !== null) {
			Keyboard.dismiss();
			setHexKeyboardVisible(true);
		}
	};

	const applyHexColor = useCallback(
		(hexValue: string) => {
			if (selectedDot !== null) {
				const finalHex = hexValue.startsWith("#") ? hexValue : `#${hexValue}`;
				setColorHistory((prev) => [...prev, [...colors]]);
				const newColors = [...colors];
				newColors[selectedDot] = finalHex;
				setColors(newColors);
				setHasChanges(true);
				const rgb = hexToRgb(finalHex);
				if (rgb) {
					const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
					setHue(hsv.h);
					setBrightness(hsv.v);
					setSaturation(hsv.s);
				}
			}
		},
		[selectedDot, colors, hexToRgb, rgbToHsv],
	);

	// Get unique colors from palette (excluding white and black), always sorted by hue
	const getPaletteColors = useCallback(() => {
		// Normalize colors to uppercase and ensure they start with #
		const normalizedColors = colors.map((color) => {
			const normalized = color.toUpperCase();
			return normalized.startsWith("#") ? normalized : `#${normalized}`;
		});

		// Create set for uniqueness, then filter out white and black
		const uniqueColors = [...new Set(normalizedColors)];
		const filteredColors = uniqueColors.filter((color) => {
			return color !== "#FFFFFF" && color !== "#000000";
		});

		// Sort by hue regardless of main colors array order
		const colorsWithHSV = filteredColors.map((color) => {
			const rgb = hexToRgb(color);
			if (rgb) {
				const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
				return { color, h: hsv.h, s: hsv.s, v: hsv.v };
			}
			return { color, h: 0, s: 0, v: 0 };
		});
		colorsWithHSV.sort((a, b) => a.h - b.h);
		return colorsWithHSV.map((item) => item.color);
	}, [colors, hexToRgb, rgbToHsv]);

	const handlePaletteColorSelect = useCallback(
		(color: string) => {
			if (selectedDot === null) return;

			// Save to history and update the selected dot atomically
			setColors((prevColors) => {
				setColorHistory((prevHistory) => [...prevHistory, [...prevColors]]);
				const newColors = [...prevColors];
				newColors[selectedDot as number] = color;
				return newColors;
			});

			setHasChanges(true);
			setHexInput(color.replace("#", ""));

			const rgb = hexToRgb(color);
			if (rgb) {
				const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
				setHue(hsv.h);
				setBrightness(hsv.v);
				setSaturation(hsv.s);
			}
		},
		[selectedDot, hexToRgb, rgbToHsv],
	);

	// palette selection is applied immediately in handlePaletteColorSelect

	// Process debounced hex input for typed input
	React.useEffect(() => {
		// If a recent dot selection set the hexInput, suppress applying any
		// previously-debounced value to avoid applying the wrong color to the
		// newly-selected dot.
		if (suppressDebouncedHexRef.current) return;
		const hexRegex = /^#?([A-Fa-f0-9]{6})$/;
		const hexValue = debouncedHexInput.startsWith("#")
			? debouncedHexInput
			: `#${debouncedHexInput}`;

		if (
			hexRegex.test(hexValue) &&
			selectedDot !== null &&
			debouncedHexInput.length === 6
		) {
			const finalHex = hexValue.startsWith("#") ? hexValue : `#${hexValue}`;

			setColors((prevColors) => {
				// Save to history before updating
				setColorHistory((prevHistory) => [...prevHistory, [...prevColors]]);

				const newColors = [...prevColors];
				newColors[selectedDot] = finalHex;
				return newColors;
			});

			setHasChanges(true);

			const rgb = hexToRgb(finalHex);
			if (rgb) {
				const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
				setHue(hsv.h);
				setBrightness(hsv.v);
				setSaturation(hsv.s);
			}
		}
	}, [debouncedHexInput, selectedDot, hexToRgb, rgbToHsv]);

	// cleanup suppress timeout on unmount
	React.useEffect(() => {
		return () => {
			if (suppressTimeoutRef.current) {
				clearTimeout(suppressTimeoutRef.current);
			}
		};
	}, []);

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
		// Create a new setting object instead of modifying the original
		const updatedSetting = {
			...setting,
			name: settingName,
			colors: [...colors],
		};

		if (isNew) {
			navigation.navigate("FlashingPatternEditor", {
				setting: updatedSetting,
				isNew: true,
			});
		} else {
			if (settingIndex !== undefined) {
				const _updatedSettings = await updateSetting(
					settingIndex,
					updatedSetting,
				);

				const currentIndex = settingIndex; // Use the existing index
				if (currentIndex !== undefined) {
					setLastEdited(currentIndex.toString());
				}

				// Navigate directly to Settings
				navigation.navigate("Settings");
			}
		}
	};

	const handleSliderComplete = useCallback(
		(h: number, s: number, v: number) => {
			if (selectedDot !== null) {
				setColorHistory((prev) => [...prev, [...colors]]);
				const newColor = hsvToHex(h, s, v);
				const newColors = [...colors];
				newColors[selectedDot] = newColor;
				setColors(newColors);
				setHexInput(newColor.replace("#", ""));
			}
		},
		[selectedDot, colors, hsvToHex],
	);

	const handleCopyToBottom = () => {
		const newColors = [...colors];
		for (let i = 0; i < 8; i++) {
			newColors[i + 8] = newColors[i];
		}
		setColors(newColors);
		setColorHistory((prev) => [...prev, [...colors]]);
		setHasChanges(true);
	};

	const handleCopyToTop = () => {
		const newColors = [...colors];
		for (let i = 8; i < 16; i++) {
			newColors[i - 8] = newColors[i];
		}
		setColors(newColors);
		setColorHistory((prev) => [...prev, [...colors]]);
		setHasChanges(true);
	};

	const handleReverseTopRow = () => {
		const newColors = [...colors];
		for (let i = 0; i < 8; i++) {
			newColors[i] = colors[7 - i];
		}
		setColors(newColors);
		setColorHistory((prev) => [...prev, [...colors]]);
		setHasChanges(true);
	};

	const handleReverseBottomRow = () => {
		const newColors = [...colors];
		for (let i = 0; i < 8; i++) {
			newColors[i + 8] = colors[15 - i];
		}
		setColors(newColors);
		setColorHistory((prev) => [...prev, [...colors]]);
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
		if (globalIsPreviewing) {
			console.warn("Cannot preview: Preview operation already in progress");
			return;
		}

		setGlobalIsPreviewing(true);
		try {
			await previewSetting({
				colors: colors,
				flashingPattern: setting.flashingPattern,
				delayTime: setting.delayTime,
			});
			console.log("Preview successful");
			setIsShelfConnected(true);
		} catch (error) {
			console.error("Preview error:", error);
			setIsShelfConnected(false);
		} finally {
			setGlobalIsPreviewing(false);
		}
	};

	const unPreviewAPI = async () => {
		if (globalIsPreviewing) {
			console.warn("Cannot restore: Preview operation in progress");
			return;
		}

		setPreviewMode(false);
		if (currentConfiguration) {
			setGlobalIsPreviewing(true);
			try {
				await restoreConfiguration(currentConfiguration);
				console.log("Configuration restored");
				setIsShelfConnected(true);
			} catch (error) {
				console.error("Restore error:", error);
				setIsShelfConnected(false);
			} finally {
				setGlobalIsPreviewing(false);
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
		setColorHistory((prev) => [...prev, [...colors]]);
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
							<Header
								backButtonProps={{
									beforePress: previewMode ? unPreviewAPI : undefined,
								}}
							/>
							{renderTitle()}
							<ColorDots
								colors={colors}
								onDotSelect={handleDotSelect}
								selectedDot={selectedDot}
								layout="two-rows"
								key={colors.join(",")}
							/>

							{/* Color Palette Section */}
							{getPaletteColors().length > 0 ? (
								<View
									style={[
										styles.paletteContainer,
										{
											marginTop:
												selectedDot !== null && selectedDot >= 8
													? 25 * DIMENSIONS.SCALE // Push down for bottom row dots
													: 15 * DIMENSIONS.SCALE, // Normal position for top row dots
										},
									]}
								>
									<ScrollView
										horizontal
										showsHorizontalScrollIndicator={true}
										contentContainerStyle={styles.paletteScrollContent}
										style={{ width: "100%" }}
									>
										{getPaletteColors().map((color) => (
											<TouchableOpacity
												key={color}
												style={[
													styles.paletteColorButton,
													{ backgroundColor: color },
													{ opacity: selectedDot !== null ? 1 : 0.5 },
												]}
												onPress={() => handlePaletteColorSelect(color)}
												disabled={selectedDot === null}
												activeOpacity={0.7}
											/>
										))}
									</ScrollView>
								</View>
							) : null}

							<View
								style={[
									styles.hexContainer,
									{ opacity: selectedDot !== null ? 1 : 0.5 },
								]}
							>
								<Text style={COMMON_STYLES.sliderText}>Hex: #</Text>
								<TouchableOpacity
									style={[styles.hexInput]}
									onPress={openHexKeyboard}
									disabled={selectedDot === null}
									activeOpacity={0.7}
								>
									<Text
										style={[
											styles.hexInputText,
											{ color: hexInput ? COLORS.WHITE : COLORS.PLACEHOLDER },
										]}
									>
										{hexInput.toUpperCase() || "FFFFFF"}
									</Text>
								</TouchableOpacity>
								<View style={styles.colorButtons}>
									<ColorButton
										color="white"
										disabled={selectedDot === null}
										onPress={() => {
											if (selectedDot !== null) {
												setHexInput("FFFFFF");
												applyHexColor("#FFFFFF");
											}
										}}
										scale={DIMENSIONS.SCALE}
									/>
									<ColorButton
										color="black"
										disabled={selectedDot === null}
										onPress={() => {
											if (selectedDot !== null) {
												setHexInput("000000");
												applyHexColor("#000000");
											}
										}}
										scale={DIMENSIONS.SCALE}
									/>
								</View>
							</View>

							<View
								style={[
									COMMON_STYLES.sliderContainer,
									{ opacity: selectedDot !== null ? 1 : 0.5 },
								]}
							>
								<ColorControl
									type="hue"
									value={hue}
									disabled={selectedDot === null}
									onValueChange={(value) => {
										setHue(value);
										updateColor(value, saturation, brightness);
									}}
									onSlidingComplete={(value) => {
										handleSliderComplete(value, saturation, brightness);
									}}
								/>
								<ColorControl
									type="saturation"
									value={saturation}
									disabled={selectedDot === null}
									onValueChange={(value) => {
										setSaturation(value);
										updateColor(hue, value, brightness);
									}}
									onSlidingComplete={(value) => {
										handleSliderComplete(hue, value, brightness);
									}}
								/>
								<ColorControl
									type="brightness"
									value={brightness}
									disabled={selectedDot === null}
									onValueChange={(value) => {
										setBrightness(value);
										updateColor(hue, saturation, value);
									}}
									onSlidingComplete={(value) => {
										handleSliderComplete(hue, saturation, value);
									}}
								/>
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
											globalIsPreviewing
												? "Previewing..."
												: previewMode
													? hasChanges
														? "Update"
														: "Preview"
													: "Preview"
										}
										onPress={() => {
											if (isShelfConnected && !globalIsPreviewing) {
												previewAPI();
												setPreviewMode(true);
											}
										}}
										disabled={!isShelfConnected || globalIsPreviewing}
										variant={
											!hasChanges && previewMode ? "disabled" : "primary"
										}
										opacity={
											!isShelfConnected || globalIsPreviewing
												? COLORS.DISABLED_OPACITY
												: undefined
										}
									/>
								</View>
							</View>
						</SafeAreaView>
					</Animated.View>
				</PanGestureHandler>
				<HexKeyboard
					visible={hexKeyboardVisible}
					onClose={() => setHexKeyboardVisible(false)}
					onKeyPress={handleHexKeyPress}
					onBackspace={handleHexBackspace}
					onClear={handleHexClear}
					currentValue={hexInput}
				/>
			</GestureHandlerRootView>
		</TouchableWithoutFeedback>
	);
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	whiteText: {
		color: COLORS.WHITE,
		fontSize: 30 * DIMENSIONS.SCALE,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
	},
	hexContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: DIMENSIONS.SCALE * 12,
		width: width * 0.85,
		padding: 3 * DIMENSIONS.SCALE,
	},
	hexInput: {
		color: COLORS.WHITE,
		fontSize: 22 * DIMENSIONS.SCALE,
		fontFamily: FONTS.CLEAR,
		textTransform: "uppercase",
		letterSpacing: 2 * DIMENSIONS.SCALE,
		borderBottomWidth: 1 * DIMENSIONS.SCALE,
		borderBottomColor: COLORS.WHITE,
		paddingVertical: 4 * DIMENSIONS.SCALE,
		paddingHorizontal: 8 * DIMENSIONS.SCALE,
		width: 120 * DIMENSIONS.SCALE,
		textAlign: "center",
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
	},
	hexInputText: {
		color: COLORS.WHITE,
		fontSize: 22 * DIMENSIONS.SCALE,
		fontFamily: FONTS.CLEAR,
		textTransform: "uppercase",
		letterSpacing: 2 * DIMENSIONS.SCALE,
		textAlign: "center",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: width * 0.9,
		marginTop: 5 * DIMENSIONS.SCALE,
		marginBottom: height * 0.015,
		borderStyle: "solid",
		borderBottomWidth: 2 * DIMENSIONS.SCALE,
		borderColor: COLORS.WHITE,
	},
	sortButton: {
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 20 * DIMENSIONS.SCALE,
		width: Math.max(60 * DIMENSIONS.SCALE, width * 0.12),
		height: Math.max(60 * DIMENSIONS.SCALE, width * 0.12),
	},
	sortIcon: {
		color: COLORS.WHITE,
		fontSize: Math.max(20 * DIMENSIONS.SCALE, width * 0.04),
		fontWeight: "ultralight",
		textAlign: "center",
	},
	colorButtons: {
		flexDirection: "row",
		marginLeft: 30 * DIMENSIONS.SCALE,
	},
	nameInputContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	nameInput: {
		color: COLORS.WHITE,
		fontSize: 30 * DIMENSIONS.SCALE,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		minWidth: width * 0.6,
		padding: 5 * DIMENSIONS.SCALE,
	},
	paletteContainer: {
		alignItems: "center",
		marginTop: 15 * DIMENSIONS.SCALE,
		marginBottom: 3 * DIMENSIONS.SCALE,
		width: "100%",
	},
	paletteScrollContent: {
		paddingHorizontal: 20 * DIMENSIONS.SCALE,
		paddingVertical: 8 * DIMENSIONS.SCALE,
		alignItems: "center",
		flexGrow: 1,
	},
	paletteColorButton: {
		width: 20 * DIMENSIONS.SCALE,
		height: 20 * DIMENSIONS.SCALE,
		borderRadius: 10 * DIMENSIONS.SCALE,
		marginHorizontal: 3 * DIMENSIONS.SCALE,
	},
});
