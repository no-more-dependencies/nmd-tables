export default class JsonObjectDataMapper {
	getHandledContentTypes(){
		return ["application/json"];
	}

	async mapResponse(response, tbody) {
		let json = await response.json();

		for(let obj of json.content)
			tbody.addRow(obj);
	}
}