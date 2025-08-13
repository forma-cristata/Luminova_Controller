import { StyleSheet, View } from "react-native";
import { useMemo } from "react";

// Define the ColorItem interface
interface ColorItem {
	id: string;
	color: string;
}

// Generate a deterministic ID based on the color value and its position
const generateId = (color: string, index: number): string => {
	const array = new Uint8Array(8);
	const data = `${color}-${index}`;
	for (let i = 0; i < data.length; i++) {
		array[i % 8] ^= data.charCodeAt(i);
	}
	return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
};

// Create the colors array with stable IDs outside the component
const colorsList: ColorItem[] = [
	"#FF0000",
	"#FF1700",
	"#FF2E00",
	"#FF4600",
	"#FF7400",
	"#FF8B00",
	"#FFA200",
	"#FFB900",
	"#FFD100",
	"#FFE800",
	"#FFFF00",
	"#E8FF00",
	"#D1FF00",
	"#B9FF00",
	"#A2FF00",
	"#8BFF00",
	"#74FF00",
	"#5DFF00",
	"#46FF00",
	"#2EFF00",
	"#17FF00",
	"#00FF00",
	"#00FF17",
	"#00FF2E",
	"#00FF46",
	"#00FF5D",
	"#00FF74",
	"#00FF8B",
	"#00FFA2",
	"#00FFB9",
	"#00FFD1",
	"#00FFE8",
	"#00FFFF",
	"#00E8FF",
	"#00D1FF",
	"#00B9FF",
	"#00A2FF",
	"#008BFF",
	"#0074FF",
	"#005DFF",
	"#0046FF",
	"#002EFF",
	"#0017FF",
	"#0000FF",
	"#1700FF",
	"#2E00FF",
	"#4600FF",
	"#5D00FF",
	"#7400FF",
	"#8B00FF",
	"#A200FF",
	"#B900FF",
	"#D100FF",
	"#E800FF",
	"#FF00FF",
	"#FF00E8",
	"#FF00D1",
	"#FF00B9",
	"#FF00A2",
	"#FF008B",
	"#FF0074",
	"#FF005D",
	"#FF0046",
	"#FF002E",
	"#FF0017",
	"#FF0000",
].map((color, index) => ({
	id: generateId(color, index),
	color
}));

const HueSliderBackground = () => {
	// Use memo just to keep the reference stable
	const hueColors = useMemo(() => colorsList, []);

	return (
		<View style={styles.sliderBackground}>
			<View style={styles.colorStrip}>
				{hueColors.map(({ id, color }) => (
					<View
						key={id}
						style={[styles.colorSegment, { backgroundColor: color }]}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	sliderBackground: {
		height: 10,
		width: "100%",
		borderRadius: 5,
		overflow: "hidden",
		position: "absolute",
	},
	colorStrip: {
		flex: 1,
		flexDirection: "row",
	},
	colorSegment: {
		flex: 1,
		height: "100%",
	},
});

export default HueSliderBackground;
