import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { BPMAnalyzer } from '../utils/bpmAnalyzer';
import { COLORS, FONTS, COMMON_STYLES } from './SharedStyles';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;

interface BPMMeasurerProps {
    isVisible: boolean;
    onClose: () => void;
    onBPMDetected: (bpm: number) => void;
}

export default function BPMMeasurer({ isVisible, onClose, onBPMDetected }: BPMMeasurerProps) {
    const [recording, setRecording] = useState(false);
    const [detectedBPM, setDetectedBPM] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const analyzerRef = useRef<BPMAnalyzer | null>(null);

    useEffect(() => {
        const startAnalysis = async () => {
            try {
                if (!analyzerRef.current) {
                    analyzerRef.current = new BPMAnalyzer({
                        onBPMUpdate: (bpm) => {
                            setDetectedBPM(bpm);
                        },
                        onBPMStable: (bpm) => {
                            setDetectedBPM(bpm);
                            onBPMDetected(bpm);
                            onClose();
                        },
                    });
                }

                await analyzerRef.current.start();
                setRecording(true);
                setError(null);

            } catch (err) {
                console.error('Failed to start BPM analysis:', err);
                setError(err instanceof Error ? err.message : 'Failed to start recording');
            }
        };

        const stopAnalysis = async () => {
            try {
                if (analyzerRef.current) {
                    await analyzerRef.current.stop();
                    analyzerRef.current = null;
                }
            } catch (err) {
                console.error('Failed to stop BPM analysis:', err);
            }
            setRecording(false);
        };

        if (isVisible) {
            startAnalysis();
        } else {
            stopAnalysis();
        }

        return () => {
            stopAnalysis();
        };
    }, [isVisible, onBPMDetected]);

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
                                    ? 'Listening for beats...'
                                    : 'Starting microphone...'}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.BLACK,
        borderRadius: 20,
        padding: 20 * scale,
        alignItems: 'center',
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
        textAlign: 'center',
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
        textAlign: 'center',
        marginVertical: 20 * scale,
    },
});