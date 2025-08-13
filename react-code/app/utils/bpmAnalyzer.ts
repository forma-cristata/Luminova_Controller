import * as Audio from 'expo-audio';

interface BPMAnalyzerOptions {
    onBPMUpdate?: (bpm: number) => void;
    onBPMStable?: (bpm: number) => void;
    stabilizationTime?: number;
    minimumBeats?: number;
}

export class BPMAnalyzer {
    private beatTimes: number[] = [];
    private lastBeat: number = 0;
    private options: BPMAnalyzerOptions;
    private startTime: number = 0;
    private recorder: Audio.AudioRecorder | null = null;
    private analyzing: boolean = false;

    constructor(options: BPMAnalyzerOptions = {}) {
        this.options = {
            stabilizationTime: 20000, // Default 20 seconds
            minimumBeats: 4, // Minimum beats needed for calculation
            ...options
        };
    }

    async start() {
        try {
            // Request permissions
            const permission = await Audio.requestRecordingPermissionsAsync();
            if (!permission.granted) {
                throw new Error('Microphone permission denied');
            }

            // Set up audio mode for recording
            await Audio.setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true
            });

            // Create recorder with high quality settings
            this.recorder = Audio.useAudioRecorder(Audio.RecordingPresets.HIGH_QUALITY);
            
            // Set up the recorder state listener
            Audio.useAudioRecorderState(this.recorder, 100); // Update every 100ms
            
            const recorderState = Audio.useAudioRecorderState(this.recorder);
            this.setupAudioLevelDetection(recorderState);

            // Start recording
            await this.recorder.prepareToRecordAsync({
                isMeteringEnabled: true, // Enable audio level metering
                android: {
                    audioEncoder: 'aac',
                    outputFormat: 'mpeg4'
                },
                ios: {
                    audioQuality: Audio.AudioQuality.MAX,
                    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                }
            });

            this.recorder.record();

            // Reset state
            this.beatTimes = [];
            this.lastBeat = 0;
            this.startTime = Date.now();
            this.analyzing = true;

        } catch (error) {
            throw error;
        }
    }

    private setupAudioLevelDetection(recorderState: Audio.RecorderState) {
        // Watch for audio level changes in the recorder state
        if (recorderState.metering !== undefined) {
            this.processAudioLevel(recorderState.metering);
        }
    }

    private processAudioLevel = (level: number) => {
        if (!this.analyzing) return;

        // Audio level threshold for beat detection
        const BEAT_THRESHOLD = -20; // Adjust based on testing
        
        if (level > BEAT_THRESHOLD) {
            this.checkForBeat();
        }
    };

    async stop() {
        this.analyzing = false;
        
        if (this.recorder) {
            await this.recorder.stop();
            this.recorder = null;
        }

        // Reset audio mode
        await Audio.setAudioModeAsync({
            allowsRecording: false,
            playsInSilentMode: false
        });
    }

    private checkForBeat() {
        const now = Date.now();
        const MIN_INTERVAL = 300; // Minimum 300ms between beats

        if ((now - this.lastBeat) > MIN_INTERVAL) {
            this.lastBeat = now;
            this.beatTimes.push(now);

            // Keep only recent beats for memory efficiency
            const recentWindow = 5000; // 5 seconds
            this.beatTimes = this.beatTimes.filter(time => (now - time) < recentWindow);

            if (this.beatTimes.length >= this.options.minimumBeats!) {
                const bpm = this.calculateBPM();
                this.options.onBPMUpdate?.(bpm);

                // Check if we've reached stabilization time
                if (now - this.startTime >= this.options.stabilizationTime!) {
                    this.options.onBPMStable?.(bpm);
                    this.stop();
                }
            }
        }
    }

    private calculateBPM(): number {
        if (this.beatTimes.length < 2) return 0;

        // Calculate intervals between beats
        const intervals: number[] = [];
        for (let i = 1; i < this.beatTimes.length; i++) {
            intervals.push(this.beatTimes[i] - this.beatTimes[i - 1]);
        }

        // Calculate median interval
        const sortedIntervals = [...intervals].sort((a, b) => a - b);
        const medianInterval = sortedIntervals[Math.floor(sortedIntervals.length / 2)];

        // Convert to BPM
        const bpm = Math.round(60000 / medianInterval);

        // Ensure the BPM is in a reasonable range (40-180)
        return Math.max(40, Math.min(180, bpm));
    }
}