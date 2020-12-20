export default class JsonObjectDataMapper {
	getHandledContentTypes(){
		return ["application/json"];
	}

	async mapResponse(response, tbody) {
		let json = await response.json();

		this.processData(json, tbody);
	}

	processData(data, tbody){
		for(let obj of data)
			tbody.addRow(obj);
	}
}