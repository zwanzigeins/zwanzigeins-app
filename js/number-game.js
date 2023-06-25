import Utils from './utils.js';
import Sound from './sound.js';
import Options from './options.js';
import GameScoreStorage from './game-score-storage.js';
import Pages from './pages.js';
import GlobalSettings from './global-settings.js';

export default class NumberGame {

	constructor(gameName, menuPageId, gamePageId) {

		this.gameName = gameName;
		
		this.gamePageId = gamePageId;

		this.menuElem = document.getElementById(menuPageId);
		this.gameElem = document.getElementById(gamePageId);

		let answerElemSelector;

		if (this.gameElem.classList.contains('auditive')) {
			answerElemSelector = '.auditive > .answer';
		}
		else {
			answerElemSelector = ':not(.auditive) > .answer';
		}

		this.answerElem = this.gameElem.querySelector(answerElemSelector);
		this.currentAnswer = '';

		this.taskElem = this.gameElem.querySelector('.task > td');
		this.playAgainBtn = this.gameElem.querySelector('.playAgainBtn');

		// hint: the page-dom is 'reused' among levels, so use 'setPressHandler' to
		// overwrite potential previous listener-registrations

		Utils.setPressHandler(this.playAgainBtn, () => {

			Sound.INSTANCE.playAgain();
		});

		let numBtns = this.gameElem.getElementsByClassName('numBtn');
		for (let i = 0; i < numBtns.length; i++) {

			Utils.setPressHandler(numBtns[i], e => {

				let number = parseInt(e.currentTarget.innerHTML);
				this.processNumberInput(number);
			});
		}

		let clearBtn = this.gameElem.querySelector('.clearBtn');

		Utils.setPressHandler(clearBtn, () => {

			this.currentAnswerReset();
		});
		
		this.gameScoreStorage = new GameScoreStorage(this.gameName);

		// declare for documentation
		this.wrongAnswerOccured = false;
		this.gameStartTimeStamp = new Date();
		this.tasksPut = 0;
		this.numErrors = 0;
		
		Pages.INSTANCE.addBeforeOpenedHandler(pageId => {
			
			if(pageId == menuPageId){
				
				let speechModeQuickAccessElem = GlobalSettings.INSTANCE.getSpeechModeQuickAccessElement();
				let center = this.menuElem.querySelector('.center');				
				center.appendChild(speechModeQuickAccessElem);
			}
		});
	}
	
	/**
	 * Aktuelle Antwort (Wert im Eingabefeld)
	 */
	get currentAnswer() {

		return this.answerElem.innerHTML;
	}

	/**
	 * Setze aktuelle Antwort (Wert im Eingabefeld)
	 */
	set currentAnswer(value) {

		this.answerElem.innerHTML = value;
	}

	/**
	 * Ist die aktuelle Antwort korrekt?
	 */
	isCurrentAnswerCorrect() {

		return (this.currentAnswer == this.rightResult.toString());
	}

	/**
	 * Leere das Feld der aktuellen Antwort und setze etwaige Styles zurück
	 */
	currentAnswerReset() {

		this.currentAnswer = "";
		this.styleReset();
	}

	/**
	 * Verarbeitet die Eingabe einer Zahl. 
	 */
	processNumberInput(number) {

		// wenn die Antwort bereits korrekt ist, ignoriere sämtliche Eingaben
		// (es läuft gerade ein Timeout, welches die nächste Runde einleitet)
		if (this.isCurrentAnswerCorrect()) {
			return;
		}

		if (this.wrongAnswerOccured) {
			//wenn die eingegebene Antwort bereits falsch war
			//und mehr als 500ms seitdem vergangen sind, lösche 
			//bisherige Eingabe um automatisch neue, richtige Antwort zu ermöglichen
			let now = new Date();
			let elapsedMs = now.getTime() - this.wrongAnswerTimeStamp.getTime();

			if (elapsedMs > 500) {
				this.currentAnswerReset();
				this.wrongAnswerOccured = false;
			}
		}

		// eingebene Ziffer hinzufügen
		this.currentAnswer = this.currentAnswer + number;

		if (this.isCurrentAnswerCorrect()) {
			// Ergebnis wurde durch die letzte Eingabe korrekt -> Styles setzen,
			// 500ms lang anzeigen & anschließend nächste Runde aufrufen / Spiel
			// beenden
			this.styleCorrectAnswer();

			setTimeout(() => {
				if (this.tasksPut < this.options.numTasks) {
					return this.putNewTask();
				}

				// keine Tasks mehr übrig -> Spiel beenden
				return this.finishGame();

			}, 500);
			return;
		}

		// das Ergebnis ist (noch) nicht korrekt -> eingebene Zahl 
		let rightResultStr = this.rightResult.toString();

		let rightResultBeginning = rightResultStr.substr(0, this.currentAnswer.length);
		if (rightResultBeginning != this.currentAnswer) {

			this.styleWrongAnswer();
			this.wrongAnswerOccured = true;
			this.wrongAnswerTimeStamp = new Date();

			this.numErrors++;
		}
	}

