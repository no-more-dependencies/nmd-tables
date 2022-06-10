//@ts-check

import DataMapper from "./data-mapper.js";
/** @typedef {import("../data-sources/data-source").TableData} TableData */

export default
class JsonObjectDataMapper extends DataMapper {
	constructor(resultDataMapper = JsonObjectDataMapper.defaultResultDataMapper){
		super();
		this.resultDataMapper = resultDataMapper;
	}

	getHandledContentTypes(){
		return ["application/json"];
	}

	/**
	 * 
	 * @param {string} source 
	 */
	map(source) {
		let json = JSON.parse(source);
		return this.resultDataMapper(json);
	}
}

JsonObjectDataMapper.defaultResultDataPropertyNames = ["data", "content"];
JsonObjectDataMapper.defaultResultSizePropertyNames = ["size", "count"];

JsonObjectDataMapper.defaultResultDataMapper = function(json){
	let data = [];
	let size = Number.POSITIVE_INFINITY;
	if(json instanceof Array)
		data = json;
	else {
		for(let propertyName of JsonObjectDataMapper.defaultResultDataPropertyNames){
			if(json.hasOwnProperty(propertyName) && json[propertyName] instanceof Array){
				data = json[propertyName];
				break;
			}
		}
		for(let propertyName of JsonObjectDataMapper.defaultResultSizePropertyNames){
			if(json.hasOwnProperty(propertyName) && typeof json[propertyName] === "number"){
				size = json[propertyName];
				break;
			}
		}
	}
	return {data, size};
}