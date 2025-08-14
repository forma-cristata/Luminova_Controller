import { IP } from "@/app/configurations/constants";
import { Setting } from "@/app/interface/setting-interface";

interface ApiConfig {
	colors?: string[];
	whiteValues?: number[];
	brightnessValues?: number[];
	effectNumber?: string | number;
	delayTime?: number;
}

export class ApiService {
	private static baseUrl = `http://${IP}/api`;

	static async postConfig(config: ApiConfig): Promise<any> {
		try {
			const response = await fetch(`${ApiService.baseUrl}/config`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(config),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API Config Error:", error);
			throw error;
		}
	}

	static async getStatus(): Promise<{ shelfOn: boolean }> {
		try {
			const response = await fetch(`${ApiService.baseUrl}/status`, {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API Status Error:", error);
			throw error;
		}
	}

	static async toggleLed(state: "on" | "off"): Promise<any> {
		try {
			const response = await fetch(`${ApiService.baseUrl}/led/${state}`, {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API Toggle Error:", error);
			throw error;
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
