#include <FastLED.h>
#include <WiFiS3.h>
#include "index.h"
#include <ArduinoJson.h>
#define NUM_LEDS 22
#define DATA_PIN 6
#define SEED 42
#define LIGHT_COUNT 16
#define COLOR_COUNT 16
WiFiServer server(80);
const char ssid[] = "friskyfishes";
const char pass[] = "allthatjazz";
CRGB leds[NUM_LEDS];
int startupFocal = -1;
bool startupShelfOn = true;
int startupdelayTime = 3;
int startupWhiteValues[] = { 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0, 
    0, 0, 0, 0 
};
int startupBrightnessValues[] = { 
    255, 255, 255, 255, 
    255, 255, 255, 255, 
    255, 255, 255, 255, 
    255, 255, 255, 255 
};
int startupEffectNumber = 6;
String startupColors[] = { 
    "#ff0000", "#ff4400", "#ff6a00", "#ff9100",
    "#ffee00", "#00ff1e", "#00ff44", "#00ff95",
    "#00ffff", "#0088ff", "#0000ff", "#8800ff",
    "#ff00ff", "#ff00bb", "#ff0088", "#ff0044" 
};
int focal = -1;
bool shelfOn = false;
int delayTime = 0;
int whiteValues[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
int brightnessValues[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
int effectNumber = 0;
String colors[] = { "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000",
"#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000" };
int status = WL_IDLE_STATUS;
void connectToWifi();
void handleWebServer();
void processJsonConfig(const String& jsonString);
void currentSettingPrint();
void ledSetup();
void setLed(int L, String hex, int W, int Brightness);
void setLed(int L, String hex, int W, int Brightness);
void selectEffect(int effectNumber);
void StuckInABlender();
void Smolder();
void ThePianoMan();
void FeelTheFunk();
void Decay();
void Cortez();
void Still();
void TheUnderground();
void BerghainBitte();
void LapisLazuli();
void Medusa();
void StateOfTrance();
void focalCheck(float delayTime);
void setup() {
	Serial.begin(9600);
	while (!Serial) { focalCheck(100.0); }
	connectToWifi();
	ledSetup();
}
void loop() {
    currentSettingPrint();
    handleWebServer();
    if (shelfOn) {
        selectEffect(effectNumber);
    }
    else {
        for (int i = 0; i < LIGHT_COUNT; i++) {
            setLed(i, "#000000", 0, 0);
        }
    }
}
void focalCheck(float delayTime) {
    handleWebServer();
    delay(delayTime);
    const byte HALL_PINS[] = { A0, A1, A2, A3, A4 }; 
    const int NUM_PINS = 5;
    const int BASE_READINGS[] = { 500, 509, 506, 500, 514 };
    const float THRESHOLDS[] = { 3.0, 2.9, 2.8, 2.5, 2.5 };             
    float highestVal = 0;
    int highestPin = -1;
    for (int i = 0; i < NUM_PINS; i++) {
        float sum = 0;
        float avgRaw = 0;
        for (int j = 0; j < 3; j++) {
            int rawReading = analogRead(HALL_PINS[i]);
            avgRaw += rawReading;
            float value = abs(rawReading - BASE_READINGS[i]);
            sum += value;
        }
        avgRaw /= 3.0;
        float value = sum / 3.0;
        if (value > THRESHOLDS[i]) {
            if (highestPin == -1 || value > highestVal) {
                highestVal = value;
                highestPin = i;
            }
        }
    }
    int focalPoint = -1;
    if (highestPin >= 0) {
        switch (HALL_PINS[highestPin]) {
        case A4: focalPoint = 2; break;
        case A3: focalPoint = 5; break;
        case A2: focalPoint = 8; break;
        case A1: focalPoint = 12; break;
        case A0: focalPoint = 15; break;
        }
    }
	focal = focalPoint;
    Serial.print("Focal point: ");
    Serial.println(focal);
}
// 11 -> Trance
void StateOfTrance() {
    int sc1 = 2; 
    int sc2 = 2;
    int ls = 4;
    if (focal == -1) {
        for (int j = 0; j < LIGHT_COUNT; j++) {
            for (int k = 0; k < sc1; k++) {
                if (effectNumber != 11) return;
                for (int i = 0; i < ls; i++) {
                    int li = j + i;
                    setLed((li + 1) % LIGHT_COUNT, colors[li % COLOR_COUNT], whiteValues[li % COLOR_COUNT], brightnessValues[li % COLOR_COUNT]);
                    delay(delayTime * 2);
                    setLed((li + 1) % LIGHT_COUNT, "#000000", 0, 0);
                    focalCheck(delayTime * 2);
                }
            }
            for (int strobe = 0; strobe < sc2; strobe++) {
                if (effectNumber != 11) return;
                for (int i = 0; i < ls; i++) {
                    int li = j + i;
                    setLed((li + 1) % LIGHT_COUNT, colors[li % COLOR_COUNT], whiteValues[li % COLOR_COUNT], brightnessValues[li % COLOR_COUNT]);
                    delay(delayTime * 2);
                    setLed((li + 1) % LIGHT_COUNT, "#000000", 0, 0);
                    delay(delayTime * 2);
                }
            }
        }
    }
    else {
        int oth = 15;
            for (int j = 0; j < focal; j++) {
                focalCheck(0);
                for (int k = 0; k < sc1; k++) {
                    if (effectNumber != 11) return;
                    for (int i = 0; i < ls; i++) {
                        int li = j + i;
                        int li2 = oth + i;
                        setLed((li + 1) % LIGHT_COUNT, colors[li % COLOR_COUNT], whiteValues[li % COLOR_COUNT], brightnessValues[li % COLOR_COUNT]);
                        if (oth >= focal) {
                            setLed((li2 + 1) % LIGHT_COUNT, colors[li2 % COLOR_COUNT], whiteValues[li2 % COLOR_COUNT], brightnessValues[li2 % COLOR_COUNT]);
                        }
                        delay(delayTime * 2);
                        setLed((li + 1) % LIGHT_COUNT, "#000000", 0, 0);
                        if (oth >= focal) {
                            setLed((li2 + 1) % LIGHT_COUNT, "#000000", 0, 0);
                        }
                        focalCheck(delayTime * 2);
                    }
                }
                for (int strobe = 0; strobe < sc2; strobe++) {
                    if (effectNumber != 11) return;
                    for (int i = 0; i < ls; i++) {
                        int li = j + i;
                        int li2 = oth + i;
                        setLed((li + 1) % LIGHT_COUNT, colors[li % COLOR_COUNT], whiteValues[li % COLOR_COUNT], brightnessValues[li % COLOR_COUNT]);
                        if (oth >= focal) {
                            setLed((li2 + 1) % LIGHT_COUNT, colors[li2 % COLOR_COUNT], whiteValues[li2 % COLOR_COUNT], brightnessValues[li2 % COLOR_COUNT]);
                        }
                        delay(delayTime * 2);
                        setLed((li + 1) % LIGHT_COUNT, "#000000", 0, 0);
                        if (oth >= focal) {
                            setLed((li2 + 1) % LIGHT_COUNT, "#000000", 0, 0);
                        }
                        delay(delayTime * 2);
                    }
                }
            oth--;
        }
    }
}
// 10 -> TraceOne
void Medusa() {
    if (focal == -1) 
    {
        for (int kc = 0; kc < LIGHT_COUNT; kc++) {
            for (int i = 0; i < LIGHT_COUNT; i++) {
                if (effectNumber != 10) return;
                setLed(i, colors[kc], whiteValues[kc], brightnessValues[kc]);
            }
            for (int i = 0; i < COLOR_COUNT; i++) {
                for (int j = 0; j < LIGHT_COUNT; j++) {
                    if (effectNumber != 10) return;
                    setLed(j, colors[(i + j) % COLOR_COUNT], whiteValues[(i + j) % COLOR_COUNT], brightnessValues[(i + j) % COLOR_COUNT]);
                    if ((i % 4 == 0) && (j % 4 == 0)) focalCheck(delayTime);
                    else delay(delayTime);
                    setLed(j, colors[(kc + j) % COLOR_COUNT], whiteValues[(kc + j) % COLOR_COUNT], brightnessValues[(kc + j) % COLOR_COUNT]);
                }
            }
        }
    }
    else {
        for (int kc = 0; kc < LIGHT_COUNT; kc++) {
            int g = 15;
            for (int i = 0; i < focal; i++) {
                if (effectNumber != 10) return;
                setLed(i, colors[kc], whiteValues[kc], brightnessValues[kc]);
                if (g >= focal) {
                    setLed(g, colors[kc], whiteValues[kc], brightnessValues[kc]);
                }
                g--;
            }
            for (int i = 0; i < COLOR_COUNT; i++) {
                int h = 15;
                for (int j = 0; j < focal; j++) {
                    if (effectNumber != 10) return;
                    setLed(j, colors[(i + j) % COLOR_COUNT], whiteValues[(i + j) % COLOR_COUNT], brightnessValues[(i + j) % COLOR_COUNT]);
                    if (h >= focal) {
                        setLed(h, colors[(i + j) % COLOR_COUNT], whiteValues[(i + j) % COLOR_COUNT], brightnessValues[(i + j) % COLOR_COUNT]);
                    }
                    focalCheck(delayTime);
                    setLed(j, colors[(kc + j) % COLOR_COUNT], whiteValues[(kc + j) % COLOR_COUNT], brightnessValues[(kc + j) % COLOR_COUNT]);
                    if (h >= focal) {
                        setLed(h, colors[(kc + j) % COLOR_COUNT], whiteValues[(kc + j) % COLOR_COUNT], brightnessValues[(kc + j) % COLOR_COUNT]);
                    }
                    h--;
                }
            }
        }
    } 
}
// 9 -> TraceMany
void LapisLazuli() {
    for (int i = 0; i < LIGHT_COUNT; i++) {
		setLed(i, colors[0], whiteValues[0], brightnessValues[0]);
    }
    if (focal == -1) {
        for (int i = 0; i < LIGHT_COUNT; i++) {
            focalCheck(0);
            for (int j = 0; j < LIGHT_COUNT / 2; j++) {
                if (effectNumber != 9) return;
                int colorIndex1 = ((i + 1) % (COLOR_COUNT / 2));
                int colorIndex2 = ((i + 2) % COLOR_COUNT);
                int offset = (i + j * 2) % LIGHT_COUNT;
				setLed(offset, colors[colorIndex1], whiteValues[colorIndex1], brightnessValues[colorIndex1]);
                delay(delayTime * 2);
                offset = (i + j * 2 + 8) % LIGHT_COUNT;
				setLed(offset, colors[colorIndex2], whiteValues[colorIndex2], brightnessValues[colorIndex2]);
                delay(delayTime * 2);
            }
        }
    }
    else {
        for (int i = 0; i < LIGHT_COUNT; i++) {
            focalCheck(0);
            int y = 15;
            for (int j = 0; j < focal; j++) {
                if (effectNumber != 9) return;
                int colorIndex1 = ((i + 1) % (COLOR_COUNT / 2));
                int colorIndex2 = ((i + 2) % COLOR_COUNT);
                int offset = (i + j * 2) % LIGHT_COUNT;
                int offset2 = (i + y * 2) % LIGHT_COUNT;
                setLed(offset, colors[colorIndex1], whiteValues[colorIndex1], brightnessValues[colorIndex1]);
                if (y >= focal) {
                    setLed(offset2, colors[colorIndex1], whiteValues[colorIndex1], brightnessValues[colorIndex1]);
                }
                delay(delayTime * 2);
                offset = (i + j * 2 + 8) % LIGHT_COUNT;
                offset2 = (i + y * 2 + 8) % LIGHT_COUNT;
                setLed(offset, colors[colorIndex2], whiteValues[colorIndex2], brightnessValues[colorIndex2]);
                if (y >= focal) {
                    setLed(offset2, colors[colorIndex2], whiteValues[colorIndex2], brightnessValues[colorIndex2]);
                }
                delay(delayTime * 2);
                y--;
            }
        }
    }
}
// 8 -> Techno
void BerghainBitte() {
	for (int i = 0; i < LIGHT_COUNT; i++) {
		setLed(i, "#000000", 0, 0);
	}
    if (focal == -1) {
        for (int i = 0; i < COLOR_COUNT; i++) {
            int m = (i + 1) % COLOR_COUNT;
            int n = (i + 2) % COLOR_COUNT;
            int o = (i + 3) % COLOR_COUNT;
            int p = (i + 4) % COLOR_COUNT;
            for (int j = 15; j >= 0; j--) {
                int k = (j + 1) % LIGHT_COUNT;
                int l = (j + 2) % LIGHT_COUNT;
                int y = (j + 3) % LIGHT_COUNT;
                int z = (j + 4) % LIGHT_COUNT;
                for (int x = 0; x < 2; x++) {
                    if (effectNumber != 8) return;
					setLed(j, colors[i], whiteValues[i], brightnessValues[i]);
                    delay(delayTime);
					setLed(j, "#000000", 0, 0);
					setLed(k, colors[m], whiteValues[m], brightnessValues[m]);
                    delay(delayTime);
					setLed(k, "#000000", 0, 0);
					setLed(l, colors[n], whiteValues[n], brightnessValues[n]);
                    delay(delayTime);
					setLed(l, "#000000", 0, 0);
					setLed(y, colors[o], whiteValues[o], brightnessValues[o]);
                    delay(delayTime);
					setLed(y, "#000000", 0, 0);
					setLed(z, colors[p], whiteValues[p], brightnessValues[p]);
                    focalCheck(delayTime);
					setLed(z, "#000000", 0, 0);
                }
            }
        }
        focalCheck(delayTime);
    }
    else {
        for (int i = 0; i < COLOR_COUNT; i++) {
            int m = (i + 1) % COLOR_COUNT;
            int n = (i + 2) % COLOR_COUNT;
            int o = (i + 3) % COLOR_COUNT;
            int p = (i + 4) % COLOR_COUNT;
            int zz = 0;
            for (int j = 15; j >= focal; j--) {
                int k = (j + 1) % LIGHT_COUNT;
                int k2 = (zz + 1) % LIGHT_COUNT;
                int l = (j + 2) % LIGHT_COUNT;
                int l2 = (zz + 2) % LIGHT_COUNT;
                int y = (j + 3) % LIGHT_COUNT;
                int y2 = (zz + 3) % LIGHT_COUNT;
                int z = (j + 4) % LIGHT_COUNT;
                int z2 = (zz + 4) % LIGHT_COUNT;
                for (int x = 0; x < 2; x++) {
                    if (effectNumber != 8) return;
                    setLed(j, colors[i], whiteValues[i], brightnessValues[i]);
                    if (zz < focal) {
                        setLed(zz, colors[i], whiteValues[i], brightnessValues[i]);
                    }
                    delay(delayTime);
                    setLed(j, "#000000", 0, 0);
                    if (zz < focal) {
                        setLed(zz, "#000000", 0, 0);
                    }
                    setLed(k, colors[m], whiteValues[m], brightnessValues[m]);
                    if (zz < focal) {
                        setLed(k2, colors[m], whiteValues[m], brightnessValues[m]);
                    }
                    delay(delayTime);
                    setLed(k, "#000000", 0, 0);
                    if (zz < focal) {
                        setLed(k2, "#000000", 0, 0);
                    }
                    setLed(l, colors[n], whiteValues[n], brightnessValues[n]);
                    if (zz < focal) {
                        setLed(l2, colors[n], whiteValues[n], brightnessValues[n]);
                    }
                    delay(delayTime);
                    setLed(l, "#000000", 0, 0);
                    if (zz < focal) {
                        setLed(l2, "#000000", 0, 0);
                    }
                    setLed(y, colors[o], whiteValues[o], brightnessValues[o]);
                    if (zz < focal) {
                        setLed(y2, colors[o], whiteValues[o], brightnessValues[o]);
                    }
                    delay(delayTime);
                    setLed(y, "#000000", 0, 0);
                    if (zz < focal) {
                        setLed(y2, "#000000", 0, 0);
                    }
                    setLed(z, colors[p], whiteValues[p], brightnessValues[p]);
                    if (zz < focal) {
                        setLed(z2, colors[p], whiteValues[p], brightnessValues[p]);
                    }
                    focalCheck(delayTime);
                    setLed(z, "#000000", 0, 0);
                    if (zz < focal) {
                        setLed(z2, "#000000", 0, 0);
                    }
                }
                zz++;
            }
        }
        focalCheck(delayTime);
    }
}
// 7 -> Strobe Change
void TheUnderground() {
    if (focal == -1) {
        for (int i = 0; i < COLOR_COUNT; i++) {
            delay(delayTime);
            for (int j = 0; j < LIGHT_COUNT / 2; j++) {
                int offset = (i + j * 2) % LIGHT_COUNT;
                if (effectNumber != 7) return;
                for (int k = 0; k < 2; k++) {
                    setLed(offset, "#000000", 0, 0);
                    setLed(offset, colors[i], whiteValues[i], brightnessValues[i]);
                }
            }
            focalCheck(0);
        }
    }
    else {
        for (int i = 0; i < COLOR_COUNT; i++) {
            int j2 = 15;
            delay(delayTime);
            for (int j = 0; j < focal; j++) {
                int offset = (i + j * 2) % LIGHT_COUNT;
                int offset2 = (i + j2 * 2) % LIGHT_COUNT;
                if (effectNumber != 7) return;
                for (int k = 0; k < 2; k++) {
                    setLed(offset, "#000000", 0, 0);
                    if (j2 >= focal) {
                        setLed(offset2, "#000000", 0, 0);
                    }
                    setLed(offset, colors[i], whiteValues[i], brightnessValues[i]);
					if (j2 >= focal) {
						setLed(offset2, colors[i], whiteValues[i], brightnessValues[i]);
					}
                }
                j2--;
            }
            focalCheck(0);
        }
    }
}
// 6 -> Still
void Still() {
    for (int i = 0; i < LIGHT_COUNT; i++) {
		setLed(i, colors[i], whiteValues[i], brightnessValues[i]);
        if (i % 8 == 0) focalCheck(delayTime);
    }
    delay(2000);
}
// 5 -> Progressive
void Cortez() {
    if (focal == -1) {
        for (int j = 0; j < COLOR_COUNT; j++) {
            for (int i = 0; i < LIGHT_COUNT; i++) {
                if (effectNumber != 5) return;
                int ledIndex = (j + i) % LIGHT_COUNT;
                int ledIndex2 = (j + i + 1) % LIGHT_COUNT;
                setLed(ledIndex, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                setLed(ledIndex2, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                delay(delayTime);
                ledIndex = (j + i + 1) % LIGHT_COUNT;
                ledIndex2 = (j + i + 2) % LIGHT_COUNT;
                setLed(ledIndex, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                setLed(ledIndex2, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                if ((j % 4 == 0) && (i % 4 == 0)) focalCheck(delayTime);
                else delay(delayTime);
            }
        }
    }
    else {
        for (int j = 0; j < COLOR_COUNT; j++) {
            int z = 15;
            for (int i = 0; i < focal; i++) {
                if (effectNumber != 5) return;
                int ledIndex = (j + i) % LIGHT_COUNT;
                int ledIndexz = (z + i) % LIGHT_COUNT;
                int ledIndex2 = (j + i + 1) % LIGHT_COUNT;
                int ledIndex2z = (z + i + 1) % LIGHT_COUNT;
                setLed(ledIndex, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                if (z >= focal) {
                   setLed(ledIndexz, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                }
                setLed(ledIndex2, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);                
                if (z >= focal) {
                    setLed(ledIndex2z, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                }
                delay(delayTime);
                ledIndex = (j + i + 1) % LIGHT_COUNT;
                ledIndexz = (z + i + 1) % LIGHT_COUNT;
                ledIndex2 = (j + i + 2) % LIGHT_COUNT;
                ledIndex2z = (z + i + 2) % LIGHT_COUNT;
                setLed(ledIndex, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                if (z >= focal) {
                    setLed(ledIndexz, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                }
                setLed(ledIndex2, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                if (z >= focal) {
                    setLed(ledIndex2z, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
                }
                if ((j % 4 == 0) && (i % 4 == 0)) focalCheck(delayTime);
                else delay(delayTime);
                z--;
            }
        }
    }
}
// 4 -> Mold
void Decay() {
    delayTime = delayTime / 4;
    for (int i = 0; i < LIGHT_COUNT; i++) {
        setLed(i, "#000000", 0, 0);
    }
    int strobeCount1 = 2;
    int strobeCount2 = 2;
    int ledsPerGroup = 12;
    if (focal == -1) {
        for (int startIdx = LIGHT_COUNT - 1; startIdx >= 0; startIdx--) {
            for (int strobe = 0; strobe < strobeCount1; strobe++) {
                if (effectNumber != 4) return;
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = startIdx + i;
                    int lightIndex = (ledIndex + 1) % LIGHT_COUNT;
                    int colorIndex = ledIndex % COLOR_COUNT;
                    setLed(lightIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    delay(delayTime);
                    setLed(colorIndex, "#000000", 0, 0);
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                }
            }
            for (int strobe = 0; strobe < strobeCount2; strobe++) {
                for (int i = 0; i < ledsPerGroup; i++) {
                    if (effectNumber != 4) return;
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int colorIndex = (ledIndex) % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    delay(delayTime);
                    setLed(ledIndex % LIGHT_COUNT, "#000000", 0, 0);
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                }
            }
        }
        for (int startIdx = 0; startIdx < LIGHT_COUNT; startIdx++) {
            for (int strobe = 0; strobe < strobeCount1; strobe++) {
                if (effectNumber != 4) return;
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int colorIndex = ledIndex % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    delay(delayTime);
                    setLed(colorIndex, "#000000", 0, 0);
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                }
            }
            for (int strobe = 0; strobe < strobeCount2; strobe++) {
                if (effectNumber != 4) return;
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int colorIndex = (ledIndex) % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    delay(delayTime);
                    setLed(ledIndex % LIGHT_COUNT, "#000000", 0, 0);
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                }
            }
        }
    }
    else {
        int startIdx2 = 0;
        for (int startIdx = LIGHT_COUNT - 1; startIdx >= focal; startIdx--) {
            for (int strobe = 0; strobe < strobeCount1; strobe++) {
                if (effectNumber != 4) return;
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    int colorIndex = ledIndex % COLOR_COUNT;
                    int colorIndex2 = ledIndex2 % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    if (startIdx2 < focal)
                    {
                        setLed(ledIndex2, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    }
                    delay(delayTime);
                    setLed(colorIndex, "#000000", 0, 0);
                    if (startIdx2 < focal) {
                        setLed(colorIndex2, "#000000", 0, 0);
                    }
                } // DONE
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                    if (startIdx2 < focal) {
                        setLed(ledIndex2, "#000000", 0, 0);
                    }
                } // DONE
            }
            for (int strobe = 0; strobe < strobeCount2; strobe++) {
                for (int i = 0; i < ledsPerGroup; i++) {
                    if (effectNumber != 4) return;
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    int colorIndex = (ledIndex) % COLOR_COUNT;
                    int colorIndex2 = (ledIndex2) % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    if (startIdx2 < focal) {
                        setLed(ledIndex2, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    }
                    focalCheck(delayTime);
                    setLed(ledIndex, "#000000", 0, 0);
                    if (startIdx2 < focal) {
                        setLed(ledIndex2, "#000000", 0, 0);
                    } // DONE
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                    if (startIdx2 < focal) {
                        setLed(ledIndex2, "#000000", 0, 0);
                    }
                }
            }
			startIdx2++;
        }
        startIdx2 = 15;
        for (int startIdx = 0; startIdx < focal; startIdx++) {
            for (int strobe = 0; strobe < strobeCount1; strobe++) {
                if (effectNumber != 4) return;
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    int colorIndex = ledIndex % COLOR_COUNT;
                    int colorIndex2 = ledIndex2 % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    if (startIdx2 >= focal) {
                        setLed(ledIndex2, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    }
                    delay(delayTime);
                    setLed(colorIndex, "#000000", 0, 0);
                    if (startIdx2 >= focal) {
                        setLed(colorIndex2, "#000000", 0, 0);
                    }
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                    if (startIdx2 >= focal) {
                        setLed(ledIndex2, "#000000", 0, 0);
                    }
                }
            }
            for (int strobe = 0; strobe < strobeCount2; strobe++) {
                if (effectNumber != 4) return;
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    int colorIndex = (ledIndex) % COLOR_COUNT;
                    int colorIndex2 = (ledIndex2) % COLOR_COUNT;
                    setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    if (startIdx2 >= focal) {
                        setLed(ledIndex2, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    }
                    focalCheck(delayTime);
                    setLed(colorIndex, "#000000", 0, 0);
                    if (startIdx2 >= focal) {
                        setLed(colorIndex2, "#000000", 0, 0);
                    }
                }
                for (int i = 0; i < ledsPerGroup; i++) {
                    int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                    int ledIndex2 = (startIdx2 + i + 1) % LIGHT_COUNT;
                    setLed(ledIndex, "#000000", 0, 0);
                    if (startIdx2 >= focal) {
                        setLed(ledIndex2, "#000000", 0, 0);
                    }
                }
            }
            startIdx2--;
        }
    }
}
// 3 -> Funky
// No Focal mode
void FeelTheFunk() {
    int strobeCount1 = 12;
    int strobeCount2 = 12;
    int ledsPerGroup = 4;
    delayTime = delayTime / 4;
    for(int colorer = 0; colorer < COLOR_COUNT; colorer++) {
        for (int strobe = 0; strobe < strobeCount1; strobe++) {
            delay(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++) {
                if (effectNumber != 3) return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
				int colorIndex = (ledIndex + colorer) % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                delay(delayTime);
            }
            focalCheck(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++) {
                if (effectNumber != 3) return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
                delay(delayTime);
            }
        }
        for (int strobe = 0; strobe < strobeCount2; strobe++) {
            focalCheck(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++) {
                if (effectNumber != 3) return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
				int colorIndex = (ledIndex + colorer) % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                delay(delayTime);
            }
            focalCheck(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++) {
                if (effectNumber != 3) return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
                delay(delayTime);
            }
        }
    }
    focalCheck(0);
}
// 2 -> Comfort Song
void ThePianoMan() {
	for (int i = 0; i < LIGHT_COUNT; i++) {
		setLed(i, "#000000", 0, 0);
	}
    int patternIndices[] = { 1, 2, 3, 2, 4, 3, 2, 1, 0, 1, 2, 1, 3, 2, 1, 0 };
    int patternIndices2[] = { 14, 13, 12, 13, 11, 12, 13, 14, 15, 14, 13, 14, 12, 13, 14, 15 };
    int pattern2Indices[] = { 7, 8, 9, 8, 10, 9, 8, 7, 6, 7, 8, 7, 9, 8, 7, 6 };
    int pattern2Indices2[] = { 8, 7, 6, 7, 5, 6, 7, 8, 9, 8, 7, 8, 6, 7, 8, 9 };
    int pattern3Indices[] = { 13, 14, 15, 14, 15, 14, 13, 12, 11, 12, 13, 14, 15, 14, 13, 12 };
    int pattern3Indices2[] = { 2, 1, 0, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3 };
    if (focal == -1) {
        for (int x = 0; x < COLOR_COUNT * 2; x++) {
            focalCheck(0);
            for (int i = 0; i < 2; i++) {
                if (effectNumber != 2) return;
                int index1 = patternIndices[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index2 = pattern2Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index3 = pattern3Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
                if (index1 < 0) index1 += LIGHT_COUNT;
                if (index2 < 0) index2 += LIGHT_COUNT;
                if (index3 < 0) index3 += LIGHT_COUNT;
				x = x % LIGHT_COUNT;
                setLed(index1, colors[x], whiteValues[x], brightnessValues[x]);
                delay(delayTime);
                setLed(index1, "#000000", 0, 0);
                setLed(index2, colors[x], whiteValues[x], brightnessValues[x]);
                delay(delayTime);
                setLed(index2, "#000000", 0, 0);
                setLed(index3, colors[x], whiteValues[x], brightnessValues[x]);
                focalCheck(delayTime);
                setLed(index3, "#000000", 0, 0);
            }
        }
    }
    else {
        for (int x = 0; x < COLOR_COUNT * 2; x++) {
            focalCheck(0);
            for (int i = 0; i < 2; i++) {
                if (effectNumber != 2) return;
                int index1 = patternIndices[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index12 = patternIndices2[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index2 = pattern2Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index22 = pattern2Indices2[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index3 = pattern3Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
                int index32 = pattern3Indices2[x % LIGHT_COUNT] % LIGHT_COUNT;
                if (index1 < 0) index1 += LIGHT_COUNT;
                if (index12 < 0) index12 += LIGHT_COUNT;
                if (index2 < 0) index2 += LIGHT_COUNT;
                if (index22 < 0) index22 += LIGHT_COUNT;
                if (index3 < 0) index3 += LIGHT_COUNT;
                if (index32 < 0) index32 += LIGHT_COUNT;
                x = x % LIGHT_COUNT;
                if (index1 < focal) {
                    setLed(index1, colors[x], whiteValues[x], brightnessValues[x]);
                }
                if (index12 >= focal) {
                    setLed(index12, colors[x], whiteValues[x], brightnessValues[x]);
                }
                delay(delayTime);
                if (index1 < focal) {
                    setLed(index1, "#000000", 0, 0);
                }
                if (index12 >= focal) {
                    setLed(index12, "#000000", 0, 0);
                }
                if (index2 < focal) {
                    setLed(index2, colors[x], whiteValues[x], brightnessValues[x]);
                }
                if (index22 >= focal) {
                    setLed(index22, colors[x], whiteValues[x], brightnessValues[x]);
                }
                delay(delayTime);
                if (index2 < focal) {
                    setLed(index2, "#000000", 0, 0);
                }
                if (index22 >= focal) {
                    setLed(index22, "#000000", 0, 0);
                }
                if (index3 < focal) {
                    setLed(index3, colors[x], whiteValues[x], brightnessValues[x]);
                }
                if (index32 >= focal) {
                    setLed(index32, colors[x], whiteValues[x], brightnessValues[x]);
                }
                focalCheck(delayTime);
                if (index3 < focal) {
                    setLed(index3, "#000000", 0, 0);
                }
                if (index32 >= focal) {
                    setLed(index32, "#000000", 0, 0);
                }
            }
        }
    }
}
// 1 -> Christmas
void Smolder() {
	delayTime = delayTime / 4;
    if (focal == -1) {
        for (int xy = 0; xy < COLOR_COUNT; xy++) {
            int f = 0;
            for (int j = 0; j < LIGHT_COUNT; j += 2) {
                if (effectNumber != 1) return;
                delay(delayTime / 16);
                setLed(j % LIGHT_COUNT, colors[xy], whiteValues[xy], brightnessValues[xy]);
                if (j == 8) {
                    f = (xy + 1) % COLOR_COUNT;
                    focalCheck(delayTime / 16);
                    setLed(j % LIGHT_COUNT, colors[f], whiteValues[f], brightnessValues[f]);
                }
                if (j == 12) {
                    f = (xy + 2) % COLOR_COUNT;
                    delay(delayTime / 16);
                    setLed(j % LIGHT_COUNT, colors[f], whiteValues[f], brightnessValues[f]);
                }
                f = (xy + 3) % COLOR_COUNT;
                int nextLed = (j + 1) % LIGHT_COUNT;
                delay(delayTime * 3);
                setLed(nextLed, colors[f], whiteValues[f], brightnessValues[f]);
            }
            for (int j = 1; j < LIGHT_COUNT; j += 2) {
                if (effectNumber != 1) return;
				focalCheck(delayTime * 3);
                setLed(j % LIGHT_COUNT, colors[xy], whiteValues[xy], brightnessValues[xy]);
                int f = (xy + 3) % COLOR_COUNT;
                int prevLed = (j - 1 + LIGHT_COUNT) % LIGHT_COUNT;
                setLed(prevLed, colors[f], whiteValues[f], brightnessValues[f]);
                delay(delayTime * 3);
            }
        }
    }
    else {
        for (int xy = 0; xy < COLOR_COUNT; xy++) {
            int f = 0;
            int j2 = 15;
            for (int j = 0; j < focal; j += 2) {
                j = j % LIGHT_COUNT;
				j2 = j2 % LIGHT_COUNT;
                if (effectNumber != 1) return;
                delay(delayTime / 16);
                setLed(j, colors[xy], whiteValues[xy], brightnessValues[xy]);
                if (j2 >= focal) {
                    setLed(j2, colors[xy], whiteValues[xy], brightnessValues[xy]);
                }
                if (j == 8) {
                    f = (xy + 1) % COLOR_COUNT;
                    focalCheck(delayTime / 16);
                    setLed(j, colors[f], whiteValues[f], brightnessValues[f]);
                    if (j2 >= focal) {
                        setLed(j2, colors[f], whiteValues[f], brightnessValues[f]);
                    }
                }
                if (j == 12) {
                    f = (xy + 2) % COLOR_COUNT;
                    delay(delayTime / 16);
                    setLed(j, colors[f], whiteValues[f], brightnessValues[f]);
                    if (j2 >= focal) {
                        setLed(j2, colors[f], whiteValues[f], brightnessValues[f]);
                    }
                }
                f = (xy + 3) % COLOR_COUNT;
                int nextLed = (j + 1) % LIGHT_COUNT;
                int nextLed2 = (j2 + 1) % LIGHT_COUNT;
                delay(delayTime * 3);
                setLed(nextLed, colors[f], whiteValues[f], brightnessValues[f]);
                if (j2 >= focal) {
                    setLed(nextLed2, colors[f], whiteValues[f], brightnessValues[f]);
                }
                j2--;
            }
            j2 = 15;
            for (int j = 0; j < focal; j += 2) {
				j = j % LIGHT_COUNT;
				j2 = j2 % LIGHT_COUNT;
                if (effectNumber != 1) return;
                focalCheck(delayTime * 3);
                setLed(j, colors[xy], whiteValues[xy], brightnessValues[xy]);
                if (j2 >= focal) {
                    setLed(j2, colors[xy], whiteValues[xy], brightnessValues[xy]);
                }
                int f = (xy + 3) % COLOR_COUNT;
                int prevLed = (j - 1 + LIGHT_COUNT) % LIGHT_COUNT;
                int prevLed2 = (j2 - 1 + LIGHT_COUNT) % LIGHT_COUNT;
                setLed(prevLed, colors[f], whiteValues[f], brightnessValues[f]);
                if (j2 >= focal) {
                    setLed(prevLed2, colors[f], whiteValues[f], brightnessValues[f]);
                }
                delay(delayTime * 3);
                j2--;
            }
        }
    }
}
// 0 -> Blender
void StuckInABlender() {
    unsigned long currentTime = millis(); // Randomization - Time since arduino began functioning.
	int colorOffset = (currentTime / 100) % COLOR_COUNT; // Turn into usable random Color Index.
    delayTime = delayTime / 4;
    if (focal == -1) {
        focalCheck(0);
		for (int i = 0; i < LIGHT_COUNT; i++) {
            if (effectNumber != 0) return;
            int colorIndex = (i + colorOffset) % COLOR_COUNT;
            delay(delayTime);
			setLed(i, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
		}
    }
    else {
        focalCheck(0);
        int ichlibedich = 15;
        for (int i = 0; i < focal; i++) {
            if (effectNumber != 0) return;
            int colorIndex = (i + colorOffset) % COLOR_COUNT;
            setLed(i, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
            if (ichlibedich >= focal) {
                setLed(ichlibedich, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
            }
            delay(delayTime);
            ichlibedich--;
        }
    }
}
void selectEffect(int effectNumber) {
    switch (effectNumber) {
    case 0: 
		StuckInABlender(); // BLENDER originally
        break;
    case 1: 
        Smolder(); // CHRISTMAS originally
		break;
    case 2:
        ThePianoMan(); // COMFORT SONG originally
		break;
    case 3: 
        FeelTheFunk(); // FUNKY originally
        break;
    case 4: 
        Decay(); // MOLD originally
		break;
    case 5:
        Cortez(); // PROGRESSIVE originally
		break;
	case 6:
        Still(); // STILL
		break;
	case 7:
        TheUnderground(); // STROBE CHANGE originally
		break;
	case 8:
        BerghainBitte(); // TECHNO originally
        break;
	case 9:
        LapisLazuli(); // TRACE MANY originally
        break;
    case 10:
        Medusa(); // TRACE ONE originally
        break;
    case 11:
        StateOfTrance(); // TRANCE originally
		break;
    default: 
        Still();
		break;
    }
}
void setLedChill(int L, String hex, int newW, int Brightness) {
	int R = (int)strtol(hex.substring(1, 3).c_str(), nullptr, 16);
	int G = (int)strtol(hex.substring(3, 5).c_str(), nullptr, 16);
	int B = (int)strtol(hex.substring(5, 7).c_str(), nullptr, 16);
    R = (R * Brightness) / 255;
    G = (G * Brightness) / 255;
    B = (B * Brightness) / 255;
    int W = (newW * Brightness) / 255;
    switch ((L + 1) % 3) {
    case 1:
        switch (L + 1) {
        case 1:
            leds[0].r = R;
            FastLED.show();
            leds[0].g = G;
            FastLED.show();
            leds[0].b = B;
            FastLED.show();
            leds[1].g = W;
            FastLED.show();
            break;
        case 4:
            leds[4].r = R;
            FastLED.show();
            leds[4].g = G;
            FastLED.show();
            leds[4].b = B;
            FastLED.show();
            leds[5].g = W;
            FastLED.show();
            break;
        case 7:
            leds[8].r = R;
            FastLED.show();
            leds[8].g = G;
            FastLED.show();
            leds[8].b = B;
            FastLED.show();
            leds[9].g = W;
            FastLED.show();
            break;
        case 10:
            leds[12].r = R;
            FastLED.show();
            leds[12].g = G;
            FastLED.show();
            leds[12].b = B;
            FastLED.show();
            leds[13].g = W;
            FastLED.show();
            break;
        case 13:
            leds[16].r = R;
            FastLED.show();
            leds[16].g = G;
            FastLED.show();
            leds[16].b = B;
            FastLED.show();
            leds[17].g = W;
            FastLED.show();
            break;
        case 16:
            leds[20].r = R;
            FastLED.show();
            leds[20].g = G;
            FastLED.show();
            leds[20].b = B;
            FastLED.show();
            leds[21].g = W;
            FastLED.show();
            break;
        }
        break;
    case 2:
        switch (L + 1) {
        case 2:
            leds[1].r = G;
            FastLED.show();
            leds[1].b = R;
            FastLED.show();
            leds[2].r = W;
            FastLED.show();
            leds[2].g = B;
            FastLED.show();
            break;
        case 5:
            leds[5].b = R;
            FastLED.show();
            leds[5].r = G;
            FastLED.show();
            leds[6].g = B;
            FastLED.show();
            leds[6].r = W;
            FastLED.show();
            break;
        case 8:
            leds[9].r = G;
            FastLED.show();
            leds[9].b = R;
            FastLED.show();
            leds[10].r = W;
            FastLED.show();
            leds[10].g = B;
            FastLED.show();
            break;
        case 11:
            leds[13].r = G;
            FastLED.show();
            leds[13].b = R;
            FastLED.show();
            leds[14].r = W;
            FastLED.show();
            leds[14].g = B;
            FastLED.show();
            break;
        case 14:
            leds[17].b = R;
            FastLED.show();
            leds[17].r = G;
            FastLED.show();
            leds[18].g = B;
            FastLED.show();
            leds[18].r = W;
            FastLED.show();
            break;
        }
        break;
    case 0:
        switch (L + 1) {
        case 3:
            leds[3].r = B;
            FastLED.show();
            leds[3].g = R;
            FastLED.show();
            leds[3].b = W;
            FastLED.show();
            leds[2].b = G;
            FastLED.show();
            break;
        case 6:
            leds[7].r = B;
            FastLED.show();
            leds[7].g = R;
            FastLED.show();
            leds[7].b = W;
            FastLED.show();
            leds[6].b = G;
            FastLED.show();
            break;
        case 9:
            leds[11].g = R;
            FastLED.show();
            leds[10].b = G;
            FastLED.show();
            leds[11].r = B;
            FastLED.show();
            leds[11].b = W;
            FastLED.show();
            break;
        case 12:
            leds[15].r = B;
            FastLED.show();
            leds[15].g = R;
            FastLED.show();
            leds[15].b = W;
            FastLED.show();
            leds[14].b = G;
            FastLED.show();
            break;
        case 15:
            leds[19].r = B;
            FastLED.show();
            leds[19].g = R;
            FastLED.show();
            leds[19].b = W;
            FastLED.show();
            leds[18].b = G;
            FastLED.show();
            break;
        }
        break;
    }
}
// LEGACY CODE: NEVER TOUCH EVER EVER EVER
void setLed(int L, String hex, int newW, int Brightness) {
    int newR = (int)strtol(hex.substring(1, 3).c_str(), nullptr, 16);
    int newG = (int)strtol(hex.substring(3, 5).c_str(), nullptr, 16);
    int newB = (int)strtol(hex.substring(5, 7).c_str(), nullptr, 16);
    int R = 0;
	int G = 0;
	int B = 0;
	int W = 0;
    for(int i = 0; i < 2; i ++) {
        R = 0;
        G = 0;
        B = 0;
        W = 0;
        switch ((L + 1) % 3) {
        case 1:
            switch (L + 1) {
            case 1:
                leds[0].r = R;
                FastLED.show();
                leds[0].g = G;
                FastLED.show();
                leds[0].b = B;
                FastLED.show();
                leds[1].g = W;
                FastLED.show();
                break;
            case 4:
                leds[4].r = R;
                FastLED.show();
                leds[4].g = G;
                FastLED.show();
                leds[4].b = B;
                FastLED.show();
                leds[5].g = W;
                FastLED.show();
                break;
            case 7:
                leds[8].r = R;
                FastLED.show();
                leds[8].g = G;
                FastLED.show();
                leds[8].b = B;
                FastLED.show();
                leds[9].g = W;
                FastLED.show();
                break;
            case 10:
                leds[12].r = R;
                FastLED.show();
                leds[12].g = G;
                FastLED.show();
                leds[12].b = B;
                FastLED.show();
                leds[13].g = W;
                FastLED.show();
                break;
            case 13:
                leds[16].r = R;
                FastLED.show();
                leds[16].g = G;
                FastLED.show();
                leds[16].b = B;
                FastLED.show();
                leds[17].g = W;
                FastLED.show();
                break;
            case 16:
                leds[20].r = R;
                FastLED.show();
                leds[20].g = G;
                FastLED.show();
                leds[20].b = B;
                FastLED.show();
                leds[21].g = W;
                FastLED.show();
                break;
            }
            break;
        case 2:
            switch (L + 1) {
            case 2:
                leds[1].r = G;
                FastLED.show();
                leds[1].b = R;
                FastLED.show();
                leds[2].r = W;
                FastLED.show();
                leds[2].g = B;
                FastLED.show();
                break;
            case 5:
                leds[5].b = R;
                FastLED.show();
                leds[5].r = G;
                FastLED.show();
                leds[6].g = B;
                FastLED.show();
                leds[6].r = W;
                FastLED.show();
                break;
            case 8:
                leds[9].r = G;
                FastLED.show();
                leds[9].b = R;
                FastLED.show();
                leds[10].r = W;
                FastLED.show();
                leds[10].g = B;
                FastLED.show();
                break;
            case 11:
                leds[13].r = G;
                FastLED.show();
                leds[13].b = R;
                FastLED.show();
                leds[14].r = W;
                FastLED.show();
                leds[14].g = B;
                FastLED.show();
                break;
            case 14:
                leds[17].b = R;
                FastLED.show();
                leds[17].r = G;
                FastLED.show();
                leds[18].g = B;
                FastLED.show();
                leds[18].r = W;
                FastLED.show();
                break;
            }
            break;
        case 0:
            switch (L + 1) {
            case 3:
                leds[3].r = B;
                FastLED.show();
                leds[3].g = R;
                FastLED.show();
                leds[3].b = W;
                FastLED.show();
                leds[2].b = G;
                FastLED.show();
                break;
            case 6:
                leds[7].r = B;
                FastLED.show();
                leds[7].g = R;
                FastLED.show();
                leds[7].b = W;
                FastLED.show();
                leds[6].b = G;
                FastLED.show();
                break;
            case 9:
                leds[11].g = R;
                FastLED.show();
                leds[10].b = G;
                FastLED.show();
                leds[11].r = B;
                FastLED.show();
                leds[11].b = W;
                FastLED.show();
                break;
            case 12:
                leds[15].r = B;
                FastLED.show();
                leds[15].g = R;
                FastLED.show();
                leds[15].b = W;
                FastLED.show();
                leds[14].b = G;
                FastLED.show();
                break;
            case 15:
                leds[19].r = B;
                FastLED.show();
                leds[19].g = R;
                FastLED.show();
                leds[19].b = W;
                FastLED.show();
                leds[18].b = G;
                FastLED.show();
                break;
            }
            break;
        }
        R = (newR * Brightness) / 255;
        G = (newG * Brightness) / 255;
        B = (newB * Brightness) / 255;
        W = (newW * Brightness) / 255;
        switch ((L + 1) % 3) {
            case 1:
                switch (L + 1) {
                    case 1:
                        leds[0].r = R;
                        FastLED.show();
                        leds[0].g = G;
                        FastLED.show();
                        leds[0].b = B;
                        FastLED.show();
                        leds[1].g = W;
                        FastLED.show();
                        break;
                    case 4:
                        leds[4].r = R;
                        FastLED.show();
                        leds[4].g = G;
                        FastLED.show();
                        leds[4].b = B;
                        FastLED.show();
                        leds[5].g = W;
                        FastLED.show();
                        break;
                    case 7:
                        leds[8].r = R;
                        FastLED.show();
                        leds[8].g = G;
                        FastLED.show();
                        leds[8].b = B;
                        FastLED.show();
                        leds[9].g = W;
                        FastLED.show();
                        break;
                    case 10:
                        leds[12].r = R;
                        FastLED.show();
                        leds[12].g = G;
                        FastLED.show();
                        leds[12].b = B;
                        FastLED.show();
                        leds[13].g = W;
                        FastLED.show();
                        break;
                    case 13:
                        leds[16].r = R;
                        FastLED.show();
                        leds[16].g = G;
                        FastLED.show();
                        leds[16].b = B;
                        FastLED.show();
                        leds[17].g = W;
                        FastLED.show();
                        break;
                    case 16:
                        leds[20].r = R;
                        FastLED.show();
                        leds[20].g = G;
                        FastLED.show();
                        leds[20].b = B;
                        FastLED.show();
                        leds[21].g = W;
                        FastLED.show();
                        break;
                    }
                    break;
            case 2:
                switch (L + 1) {
                case 2:
                    leds[1].r = G;
                    FastLED.show();
                    leds[1].b = R;
                    FastLED.show();
                    leds[2].r = W;
                    FastLED.show();
                    leds[2].g = B;
                    FastLED.show();
                    break;
                case 5:
                    leds[5].b = R;
                    FastLED.show();
                    leds[5].r = G;
                    FastLED.show();
                    leds[6].g = B;
                    FastLED.show();
                    leds[6].r = W;
                    FastLED.show();
                    break;
                case 8:
                    leds[9].r = G;
                    FastLED.show();
                    leds[9].b = R;
                    FastLED.show();
                    leds[10].r = W;
                    FastLED.show();
                    leds[10].g = B;
                    FastLED.show();
                    break;
                case 11:
                    leds[13].r = G;
                    FastLED.show();
                    leds[13].b = R;
                    FastLED.show();
                    leds[14].r = W;
                    FastLED.show();
                    leds[14].g = B;
                    FastLED.show();
                    break;
                case 14:
                    leds[17].b = R;
                    FastLED.show();
                    leds[17].r = G;
                    FastLED.show();
                    leds[18].g = B;
                    FastLED.show();
                    leds[18].r = W;
                    FastLED.show();
                    break;
                }