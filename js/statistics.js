import GameScoreStorage from "./game-score-storage.js";
import Pages from "./pages.js";
import Utils from "./utils.js";

export default class Statistics {

	constructor() {

		let statisticsPageElem = document.getElementById('statistics');

		this.centerElem = statisticsPageElem.querySelector('.center');

		Pages.INSTANCE.addBeforeOpenedHandler(id => {

			if (id == 'statistics') {

				this.showStatistics();
			}
		});
		
		let clearButton = statisticsPageElem.querySelector('.clear');
		
		clearButton.addEventListener('click', () => {
			
			let confirmed = confirm('Willst Du wirklich alle Spiel-Statistiken löschen?');
			
			if(confirmed){
				GameScoreStorage.INSTANCE.clear();
				this.centerElem.innerHTML = '';
			}
		});
		
		let downloadButton = statisticsPageElem.querySelector('.download');
		
		downloadButton.addEventListener('click', () => {
			
			let csv = this.createStatsticsCsv();
			
			let csvBlob = new Blob([csv], {
    			type: 'text/plain'
			});
			
			let downloadUrl = URL.createObjectURL(csvBlob);
			
			let downloadAnchor = document.createElement('a');
			
			let timestamp = Utils.getTimeStampWithMinutesPrecision();
			
			downloadAnchor.download = 'zwanzigeins-statistik-' + timestamp + '.csv';
			
			downloadAnchor.href = downloadUrl;
			this.centerElem.appendChild(downloadAnchor);
			downloadAnchor.click();
			this.centerElem.removeChild(downloadAnchor);
			URL.revokeObjectURL(downloadUrl);
		});

		let shareButton = statisticsPageElem.querySelector('.share');

		shareButton.addEventListener('click', () => {
			
			const shareData = {
			  title: 'Zwanzigeins Statistik',
			  text: this.createStatsticsCsv()
			};
			
			try {
				navigator.share(shareData);
			} catch (err) {
			}
		});
	}

	showStatistics() {

		let html = '<pre>' + this.createStatsticsCsv() + '</pre>';

		this.centerElem.innerHTML = html;
	}

	createStatsticsHtml() {

		let html = '';

		for (let gameScore of GameScoreStorage.INSTANCE.gameScores) {
			
			let gameOptionsJson;
			
			if(gameScore.gameOptions){
				gameOptionsJson = JSON.stringify(gameScore.gameOptions);
			}
			
			let speechRateOutput = Math.round(gameScore.speechRate * 100) + '%';
			
			let row = `<div>${gameScore.profileName}, ${gameScore.gameName}, ${gameScore.timeStamp}, ${gameScore.twistedSpeechMode}, ${speechRateOutput}, ${gameScore.elapsedTime}, ${gameScore.numErrors}, ${gameOptionsJson}</div>`;

			html += row;
		}

		return html;
	}
	
	createStatsticsCsv() {
		
		let csv = 'Profil;Spiel;Zeit-Stempel;Sprach-Modus;Sprech-Geschwindigkeit;Aufgaben-Anzahl;Spiel-Dauer;Spiel-Fehler;Spiel-Optionen';
		
		for (let gameScore of GameScoreStorage.INSTANCE.gameScores) {
			
			let profileNameOutput = this.escapeForCsv(gameScore.profileName.trim());
			
			let gameNameOutput;
			
			if(gameScore.gameName == 'listen-and-write'){
				gameNameOutput = 'Hören-und-Schreiben';
			}
			else {
				gameNameOutput = 'Kopfrechen-Trainer';
			}
			
			let speechRateOutput = Math.round(gameScore.speechRate * 100) + '%';

			let gameOptionsJson;
			
			let numTasksOutput = gameScore.gameOptions.numTasks; 

			// remove tasks-property from options-output
			let optionsClone = Object.assign({}, gameScore.gameOptions)
			delete optionsClone.numTasks;
				
			gameOptionsJson = JSON.stringify(optionsClone);
			
			let rowParts = new Array(
				profileNameOutput,
				gameNameOutput,
				gameScore.timeStamp,
				gameScore.twistedSpeechMode,
				speechRateOutput,
				numTasksOutput,
				gameScore.elapsedTime,
				gameScore.numErrors,
				gameOptionsJson
				);
			
			let row = rowParts.join(';');				

			csv += '\n' + row;
		}
		
		return csv;
	}
	
	escapeForCsv(string){
		
		return string.replace(' ', '_');
	}
	
	getLevelNameTranslation(levelName){
		
		switch (levelName) {

			case 'addition-easy':

				return 'Addition-leicht';

			case 'addition-medium':

				return 'Addition-mittel';

			case 'addition-hard':

				return 'Addition-schwer';

			case 'subtraction-easy':

				return 'Subtraktion-leicht';

			case 'subtraction-medium':

				return 'Subtraktion-mittel';

			case 'subtraction-hard':

				return 'Subtraktion-schwer';

			case 'addition-subtraction-easy':

				return 'Addition-Subtraktion-leicht';

			case 'addition-subtraction-medium':

				return 'Addition-Subtraktion-mittel';

			case 'addition-subtraction-hard':

				return 'Addition-Subtraktion-schwer';

			case 'multiplication-easy':

				return 'Multiplikation-leicht';

			case 'multiplication-medium':

				return 'Multiplikation-mittel';

			case 'multiplication-hard':

				return 'Multiplikation-schwer';

			case 'division-easy':

				return 'Division-leicht';

			case 'division-medium':

				return 'Division-mittel';

			case 'division-hard':

				return 'Division-schwer';

			case 'multiplication-division-easy':

				return 'Multiplikation-Division-leicht';

			case 'multiplication-division-medium':

				return 'Multiplikation-Division-mittel';

			case 'multiplication-division-hard':

				return 'Multiplikation-Division-schwer';

			case 'mixed-easy':

				return 'Gemischt-leicht';

			case 'mixed-medium':

				return 'Gemischt-mittel';

			case 'mixed-hard':

				return 'Gemischt-schwer';

		}
		
	}

}