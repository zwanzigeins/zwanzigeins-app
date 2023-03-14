import GlobalSettings from './global-settings.js';
import Letterizer from './letterizer.js';

export default class Sound {

	constructor() {

		this.lastPlayed = null;
		this.letterizer = new Letterizer();
	}

	playInteger(integer, finishedHandler) {

		let word = this.getLetterizedNumber(integer);
		this.playWord(word, finishedHandler);
	}

	playWord(word, finishedHandler) {

		this.lastPlayed = word;
		var msg = new SpeechSynthesisUtterance(word);

		let speechRateString = GlobalSettings.INSTANCE.speechRate;
		let speechRate = parseFloat(speechRateString);

		msg.rate = speechRate;
		msg.onend = finishedHandler;
		msg.lang = 'de-DE';
		window.speechSynthesis.speak(msg);
	}

	playTask(num1, operator, num2) {

		let num1Word = this.getLetterizedNumber(num1);
		let num2Word = this.getLetterizedNumber(num2);

		var word = num1Word + " " + operator + " " + num2Word;
		this.playWord(word);
	}

	playAgain() {

		if (this.lastPlayed) {
			this.playWord(this.lastPlayed);
		}
	}

	getLetterizedNumber(number) {
		
		let speechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
		
		switch (speechMode) {
			
			case 'zwanzigeins':
				return this.letterizer.letterizeZwanzigEinsNumber(number);
				
			case 'traditionellVerdreht':
				return number;
				
			case 'zwanzigeinsEndnull':
				return this.letterizer.letterizeZwanzigEinsNumberEndnull(number);
				
			case 'zehneinsEndnull':
				return this.letterizer.letterizeZehnEinsNumberEndnull(number);
				
			default:
				return this.letterizer.letterizeZehnEinsNumber(number);
		}
	}
	
}