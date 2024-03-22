function createAudioWords() {
	
	let audioWords = [];

	for (let i = 0; i <= 20; i++) {

		audioWords.push(i);
	}

	audioWords.push(30, 40, 50, 60, 70, 80, 90, 'hundert', 'tausend', 'million', 'millionen', 'unn');
	
	return audioWords;
}

if(typeof document != 'undefined') {
	
	document.onclick = evt => {
	
		let audioWords = createAudioWords();
		
		for (let audioWord of audioWords) {
	
			let ssu = new SpeechSynthesisUtterance(audioWord);
			window.speechSynthesis.speak(ssu);
		}
	};
}

if(typeof module != 'undefined') {
	
	module.exports = {
	  createAudioWords  
	};
}
