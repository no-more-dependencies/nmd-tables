import NmdTableData from "./nmd-table-data";

const buttonTmpl = (page, text) => `<button type="button" data-page="${page}">${text}</button>`;

export default
class NmdPagination extends HTMLElement {
	static get elementName() {
		return "nmd-pagination";
	}

	connectedCallback() {
		super.connectedCallback();

		this.buildPagination();
	}

	get tbodyElement(){
		let tbody = document.getElementById(this.getAttribute("for"));
		if(tbody instanceof NmdTableData)
			return tbody;
		for(let el of tbody.querySelectorAll("tbody")){
			if(el instanceof NmdTableData)
				return el;
		}
		return null;
	}

	buildPagination(){
		let tbody = this.tbodyElement;
		let html = "";
		html += buttonTmpl("prev", "Previous");
		if(Number.isFinite(tbody.pageSize))
			for(let i = 0; i < tbody.pageSize; i++)
				html += buttonTmpl(i, i);

		html += buttonTmpl("next", "Next");
	}
}