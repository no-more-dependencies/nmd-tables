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
		this.fetchData();
	}

	get src() {
		return this.getAttribute("data-src");
	}

	set src(value) {
		this.setAttribute("data-src", value);
	}

	async nextPage(){
		if(!this.page)
			this.page = 0;
		this.page++;
	}

	async fetchData() {
		let res = await fetch(this.src);
		if(!res.ok)
			throw new Error(`Fetching data from "${this.src}" failed with status: ${res.statusText}.`);
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
			throw new Error(`Mapping data from "${this.src}" failed. No mapper found for content type "${type}".`);
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
		if(Array.isArray(row)){
			this.appendHtml("<tr><td>" + row.join("</td><td>") + "</td></tr>");
			return;
		}

		let colsInfo = this.colsInfo;
		if(colsInfo){
			let rowHtml = "";
			if(colsInfo){
				rowHtml += "<tr>";
				for(let colInfo of colsInfo){
					rowHtml += `<td>${row[colInfo.name]}</td>`;
				}
				rowHtml += "</tr>";
			}
			this.appendHtml(rowHtml);
		} else {
			this.appendHtml("<tr><td>" + Object.values(row).join("</td><td>") + "</td></tr>");
		}
	}

	render(){
		let colsInfo = this.colsInfo;
		for(let i = 0; i < data.lenth; i++){
			let row = rowData[i];
			if(Array.isArray(row)){
				this.appendHtml("<tr><td>" + row.join("</td><td>") + "</td></tr>");
				return;
			}
			
			if(colsInfo){
				let rowHtml = "";
				if(colsInfo){
					rowHtml += "<tr>";
					for(let colInfo of colsInfo){
						rowHtml += `<td>${row[colInfo.name]}</td>`;
					}
					rowHtml += "</tr>";
				}
				this.appendHtml(rowHtml);
			} else {
				this.appendHtml("<tr><td>" + Object.values(row).join("</td><td>") + "</td></tr>");
			}
		}
	}
}