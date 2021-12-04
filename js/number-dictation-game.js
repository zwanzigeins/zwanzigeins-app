import Utils from './utils.js';

export default class NumberDictationGame {

	constructor(pages) {
		
		let pagesElem = pages.pagesElem;

		let numberDictationGamePage = pagesElem.querySelector('#numberDictationGame');

		this.startButton = numberDictationGamePage.querySelector('.start');
		this.startButton.onclick = evt => {

			this.startGame();
		};

		this.outputElem = numberDictationGamePage.querySelector('.numberDictationOutput');
	}

	startGame() {

		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
		var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

		var recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.lang = 'de-DE';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
	
		recognition.onresult = event => {
		
			var resultText = event.results[0][0].transcript;
			console.log('resultText: ' + resultText);
			
			let numberified = Utils.numberifySpeechResult(resultText);
			this.outputElem.textContent = numberified;
		};

		recognition.onspeechend = () => {
			
			recognition.stop();
			this.startGame();
		}

		recognition.onnomatch = () => {
			
		};

		recognition.onerror = event => {
			
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