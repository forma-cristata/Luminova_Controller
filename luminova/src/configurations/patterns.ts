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

export const ANIMATION_PATTERNS = FLASHING_PATTERNS.filter(
	(p) => p.name !== "Still",
).map((p) => p.id);
