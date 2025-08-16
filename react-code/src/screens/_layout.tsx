import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ConfigurationProvider } from "@/src/context/ConfigurationContext";
import { loadIpAddress } from "@/src/services/IpConfigService";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Thesignature: require("../../assets/fonts/Thesignature.ttf"),
		"Clearlight": require("../../assets/fonts/Clearlight-lJlq.ttf"),
	});
	const [ipLoaded, setIpLoaded] = useState(false);

	useEffect(() => {
		async function prepareApp() {
			try {
				// Load the IP address at startup
				await loadIpAddress();
			} catch (e) {
				console.warn("Failed to load IP on startup", e);
			} finally {
				setIpLoaded(true);
			}
		}

		prepareApp();
	}, []);

	useEffect(() => {
		if ((loaded || error) && ipLoaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error, ipLoaded]);

	// Return null while loading to show splash screen
	if ((!loaded && !error) || !ipLoaded) {
		return null;
	}

	return (
		<ConfigurationProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="index" />
					<Stack.Screen name="Settings" />
					<Stack.Screen name="ChooseModification" />
					<Stack.Screen name="ColorEditor" />
					<Stack.Screen name="FlashingPatternEditor" />
					<Stack.Screen name="Info" />
				</Stack>
			</GestureHandlerRootView>
		</ConfigurationProvider>
	);
}
