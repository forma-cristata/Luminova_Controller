import {Dimensions, SafeAreaView, Text, StyleSheet, TouchableOpacity, View, Alert} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
} from "react-native-reanimated-carousel";
import React from "react";
import {Setting} from "@/app/interface/setting-interface";
import SettingBlock from "@/app/components/settingBlock";
import * as FileSystem from 'expo-file-system';
import jsonData from './configurations/modes.json';
import {useConfiguration} from "@/app/context/ConfigurationContext";
import {Ionicons} from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import InfoButton from "@/app/components/InfoButton";
import BackButton from "@/app/components/BackButton";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
        } else {
            Alert.alert("Info", "No settings file found to delete.");
        }
    } catch (error) {
        console.error("Error deleting settings file:", error);
        Alert.alert("Error", "Failed to delete settings file.");
    }
};

export const loadData = async () => {
    // Uncomment line and load this page to restore defaults. Then uncomment this line and save again
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
    const {lastEdited, setLastEdited} = useConfiguration();

    const [settingsData, setSettingsData] = React.useState<Setting[]>([]);
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isInitialRender, setIsInitialRender] = React.useState(true);

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
           isNew: true,
           originalName: newSetting.name
       });
   };

    // Add focus listener to handle returning from ColorEditor
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const initializeData = async () => {
                try {
                    const loadedData = await loadData();
                    if (loadedData && loadedData.length > 0) {
                        const deepCopy = JSON.parse(JSON.stringify(loadedData));
                        setSettingsData(deepCopy);
                        data = loadedData;

                        const lastEditedIndex = lastEdited ? parseInt(lastEdited) : 0;
                        setCurrentIndex(lastEditedIndex);
                        setIsInitialRender(true);
                    }
                } catch (error) {
                    console.error("Error initializing data:", error);
                }
            };

            initializeData();
        });

        return unsubscribe;
    }, [navigation, lastEdited]);

    // Handle carousel positioning when ready
    React.useEffect(() => {
        if (settingsData.length > 0 && ref.current) {
            // Set carousel ready after a short delay to ensure component is mounted
            setTimeout(() => {
                const targetIndex = lastEdited ? parseInt(lastEdited) : 0;
                setTimeout(() => {
                    if (ref.current) {
                        ref.current.scrollTo({index: targetIndex, animated: false});
                    }
                    setTimeout(() => {
                        setIsInitialRender(false);
                    }, 150);
                }, 100);
            }, 50);
        }
    }, [settingsData.length, lastEdited]);

    const handleProgressChange = (offset: number, absoluteProgress: number) => {
        // Only block during the initial positioning, not after navigation returns
        if (isInitialRender && Math.abs(offset) < 0.1) {
            return;
        }
        
        // Reset initial render flag once user starts scrolling
        if (isInitialRender) {
            setIsInitialRender(false);
        }

        progress.value = offset;
        const newIndex = Math.round(absoluteProgress);
        setCurrentIndex(newIndex);
    };

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

                           // Fix: Remove the problematic navigation.reset that corrupts the stack
                           // Simply reload the current screen's data instead
                           const initializeData = async () => {
                               try {
                                   const loadedData = await loadData();
                                   if (loadedData && loadedData.length > 0) {
                                       const deepCopy = JSON.parse(JSON.stringify(loadedData));
                                       setSettingsData(deepCopy);
                                       
                                       const targetIndex = 0; // Go to first setting after delete
                                       setCurrentIndex(targetIndex);
                                       setLastEdited('0');
                                       setIsInitialRender(true);
                                   }
                               } catch (error) {
                                   console.error("Error reloading data:", error);
                               }
                           };
                           
                           await initializeData();

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
        if (currentIndex < settingsData.length && currentIndex >= 0) {
            const original = settingsData[currentIndex];
            const duplicated = {
                ...original,
                name: getUniqueName(original.name, settingsData)
            };
            navigation.navigate("ColorEditor", {
                setting: duplicated,
                isNew: true,
                originalName: duplicated.name
            });
        }
    };

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>            
        <InfoButton />              
        <BackButton 
                beforePress={() => setLastEdited('0')}
                onPress={() => navigation.navigate('Welcome', {animation: 'slideFromLeft'})}
                afterPress={() => setLastEdited('0')}
            />
            <View style={styles.notBackButton}>
                <View style={styles.title}>
                    <Text style={styles.text}>Settings</Text>
                </View>
                <View style={[styles.focusedItem, {position: "relative"}]}>
                    {currentIndex < 0 && (<View></View>)}
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
                                key={currentIndex.toString()}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    zIndex: 1,
                                    opacity: (currentIndex < 12 ? 0.3 : 1)
                                }}
                                onPress={() => {
                                if(currentIndex >= 12) handleDelete().then(() => {});
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
                <View style={styles.carCont}>
                    <Carousel
                        ref={ref}
                        data={[...settingsData, 'new']}
                        width={width}
                        defaultIndex={Math.abs(currentIndex % (settingsData.length+1))}
                        enabled={true}
                        onProgressChange={(offset, absoluteProgress) => {
                            handleProgressChange(offset, absoluteProgress);
                        }}
                        renderItem={({item, index}: { item: Setting | 'new', index: number }) => (
                            item === 'new' ? (
                                <Text style={styles.newSettingItemText} key={item + index.toString()}/>
                            ) : (
                                <SettingBlock
                                    key={item + index.toString()}
                                    navigation={navigation}
                                    animated={false}
                                    style={styles.renderItem}
                                    setting={item}
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
        </SafeAreaProvider>
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
    carCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    carousel: {
        flex: 1,
        height: height * 2 / 10,
        width: width * 0.9,
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