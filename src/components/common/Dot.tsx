import React from "react";
import { View } from "react-native";

interface DotProps {
	color: string;
	size?: number; // diameter in px
	overlap?: number; // fraction (0..0.5) used to compute negative horizontal margin
}

export default function Dot({ color, size = 35, overlap = 0.2 }: DotProps) {
	const margin = -Math.round(size * overlap);
	return (
		<View
			style={{
				width: size,
				height: size,
				marginHorizontal: margin,
				backgroundColor: color,
				borderRadius: size / 2,
			}}
		/>
	);
}
