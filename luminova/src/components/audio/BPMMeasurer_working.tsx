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
    const [startTime, setStartTime] = useState<number>(0);

    const recorder = Audio.useAudioRecorder(Audio.RecordingPresets.HIGH_QUALITY);
    const recorderState = Audio.useAudioRecorderState(recorder, 100); // Update every 100ms

    // BPM calculation functions - collect 16 beats and average
    const calculateBPM = useCallback((times: number[]): number => {
        if (times.length < 16) return 0; // Need at least 16 beats for accurate measurement

        // Use all 16 beats to calculate intervals
        const intervals = times.slice(1).map((time, i) => time - times[i]);

        // Calculate average interval for most accurate measurement
        const totalInterval = intervals.reduce((sum, interval) => sum + interval, 0);
        const averageInterval = totalInterval / intervals.length;

        // Convert to BPM
        const bpm = Math.round(60000 / averageInterval);

        // Return BPM within reasonable bounds
        return Math.max(60, Math.min(200, bpm));
    }, []);

    const processAudioLevel = useCallback(
        (level: number) => {
            if (!recording) return;

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

                // Only calculate BPM when we have exactly 16 beats
                if (filteredTimes.length >= 16) {
                    const bpm = calculateBPM(filteredTimes);
                    setDetectedBPM(bpm);

                    // Automatically apply and close after 16 beats are collected
                    onBPMDetected(bpm);
                    onClose();
                } else {
                    // Show progress: how many beats collected so far
                    setDetectedBPM(filteredTimes.length);
                }
            }
        },
        [recording, beatTimes, calculateBPM, onBPMDetected, onClose],
    );    // Process audio levels from recorder state
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
                if (recorder) {
                    await recorder.stop();
                }
                await Audio.setAudioModeAsync({
                    allowsRecording: false,
                    playsInSilentMode: false,
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
                            {recording && detectedBPM && (
                                <Text style={styles.progressText}>
                                    {typeof detectedBPM === 'number' && detectedBPM > 0 && detectedBPM < 16
                                        ? `${detectedBPM}/16 beats detected`
                                        : `${detectedBPM} BPM`}
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
    // removed unused bpmText style
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
