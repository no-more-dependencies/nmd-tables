import JsonObjectDataMapper from "./json-object"

export default class SpringPageableDataMapper extends JsonObjectDataMapper {
	processData(data, tbody){
		super.processData(data.content);
	}
}