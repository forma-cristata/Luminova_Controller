import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChooseModification from "./ChooseModification";
import ColorEditor from "./ColorEditor";
import { ConfigurationProvider } from "@/src/context/ConfigurationContext";
import FlashingPatternEditor from "./FlashingPatternEditor";
import Info from "./Info";
import type { Setting } from "@/src/interface/setting-interface";
import Settings from "./settings";
import Welcome from "./welcome";
import React from "react";

export type RootStackParamList = {
	Welcome: undefined;
	Settings: undefined;
	ChooseModification: { setting: Setting };
	ColorEditor: { setting: Setting; isNew?: boolean; originalName?: string };
	FlashingPatternEditor: { setting: Setting; isNew?: boolean };
	Info: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
SplashScreen.preventAutoHideAsync();

function Index() {
	const [loaded, error] = useFonts({
		Thesignature: require("../../assets/fonts/Thesignature.ttf"),
		"Clearlight-lJlq": require("../../assets/fonts/Clearlight-lJlq.ttf"),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<ConfigurationProvider>
			<GestureHandlerRootView>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Welcome" component={Welcome} />
					<Stack.Screen name="Settings" component={Settings} />
					<Stack.Screen
						name="ChooseModification"
						component={ChooseModification}
					/>
					<Stack.Screen name="ColorEditor" component={ColorEditor} />
					<Stack.Screen
						name="FlashingPatternEditor"
						component={FlashingPatternEditor}
					/>
					<Stack.Screen name="Info" component={Info} />
				</Stack.Navigator>
			</GestureHandlerRootView>
		</ConfigurationProvider>
	);
}

export default Index;
