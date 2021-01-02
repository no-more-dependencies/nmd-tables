import NmdTableData from "./nmd-table-data";

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

	get pagesRange(){
		let pr = this.getAttribute("pages-range");
		if(pr)
			return Number(pr);
		return 3;
	}

	get nextPrevButtons(){
		return this.hasAttribute("next-prev-buttons");
	}

	buildPagination(){
		let tbody = this.tbodyElement;
		if(!Number.isFinite(tbody.pageSize) || !tbody){
			this.innerHTML = "";
			return;
		}
		let pgRange = this.pagesRange;
		let html = this.buttonTmpl(tbody.page, tbody.page + 1, true, false);
		for(let i = 1; i < pgRange; i++){
			let before = tbody.page - i;
			let after = tbody.page + i;
			if(before >= 0)
				html = this.buttonTmpl(before, before + 1, false, false) + html;
			if(after < tbody.totalPages)
				html += this.buttonTmpl(after, after + 1, false, false);
			if(before < 0 && after >= tbody.totalPages)
				break;
		}
		if(this.nextPrevButtons){
			html = this.buttonTmpl("prev", "Previous", false, tbody.page > 0) + html + this.buttonTmpl("next", "Next", false, tbody.page < tbody.totalPages - 1);
		}
		this.innerHTML = html;
	}
}

NmdPagination.buttonTmpl = (page, text, active, disabled) => 
	`<button type="button" data-page="${page}"${disabled?" disabled":""}${active?` class="active"`:""}>${text}</button>`;