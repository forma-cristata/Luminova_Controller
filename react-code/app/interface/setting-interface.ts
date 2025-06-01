// In app/interface/setting-interface.ts
export default interface Setting {
    id: string; // Add unique identifier
    name: string;
    colors: string[];
    whiteValues: number[];
    brightnessValues: number[];
    flashingPattern: string;
    delayTime: number;
}