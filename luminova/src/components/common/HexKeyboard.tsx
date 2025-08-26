import React from "react";
import {
	View,
	Text,
	Modal,
	Dimensions,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import Button from "@/src/components/buttons/Button";
import { COLORS, FONTS, COMMON_STYLES } from "@/src/styles/SharedStyles";

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
						<Text style={[COMMON_STYLES.buttonText, styles.headerText]}>
							Hex Input
						</Text>
						<View style={styles.valueContainer}>
							<Text style={[COMMON_STYLES.sliderText, styles.hashSymbol]}>
								#
							</Text>
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
								disabled={currentValue.length === 0}
								style={styles.actionButton}
								textStyle={styles.backspaceText}
								variant="secondary"
							/>
							<Button
								title="Clear"
								onPress={onClear}
								disabled={currentValue.length === 0}
								style={styles.actionButton}
								variant="secondary"
							/>
							<Button
								title="Done"
								onPress={onClose}
								disabled={currentValue.length < 6}
								style={styles.actionButton}
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
		borderTopLeftRadius: 10 * scale,
		borderTopRightRadius: 10 * scale,
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
		backgroundColor: "transparent",
		paddingHorizontal: 8 * scale,
		paddingVertical: 4 * scale,
		borderBottomWidth: 1 * scale,
		borderBottomColor: COLORS.WHITE,
		justifyContent: "center",
	},
	hashSymbol: {
		marginRight: 5 * scale,
		fontSize: 22 * scale,
		fontFamily: FONTS.CLEAR,
	},
	valueText: {
		fontSize: 22 * scale,
		fontFamily: FONTS.CLEAR,
		letterSpacing: 2 * scale,
		textAlign: "center",
		width: 120 * scale,
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
	actionButton: {
		flex: 1,
		marginHorizontal: 5 * scale,
		paddingHorizontal: 10 * scale,
		paddingVertical: 8 * scale,
	},
	backspaceText: {
		fontSize: 20 * scale,
	},
});
