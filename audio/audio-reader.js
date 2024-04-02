import Letterizer from "../js/letterizer.js";

let letterizer = new Letterizer();

function createAudioWords() {
	
	let audioWords = [];
	
	for (let i = 0; i <= 1000; i++) {
		
		let audioWord = letterizer.letterizeZehnEinsNumber(i);

		audioWords.push(audioWord);
	}
	
	return audioWords;
}

if(typeof document != 'undefined') {
	
	document.onclick = evt => {
		
		let ssu = new SpeechSynthesisUtterance("start");
		window.speechSynthesis.speak(ssu);
	
		let audioWords = createAudioWords();
		
		speakNextWord(0, audioWords);
	};
}

function speakNextWord(index, audioWords) {
	
	if(index < audioWords.length) {
		
		let audioWord = audioWords[index];
		
		let ssu = new SpeechSynthesisUtterance(audioWord);
		ssu.onend = evt => {
			
			setTimeout(() => {
				
			speakNextWord(index + 1, audioWords);
			}, 500);
		};
		window.speechSynthesis.speak(ssu);
	}	
}

if(typeof module != 'undefined') {
	
	module.exports = {
	  createAudioWords  
	};
}
