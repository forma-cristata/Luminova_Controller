import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import React from "react";

import Index from "./src/screens/index";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {	const [loaded, error] = useFonts({
		Thesignature: require("./assets/fonts/Thesignature.ttf"),
		"Clearlight": require("./assets/fonts/Clearlight-lJlq.ttf"),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	// Return null while loading to show splash screen
	if (!loaded && !error) {
		return null;
	}

	return <Index />;
}
