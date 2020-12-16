export default
class NmdTd extends HTMLTableCellElement {
	constructor() {
		super();
		this.table = null;
	}

	connectedCallback() {
		this.table = this.closest("table");
	}

	disconnectedCallback() {
		this.table = null;
	}

	adoptedCallback() {
		this.table = this.closest("table");
	}

	get colIndex() {
		let index = 0;
		for(let cell of this.parentElement.cells){
			if(cell === this)
				return index;
			index += cell.colSpan;
		}
	}
}