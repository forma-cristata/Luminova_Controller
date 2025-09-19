import { COLORS, COMMON_STYLES, FONTS } from "@/src/styles/SharedStyles";
import * as Audio from "expo-audio";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

interface BPMMeasurerProps {
	isVisible: boolean;
	onClose: () => void;
	onBPMDetected: (bpm: number) => void;
}

export default function BPMMeasurer({
	isVisible,
	onClose,
	onBPMDetected,
}: BPMMeasurerProps) {
	const [isListening, setIsListening] = useState(false);
	const [detectedBPM, setDetectedBPM] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [beatTimes, setBeatTimes] = useState<number[]>([]);
	const [beatCount, setBeatCount] = useState(0);

	const lastBeatRef = useRef(0);

	// Constants - reduced for faster detection with human error tolerance
	const MIN_INTERVAL = 200; // Allow faster tapping (was 300ms)
	const REQUIRED_BEATS = 4; // Only need 4 beats total
	const MIN_BEATS_FOR_PREVIEW = 3; // Preview after 3 beats

	const calculateBPM = useCallback((times: number[]): number => {
		if (times.length < 3) return 0;

		// Calculate intervals between beats
		const intervals = times.slice(1).map((time, i) => time - times[i]);

		// Remove obvious outliers (human error tolerance)
		// Filter out intervals that are more than 50% different from median
		const sortedIntervals = [...intervals].sort((a, b) => a - b);
		const median = sortedIntervals[Math.floor(sortedIntervals.length / 2)];
		const filteredIntervals = intervals.filter(
			(interval) => interval >= median * 0.5 && interval <= median * 1.5,
		);

		// Use filtered intervals if we have enough, otherwise use all
		const finalIntervals =
			filteredIntervals.length >= 2 ? filteredIntervals : intervals;

		// Calculate average interval with human error tolerance
		const avgInterval =
			finalIntervals.reduce((sum, interval) => sum + interval, 0) /
			finalIntervals.length;

		// Convert to BPM and round to nearest 5 for cleaner results
		const bpm = Math.round(60000 / avgInterval);
		return Math.round(bpm / 5) * 5; // Round to nearest 5 BPM
	}, []);

	const startListening = useCallback(async () => {
		try {
			console.log("🎤 Starting beat detection...");
			const permission = await Audio.requestRecordingPermissionsAsync();
			if (!permission.granted) {
				throw new Error("Microphone permission denied");
			}
			setIsListening(true);
			setError(null);
			setBeatTimes([]);
			setBeatCount(0);
			setDetectedBPM(null);
			lastBeatRef.current = 0;
			console.log("✅ Ready! Tap the beat detection area");
		} catch (err) {
			console.error("Failed to start listening:", err);
			setError(
				`Setup error: ${err instanceof Error ? err.message : "Unknown error"}`,
			);
			setIsListening(false);
		}
	}, []);

	const recordBeat = useCallback(() => {
		if (!isListening) return;
		const now = Date.now();
		if (now - lastBeatRef.current < MIN_INTERVAL) return;

		lastBeatRef.current = now;
		const newBeatTimes = [...beatTimes, now];
		setBeatTimes(newBeatTimes);
		setBeatCount(newBeatTimes.length);

		console.log(`🥁 Beat ${newBeatTimes.length}/${REQUIRED_BEATS} recorded`);

		if (newBeatTimes.length >= REQUIRED_BEATS) {
			const bpm = calculateBPM(newBeatTimes);
			setDetectedBPM(bpm);
			console.log(
				`✅ BPM calculated: ${bpm} (from ${newBeatTimes.length} beats)`,
			);
			setTimeout(() => {
				onBPMDetected(bpm);
				onClose();
			}, 500); // Faster completion (was 1000ms)
		} else if (newBeatTimes.length >= MIN_BEATS_FOR_PREVIEW) {
			const previewBpm = calculateBPM(newBeatTimes);
			setDetectedBPM(previewBpm);
			console.log(
				`👁️ Preview BPM: ${previewBpm} (${newBeatTimes.length}/${REQUIRED_BEATS} beats)`,
			);
		}
	}, [isListening, beatTimes, calculateBPM, onBPMDetected, onClose]);

	useEffect(() => {
		if (isVisible && !isListening) {
			startListening();
		} else if (!isVisible) {
			// Reset everything when modal closes
			console.log("🔄 Resetting BPM detection state");
			setIsListening(false);
			setBeatTimes([]);
			setBeatCount(0);
			setDetectedBPM(null);
			setError(null);
			lastBeatRef.current = 0;
		}
	}, [isVisible, isListening, startListening]);

	return (
		<Modal
			visible={isVisible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.modalContent}>
					<Text style={styles.title}>BPM Detection</Text>
					{error ? (
						<Text style={styles.error}>{error}</Text>
					) : (
						<>
							<Text style={styles.description}>
								Tap 4 beats in rhythm with your metronome
							</Text>

							{isListening ? (
								<>
									<TouchableOpacity style={styles.tapArea} onPress={recordBeat}>
										<Text style={styles.tapText}>TAP HERE</Text>
										<Text style={styles.progressText}>
											{beatCount}/{REQUIRED_BEATS} beats
										</Text>
									</TouchableOpacity>

									{detectedBPM !== null && (
										<Text style={styles.bpmDisplay}>BPM: {detectedBPM}</Text>
									)}
								</>
							) : (
								<ActivityIndicator size="large" color={COLORS.WHITE} />
							)}
						</>
					)}

					<TouchableOpacity
						style={[COMMON_STYLES.styleAButton, styles.button]}
						onPress={onClose}
					>
						<Text style={COMMON_STYLES.buttonText}>Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: COLORS.BLACK,
		borderRadius: 20 * scale,
		padding: 30 * scale,
		margin: 20 * scale,
		minWidth: 300 * scale,
		alignItems: "center",
	},
	title: {
		fontSize: 24 * scale,
		fontFamily: FONTS.CLEAR,
		color: COLORS.WHITE,
		marginBottom: 20 * scale,
		textAlign: "center",
	},
	description: {
		fontSize: 16 * scale,
		fontFamily: FONTS.CLEAR,
		color: COLORS.WHITE,
		textAlign: "center",
		marginBottom: 30 * scale,
		lineHeight: 22 * scale,
	},
	tapArea: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 15 * scale,
		padding: 40 * scale,
		marginBottom: 20 * scale,
		minWidth: 200 * scale,
		minHeight: 120 * scale,
		justifyContent: "center",
		alignItems: "center",
	},
	tapText: {
		fontSize: 24 * scale,
		fontFamily: FONTS.CLEAR,
		color: COLORS.BLACK,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10 * scale,
	},
	progressText: {
		fontSize: 16 * scale,
		fontFamily: FONTS.CLEAR,
		color: COLORS.BLACK,
		textAlign: "center",
	},
	bpmDisplay: {
		fontSize: 32 * scale,
		fontFamily: FONTS.CLEAR,
		color: COLORS.WHITE,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20 * scale,
	},
	error: {
		fontSize: 16 * scale,
		fontFamily: FONTS.CLEAR,
		color: COLORS.ERROR,
		textAlign: "center",
		marginBottom: 20 * scale,
	},
	button: {
		marginTop: 20 * scale,
	},
});
