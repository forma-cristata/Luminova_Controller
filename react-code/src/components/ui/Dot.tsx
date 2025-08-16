import React from "react";
import { View } from "react-native";

interface DotProps {
	color: string;
}

export default function Dot({ color }: DotProps) {
	return (
		<View
			style={{
				width: 35,
				height: 35,
				marginHorizontal: -7,
				backgroundColor: color,
				borderRadius: 17.5, // Half of the width/height (35) to make a perfect circle
			}}
		/>
	);
}
