import { IP } from '@/src/configurations/constants';
import type { Setting } from '@/src/types/SettingInterface';

interface ApiConfig {
	colors?: string[];
	whiteValues?: number[];
	brightnessValues?: number[];
	effectNumber?: string | number;
	delayTime?: number;
}

interface ApiResponse {
	[key: string]: unknown;
}

interface StatusResponse extends ApiResponse {
	shelfOn: boolean;
}

const API_TIMEOUT = 5000; // 5 seconds
let baseUrl = `http://${IP}/api`;

export function setBaseUrl(ip: string) {
	baseUrl = `http://${ip}/api`;
}

async function request(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

	try {
		const response = await fetch(`${baseUrl}${endpoint}`, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(timeoutId);

		if (!response.ok) {
			// Try to get more specific error info from the response body
			try {
				const errorBody = await response.json();
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorBody.message || 'Unknown error'}`,
				);
			} catch {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		}

		// Handle cases where the response might be empty
		const contentType = response.headers.get('content-type');
		return contentType && contentType.indexOf('application/json') !== -1 ? await response.json() : {}; // Return empty object for non-json responses
	} catch (error: unknown) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			console.error('API Request Timed Out:', endpoint);
			throw new Error('Request timed out. The hardware may be offline.');
		}
		console.log(`API Request Error (${endpoint}):`, error);
		throw error; // Re-throw the original error to be handled by the caller
	}
}

export async function postConfig(config: ApiConfig): Promise<ApiResponse> {
	return request('/config', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(config),
	});
}

export async function getStatus(): Promise<StatusResponse> {
	const response = await request('/status', {
		method: 'GET',
		headers: { Accept: 'application/json' },
	});
	return response as StatusResponse;
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
export async function toggleLed(state: 'on' | 'off', config?: ApiConfig): Promise<ApiResponse> {
	if (state === 'off') {
		// To properly turn off the shelf, send all black colors
		const offConfig = {
			colors: Array(16).fill('#000000'),
			whiteValues: Array(16).fill(0),
			brightnessValues: Array(16).fill(0),
			effectNumber: '6', // Still pattern
			delayTime: 0,
		};
		return postConfig(offConfig);
	} else {
		// For "on", send the provided configuration or default homeostasis
		if (config) {
			return postConfig(config);
		} else {
			// Default homeostasis configuration
			const onConfig = {
				colors: [
					'#ff0000',
					'#ff4400',
					'#ff6a00',
					'#ff9100',
					'#ffee00',
					'#00ff1e',
					'#00ff44',
					'#00ff95',
					'#00ffff',
					'#0088ff',
					'#0000ff',
					'#8800ff',
					'#ff00ff',
					'#ff00bb',
					'#ff0088',
					'#ff0044',
				],
				whiteValues: Array(16).fill(0),
				brightnessValues: Array(16).fill(255),
				effectNumber: '6', // Still pattern
				delayTime: 3,
			};
			return postConfig(onConfig);
		}
	}
}

// Convenience methods for common operations
export async function previewSetting(setting: Partial<Setting>): Promise<ApiResponse> {
	return postConfig({
		colors: setting.colors,
		effectNumber: setting.flashingPattern,
		delayTime: setting.delayTime || 1,
	});
}

export async function flashSetting(setting: Setting): Promise<ApiResponse> {
	return postConfig({
		delayTime: setting.delayTime,
		effectNumber: setting.flashingPattern,
		whiteValues: setting.whiteValues,
		brightnessValues: setting.brightnessValues,
		colors: setting.colors,
	});
}

export async function restoreConfiguration(config: Partial<Setting>): Promise<ApiResponse> {
	return postConfig({
		delayTime: config?.delayTime || 1,
		effectNumber: config?.flashingPattern,
		whiteValues: config?.whiteValues,
		brightnessValues: config?.brightnessValues,
		colors: config?.colors,
	});
}
