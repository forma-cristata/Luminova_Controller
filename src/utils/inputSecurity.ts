/**
 * Input security utilities for preventing script injection and malicious input
 * Following React Native best practices for text input validation
 */

/**
 * Sanitizes setting name input to prevent script injection and ensure safe storage
 * @param input - Raw input string from TextInput
 * @returns Sanitized string safe for storage and display
 */
export const sanitizeSettingName = (input: string): string => {
	if (!input || typeof input !== "string") {
		return "";
	}

	// Remove any script tags and HTML/XML tags
	let sanitized = input.replace(/<[^>]*>/g, "");

	// Remove JavaScript-related patterns
	sanitized = sanitized.replace(/javascript:/gi, "");
	sanitized = sanitized.replace(/on\w+\s*=/gi, ""); // Remove event handlers like onclick=
	sanitized = sanitized.replace(/eval\s*\(/gi, "");
	sanitized = sanitized.replace(/expression\s*\(/gi, "");

	// Remove SQL injection patterns
	sanitized = sanitized.replace(/['";]/g, "");
	sanitized = sanitized.replace(/--/g, "");
	sanitized = sanitized.replace(/\/\*/g, "");
	sanitized = sanitized.replace(/\*\//g, "");

	// Remove control characters and non-printable characters
	// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional removal of control chars
	sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

	// Allow only alphanumeric, spaces, hyphens, underscores, and basic punctuation
	sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_.,!?()[\]]/g, "");

	// Limit consecutive spaces and trim
	sanitized = sanitized.replace(/\s+/g, " ").trim();

	// Ensure reasonable length (already enforced by maxLength but double-check)
	if (sanitized.length > 20) {
		sanitized = sanitized.substring(0, 20);
	}

	return sanitized;
};

/**
 * Validates that the sanitized setting name meets business requirements
 * @param name - Sanitized setting name
 * @returns Object with validation result and error message
 */
export const validateSettingName = (
	name: string,
): {
	isValid: boolean;
	error: string | null;
} => {
	if (!name || name.trim().length === 0) {
		return { isValid: false, error: "Name cannot be empty" };
	}

	if (name.trim().length < 2) {
		return { isValid: false, error: "Name must be at least 2 characters" };
	}

	if (name.trim().length > 20) {
		return { isValid: false, error: "Name must be 20 characters or less" };
	}

	// Check for reserved/dangerous names
	const reservedNames = [
		"admin",
		"root",
		"system",
		"null",
		"undefined",
		"default",
	];
	if (reservedNames.includes(name.toLowerCase().trim())) {
		return { isValid: false, error: "Name not allowed" };
	}

	// Ensure it's not just spaces, hyphens, or underscores
	if (/^[\s\-_]+$/.test(name)) {
		return { isValid: false, error: "Name must contain letters or numbers" };
	}

	return { isValid: true, error: null };
};

/**
 * Real-time input filter for TextInput onChangeText
 * Prevents harmful characters from being typed
 * @param input - Raw input from onChangeText
 * @returns Filtered input safe for immediate display
 */
export const filterSettingNameInput = (input: string): string => {
	if (!input || typeof input !== "string") {
		return "";
	}

	// Remove dangerous characters immediately as user types
	let filtered = input.replace(/[<>'"`;{}()]/g, "");

	// Remove control characters
	// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional removal of control chars
	filtered = filtered.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

	// Limit to reasonable character set for setting names
	filtered = filtered.replace(/[^a-zA-Z0-9\s\-_.,!?[\]]/g, "");

	// Prevent excessive length during typing
	if (filtered.length > 20) {
		filtered = filtered.substring(0, 20);
	}

	return filtered;
};
