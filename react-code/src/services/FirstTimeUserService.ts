import AsyncStorage from "@react-native-async-storage/async-storage";

const FIRST_TIME_USER_KEY = "luminova-first-time-user";

export class FirstTimeUserService {
    static async isFirstTimeUser(): Promise<boolean> {
        try {
            const hasSeenTutorial = await AsyncStorage.getItem(FIRST_TIME_USER_KEY);
            return hasSeenTutorial === null;
        } catch (error) {
            console.error("Failed to check first time user status", error);
            return true; // Default to showing tutorial if error
        }
    }

    static async markTutorialCompleted(): Promise<void> {
        try {
            await AsyncStorage.setItem(FIRST_TIME_USER_KEY, "completed");
        } catch (error) {
            console.error("Failed to mark tutorial as completed", error);
        }
    }

    static async resetFirstTimeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(FIRST_TIME_USER_KEY);
        } catch (error) {
            console.error("Failed to reset first time user status", error);
        }
    }
}
