import type { Setting } from "@/src/interface/SettingInterface";

/**
 * Generate a stable ID for a setting based on its content.
 * This ensures consistent keys for React components while avoiding index-based keys.
 * 
 * @param setting - The setting object to generate an ID for
 * @returns A stable string ID for the setting
 */
export const getStableSettingId = (setting: Setting): string => {
	if (setting.id) {
		return setting.id;
	}
	
	// Create deterministic ID based on setting content using a simple hash approach
	const content = `${setting.name}-${setting.colors.join(',')}-${setting.delayTime}-${setting.flashingPattern}`;
	
	// Simple string hash for consistent ID generation
	let hash = 0;
	for (let i = 0; i < content.length; i++) {
		const char = content.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	
	return `setting-${Math.abs(hash)}`;
};

/**
 * Generate a unique ID for new settings.
 * Uses timestamp and random number for uniqueness.
 * 
 * @returns A unique string ID
 */
export const generateUniqueSettingId = (): string => {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 10000);
	return `setting-${timestamp}-${random}`;
};
