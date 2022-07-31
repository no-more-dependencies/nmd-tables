//@ts-check
import HTMLParsedElement from "html-parsed-element";
import DataSource from "./data-sources/data-source";
import RestSource from "./data-sources/rest-source";
import Backend from "./helpers/backend";
import Paginator from "./paginators/paginator";
import TableRenderer from "./renderers/table-renderer";

export default
class NmdTable extends HTMLParsedElement {
	static get elementName() {
		return "nmd-table";
	}

	constructor(){
		super();
		// @ts-ignore custom event type
		this.addEventListener("page-changed", this._pageChangedListener);
		this._backend = new Backend(new DataSource(new URL("none:")));
		/** @type {import("./nmd-col.js").default[]} */
		this._cols = [];
		this._renderer = new TableRenderer(this._backend, this._cols);
		/** @type {HTMLElement?} */
		this._rendered = null;
	}

	parsedCallback(){
		this.initDataSource();
	}

	async initDataSource(){
		let urlNullable = this.src;
		if(!urlNullable)
			throw new Error("Missing source URL.");
		/** @type {URL} */
		let url = urlNullable;
		let dataSource = NmdTable.dataSourceRegistry.find(s => s.handlesProtocols.includes(url.protocol));
		if(!dataSource)
			throw new Error(`No registered data source handler for "${url.protocol}"`);
		this._backend = new Backend(new dataSource(url));
		this._renderer._backend = this._backend;
		await this.render();
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

	get page(){
		return this._backend.page;
	}

	get pages(){
		return this._backend.pageCount;
	}

	async setPage(page){
		if(await this._backend.setPage(page))
			await this.render();
	}

	async render(){
		await this._backend.fetchData(true);
		this.dispatchEvent(new CustomEvent("pages-changed"));
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

	get _renderSlot(){
		return this.querySelector("slot[name=table]") || this;
	}
}

/** @type {(typeof DataSource)[]} */
NmdTable.dataSourceRegistry = [RestSource];