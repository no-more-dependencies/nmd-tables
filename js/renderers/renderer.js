//@ts-check

import NmdCol from "../nmd-col";
import NmdTable from "../nmd-table";
import { findAssociated } from "../utils/dom";

/** @interface */
export default class Renderer extends HTMLElement {
	/** @type {NmdTable?} */
	target = null;

	/** @type {NmdCol[]} */
	cols = [];

	connectedCallback(){
		this._findTarget();
	}

	adoptedCallback(){
		this._findTarget();
	}

	_findTarget(){
		this.target = /** @type {NmdTable?} */(findAssociated(this, NmdTable));
		this.target?.addEventListener("visible-rows-changed", () => {
			for(let child of this.children)
				if(!(child instanceof NmdCol))
					child.remove();
			this.append(this.render());
		});
	}

	/**
	 * @returns {HTMLElement}
	 */
	render(){
		return document.createElement("div");
	}

	/**
	 * 
	 * @param {any} value 
	 * @param {NmdCol} col 
	 */
	renderCellValue(value, col){
		return col.format(value);
	}

	/**
	 * 
	 * @param {NmdCol} col 
	 */
	addCol(col){
		this.cols.push(col);
	}

	removeCol(col){
		let i = this.cols.indexOf(col);
		if(i >= 0)
			this.cols.splice(i, 1);
	}
}