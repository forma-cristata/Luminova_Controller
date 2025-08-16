export { IP, ANIMATION_COLORS, BASE_ANIMATION_COLORS };
const IP: string = "0.0.0.0";

const BASE_ANIMATION_COLORS = [
	"#ff0000",
	"#ff4400",
	"#ff6a00",
	"#ff9100",
	"#ffee00",
	"#00ff1e",
	"#00ff44",
	"#00ff95",
	"#00ffff",
	"#0088ff",
	"#0000ff",
	"#8800ff",
	"#d300ff",
	"#ff00BB",
	"#ff0088",
	"#ff0031",
];

const ANIMATION_COLORS = BASE_ANIMATION_COLORS.flatMap((color) => [
	color,
	"#000000",
]);
