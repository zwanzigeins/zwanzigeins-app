import Sound from '../js/sound.js';
import GlobalSettings from '../js/global-settings.js';
import Utils from '../js/utils.js';

let sound = new Sound();
GlobalSettings.INSTANCE = new GlobalSettings();
GlobalSettings.INSTANCE.speechRate = '1.5';



function playSequence(number){
	
	function finishedHandler(){
		playSequence(number - 1);
	}
	
	if(number > 5){
		sound.playInteger(number, finishedHandler);
	}
}

let buttonZehneins = document.querySelector('#playZehneins');
buttonZehneins.onclick = () =>{
	GlobalSettings.INSTANCE.twistedSpeechMode = "zehneins";
	playSequence(21);
}

let buttonZwanzigeins = document.querySelector('#playZwanzigeins');
buttonZwanzigeins.onclick = () =>{
	GlobalSettings.INSTANCE.twistedSpeechMode = "zwanzigeins";
	playSequence(21);
}

let buttonVerdreht = document.querySelector('#playVerdreht');
buttonVerdreht.onclick = () =>{
	GlobalSettings.INSTANCE.twistedSpeechMode = "traditionellVerdreht";
	playSequence(21);
}

var letterized = sound.letterizeZehnEinsNumber('15');
console.log('letterized zehneins: ' + letterized);

var letterizedZwanzigeins = sound.letterizeZwanzigEinsNumber('15');
console.log('letterized zehneins: ' + letterizedZwanzigeins);

let numberified;

//numberified = Utils.numberifySpeechResult('20.1');
//console.log(numberified);

numberified = Utils.numberifySpeechResult('170/2');
console.log(numberified);
