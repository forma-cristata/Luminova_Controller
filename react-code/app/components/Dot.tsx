import React from "react";
import { SafeAreaView } from "react-native";

interface DotProps {
	color: string;
	id: string;
}

export default function Dot({ color }: DotProps) {
	return (
		<SafeAreaView
			style={{
				width: 35,
				height: 35,
				marginHorizontal: -7,
				backgroundColor: color,
				borderRadius: "50%",
			}}
		/>
	);
}
