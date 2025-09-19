// Remove empty lines from a specified file path if they are not preceded by the character "}"

const fs = require('fs');
const path = require('path');

function removeEmptyLines(filePath) {
	try {
		// Check if file exists
		if (!fs.existsSync(filePath)) {
			console.error(`Error: File "${filePath}" does not exist.`);
			process.exit(1);
		}

		// Read the file
		const fileContent = fs.readFileSync(filePath, 'utf8');
		const lines = fileContent.split('\n');

		const filteredLines = [];

		for (let i = 0; i < lines.length; i++) {
			const currentLine = lines[i];
			const isEmptyLine = currentLine.trim() === '';

			if (!isEmptyLine) {
				// Keep non-empty lines
				filteredLines.push(currentLine);
			} else {
				// Check if the previous line ends with "}"
				const previousLine = i > 0 ? lines[i - 1] : '';
				const previousLineEndsWithBrace = previousLine.trim().endsWith('}');

				if (previousLineEndsWithBrace) {
					// Keep empty line if it follows a closing brace
					filteredLines.push(currentLine);
				}
				// Otherwise, remove the empty line (don't add it to filteredLines)
			}
		}

		// Join the filtered lines back together
		const newContent = filteredLines.join('\n');

		// Write the modified content back to the file
		fs.writeFileSync(filePath, newContent, 'utf8');

		const removedCount = lines.length - filteredLines.length;
		console.log(`Successfully processed "${filePath}"`);
		console.log(`Removed ${removedCount} empty line(s)`);
		console.log(`Original lines: ${lines.length}, Final lines: ${filteredLines.length}`);
	} catch (error) {
		console.error(`Error processing file "${filePath}":`, error.message);
		process.exit(1);
	}
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
	console.error('Usage: node removeEmptyLines.js <file-path>');
	console.error('Example: node removeEmptyLines.js arduino/ARDUINO.ino');
	process.exit(1);
}

// Resolve the file path relative to the current working directory
const resolvedPath = path.resolve(filePath);

removeEmptyLines(resolvedPath);
