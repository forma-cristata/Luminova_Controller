import React, { useEffect, useState } from "react";
import { type DimensionValue, Text } from "react-native";
import { COMMON_STYLES } from "@/src/styles/SharedStyles";
import { ANIMATION_COLORS } from "@/src/configurations/constants";

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
		const animationColors = ANIMATION_COLORS;
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
				COMMON_STYLES.whiteText,
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