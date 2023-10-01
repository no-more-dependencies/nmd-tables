//@ts-check

import { findAssociated } from "../utils/dom";

/** @typedef {CustomEvent<{ page: number; }>} PageChangedEvent */

/** 
 * @typedef Paginable
 * @property {number} page
 * @property {number} pages
 */

export default class Paginator extends HTMLElement {
	constructor(){
		super();
		this.pagesChangedListener = e => {
			this.page = e.target.page;
			this.pages = e.target.pages;
			this.render();
		};
	}

	attributeChangedCallback(name, _oldValue, _newValue){
		switch(name){
			case "page":
			case "pages": // TODO: Page could change but also don't have to, I don't want to deal with it right now
				this._dispatchPageChanged();
				break;
		}
	}

	connectedCallback(){
		this._findTarget();
		this.render();
	}

	adoptedCallback(){
		this._findTarget();
		this.render();
	}

	_findTarget(){
		if(this.target)
			this.target.removeEventListener("pages-changed", this.pagesChangedListener);

		this.target = findAssociated(this, {page: "number", pages: "number"});

		// Register listener on new target
		if(this.target)
			this.target.addEventListener("pages-changed", this.pagesChangedListener);
	}

	_dispatchPageChanged(){
		this.dispatchEvent(new CustomEvent("page-changed", {
			detail: {
				page: this.page
			},
			bubbles: true
		}));
	}

	get page(){
		let value = Number(this.getAttribute("page"));
		if(!Number.isInteger(value) || value < 0 || value >= this.pages)
			return 0;
		return value;
	}

	set page(value){
		if(!Number.isInteger(value) || value < 0 || value >= this.pages || value == this.page)
			return;
		this.setAttribute("page", value.toString());
		this._dispatchPageChanged();
		this.render();
	}

	get pages(){
		let value = Number(this.getAttribute("pages"));
		if(!Number.isInteger(value) || value < 0)
			return 1;
		return value;
	}

	set pages(value){
		let currentPage = this.page;
		if(!Number.isInteger(value) || value < 0 || value == this.pages)
			return;
		this.setAttribute("pages", value.toString());
		if(currentPage != this.page){
			this._dispatchPageChanged();
		}
		this.render();
	}

	nextPage(){
		if(this.page < this.pages)
			this.page++;
	}

	prevPage(){
		if(this.page > 0)
			this.page--;
	}

	goToPage(p){
		if(0 <= p && p < this.pages)
			this.page = p;
	}

	render(){
		// Implement in subclasses
	}
}