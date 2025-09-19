import { FLASHING_PATTERNS } from "@/src/configurations/patterns";
import { COLORS, DIMENSIONS, FONTS } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { SCALE: scale } = DIMENSIONS;

export interface PickerRef {
	refocus: () => void;
}

interface PickerProps {
	setting: Setting; // TODO: Currently unused but might be needed for future enhancements
	selectedPattern: string;
	setSelectedPattern: (pattern: string) => void;
}

const Picker = forwardRef<PickerRef, PickerProps>(
	({ selectedPattern, setSelectedPattern }, ref) => {
		const scrollViewRef = useRef<ScrollView>(null);

		const scrollToSelectedPattern = useCallback(
			(animated = true) => {
				if (scrollViewRef.current && selectedPattern) {
					const selectedIndex = FLASHING_PATTERNS.findIndex(
						(p) => p.id === selectedPattern,
					);
					if (selectedIndex !== -1) {
						// Calculate actual item height: paddingVertical(24 total) + fontSize(25) + borderBottomWidth(1)
						const itemHeight = 24 * scale + 25 * scale + 1;
						const containerHeight = 150 * scale;
						const scrollContentPadding = 5 * scale; // paddingVertical from scrollContent

						// Calculate position to center the selected item
						const itemTopPosition =
							selectedIndex * itemHeight + scrollContentPadding;
						const scrollY = Math.max(
							0,
							itemTopPosition - containerHeight / 2 + itemHeight / 2,
						);

						// Use requestAnimationFrame for smoother scrolling
						requestAnimationFrame(() => {
							scrollViewRef.current?.scrollTo({
								y: scrollY,
								animated,
							});
						});
					}
				}
			},
			[selectedPattern],
		);
		useImperativeHandle(ref, () => ({
			refocus: () => {
				// Use the same animated scroll logic as pattern changes
				scrollToSelectedPattern(true);
			},
		}));
		useEffect(() => {
			// Auto-scroll to center the selected pattern whenever it changes (with animation)
			if (selectedPattern && scrollViewRef.current) {
				// Small delay to ensure ScrollView is fully rendered
				const timeoutId = setTimeout(() => {
					scrollToSelectedPattern(true); // Use animation for all pattern changes
				}, 50);

				return () => clearTimeout(timeoutId);
			}
		}, [selectedPattern, scrollToSelectedPattern]);

		const handlePatternSelect = (patternId: string) => {
			setSelectedPattern(patternId);
		};

		return (
			<View style={styles.container}>
				<View style={styles.pickerContainer}>
					<ScrollView
						ref={scrollViewRef}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
						scrollEventThrottle={1}
						decelerationRate="normal"
						bounces={false}
						overScrollMode="never"
						nestedScrollEnabled={true}
						removeClippedSubviews={false}
					>
						{FLASHING_PATTERNS.map((pattern) => (
							<TouchableOpacity
								key={pattern.id}
								style={[
									styles.patternOption,
									selectedPattern === pattern.id && styles.selectedOption,
								]}
								onPress={() => handlePatternSelect(pattern.id)}
							>
								<Text
									style={[
										styles.patternText,
										selectedPattern === pattern.id && styles.selectedText,
									]}
								>
									{pattern.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			</View>
		);
	},
);
Picker.displayName = "Picker";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	pickerContainer: {
		height: 150 * scale,
		width: "100%",
		borderRadius: 8,
		overflow: "hidden",
	},
	scrollContent: {
		paddingVertical: 5 * scale,
	},
	patternOption: {
		paddingVertical: 12 * scale,
		paddingHorizontal: 15 * scale,
		borderBottomWidth: 1,
		borderBottomColor: "#333",
	},
	selectedOption: {
		backgroundColor: "#333",
	},
	patternText: {
		color: "darkgray",
		fontSize: 25 * scale,
		textAlign: "center",
		fontFamily: FONTS.CLEAR,
	},
	selectedText: {
		color: COLORS.WHITE,
	},
});

export default Picker;
