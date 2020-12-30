import ColumnsInfo from "./helpers/columns-info";

export default 
class NmdTableData extends HTMLTableSectionElement {
	static get elementName() {
		return "nmd-tbody";
	}

	static registerDataMapper(dataMapper){
		if(!NmdTableData.dataMappers)
			NmdTableData.dataMappers = {};
		let types = dataMapper.getHandledContentTypes();
		for(let type of types)
			NmdTableData.dataMappers[type] = dataMapper;
	}

	constructor(){
		super();
		this.columnsInfo = new ColumnsInfo();
		this.rowData = [];
		this.pageSize = Number.POSITIVE_INFINITY;
		this.totalPages = 1;
		this.page = 0;
	}

	observedAttributes() {
		return ["data-src"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(newValue === oldValue)
			return;
		switch(name){
			case "data-src":
				this.fetchData();
				break;
		}
	}
	
	connectedCallback() {
		this.render();
	}

	get src() {
		return this.getAttribute("data-src");
	}

	set src(value) {
		this.setAttribute("data-src", value);
	}

	get pageAttribute() {
		return this.getAttribute("data-page-attribute") || "page";
	}

	set pageAttribute(value) {
		this.setAttribute("data-page-attribute", value);
	}

	get pageSizeAttribute() {
		return this.getAttribute("data-page-size-attribute") || "size";
	}

	set pageSizeAttribute(value) {
		this.getAttribute("data-page-size-attribute", value);
	}

	get fullUrl(){
		let url = new URL(this.src);
		let search = new URLSearchParams(url.search);
		if(this.pageAttribute)
			search.set(this.pageAttribute, this.page);
		if(this.pageSizeAttribute && Number.isFinite(this.pageSize))
			search.set(this.pageSizeAttribute, this.pageSize);
		search = search.toString()
		if(search)
			url.search = "?" + search;
		return url.toString();
	}

	async nextPage(){
		if((this.page + 1) < this.totalPages){
			this.page++;
			await this.render();
		}
	}

	async prevPage(){
		if(this.page > 0){
			this.page--;
			await this.render();
		}
	}

	async goToPage(pageNum){
		if(pageNum >= 0 && pageNum < this.totalPages){
			this.page = pageNum;
			await this.render();
		}
	}

	async fetchData() {
		let url = this.fullUrl();
		let res = await fetch(url);
		if(!res.ok)
			throw new Error(`Fetching data from "${url}" failed with status: ${res.statusText}.`);
		let type = this.getAttribute("data-type");
		if(!type)
			type = res.headers.get("Content-Type");
		let typeParts = /([^\/]*\/[^\/;]*)(;.*)?/.exec(type);
		if(NmdTableData.dataMappers && NmdTableData.dataMappers[typeParts[1]]){
			this.beginAppending();
			let ret = NmdTableData.dataMappers[typeParts[1]].mapResponse(res, this);
			if(ret instanceof Promise)
				await ret;
			this.commitAppending();
		} else
			throw new Error(`Mapping data from "${url}" failed. No mapper found for content type "${type}".`);
	}

	beginAppending(){
		this.buffer = "";
	}

	commitAppending(){
		this.innerHTML = this.buffer;
		this.buffer = null;
	}

	appendHtml(html){
		if(this.buffer || this.buffer === "")
			this.buffer += html;
		else
			this.innerHTML += html;
	}

	clear(){
		this.innerHTML = "";
	}

	get colsInfo(){
		this.columnsInfo.parseColsDomInfo(this.closest("table").querySelector("colgroup"));
		return this.columnsInfo.columns;
	}

	addRow(row){
		this.rowData.push(row);
	}

	async render(){
		let colsInfo = this.colsInfo;
		if(!this.rowData[this.page*this.pageSize])
			await this.fetchData();
		for(let i = this.page*this.pageSize; i < this.pageSize; i++){
			if(i >= this.rowData.length)
				break;
			let row = this.rowData[i];
			if(Array.isArray(row)){
				this.appendHtml("<tr><td>" + row.join("</td><td>") + "</td></tr>");
				return;
			}
			
			if(colsInfo){
				let rowHtml = "<tr>";
				for(let colInfo of colsInfo){
					rowHtml += `<td>${row[colInfo.name]}</td>`;
				}
				rowHtml += "</tr>";
				this.appendHtml(rowHtml);
			} else {
				this.appendHtml("<tr><td>" + Object.values(row).join("</td><td>") + "</td></tr>");
			}
		}
	}
}