//@ts-check

import DataSource from "./data-sources/data-source";
import Backend from "./helpers/backend";
import Paginator from "./paginators/paginator";
import TableRenderer from "./renderers/table-renderer";

export default
class NmdTable extends HTMLElement {
	static get elementName() {
		return "nmd-table";
	}

	constructor(){
		super();
		// @ts-ignore custom event type
		this.addEventListener("page-changed", this._pageChangedListener);
		this._backend = new Backend(new DataSource());
		this._cols = [];
		this._renderer = new TableRenderer(this._backend, this._cols);
		/** @type {HTMLElement?} */
		this._rendered = null;
	}

	get src(){
		let rawUrl = this.getAttribute("src");
		if(!rawUrl || rawUrl.trim() === "")
			return null;
		return new URL(rawUrl, window.location.toString());
	}

	get cols(){
		return this._cols;
	}

	get dataSource(){
		return this._backend.dataSource;
	}

	set dataSource(value){
		this._backend.dataSource = value;
	}

	async setPage(page){
		if(await this._backend.setPage(page))
			await this.render();
	}

	async render(){
		await this._backend.fetchData(true);
		this._setPaginatorsState(this._backend._page, this._backend.pageCount);
		if(this._rendered)
			this._rendered.parentElement?.removeChild(this._rendered);
		this._rendered = this._renderer.render();
		this._renderSlot.appendChild(this._rendered);
	}

	/**
	 * @param {import("./paginators/paginator").PageChangedEvent} event 
	 */
	_pageChangedListener(event){
		this.setPage(event.detail.page);
		event.stopPropagation();
	}

	_updateCols(){
		// Keep the same array instance so that references are kept
		while(this._cols.length > 0)
			this._cols.pop();
		for(let col of this.querySelectorAll("nmd-col"))
			this._cols.push(col);
	}

	_setPaginatorsState(page, pages){
		for(let paginator of [...document.querySelectorAll("nmd-basic-paginator, [nmd-paginator]")]){
			if(paginator instanceof Paginator){
				paginator.pages = pages;
				paginator.page = page;
			}
		}
	}

	get _renderSlot(){
		return this.querySelector("slot[name=table]") || this;
	}
}