import Pages from './pages.js';
import Utils from './utils.js';
import SvgCreator from './svg-creator.js';

export default class Statistics {

	constructor(game) {

		this.game = game;

		this.gameName = game.gameName;

		const statisticsId = 'statistics-' + this.gameName;

		this.gameScoreStorage = game.gameScoreStorage;

		let statisticsPageElem = document.getElementById(statisticsId);

		this.centerElem = statisticsPageElem.querySelector('.center');

		Pages.INSTANCE.addBeforeOpenedHandler(id => {

			if (id == statisticsId) {
				this.showStatisticsMenu();
			}
		});

		let clearButton = statisticsPageElem.querySelector('.clear');

		clearButton.addEventListener('click', () => {

			let gameNameTranslation = this.game.getGameNameTranslation();

			let confirmed = confirm('Willst Du wirklich alle Spiel-Statistiken für "' + gameNameTranslation + '" löschen?');

			if (confirmed) {

				this.gameScoreStorage.clear();
				this.centerElem.innerHTML = '';
			}
		});

		let downloadButton = statisticsPageElem.querySelector('.download');

		downloadButton.addEventListener('click', () => {

			let csv = this.createStatisticsCsv();

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
		//			let csv = this.createStatisticsCsv();
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

		let gameNameOutput = this.game.getGameNameTranslationForFileName();

		return 'zwanzigeins-statistik-' + gameNameOutput + '-' + timestamp + '.csv';
	}

	showStatisticsMenu() {

		this.centerElem.innerHTML = '';

		let allLevelOptions = this.gameScoreStorage.getAllGameScoreLevelOptions();

		for (let levelOptions of allLevelOptions) {

			let labelText = this.game.provideCustomLevelLabelText(levelOptions);

			let button = document.createElement('button');
			button.innerHTML = labelText;
			button.levelOptions = levelOptions;

			button.onclick = evt => {

				let levelOptions = evt.currentTarget.levelOptions;
				let gameScores = this.gameScoreStorage.getGameScores(levelOptions);

				let levelLabelText = this.game.provideCustomLevelLabelText(levelOptions);

				let statisticsHtml = this.createStatisticsHtml(gameScores);

				let chartPage = document.getElementById('statistics-chart');

				let h1 = chartPage.querySelector('h1');
				h1.textContent = 'Statistik: ' + this.game.getGameNameTranslation();

				let deleteButton = chartPage.querySelector('.delete');
				deleteButton.levelOptions = levelOptions;

				deleteButton.onclick = () => {

					let text = levelLabelText.replaceAll('&nbsp;', ' ');

					let confirmed = confirm('Willst du wirklich alle Statistik-Daten zum Level "' + text + '" löschen?');

					if (confirmed) {

						this.gameScoreStorage.deleteGameScores(levelOptions);
						history.back();
					}
				};

				let center = chartPage.querySelector('.center');

				center.innerHTML =
					'<div class="levelOptionsLabel">' + levelLabelText + '</div>' +
					statisticsHtml;

				location.hash = 'statistics-chart';
			}

			this.centerElem.appendChild(button);
		}
	}

	createStatisticsHtml(gameScores) {

		let svgCreator = new SvgCreator(gameScores);

		let html = svgCreator.createStatisticsSvg();

		let averageBaskets = this.calculateAveragesBySpeechMode(gameScores);

		html += '<h2>Durchschnitte nach Sprechweise</h2>';

		for (let basketKey in averageBaskets) {

			let basket = averageBaskets[basketKey];

			let averageElapsedTime = Utils.convertSecondsToTime(Math.round(basket.averageElapsedSeconds));

			if (basket.numEntries > 0) {

				let basketHtml =
					`
				<h3>${basketKey}</h3>
				<table>
				<tr>
					<td>Anzahl Einträge: <td><td>${basket.numEntries}</td>
				</tr>
				<tr>
					<td>Durchschnittliche Zeit: <td><td>${averageElapsedTime}</td>
				</tr>
				<tr>
					<td>Durchschnittliche Fehler-Anzahl: <td><td>${basket.averageErrors}</td>
				</tr>
				</table>
				`
				html += basketHtml;
			}
		}

		return html;
	}

	calculateAveragesBySpeechMode(gameScores) {

		let zehneins = {
			numEntries: 0,
			totalElapsedSeconds: 0,
			totalErrors: 0
		}

		let zwanzigeins = {
			numEntries: 0,
			totalElapsedSeconds: 0,
			totalErrors: 0
		}

		let traditionellVerdreht = {
			numEntries: 0,
			totalElapsedSeconds: 0,
			totalErrors: 0
		}

		let zehneinsEndnull = {
			numEntries: 0,
			totalElapsedSeconds: 0,
			totalErrors: 0
		}

		let zwanzigeinsEndnull = {
			numEntries: 0,
			totalElapsedSeconds: 0,
			totalErrors: 0
		}

		for (let gameScore of gameScores) {

			switch (gameScore.twistedSpeechMode) {

				case 'zehneins':
					this.increaseAverageBasket(gameScore, zehneins);
					break;

				case 'zwanzigeins':
					this.increaseAverageBasket(gameScore, zwanzigeins);
					break;

				case 'traditionellVerdreht':
					this.increaseAverageBasket(gameScore, traditionellVerdreht);
					break;

				case 'zehneinsEndnull':
					this.increaseAverageBasket(gameScore, zehneinsEndnull);
					break;

				case 'zwanzigeinsEndnull':
					this.increaseAverageBasket(gameScore, zwanzigeinsEndnull);
					break;
			}
		}

		this.calculateAveragesInBasket(zehneins);
		this.calculateAveragesInBasket(zwanzigeins);
		this.calculateAveragesInBasket(traditionellVerdreht);
		this.calculateAveragesInBasket(zehneinsEndnull);
		this.calculateAveragesInBasket(zwanzigeinsEndnull);

		return {
			zehneins,
			zwanzigeins,
			traditionellVerdreht,
			zehneinsEndnull,
			zwanzigeinsEndnull
		};
	}

	increaseAverageBasket(gameScore, basket) {

		basket.numEntries++;
		basket.totalElapsedSeconds += Utils.parseTimeToSeconds(gameScore.elapsedTime);
		basket.totalErrors += gameScore.numErrors;
	}

	calculateAveragesInBasket(basket) {

		if (basket.numEntries > 0) {
			basket.averageElapsedSeconds = basket.totalElapsedSeconds / basket.numEntries;
			basket.averageErrors = basket.totalErrors / basket.numEntries;
		}
	}

	createStatisticsCsv() {

		let emptyExtraCols = "Untersucher-Name;Seminar-Gruppe;Schule;Klasse;Geschlecht;Erstsprache_1;Erstsprache_2;Erstsprache_3;Nationalitaet;Geburtsdatum;Mathematik-Note;Anmerkung;";
		
		let emptyExtraColDelimiters = ';;;;;;;;;;;;';
		
		let csv = 'Profil;Spiel;Zeit-Stempel;Sprach-Modus;Sprech-Geschwindigkeit;Darstellung;Aufgaben-Anzahl;Spiel-Dauer(s);Spiel-Fehler;Spiel-Optionen;' + emptyExtraCols + 'Geraete-Infos';
		

		if (!this.uaParser) {
			this.uaParser = new UAParser();
		}

		for (let gameScore of this.gameScoreStorage.getAllGameScores()) {

			let profileNameOutput = this.escapeForCsv(gameScore.profileName.trim());

			let themeOutput = '';
			if (gameScore.theme) {
				themeOutput = gameScore.theme == 'dark' ? 'dunkel' : 'hell';
			}

			let gameNameOutput;

			if (this.gameName == 'listen-and-write') {
				gameNameOutput = 'Hoeren-und-Schreiben';
			}
			else {
				gameNameOutput = 'Kopfrechnen';
			}

			let speechRateOutput = gameScore.speechRate;

			let gameOptionsJson;

			let numTasksOutput = gameScore.gameOptions.numTasks;

			let elapsedTimeOutput = Utils.parseTimeToSeconds(gameScore.elapsedTime);

			// remove tasks-property from options-output
			let optionsClone = Object.assign({}, gameScore.gameOptions)
			delete optionsClone.numTasks;

			gameOptionsJson = JSON.stringify(optionsClone);

			let deviceInfosOutput = '';
			if (gameScore.userAgent) {

				this.uaParser.setUA(gameScore.userAgent);
				let uaResult = this.uaParser.getResult();

				delete uaResult.ua;
				delete uaResult.engine;
				delete uaResult.cpu;

				let uaDeviceInfo = uaResult.device;

				if (!uaDeviceInfo.model && !uaDeviceInfo.type && !uaDeviceInfo.type) {
					delete uaResult.device;
				}

				deviceInfosOutput = JSON.stringify(uaResult);
			}

			let rowParts = new Array(
				profileNameOutput,
				gameNameOutput,
				gameScore.timeStamp,
				gameScore.twistedSpeechMode,
				speechRateOutput,
				themeOutput,
				numTasksOutput,
				elapsedTimeOutput,
				gameScore.numErrors,
				gameOptionsJson
			);

			let row = rowParts.join(';');
			row += emptyExtraColDelimiters;
			row += ';' + deviceInfosOutput;

			csv += '\n' + row;
		}

		return csv;
	}

	escapeForCsv(string) {

		return string
			.replaceAll(/\s+/g, '_')
			.replaceAll('ä', 'ae')
			.replaceAll('ö', 'oe')
			.replaceAll('ü', 'ue')
			.replaceAll('ß', 'ss')
			.replaceAll('<', '')
			.replaceAll('>', '')
			.replaceAll(',', '')
			;
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

}