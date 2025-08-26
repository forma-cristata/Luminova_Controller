/**
 * JavaScript Animation Speed Benchmark
 * Measures processing speeds for operations similar to those in AnimatedDots component
 */

const BENCHMARK_ITERATIONS = 1000;
const LIGHT_COUNT = 16;
const COLOR_COUNT = 16;

// Performance measurement utilities
function measureTime(fn, iterations = 1) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = performance.now();
    return end - start;
}

function runBenchmarks() {
    console.log("=== JavaScript Animation Speed Benchmark ===");
    console.log("Starting benchmarks...");

    // 1. Basic arithmetic operations
    benchmarkArithmetic();

    // 2. Array operations
    benchmarkArrayOperations();

    // 3. String operations (hex color parsing)
    benchmarkStringOperations();

    // 4. DOM/State operations (simulated)
    benchmarkStateOperations();

    // 5. Loop operations
    benchmarkLoopOperations();

    // 6. Timing accuracy (setTimeout/Promise)
    benchmarkTimingAccuracy();

    // 7. Animation pattern samples
    benchmarkAnimationPatterns();

    console.log("\n=== Benchmark Complete ===");
}

function benchmarkArithmetic() {
    console.log("\nTesting arithmetic operations...");

    const time = measureTime(() => {
        let result = 0;
        for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
            result = (i * 255) / 100;
            result = i % COLOR_COUNT;
            result = (i + 1) % LIGHT_COUNT;
        }
    });

    console.log(`Arithmetic ops (${BENCHMARK_ITERATIONS} iterations): ${time.toFixed(3)}ms, ${(time / BENCHMARK_ITERATIONS).toFixed(6)}ms per operation`);
}

function benchmarkArrayOperations() {
    console.log("\nTesting array operations...");

    const time = measureTime(() => {
        for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
            // Create and fill array (similar to dotColors state)
            const testArray = new Array(16).fill("#000000");

            // Modify array (similar to setDotColors)
            for (let j = 0; j < 16; j++) {
                testArray[j] = `#${(j * 16).toString(16).padStart(6, '0')}`;
            }

            // Read array
            let sum = 0;
            for (let j = 0; j < 16; j++) {
                sum += parseInt(testArray[j].substring(1), 16);
            }
        }
    });

    console.log(`Array ops (${BENCHMARK_ITERATIONS} iterations): ${time.toFixed(3)}ms, ${(time / BENCHMARK_ITERATIONS).toFixed(6)}ms per operation`);
}

function benchmarkStringOperations() {
    console.log("\nTesting string operations (hex parsing)...");

    const testHex = "#ff0000";
    const time = measureTime(() => {
        for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
            const r = parseInt(testHex.substring(1, 3), 16);
            const g = parseInt(testHex.substring(3, 5), 16);
            const b = parseInt(testHex.substring(5, 7), 16);
        }
    });

    console.log(`String/hex ops (${BENCHMARK_ITERATIONS} iterations): ${time.toFixed(3)}ms, ${(time / BENCHMARK_ITERATIONS).toFixed(6)}ms per operation`);
}

function benchmarkStateOperations() {
    console.log("\nTesting state operations (simulated React state)...");

    // Simulate React state updates
    let mockState = new Array(LIGHT_COUNT).fill("#000000");

    const time = measureTime(() => {
        for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
            // Simulate setDotColors operation
            const newColors = [...mockState];
            const index = i % LIGHT_COUNT;
            newColors[index] = `#${(i % 255).toString(16).padStart(6, '0')}`;
            mockState = newColors;
        }
    });

    console.log(`State ops (${BENCHMARK_ITERATIONS} iterations): ${time.toFixed(3)}ms, ${(time / BENCHMARK_ITERATIONS).toFixed(6)}ms per operation`);
}

function benchmarkLoopOperations() {
    console.log("\nTesting loop operations...");

    const time = measureTime(() => {
        for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
            // Simulate nested loops like in animations
            let counter = 0;
            for (let j = 0; j < LIGHT_COUNT; j++) {
                for (let k = 0; k < COLOR_COUNT; k++) {
                    counter = (j + k + i) % 255;
                }
            }
        }
    });

    console.log(`Nested loops (${BENCHMARK_ITERATIONS} iterations): ${time.toFixed(3)}ms, ${(time / BENCHMARK_ITERATIONS).toFixed(6)}ms per operation`);
}

