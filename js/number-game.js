import Utils from './utils.js';

export default class NumberGame{
	
	constructor(sound, pages, menuPageId, gamePageId){
		
		this.sound = sound;
		this.pages = pages;
		
		this.menuElem = document.getElementById(menuPageId);
		this.gameElem = document.getElementById(gamePageId);
		
		let answerElemSelector;
		
		if(this.gameElem.classList.contains('auditive')){
			answerElemSelector = '.auditive > .answer';
		}
		else{
			answerElemSelector = ':not(.auditive) > .answer';
		}
		
		this.answerElem = this.gameElem.querySelector(answerElemSelector);
		this.currentAnswer = '';
		
		this.taskElem = this.gameElem.querySelector('.task > td');
		this.playAgainBtn = this.gameElem.querySelector('.playAgainBtn');
		
		// hint: the page-dom is 'reused' among levels, so use 'setPressHandler' to
		// overwrite potential previous listener-registrations
		
		Utils.setPressHandler(this.playAgainBtn, () => {
			
			this.sound.playAgain();
		});
		
		let numBtns = this.gameElem.getElementsByClassName('numBtn');
		for (let i = 0; i < numBtns.length; i++) {
		    Utils.setPressHandler(numBtns[i], e =>{
		    	 let number = parseInt(e.currentTarget.innerHTML);
				 this.processNumberInput(number);
		    });
		}
		
		let clearBtn = this.gameElem.querySelector('.clearBtn');

		Utils.setPressHandler(clearBtn, () => {
			
		    this.currentAnswerReset();
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

		if (this.wrongAnswerOccured){
			//wenn die eingegebene Antwort bereits falsch war
			//und mehr als 500ms seitdem vergangen sind, lösche 
			//bisherige Eingabe um automatisch neue, richtige Antwort zu ermöglichen
			let now = new Date();
			let elapsedMs = now.getTime() - this.wrongAnswerTimeStamp.getTime();
		
			if(elapsedMs > 500){
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
		}
	}

	getRandomNumber(from, to) {
		
	    let min = parseInt(from);
	    let max = parseInt(to);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	finishGame(){
	    
	    let ellapsed = new Date().getTime() - this.gameStartTimeStamp.getTime();
	    let ellapsedDate = new Date(ellapsed);
	    
	    let overlayDialog = document.querySelector(".dialog")
	    
	    overlayDialog.classList.add("showing");
		let minutes = ellapsedDate.getMinutes();
		let seconds = ellapsedDate.getSeconds();
		if(seconds < 10){
			seconds = '0' + seconds;
		}
		document.getElementById('lastGameTime').innerHTML = minutes + ":" + seconds;

		setTimeout(() => {
			overlayDialog.classList.remove("showing");
		}, 2000);
		
		window.history.back();
	}

	styleWrongAnswer(){
	    this.answerElem.classList.add('error');
	}

	styleCorrectAnswer(){
		this.answerElem.classList.add('correct');
	}

	styleReset(){
	    this.answerElem.classList.remove('error', 'correct');
	}
}
