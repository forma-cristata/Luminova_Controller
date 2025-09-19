#include <FastLED.h>
#include <WiFiS3.h>
#include <ArduinoJson.h>
#define NUM_LEDS 22
#define DATA_PIN 6
#define SEED 42
#define LIGHT_COUNT 16
#define COLOR_COUNT 16
WiFiServer server(80);
const char ssid[] = "<insertWifi>";
const char pass[] = "<InsertPassword>";
CRGB leds[NUM_LEDS];
int startupFocal = -1;
bool startupShelfOn = true;
int startupdelayTime = 3;
int startupWhiteValues[] = {
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0};
int startupBrightnessValues[] = {
    255, 255, 255, 255,
    255, 255, 255, 255,
    255, 255, 255, 255,
    255, 255, 255, 255};
int startupEffectNumber = 6;
String startupColors[] = {
    "#ff0000", "#ff4400", "#ff6a00", "#ff9100",
    "#ffee00", "#00ff1e", "#00ff44", "#00ff95",
    "#00ffff", "#0088ff", "#0000ff", "#8800ff",
    "#ff00ff", "#ff00bb", "#ff0088", "#ff0044"};
int focal = -1;
bool shelfOn = false;
int delayTime = 0;
int whiteValues[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
int brightnessValues[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
int effectNumber = 0;
String colors[] = {"#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000",
                   "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"};
int status = WL_IDLE_STATUS;
void connectToWifi();
void handleWebServer();
void processJsonConfig(const String &jsonString);
void currentSettingPrint();
void ledSetup();
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
void setup()
{
    Serial.begin(9600);
    while (!Serial)
    {
        focalCheck(100.0);
    }
    connectToWifi();
    ledSetup();
}
void loop()
{
    currentSettingPrint();
    handleWebServer();
    if (shelfOn)
    {
        selectEffect(effectNumber);
    }
    else
    {
        for (int i = 0; i < LIGHT_COUNT; i++)
        {
            setLed(i, "#000000", 0, 0);
            FastLED.show();
        }
    }
}
void focalCheck(float delayTime)
{
    handleWebServer();
    delay(delayTime);
    // Magnetless version - focal always remains -1
}
// 11 -> Trance
void StateOfTrance()
{
    int sc1 = 2;
    int sc2 = 2;
    int ls = 4;
    // focal is always -1 in magnetless version
    for (int j = 0; j < LIGHT_COUNT; j++)
    {
        for (int k = 0; k < sc1; k++)
        {
            if (effectNumber != 11)
                return;
            for (int i = 0; i < ls; i++)
            {
                int li = j + i;
                setLed((li + 1) % LIGHT_COUNT, colors[li % COLOR_COUNT], whiteValues[li % COLOR_COUNT], brightnessValues[li % COLOR_COUNT]);
                    delay(delayTime * 4);
                setLed((li + 1) % LIGHT_COUNT, "#000000", 0, 0);
                    focalCheck(delayTime * 4);
            }
        }
        for (int strobe = 0; strobe < sc2; strobe++)
        {
            if (effectNumber != 11)
                return;
            for (int i = 0; i < ls; i++)
            {
                int li = j + i;
                setLed((li + 1) % LIGHT_COUNT, colors[li % COLOR_COUNT], whiteValues[li % COLOR_COUNT], brightnessValues[li % COLOR_COUNT]);
                    delay(delayTime * 4);
                setLed((li + 1) % LIGHT_COUNT, "#000000", 0, 0);
                    delay(delayTime * 4);
            }
        }
    }
}
// 10 -> TraceOne
void Medusa()
{
    // focal is always -1 in magnetless version
    for (int kc = 0; kc < LIGHT_COUNT; kc++)
    {
        for (int i = 0; i < LIGHT_COUNT; i++)
        {
            if (effectNumber != 10)
                return;
            setLed(i, colors[kc], whiteValues[kc], brightnessValues[kc]);
        }
        for (int i = 0; i < COLOR_COUNT; i++)
        {
            for (int j = 0; j < LIGHT_COUNT; j++)
            {
                if (effectNumber != 10)
                    return;
                setLed(j, colors[(i + j) % COLOR_COUNT], whiteValues[(i + j) % COLOR_COUNT], brightnessValues[(i + j) % COLOR_COUNT]);
                    if ((i % 4 == 0) && (j % 4 == 0))
                    focalCheck(delayTime * 2);
                else
                    delay(delayTime * 2);
                setLed(j, colors[(kc + j) % COLOR_COUNT], whiteValues[(kc + j) % COLOR_COUNT], brightnessValues[(kc + j) % COLOR_COUNT]);
                }
        }
    }
}
// 9 -> TraceMany
void LapisLazuli()
{
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        setLed(i, colors[0], whiteValues[0], brightnessValues[0]);
        FastLED.show();
    }
    // focal is always -1 in magnetless version
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        for (int j = 0; j < LIGHT_COUNT / 2; j++)
        {
            if (effectNumber != 9)
                return;
            int colorIndex1 = ((i + 1) % (COLOR_COUNT / 2));
            int colorIndex2 = ((i + 2) % COLOR_COUNT);
            int offset = (i + j * 2) % LIGHT_COUNT;
            setLed(offset, colors[colorIndex1], whiteValues[colorIndex1], brightnessValues[colorIndex1]);
            delay(delayTime * 2);
            offset = (i + j * 2 + 8) % LIGHT_COUNT;
            setLed(offset, colors[colorIndex2], whiteValues[colorIndex2], brightnessValues[colorIndex2]);
            focalCheck(delayTime * 2);
        }
    }
}
// 8 -> Techno
void BerghainBitte()
{
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        setLed(i, "#000000", 0, 0);
        FastLED.show();
    }
    // focal is always -1 in magnetless version
    for (int i = 0; i < COLOR_COUNT; i++)
    {
        int m = (i + 1) % COLOR_COUNT;
        int n = (i + 2) % COLOR_COUNT;
        int o = (i + 3) % COLOR_COUNT;
        int p = (i + 4) % COLOR_COUNT;
        for (int j = 15; j >= 0; j--)
        {
            int k = (j + 1) % LIGHT_COUNT;
            int l = (j + 2) % LIGHT_COUNT;
            int y = (j + 3) % LIGHT_COUNT;
            int z = (j + 4) % LIGHT_COUNT;
            for (int x = 0; x < 2; x++)
            {
                if (effectNumber != 8)
                    return;
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
    focalCheck(delayTime / 4);
}
// 7 -> Strobe Change
void TheUnderground()
{
    // focal is always -1 in magnetless version
    for (int i = 0; i < COLOR_COUNT; i++)
    {
        focalCheck(delayTime * 8);
        for (int j = 0; j < LIGHT_COUNT / 2; j++)
        {
            int offset = (i + j * 2) % LIGHT_COUNT;
            if (effectNumber != 7)
                return;
            for (int k = 0; k < 2; k++)
            {
                setLed(offset, "#000000", 0, 0);
                    setLed(offset, colors[i], whiteValues[i], brightnessValues[i]);
                }
        }
    }
}
// 6 -> Still
void Still()
{
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        setLed(i, colors[i], whiteValues[i], brightnessValues[i]);
        FastLED.show();
        if (i % 8 == 0)
            focalCheck(delayTime);
    }
}
// 5 -> Progressive
void Cortez()
{
    // focal is always -1 in magnetless version
    for (int j = 0; j < COLOR_COUNT; j++)
    {
        for (int i = 0; i < LIGHT_COUNT; i++)
        {
            if (effectNumber != 5)
                return;
            int ledIndex = (j + i) % LIGHT_COUNT;
            int ledIndex2 = (j + i + 1) % LIGHT_COUNT;
            setLed(ledIndex, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
            setLed(ledIndex2, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
            delay(delayTime * 2);
            ledIndex = (j + i + 1) % LIGHT_COUNT;
            ledIndex2 = (j + i + 2) % LIGHT_COUNT;
            setLed(ledIndex, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
            setLed(ledIndex2, colors[j % COLOR_COUNT], whiteValues[j % COLOR_COUNT], brightnessValues[j % COLOR_COUNT]);
            if ((j % 4 == 0) && (i % 4 == 0))
                focalCheck(delayTime * 2);
            else
                delay(delayTime * 2);
        }
    }
}
// 4 -> Mold
void Decay()
{
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        setLed(i, "#000000", 0, 0);
        FastLED.show();
    }
    int strobeCount1 = 2;
    int strobeCount2 = 2;
    int ledsPerGroup = 12;
    for (int startIdx = LIGHT_COUNT - 1; startIdx >= 0; startIdx--)
    {
        for (int strobe = 0; strobe < strobeCount1; strobe++)
        {
            if (effectNumber != 4)
                return;
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = startIdx + i;
                int lightIndex = (ledIndex + 1) % LIGHT_COUNT;
                int colorIndex = ledIndex % COLOR_COUNT;
                setLed(lightIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    focalCheck(delayTime / 2);
                setLed(colorIndex, "#000000", 0, 0);
                }
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
                }
        }
        for (int strobe = 0; strobe < strobeCount2; strobe++)
        {
            for (int i = 0; i < ledsPerGroup; i++)
            {
                if (effectNumber != 4)
                    return;
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                int colorIndex = (ledIndex) % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                delay(delayTime);
                setLed(ledIndex % LIGHT_COUNT, "#000000", 0, 0);
                }
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
            }
        }
    }
    for (int startIdx = 0; startIdx < LIGHT_COUNT; startIdx++)
    {
        for (int strobe = 0; strobe < strobeCount1; strobe++)
        {
            if (effectNumber != 4)
                return;
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                int colorIndex = ledIndex % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    focalCheck(delayTime / 2);
                setLed(colorIndex, "#000000", 0, 0);
            }
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
            }
        }
        for (int strobe = 0; strobe < strobeCount2; strobe++)
        {
            if (effectNumber != 4)
                return;
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                int colorIndex = (ledIndex) % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                    delay(delayTime / 2);
                setLed(ledIndex % LIGHT_COUNT, "#000000", 0, 0);
            }
            for (int i = 0; i < ledsPerGroup; i++)
            {
                int ledIndex = (startIdx + i + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
            }
        }
    }
  }
