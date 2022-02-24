import Utils from "./utils.js";

export default class Pages {

	constructor() {

		this.pagesElem = document.querySelector('body > .pages');

		if (window.location.hash) {

			var navToken = location.hash.substring(1);
			// speech synthesis is only allowed on user-interaction, 
			// so always go back to mentalArithmeticMenu if
			// page-reload was triggered on mentalArithmeticGame
			let currentPageId = this.getCurrentId();
			let pageElem = document.getElementById(currentPageId);
			if (pageElem.dataset.preventInitialDisplay != undefined && currentPageId == pageElem.id) {
				history.back();
			}
			else {
				this.show(navToken);
			}
		}

		window.onhashchange = () => {
			var navToken = location.hash.substring(1);
			this.show(navToken);
		};

		let backBtns = document.querySelectorAll('.back');
		for (let backBtn of backBtns) {
			
			Utils.addPressHandler(backBtn, () => {
				
				history.back();
			});
		}
	}

	show(id) {

		var pageElem = document.getElementById(id);
		if (!pageElem) {
			pageElem = document.getElementById('mainMenu');
		}
		
		this.pagesElem.insertBefore(pageElem, this.pagesElem.firstChild);		
	}

	getCurrentId() {
		
		let hash = window.location.hash;

		if (hash) {
			return hash.substring(1);
		}

		return 'mainMenu';
	}

	getCurrentPageElement() {
		
		let id = this.getCurrentId();
		let page = document.getElementById(id);
		if (page) {
			return page;
		}
		else {
			return document.getElementById('mainMenu');
		}
	}

}
