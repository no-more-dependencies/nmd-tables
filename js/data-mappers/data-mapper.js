//@ts-check

/** @typedef {import("../data-sources/data-source").TableData} TableData */

/** @interface */
export default
class DataMapper {
	/**
	 * 
	 * @param {string} _source 
	 * @returns {TableData}
	 */
	map(_source){
		return {data: [], size: 0};
	}
}