// 3 -> Funky
// No Focal mode
void FeelTheFunk()
{
    int strobeCount1 = 12;
    int strobeCount2 = 12;
    int ledsPerGroup = 4;
    for (int colorer = 0; colorer < COLOR_COUNT; colorer++)
    {
        for (int strobe = 0; strobe < strobeCount1; strobe++)
        {
            delay(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++)
            {
                if (effectNumber != 3)
                    return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
                int colorIndex = (ledIndex + colorer) % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                delay(delayTime);
            }
            focalCheck(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++)
            {
                if (effectNumber != 3)
                    return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
                delay(delayTime);
            }
        }
        for (int strobe = 0; strobe < strobeCount2; strobe++)
        {
            focalCheck(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++)
            {
                if (effectNumber != 3)
                    return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
                int colorIndex = (ledIndex + colorer) % COLOR_COUNT;
                setLed(ledIndex, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
                delay(delayTime);
            }
            focalCheck(delayTime * 12);
            for (int i = 0; i < ledsPerGroup; i++)
            {
                if (effectNumber != 3)
                    return;
                int ledIndex = (random(0, LIGHT_COUNT) + 1) % LIGHT_COUNT;
                setLed(ledIndex, "#000000", 0, 0);
                delay(delayTime);
            }
        }
    }
    focalCheck(0);
}
// 2 -> Comfort Song
void ThePianoMan()
{
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        setLed(i, "#000000", 0, 0);
        FastLED.show();
    }
    int patternIndices[] = {1, 2, 3, 2, 4, 3, 2, 1, 0, 1, 2, 1, 3, 2, 1, 0};
    int patternIndices2[] = {14, 13, 12, 13, 11, 12, 13, 14, 15, 14, 13, 14, 12, 13, 14, 15};
    int pattern2Indices[] = {7, 8, 9, 8, 10, 9, 8, 7, 6, 7, 8, 7, 9, 8, 7, 6};
    int pattern2Indices2[] = {8, 7, 6, 7, 5, 6, 7, 8, 9, 8, 7, 8, 6, 7, 8, 9};
    int pattern3Indices[] = {13, 14, 15, 14, 15, 14, 13, 12, 11, 12, 13, 14, 15, 14, 13, 12};
    int pattern3Indices2[] = {2, 1, 0, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3};
    for (int x = 0; x < COLOR_COUNT * 2; x++)
    {
        focalCheck(0);
        for (int i = 0; i < 2; i++)
        {
            if (effectNumber != 2)
                return;
            int index1 = patternIndices[x % LIGHT_COUNT] % LIGHT_COUNT;
            int index2 = pattern2Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
            int index3 = pattern3Indices[x % LIGHT_COUNT] % LIGHT_COUNT;
            if (index1 < 0)
                index1 += LIGHT_COUNT;
            if (index2 < 0)
                index2 += LIGHT_COUNT;
            if (index3 < 0)
                index3 += LIGHT_COUNT;
            x = x % LIGHT_COUNT;
            setLed(index1, colors[x], whiteValues[x], brightnessValues[x]);
            delay(delayTime * 8);
            setLed(index1, "#000000", 0, 0);
            setLed(index2, colors[x], whiteValues[x], brightnessValues[x]);
            delay(delayTime * 8);
            setLed(index2, "#000000", 0, 0);
            setLed(index3, colors[x], whiteValues[x], brightnessValues[x]);
            focalCheck(delayTime * 8);
            setLed(index3, "#000000", 0, 0);
        }
    }
}
// 1 -> Christmas
void Smolder()
{
    for (int xy = 0; xy < COLOR_COUNT; xy++)
    {
        int f = 0;
        for (int j = 0; j < LIGHT_COUNT; j += 2)
        {
            if (effectNumber != 1)
                return;
            delay(delayTime / 16);
            setLed(j % LIGHT_COUNT, colors[xy], whiteValues[xy], brightnessValues[xy]);
            if (j == 8)
            {
                f = (xy + 1) % COLOR_COUNT;
                focalCheck(delayTime / 16);
                setLed(j % LIGHT_COUNT, colors[f], whiteValues[f], brightnessValues[f]);
                }
            if (j == 12)
            {
                f = (xy + 2) % COLOR_COUNT;
                delay(delayTime / 16);
                setLed(j % LIGHT_COUNT, colors[f], whiteValues[f], brightnessValues[f]);
                }
            f = (xy + 3) % COLOR_COUNT;
            int nextLed = (j + 1) % LIGHT_COUNT;
            delay(delayTime * 3);
            setLed(nextLed, colors[f], whiteValues[f], brightnessValues[f]);
        }
        for (int j = 1; j < LIGHT_COUNT; j += 2)
        {
            if (effectNumber != 1)
                return;
            focalCheck(delayTime * 3);
            setLed(j % LIGHT_COUNT, colors[xy], whiteValues[xy], brightnessValues[xy]);
            int f = (xy + 3) % COLOR_COUNT;
            int prevLed = (j - 1 + LIGHT_COUNT) % LIGHT_COUNT;
            setLed(prevLed, colors[f], whiteValues[f], brightnessValues[f]);
            delay(delayTime * 3);
        }
    }
}
// 0 -> Blender
void StuckInABlender()
{
    unsigned long currentTime = millis();                // Randomization - Time since arduino began functioning.
    int colorOffset = (currentTime / 100) % COLOR_COUNT; // Turn into usable random Color Index.
    focalCheck(0);
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        if (effectNumber != 0)
            return;
        int colorIndex = (i + colorOffset) % COLOR_COUNT;
        delay(delayTime * 4);
        setLed(i, colors[colorIndex], whiteValues[colorIndex], brightnessValues[colorIndex]);
        FastLED.show();
    }
}
void selectEffect(int effectNumber)
{
    switch (effectNumber)
    {
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
// LEGACY CODE: NEVER TOUCH EVER EVER EVER
void setLed(int L, String hex, int newW, int Brightness)
{
    int newR = (int)strtol(hex.substring(1, 3).c_str(), nullptr, 16);
    int newG = (int)strtol(hex.substring(3, 5).c_str(), nullptr, 16);
    int newB = (int)strtol(hex.substring(5, 7).c_str(), nullptr, 16);
    int R = 0;
    int G = 0;
    int B = 0;
    int W = 0;
    for (int i = 0; i < 2; i++)
    {
        R = 0;
        G = 0;
        B = 0;
        W = 0;
        switch ((L + 1) % 3)
        {
        case 1:
            switch (L + 1)
            {
            case 1:
                leds[0].r = R;
                leds[0].g = G;
                leds[0].b = B;
                leds[1].g = W;
                break;
            case 4:
                leds[4].r = R;
                leds[4].g = G;
                leds[4].b = B;
                leds[5].g = W;
                break;
            case 7:
                leds[8].r = R;
                leds[8].g = G;
                leds[8].b = B;
                leds[9].g = W;
                break;
            case 10:
                leds[12].r = R;
                leds[12].g = G;
                leds[12].b = B;
                leds[13].g = W;
                break;
            case 13:
                leds[16].r = R;
                leds[16].g = G;
                leds[16].b = B;
                leds[17].g = W;
                break;
            case 16:
                leds[20].r = R;
                leds[20].g = G;
                leds[20].b = B;
                leds[21].g = W;
                break;
            }
            break;
        case 2:
            switch (L + 1)
            {
            case 2:
                leds[1].r = G;
                leds[1].b = R;
                leds[2].r = W;
                leds[2].g = B;
                break;
            case 5:
                leds[5].b = R;
                leds[5].r = G;
                leds[6].g = B;
                leds[6].r = W;
                break;
            case 8:
                leds[9].r = G;
                leds[9].b = R;
                leds[10].r = W;
                leds[10].g = B;
                break;
            case 11:
                leds[13].r = G;
                leds[13].b = R;
                leds[14].r = W;
                leds[14].g = B;
                break;
            case 14:
                leds[17].b = R;
                leds[17].r = G;
                leds[18].g = B;
                leds[18].r = W;
                break;
            }
            break;
        case 0:
            switch (L + 1)
            {
            case 3:
                leds[3].r = B;
                leds[3].g = R;
                leds[3].b = W;
                leds[2].b = G;
                break;
            case 6:
                leds[7].r = B;
                leds[7].g = R;
                leds[7].b = W;
                leds[6].b = G;
                break;
            case 9:
                leds[11].g = R;
                leds[10].b = G;
                leds[11].r = B;
                leds[11].b = W;
                break;
            case 12:
                leds[15].r = B;
                leds[15].g = R;
                leds[15].b = W;
                leds[14].b = G;
                break;
            case 15:
                leds[19].r = B;
                leds[19].g = R;
                leds[19].b = W;
                leds[18].b = G;
                break;
            }
            break;
        }
        R = (newR * Brightness) / 255;
        G = (newG * Brightness) / 255;
        B = (newB * Brightness) / 255;
        W = (newW * Brightness) / 255;
        switch ((L + 1) % 3)
        {
        case 1:
            switch (L + 1)
            {
            case 1:
                leds[0].r = R;
                leds[0].g = G;
                leds[0].b = B;
                leds[1].g = W;
                break;
            case 4:
                leds[4].r = R;
                leds[4].g = G;
                leds[4].b = B;
                leds[5].g = W;
                break;
            case 7:
                leds[8].r = R;
                leds[8].g = G;
                leds[8].b = B;
                leds[9].g = W;
                break;
            case 10:
                leds[12].r = R;
                leds[12].g = G;
                leds[12].b = B;
                leds[13].g = W;
                break;
            case 13:
                leds[16].r = R;
                leds[16].g = G;
                leds[16].b = B;
                leds[17].g = W;
                break;
            case 16:
                leds[20].r = R;
                leds[20].g = G;
                leds[20].b = B;
                leds[21].g = W;
                break;
            }
            break;
        case 2:
            switch (L + 1)
            {
            case 2:
                leds[1].r = G;
                leds[1].b = R;
                leds[2].r = W;
                leds[2].g = B;
                break;
            case 5:
                leds[5].b = R;
                leds[5].r = G;
                leds[6].g = B;
                leds[6].r = W;
                break;
            case 8:
                leds[9].r = G;
                leds[9].b = R;
                leds[10].r = W;
                leds[10].g = B;
                break;
            case 11:
                leds[13].r = G;
                leds[13].b = R;
                leds[14].r = W;
                leds[14].g = B;
                break;
            case 14:
                leds[17].b = R;
                leds[17].r = G;
                leds[18].g = B;
                leds[18].r = W;
                break;
            }
        case 0:
            switch (L + 1)
            {
            case 3:
                leds[3].r = B;
                leds[3].g = R;
                leds[3].b = W;
                leds[2].b = G;
                break;
            case 6:
                leds[7].r = B;
                leds[7].g = R;
                leds[7].b = W;
                leds[6].b = G;
                break;
            case 9:
                leds[11].g = R;
                leds[10].b = G;
                leds[11].r = B;
                leds[11].b = W;
                break;
            case 12:
                leds[15].r = B;
                leds[15].g = R;
                leds[15].b = W;
                leds[14].b = G;
                break;
            case 15:
                leds[19].r = B;
                leds[19].g = R;
                leds[19].b = W;
                leds[18].b = G;
                break;
            }
            break;
        }
    }
    FastLED.show();
}
void ledSetup()
{
    FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
    shelfOn = startupShelfOn;
    focal = startupFocal;
    delayTime = startupdelayTime;
    effectNumber = startupEffectNumber;
    for (int i = 0; i < LIGHT_COUNT; i++)
    {
        whiteValues[i] = startupWhiteValues[i];
        brightnessValues[i] = startupBrightnessValues[i];
        colors[i] = startupColors[i];
    }
}
// UNCOMMENT SERIAL.PRINTS IF YOU WISH TO DEBUG API ENDPOINTS BEING HIT
void currentSettingPrint()
{
    if (!shelfOn)
    {
        ////Serial.println("Shelf is OFF");
    }

    else
    {
        ////Serial.println("Focal Point: " + String(focal));
        ////Serial.println("EffectNumber: " + String(effectNumber));
        Serial.println("delayTime: " + String(delayTime));
        ////Serial.println("WhiteValues: ");
        for (int i = 0; i < LIGHT_COUNT; i++)
        {
            ////Serial.print(whiteValues[i]);
            ////Serial.print(" ");
        }

        ////Serial.println();
        ////Serial.println("BrightnessValues: ");
        for (int i = 0; i < LIGHT_COUNT; i++)
        {
            ////Serial.print(brightnessValues[i]);
            ////Serial.print(" ");
        }

        ////Serial.println();
        ////Serial.println("Colors: ");
        for (int i = 0; i < LIGHT_COUNT; i++)
        {
            ////Serial.print(colors[i]);
            ////Serial.print(" ");
        }

        ////Serial.println();
    }
}
// UNCOMMENT SERIAL.PRINTLNS IF YOU ARE HAVING ISSUES CONNECTING TO THE NETWORK
void handleWebServer()
{
    WiFiClient client = server.available();
    if (client)
    {
        ////Serial.println("New client connected");
        String currentLine = "";
        String requestHeader = "";
        String requestBody = "";
        bool isBody = false;
        int contentLength = 0;
        int bodyBytesRead = 0;
        unsigned long timeout = millis();
        while (client.connected() && millis() - timeout < 5000)
        {
            if (client.available())
            {
                timeout = millis();
                char c = client.read();
                requestHeader += c;
                if (c == '\n')
                {
                    if (currentLine.length() == 0)
                    {
                        isBody = true;
                        break;
                    }

                    else
                    {
                        currentLine = "";
                    }
                }

                else if (c != '\r')
                {
                    currentLine += c;
                }
            }
        }
        if (requestHeader.indexOf("Content-Length:") != -1)
        {
            int start = requestHeader.indexOf("Content-Length:") + 15;
            int end = requestHeader.indexOf("\r\n", start);
            String lengthStr = requestHeader.substring(start, end);
            lengthStr.trim();
            contentLength = lengthStr.toInt();
            ////Serial.print("Content-Length found: ");
            ////Serial.println(contentLength);
        }
        if (isBody && contentLength > 0)
        {
            // Serial.print("Reading body, expecting: ");
            // Serial.print(contentLength);
            ////Serial.println(" bytes");
            timeout = millis();
            requestBody = "";
            while (bodyBytesRead < contentLength && client.connected() &&
                   millis() - timeout < 10000)
            {
                if (client.available())
                {
                    timeout = millis();
                    char c = client.read();
                    requestBody += c;
                    bodyBytesRead++;
                    if (bodyBytesRead % 100 == 0 || bodyBytesRead == contentLength)
                    {
                        // Serial.print("Body bytes read: ");
                        // Serial.print(bodyBytesRead);
                        // Serial.print("/");
                        ////Serial.println(contentLength);
                    }
                }
            }
            ////Serial.println("Body received:");
            ////Serial.println(requestBody);
        }
        bool bodyComplete = (bodyBytesRead == contentLength);
        if (requestHeader.indexOf("POST /api/config") != -1)
        {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:application/json");
            client.println("Connection: close");
            client.println("Access-Control-Allow-Origin: *");
            client.println();
            if (bodyComplete && requestBody.length() > 0)
            {
                ////Serial.println("Processing JSON config...");
                processJsonConfig(requestBody);
                shelfOn = true;
                client.println("{\"status\":\"Configuration updated successfully\"}");
            }

            else
            {
                ////Serial.println("Incomplete body received!");
                // Serial.print("Expected: ");
                // Serial.print(contentLength);
                // Serial.print(" bytes, Got: ");
                // Serial.print(bodyBytesRead);
                ////Serial.println(" bytes");
                client.println("{\"error\":\"Incomplete data received\"}");
            }
            client.stop();
            return;
        }

        else if (requestHeader.indexOf("GET /api/status") != -1)
        {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:application/json");
            client.println("Connection: close");
            client.println("Access-Control-Allow-Origin: *");
            client.println();
            StaticJsonDocument<128> doc;
            doc["shelfOn"] = shelfOn;
            String jsonResponse;
            serializeJson(doc, jsonResponse);
            client.println(jsonResponse);
            client.stop();
            return;
        }
        else if (requestHeader.indexOf("GET /api/") != -1)
        {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:application/json");
            client.println("Connection: close");
            client.println("Access-Control-Allow-Origin: *");
            client.println();
            if (requestHeader.indexOf("GET /api/led/on") != -1)
            {
                client.println("{\"status\":\"LED ON\"}");
                ////Serial.println("LED ON command received");
                shelfOn = true;
                client.stop();
                return;
            }

            else if (requestHeader.indexOf("GET /api/led/off") != -1)
            {
                client.println("{\"status\":\"LED OFF\"}");
                ////Serial.println("LED OFF command received");
                shelfOn = false;
                client.stop();
                return;
            }

            else if (requestHeader.indexOf("GET /api/config") != -1)
            {
                shelfOn = true;
                StaticJsonDocument<1024> doc;
                doc["delayTime"] = delayTime;
                doc["effectNumber"] = effectNumber;
                JsonArray whiteArray = doc.createNestedArray("whiteValues");
                JsonArray brightnessArray = doc.createNestedArray("brightnessValues");
                JsonArray colorsArray = doc.createNestedArray("colors");
                for (int i = 0; i < LIGHT_COUNT; i++)
                {
                    whiteArray.add(whiteValues[i]);
                    brightnessArray.add(brightnessValues[i]);
                    colorsArray.add(colors[i]);
                }
                String jsonResponse;
                serializeJson(doc, jsonResponse);
                client.println(jsonResponse);
                client.stop();
                return;
            }

            else
            {
                client.println("{\"error\":\"Unknown command\"}");
            }
            client.stop();
            return;
        }

        else
        {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            client.print("Hello");
        }
        client.stop();
        ////Serial.println("Client disconnected");
    }
}
void processJsonConfig(const String &jsonString)
{
    StaticJsonDocument<1024> doc;
    DeserializationError error = deserializeJson(doc, jsonString);
    if (error)
    {
        // Serial.print("JSON parsing failed: ");
        ////Serial.println(error.c_str());
        return;
    }
    if (doc.containsKey("delayTime"))
    {
        delayTime = doc["delayTime"].as<int>();
    }
    if (doc.containsKey("effectNumber"))
    {
        if (effectNumber != doc["effectNumber"])
        {
            for (int i = 0; i < LIGHT_COUNT; i++)
            {
                setLed(i, "#000000", 0, 0);
            }
        }
        effectNumber = doc["effectNumber"];
    }
    if (doc.containsKey("whiteValues"))
    {
        JsonArray whiteArray = doc["whiteValues"].as<JsonArray>();
        int index = 0;
        for (JsonVariant value : whiteArray)
        {
            if (index < LIGHT_COUNT)
            {
                whiteValues[index++] = value.as<int>();
            }
        }
    }
    if (doc.containsKey("brightnessValues"))
    {
        JsonArray brightnessArray = doc["brightnessValues"].as<JsonArray>();
        int index = 0;
        for (JsonVariant value : brightnessArray)
        {
            if (index < LIGHT_COUNT)
            {
                brightnessValues[index++] = value.as<int>();
            }
        }
    }
    if (doc.containsKey("colors"))
    {
        JsonArray colorsArray = doc["colors"].as<JsonArray>();
        int index = 0;
        for (JsonVariant value : colorsArray)
        {
            if (index < LIGHT_COUNT)
            {
                colors[index++] = value.as<String>();
            }
        }
    }
}
void connectToWifi()
{
    while (status != WL_CONNECTED)
    {
        // Serial.print("Attempting to connect to SSID: ");
        ////Serial.println(ssid);
        status = WiFi.begin(ssid, pass);
        focalCheck(2000.0);
    }
    // Serial.print("IP Address: ");
    ////Serial.println(WiFi.localIP());
    server.begin();
}
