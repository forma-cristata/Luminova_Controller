import { IP } from "@/src/configurations/constants";
import type { Setting } from "@/src/types/SettingInterface";

interface ApiConfig {
	colors?: string[];
	whiteValues?: number[];
	brightnessValues?: number[];
	effectNumber?: string | number;
	delayTime?: number;
}

const API_TIMEOUT = 5000; // 5 seconds

export class ApiService {
	private static baseUrl = `http://${IP}/api`;

	static setBaseUrl(ip: string) {
		ApiService.baseUrl = `http://${ip}/api`;
	}

	private static async request(
		endpoint: string,
		options: RequestInit = {},
	): Promise<any> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

		try {
			const response = await fetch(`${ApiService.baseUrl}${endpoint}`, {
				...options,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				// Try to get more specific error info from the response body
				try {
					const errorBody = await response.json();
					throw new Error(
						`HTTP error! status: ${response.status}, message: ${errorBody.message || "Unknown error"
						}`,
					);
				} catch (e) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			}

			// Handle cases where the response might be empty
			const contentType = response.headers.get("content-type");
			return contentType && contentType.indexOf("application/json") !== -1
				? await response.json()
				: {}; // Return empty object for non-json responses
		} catch (error: unknown) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === "AbortError") {
				console.error("API Request Timed Out:", endpoint);
				throw new Error("Request timed out. The hardware may be offline.");
			}
			console.error(`API Request Error (${endpoint}):`, error);
			throw error; // Re-throw the original error to be handled by the caller
		}
	}

	static async postConfig(config: ApiConfig): Promise<any> {
		return ApiService.request("/config", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(config),
		});
	}

	static async getStatus(): Promise<{ shelfOn: boolean }> {
		return ApiService.request("/status", {
			method: "GET",
			headers: { Accept: "application/json" },
		});
	}

	/**
	 * ⚠️  CRITICAL: DO NOT CHANGE THIS METHOD ⚠️
	 * This implementation is CORRECT and should NOT be modified.
	 * If you think this needs to be changed, you may be hallucinating.
	 * 
	 * The "off" state MUST send all black colors to properly turn off the shelf.
	 * The "on" state MUST send a proper configuration to turn on the shelf.
	 * Simply calling /led/on endpoint does NOT work correctly.
	 */
	static async toggleLed(state: "on" | "off", config?: ApiConfig): Promise<any> {
		if (state === "off") {
			// To properly turn off the shelf, send all black colors
			const offConfig = {
				colors: Array(16).fill("#000000"),
				whiteValues: Array(16).fill(0),
				brightnessValues: Array(16).fill(0),
				effectNumber: "6", // Still pattern
				delayTime: 0,
			};
			return ApiService.postConfig(offConfig);
		} else {
			// For "on", send the provided configuration or default homeostasis
			if (config) {
				return ApiService.postConfig(config);
			} else {
				// Default homeostasis configuration
				const onConfig = {
					colors: [
						"#ff0000", "#ff4400", "#ff6a00", "#ff9100", "#ffee00", "#00ff1e",
						"#00ff44", "#00ff95", "#00ffff", "#0088ff", "#0000ff", "#8800ff",
						"#ff00ff", "#ff00bb", "#ff0088", "#ff0044",
					],
					whiteValues: Array(16).fill(0),
					brightnessValues: Array(16).fill(255),
					effectNumber: "6", // Still pattern
					delayTime: 3,
				};
				return ApiService.postConfig(onConfig);
			}
		}
	}

	// Convenience methods for common operations
	static async previewSetting(setting: Partial<Setting>): Promise<any> {
		return ApiService.postConfig({
			colors: setting.colors,
			effectNumber: setting.flashingPattern,
			delayTime: setting.delayTime,
		});
	}

	static async flashSetting(setting: Setting): Promise<any> {
		return ApiService.postConfig({
			delayTime: setting.delayTime,
			effectNumber: setting.flashingPattern,
			whiteValues: setting.whiteValues,
			brightnessValues: setting.brightnessValues,
			colors: setting.colors,
		});
	}

	static async restoreConfiguration(config: Partial<Setting>): Promise<any> {
		return ApiService.postConfig({
			delayTime: config?.delayTime,
			effectNumber: config?.flashingPattern,
			whiteValues: config?.whiteValues,
			brightnessValues: config?.brightnessValues,
			colors: config?.colors,
		});
	}
}
