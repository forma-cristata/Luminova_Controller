import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiService } from "./ApiService";
import { IP } from "../configurations/constants";

const IP_ADDRESS_KEY = "luminova-ip-address";

export class IpConfigService {
    static async initializeIp(): Promise<void> {
        try {
            const ip = await AsyncStorage.getItem(IP_ADDRESS_KEY);
            const effectiveIp = ip || IP;
            ApiService.setBaseUrl(effectiveIp);
        } catch (error) {
            console.error("Failed to initialize IP address, using default.", error);
            ApiService.setBaseUrl(IP); // Fallback to default
        }
    }

    static async saveIpAddress(ip: string): Promise<void> {
        try {
            await AsyncStorage.setItem(IP_ADDRESS_KEY, ip);
            ApiService.setBaseUrl(ip);
        } catch (error) {
            console.error("Failed to save IP address", error);
        }
    }

    static async loadIpAddress(): Promise<string> {
        try {
            const ip = await AsyncStorage.getItem(IP_ADDRESS_KEY);
            const effectiveIp = ip || IP;
            ApiService.setBaseUrl(effectiveIp);
            return effectiveIp;
        } catch (error) {
            console.error("Failed to load IP address, using default.", error);
            ApiService.setBaseUrl(IP); // Fallback to default
            return IP;
        }
    }

    static async getCurrentIp(): Promise<string> {
        try {
            const ip = await AsyncStorage.getItem(IP_ADDRESS_KEY);
            return ip || IP;
        } catch (error) {
            console.error("Failed to get current IP, using default.", error);
            return IP;
        }
    }
}
