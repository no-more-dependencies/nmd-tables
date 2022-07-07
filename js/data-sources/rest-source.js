//@ts-check

import JsonObjectDataMapper from "../data-mappers/json-object-data-mapper.js";
import DataSource from "./data-source.js";
/** @typedef {import("./data-source").TableData} TableData */
/** @typedef {import("../data-mappers/data-mapper").default} IDataMapper */

export default
class RestSource extends DataSource {
	/**
	 * @returns {string[]} handled URL protocols by this source
	 */
	static get handlesProtocols(){
		return ["https:", "http:"];
	}

	/**
	 * 
	 * @param {URL} url 
	 * @param {IDataMapper} dataMapper 
	 */
	constructor(url, dataMapper = new JsonObjectDataMapper(), paramMapper = RestSource.defaultUrlParamMapper){
		super(url);
		this.dataMapper = dataMapper;
		this.paramMapper = paramMapper;
	}

	/**
	 * 
	 * @param {number} page 
	 * @param {number} pageSize 
	 * @returns {Promise<TableData>}
	 */
	async fetchData(page, pageSize){
		this.paramMapper(this.url, page, pageSize);
		let response = await fetch(this.url.toString());
		return this.dataMapper.map(await response.text());
	}
}

RestSource.defaultPageParamName = "page";
RestSource.defaultPageSizeParamName = "size";

/**
 * 
 * @param {URL} url 
 * @param {number} page 
 * @param {number} size 
 */
RestSource.defaultUrlParamMapper = function(url, page, size){
	url.searchParams.set(RestSource.defaultPageParamName, page.toString());
	url.searchParams.set(RestSource.defaultPageSizeParamName, size.toString());
}