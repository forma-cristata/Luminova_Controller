import {Dimensions, SafeAreaView, Text, StyleSheet, TouchableOpacity, View} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
} from "react-native-reanimated-carousel";
import React from "react";
import Setting from "@/app/interface/setting-interface";
import SettingBlock from "@/app/components/settingBlock";
import * as FileSystem from 'expo-file-system';
import jsonData from './configurations/modes.json';
import {useConfiguration} from "@/app/context/ConfigurationContext";
import {useFocusEffect} from '@react-navigation/native';

let data = jsonData.settings as Setting[];
console.log("JSON Default Data: ", jsonData);


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const FILE_URI = FileSystem.documentDirectory + 'settings.json';

export const loadData = async () => {

    try {
        const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
        if (fileInfo.exists) {
            const fileContent = await FileSystem.readAsStringAsync(FILE_URI);
            console.log("Loaded data from file:", fileContent);
            return JSON.parse(fileContent) as Setting[];
        } else {
            console.log("No existing file found, using default data.");
            console.log("jsonData: " + JSON.stringify(jsonData));
            return data;
        }
    } catch (e) {
        console.error("Error loading data:", e);
        return [];
    }
};

export const saveData = async (newSettings: Setting[]) => {
    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(newSettings));
};

export default function Settings({navigation}: any) {
    const {currentConfiguration, setCurrentConfiguration, lastEdited, setLastEdited} = useConfiguration();


    const [settingsData, setSettingsData] = React.useState<Setting[]>([]);
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const updateSettings = async (updatedSettings: Setting[]) => {
        setSettingsData(updatedSettings);
        await saveData(updatedSettings);
    };

    const createNewSetting = () => {
        const newSetting: Setting = {
            name: `Setting ${settingsData.length + 1}`,
            colors: Array(16).fill('#FFFFFF'),
            whiteValues: Array(16).fill(0),
            brightnessValues: Array(16).fill(255),
            flashingPattern: "6",
            delayTime: 100
        };

        navigation.navigate("ColorEditor", {
            setting: newSetting,
            isNew: true
        });
    };


    React.useEffect(() => {
        const initializeData = async () => {
            try {
                const loadedData = await loadData();
                if (loadedData && loadedData.length > 0) {
                    setSettingsData(loadedData);
                    data = loadedData;
                }
            } catch (error) {
                console.error("Error initializing data:", error);
            }

            setCurrentIndex(lastEdited ? parseInt(lastEdited) : 0);
            if (!lastEdited) setLastEdited("0");
        };

        initializeData();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            {/*Back Button*/}
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome', {animation: 'slideFromLeft'})}>
                    <Text style={styles.backB}> ⪡ </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.notBackButton}>
                {/*Title*/}
                <View style={styles.title}>
                    <Text style={styles.text}>Settings</Text>
                </View>

                {/*See: https://reactnative.dev/docs/intro-react*/}
                {/*Carousel Focus Item*/}

                <View style={styles.focusedItem}>
                    {currentIndex < settingsData.length ? (
                        <SettingBlock
                            navigation={navigation}
                            animated={true}
                            style={styles.nothing}
                            setting={settingsData[currentIndex]}
                            index={currentIndex}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.newSettingButton}
                            onPress={createNewSetting}
                        >
                            <Text style={styles.newSettingText}>+</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/*Carousel*/}
                <View style={styles.carCont}>
                    // In settings.tsx, modify the Carousel data and renderItem
                    <Carousel
                        ref={ref}
                        data={[...settingsData, 'new']}  // Simply append 'new' to the end of actual settings
                        width={width}
                        defaultIndex={lastEdited !== null && parseInt(lastEdited) < settingsData.length ? parseInt(lastEdited) : 0}
                        enabled={true}
                        onProgressChange={(offset, absoluteProgress) => {
                            progress.value = offset;
                            setCurrentIndex(Math.round(absoluteProgress));
                        }}
                        renderItem={({item, index}: { item: Setting | string, index: number }) => (
                            item === 'new' ? (
                                <TouchableOpacity
                                    style={[styles.renderItem, styles.newSettingItem]}
                                    onPress={createNewSetting}
                                >
                                    <Text style={styles.newSettingItemText}>+</Text>
                                </TouchableOpacity>
                            ) : (
                                <SettingBlock
                                    navigation={navigation}
                                    animated={false}
                                    style={styles.renderItem}
                                    setting={item as Setting}
                                    index={index}
                                />
                            )
                        )}
                        mode="parallax"
                        style={styles.carousel}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    text: {
        fontFamily: "Thesignature",
        fontSize: 130,
        color: "#ffffff",
    },
    backButton: {
        height: height / 10,
        width: "100%",
    },
    notBackButton: {
        height: "90%",
    },
    renderItem: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 7,
        width: width,
        height: height * 9 / 50,
        justifyContent: "center",
        alignItems: "center"
    },
    whiteText: {
        color: "white",
    },
    carCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    carousel: {
        flex: 1,
        height: height * 2 / 10,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    focusedItem: {
        height: height / 2.5,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        height: height * 2 / 10,
        justifyContent: "center",
        alignItems: "center"
    },
    backB: {
        color: '#ffffff',
        textAlign: 'left',
        fontSize: 30
    },
    nothing: {
        justifyContent: "center",
        alignItems: "center"
    },

    newSettingButton: {
        width: '80%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newSettingText: {
        color: 'white',
        fontSize: 100,
        fontFamily: 'Clearlight-lJlq',
    },
    newSettingItem: {
        borderColor: "black",
        justifyContent: 'center',
        alignItems: 'center',
    },
    newSettingItemText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Clearlight-lJlq',
    }
});