import Utils from './utils.js';
import Pages from './pages.js';
import TwistedSpeechInputConverter from './twisted-speech-input-converter.js';

export default class NumberDictationGame {

	constructor() {

		let numberDictationGamePage = document.querySelector('#number-dictation-game');

		this.startButton = numberDictationGamePage.querySelector('.start');
		this.startButton.onclick = evt => {

			this.startGame();
		};

		this.outputElem = numberDictationGamePage.querySelector('.numberDictationOutput');
		
		this.twistedSpeechModeConverter = new TwistedSpeechInputConverter();
	}

	startGame() {

		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
		var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

		var recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.lang = 'de-DE';
		recognition.interimResults = false;
		recognition.maxAlternatives = 10;
		
		recognition.onresult = event => {

			var speechRecognitionInput = event.results[0][0].transcript;
			console.log('speech-recognition-input: ' + speechRecognitionInput);

			let numberified = this.twistedSpeechModeConverter.convertTwistedSpeechInput(speechRecognitionInput);
			this.outputElem.textContent = numberified;
		};
		
		recognition.onspeechend = () => {

			recognition.stop();
			this.startGame();
		}

		recognition.onnomatch = () => {

		};

		recognition.onerror = event => {
			
			console.log(event);

			this.startGame();
		}

		recognition.start();
		this.startButton.textContent = 'Stop';

		window.addEventListener('hashchange', () => {

			recognition.stop();
			this.startButton.textContent = 'Start';
		});
	}

}