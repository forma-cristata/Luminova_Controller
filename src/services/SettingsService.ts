import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import type { Setting } from "@/src/types/SettingInterface";
import { DEFAULT_SETTINGS } from "@/src/configurations/defaults";

const FILE_URI = `${FileSystem.documentDirectory}settings.json`;

export async function loadSettings(): Promise<Setting[]> {
	try {
		const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
		if (fileInfo.exists) {
			const fileContent = await FileSystem.readAsStringAsync(FILE_URI);
			return JSON.parse(fileContent) as Setting[];
		}
		// If no file exists, initialize with default settings
		await saveSettings(DEFAULT_SETTINGS);
		return DEFAULT_SETTINGS;
	} catch (e) {
		console.error("Error loading settings:", e);
		// Fallback to default settings in case of an error
		return DEFAULT_SETTINGS;
	}
}

export async function updateSetting(
	settingIndex: number,
	updatedSetting: Setting,
): Promise<Setting[]> {
	const settings = await loadSettings();

	if (settingIndex < 0 || settingIndex >= settings.length) {
		console.error(`Setting index ${settingIndex} is out of bounds.`);
		return settings; // Return original settings if index is invalid
	}

	const newSettings = [...settings];
	newSettings[settingIndex] = updatedSetting;
	await saveSettings(newSettings);
	return newSettings;
}

export async function saveSettings(newSettings: Setting[]): Promise<void> {
	try {
		await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(newSettings));
	} catch (e) {
		console.error("Error saving settings:", e);
		Alert.alert("Error", "Failed to save settings.");
	}
}

export async function deleteSettingsFile(): Promise<void> {
	try {
		const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
		if (fileInfo.exists) {
			await FileSystem.deleteAsync(FILE_URI);
			Alert.alert(
				"Success",
				"Settings file has been deleted. The app will now use default settings on next launch.",
			);
		} else {
			Alert.alert("Info", "No settings file found to delete.");
		}
	} catch (error) {
		console.error("Error deleting settings file:", error);
		Alert.alert("Error", "Failed to delete settings file.");
	}
}
