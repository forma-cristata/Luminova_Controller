import React from "react";
import {
	View,
	Text,
	Modal,
	Dimensions,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import Button from "@/src/components/ui/buttons/Button";
import { COLORS, COMMON_STYLES } from "@/src/styles/SharedStyles";

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

interface HexKeyboardProps {
	visible: boolean;
	onClose: () => void;
	onKeyPress: (key: string) => void;
	onBackspace: () => void;
	onClear: () => void;
	currentValue: string;
}

const HEX_KEYS = [
	["1", "2", "3", "A"],
	["4", "5", "6", "B"],
	["7", "8", "9", "C"],
	["0", "F", "E", "D"],
];

export default React.memo(function HexKeyboard({
	visible,
	onClose,
	onKeyPress,
	onBackspace,
	onClear,
	currentValue,
}: HexKeyboardProps) {
	const renderKey = (key: string) => (
		<Button
			key={key}
			title={key}
			onPress={() => onKeyPress(key)}
			style={styles.hexKey}
			textStyle={styles.hexKeyText}
			variant="secondary"
		/>
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<TouchableOpacity
					style={styles.dismissArea}
					onPress={onClose}
					activeOpacity={1}
				/>
				<View style={styles.keyboardContainer}>
					{/* Header with current value */}
					<View style={styles.header}>
						<Text style={[COMMON_STYLES.buttonText, styles.headerText]}>Hex Input</Text>
						<View style={styles.valueContainer}>
							<Text style={[COMMON_STYLES.sliderText, styles.hashSymbol]}>#</Text>
							<Text style={[COMMON_STYLES.sliderText, styles.valueText]}>
								{currentValue.toUpperCase().padEnd(6, "_")}
							</Text>
						</View>
					</View>

					{/* Hex Keys Grid */}
					<View style={styles.keysContainer}>
						{HEX_KEYS.map((row) => (
							<View key={row.join("-")} style={styles.keyRow}>
								{row.map(renderKey)}
							</View>
						))}
					</View>

					{/* Action Buttons */}
					<View style={styles.actionsContainer}>
						<View style={COMMON_STYLES.buttonRow}>
							<Button
								title="⌫"
								onPress={onBackspace}
								style={styles.backspaceButton}
								textStyle={styles.backspaceText}
								variant="secondary"
							/>
							<Button
								title="Clear"
								onPress={onClear}
								style={styles.clearButton}
								variant="secondary"
							/>
							<Button
								title="Done"
								onPress={onClose}
								style={styles.doneButton}
								variant="default"
							/>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
});

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "flex-end",
	},

	dismissArea: {
		flex: 1,
	},

	keyboardContainer: {
		backgroundColor: COLORS.BLACK,
		borderTopLeftRadius: 20 * scale,
		borderTopRightRadius: 20 * scale,
		borderTopWidth: 2 * scale,
		borderLeftWidth: 2 * scale,
		borderRightWidth: 2 * scale,
		borderColor: COLORS.BORDER,
		paddingBottom: 20 * scale,
		maxHeight: height * 0.6,
	},

	header: {
		padding: 20 * scale,
		borderBottomWidth: 1 * scale,
		borderBottomColor: COLORS.BORDER,
		alignItems: "center",
	},

	headerText: {
		marginBottom: 15 * scale,
		fontSize: 28 * scale,
	},

	valueContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		paddingHorizontal: 15 * scale,
		paddingVertical: 10 * scale,
		borderRadius: 8 * scale,
		borderWidth: 1 * scale,
		borderColor: COLORS.BORDER,
	},

	hashSymbol: {
		marginRight: 5 * scale,
	},

	valueText: {
		fontFamily: "monospace",
		letterSpacing: 2 * scale,
		minWidth: 120 * scale,
	},

	keysContainer: {
		padding: 20 * scale,
	},

	keyRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10 * scale,
	},

	hexKey: {
		width: (width - 80 * scale) / 4 - 5 * scale,
		borderBottomWidth: 2 * scale,
		borderBottomColor: COLORS.WHITE,
	},

	hexKeyText: {
		fontSize: 24 * scale,
		fontWeight: "bold",
	},

	actionsContainer: {
		paddingHorizontal: 20 * scale,
	},

	backspaceButton: {
		backgroundColor: "rgba(255, 100, 100, 0.1)",
		borderBottomColor: "#ff6464",
		flex: 1,
		marginRight: 5 * scale,
	},

	backspaceText: {
		fontSize: 20 * scale,
	},

	clearButton: {
		backgroundColor: "rgba(255, 165, 0, 0.1)",
		borderBottomColor: "#ffa500",
		flex: 1,
		marginHorizontal: 5 * scale,
	},

	doneButton: {
		backgroundColor: "rgba(100, 255, 100, 0.1)",
		borderBottomColor: "#64ff64",
		flex: 1,
		marginLeft: 5 * scale,
	},
});
