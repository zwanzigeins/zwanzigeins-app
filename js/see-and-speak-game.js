import Utils from './utils.js';
import NumberGame from './number-game.js';
import TwistedSpeechInputConverter from './twisted-speech-input-converter.js';
import Options from './options.js';
import Pages from './pages.js';
export default class SeeAndSpeakGame extends NumberGame {

	constructor() {

		super('see-and-speak', 'see-and-speak-menu', 'see-and-speak-game');

		if (typeof SpeechRecognition === 'undefined' && typeof webkitSpeechRecognition === 'undefined') {
			// the variable is defined

			let optionsArea = this.menuElem.querySelector('.options');
			optionsArea.innerHTML = '<div class="error">Dieser Browser unterstützt keine Spracheingabe.</div>';
			return;
		}

		let defaultOptions = {
			arity: 2,
			numTasks: 5,
			twistedSpeechMode: 'zehneins'
		};

		this.options = new Options('see-and-speak-menu', defaultOptions, true);

		this.twistedSpeechModeConverter = new TwistedSpeechInputConverter();

		var startButton = this.menuElem.querySelector('.start');

		startButton.addEventListener('click', () => {

			this.startGame();
		});

		this.taskElem = this.gameElem.querySelector('.task');
		this.answerElem = this.taskElem;

		this.microphoneButton = this.gameElem.querySelector('.microphone');
		this.microphoneButton.addEventListener('click', evt => {

			if (this.recognitionRunning) {
				this.recognition.stop();
			}
			else {
				this.recognition.start();
			}
		});

		this.recognitionRunning = false;
	}

	initSpeechRecognitionIfNeeded() {

		if (!this.recognition) {

			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

			var recognition = new SpeechRecognition();
			recognition.continuous = false;
			recognition.lang = 'de-DE';
			recognition.interimResults = false;
			recognition.maxAlternatives = 10;

			let rightResultGiven = true;

			let timeout = 0;

			recognition.onresult = event => {

				let result;

				if (this.options.twistedSpeechMode == 'zehneins') {
					
					let currentArity = this.options.arity;
					result = this.twistedSpeechModeConverter.convertTwistedSpeechRecognition(currentArity, event);
				}
				else {

					var speechRecognitionInput = event.results[0][0].transcript;
					console.log('speech-recognition-input: ' + speechRecognitionInput);
					result = speechRecognitionInput;
				}

				if (result == this.rightResult) {

					rightResultGiven = true;
					recognition.stop();
					clearTimeout(timeout);
					this.taskElem.classList.remove("error");
					super.processCorrectAnswer();
				}
				else {
					this.numErrors++;
					rightResultGiven = false;
					this.taskElem.classList.add("error");
				}
			};

			recognition.onstart = () => {

				this.recognitionRunning = true;
				this.microphoneButton.classList.add('active');
			};

			recognition.onend = () => {

				this.recognitionRunning = false;
				this.microphoneButton.classList.remove('active');

				if (!rightResultGiven) {
					
					if(Pages.INSTANCE.getCurrentId() == 'see-and-speak-game') {
						recognition.start();
					}
				}
			}

			recognition.onnomatch = () => {

			};

			recognition.onerror = event => {

				console.log(event);
			}

			this.recognition = recognition;
		}
	}

	startGame() {

		this.initSpeechRecognitionIfNeeded();
		super.startGame();
	}

	finishGame() {

		super.finishGame();
		this.recognition.stop();
	}

	generateNewTask() {

		let random;

		if (this.options.arity == 2) {

			random = this.getRandomNumber(11, 99);

			while (random.toString().endsWith('0')) {
				random = this.getRandomNumber(11, 99);
			}
		}
		else {

			random = this.getRandomNumber(111, 999);

			while (random.toString().endsWith('0') || random.toString().charAt(1) == "0") {
				random = this.getRandomNumber(111, 999);
			}
		}

		let task = {
			problem: random,
			rightResult: random
		};

		this.recognition.start();

		return task;
	}

	presentNewTask(task) {

		this.taskElem.textContent = task.problem;
	}

	provideCustomLevelLabelText(levelOptions) {

		let labelText =
			levelOptions.arity + '-stellig, ' +
			levelOptions.numTasks + ' Aufgaben, ' +
			levelOptions.twistedSpeechMode;

		return labelText;
	}

	getGameNameTranslation() {

		return 'Sehen & Sprechen';
	}

	getGameNameTranslationForFileName() {

		return 'sehen-und-sprechen';
	}

}