import Utils from './utils.js';
import Options from './options.js';
import GameScoreStorage from './game-score-storage.js';

export default class NumberGame {

	constructor(gameName, menuPageId, gamePageId) {

		this.gameName = gameName;

		this.gamePageId = gamePageId;

		this.menuElem = document.getElementById(menuPageId);
		this.gameElem = document.getElementById(gamePageId);

		this.gameScoreStorage = new GameScoreStorage(this);

		// declare for documentation
		this.wrongAnswerOccured = false;

		this.gameStartTimeMillis;

		this.tasksPut = 0;
		this.numErrors = 0;

		this.gameProgressDetails = [];
		this.currentTaskNumErrors = 0;
		this.currentTaskStartMillis;

		// remember previous task to prevent consecutive putting of same task
		this.prevTask;
	}

	putNewTask() {

		this.currentTaskStartMillis = Date.now();

		let newTask = this.generateNewTask();

		if (this.prevTask != null) {

			// limit generation of new different task in case
			// level is setup too narrow
			let generationLimit = 10;

			while (this.prevTask.problem == newTask.problem && generationLimit > 0) {

				newTask = this.generateNewTask();
				generationLimit--;
			}
		}

		this.currentTaskNumErrors = 0;

		this.rightResult = newTask.rightResult;
		this.resetCurrentAnswer();

		this.presentNewTask(newTask);

		this.tasksPut++;
		this.prevTask = newTask;
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
	resetCurrentAnswer() {

		this.currentAnswer = "";
		this.styleReset();
	}

	getRandomNumber(from, to) {

		let min = parseInt(from);
		let max = parseInt(to);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	startGame() {

		this.wrongAnswerOccured = false;

		this.tasksPut = 0;
		this.numErrors = 0;
		this.prevTask = null;

		this.gameProgressDetails = [];

		window.location.hash = this.gamePageId;

		this.gameStartTimeMillis = Date.now();

		this.putNewTask();
	}

	finishGame() {

		let elapsed = Date.now() - this.gameStartTimeMillis;

		let elapsedTimeString = Utils.formatMillisAsMinutesWithSeconds(elapsed);

		let overlayDialog = document.querySelector('.dialog');

		overlayDialog.classList.add('showing');

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

		this.gameScoreStorage.saveGameScore(elapsedTimeString, this.numErrors, optionsPayload, this.gameProgressDetails);

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

	processCorrectAnswer() {

		// Ergebnis wurde durch die letzte Eingabe korrekt -> Styles setzen,
		// 500ms lang anzeigen & anschließend nächste Runde aufrufen / Spiel
		// beenden
		this.styleCorrectAnswer();

		setTimeout(() => {

			let now = Date.now();
			let elapsedForTask = now - this.currentTaskStartMillis;

			let gameProgressDetail = [this.rightResult, this.currentTaskNumErrors, elapsedForTask];
			this.gameProgressDetails.push(gameProgressDetail);

			if (this.tasksPut < this.options.numTasks) {
				this.putNewTask();
			}
			else {
				// keine Tasks mehr übrig -> Spiel beenden
				this.finishGame();
			}
		}, 500);
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

			let errorMsg = this.validateCustomLevel(levelDefinitionData);

			if (errorMsg) {
				alert('Invalide Angaben: ' + errorMsg);
			}
			else {

				this.customLevels.push(levelDefinitionData);
				this.saveCustomLevels();
				this.refreshCustomLevelButtons();
				history.back();
			}
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

				if (!this.options) {
					this.options = level;
				}
				else {
					Utils.copyObjectProperties(level, this.options);
				}

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

	/** abstract */
	generateNewTask() { };

	/** abstract */
	presentNewTask(task) { };

	/** abstract */
	provideCustomLevelLabelText(customLevel) { };

	/** abstract */
	validateCustomLevel(customLevel) { };

	/** abstract */
	getGameNameTranslation() { };

	/** abstract */
	getGameNameTranslationForFileName() { };

	/** abstract */
	initPredefinedLevelsIfNeeded() { };

}
