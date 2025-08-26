#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
/**
 * Remove empty lines from a file without using regex
 * @param {string} filePath - Path to the file to process
 * @returns {boolean} - True if file was modified, false otherwise
 */
function removeEmptyLinesFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        // Smart filtering: preserve single empty lines in logical places
        const processedLines = [];
        let consecutiveEmptyLines = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isEmptyLine = isLineEmpty(line);

            if (isEmptyLine) {
                consecutiveEmptyLines++;

                // Keep single empty lines in strategic places
                if (consecutiveEmptyLines === 1 && shouldPreserveEmptyLine(lines, i, filePath)) {
                    processedLines.push(line);
                }
                // Skip multiple consecutive empty lines (only keep the first one if strategic)
            } else {
                consecutiveEmptyLines = 0;
                processedLines.push(line);
            }
        }

        // Only write if there were changes
        if (processedLines.length !== lines.length) {
            const newContent = processedLines.join('\n');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✓ Removed ${lines.length - processedLines.length} empty lines from: ${filePath}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Check if a line contains only whitespace
 * @param {string} line - Line to check
 * @returns {boolean} - True if line is empty or whitespace only
 */
function isLineEmpty(line) {
    for (let i = 0; i < line.length; i++) {
        if (line[i] !== ' ' && line[i] !== '\t' && line[i] !== '\r') {
            return false;
        }
    }
    return true;
}

/**
 * Determine if an empty line should be preserved for visual appeal
 * @param {Array<string>} lines - All lines in the file
 * @param {number} index - Index of the current empty line
 * @param {string} filePath - Path to the file being processed
 * @returns {boolean} - True if the empty line should be preserved
 */
function shouldPreserveEmptyLine(lines, index, filePath) {
    const prevLine = index > 0 ? lines[index - 1].trim() : '';
    const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';

    // Preserve empty lines after interface/type/class declarations
    if (prevLine.endsWith('}') &&
        (lines[index - 1].includes('interface ') || lines[index - 1].includes('type ') ||
            lines[index - 1].includes('class ') || isPreviousBlockInterface(lines, index - 1))) {
        return true;
    }

    // Preserve empty lines before function/class/interface declarations
    if (nextLine.includes('function ') || nextLine.includes('class ') ||
        nextLine.includes('interface ') || nextLine.includes('type ') ||
        nextLine.startsWith('export function') || nextLine.startsWith('export class') ||
        nextLine.startsWith('export default') || nextLine.startsWith('export ') ||
        nextLine.startsWith('const ') && nextLine.includes(' = ') ||
        nextLine.startsWith('export const') && nextLine.includes(' = ')) {
        return true;
    }

    // Preserve empty lines after opening braces (start of blocks)
    if (prevLine.endsWith('{')) {
        return true;
    }

    // Preserve empty lines before closing braces (end of blocks)  
    if (nextLine.startsWith('}')) {
        return true;
    }

    // Preserve empty lines after comments
    if (prevLine.startsWith('//') || prevLine.startsWith('/*') ||
        prevLine.startsWith('*') || prevLine.endsWith('*/')) {
        return true;
    }

    // Preserve empty lines before comments
    if (nextLine.startsWith('//') || nextLine.startsWith('/*')) {
        return true;
    }

    // Preserve empty lines around return statements for readability
    if (nextLine.startsWith('return ') || nextLine === 'return;') {
        return true;
    }

    // Preserve empty lines before control structures (if, for, while, etc.)
    const controlKeywords = ['if (', 'for (', 'while (', 'switch (', 'try {', 'else'];
    if (controlKeywords.some(keyword => nextLine.includes(keyword))) {
        return true;
    }

    // Preserve empty lines after control structure endings
    if (prevLine === '}' && (nextLine.includes('if (') || nextLine.includes('try {') ||
        nextLine.includes('for (') || nextLine.includes('while ('))) {
        return true;
    }

    // Preserve empty lines after catch/finally blocks
    if (prevLine.includes('} catch') || prevLine.includes('} finally') ||
        (prevLine === '}' && getPreviousNonEmptyLine(lines, index - 2).includes('catch'))) {
        return true;
    }

    // Preserve empty lines around variable declarations when they're logically separate
    if ((prevLine.includes('const ') || prevLine.includes('let ') || prevLine.includes('var ')) &&
        !(nextLine.includes('const ') || nextLine.includes('let ') || nextLine.includes('var '))) {
        return true;
    }

    // Preserve empty lines around import groups
    if (prevLine.includes('import ') && !nextLine.includes('import ')) {
        return true;
    }

    // For Arduino code (.ino files) - preserve around setup() and loop()
    if (filePath && filePath.endsWith('.ino')) {
        if (prevLine.includes('void setup()') || prevLine.includes('void loop()') ||
            nextLine.includes('void setup()') || nextLine.includes('void loop()')) {
            return true;
        }
    }

    // Default: don't preserve unless it matches above criteria
    return false;
}

/**
 * Helper function to check if a closing brace belongs to an interface/type/class
 * @param {Array<string>} lines - All lines in the file
 * @param {number} braceIndex - Index of the line with closing brace
 * @returns {boolean} - True if the brace closes an interface/type/class
 */
function isPreviousBlockInterface(lines, braceIndex) {
    // Look backwards to find the opening declaration
    let braceCount = 1;
    for (let i = braceIndex - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.includes('}')) braceCount++;
        if (line.includes('{')) {
            braceCount--;
            if (braceCount === 0) {
                // Found the opening brace, check if it's part of interface/type/class
                return line.includes('interface ') || line.includes('type ') ||
                    line.includes('class ') || line.includes('enum ');
            }
        }
    }
    return false;
}

