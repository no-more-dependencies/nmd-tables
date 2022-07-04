//@ts-check

/** @interface */
export default class Renderer {
	/**
	 * @param {import("../helpers/backend").default} backend 
	 * @param {import("../nmd-col").default[]} columns
	 */
	constructor(backend, columns){
		this._backend = backend;
		this._columns = columns;
	}

	/**
	 * @returns {HTMLElement}
	 */
	render(){
		return document.createElement("div");
	}
}