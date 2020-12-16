export default class Paginator {
	constructor(){
		this.page = 1;
		this.pages = 1;
		this.itemsOnPage = Number.POSITIVE_INFINITY;
	}

	nextPage(){
		if(this.page < this.pages)
			this.page++;
	}

	prevPage(){
		if(this.page > 0)
			this.page--;
	}

	goToPage(p){
		if(0 <= p && p < this.pages)
			this.page = p;
	}
}