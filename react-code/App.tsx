import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import React from "react";
import { IpConfigService } from "./src/services/IpConfigService";

import Index from "./src/screens/index";

// Completely disable LogBox and console warnings
if (__DEV__) {
	// Disable console warnings that might trigger LogBox
	const originalWarn = console.warn;
	const originalError = console.error;

	console.warn = (...args) => {
		// Only log warnings that don't contain LogBox-related content
		const message = args.join(' ');
		if (!message.includes('LogBox') && !message.includes('Warning:')) {
			originalWarn.apply(console, args);
		}
	};

	console.error = (...args) => {
		// Only log errors that don't contain LogBox-related content
		const message = args.join(' ');
		if (!message.includes('LogBox')) {
			originalError.apply(console, args);
		}
	};

	// Try to disable LogBox if it exists
	try {
		const { LogBox } = require('react-native');
		if (LogBox && LogBox.ignoreAllLogs) {
			LogBox.ignoreAllLogs(true);
		}
	} catch (e) {
		// LogBox not available, which is fine
	}
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
	const [loaded, error] = useFonts({
		Thesignature: require("./assets/fonts/Thesignature.ttf"),
		"Clearlight": require("./assets/fonts/Clearlight-lJlq.ttf"),
	});
	const [ipLoaded, setIpLoaded] = useState(false);

	useEffect(() => {
		async function prepareApp() {
			try {
				// Load the IP address at startup
				await IpConfigService.loadIpAddress();
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

	return <Index />;
}
