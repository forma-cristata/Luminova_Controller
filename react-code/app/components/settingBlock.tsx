import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedDots from "@/app/components/AnimatedDots";
import ColorDots from "@/app/components/ColorDots";
import { COLORS, COMMON_STYLES, FONTS } from "@/app/components/SharedStyles";
import { useConfiguration } from "@/app/context/ConfigurationContext";
import type Setting from "@/app/interface/setting-interface";
import { ApiService } from "@/app/services/ApiService";

interface SettingItemProps {
	navigation: any;
	setting: Setting;
	style: any;
	animated: boolean;
	index?: number;
}

const SettingBlock = ({
	navigation,
	setting,
	style,
	animated,
	index,
}: SettingItemProps) => {
	const { currentConfiguration, setCurrentConfiguration, setLastEdited } =
		useConfiguration();

	if (!setting) {
		return null;
	}

	const dotsRendered = () => {
		if (animated) {
			return <AnimatedDots navigation={navigation} setting={setting} />;
		} else {
			return <ColorDots colors={setting.colors} />;
		}
	};

	const handleFlash = async () => {
		try {
			await ApiService.flashSetting(setting);
			setCurrentConfiguration(setting);
			console.log(`Current Configuration: ${setting.name}`);
		} catch (error) {
			console.error("Flash error:", error);
		}
	};

	return (
		<>
			{animated && (
				<View style={[style]}>
					<View style={styles.headerContainer}>
						<Text style={styles.whiteText}>{setting.name.toLowerCase()}</Text>
					</View>

					{dotsRendered()}
					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={COMMON_STYLES.wideButton}
							onPress={() => {
								setLastEdited(index?.toString());
								navigation.navigate("ChooseModification", { setting: setting });
							}}
						>
							<Text style={styles.buttons}>Edit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={COMMON_STYLES.wideButton}
							onPress={handleFlash}
						>
							<Text style={styles.buttons}>Flash</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{!animated && (
				<View style={style}>
					<Text style={styles.whiteTextSmaller}>
						{setting.name.toLowerCase()}
					</Text>
					{dotsRendered()}
				</View>
			)}
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

export default SettingBlock;
