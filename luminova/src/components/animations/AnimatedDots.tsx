import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";
import Dot from "@/src/components/common/Dot";
import { DIMENSIONS } from "@/src/styles/SharedStyles";

import type { Setting } from "@/src/types/SettingInterface";
import { getStableSettingId } from "@/src/utils/settingUtils";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

interface AnimatedDotsProps {
	navigation?: NativeStackNavigationProp<RootStackParamList>;
	setting: Setting;
	layout?: "ring" | "linear";
	// Optional container width to allow parent sizing (pixels)
	containerWidth?: number;
}

const LIGHT_COUNT = 16;

const black = "#000000";

const AnimatedDots = React.memo(
	function AnimatedDots({
		setting,
		layout = "linear",
		containerWidth,
	}: AnimatedDotsProps) {
		const COLOR_COUNT = setting.colors.length;

		const animationRef = useRef<boolean>(false);

		const timeoutRefs = useRef<(NodeJS.Timeout | number)[]>([]);

		const [isComponentActive, setIsComponentActive] = useState(true);

		// Initialize all 16 dot colors as an array - this will be reset when setting changes

		const [dotColors, setDotColors] = useState<string[]>(
			new Array(LIGHT_COUNT).fill(black),
		);

		// Handle navigation focus - restart animations when screen becomes focused

		useFocusEffect(
			React.useCallback(() => {
				setIsComponentActive(true);

				return () => {
					setIsComponentActive(false);
				};
			}, []),
		);

		// Helper function to initialize colors based on current setting

		const initializeColors = useCallback(() => {
			if (setting.flashingPattern === "6") {
				const initialColors = new Array(LIGHT_COUNT).fill(black);

				for (let i = 0; i < LIGHT_COUNT; i++) {
					const colorIndex =
						i < setting.colors.length ? i : i % setting.colors.length;
					initialColors[i] = setting.colors[colorIndex] || black;
				}

				return initialColors;
			}

			return new Array(LIGHT_COUNT).fill(black);
		}, [setting.flashingPattern, setting.colors]);

		// Clear all timeouts helper

		const clearAllTimeouts = useCallback(() => {
			timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
			timeoutRefs.current = [];
		}, []);

		// Helper function to create a managed timeout

		const createTimeout = useCallback(
			(callback: () => void, delay: number): Promise<void> => {
				return new Promise((resolve) => {
					const timeout = setTimeout(() => {
						callback();
						resolve();
					}, delay);
					timeoutRefs.current.push(timeout);
				});
			},
			[],
		);

		// Helper function to update a specific LED color

		const setLedColor = useCallback(
			(index: number, color: string) => {
				if (!animationRef.current || !isComponentActive) return;
				setDotColors((prev) => {
					const newColors = [...prev];

					newColors[index] = color;

					return newColors;
				});
			},
			[isComponentActive],
		);

		// Helper function to set all LEDs to a specific color

		const setAllLeds = useCallback(
			(color: string) => {
				if (!animationRef.current || !isComponentActive) return;
				setDotColors(new Array(LIGHT_COUNT).fill(color));
			},
			[isComponentActive],
		);

		// Random number generator

		const random = useCallback((min: number, max: number) => {
			return Math.floor(Math.random() * (max - min)) + min;
		}, []);

		// Updated animation helper that checks both refs

		const _isActive = () => animationRef.current && isComponentActive;

		// Animation patterns with proper cleanup

		const blenderAnimation = useCallback(
			async (isActive: () => boolean) => {
				const currentTime = Date.now();

				const colorOffset = Math.floor(currentTime / 100) % COLOR_COUNT;

				for (let i = 0; i < LIGHT_COUNT; i++) {
					if (!isActive()) return;

					const colorIndex = (i + colorOffset) % COLOR_COUNT;

					await createTimeout(() => { }, setting.delayTime * 4);

					if (!isActive()) return;
					setLedColor(i, setting.colors[colorIndex]);
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const christmasAnimation = useCallback(
			async (isActive: () => boolean) => {
				for (let xy = 0; xy < COLOR_COUNT; xy++) {
					if (!isActive()) return;
					let f = 0;

					for (let j = 0; j < LIGHT_COUNT; j += 2) {
						if (!isActive()) return;
						await createTimeout(() => { }, setting.delayTime / 16);

						if (!isActive()) return;
						setLedColor(j % LIGHT_COUNT, setting.colors[xy]);

						if (j === 8) {
							f = (xy + 1) % COLOR_COUNT;
							await createTimeout(() => { }, setting.delayTime / 16);

							if (!isActive()) return;
							setLedColor(j % LIGHT_COUNT, setting.colors[f]);
						}

						if (j === 12) {
							f = (xy + 2) % COLOR_COUNT;
							await createTimeout(() => { }, setting.delayTime / 16);

							if (!isActive()) return;
							setLedColor(j % LIGHT_COUNT, setting.colors[f]);
						}
						f = (xy + 3) % COLOR_COUNT;

						const nextLed = (j + 1) % LIGHT_COUNT;

						await createTimeout(() => { }, setting.delayTime * 3);

						if (!isActive()) return;
						setLedColor(nextLed, setting.colors[f]);
					}

					for (let j = 1; j < LIGHT_COUNT; j += 2) {
						if (!isActive()) return;
						await createTimeout(() => { }, setting.delayTime * 3);

						if (!isActive()) return;
						setLedColor(j % LIGHT_COUNT, setting.colors[xy]);
						f = (xy + 3) % COLOR_COUNT;

						const prevLed = (j - 1 + LIGHT_COUNT) % LIGHT_COUNT;

						setLedColor(prevLed, setting.colors[f]);
						await createTimeout(() => { }, setting.delayTime * 3);
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const comfortSongAnimation = useCallback(
			async (isActive: () => boolean) => {
				const patternIndices = [1, 2, 3, 2, 4, 3, 2, 1, 0, 1, 2, 1, 3, 2, 1, 0];

				const pattern2Indices = [
					7, 8, 9, 8, 10, 9, 8, 7, 6, 7, 8, 7, 9, 8, 7, 6,
				];

				const pattern3Indices = [
					13, 14, 15, 14, 15, 14, 13, 12, 11, 12, 13, 14, 15, 14, 13, 12,
				];
				setAllLeds(black);

				if (!isActive()) return;

				for (let x = 0; x < COLOR_COUNT * 2; x++) {
					for (let i = 0; i < 2; i++) {
						if (!isActive()) return;
						let index1 = patternIndices[x % LIGHT_COUNT] % LIGHT_COUNT;
						let index2 = pattern2Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
						let index3 = pattern3Indices[x % LIGHT_COUNT] % LIGHT_COUNT;

						if (index1 < 0) index1 += LIGHT_COUNT;

						if (index2 < 0) index2 += LIGHT_COUNT;

						if (index3 < 0) index3 += LIGHT_COUNT;
						setLedColor(index1, setting.colors[x % LIGHT_COUNT]);
						await createTimeout(() => { }, setting.delayTime * 8);
						setLedColor(index1, black);
						setLedColor(index2, setting.colors[x % LIGHT_COUNT]);
						await createTimeout(() => { }, setting.delayTime * 8);
						setLedColor(index2, black);
						setLedColor(index3, setting.colors[x % LIGHT_COUNT]);
						await createTimeout(() => { }, setting.delayTime * 8);
						setLedColor(index3, black);
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setAllLeds,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const funkyAnimation = useCallback(
			async (isActive: () => boolean) => {
				const strobeCount1 = 12;

				const strobeCount2 = 12;

				const ledsPerGroup = 4;

				for (let colorer = 0; colorer < COLOR_COUNT; colorer++) {
					for (let strobe = 0; strobe < strobeCount1; strobe++) {
						if (!isActive()) return;
						await createTimeout(() => { }, setting.delayTime * 12);

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = random(0, LIGHT_COUNT);

							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[(ledIndex + colorer) % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime);
						}
						await createTimeout(() => { }, setting.delayTime * 12);

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = random(0, LIGHT_COUNT);

							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
							await createTimeout(() => { }, setting.delayTime);
						}
					}

					for (let strobe = 0; strobe < strobeCount2; strobe++) {
						if (!isActive()) return;
						await createTimeout(() => { }, setting.delayTime * 12);

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = random(0, LIGHT_COUNT);

							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[(ledIndex + colorer) % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime);
						}
						await createTimeout(() => { }, setting.delayTime * 12);

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = random(0, LIGHT_COUNT);

							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
							await createTimeout(() => { }, setting.delayTime);
						}
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				random,
				COLOR_COUNT,
			],
		);

		const stillAnimation = useCallback(async () => {
			// Static colors - set once and don't animate

			const newColors = new Array(LIGHT_COUNT).fill(black);

			for (let i = 0; i < LIGHT_COUNT; i++) {
				const colorIndex =
					i < setting.colors.length ? i : i % setting.colors.length;
				newColors[i] = setting.colors[colorIndex] || black;
			}
			setDotColors(newColors);
		}, [setting.colors]);

		const moldAnimation = useCallback(
			async (isActive: () => boolean) => {
				const strobeCount1 = 2;

				const strobeCount2 = 2;

				const ledsPerGroup = 12;

				setAllLeds(black);

				if (!isActive()) return;

				for (let startIdx = LIGHT_COUNT - 1; startIdx >= 0; startIdx--) {
					if (!isActive()) return;

					for (let strobe = 0; strobe < strobeCount1; strobe++) {
						if (!isActive()) return;

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							if (!isActive()) return;
							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[ledIndex % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime / 2);

							if (!isActive()) return;
							setLedColor(ledIndex % LIGHT_COUNT, black);
						}

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
						}
					}

					for (let strobe = 0; strobe < strobeCount2; strobe++) {
						if (!isActive()) return;

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[ledIndex % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime / 2);

							if (!isActive()) return;
							setLedColor(ledIndex % LIGHT_COUNT, black);
						}

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
						}
					}
				}

				for (let startIdx = 0; startIdx < LIGHT_COUNT; startIdx++) {
					if (!isActive()) return;

					for (let strobe = 0; strobe < strobeCount1; strobe++) {
						if (!isActive()) return;

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							if (!isActive()) return;
							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[ledIndex % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime / 2);

							if (!isActive()) return;
							setLedColor(ledIndex % LIGHT_COUNT, black);
						}

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
						}
					}

					for (let strobe = 0; strobe < strobeCount2; strobe++) {
						if (!isActive()) return;

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							if (!isActive()) return;
							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[ledIndex % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime / 2);

							if (!isActive()) return;
							setLedColor(ledIndex % LIGHT_COUNT, black);
						}

						for (let i = 0; i < ledsPerGroup; i++) {
							const ledIndex = startIdx + i;

							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
						}
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setAllLeds,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const progressiveAnimation = useCallback(
			async (isActive: () => boolean) => {
				for (let j = 0; j < COLOR_COUNT; j++) {
					for (let i = 0; i < LIGHT_COUNT; i++) {
						if (!isActive()) return;
						let ledIndex = (j + i) % LIGHT_COUNT;
						let ledIndex2 = (j + i + 1) % LIGHT_COUNT;

						setLedColor(ledIndex, setting.colors[j % COLOR_COUNT]);
						setLedColor(ledIndex2, setting.colors[j % COLOR_COUNT]);
						await createTimeout(() => { }, setting.delayTime * 2);

						if (!isActive()) return;
						ledIndex = (j + i + 1) % LIGHT_COUNT;
						ledIndex2 = (j + i + 2) % LIGHT_COUNT;
						setLedColor(ledIndex, setting.colors[j % COLOR_COUNT]);
						setLedColor(ledIndex2, setting.colors[j % COLOR_COUNT]);
						await createTimeout(() => { }, setting.delayTime * 2);
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const strobeChangeAnimation = useCallback(
			async (isActive: () => boolean) => {
				for (let i = 0; i < COLOR_COUNT; i++) {
					for (let j = 0; j < LIGHT_COUNT / 2; j++) {
						if (!isActive()) return;

						const offset = (i + j * 2) % LIGHT_COUNT;

						for (let k = 0; k < 2; k++) {
							if (!isActive()) return;
							setLedColor(offset, black);
							await createTimeout(() => { }, setting.delayTime * 8);

							if (!isActive()) return;
							setLedColor(offset, setting.colors[i]);
						}
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const technoAnimation = useCallback(
			async (isActive: () => boolean) => {
				setAllLeds(black);

				for (let i = 0; i < COLOR_COUNT; i++) {
					if (!isActive()) return;

					const m = (i + 1) % COLOR_COUNT;

					const n = (i + 2) % COLOR_COUNT;

					const o = (i + 3) % COLOR_COUNT;

					const p = (i + 4) % COLOR_COUNT;

					for (let j = 15; j >= 0; j--) {
						if (!isActive()) return;

						const k = (j + 1) % LIGHT_COUNT;

						const l = (j + 2) % LIGHT_COUNT;

						const y = (j + 3) % LIGHT_COUNT;

						const z = (j + 4) % LIGHT_COUNT;

						for (let x = 0; x < 2; x++) {
							if (!isActive()) return;
							setLedColor(j, setting.colors[i]);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor(j, black);
							setLedColor(k, setting.colors[m]);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor(k, black);
							setLedColor(l, setting.colors[n]);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor(l, black);
							setLedColor(y, setting.colors[o]);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor(y, black);
							setLedColor(z, setting.colors[p]);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor(z, black);
						}
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setAllLeds,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const traceManyAnimation = useCallback(
			async (isActive: () => boolean) => {
				for (let i = 0; i < LIGHT_COUNT; i++) {
					setLedColor(i, setting.colors[0]);
				}

				for (let i = 0; i < LIGHT_COUNT; i++) {
					for (let j = 0; j < LIGHT_COUNT / 2; j++) {
						if (!isActive()) return;
						let offset = (i + j * 2) % LIGHT_COUNT;

						const colInd1 = (i + 1) % (COLOR_COUNT / 2);

						const colInd2 = (i + 2) % COLOR_COUNT;

						setLedColor(offset, setting.colors[colInd1]);
						await createTimeout(() => { }, setting.delayTime * 2);

						if (!isActive()) return;
						offset = (i + j * 2 + 8) % LIGHT_COUNT;
						setLedColor(offset, setting.colors[colInd2]);
						await createTimeout(() => { }, setting.delayTime * 2);
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const traceOneAnimation = useCallback(
			async (isActive: () => boolean) => {
				for (let kc = 0; kc < LIGHT_COUNT; kc++) {
					for (let i = 0; i < LIGHT_COUNT; i++) {
						setLedColor(i, setting.colors[kc]);
					}

					for (let i = 0; i < COLOR_COUNT; i++) {
						for (let j = 0; j < LIGHT_COUNT; j++) {
							if (!isActive()) return;
							setLedColor(j, setting.colors[(i + j) % COLOR_COUNT]);
							await createTimeout(() => { }, setting.delayTime * 2);

							if (!isActive()) return;
							setLedColor(j, setting.colors[(kc + j) % COLOR_COUNT]);
						}
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);

		const tranceAnimation = useCallback(
			async (isActive: () => boolean) => {
				const sc1 = 2;

				const sc2 = 2;

				const ls = 4;

				for (let j = 0; j < LIGHT_COUNT; j++) {
					for (let k = 0; k < sc1; k++) {
						for (let i = 0; i < ls; i++) {
							if (!isActive()) return;

							const li = j + i;

							setLedColor(
								(li + 1) % LIGHT_COUNT,
								setting.colors[li % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor((li + 1) % LIGHT_COUNT, black);
							await createTimeout(() => { }, setting.delayTime * 4);
						}
					}

					for (let strobe = 0; strobe < sc2; strobe++) {
						for (let i = 0; i < ls; i++) {
							if (!isActive()) return;

							const ledIndex = j + i;

							setLedColor(
								(ledIndex + 1) % LIGHT_COUNT,
								setting.colors[ledIndex % COLOR_COUNT],
							);
							await createTimeout(() => { }, setting.delayTime * 4);

							if (!isActive()) return;
							setLedColor((ledIndex + 1) % LIGHT_COUNT, black);
							await createTimeout(() => { }, setting.delayTime * 4);
						}
					}
				}
			},
			[
				setting.delayTime,
				setting.colors,
				setLedColor,
				createTimeout,
				COLOR_COUNT,
			],
		);
		useEffect(() => {
			// Reset animation state and clear any existing timeouts

			animationRef.current = true;
			clearAllTimeouts();

			// Reset colors to proper initial state for the new setting

			const initialColors = initializeColors();

			setDotColors(initialColors);

			// Small delay to ensure state is updated before starting animation

			const startAnimation = async () => {
				// Wait a tick to ensure state has been set

				await new Promise((resolve) => setTimeout(resolve, 0));

				if (!animationRef.current) return;

				const animate = async () => {
					if (!animationRef.current) return;

					switch (setting.flashingPattern) {
						case "0": // BLENDER
							await blenderAnimation(() => animationRef.current);
							break;
						case "1": // CHRISTMAS
							await christmasAnimation(() => animationRef.current);
							break;
						case "2": // COMFORT SONG
							await comfortSongAnimation(() => animationRef.current);
							break;
						case "3": // FUNKY
							await funkyAnimation(() => animationRef.current);
							break;
						case "4": // MOLD
							await moldAnimation(() => animationRef.current);
							break;
						case "5": // PROGRESSIVE
							await progressiveAnimation(() => animationRef.current);
							break;
						case "6": // STILL
							await stillAnimation();
							return; // Don't repeat for still effect
						case "7": // STROBE CHANGE
							await strobeChangeAnimation(() => animationRef.current);
							break;
						case "8": // TECHNO
							await technoAnimation(() => animationRef.current);
							break;
						case "9": // TRACE MANY
							await traceManyAnimation(() => animationRef.current);
							break;
						case "10": // TRACE ONE
							await traceOneAnimation(() => animationRef.current);
							break;
						case "11": // TRANCE
							await tranceAnimation(() => animationRef.current);
							break;
						default:
							setAllLeds(setting.colors[0] || black);

							return;
					}

					// Only continue looping for non-still patterns if still active

					const isStillPattern = (setting.flashingPattern as string) === "6";

					if (animationRef.current && !isStillPattern) {
						setTimeout(animate, 0);
					}
				};
				animate();
			};
			startAnimation();

			return () => {
				animationRef.current = false;
				clearAllTimeouts();
			};
		}, [
			setting,
			blenderAnimation,
			christmasAnimation,
			clearAllTimeouts,
			comfortSongAnimation,
			funkyAnimation,
			initializeColors,
			moldAnimation,
			progressiveAnimation,
			setAllLeds,
			stillAnimation,
			strobeChangeAnimation,
			technoAnimation,
			traceManyAnimation,
			traceOneAnimation,
			tranceAnimation,
		]);

		return (
			<SafeAreaView style={styles.background}>
				{layout === "ring" ? (
					<View style={styles.ringContainer}>
						{dotColors
							? dotColors.map((color, index) => {
								const stableKey = `${getStableSettingId(setting)}-dot-${index}`;
								const angle = (index * 360) / LIGHT_COUNT; // Calculate angle for each dot
								const ringStyle = {
									position: "absolute" as const,
									transform: [
										{ rotate: `${angle}deg` },
										{ translateX: 50 }, // Radius of the ring
										{ rotate: `-${angle}deg` }, // Counter-rotate to keep dots upright
									],
								};
								return (
									<View key={stableKey} style={ringStyle}>
										<Dot color={color || black} />
									</View>
								);
							})
							: null}
					</View>
				) : (
					<View
						style={[
							styles.linearContainer,
							{ width: containerWidth ?? DIMENSIONS.SCREEN_WIDTH * 0.85 },
						]}
					>
						{dotColors
							? (() => {
								// Compute dot size so 16 dots with overlap fill the container width
								const containerW =
									containerWidth ?? DIMENSIONS.SCREEN_WIDTH * 0.85;
								// Let overlap be 0.2 (20% of dot width) as a default
								const overlapFraction = 0.2;
								// Effective horizontal step per dot = size - 2*overlap*size = size*(1 - 2*overlap)
								// For n dots: containerW ≈ size + (n - 1) * step
								const n = dotColors.length || 16;
								const stepFraction = 1 - 2 * overlapFraction;
								const sizeEstimate =
									containerW / (1 + (n - 1) * stepFraction);
								const dotSize = Math.max(12, Math.round(sizeEstimate));

								return dotColors.map((color, index) => {
									const stableKey = `${getStableSettingId(setting)}-dot-${index}`;
									return (
										<Dot
											key={stableKey}
											color={color || black}
											size={dotSize}
											overlap={overlapFraction}
										/>
									);
								});
							})()
							: null}
					</View>
				)}
			</SafeAreaView>
		);
	},
	(prevProps, nextProps) => {
		// Only re-render if essential animation properties change
		return (
			prevProps.setting.delayTime === nextProps.setting.delayTime &&
			prevProps.setting.flashingPattern === nextProps.setting.flashingPattern &&
			JSON.stringify(prevProps.setting.colors) ===
			JSON.stringify(nextProps.setting.colors) &&
			prevProps.layout === nextProps.layout
		);
	},
);

export default AnimatedDots;

const styles = StyleSheet.create({
	background: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: DIMENSIONS.SCREEN_HEIGHT * 0.01,
	},
	ringContainer: {
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	linearContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});
