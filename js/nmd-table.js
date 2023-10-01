//@ts-check
import HTMLParsedElement from "html-parsed-element";
import DataSource from "./data-sources/data-source";
import RestSource from "./data-sources/rest-source";
import Backend from "./helpers/backend";

/**
 * @typedef {"pages-changed" | "visible-rows-changed"} EventType
 */

/**
 * @typedef {Object} EventDetail
 * 
 */

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
	}

	parsedCallback(){
		this.initDataSource();
	}

	/**
	 * 
	 * @param {HTMLElement} component 
	 */
	registerComponent(component){
		this._components.push(component);
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
		this._dispatchEvent("visible-rows-changed");
		this.render();
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
			this._dispatchEvent("visible-rows-changed");
	}

	async render(){
		await this._backend.fetchData(true);
		this._dispatchEvent("pages-changed");
		this._dispatchEvent("visible-rows-changed");
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

	/**
	 * 
	 * @param {EventType} type 
	 * @param {EventDetail} detail 
	 */
	_dispatchEvent(type, detail = {}){
		let event = new CustomEvent(type, {detail});
		this.dispatchEvent(event);
	}

	get _renderSlot(){
		return this.querySelector("slot[name=table]") || this;
	}
}

/** @type {(typeof DataSource)[]} */
NmdTable.dataSourceRegistry = [RestSource];