import Sound from '../js/sound.js';
import Letterizer from '../js/letterizer.js';
import GlobalSettings from '../js/global-settings.js';
import Utils from '../js/utils.js';

let sound = new Sound();
let letterizer = new Letterizer();

GlobalSettings.INSTANCE = new GlobalSettings();
GlobalSettings.INSTANCE.speechRate = '1.0';


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
	
	sound.playInteger(50100);
	sound.playInteger(21);
	sound.playInteger(20);
}

let buttonPlaySplitVersion = document.querySelector('#playSplitVersion');
buttonPlaySplitVersion.onclick = () => {
	
	GlobalSettings.INSTANCE.speechRate = '1';
	sound.playWord('zwanzig zwei tausend fünfhundert fünfzig eins');
}

let buttonPlayPronouncedVersion = document.querySelector('#playPronouncedVersion');
buttonPlayPronouncedVersion.onclick = () => {
	
	GlobalSettings.INSTANCE.speechRate = '1';
	sound.playWord('zwanzigzwei tausend fünfhundert fünfzigeins');
}


var letterized = letterizer.letterizeZehnEinsNumber('15');
console.log('letterized zehneins: ' + letterized);

var letterizedZwanzigeins = letterizer.letterizeZwanzigEinsNumber('15');
console.log('letterized zehneins: ' + letterizedZwanzigeins);

let numberified;


let word = 'hundert zehn eins millionen hundert zehn eins tausend hundert zehn eins';

sound.playWord(word);

//numberified = Utils.numberifySpeechResult('20.1');
//console.log(numberified);

//numberified = Utils.numberifySpeechResult('170/2');
//console.log(numberified);
