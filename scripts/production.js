#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Production script to increment Expo version number in app.json
 * Supports semantic versioning (major.minor.patch)
 * Usage: node scripts/production.js [increment-type]
 * increment-type: patch (default), minor, major
 */

class VersionManager {
	constructor() {
		this.appJsonPath = path.join(process.cwd(), 'app.json');
		this.appConfig = null;
	}

	loadAppConfig() {
		try {
			const content = fs.readFileSync(this.appJsonPath, 'utf8');
			this.appConfig = JSON.parse(content);
			return true;
		} catch (error) {
			console.error('❌ Failed to read app.json:', error.message);
			return false;
		}
	}

	saveAppConfig() {
		try {
			const content = JSON.stringify(this.appConfig, null, '\t');
			fs.writeFileSync(this.appJsonPath, content + '\n');
			return true;
		} catch (error) {
			console.error('❌ Failed to write app.json:', error.message);
			return false;
		}
	}

	parseVersion(versionString) {
		const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)$/);
		if (!match) {
			throw new Error(`Invalid version format: ${versionString}. Expected format: x.y.z`);
		}
		return {
			major: parseInt(match[1], 10),
			minor: parseInt(match[2], 10),
			patch: parseInt(match[3], 10),
		};
	}

	incrementVersion(incrementType = 'patch') {
		if (!this.appConfig?.expo?.version) {
			throw new Error('No version found in app.json expo configuration');
		}

		const currentVersion = this.appConfig.expo.version;
		console.log(`📦 Current version: ${currentVersion}`);

		const version = this.parseVersion(currentVersion);

		switch (incrementType.toLowerCase()) {
			case 'major':
				version.major += 1;
				version.minor = 0;
				version.patch = 0;
				break;
			case 'minor':
				version.minor += 1;
				version.patch = 0;
				break;
			case 'patch':
			default:
				version.patch += 1;
				break;
		}

		const newVersion = `${version.major}.${version.minor}.${version.patch}`;
		this.appConfig.expo.version = newVersion;

		console.log(`🚀 New version: ${newVersion} (${incrementType} increment)`);
		return newVersion;
	}

	run() {
		console.log('🔧 Luminova Production Version Manager');
		console.log('=====================================');

		// Load current configuration
		if (!this.loadAppConfig()) {
			process.exit(1);
		}

		// Get increment type from command line argument
		const incrementType = process.argv[2] || 'patch';
		const validTypes = ['patch', 'minor', 'major'];

		if (!validTypes.includes(incrementType.toLowerCase())) {
			console.error(`❌ Invalid increment type: ${incrementType}`);
			console.error(`Valid types: ${validTypes.join(', ')}`);
			process.exit(1);
		}

		try {
			// Increment version
			const newVersion = this.incrementVersion(incrementType);

			// Save updated configuration
			if (!this.saveAppConfig()) {
				process.exit(1);
			}

			console.log('✅ Version updated successfully!');
			console.log(`📱 App: ${this.appConfig.expo.name}`);
			console.log(`🔢 Version: ${newVersion}`);

			// Output for CI/CD systems
			if (process.env.GITHUB_ACTIONS) {
				console.log(`::set-output name=version::${newVersion}`);
			}
		} catch (error) {
			console.error('❌ Version increment failed:', error.message);
			process.exit(1);
		}
	}
}

// Execute if run directly
if (require.main === module) {
	const versionManager = new VersionManager();
	versionManager.run();
}

module.exports = VersionManager;
