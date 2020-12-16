import NmdTable from "./nmd-table";
import NmdTd from "./nmd-td";

export default
class NmdTh extends NmdTd {
	static get elementName() {
		return "nmd-th";
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		this.registerListeners();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.table = null;
	}

	registerListeners() {
		if(this.sort != null)
			this.addEventListener("click", () => this.toggleSorting());
	}

	static get observedAttributes() {
		return ["data-sort", "data-type"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(newValue === oldValue)
			return;
		switch(name){
			case "data-sort":
				this.sortRows();
				break;
		}
	}

	set sort(value) {
		this.setAttribute("data-sort", value);
	}

	get sort(){
		return this.getAttribute("data-sort");
	}

	set type(value) {
		this.setAttribute("data-type", value);
	}

	get type(){
		return this.getAttribute("data-type");
	}

	get sortFunction() {
		return NmdTable.getSortFunction(this.type);
	}

	toggleSorting(){
		if(this.sort === "asc")
			this.sort = "desc";
		else
			this.sort = "asc";
	}

	resetSorting(){
		if(this.sort)
			this.sort = "";
	}

	sortRows(){
		if(!this.table)
			return;
		var colIndex = this.colIndex;
		var rows = this.table.tBodies[0].rows;
		var array = [];
		for(var i = 0; i < rows.length; i++)
			array[i] = rows[i];
			
		let sortFunction = this.sortFunction;
		if(this.sort === "asc")
			array.sort((a, b) => sortFunction(a.cells[colIndex].innerText, b.cells[colIndex].innerText));
		else 
			array.sort((a, b) => -sortFunction(a.cells[colIndex].innerText, b.cells[colIndex].innerText));

		for(let row of array)
			this.table.tBodies[0].append(row);

		// Remove sort attribute from other header cells
		for(let th of this.closest("table").querySelectorAll(`th[is=${this.elementName}]`)){
			if(th != this)
				th.resetSorting();
		}
	}
}