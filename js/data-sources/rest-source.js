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
	 * @param {URL|string} url 
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
	 * @param {import("../helpers/filtering").Filter[]} filters
	 * @param {import("../helpers/sorting").Sort[]} sorts
	 * @returns {Promise<TableData>}
	 */
	async fetchData(page, pageSize, filters = [], sorts = []){
		this.paramMapper(this.url, page, pageSize);
		let response = await fetch(this.url.toString());
		return this.dataMapper.map(await response.text());
	}
}

RestSource.defaultPageParamName = "page";
RestSource.defaultPageSizeParamName = "size";
RestSource.defaultFilterParamName = "filter";
RestSource.defaultSortParamName = "sort";

/**
 * 
 * @param {URL} url 
 * @param {number} page 
 * @param {number} size 
 * @param {import("../helpers/filtering").Filter[]} filters
 * @param {import("../helpers/sorting").Sort[]} sorts
 */
RestSource.defaultUrlParamMapper = function(url, page, size, filters = [], sorts = []){
	url.searchParams.set(RestSource.defaultPageParamName, page.toString());
	url.searchParams.set(RestSource.defaultPageSizeParamName, size.toString());
	if(filters.length > 0)
		url.searchParams.set(RestSource.defaultFilterParamName, JSON.stringify(filters));
	if(sorts.length > 0)
		url.searchParams.set(RestSource.defaultSortParamName, JSON.stringify(sorts));
}