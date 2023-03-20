import GameScoreStorage from './game-score-storage.js';
import GameScoreStorageRegistry from './game-score-storage-registry.js';
import Pages from './pages.js';
import Utils from './utils.js';

export default class Statistics {

	constructor(gameName) {
		
		this.gameName = gameName;
		
		const statisticsId = 'statistics-' + gameName;
		
		this.gameScoreStorage = GameScoreStorageRegistry.INSTANCE.getGameScoreStorage(gameName);

		let statisticsPageElem = document.getElementById(statisticsId);

		this.centerElem = statisticsPageElem.querySelector('.center');

		Pages.INSTANCE.addBeforeOpenedHandler(id => {

			if (id == statisticsId) {

				this.showStatistics();
			}
		});

		let clearButton = statisticsPageElem.querySelector('.clear');

		clearButton.addEventListener('click', () => {
			
			let gameNameTranslation = this.getGameNameTranslation(this.gameName);

			let confirmed = confirm('Willst Du wirklich alle Spiel-Statistiken für "' + gameNameTranslation + '" löschen?');

			if (confirmed) {
				this.gameScoreStorage.clear();
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

			downloadAnchor.download = this.createCsvFileName();

			downloadAnchor.href = downloadUrl;
			this.centerElem.appendChild(downloadAnchor);
			downloadAnchor.click();
			this.centerElem.removeChild(downloadAnchor);
			URL.revokeObjectURL(downloadUrl);
		});

		//		let shareButton = statisticsPageElem.querySelector('.share');
		//
		//		shareButton.addEventListener('click', () => {
		//			
		//			let csv = this.createStatsticsCsv();
		//			
		//			let csvBlob = new Blob([csv], {
		//				type: 'text/plain'
		//			});
		//			
		//			let csvFile = new File([csvBlob], this.createCsvFileName());
		//
		//			const shareData = {
		//				title: 'Zwanzigeins Statistik',
		//				files: [csvFile]
		//			};
		//
		//			try {
		//				navigator.share(shareData);
		//			} catch (err) {
		//			}
		//		});
	}

	createCsvFileName() {

		let timestamp = Utils.getTimeStampWithMinutesPrecision();
		return 'zwanzigeins-statistik-' + this.gameName + '-' + timestamp + '.csv';
	}

	showStatistics() {

		let html;
		try {
			html = '<pre>' + this.createStatsticsCsv() + '</pre>';
		}
		catch (e) {
			html = 'Statistik-Daten nicht kompatibel, bitte mithilfe des Mülleimers oben rechts löschen.';
		}

		this.centerElem.innerHTML = html;
	}

	createStatsticsHtml() {

		let html = '';

		for (let gameScore of this.gameScoreStorage.gameScores) {

			let gameOptionsJson;

			if (gameScore.gameOptions) {
				gameOptionsJson = JSON.stringify(gameScore.gameOptions);
			}

			let speechRateOutput = Math.round(gameScore.speechRate * 100) + '%';

			let row = `<div>${gameScore.profileName}, ${this.gameName}, ${gameScore.timeStamp}, ${gameScore.twistedSpeechMode}, ${speechRateOutput}, ${gameScore.elapsedTime}, ${gameScore.numErrors}, ${gameOptionsJson}</div>`;

			html += row;
		}

		return html;
	}

	createStatsticsCsv() {

		let csv = 'Profil;Spiel;Zeit-Stempel;Sprach-Modus;Sprech-Geschwindigkeit;Aufgaben-Anzahl;Spiel-Dauer;Spiel-Fehler;Spiel-Optionen';

		for (let gameScore of this.gameScoreStorage.gameScores) {

			let profileNameOutput = this.escapeForCsv(gameScore.profileName.trim());

			let gameNameOutput;

			if (this.gameName == 'listen-and-write') {
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

	escapeForCsv(string) {

		return string.replace(' ', '_');
	}

	getLevelNameTranslation(levelName) {

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
	
	getGameNameTranslation(gameName){
		
		switch(gameName){
			
			case 'listen-and-write':
				return 'Hören & Schreiben';
			
			case 'mental-arithmetic':
				return 'Kopfrechen-Trainer';
		}
	}
}