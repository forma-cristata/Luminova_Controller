import AsyncStorage from "@react-native-async-storage/async-storage";

const FIRST_TIME_USER_KEY = "luminova-first-time-user";

export async function isFirstTimeUser(): Promise<boolean> {
    try {
        const hasSeenTutorial = await AsyncStorage.getItem(FIRST_TIME_USER_KEY);
        return hasSeenTutorial === null;
    } catch (error) {
        console.error("Failed to check first time user status", error);
        return true; // Default to showing tutorial if error
    }
}

export async function markTutorialCompleted(): Promise<void> {
    try {
        await AsyncStorage.setItem(FIRST_TIME_USER_KEY, "completed");
    } catch (error) {
        console.error("Failed to mark tutorial as completed", error);
    }
}

export async function resetFirstTimeUser(): Promise<void> {
    try {
        await AsyncStorage.removeItem(FIRST_TIME_USER_KEY);
    } catch (error) {
        console.error("Failed to reset first time user status", error);
    }
}

// For backward compatibility, export as a class as well
export const FirstTimeUserService = {
    isFirstTimeUser,
    markTutorialCompleted,
    resetFirstTimeUser,
};
