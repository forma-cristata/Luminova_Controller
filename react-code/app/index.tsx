    import Welcome from "@/app/welcome";
    import Settings from "@/app/settings";
    import {createNativeStackNavigator} from "@react-navigation/native-stack";
    import {useFonts} from "expo-font";
    import {useEffect} from "react";
    import * as SplashScreen from "expo-splash-screen";
    import ChooseModificatioon from "@/app/ChooseModificatioon";
    import ColorEditor from "@/app/ColorEditor";
    import FlashingPatternEditor from "@/app/FlashingPatternEditor";
    import Setting from "@/app/interface/setting-interface";

    // TypeScript type definition for the navigation stack parameters
    // Currently both screens don't require any parameters
    export type RootStackParamList = {
        Welcome: undefined;
        Settings: undefined;
        ChooseModification: { setting: Setting };
        ColorEditor: { setting: Setting };
        FlashingPatternEditor: { setting: Setting };
    }

    // Create a navigation stack with our defined parameter types
    const Stack = createNativeStackNavigator<RootStackParamList>();

    // Prevent the splash screen from auto-hiding until we're ready
    SplashScreen.preventAutoHideAsync();

    export default function Index() {
        // Load the custom font using Expo's useFonts hook
        // Returns [loaded, error] state to handle font loading
        const [loaded, error] = useFonts({
            'Thesignature': require('../assets/fonts/Thesignature.ttf'),
            'Clearlight-lJlq': require('../assets/fonts/Clearlight-lJlq.ttf'),
        });

        // Effect hook to hide splash screen once fonts are loaded or if there's an error
            /*
            A splash screen is a temporary loading screen that appears when an app is launching.
            In React Native applications using Expo, the splash screen serves several important purposes:

                1. It provides visual feedback to users that the app is loading
                2. It covers the initial loading period while the JavaScript bundle and assets (like custom fonts) are being loaded
                3. It helps maintain a polished appearance during app initialization

            In this code, `SplashScreen.preventAutoHideAsync()` is used to keep the splash screen visible until the app is fully ready,
            particularly until the custom font `Thesignature` is loaded. Without this control,
            the splash screen might disappear before assets are ready, potentially showing an incomplete or broken UI to the user.

            The splash screen is typically configured in the `app.json` file and can be customized with your own image and background color.
            The splash screen is automatically hidden when `SplashScreen.hideAsync()` is called,
            which happens in this code after the fonts are loaded successfully (line 31).
            */
        useEffect(() => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]);

        // Return null if fonts are still loading and no error occurred
        if(!loaded && !error) {
            return null;
        }

        // Main navigation structure
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false  // Hide the default navigation header
                }}
            >
                {/* Define the navigation screens */}
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="ChooseModification" component={ChooseModificatioon} />
                <Stack.Screen name="ColorEditor" component={ColorEditor} />
                <Stack.Screen name="FlashingPatternEditor" component={FlashingPatternEditor} />
            </Stack.Navigator>
        );
    }