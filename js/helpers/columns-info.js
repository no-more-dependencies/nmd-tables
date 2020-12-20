export default
class ColumnsInfo {
	constructor(){
		this.colsDataSourceInfo = {};
		this.columns = [];
	}

	setCol(index, info){
		let dsInfo = this.colsDataSourceInfo[info.name];
		if(dsInfo)
			info.__proto__ = dsInfo;
		this.columns[index] = info;
		console.log(this.columns);
	}

	setColDataSourceInfo(name, info){
		this.colsDataSourceInfo[name] = info;
		for(let col of this.columns){
			if(col.name === name)
				col.__proto__ = info;
		}
	}

	parseColsDomInfo(colgroup){
		if(!colgroup)
			return null;
		if(this.colgroupLastHtml == colgroup.innerHTML)
			return this.columns;

		this.colgroupLastHtml = colgroup.innerHTML;
		let domInfo = Array.from(colgroup.querySelectorAll("col")).map(
			(c) => {
				return {
					name: c.getAttribute("data-name"),
					title: c.title,
					span: c.span
				}
			}
		);
		console.log(domInfo);
		for(let i = 0; i < domInfo.length; i++){
			this.setCol(i, domInfo[i]);
		}

		return this.columns;
	}
}