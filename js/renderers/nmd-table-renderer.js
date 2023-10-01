//@ts-check

import Renderer from "./renderer";

export default class NmdTableRenderer extends Renderer {
	static get elementName() {
		return "nmd-table-renderer";
	}

	render(){
		if(!this.target)
			return super.render();
		let backend = this.target._backend;
		let data = backend.data;
		let html = ["<thead><tr>"];
		for(let col of this.cols){
			html.push(`<th>${col.title}</th>`);
		}
		html.push("</tr></thead>");
		html.push("<tbody>");
		for(let row of data){
			html.push("<tr>");
			for(let col of this.cols){
				html.push(`<td>${col.format(row[col.name])}</td>`);
			}
			html.push("</tr>");
		}
		html.push("</tbody>");
		let table = document.createElement("table");
		table.innerHTML = html.join("");
		return table;
	}
}