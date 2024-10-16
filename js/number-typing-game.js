import NumberGame from './number-game.js';
import Utils from './utils.js';
import Sound from './sound.js';

export default class NumberTypingGame extends NumberGame {
	
	constructor(gameName, menuPageId, gamePageId) {
		
		super(gameName, menuPageId, gamePageId);
		
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
				
				let numberString = e.currentTarget.dataset.number;
				let number = parseInt(numberString);
				this.processNumberInput(number);
			});
		}

		let clearBtn = this.gameElem.querySelector('.clearBtn');

		Utils.setPressHandler(clearBtn, () => {

			this.resetCurrentAnswer();
		});
	}
	
	/**
	 * Verarbeitet die Eingabe einer Zahl. 
	 */
	processNumberInput(number) {
		
		if(isNaN(number)) {
			
			console.error('NaN was inputted: ' + number);
			return;
		} 

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

				this.resetCurrentAnswer();
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
					this.putNewTask();
				}
				else {
					// keine Tasks mehr übrig -> Spiel beenden
					this.finishGame();
				}

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
		
	startGame() {
		
		super.startGame();
		
		window.onkeydown = e => {

			let digit = parseInt(e.key);
			if (!isNaN(digit)) {
				this.processNumberInput(digit);
			}
		}
	}
	
}
