import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
	Alert,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	type ICarouselInstance,
} from "react-native-reanimated-carousel";
import Animated, {
	useAnimatedStyle,
	useSharedValue as useReanimatedSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

import BackButton from "@/src/components/buttons/BackButton";
import CreateButton from "@/src/components/buttons/CreateButton";
import InfoButton from "@/src/components/buttons/InfoButton";
import SettingBlock from "@/src/components/settings/SettingBlock";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "@/src/types/SettingInterface";
import { loadSettings, saveSettings } from "@/src/services/SettingsService";
import { getStableSettingId } from "@/src/utils/settingUtils";
import { DIMENSIONS } from "@/src/styles/SharedStyles";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/screens/index";

type SettingsProps = NativeStackScreenProps<RootStackParamList, "Settings">;

export default function Settings({ navigation }: SettingsProps) {
	const { lastEdited, setLastEdited } = useConfiguration();

	const [settingsData, setSettingsData] = React.useState<Setting[]>([]);
	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [isInitialRender, setIsInitialRender] = React.useState(true);
	const isDeletingRef = React.useRef(false);

	// Memoize carousel data to prevent unnecessary re-renders
	const carouselData = React.useMemo(
		() => [...(settingsData || []), "new"] as (Setting | "new")[],
		[settingsData],
	);

	// Animation for scroll indicators
	const pulseOpacity = useReanimatedSharedValue(0.8);

	// Start pulsing animation when there are multiple items
	React.useEffect(() => {
		if (carouselData.length > 1) {
			pulseOpacity.value = withRepeat(
				withTiming(0.4, { duration: 1500 }),
				-1,
				true,
			);
		} else {
			pulseOpacity.value = withTiming(0.3, { duration: 300 });
		}
	}, [carouselData.length, pulseOpacity]);

	const animatedIndicatorStyle = useAnimatedStyle(() => ({
		opacity: carouselData.length > 1 ? pulseOpacity.value : 0.3,
	}));

	const createNewSetting = () => {
		const settingsLength = settingsData?.length || 0;
		const newSetting: Setting = {
			name: `Setting ${settingsLength + 1}`,
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
			newSettingCarouselIndex: settingsLength,
		});
	};

	// Add focus listener to handle returning from ColorEditor
	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			const initializeData = async () => {
				try {
					const loadedData = await loadSettings();
					if (loadedData && loadedData.length > 0) {
						const deepCopy = JSON.parse(JSON.stringify(loadedData));
						setSettingsData(deepCopy);

						const lastEditedIndex = lastEdited ? parseInt(lastEdited) : 0;
						setCurrentIndex(lastEditedIndex);
						setIsInitialRender(true);
					} else {
						// Ensure settingsData is never undefined - set to empty array
						setSettingsData([]);
					}
				} catch (error) {
					console.error("Error initializing data:", error);
					// Ensure settingsData is never undefined - set to empty array on error
					setSettingsData([]);
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

		if ((settingsData?.length || 0) > 0 && ref.current) {
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
	}, [settingsData?.length, lastEdited]);

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

							const currentSettings = await loadSettings();

							const updatedSettings = currentSettings.filter(
								(_: Setting, i: number) => i !== currentIndex,
							);

							await saveSettings(updatedSettings);

							// Calculate target index before updating state
							let targetIndex = currentIndex - 1;
							targetIndex = Math.max(
								0,
								Math.min(targetIndex, updatedSettings.length - 1),
							);

							// Update lastEdited based on deletion position
							if (lastEdited === currentIndex.toString()) {
								setLastEdited(targetIndex.toString());
							} else if (lastEdited && parseInt(lastEdited) > currentIndex) {
								setLastEdited((parseInt(lastEdited) - 1).toString());
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

		const currentSettings = await loadSettings();
		const updatedSettings = [...currentSettings, newSetting];
		await saveSettings(updatedSettings);

		const newIndex = updatedSettings.length - 1;
		setLastEdited(newIndex.toString());

		// Reload data to reflect the new setting
		const loadedData = await loadSettings();
		setSettingsData(loadedData);

		// Navigate to the new duplicated setting
		setTimeout(() => {
			ref.current?.scrollTo({ index: newIndex, animated: true });
		}, 100);
	};
	// Memoize the focused setting block to prevent unnecessary re-renders
	const focusedSettingBlock = React.useMemo(() => {
		const settingsLength = settingsData?.length || 0;
		return currentIndex < settingsLength ? (
			settingsData?.[currentIndex] ? (
				<SettingBlock
					key={`focused-${getStableSettingId(settingsData[currentIndex])}`}
					navigation={navigation}
					layout="full"
					isAnimated={false}
					style={styles.nothing}
					setting={settingsData[currentIndex]}
					index={currentIndex}
				/>
			) : null
		) : null;
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
			{/* 10% - Button Area */}
			<View style={styles.buttonArea}>
				<InfoButton style={styles.infoButtonInContainer} />
				<BackButton
					beforePress={() => setLastEdited("0")}
					onPress={() => navigation.popToTop()}
					afterPress={() => setLastEdited("0")}
					style={styles.backButtonInContainer}
				/>
			</View>

			{/* 50% - Settings Area */}
			<View style={styles.settingsArea}>
				<View style={styles.focusedItem}>
					{currentIndex < 0 ? <View key="negative-index" /> : null}
					{currentIndex < (settingsData?.length || 0) ? (
						<React.Fragment
							key={`setting-controls-${currentIndex < (settingsData?.length || 0) ? getStableSettingId(settingsData?.[currentIndex]) : "no-setting"}`}
						>
							<TouchableOpacity
								key={`duplicate-${currentIndex < (settingsData?.length || 0) ? getStableSettingId(settingsData?.[currentIndex]) : "no-setting"}`}
								style={styles.duplicateButton}
								onPress={() => {
									handleDuplicate();
								}}
							>
								<MaterialIcons 
									name="content-copy" 
									size={Math.min(24, DIMENSIONS.SCREEN_HEIGHT * 0.02)} 
									color="white" 
								/>
							</TouchableOpacity>
							<TouchableOpacity
								key={`delete-${currentIndex < (settingsData?.length || 0) ? getStableSettingId(settingsData?.[currentIndex]) : "no-setting"}`}
								style={[styles.deleteButton, {
									opacity: currentIndex < 12 ? 0.3 : 1,
								}]}
								disabled={currentIndex < 12}
								onPress={() => {
									handleDelete();
								}}
							>
								<Ionicons
									name="trash-outline"
									size={Math.min(24, DIMENSIONS.SCREEN_HEIGHT * 0.02)}
									color={currentIndex < 12 ? "#666" : "white"}
								/>
							</TouchableOpacity>
							{focusedSettingBlock}
						</React.Fragment>
					) : null}
					{currentIndex >= (settingsData?.length || 0) ? (
						<CreateButton key="create-new-setting" onPress={createNewSetting} />
					) : null}
				</View>
			</View>

			{/* 40% - Carousel Area */}
			<View style={styles.carouselArea}>
				<Carousel
					ref={ref}
					data={carouselData}
					width={DIMENSIONS.SCREEN_WIDTH}
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

				{/* Left scroll indicator */}
				<Animated.View style={[animatedIndicatorStyle]}>
					<TouchableOpacity
						style={[styles.scrollIndicator, styles.scrollIndicatorLeft]}
						onPress={() => {
							if (ref.current && carouselData.length > 1) {
								ref.current.prev({ animated: true });
							}
						}}
						activeOpacity={0.5}
						disabled={carouselData.length <= 1}
					>
						<Ionicons 
							name="chevron-back" 
							size={Math.min(32, DIMENSIONS.SCREEN_HEIGHT * 0.025)} 
							color="white" 
						/>
					</TouchableOpacity>
				</Animated.View>

				{/* Right scroll indicator */}
				<Animated.View style={[animatedIndicatorStyle]}>
					<TouchableOpacity
						style={[styles.scrollIndicator, styles.scrollIndicatorRight]}
						onPress={() => {
							if (ref.current && carouselData.length > 1) {
								ref.current.next({ animated: true });
							}
						}}
						activeOpacity={0.5}
						disabled={carouselData.length <= 1}
					>
						<Ionicons 
							name="chevron-forward" 
							size={Math.min(32, DIMENSIONS.SCREEN_HEIGHT * 0.025)} 
							color="white" 
						/>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},

	// 10% - Button area
	buttonArea: {
		height: DIMENSIONS.SCREEN_HEIGHT * 0.10,
		width: DIMENSIONS.SCREEN_WIDTH,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: DIMENSIONS.SCREEN_WIDTH * 0.05,
	},

	infoButtonInContainer: {
		position: "relative",
		right: 0,
		top: 0,
	},

	backButtonInContainer: {
		position: "relative",
		left: 0,
		top: 0,
	},

	// 50% - Settings area
	settingsArea: {
		height: DIMENSIONS.SCREEN_HEIGHT * 0.50,
		width: DIMENSIONS.SCREEN_WIDTH,
		justifyContent: "center",
		alignItems: "center",
	},

	// 40% - Carousel area
	carouselArea: {
		flex: 1,
		width: DIMENSIONS.SCREEN_WIDTH,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},

	focusedItem: {
		height: "100%",
		width: DIMENSIONS.SCREEN_WIDTH,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "white",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},

	duplicateButton: {
		position: "absolute",
		top: Math.max(10, DIMENSIONS.SCREEN_HEIGHT * 0.015),
		left: Math.max(10, DIMENSIONS.SCREEN_WIDTH * 0.03),
		zIndex: 1,
	},

	deleteButton: {
		position: "absolute",
		top: Math.max(10, DIMENSIONS.SCREEN_HEIGHT * 0.015),
		right: Math.max(10, DIMENSIONS.SCREEN_WIDTH * 0.03),
		zIndex: 1,
	},

	renderItem: {
		borderStyle: "solid",
		borderWidth: 2,
		width: DIMENSIONS.SCREEN_WIDTH,
		height: DIMENSIONS.SCREEN_HEIGHT * 0.25,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
	},

	carousel: {
		flex: 1,
		width: DIMENSIONS.SCREEN_WIDTH * 0.9,
		justifyContent: "center",
		alignItems: "flex-end",
	},

	scrollIndicator: {
		position: "absolute",
		zIndex: 2,
		width: Math.max(40, DIMENSIONS.SCREEN_WIDTH * 0.08),
		height: Math.max(40, DIMENSIONS.SCREEN_WIDTH * 0.08),
		justifyContent: "center",
		alignItems: "center",
		transform: [{ translateY: -DIMENSIONS.SCREEN_HEIGHT * 0.05 }],
	},

	scrollIndicatorLeft: {
		left: Math.max(10, DIMENSIONS.SCREEN_WIDTH * 0.03),
	},

	scrollIndicatorRight: {
		right: Math.max(10, DIMENSIONS.SCREEN_WIDTH * 0.03),
	},

	// Legacy styles (keeping for compatibility)
	text: {
		fontFamily: "Thesignature",
		fontSize: Math.min(130, DIMENSIONS.SCREEN_HEIGHT * 0.08),
		color: "#ffffff",
	},

	notBackButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: Math.max(100, DIMENSIONS.SCREEN_HEIGHT * 0.08),
	},

	carCont: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	title: {
		height: DIMENSIONS.SCREEN_HEIGHT * 0.2,
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
		top: Math.max(10, DIMENSIONS.SCREEN_HEIGHT * 0.015),
		right: Math.max(10, DIMENSIONS.SCREEN_WIDTH * 0.03),
		zIndex: 1,
	},

	dotsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	dot: {
		width: Math.max(8, DIMENSIONS.SCALE * 8),
		height: Math.max(8, DIMENSIONS.SCALE * 8),
		borderRadius: Math.max(4, DIMENSIONS.SCALE * 4),
		backgroundColor: "#ffffff",
		opacity: 0.3,
		marginHorizontal: Math.max(4, DIMENSIONS.SCALE * 4),
	},

	activeDot: {
		opacity: 1,
		transform: [{ scale: 1.2 }],
	},
});
