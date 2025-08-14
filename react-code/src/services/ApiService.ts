import { IP } from "@/src/configurations/constants";
import { Setting } from "@/src/interface/SettingInterface";

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
						`HTTP error! status: ${response.status}, message: ${
							errorBody.message || "Unknown error"
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

	static async toggleLed(state: "on" | "off"): Promise<any> {
		return ApiService.request(`/led/${state}`, {
			method: "GET",
			headers: { Accept: "application/json" },
		});
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
