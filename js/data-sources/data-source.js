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
	 * @param {number} _page 
	 * @param {number} _pageSize 
	 * @returns {Promise<TableData>} promise of [data, size]
	 */
	async fetchData(_page, _pageSize){
		return {data: [], size: 0};
	}
}