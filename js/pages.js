import Utils from "./utils.js";

export default class Pages {

	constructor() {

		this.pagesElem = document.querySelector('body > .pages');

		this.beforeOpenedHandlers = [];
		
		this.pageChangedHandlers = [];

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
	
	handleInitialNavigation(){
		
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
	}

	show(id) {

		var pageElem = document.getElementById(id);
		if (!pageElem) {
			pageElem = document.getElementById('main-menu');
		}

		for (let handler of this.beforeOpenedHandlers) {

			handler.call(null, id);
		}
		
		let oldPageId = this.pagesElem.firstChild.id;

		this.pagesElem.insertBefore(pageElem, this.pagesElem.firstChild);
		
		for (let handler of this.pageChangedHandlers) {

			handler.call(null, oldPageId, id);
		}
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

	addBeforeOpenedHandler(handler) {

		this.beforeOpenedHandlers.push(handler);
	}

	addPageChangedHandler(handler) {

		this.pageChangedHandlers.push(handler);
	}

}
