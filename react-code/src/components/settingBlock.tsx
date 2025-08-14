import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedDots from "@/src/components/AnimatedDots";
import ColorDots from "@/src/components/ColorDots";
import FlashButton from "@/src/components/FlashButton";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import type { Setting } from "../interface/SettingInterface";
import { COLORS, COMMON_STYLES, FONTS } from "./SharedStyles";

interface SettingItemProps {
	navigation: any;
	setting: Setting;
	style: any;
	animated: boolean;
	index?: number;
}

// Custom comparison function to prevent unnecessary re-renders
const areEqual = (prevProps: SettingItemProps, nextProps: SettingItemProps) => {
	return (
		prevProps.setting?.name === nextProps.setting?.name &&
		prevProps.animated === nextProps.animated &&
		prevProps.index === nextProps.index &&
		JSON.stringify(prevProps.setting?.colors) === JSON.stringify(nextProps.setting?.colors)
	);
};

const SettingBlock = ({
	navigation,
	setting,
	style,
	animated,
	index,
}: SettingItemProps) => {
	const { setLastEdited } = useConfiguration();

	if (!setting) {
		return null;
	}
	// Memoize the dots rendering to prevent unnecessary re-renders
	const dotsRendered = React.useMemo(() => {
		return animated ? <AnimatedDots navigation={navigation} setting={setting} /> : <ColorDots colors={setting.colors} />;
	}, [animated, navigation, setting]);

	return (		<>
			{animated ? (
				<View style={[style]}>
					<View style={styles.headerContainer}>
						<Text 
							style={styles.whiteText}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{setting.name.toLowerCase()}
						</Text>
					</View>

					{dotsRendered}
					<View style={styles.buttonsContainer}>						
						<TouchableOpacity
							style={COMMON_STYLES.wideButton}
							onPress={() => {
								setLastEdited(index?.toString() ?? null);
								navigation.navigate("ChooseModification", { 
									setting: setting, 
									settingIndex: index 
								});
							}}
						>
							<Text style={styles.buttons}>Edit</Text>
						</TouchableOpacity>						
						<FlashButton
							setting={setting}
							style={COMMON_STYLES.wideButton}
						/>					</View>
				</View>
			) : null}

			{!animated ? (
				<View style={style}>
					<Text 
						style={styles.whiteTextSmaller}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{setting.name.toLowerCase()}
					</Text>					{dotsRendered}
				</View>
			) : null}
		</>
	);
};


const styles = StyleSheet.create({
	whiteText: {
		color: COLORS.WHITE,
		fontSize: 50,
		fontFamily: FONTS.SIGNATURE,
		textAlign: "center",
		flexWrap: "nowrap",
	},
	whiteTextSmaller: {
		color: COLORS.WHITE,
		fontSize: 60,
		fontFamily: FONTS.SIGNATURE,
		paddingHorizontal: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 40,
		width: "100%",
		paddingHorizontal: 20,
	},
	buttons: {
		color: COLORS.WHITE,
		fontSize: 40,
		fontFamily: FONTS.CLEAR,
	},
	headerContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
		position: "relative",
	},
	deleteButton: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 1,
	},
});

export default React.memo(SettingBlock, areEqual);
