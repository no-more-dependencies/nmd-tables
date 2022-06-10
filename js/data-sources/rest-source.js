//@ts-check

import JsonObjectDataMapper from "../data-mappers/json-object-data-mapper.js";
import DataSource from "./data-source.js";
/** @typedef {import("./data-source").TableData} TableData */
/** @typedef {import("../data-mappers/data-mapper").default} IDataMapper */

export default
class RestSource extends DataSource {
	/**
	 * 
	 * @param {string} url 
	 * @param {IDataMapper} dataMapper 
	 */
	constructor(url, dataMapper = new JsonObjectDataMapper(), paramMapper = RestSource.defaultUrlParamMapper){
		super();
		this.url = url;
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
		let url = new URL(this.url, window.location.toString());
		this.paramMapper(url, page, pageSize);
		let response = await fetch(url.toString());
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