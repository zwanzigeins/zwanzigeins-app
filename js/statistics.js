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
	}

	showStatistics() {

		let html = '';

		for (let gameScore of GameScoreStorage.INSTANCE.gameScores) {

			let row = `<div>${gameScore.gameName}, ${gameScore.timeStamp}, ${gameScore.elapsedTime}, ${gameScore.numErrors}</div>`;

			html += row;
		}

		this.centerElem.innerHTML = html;
	}

}