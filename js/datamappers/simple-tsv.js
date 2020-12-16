export default class SimpleTsvDataMapper {
	getHandledContentTypes(){
		return ["text/plain", "text/tab-separated-values"];
	}

	async mapResponse(response, tbody) {
		let text = await response.text();

		let firstRow = tbody.getAttribute("data-first-row");

		let rows = text.split("\n");

		let headRow = null;
		if(["skip", "th", "thead"].includes(firstRow)) {
			headRow = rows.splice(0, 1); // Remove first row

			if(["th", "thead"].includes(firstRow))
				headRow = `<tr><th scope="col">` + headRow.replace("\t", `</th><th scope="col">`) + `</th></tr>`;
		}

		if(firstRow === "th")
			rows.splice(0, 0, headRow); // Insert as a first row
		
		if(firstRow === "thead")
			tbody.closest("table").tHead.innerHTML = headRow;

		for(let i = 0; i < rows.length; i++){
			tbody.addRow(rows[i].split("\t"));
		}
	}
}