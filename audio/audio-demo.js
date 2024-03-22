document.onclick = evt => {
	
	let audioContext = new AudioContext();
	
	let audioWords = createAudioWords();
	
	let promises = [];
	
	let audioBuffers = {};
	
	for(let audioWord of audioWords) {
		
		let promise = fetch('output/' + audioWord + '.wav')
			.then(response => {
				
				return response.arrayBuffer();
			})
			.then(arrayBuffer => {
				
				return audioContext.decodeAudioData(arrayBuffer);
			})
			.then(audioBuffer => {
				
				audioBuffers[audioWord] = audioBuffer;
			});
		
		promises.push(promise);
	}
	
	Promise.all(promises)
		.then(values => {
			
			let sourceNode = audioContext.createBufferSource();
			sourceNode.buffer = audioBuffers['20'];
			sourceNode.connect(audioContext.destination);
			sourceNode.start();
			
			sourceNode.onended = () => {
				
				let einsSourceNode = audioContext.createBufferSource();
				einsSourceNode.buffer = audioBuffers['1'];
				einsSourceNode.connect(audioContext.destination);
				einsSourceNode.start();
			};
		});
};

function createAudioWords() {
	
	let audioWords = [];

	for (let i = 0; i <= 20; i++) {

		audioWords.push(i.toString());
	}

	audioWords.push('30', '40', '50', '60', '70', '80', '90', 'hundert', 'tausend', 'million', 'millionen', 'unn');
	
	return audioWords;
}
