import NmdTd from "./nmd-td";

export default
class NmdTdFilter extends NmdTd {
	static get elementName() {
		return "nmd-td-filter";
	}

	/**
	 * @returns {ElementDefinitionOptions}
	 */
	static get elementOptions(){
		return {
			extends: "td"
		};
	}

	get value() {
		return this.filterInput.value;
	}

	connectedCallback() {
		super.connectedCallback();
		this.filterInput = document.createElement("input");
		this.filterInput.type = "text";
		this.filterInput.size = 1;
		this.append(this.filterInput);

		this.filterInput.addEventListener("input", () => this.filterRows());
	}

	filterRows() {
		if(!this.table)
			return;
		var colIndex = this.colIndex;
		var rows = this.table.tBodies[0].rows;
		rowsLoop:
		for (let row of rows) {
			if(!row.__NmdTdFilter__filters)
				row.__NmdTdFilter__filters = {};
			row.__NmdTdFilter__filters[colIndex] = !this.value || row.cells[colIndex].innerText.includes(this.value);

			for (const filter in row.__NmdTdFilter__filters) {
				if(!row.__NmdTdFilter__filters[filter]) {
					row.hidden = true;
					continue rowsLoop;
				}
			}
			row.hidden = false;
		}
	}
}