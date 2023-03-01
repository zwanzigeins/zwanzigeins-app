import GameScoreStorage from "./game-score-storage.js";
import Pages from "./pages.js";


export default class Statistics {

	constructor() {

		let statisticsPageElem = document.getElementById('statistics');

		this.centerElem = statisticsPageElem.querySelector('.center');

		Pages.INSTANCE.addBeforeOpenedHandler(id => {

			if (id == 'statistics') {

				this.showStatistics();
			}
		});

		let shareButton = statisticsPageElem.querySelector('.share');

		shareButton.addEventListener("click", () => {
			
			const shareData = {
			  title: "Zwanzigeins Statistik",
			  text: this.createStatsticsHtml()
			};
			
			try {
				navigator.share(shareData);
			} catch (err) {
			}
		});
	}

	showStatistics() {

		let html = this.createStatsticsHtml();

		this.centerElem.innerHTML = html;
	}

	createStatsticsHtml() {

		let html = '';

		for (let gameScore of GameScoreStorage.INSTANCE.gameScores) {

			let row = `<div>${gameScore.gameName}, ${gameScore.timeStamp}, ${gameScore.elapsedTime}, ${gameScore.numErrors}</div>`;

			html += row;
		}

		return html;
	}

}