import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
	Alert,
	Dimensions,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,

	View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	type ICarouselInstance,
} from "react-native-reanimated-carousel";

import BackButton from "@/src/components/ui/buttons/BackButton";
import CreateButton from "@/src/components/ui/CreateButton";
import InfoButton from "@/src/components/ui/buttons/InfoButton";
import SettingBlock from "@/src/components/settings/SettingBlock";
import { FONTS } from "@/src/styles/SharedStyles";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/types/SettingInterface";
import { SettingsService } from "@/src/services/SettingsService";
import { getStableSettingId } from "@/src/utils/settingUtils";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Settings({ navigation }: any) {
	const { lastEdited, setLastEdited } = useConfiguration();

	const [settingsData, setSettingsData] = React.useState<Setting[]>([]);
	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [isInitialRender, setIsInitialRender] = React.useState(true);
	const isDeletingRef = React.useRef(false);

	// Memoize carousel data to prevent unnecessary re-renders
	const carouselData = React.useMemo(
		() => [...settingsData, "new"] as (Setting | "new")[],
		[settingsData],
	);

	const createNewSetting = () => {
		const newSetting: Setting = {
			name: `Setting ${settingsData.length + 1}`,
			colors: Array(16).fill("#FFFFFF"),
			whiteValues: Array(16).fill(0),
			brightnessValues: Array(16).fill(255),
			flashingPattern: "6",
			delayTime: 100,
		};

		navigation.navigate("ColorEditor", {
			setting: newSetting,
			isNew: true,
			originalName: newSetting.name,
			newSettingCarouselIndex: settingsData.length,
		});
	};

	// Add focus listener to handle returning from ColorEditor
	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			const initializeData = async () => {
				try {
					const loadedData = await SettingsService.loadSettings();
					if (loadedData && loadedData.length > 0) {
						const deepCopy = JSON.parse(JSON.stringify(loadedData));
						setSettingsData(deepCopy);

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
		// Don't interfere if we're in the middle of a deletion
		if (isDeletingRef.current) return;

		if (settingsData.length > 0 && ref.current) {
			// Set carousel ready after a short delay to ensure component is mounted
			setTimeout(() => {
				const targetIndex = lastEdited ? parseInt(lastEdited) : 0;
				setTimeout(() => {
					if (ref.current && !isDeletingRef.current) {
						ref.current.scrollTo({ index: targetIndex, animated: false });
					}
					setTimeout(() => {
						setIsInitialRender(false);
					}, 150);
				}, 100);
			}, 50);
		}
	}, [settingsData.length, lastEdited]);

	const handleProgressChange = React.useCallback(
		(offset: number, absoluteProgress: number) => {
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

			// Only update if index actually changed to prevent unnecessary re-renders
			if (newIndex !== currentIndex) {
				// Use requestAnimationFrame to ensure smooth updates
				requestAnimationFrame(() => {
					setCurrentIndex(newIndex);
				});
			}
		},
		[isInitialRender, currentIndex, progress],
	);

	const handleDelete = async () => {
		if (currentIndex < 12) {
			return; // Simply do nothing for default settings
		}
		Alert.alert(
			"Delete Setting",
			"Are you sure you want to delete this setting?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							// Set deletion flag to prevent other effects from interfering
							isDeletingRef.current = true;

							const currentSettings = await SettingsService.loadSettings();

							const updatedSettings = currentSettings.filter(
								(_, i) => i !== currentIndex,
							);

							await SettingsService.saveSettings(updatedSettings);

							// Calculate target index before updating state
							let targetIndex = currentIndex - 1;
							targetIndex = Math.max(
								0,
								Math.min(targetIndex, updatedSettings.length - 1),
							);

							// Update lastEdited based on deletion position
							if (lastEdited === currentIndex.toString()) {
								setLastEdited(targetIndex.toString());
							} else if (parseInt(lastEdited!) > currentIndex) {
								setLastEdited((parseInt(lastEdited!) - 1).toString());
							}

							// Single, coordinated state update
							const deepCopy = JSON.parse(JSON.stringify(updatedSettings));
							setSettingsData(deepCopy);
							setCurrentIndex(targetIndex);

							// Single carousel scroll after state is updated
							setTimeout(() => {
								if (ref.current) {
									ref.current.scrollTo({
										index: targetIndex,
										animated: false,
									});
								}
								// Clear deletion flag after operation is complete
								setTimeout(() => {
									isDeletingRef.current = false;
								}, 100);
							}, 50);
						} catch (error) {
							console.error("Error deleting setting:", error);
							isDeletingRef.current = false;
						}
					},
				},
			],
		);
	};

	const handleDuplicate = async () => {
		const currentSetting = settingsData[currentIndex];
		const newName = `${currentSetting.name} (copy)`;

		const newSetting: Setting = {
			...currentSetting,
			name: newName,
		};

		const currentSettings = await SettingsService.loadSettings();
		const updatedSettings = [...currentSettings, newSetting];
		await SettingsService.saveSettings(updatedSettings);

		const newIndex = updatedSettings.length - 1;
		setLastEdited(newIndex.toString());

		// Reload data to reflect the new setting
		const loadedData = await SettingsService.loadSettings();
		setSettingsData(loadedData);

		// Navigate to the new duplicated setting
		setTimeout(() => {
			ref.current?.scrollTo({ index: newIndex, animated: true });
		}, 100);
	};
	// Memoize the focused setting block to prevent unnecessary re-renders
	const focusedSettingBlock = React.useMemo(() => {
		return currentIndex < settingsData.length
			? settingsData[currentIndex]
				? (
					<SettingBlock
						key={`focused-${getStableSettingId(settingsData[currentIndex])}`}
						navigation={navigation}
						layout="full"
						isAnimated={false}
						style={styles.nothing}
						setting={settingsData[currentIndex]}
						index={currentIndex}
					/>
				)
				: null
			: null;
	}, [navigation, settingsData, currentIndex]);
	// Memoize the render item function to prevent recreation on every render
	const renderItem = React.useCallback(
		({ item, index }: { item: Setting | "new"; index: number }) => {
			if (item === "new") {
				return <View style={styles.newSettingItem} key="new-item-unique" />;
			}

			// Generate stable ID for the setting using utility function
			const settingId = getStableSettingId(item);

			// The main item is animated, others are not.
			const isAnimated = index === currentIndex;

			return (
				<SettingBlock
					key={settingId}
					navigation={navigation}
					layout="compact"
					isAnimated={isAnimated}
					style={styles.renderItem}
					setting={item}
					index={index}
				/>
			);
		},
		[navigation, currentIndex],
	);
	return (
		<SafeAreaView style={styles.container}>
			<InfoButton />
			<BackButton
				beforePress={() => setLastEdited("0")}
				onPress={() => navigation.popToTop()}
				afterPress={() => setLastEdited("0")}
			/>
			<View style={styles.notBackButton}>
				<View style={[styles.focusedItem, { position: "relative" }]}>
					{currentIndex < 0 ? <View key="negative-index" /> : null}
					{currentIndex < settingsData.length ? (
						<React.Fragment key={`setting-controls-${currentIndex < settingsData.length ? getStableSettingId(settingsData[currentIndex]) : 'no-setting'}`}>
							<TouchableOpacity
								key={`duplicate-${currentIndex < settingsData.length ? getStableSettingId(settingsData[currentIndex]) : 'no-setting'}`}
								style={{
									position: "absolute",
									top: 10,
									left: 10,
									zIndex: 1,
								}}
								onPress={() => {
									handleDuplicate();
								}}
							>
								<MaterialIcons name="content-copy" size={24} color="white" />
							</TouchableOpacity>
							<TouchableOpacity
								key={`delete-${currentIndex < settingsData.length ? getStableSettingId(settingsData[currentIndex]) : 'no-setting'}`}
								style={{
									position: "absolute",
									top: 10,
									right: 10,
									zIndex: 1,
									opacity: currentIndex < 12 ? 0.3 : 1,
								}}
								disabled={currentIndex < 12}
								onPress={() => {
									handleDelete();
								}}
							>
								<Ionicons
									name="trash-outline"
									size={24}
									color={currentIndex < 12 ? "#666" : "white"}
								/>
							</TouchableOpacity>
							{focusedSettingBlock}
						</React.Fragment>
					) : null}
					{currentIndex >= settingsData.length ? (
						<CreateButton
							key="create-new-setting"
							onPress={createNewSetting}
						/>
					) : null}
				</View>
				<View style={styles.carCont}>
					<Carousel
						ref={ref}
						data={carouselData}
						width={width}
						defaultIndex={0}
						enabled={true}
						loop={true}
						autoPlay={false}
						windowSize={1}
						pagingEnabled={true}
						snapEnabled={true}
						onProgressChange={handleProgressChange}
						renderItem={renderItem}
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
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000000",
	},
	text: {
		fontFamily: "Thesignature",
		fontSize: 130,
		color: "#ffffff",
	},
	notBackButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 100,
	},
	renderItem: {
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "white",
		borderRadius: 7,
		width: width,
		height: (height * 9) / 50,
		justifyContent: "center",
		alignItems: "center",
	},
	carCont: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	carousel: {
		flex: 1,
		width: width * 0.9,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	focusedItem: {
		height: height / 2.5,
		width: width * 0.9,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "white",
		borderRadius: 7,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		height: (height * 2) / 10,
		justifyContent: "center",
		alignItems: "center",
	},
	nothing: {
		justifyContent: "center",
		alignItems: "center",
	},
	newSettingItem: {
		borderColor: "black",
		justifyContent: "center",
		alignItems: "center",
	},
	sideButton: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 1,
	},
});
