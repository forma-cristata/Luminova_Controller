#!/usr/bin/env node

/**
 * Node.js runner for JavaScript Animation Speed Benchmark
 * Run with: node benchmark_runner.js
 */

const { performance } = require('perf_hooks');

// Make performance available globally for the benchmark script
global.performance = performance;

// Override setTimeout to use more precise timing if available
const originalSetTimeout = setTimeout;
global.setTimeout = (callback, delay) => {
    const start = performance.now();
    return originalSetTimeout(() => {
        const actualDelay = performance.now() - start;
        callback();
    }, delay);
};

// Load and run the benchmark
const benchmark = require('./javascript_benchmark.js');

console.log('Running JavaScript Animation Speed Benchmark in Node.js environment...');
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(`CPU: ${require('os').cpus()[0].model}`);
console.log('');

// Run the main benchmark
benchmark.runBenchmarks();

// Additional Node.js specific tests
console.log('\n--- Node.js Specific Tests ---');

// Test high-resolution timing
const hrStart = process.hrtime();
for (let i = 0; i < 1000; i++) {
    // Simple operation
    const result = i * 2;
}
const hrEnd = process.hrtime(hrStart);
const hrTime = hrEnd[0] * 1000 + hrEnd[1] / 1000000; // Convert to milliseconds

console.log(`High-resolution timing test (1000 ops): ${hrTime.toFixed(6)}ms`);

// Test memory usage
const memUsage = process.memoryUsage();
console.log(`Memory usage: RSS=${(memUsage.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);

console.log('\n=== Ready for Arduino comparison ===');
console.log('Please upload and run the arduino_benchmark.ino file on your Arduino,');
console.log('then paste the Serial Monitor output here for analysis.');
