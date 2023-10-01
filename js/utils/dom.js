//@ts-check

/**
 * @typedef {{[key: string]: "string" | "number" | "boolean" | "symbol" | "object" | "function"}} DuckType
 */

/**
 * 
 * @param {{[key: string]: typeof HTMLElement & {elementName: string, elementOptions?: ElementDefinitionOptions}}} types 
 * @param {boolean} exposeGlobally 
 */
export function registerCustomElements(types, exposeGlobally = true){
	for(let name in types){
		customElements.define(types[name].elementName, types[name], types[name].elementOptions);
		if(exposeGlobally)
			globalThis[name] = types[name];
	}
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {Function | DuckType} classOrDuckType 
 * @returns {HTMLElement?}
 */
export function findAssociated(element, classOrDuckType){
	let forAttr = element.getAttribute("for");
	let targetAttr = element.getAttribute("target");
	let associateById = forAttr ? document.getElementById(forAttr) : null;
	let associateBySelector = targetAttr ? document.querySelector(targetAttr) : null;

	let isClass = typeof classOrDuckType === "function";

	let target = associateById ?? associateBySelector;

	//@ts-ignore dumb static analysis, if I copy the condition from isClass, it works
	if(target && (isClass && target instanceof classOrDuckType || !isClass && duckTypeTest(target, classOrDuckType)))
		// @ts-ignore
		return target;

	target = element;
	while(target){
		target = target.parentElement;
		//@ts-ignore dumb static analysis, if I copy the condition from isClass, it works
		if(isClass && target instanceof classOrDuckType || !isClass && duckTypeTest(target, classOrDuckType))
			//@ts-ignore
			return target;
	}
	return null;
}

/**
 * 
 * @param {Object} subject 
 * @param {DuckType} duckType 
 * @returns {boolean}
 */
export function duckTypeTest(subject, duckType){
	for(let key in duckType){
		if(typeof(subject[key]) !== duckType[key])
			return false;
	}
	return true;
}