/**
 * Helper function to get the previous non-empty line
 * @param {Array<string>} lines - All lines in the file
 * @param {number} startIndex - Index to start looking backwards from
 * @returns {string} - The previous non-empty line trimmed
 */
function getPreviousNonEmptyLine(lines, startIndex) {
    for (let i = startIndex; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.length > 0) {
            return line;
        }
    }
    return '';
}
/**
 * Recursively process all files in a directory
 * @param {string} dirPath - Directory path to process
 * @param {Array<string>} extensions - File extensions to process
 * @param {Array<string>} excludeDirs - Directories to exclude
 */
function processDirectory(dirPath, extensions, excludeDirs) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            // Skip excluded directories
            if (excludeDirs.includes(entry.name)) {
                console.log(`⏭ Skipping directory: ${fullPath}`);
                continue;
            }
            // Recursively process subdirectory
            processDirectory(fullPath, extensions, excludeDirs);
        } else if (entry.isFile()) {
            // Check if file has target extension
            const ext = path.extname(entry.name).toLowerCase();
            if (extensions.includes(ext)) {
                removeEmptyLinesFromFile(fullPath);
            }
        }
    }
}
/**
 * Main function to remove empty lines from codebase
 */
function main() {
    const rootDir = process.cwd();
    // File extensions to process
    const targetExtensions = [
        '.js', '.jsx', '.ts', '.tsx',
        '.json', '.md', '.txt',
        '.css', '.scss', '.less',
        '.html', '.xml', '.yml', '.yaml'
    ];
    // Directories to exclude
    const excludeDirectories = [
        'node_modules',
        '.git',
        '.expo',
        'dist',
        'build',
        'coverage',
        '.next',
        'android',
        'ios',
        'credentials'
    ];
    console.log('🧹 Starting empty line removal process...');
    console.log(`📁 Root directory: ${rootDir}`);
    console.log(`📄 Target extensions: ${targetExtensions.join(', ')}`);
    console.log(`🚫 Excluded directories: ${excludeDirectories.join(', ')}`);
    console.log('');
    const startTime = Date.now();
    let filesProcessed = 0;
    let filesModified = 0;
    // Override the removeEmptyLinesFromFile function to count files
    const originalRemoveEmptyLines = removeEmptyLinesFromFile;
    function countingRemoveEmptyLines(filePath) {
        filesProcessed++;
        const wasModified = originalRemoveEmptyLines(filePath);
        if (wasModified) {
            filesModified++;
        }
        return wasModified;
    }
    // Temporarily replace the function
    global.removeEmptyLinesFromFile = countingRemoveEmptyLines;
    try {
        processDirectory(rootDir, targetExtensions, excludeDirectories);
    } catch (error) {
        console.error('❌ Error during processing:', error.message);
        process.exit(1);
    }
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Files processed: ${filesProcessed}`);
    console.log(`   Files modified: ${filesModified}`);
    console.log(`   Duration: ${duration}s`);
    console.log('✅ Empty line removal complete!');
}
/**
 * Process a single file to remove empty lines
 * @param {string} filePath - Path to the specific file to process
 * @param {boolean} isDryRun - Whether to run in dry-run mode
 */
function processSingleFile(filePath, isDryRun = false) {
    console.log('🧹 Processing single file...');
    console.log(`📄 Target file: ${filePath}`);

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No files will be modified');
        const originalWriteFileSync = fs.writeFileSync;
        fs.writeFileSync = function (filePath, content, encoding) {
            console.log(`[DRY RUN] Would modify: ${filePath}`);
            return true;
        };
    }

    const startTime = Date.now();

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    // Check if it's actually a file
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        console.error(`❌ Path is not a file: ${filePath}`);
        process.exit(1);
    }
    console.log('');
    const wasModified = removeEmptyLinesFromFile(filePath);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('📊 Summary:');
    console.log(`   File processed: ${filePath}`);
    console.log(`   File modified: ${wasModified ? 'Yes' : 'No'}`);
    console.log(`   Duration: ${duration}s`);
    console.log(`✅ Single file processing complete!`);
}

// Handle command line arguments
if (require.main === module) {
    const args = process.argv.slice(2);

    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Usage: node removeEmptyLines.js [options] [file]
Options:
  --help, -h     Show this help message
  --dry-run      Show what would be changed without making changes
  --file <path>  Process only the specified file
Arguments:
  file           Path to a specific file to process (alternative to --file)
Description:
  Removes excessive empty lines from source code files while preserving single
  empty lines in logical places for visual appeal (around functions, classes,
  comments, control structures, etc.). Can process either a single file or all
  files in the current directory and subdirectories.
Examples:
  node removeEmptyLines.js                              # Remove empty lines from all files
  node removeEmptyLines.js --dry-run                    # Preview changes without modifying files
  node removeEmptyLines.js --file src/App.tsx          # Process only src/App.tsx
  node removeEmptyLines.js src/App.tsx                  # Process only src/App.tsx (shorthand)
  node removeEmptyLines.js --dry-run src/App.tsx       # Preview changes to src/App.tsx
`);
        process.exit(0);
    }

    // Check for dry-run flag
    const isDryRun = args.includes('--dry-run');

    // Check for specific file processing
    let targetFile = null;
    const fileIndex = args.indexOf('--file');
    if (fileIndex !== -1 && fileIndex + 1 < args.length) {
        targetFile = args[fileIndex + 1];
    } else {
        // Check for file path as last argument (if not a flag)
        const lastArg = args[args.length - 1];
        if (lastArg && !lastArg.startsWith('--') && lastArg !== '--dry-run') {
            targetFile = lastArg;
        }
    }

    if (targetFile) {
        // Convert relative path to absolute path
        targetFile = path.resolve(targetFile);
        processSingleFile(targetFile, isDryRun);
    } else {
        // Process all files in directory
        if (isDryRun) {
            console.log('🔍 DRY RUN MODE - No files will be modified');
            // Override write function for dry run
            const originalWriteFileSync = fs.writeFileSync;
            fs.writeFileSync = function (filePath, content, encoding) {
                console.log(`[DRY RUN] Would modify: ${filePath}`);
                return true;
            };
        }
        main();
    }
}
module.exports = {
    removeEmptyLinesFromFile,
    processDirectory,
    processSingleFile
};