async function benchmarkTimingAccuracy() {
    console.log("\nTesting timing accuracy...");

    const delayValues = [1, 5, 10, 25, 50, 100];

    for (const targetDelay of delayValues) {
        const iterations = 50;
        let totalActualDelay = 0;

        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await new Promise(resolve => setTimeout(resolve, targetDelay));
            const end = performance.now();
            totalActualDelay += (end - start);
        }

        const avgActualDelay = totalActualDelay / iterations;
        const accuracy = (avgActualDelay / targetDelay) * 100;

        console.log(`setTimeout(${targetDelay}): Target=${targetDelay}ms, Actual=${avgActualDelay.toFixed(2)}ms, Accuracy=${accuracy.toFixed(1)}%`);
    }
}

function benchmarkAnimationPatterns() {
    console.log("\nTesting animation pattern samples...");

    const colors = [
        "#ff0000", "#ff4400", "#ff6a00", "#ff9100",
        "#ffee00", "#00ff1e", "#00ff44", "#00ff95",
        "#00ffff", "#0088ff", "#0000ff", "#8800ff",
        "#ff00ff", "#ff00bb", "#ff0088", "#ff0044"
    ];

    // Test pattern similar to blender animation
    const blenderTime = measureTime(() => {
        for (let i = 0; i < 100; i++) {
            const currentTime = Date.now();
            const colorOffset = Math.floor(currentTime / 100) % COLOR_COUNT;

            for (let j = 0; j < LIGHT_COUNT; j++) {
                const colorIndex = (j + colorOffset) % COLOR_COUNT;
                // Simulate LED setting
                const color = colors[colorIndex];
            }
        }
    });

    console.log(`Blender-style pattern (100 iterations): ${blenderTime.toFixed(3)}ms, ${(blenderTime / 100).toFixed(6)}ms per iteration`);

    // Test pattern similar to funky animation
    const funkyTime = measureTime(() => {
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 4; j++) {
                const ledIndex = Math.floor(Math.random() * LIGHT_COUNT);
                const colorIndex = (ledIndex + i) % COLOR_COUNT;
                // Simulate LED setting
                const color = colors[colorIndex];
            }
        }
    });

    console.log(`Funky-style pattern (100 iterations): ${funkyTime.toFixed(3)}ms, ${(funkyTime / 100).toFixed(6)}ms per iteration`);

    // Test useCallback simulation
    const callbackTime = measureTime(() => {
        for (let i = 0; i < 1000; i++) {
            // Simulate useCallback overhead
            const callback = () => {
                const result = (i * 255) % COLOR_COUNT;
                return result;
            };
            callback();
        }
    });

    console.log(`useCallback simulation (1000 iterations): ${callbackTime.toFixed(3)}ms, ${(callbackTime / 1000).toFixed(6)}ms per iteration`);

    // Test Promise/async overhead
    Promise.resolve().then(async () => {
        const promiseTime = await new Promise(resolve => {
            const start = performance.now();
            let promiseCount = 0;

            const runPromises = async () => {
                for (let i = 0; i < 100; i++) {
                    await new Promise(res => setTimeout(res, 0));
                    promiseCount++;
                }
                const end = performance.now();
                resolve(end - start);
            };

            runPromises();
        });

        console.log(`Promise/async overhead (100 iterations): ${promiseTime.toFixed(3)}ms, ${(promiseTime / 100).toFixed(6)}ms per iteration`);
    });
}

// Function to compare with Arduino timing
function compareWithArduino(arduinoResults) {
    console.log("\n=== Arduino vs JavaScript Comparison ===");
    console.log("Paste the Arduino benchmark results here to see timing differences");
    console.log("Arduino results format expected:");
    console.log("Arithmetic ops (1000 iterations): X microseconds, Y μs per operation");
    // This will be used after getting Arduino results
}

// Export for Node.js if running in Node environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runBenchmarks,
        benchmarkArithmetic,
        benchmarkArrayOperations,
        benchmarkStringOperations,
        benchmarkStateOperations,
        benchmarkLoopOperations,
        benchmarkTimingAccuracy,
        benchmarkAnimationPatterns,
        compareWithArduino
    };
}

// Run benchmarks if running in browser or called directly
if (typeof window !== 'undefined' || (typeof require !== 'undefined' && require.main === module)) {
    runBenchmarks();
}
