import React, { useEffect, useState, useCallback } from "react";
import {
	ActivityIndicator,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import * as Audio from "expo-audio";
import { COLORS, COMMON_STYLES, FONTS, DIMENSIONS } from "@/src/styles/SharedStyles";

const { SCALE: scale, SCREEN_WIDTH: width } = DIMENSIONS;

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
	const [status, setStatus] = useState<
		"idle" | "requesting" | "recording" | "error"
	>("idle");
	const [detectedBPM, setDetectedBPM] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [beatTimes, setBeatTimes] = useState<number[]>([]);
	const [startTime, setStartTime] = useState<number>(0);

	const recorder = Audio.useAudioRecorder(Audio.RecordingPresets.HIGH_QUALITY);
	const recorderState = Audio.useAudioRecorderState(recorder, 100); // Update every 100ms

	// BPM calculation functions
	const calculateBPM = useCallback((times: number[]): number => {
		if (times.length < 2) return 0;

		// Calculate intervals between beats
		const intervals = times.slice(1).map((time, i) => time - times[i]);

		// Calculate median interval
		const sortedIntervals = [...intervals].sort((a, b) => a - b);
		const medianInterval =
			sortedIntervals[Math.floor(sortedIntervals.length / 2)];

		// Convert to BPM and ensure it's in a reasonable range (40-180)
		return Math.max(40, Math.min(180, Math.round(60000 / medianInterval)));
	}, []);

	const processAudioLevel = useCallback(
		(level: number) => {
			if (status !== "recording" || level === null) return;

			const now = Date.now();
			const BEAT_THRESHOLD = -20; // Adjust based on testing
			const MIN_INTERVAL = 300; // Minimum 300ms between beats
			const lastBeat = beatTimes[beatTimes.length - 1] || 0;

			if (level > BEAT_THRESHOLD && now - lastBeat > MIN_INTERVAL) {
				const newBeatTimes = [...beatTimes, now];

				// Keep only recent beats (last 5 seconds)
				const recentWindow = 5000;
				const filteredTimes = newBeatTimes.filter(
					(time) => now - time < recentWindow,
				);
				setBeatTimes(filteredTimes);

				if (filteredTimes.length >= 4) {
					const bpm = calculateBPM(filteredTimes);
					setDetectedBPM(bpm);

					// If we've been recording for 5 seconds, finalize the BPM
					if (now - startTime >= 5000) {
						onBPMDetected(bpm);
						onClose();
					}
				}
			}
		},
		[status, beatTimes, startTime, calculateBPM, onBPMDetected, onClose],
	);

	// Process audio levels from recorder state
	useEffect(() => {
		if (recorderState?.metering !== undefined) {
			processAudioLevel(recorderState.metering);
		}
	}, [recorderState?.metering, processAudioLevel]);

	// Handle recording start/stop based on visibility
	useEffect(() => {
		let isCancelled = false;

		const manageRecording = async () => {
			if (!isVisible) {
				// When not visible, the cleanup function will handle stopping the recorder.
				// We just need to reset the component's state.
				setStatus("idle");
				return;
			}

			// Start the recording process only if the component is idle.
			if (status === "idle") {
				setStatus("requesting");
				try {
					const permission = await Audio.requestRecordingPermissionsAsync();
					if (isCancelled) return;

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
					if (isCancelled) return;

					setStatus("recording");
					setBeatTimes([]);
					setStartTime(Date.now());
					setError(null);
				} catch (err) {
					if (isCancelled) return;
					console.error("Failed to start recording:", err);
					setError(
						err instanceof Error ? err.message : "Failed to start recording",
					);
					setStatus("error");
				}
			}
		};

		manageRecording();

		return () => {
			isCancelled = true;
			// This cleanup function is the single source of truth for stopping the recorder.
			// It runs when the component unmounts or when `isVisible` changes.
			const cleanup = async () => {
				const currentStatus = await recorder.getStatus();
				if (currentStatus.isRecording) {
					try {
						await recorder.stop();
						await Audio.setAudioModeAsync({ allowsRecording: false });
					} catch (e) {
						console.error("Cleanup failed to stop recorder:", e);
					}
				}
			};
			cleanup();
		};
	}, [isVisible, recorder]);

	const handleManualStop = () => {
		if (detectedBPM) {
			onBPMDetected(detectedBPM);
		}
		onClose();
	};

	const renderContent = () => {
		switch (status) {
			case "requesting":
				return (
					<>
						<ActivityIndicator size="large" color={COLORS.WHITE} />
						<Text style={styles.text}>Requesting permission...</Text>
					</>
				);
			case "recording":
				return (
					<>
						<Text style={styles.title}>Detecting BPM...</Text>
						<View style={styles.bpmContainer}>
							<Text style={styles.bpmText}>
								{detectedBPM ? Math.round(detectedBPM) : "--"}
							</Text>
							<Text style={styles.bpmLabel}>BPM</Text>
						</View>
						<View style={styles.meteringBar}>
							<View
								style={[
									styles.meteringFill,
									{
										width: `${Math.max(
											0,
											100 + (recorderState?.metering ?? -100),
										)}%`,
									},
								]}
							/>
						</View>
						<Text style={styles.instructions}>
							Tap anywhere to finalize the BPM.
						</Text>
					</>
				);
			case "error":
				return (
					<>
						<Text style={styles.title}>Error</Text>
						<Text style={styles.errorText}>{error}</Text>
						<TouchableOpacity style={styles.button} onPress={onClose}>
							<Text style={styles.buttonText}>Close</Text>
						</TouchableOpacity>
					</>
				);
			default:
				return (
					<>
						<ActivityIndicator size="large" color={COLORS.WHITE} />
						<Text style={styles.text}>Preparing...</Text>
					</>
				);
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<TouchableOpacity
				style={styles.container}
				activeOpacity={1}
				onPress={status === "recording" ? handleManualStop : undefined}
			>
				<View style={styles.content}>{renderContent()}</View>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	},
	content: {
		width: width * 0.9,
		maxWidth: 400,
		padding: 20 * scale,
		backgroundColor: COLORS.BLACK,
		borderRadius: 15 * scale,
		alignItems: "center",
	},
	title: {
		fontFamily: FONTS.SIGNATURE,
		fontSize: 22 * scale,
		color: COLORS.WHITE,
		marginBottom: 20 * scale,
	},
	bpmContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20 * scale,
	},
	bpmText: {
		fontFamily: FONTS.SIGNATURE,
		fontSize: 72 * scale,
		color: COLORS.WHITE,
		lineHeight: 80 * scale,
	},
	bpmLabel: {
		fontFamily: FONTS.CLEAR,
		fontSize: 18 * scale,
		color: COLORS.WHITE,
		marginTop: -10 * scale,
	},
	meteringBar: {
		width: "100%",
		height: 10 * scale,
		backgroundColor: COLORS.BORDER,
		borderRadius: 5 * scale,
		overflow: "hidden",
		marginBottom: 20 * scale,
	},
	meteringFill: {
		height: "100%",
		backgroundColor: COLORS.WHITE,
	},
	instructions: {
		fontFamily: FONTS.CLEAR,
		fontSize: 14 * scale,
		color: COLORS.PLACEHOLDER,
		textAlign: "center",
	},
	errorText: {
		fontFamily: FONTS.CLEAR,
		fontSize: 16 * scale,
		color: COLORS.ERROR,
		textAlign: "center",
		marginBottom: 20 * scale,
	},
	button: {
		...COMMON_STYLES.styleAButton,
		paddingVertical: 12 * scale,
		paddingHorizontal: 30 * scale,
	},
	buttonText: {
		...COMMON_STYLES.buttonText,
	},
	text: {
		fontFamily: FONTS.CLEAR,
		fontSize: 16 * scale,
		color: COLORS.WHITE,
		marginTop: 10 * scale,
	},
});
