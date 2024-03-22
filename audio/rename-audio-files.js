
const fs = require('fs');

function createAudioWords() {
	
	let audioWords = [];

	for (let i = 0; i <= 20; i++) {

		audioWords.push(i);
	}

	audioWords.push(30, 40, 50, 60, 70, 80, 90, 'hundert', 'tausend', 'million', 'millionen', 'unn');
	
	return audioWords;
}

let audioWords = createAudioWords();

fs.readdir('./output', function (err, files) {
	
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    let wavFiles = [];
    
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file);
        
        if(file.startsWith('audio')) {
			wavFiles.push(file);
		} 
    });
    
    for(let i = 0; i < audioWords.length; i++) {
		
		let file = wavFiles[i];
		let audioWord = audioWords[i];
		
		fs.renameSync('output/' + file, 'output/' + audioWord + '.wav');
	}
    
});