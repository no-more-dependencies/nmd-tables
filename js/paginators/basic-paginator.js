//@ts-check

import Paginator from "./paginator";

export default class NmdBasicPaginator extends Paginator {
	static get elementName() {
		return "nmd-basic-paginator";
	}

	constructor(){
		super();
		this.buttonTmpl = (page, text, active, disabled) => 
			/*html*/`<button type="button" data-page="${page}"${disabled?" disabled":""}${active?' class="active"':""}>${text}</button>`;
		this.addEventListener("click", e => {
			if(!(e.target instanceof HTMLElement) || !e.target.hasAttribute("data-page"))
				return;
			let page = Number.parseInt(e.target.getAttribute("data-page") || "");
			this.page = page;
		});
	}

	get nextPrevButtons(){
		return this.hasAttribute("next-prev-buttons");
	}

	get range(){
		return Number.parseInt(this.getAttribute("pages-range") || "") || 3;
	}

	render(){
		let page = this.page;
		let pages = this.pages;
		let range = this.range;

		let html = [this.buttonTmpl(page, page + 1, true, false)];
		for(let i = 1; i <= range; i++){
			let before = page - i;
			let after = page + i;
			if(before >= 0)
				html.unshift(this.buttonTmpl(before, before + 1, false, false));
			if(after < pages)
				html.push(this.buttonTmpl(after, after + 1, false, false));
			if(before < 0 && after >= pages)
				break;
		}
		if(this.nextPrevButtons){
			html.unshift(this.buttonTmpl(page - 1, "Previous", false, page <= 0));
			html.push(this.buttonTmpl(page + 1, "Next", false, page >= pages - 1));
		}
		this.innerHTML = html.join("");
	}
}
