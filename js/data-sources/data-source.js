//@ts-check

/**
 * @typedef {Object} TableData
 * @property {any[]} data
 * @property {number} size
 */

/** @interface */
export default
class DataSource {
	/**
	 * 
	 * @param {URL|string} url 
	 */
	constructor(url){
		if(typeof(url) === "string")
			//@ts-ignore There are few properties missing in Location, but it works.
			url = new URL(url, location);
		this.url = url;
	}

	/**
	 * @returns {string[]} handled URL protocols by this source
	 */
	static get handlesProtocols(){
		return [];
	}

	/**
	 * 
	 * @param {number} _page 
	 * @param {number} _pageSize 
	 * @param {import("../helpers/filtering").Filter[]} _filters
	 * @param {import("../helpers/sorting").Sort[]} _sorts
	 * @returns {Promise<TableData>} promise of [data, size]
	 */
	async fetchData(_page, _pageSize, _filters = [], _sorts = []){
		return {data: [], size: 0};
	}
}