import React, { useEffect, useState } from "react";
import { type DimensionValue, StyleSheet, Text } from "react-native";
import { FONTS } from "./SharedStyles";

interface AnimatedTitleProps {
	text: string;
	fontSize?: number;
	animationSpeed?: number;
	marginBottom?: DimensionValue;
	marginTop?: DimensionValue;
}

export default function AnimatedTitle({
	text,
	fontSize = 130,
	animationSpeed = 5,
	marginBottom = "20%",
	marginTop = 50,
}: AnimatedTitleProps) {
	const [textColor, setTextColor] = useState("#ffffff");

	useEffect(() => {
		const animationColors = [
			"#ff0000",
			"#000000",
			"#ff4400",
			"#000000",
			"#ff6a00",
			"#000000",
			"#ff9100",
			"#000000",
			"#ffee00",
			"#000000",
			"#00ff1e",
			"#000000",
			"#00ff44",
			"#000000",
			"#00ff95",
			"#000000",
			"#00ffff",
			"#000000",
			"#0088ff",
			"#000000",
			"#0000ff",
			"#000000",
			"#8800ff",
			"#000000",
			"#d300ff",
			"#000000",
			"#ff00BB",
			"#000000",
			"#ff0088",
			"#000000",
			"#ff0031",
			"#000000",
		];
		let colorIndex = 0;

		const colorInterval = setInterval(() => {
			setTextColor(animationColors[colorIndex]);
			colorIndex = (colorIndex + 1) % animationColors.length;
		}, animationSpeed);

		return () => {
			clearInterval(colorInterval);
		};
	}, [animationSpeed]);

	return (
		<Text
			style={[
				styles.title,
				{
					color: textColor,
					fontSize,
					marginBottom,
					marginTop,
				},
			]}
		>
			{text}
		</Text>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
	},
});