	getRandomNumber(from, to) {

		let min = parseInt(from);
		let max = parseInt(to);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	startGame() {

		this.wrongAnswerOccured = false;
		this.gameStartTimeStamp = new Date();
		this.tasksPut = 0;
		this.numErrors = 0;
		
		window.location.hash = this.gamePageId;
		
		this.putNewTask();

		window.onkeydown = e => {
			
			let digit = parseInt(e.key);
			if (!isNaN(digit)) {
				this.processNumberInput(digit);
			}
		}
	}

	finishGame() {

		let elapsed = new Date().getTime() - this.gameStartTimeStamp.getTime();
		let elapsedDate = new Date(elapsed);

		let overlayDialog = document.querySelector('.dialog');

		overlayDialog.classList.add('showing');
		let minutes = elapsedDate.getMinutes();
		let seconds = elapsedDate.getSeconds();
		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		let elapsedTimeString = minutes + ':' + seconds;

		document.getElementById('lastGameTime').innerHTML = elapsedTimeString;

		document.getElementById('numErrors').innerHTML = this.numErrors;

		setTimeout(() => {
			overlayDialog.classList.remove('showing');
		}, 3000);

		let optionsPayload;

		if (this.options['getPayloadObject']) {
			optionsPayload = this.options.getPayloadObject();
		}
		else {
			optionsPayload = this.options;
		}

		this.gameScoreStorage.saveGameScore(elapsedTimeString, this.numErrors, optionsPayload);

		window.history.back();
	}

	styleWrongAnswer() {

		this.answerElem.classList.add('error');
	}

	styleCorrectAnswer() {

		this.answerElem.classList.add('correct');
	}

	styleReset() {

		this.answerElem.classList.remove('error', 'correct');
	}

	// ##### custom level handling #####

	initCustomLevelHandling(defaultOptions) {

		this.loadCustomLevels();
		this.appendCustomLevelButtons();
		this.initCustomLevelCreationDialog(defaultOptions);
	}

	initCustomLevelCreationDialog(defaultOptions) {

		let pageId = this.gameName + '-level-creation';

		let pageElem = document.querySelector('#' + pageId);

		let createLevelButton = pageElem.querySelector('.finishLevelCreation');

		let options = new Options(pageId, defaultOptions, false);

		createLevelButton.onclick = evt => {

			let levelDefinitionData = options.getPayloadObject();

			this.customLevels.push(levelDefinitionData);

			this.saveCustomLevels();

			this.refreshCustomLevelButtons();

			history.back();
		};
	}

	loadCustomLevels() {

		let storageKey = 'custom-levels: ' + this.gameName;

		let json = localStorage.getItem(storageKey);

		let customLevels;

		if (json) {
			customLevels = JSON.parse(json);
		}
		else {
			customLevels = [];
		}

		this.customLevels = customLevels;
	}

	saveCustomLevels() {

		let storageKey = 'custom-levels: ' + this.gameName;

		let json = JSON.stringify(this.customLevels);

		localStorage.setItem(storageKey, json);
	}

	appendCustomLevelButtons() {

		let customLevelsContainer = this.menuElem.querySelector('.customLevels');

		for (let customLevel of this.customLevels) {

			let labelText;

			if (this.provideCustomLevelLabelText) {
				labelText = this.provideCustomLevelLabelText(customLevel);
			}
			else {
				labelText = JSON.stringify(customLevel);
			}

			let levelButtonContainer = document.createElement('div');
			levelButtonContainer.classList.add('splitButton');

			levelButtonContainer.innerHTML =
				'<button>' + labelText + '</button>' +
				'<button class="delete"></button>'
				;

			let levelButton = levelButtonContainer.firstElementChild;

			levelButton.customLevel = customLevel;

			levelButton.onclick = evt => {

				let level = evt.currentTarget.customLevel;

				Utils.copyObjectProperties(level, this.options);

				this.startGame();
			};

			let deleteButton = levelButtonContainer.lastElementChild;

			deleteButton.customLevel = customLevel;

			deleteButton.onclick = evt => {

				evt.stopPropagation();

				let levelLabel = evt.currentTarget.closest('.splitButton').firstElementChild.textContent;

				let confirmed = confirm('Willst du das Level "' + levelLabel + '" wirklich löschen?');

				if (confirmed) {

					let customLevel = evt.currentTarget.customLevel;
					Utils.removeObjectFromArray(this.customLevels, customLevel);
					this.saveCustomLevels();
					this.refreshCustomLevelButtons();
				}
			};

			customLevelsContainer.append(levelButtonContainer);
		}
	}

	refreshCustomLevelButtons() {

		let customLevelsContainer = this.menuElem.querySelector('.customLevels');

		customLevelsContainer.innerHTML = '';
		this.appendCustomLevelButtons();
	}
	
	// abstract provideCustomLevelLabelText(customLevel)
	
	// abstract getGameNameTranslation();
	
	// abstract getGameNameTranslationForFileName();
	
}
