import React from "react";
import { View } from "react-native";

interface DotProps {
	color: string;
	size?: number;
	overlap?: number;
}

export default function Dot({ color, size = 35, overlap = 7 }: DotProps) {
	return (
		<View
			style={{
				width: size,
				height: size,
				marginHorizontal: -overlap,
				backgroundColor: color,
				borderRadius: size / 2, // Half of the size to make a perfect circle
			}}
		/>
	);
}
