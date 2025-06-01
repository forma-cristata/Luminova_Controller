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
    import {ConfigurationProvider} from "@/app/context/ConfigurationContext";
    import NewColorEditor from "@/app/NewColorEditor";
    import NewFlashingPatternEditor from "@/app/NewFlashingPatternEditor";
    import {GestureHandlerRootView} from "react-native-gesture-handler";

    export type RootStackParamList = {
        Welcome: undefined;
        Settings: undefined;
        ChooseModification: { setting: Setting };
        ColorEditor: { setting: Setting, isNew?: boolean };
        FlashingPatternEditor: { setting: Setting, isNew?: boolean };
        NewColorEditor: { setting: Setting, isNew?: boolean };
        NewFlashingPatternEditor: { setting: Setting, isNew?: boolean };
    }

    const Stack = createNativeStackNavigator<RootStackParamList>();

    SplashScreen.preventAutoHideAsync();

    function Index(){
        const [loaded, error] = useFonts({
            'Thesignature': require('../assets/fonts/Thesignature.ttf'),
            'Clearlight-lJlq': require('../assets/fonts/Clearlight-lJlq.ttf'),
        });

        useEffect(() => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]);

        if(!loaded && !error) {
            return null;
        }

        return (
            <ConfigurationProvider>
                <GestureHandlerRootView>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    {/* Define the navigation screens */}
                    <Stack.Screen name="Welcome" component={Welcome} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="ChooseModification" component={ChooseModificatioon} />
                    <Stack.Screen name="ColorEditor" component={ColorEditor} />
                    <Stack.Screen name="FlashingPatternEditor" component={FlashingPatternEditor} />
                    <Stack.Screen name="NewColorEditor" component={NewColorEditor} />
                    <Stack.Screen name="NewFlashingPatternEditor" component={NewFlashingPatternEditor} />
                </Stack.Navigator>
                </GestureHandlerRootView>
            </ConfigurationProvider>

        );
    }

    export default Index;