#include <FastLED.h>
#include <WiFiS3.h>

#define NUM_LEDS 22
#define DATA_PIN 6
#define LIGHT_COUNT 16
#define COLOR_COUNT 16
#define BENCHMARK_ITERATIONS 1000

CRGB leds[NUM_LEDS];

// Benchmark variables
unsigned long startTime, endTime;
unsigned long totalTime;

void setup() {
    Serial.begin(9600);
    while (!Serial) { delay(100); }
    
    FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
    
    Serial.println("=== Arduino Animation Speed Benchmark ===");
    Serial.println("Starting benchmarks...");
    
    runBenchmarks();
}

void loop() {
    // Empty loop - benchmarks run once in setup
}

void runBenchmarks() {
    Serial.println("\n--- Basic Operations Benchmark ---");
    
    // 1. Basic arithmetic operations
    benchmarkArithmetic();
    
    // 2. Array operations
    benchmarkArrayOperations();
    
    // 3. String operations (hex color parsing)
    benchmarkStringOperations();
    
    // 4. LED setting operations
    benchmarkLEDOperations();
    
    // 5. Loop operations
    benchmarkLoopOperations();
    
    // 6. Delay timing accuracy
    benchmarkDelayAccuracy();
    
    // 7. Animation pattern samples
    benchmarkAnimationPatterns();
    
    Serial.println("\n=== Benchmark Complete ===");
}

void benchmarkArithmetic() {
    Serial.println("Testing arithmetic operations...");
    
    volatile int result = 0;
    startTime = micros();
    for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
        result = (i * 255) / 100;
        result = i % COLOR_COUNT;
        result = (i + 1) % LIGHT_COUNT;
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("Arithmetic ops (");
    Serial.print(BENCHMARK_ITERATIONS);
    Serial.print(" iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / BENCHMARK_ITERATIONS);
    Serial.println(" μs per operation");
}

void benchmarkArrayOperations() {
    Serial.println("Testing array operations...");
    
    int testArray[16];
    String colorArray[16];
    
    startTime = micros();
    for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
        // Fill array
        for (int j = 0; j < 16; j++) {
            testArray[j] = j * 10;
        }
        // Read array
        volatile int sum = 0;
        for (int j = 0; j < 16; j++) {
            sum += testArray[j];
        }
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("Array ops (");
    Serial.print(BENCHMARK_ITERATIONS);
    Serial.print(" iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / BENCHMARK_ITERATIONS);
    Serial.println(" μs per operation");
}

void benchmarkStringOperations() {
    Serial.println("Testing string operations (hex parsing)...");
    
    String testHex = "#ff0000";
    volatile int r, g, b;
    
    startTime = micros();
    for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
        r = (int)strtol(testHex.substring(1, 3).c_str(), nullptr, 16);
        g = (int)strtol(testHex.substring(3, 5).c_str(), nullptr, 16);
        b = (int)strtol(testHex.substring(5, 7).c_str(), nullptr, 16);
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("String/hex ops (");
    Serial.print(BENCHMARK_ITERATIONS);
    Serial.print(" iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / BENCHMARK_ITERATIONS);
    Serial.println(" μs per operation");
}

void benchmarkLEDOperations() {
    Serial.println("Testing LED operations...");
    
    startTime = micros();
    for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
        // Simulate setting all LEDs
        for (int j = 0; j < NUM_LEDS; j++) {
            leds[j].r = i % 255;
            leds[j].g = (i * 2) % 255;
            leds[j].b = (i * 3) % 255;
        }
        // Note: Not calling FastLED.show() to avoid actual LED updates
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("LED color setting (");
    Serial.print(BENCHMARK_ITERATIONS);
    Serial.print(" iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / BENCHMARK_ITERATIONS);
    Serial.println(" μs per operation");
    
    // Test FastLED.show() separately (fewer iterations)
    const int showIterations = 100;
    startTime = micros();
    for (int i = 0; i < showIterations; i++) {
        FastLED.show();
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("FastLED.show() (");
    Serial.print(showIterations);
    Serial.print(" iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / showIterations);
    Serial.println(" μs per operation");
}

void benchmarkLoopOperations() {
    Serial.println("Testing loop operations...");
    
    volatile int counter = 0;
    
    startTime = micros();
    for (int i = 0; i < BENCHMARK_ITERATIONS; i++) {
        // Simulate nested loops like in animations
        for (int j = 0; j < LIGHT_COUNT; j++) {
            for (int k = 0; k < COLOR_COUNT; k++) {
                counter = (j + k + i) % 255;
            }
        }
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("Nested loops (");
    Serial.print(BENCHMARK_ITERATIONS);
    Serial.print(" iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / BENCHMARK_ITERATIONS);
    Serial.println(" μs per operation");
}

void benchmarkDelayAccuracy() {
    Serial.println("Testing delay accuracy...");
    
    int delayValues[] = {1, 5, 10, 25, 50, 100};
    int numDelays = sizeof(delayValues) / sizeof(delayValues[0]);
    
    for (int i = 0; i < numDelays; i++) {
        int targetDelay = delayValues[i];
        const int iterations = 50;
        
        unsigned long totalActualDelay = 0;
        
        for (int j = 0; j < iterations; j++) {
            startTime = micros();
            delay(targetDelay);
            endTime = micros();
            totalActualDelay += (endTime - startTime);
        }
        
        float avgActualDelay = (float)totalActualDelay / iterations / 1000.0; // Convert to ms
        float accuracy = (avgActualDelay / targetDelay) * 100;
        
        Serial.print("delay(");
        Serial.print(targetDelay);
        Serial.print("): Target=");
        Serial.print(targetDelay);
        Serial.print("ms, Actual=");
        Serial.print(avgActualDelay);
        Serial.print("ms, Accuracy=");
        Serial.print(accuracy);
        Serial.println("%");
    }
}

void benchmarkAnimationPatterns() {
    Serial.println("Testing animation pattern samples...");
    
    // Test pattern similar to blender animation
    startTime = micros();
    for (int i = 0; i < 100; i++) {
        unsigned long currentTime = millis();
        int colorOffset = (currentTime / 100) % COLOR_COUNT;
        
        for (int j = 0; j < LIGHT_COUNT; j++) {
            int colorIndex = (j + colorOffset) % COLOR_COUNT;
            // Simulate LED setting without actual hardware call
            volatile int ledIndex = j;
            volatile int color = colorIndex;
        }
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("Blender-style pattern (100 iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / 100);
    Serial.println(" μs per iteration");
    
    // Test pattern similar to funky animation
    startTime = micros();
    for (int i = 0; i < 100; i++) {
        for (int j = 0; j < 4; j++) {
            int ledIndex = random(0, LIGHT_COUNT);
            int colorIndex = (ledIndex + i) % COLOR_COUNT;
            // Simulate LED setting
            volatile int led = ledIndex;
            volatile int color = colorIndex;
        }
    }
    endTime = micros();
    
    totalTime = endTime - startTime;
    Serial.print("Funky-style pattern (100 iterations): ");
    Serial.print(totalTime);
    Serial.print(" microseconds, ");
    Serial.print((float)totalTime / 100);
    Serial.println(" μs per iteration");
}
