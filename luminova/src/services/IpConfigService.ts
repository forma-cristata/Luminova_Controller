import AsyncStorage from "@react-native-async-storage/async-storage";
import { setBaseUrl } from "./ApiService";
import { IP } from "../configurations/constants";

const IP_ADDRESS_KEY = "luminova-ip-address";

export async function initializeIp(): Promise<void> {
	try {
		const ip = await AsyncStorage.getItem(IP_ADDRESS_KEY);
		const effectiveIp = ip || IP;
		setBaseUrl(effectiveIp);
	} catch (error) {
		console.error("Failed to initialize IP address, using default.", error);
		setBaseUrl(IP); // Fallback to default
	}
}

export async function saveIpAddress(ip: string): Promise<void> {
	try {
		await AsyncStorage.setItem(IP_ADDRESS_KEY, ip);
		setBaseUrl(ip);
	} catch (error) {
		console.error("Failed to save IP address", error);
	}
}

export async function loadIpAddress(): Promise<string> {
	try {
		const ip = await AsyncStorage.getItem(IP_ADDRESS_KEY);
		const effectiveIp = ip || IP;
		setBaseUrl(effectiveIp);
		return effectiveIp;
	} catch (error) {
		console.error("Failed to load IP address, using default.", error);
		setBaseUrl(IP); // Fallback to default
		return IP;
	}
}

export async function getCurrentIp(): Promise<string> {
	try {
		const ip = await AsyncStorage.getItem(IP_ADDRESS_KEY);
		return ip || IP;
	} catch (error) {
		console.error("Failed to get current IP, using default.", error);
		return IP;
	}
}