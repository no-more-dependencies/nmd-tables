//@ts-check

import NmdTable from "./nmd-table";

export default class NmdCol extends HTMLElement {
	static get elementName() {
		return "nmd-col";
	}

	constructor(){
		super();
	}

	connectedCallback(){
		let table = this.closest("nmd-table");
		if(table instanceof NmdTable)
			table._updateCols();
	}

	get name() {
		if(!this.hasAttribute("name")) throw new Error("Attribute 'name' is required");
		return this.getAttribute("name") || "";
	}

	set name(value) {
		this.setAttribute("name", value);
	}

	// Using title attribute that is already in HTMLElement
}