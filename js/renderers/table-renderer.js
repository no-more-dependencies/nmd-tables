//@ts-check

import Renderer from "./renderer";

export default class TableRenderer extends Renderer {
	/**
	 * @param {import("../helpers/backend").default} backend 
	 * @param {import("../nmd-col").default[]} columns
	 */
	constructor(backend, columns){
		super(backend, columns);
	}

	render(){
		let data = this._backend.data;
		let html = ["<thead><tr>"];
		for(let col of this._columns){
			html.push(`<th>${col.title}</th>`);
		}
		html.push("</tr></thead>");
		html.push("<tbody>");
		for(let row of data){
			html.push("<tr>");
			for(let col of this._columns){
				html.push(`<td>${row[col.name]}</td>`);
			}
			html.push("</tr>");
		}
		html.push("</tbody>");
		let table = document.createElement("table");
		table.innerHTML = html.join("");
		return table;
	}
}