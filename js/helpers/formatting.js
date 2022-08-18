//@ts-check

/**
 * Guess what, it's from here: https://stackoverflow.com/a/6234804/4284466 obviously.
 * @param {string} unsafe 
 * @returns 
 */
export function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function localeDate(date) {
	return date?.toLocaleDateString() || "";
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function localeDateTime(date) {
	return date?.toLocaleString() || "";
}