export type { Setting };

interface Setting {
	id?: string; // Optional unique identifier for stable keys
	name: string;
	colors: string[];
	whiteValues: number[];
	brightnessValues: number[];
	flashingPattern: string;
	delayTime: number;
}
