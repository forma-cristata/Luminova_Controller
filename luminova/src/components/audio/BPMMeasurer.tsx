import React, { useEffect, useState, useCallback } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import * as Audio from "expo-audio";
import { COLORS, COMMON_STYLES, FONTS } from "@/src/styles/SharedStyles";

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
	const [recording, setRecording] = useState(false);
	const [detectedBPM, setDetectedBPM] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [beatTimes, setBeatTimes] = useState<number[]>([]);
	const [_startTime, setStartTime] = useState<number>(0);

	const recorder = Audio.useAudioRecorder(Audio.RecordingPresets.HIGH_QUALITY);
	const recorderState = Audio.useAudioRecorderState(recorder, 100); // Update every 100ms

	// BPM calculation functions - more robust against outliers
	const calculateBPM = useCallback((times: number[]): number => {
		if (times.length < 6) return 0; // Need at least 6 beats for any calculation

		// Use all available beats to calculate intervals
		const intervals = times.slice(1).map((time, i) => time - times[i]);

		// Remove outliers using interquartile range method
		const sortedIntervals = [...intervals].sort((a, b) => a - b);
		const q1Index = Math.floor(sortedIntervals.length * 0.25);
		const q3Index = Math.floor(sortedIntervals.length * 0.75);
		const q1 = sortedIntervals[q1Index];
		const q3 = sortedIntervals[q3Index];
		const iqr = q3 - q1;
		const lowerBound = q1 - 1.5 * iqr;
		const upperBound = q3 + 1.5 * iqr;

		// Filter out outliers
		const filteredIntervals = intervals.filter(
			(interval) => interval >= lowerBound && interval <= upperBound,
		);

		// If we filtered out too many intervals, use original data
		const finalIntervals =
			filteredIntervals.length >= Math.ceil(intervals.length * 0.5)
				? filteredIntervals
				: intervals;

		// Calculate median interval for stability (more robust than average)
		const sortedFinal = [...finalIntervals].sort((a, b) => a - b);
		const medianInterval =
			sortedFinal.length % 2 === 0
				? (sortedFinal[sortedFinal.length / 2 - 1] +
						sortedFinal[sortedFinal.length / 2]) /
					2
				: sortedFinal[Math.floor(sortedFinal.length / 2)];

		// Convert to BPM
		const bpm = Math.round(60000 / medianInterval);

		// Return BPM within reasonable bounds
		return Math.max(60, Math.min(200, bpm));
	}, []);

	const processAudioLevel = useCallback(
		(level: number) => {
			if (!recording) return;

			const now = Date.now();
			const BEAT_THRESHOLD = -20; // Adjust based on testing
			const MIN_INTERVAL = 300; // Minimum 300ms between beats
			const MIN_BEATS_FOR_PREVIEW = 6; // Need at least 6 beats before showing any BPM
			const REQUIRED_BEATS = 12; // Still require 12 beats for final calculation
			const lastBeat = beatTimes[beatTimes.length - 1] || 0;

			if (level > BEAT_THRESHOLD && now - lastBeat > MIN_INTERVAL) {
				const newBeatTimes = [...beatTimes, now];

				// Keep only recent beats (last 5 seconds)
				const recentWindow = 5000;
				const filteredTimes = newBeatTimes.filter(
					(time) => now - time < recentWindow,
				);
				setBeatTimes(filteredTimes);

				if (filteredTimes.length >= REQUIRED_BEATS) {
					// Final calculation with all beats
					const bpm = calculateBPM(filteredTimes);
					setDetectedBPM(bpm);

					// Automatically apply and close after required beats are collected
					onBPMDetected(bpm);
					onClose();
				} else if (filteredTimes.length >= MIN_BEATS_FOR_PREVIEW) {
					// Preview BPM calculation after minimum beats (but don't auto-apply)
					const previewBpm = calculateBPM(filteredTimes);
					setDetectedBPM(previewBpm);
				} else {
					// Just show beat count progress until we have enough for preview
					setDetectedBPM(filteredTimes.length);
				}
			}
		},
		[recording, beatTimes, calculateBPM, onBPMDetected, onClose],
	);

	// Process audio levels from recorder state
	useEffect(() => {
		if (recorderState?.metering !== undefined) {
			processAudioLevel(recorderState.metering);
		}
	}, [recorderState?.metering, processAudioLevel]);

	// Handle recording start/stop based on visibility
	useEffect(() => {
		const startRecording = async () => {
			try {
				const permission = await Audio.requestRecordingPermissionsAsync();
				if (!permission.granted) {
					throw new Error("Microphone permission denied");
				}

				await Audio.setAudioModeAsync({
					allowsRecording: true,
					playsInSilentMode: true,
				});

				await recorder.prepareToRecordAsync({
					isMeteringEnabled: true,
					android: {
						audioEncoder: "aac",
						outputFormat: "mpeg4",
					},
					ios: {
						audioQuality: Audio.AudioQuality.MAX,
						outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
					},
				});

				await recorder.record();
				setRecording(true);
				setBeatTimes([]);
				setStartTime(Date.now());
				setError(null);
			} catch (err) {
				console.error("Failed to start recording:", err);
				setError(
					err instanceof Error ? err.message : "Failed to start recording",
				);
			}
		};

		const stopRecording = async () => {
			try {
				// Check if recorder exists and is in a valid state for stopping
				if (recorder && recorderState?.canRecord !== false) {
					await recorder.stop();
				}
				await Audio.setAudioModeAsync({
					allowsRecording: false,
					playsInSilentMode: false,
				});
			} catch (err) {
				console.error("Failed to stop recording:", err);
				// Don't throw - just log the error to prevent crashes
			}
			setRecording(false);
		};

		if (isVisible) {
			startRecording();
		} else {
			stopRecording();
		}

		return () => {
			// Cleanup function - handle cases where component unmounts while recording
			const cleanup = async () => {
				try {
					// Check if recorder is still valid before attempting to stop
					if (recorder && recorderState?.canRecord !== false) {
						await recorder.stop();
					}
					await Audio.setAudioModeAsync({
						allowsRecording: false,
						playsInSilentMode: false,
					});
				} catch (err) {
					// Silent cleanup - don't crash if recorder is already released
					console.warn("Audio cleanup warning:", err);
				}
			};
			cleanup();
		};
	}, [isVisible, recorder, recorderState?.canRecord]);

	// Additional cleanup effect to handle component unmounting
	useEffect(() => {
		return () => {
			// Reset state on unmount to prevent stale state issues
			setRecording(false);
			setBeatTimes([]);
			setDetectedBPM(null);
			setError(null);
		};
	}, []);

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
								{recording
									? "Listening for beats..."
									: "Starting microphone..."}
							</Text>
							{recording && !detectedBPM && (
								<ActivityIndicator size="large" color={COLORS.WHITE} />
							)}
							{recording && detectedBPM && (
								<Text style={styles.progressText}>
									{typeof detectedBPM === "number" &&
									detectedBPM > 0 &&
									detectedBPM < 6
										? `${detectedBPM}/12 beats detected (waiting for stable reading...)`
										: typeof detectedBPM === "number" && detectedBPM < 12
											? `${detectedBPM}/12 beats detected`
											: `${detectedBPM} BPM (preview - collecting more beats...)`}
								</Text>
							)}
						</>
					)}
					<TouchableOpacity
						style={[COMMON_STYLES.styleAButton, styles.button]}
						onPress={onClose}
					>
						<Text style={COMMON_STYLES.buttonText}>Cancel</Text>
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
		borderRadius: 20,
		padding: 20 * scale,
		alignItems: "center",
		borderWidth: 2,
		borderColor: COLORS.WHITE,
		width: width * 0.8,
	},
	title: {
		color: COLORS.WHITE,
		fontSize: 24 * scale,
		fontFamily: FONTS.CLEAR,
		marginBottom: 15 * scale,
	},
	description: {
		color: COLORS.WHITE,
		fontSize: 18 * scale,
		fontFamily: FONTS.CLEAR,
		marginBottom: 20 * scale,
		textAlign: "center",
	},
	bpmText: {
		// removed - unused
	},
	progressText: {
		color: COLORS.WHITE,
		fontSize: 24 * scale,
		fontFamily: FONTS.CLEAR,
		marginVertical: 20 * scale,
	},
	button: {
		marginTop: 20 * scale,
	},
	error: {
		color: COLORS.ERROR,
		fontSize: 16 * scale,
		fontFamily: FONTS.CLEAR,
		textAlign: "center",
		marginVertical: 20 * scale,
	},
});
