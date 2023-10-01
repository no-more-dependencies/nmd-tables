//@ts-check

import { escapeHtml, localeDate, localeDateTime } from "./helpers/formatting";
import Renderer from "./renderers/renderer";
import { findAssociated } from "./utils/dom";

/**
 * @typedef DataType
 * @property {function(any): string} format
 * @property {function(any, any): Number} compare
 */

/** @type {Map<string, function(any): string>} */
const formatters = new Map();
formatters.set("string", v => escapeHtml(String(v)));
formatters.set("date", v => localeDate(new Date(v)));
formatters.set("datetime", v => localeDateTime(new Date(v)));

export default class NmdCol extends HTMLElement {
	static get elementName() {
		return "nmd-col";
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {function(any): string} formatter
	 */
	static registerFormatter(name, formatter){
		formatters.set(name, formatter);
	}

	connectedCallback(){
		this._addToRenderer();
	}

	adoptedCallback(){
		this._addToRenderer();
	}

	disconnectedCallback(){
		this._removeFromRenderer();
	}

	_addToRenderer(){
		this.renderer = /** @type {Renderer} */(findAssociated(this, Renderer));
		this.renderer?.addCol(this);
	}

	_removeFromRenderer(){
		this.renderer?.removeCol(this);
		this.renderer = null;
	}

	/**
	 * 
	 * @param {any} value 
	 * @returns {string}
	 */
	format(value){
		let formatter = formatters.get(this.formatter);
		if(formatter == null)
			return String(value);
		return formatter(value);
	}

	get name() {
		if(!this.hasAttribute("name")) throw new Error("Attribute 'name' is required");
		return this.getAttribute("name") || "";
	}

	set name(value) {
		this.setAttribute("name", value);
	}

	get formatter() {
		return this.getAttribute("formatter") || "string";
	}

	set formatter(value) {
		this.setAttribute("formatter", value);
	}

	// Using title attribute that is already in HTMLElement
}