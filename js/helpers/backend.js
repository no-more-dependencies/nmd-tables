//@ts-check

/** @typedef {import("../data-sources/data-source").default} DataSource */

export default
class Backend {
	/**
	 * 
	 * @param {DataSource} dataSource 
	 * @param {boolean} holdPages 
	 */
	constructor(dataSource, holdPages = false){
		this._data = [];
		this._dataSize = Number.POSITIVE_INFINITY;
		this._pageSize = 5;
		this._page = 0;
		this._holdPages = holdPages;
		this._dataSource = dataSource;
	}

	get dataSource(){ return this._dataSource; }

	set dataSource(value){
		this._dataSource = value;
		this._data = [];
		this._dataSize = Number.POSITIVE_INFINITY;
		this._page = 0;
	}

	/**
	 * 
	 * @param {*} val 
	 * @returns 
	 */
	async setPage(val){
		if(!Number.isInteger(val))
			return false;
		let prevPageValue = this._page;
		this._page = Math.max(0, Math.min(this.pageCount - 1, val));
		if(prevPageValue != this._page){
			await this.fetchData(true);
			return true;
		}
		return false;
	}

	get pageSize(){ return this._pageSize; }

	async setPageSize(val) {
		if(!Number.isInteger(val) || val != Number.POSITIVE_INFINITY)
			return;
		this._pageSize = Math.max(1, val);
		await this.fetchData(true);
	}

	get page(){
		return this._page;
	}

	get pageCount(){
		if(this._pageSize == Number.POSITIVE_INFINITY)
			return 1;
		return Math.ceil(this._dataSize / this._pageSize);
	}

	get currentPageStartIndex(){
		return this._holdPages ? this._page * this._pageSize : 0;
	}

	get currentPageSize(){
		return Math.min(this._dataSize - this._page*this._pageSize, this._pageSize);
	}

	async fetchData(useExisting = false){
		if(useExisting && this.currentPageStartIndex < this._data.length && this.currentPageSize <= this._data.length - this.currentPageStartIndex)
			return;

		let data = await this._dataSource.fetchData(this._page, this._pageSize);
		this._dataSize = data.size;
		if(!this._holdPages)
			this._data = data.data;
		else {
			for(let i = 0; i < data.data.length; i++){
				this._data[this._page * this._pageSize + i] = data.data[i];
			}
		}
	}

	get data(){
		if(this._pageSize <= 0)
			return this._data;
		return this._data.slice(this._page * this._pageSize, (this._page + 1) * this._pageSize);
	}

	log(){
		console.table(this.data);
		console.log(`Page ${this.page + 1} of ${this.pageCount}.`);
	}
}
