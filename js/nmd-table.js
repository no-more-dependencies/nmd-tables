const sortFunctions = {
	nativeCompare: function(a, b) {
		if(a == b)
			return 0;
		return (a > b)? 1 : -1;
	},
	string: function(a, b) {
		return this.native_compare(
			a.innerText.toLowerCase(), 
			b.innerText.toLowerCase()
		);
	},
	number: function(a, b) {
		return this.native_compare(
			Number(a.innerText.replace(/\D+/g, ""))*((a.innerText[0] == "-")? -1:1),
			Number(b.innerText.replace(/\D+/g, ""))*((a.innerText[0] == "-")? -1:1)
		);
	},
	collator: new Intl.Collator(undefined, {numeric: true, sensitivity: "base"}).compare
}

export default
class NmdTable extends HTMLTableElement {
	static get elementName() {
		return "nmd-table";
	}

	static getSortFunction(type){
		let f = sortFunctions[type];
		if(f)
			return f;
		return sortFunctions.collator;
	}
}