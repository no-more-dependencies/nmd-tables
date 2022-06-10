//@ts-check

import DataMapper from "./data-mapper";

export default
class SeparatedValuesDataMapper extends DataMapper {
	constructor(namesInFirstRow = true, columnSeparator = "\t", rowSeparator = "\n"){
		super();
		this.namesInFirstRow = namesInFirstRow;
		this.columnSeparator = columnSeparator;
		this.rowSeparator = rowSeparator;
	}

	getHandledContentTypes(){
		return ["text/plain", "text/tab-separated-values"];
	}

	map(source) {
		let data = [];
		let names = [];
		let rows = source.split(this.rowSeparator);
		if(this.namesInFirstRow){
			names = rows.shift().split(this.columnSeparator);
		}
		for(let row of rows){
			let values = row.split(this.columnSeparator);
			let rowData = {};
			for(let i = 0; i < names.length; i++){
				rowData[names[i]] = values[i];
			}
			data.push(rowData);
		}
		return {data, size: data.length};
	}
}