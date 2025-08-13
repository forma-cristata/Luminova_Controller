import { useEffect, useRef } from "react";
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const FLASHING_PATTERNS = [
	{ id: "8", name: "Berghain Bitte" },
	{ id: "5", name: "Cortez" },
	{ id: "4", name: "Decay" },
	{ id: "3", name: "Feel the Funk" },
	{ id: "9", name: "Lapis Lazuli" },
	{ id: "10", name: "Medusa" },
	{ id: "2", name: "The Piano Man" },
	{ id: "1", name: "Smolder" },
	{ id: "11", name: "State of Trance" },
	{ id: "6", name: "Still" },
	{ id: "0", name: "Stuck in a Blender" },
	{ id: "7", name: "The Underground" },
];

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

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
		color: "white",
		fontSize: 18 * scale,
		fontFamily: "Clearlight-lJlq",
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
		fontFamily: "Clearlight-lJlq",
	},
	selectedText: {
		color: "#ffffff",
	},
});
