import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChooseModification from "./ChooseModification";
import ColorEditor from "./ColorEditor";
import { ConfigurationProvider } from "@/src/context/ConfigurationContext";
import FlashingPatternEditor from "./FlashingPatternEditor";
import Info from "./Info";
import type { Setting } from "@/src/types/SettingInterface";
import Settings from "./Settings";
import Welcome from "./Welcome";
import React from "react";

export type RootStackParamList = {
	Welcome: undefined;
	Settings: { setting?: Setting } | undefined;
	ChooseModification: { setting: Setting; settingIndex?: number };
	ColorEditor: {
		setting: Setting;
		isNew?: boolean;
		originalName?: string;
		settingIndex?: number;
		newSettingCarouselIndex?: number;
	};
	FlashingPatternEditor: {
		setting: Setting;
		isNew?: boolean;
		settingIndex?: number;
		newSettingCarouselIndex?: number;
	};
	Info: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Index() {
	return (
		<ConfigurationProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<NavigationContainer>
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
				</NavigationContainer>
			</GestureHandlerRootView>
		</ConfigurationProvider>
	);
}

export default Index;
