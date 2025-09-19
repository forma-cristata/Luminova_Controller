import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';

export default [
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['node_modules/**/*', '.expo/**/*', 'android/**/*', 'ios/**/*'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 2020,
				sourceType: 'module',
			},
			globals: {
				// Node.js globals
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				global: 'readonly',
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly',
				// Browser/React Native globals
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
				setInterval: 'readonly',
				clearInterval: 'readonly',
				requestAnimationFrame: 'readonly',
				cancelAnimationFrame: 'readonly',
				fetch: 'readonly',
				AbortController: 'readonly',
				RequestInit: 'readonly',
				NodeJS: 'readonly',
				__DEV__: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			react: react,
			'react-hooks': reactHooks,
			'react-native': reactNative,
		},
		rules: {
			// ESLint base rules
			'no-undef': 'error',
			'no-unused-vars': 'off', // Use TypeScript version instead
			'no-control-regex': 'off', // Allow control characters in regex for input validation

			// TypeScript rules
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-require-imports': 'off', // Allow require() in React Native

			// React rules
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',

			// React Native rules (warnings instead of errors for style preferences)
			'react-native/no-unused-styles': 'warn',
			'react-native/split-platform-components': 'error',
			'react-native/no-inline-styles': 'off', // Allow inline styles in React Native
			'react-native/no-color-literals': 'off', // Allow color literals

			// React Hooks rules
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	{
		files: ['**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off', // Allow require() in JS files
		},
	},
];
