import React, { useEffect, useRef } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { FLASHING_PATTERNS } from "@/src/configurations/patterns";
import { COLORS, FONTS, DIMENSIONS } from "@/src/styles/SharedStyles";

const { SCALE: scale } = DIMENSIONS;

export default function Picker({
	setting,
	selectedPattern,
	setSelectedPattern,
}: any) {
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		if (scrollViewRef.current) {
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
				}, 100);
			}
		}
	}, [selectedPattern]);

	const handlePatternSelect = (patternId: string) => {
		setSelectedPattern(patternId);
		setting.flashingPattern = patternId;
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
}
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
