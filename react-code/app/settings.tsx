import {Dimensions, SafeAreaView, Text, StyleSheet, TouchableOpacity, View, Alert} from "react-native";
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
import {Ionicons} from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

let data = jsonData.settings as Setting[];
console.log("JSON Default Data: ", jsonData);


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const FILE_URI = FileSystem.documentDirectory + 'settings.json';

const deleteSettingsFile = async () => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
        if (fileInfo.exists) {
            await FileSystem.deleteAsync(FILE_URI);
            console.log("Settings file deleted successfully");
            Alert.alert("Success", "Settings file has been deleted. The app will now use default settings.");
            // Reset state to default settings
        } else {
            Alert.alert("Info", "No settings file found to delete.");
        }
    } catch (error) {
        console.error("Error deleting settings file:", error);
        Alert.alert("Error", "Failed to delete settings file.");
    }
};

export const loadData = async () => {
    //await deleteSettingsFile();
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

       navigation.navigate("NewColorEditor", {
           setting: newSetting,
           isNew: true,
           originalName: newSetting.name
       });
   };


    React.useEffect(() => {
        const initializeData = async () => {
            try {
                const loadedData = await loadData();
                if (loadedData && loadedData.length > 0) {
                    const deepCopy = JSON.parse(JSON.stringify(loadedData));
                    setSettingsData(deepCopy);
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

   const handleDelete = async () => {
       Alert.alert(
           "Delete Setting",
           "Are you sure you want to delete this setting?",
           [
               {
                   text: "Cancel",
                   style: "cancel"
               },
               {
                   text: "Delete",
                   style: "destructive",
                   onPress: async () => {
                       try {
                           const currentSettings = await loadData();

                           const updatedSettings = currentSettings.filter((_, i) => i !== currentIndex);

                           await saveData(updatedSettings);

                           if (lastEdited === currentIndex.toString()) {
                               setLastEdited("0");
                           } else if (parseInt(lastEdited!) > currentIndex) {
                               setLastEdited((parseInt(lastEdited!) - 1).toString());
                           }

                           navigation.reset({
                               index: 0,
                               routes: [{name: 'Settings'}],
                           });
                       } catch (error) {
                           console.error("Error deleting setting:", error);
                       }
                   }
               }
           ]
       );
   };

    const getUniqueName = (baseName: string, settings: Setting[]) => {
        let newName = baseName + " Copy";
        let counter = 1;
        const names = settings.map(s => s.name);
        while (names.includes(newName)) {
            newName = `${baseName} Copy ${counter++}`;
        }
        return newName;
    };

    const handleDuplicate = () => {
        if (currentIndex < settingsData.length) {
            const original = settingsData[currentIndex];
            const duplicated = {
                ...original,
                name: getUniqueName(original.name, settingsData)
            };
            navigation.navigate("NewColorEditor", {
                setting: duplicated,
                isNew: true,
                originalName: duplicated.name
            });
        }
    };




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

                <View style={[styles.focusedItem, {position: "relative"}]}>
                    {currentIndex < settingsData.length && (
                        <>
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    left: 10,
                                    zIndex: 1,
                                }}
                                onPress={() => {handleDuplicate();}}
                            >
                                <MaterialIcons name="content-copy" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={currentIndex}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    zIndex: 1,
                                    opacity: (currentIndex < 12 ? 0.3 : 1)
                                }}
                                onPress={() => {
                                if(currentIndex >= 12) handleDelete;
                            }}
                            >
                                <Ionicons name="trash-outline" size={24} color="white"/>
                            </TouchableOpacity>
                            <SettingBlock
                                navigation={navigation}
                                animated={true}
                                style={styles.nothing}
                                setting={settingsData[currentIndex]}
                                index={currentIndex}

                            />
                        </>
                    )}

                    {currentIndex >= settingsData.length &&
                       ( <>
                            <TouchableOpacity
                                style={styles.newSettingButton}
                                onPress={createNewSetting}
                            >
                                <Text style={styles.newSettingText}>+</Text>
                            </TouchableOpacity>
                        </>)
                    }

                </View>

                {/*Carousel*/}
                <View style={styles.carCont}>
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
                                    onPress={() => {}}
                                >
                                    <Text style={styles.newSettingItemText}></Text>
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