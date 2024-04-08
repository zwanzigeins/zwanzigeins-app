import GlobalSettings from './global-settings.js';
import Letterizer from './letterizer.js';

export default class Sound {

	constructor() {

		this.lastPlayed = null;
		this.letterizer = new Letterizer();
	}

	playInteger(integer, finishedHandler) {
	
		if(GlobalSettings.INSTANCE.experimentModeEnabled) {
			
			this.lastPlayed = integer;
			this.playAudioFile(integer);
		}
		else {
						
			let word = this.getLetterizedNumber(integer);
			this.playWord(word, finishedHandler);
		}
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
			
			if(typeof this.lastPlayed == 'number') {
				this.playAudioFile(this.lastPlayed);
			}
			else {
				this.playWord(this.lastPlayed);
			}
		}
	}

	getLetterizedNumber(number) {
		
		let speechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
		
		switch (speechMode) {
			
			case 'zwanzigeins':
				return this.letterizer.letterizeZwanzigEinsNumber(number);
				
			case 'traditionellVerdreht':
				return this.letterizer.letterizeTraditionellVerdrehtNumber(number);
				
			case 'zwanzigeinsEndnull':
				return this.letterizer.letterizeZwanzigEinsNumberEndnull(number);
				
			case 'zehneinsEndnull':
				return this.letterizer.letterizeZehnEinsNumberEndnull(number);
				
			default:
				return this.letterizer.letterizeZehnEinsNumber(number);
		}
	}
	
	playAudioFile(number) {
		
		if(!this.audioElement) {
			this.audioElement = document.createElement('audio');
			this.audioElement.setAttribute('autoplay', true);
			document.body.appendChild(this.audioElement);
		}
		
		let speechRateString = GlobalSettings.INSTANCE.speechRate;
		let speechRate = parseFloat(speechRateString);
		
		if(speechRate != 1) {
			
			alert('Im Experiment-Modus ist nur die Sprechgeschwindigkeit 100% möglich.');
			return;
		}
		
		if(!this.audioContext) {
			this.audioContext = new AudioContext();
		}
		
		let speechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
		
		let mp3uri = 'mp3/';
		
		if(speechMode == 'zehneins') {
			mp3uri += 'zehneins';
		}
		else if(speechMode == 'traditionellVerdreht') {
			mp3uri += 'traditionell-verdreht';
		}
		else {
			
			alert('Dieser Sprach-Modus ' + speechMode + ' ist im Experiment-Modus nicht verfügbar.');
			return;
		}
		
		if(number < 10) {
			number = '00' + number;
		}
		else if(number < 100) {
			number = '0' + number;
		}
		
		mp3uri += '/rate-100/audio-' + number + '.mp3';
		
		this.audioElement.src = mp3uri;
	}
	
}