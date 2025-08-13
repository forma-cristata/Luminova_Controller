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
import * as Audio from 'expo-audio';
import { COLORS, COMMON_STYLES, FONTS } from "./SharedStyles";

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
		const medianInterval = sortedIntervals[Math.floor(sortedIntervals.length / 2)];

		// Convert to BPM and ensure it's in a reasonable range (40-180)
		return Math.max(40, Math.min(180, Math.round(60000 / medianInterval)));
	}, []);

	const processAudioLevel = useCallback((level: number) => {
		if (!recording) return;

		const now = Date.now();
		const BEAT_THRESHOLD = -20; // Adjust based on testing
		const MIN_INTERVAL = 300; // Minimum 300ms between beats
		const lastBeat = beatTimes[beatTimes.length - 1] || 0;

		if (level > BEAT_THRESHOLD && (now - lastBeat) > MIN_INTERVAL) {
			const newBeatTimes = [...beatTimes, now];
			
			// Keep only recent beats (last 5 seconds)
			const recentWindow = 5000;
			const filteredTimes = newBeatTimes.filter(time => (now - time) < recentWindow);
			setBeatTimes(filteredTimes);

			if (filteredTimes.length >= 4) {
				const bpm = calculateBPM(filteredTimes);
				setDetectedBPM(bpm);

				// If we've been recording for 20 seconds, finalize the BPM
				if (now - startTime >= 20000) {
					onBPMDetected(bpm);
					onClose();
				}
			}
		}
	}, [recording, beatTimes, startTime, calculateBPM, onBPMDetected, onClose]);

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
					playsInSilentMode: true
				});

				await recorder.prepareToRecordAsync({
					isMeteringEnabled: true,
					android: {
						audioEncoder: 'aac',
						outputFormat: 'mpeg4'
					},
					ios: {
						audioQuality: Audio.AudioQuality.MAX,
						outputFormat: Audio.IOSOutputFormat.MPEG4AAC
					}
				});

				await recorder.record();
				setRecording(true);
				setBeatTimes([]);
				setStartTime(Date.now());
				setError(null);
			} catch (err) {
				console.error("Failed to start recording:", err);
				setError(err instanceof Error ? err.message : "Failed to start recording");
			}
		};

		const stopRecording = async () => {
			try {
				if (recorder) {
					await recorder.stop();
				}
				await Audio.setAudioModeAsync({
					allowsRecording: false,
					playsInSilentMode: false
				});
			} catch (err) {
				console.error("Failed to stop recording:", err);
			}
			setRecording(false);
		};

		if (isVisible) {
			startRecording();
		} else {
			stopRecording();
		}

		return () => {
			stopRecording();
		};
	}, [isVisible, recorder]);

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
							{detectedBPM && (
								<Text style={styles.bpmText}>{detectedBPM} BPM</Text>
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
		color: COLORS.WHITE,
		fontSize: 36 * scale,
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
