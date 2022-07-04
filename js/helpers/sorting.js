//@ts-check

/**
 * @param {*} a 
 * @param {*} b 
 * @returns {1|0|-1}
 */
export function nativeCompare(a, b) {
	if(a == b)
		return 0;
	return (a > b)? 1 : -1;
}

/**
 * @param {string} a 
 * @param {string} b 
 * @returns {1|0|-1}
 */
export function caseInsensitiveStringCompare(a, b) {
	return nativeCompare(
		a.toLowerCase(), 
		b.toLowerCase()
	);
}

export const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"}).compare;