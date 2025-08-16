export const FLASHING_PATTERNS = [
	{ id: "8", name: "Berghain Bitte" },
	{ id: "5", name: "Cortez" },
	{ id: "4", name: "Decay" },
	{ id: "3", name: "Feel the Funk" },
	{ id: "9", name: "Lapis Lazuli" },
	{ id: "10", name: "Medusa" },
	{ id: "2", name: "The Piano Man" },
	{ id: "1", name: "Smolder" },
	{ id: "11", name: "State of Trance" },
	{ id: "6", name: "Still" },
	{ id: "0", name: "Stuck in a Blender" },
	{ id: "7", name: "The Underground" },
];

// BPM ranges based on electronic music genres
// https://en.wikipedia.org/wiki/Hardstyle - Modern hardstyle: 150-160 BPM
// https://en.wikipedia.org/wiki/Frenchcore - Frenchcore: 180-220+ BPM
export const PATTERN_BPM_RANGES = {
	// Ambient/Downtempo patterns
	"1": { min: 60, max: 140, name: "Chill/Ambient" }, // Smolder
	"2": { min: 70, max: 120, name: "Piano/Jazz" }, // The Piano Man

	// House/Techno patterns  
	"3": { min: 110, max: 140, name: "Funk/House" }, // Feel the Funk
	"4": { min: 120, max: 140, name: "Techno" }, // Decay
	"7": { min: 120, max: 150, name: "Underground" }, // The Underground
	"8": { min: 125, max: 145, name: "Techno" }, // Berghain Bitte

	// Trance patterns
	"11": { min: 128, max: 140, name: "Trance" }, // State of Trance

	// Hardstyle patterns
	"5": { min: 140, max: 180, name: "Hardstyle" }, // Cortez
	"9": { min: 150, max: 180, name: "Hardstyle" }, // Lapis Lazuli
	"10": { min: 140, max: 170, name: "Hard Dance" }, // Medusa

	// Frenchcore/Hardcore patterns
	"0": { min: 180, max: 240, name: "Frenchcore/Hardcore" }, // Stuck in a Blender

	// Still - no BPM range needed
	"6": { min: 0, max: 0, name: "Still" }, // Still
};

export const ANIMATION_PATTERNS = FLASHING_PATTERNS.filter(
	(p) => p.name !== "Still",
).map((p) => p.id);
