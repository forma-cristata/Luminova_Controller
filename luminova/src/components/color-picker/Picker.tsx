import React, {
	useEffect,
	useRef,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { FLASHING_PATTERNS } from "@/src/configurations/patterns";
import { COLORS, FONTS, DIMENSIONS } from "@/src/styles/SharedStyles";
import type { Setting } from "@/src/types/SettingInterface";

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
	(
		{
			setting: _setting, // Prefix with underscore to indicate intentionally unused
			selectedPattern,
			setSelectedPattern,
		},
		ref,
	) => {
		const scrollViewRef = useRef<ScrollView>(null);
		const [isInitialLoad, setIsInitialLoad] = useState(true);

		const scrollToSelectedPattern = () => {
			if (scrollViewRef.current) {
				const selectedIndex = FLASHING_PATTERNS.findIndex(
					(p) => p.id === selectedPattern,
				);
				if (selectedIndex !== -1) {
					const itemHeight = 12 * 2 * scale + 25 * scale + 2;
					setTimeout(() => {
						scrollViewRef.current?.scrollTo({
							y: selectedIndex * itemHeight - 0.5 * itemHeight,
							animated: true,
						});
					}, 100);
				}
			}
		};

		useImperativeHandle(ref, () => ({
			refocus: () => {
				scrollToSelectedPattern();
			},
		}));

		useEffect(() => {
			// Only auto-scroll on initial load, not on subsequent pattern changes
			if (scrollViewRef.current && isInitialLoad) {
				const selectedIndex = FLASHING_PATTERNS.findIndex(
					(p) => p.id === selectedPattern,
				);
				if (selectedIndex !== -1) {
					const itemHeight = 12 * 2 * scale + 25 * scale + 2;
					setTimeout(() => {
						scrollViewRef.current?.scrollTo({
							y: selectedIndex * itemHeight - 0.5 * itemHeight,
							animated: false,
						});
						setIsInitialLoad(false); // Mark initial load as complete
					}, 100);
				} else {
					setIsInitialLoad(false); // Mark initial load as complete even if no pattern found
				}
			}
		}, [selectedPattern, isInitialLoad]);

		const handlePatternSelect = (patternId: string) => {
			setSelectedPattern(patternId);
			// Remove direct mutation - let parent component handle the setting update
		};

		return (
			<View style={styles.container}>
				<View style={styles.pickerContainer}>
					<ScrollView
						ref={scrollViewRef}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
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
	label: {
		color: COLORS.WHITE,
		fontSize: 18 * scale,
		fontFamily: FONTS.CLEAR,
		marginBottom: 8 * scale,
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
