// app/components/Dot.tsx
import React from "react";
import {TouchableOpacity, Animated, View, SafeAreaView} from "react-native";

interface DotProps {
    color: string;
    id: string;
}

export default function Dot({ color, id }: DotProps) {
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