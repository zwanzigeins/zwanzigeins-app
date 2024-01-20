import Letterizer from "./letterizer.js";

function playWord(word, finishedHandler) {

	var msg = new SpeechSynthesisUtterance(word);

	msg.onend = finishedHandler;
	msg.lang = 'de-DE';
	window.speechSynthesis.speak(msg);
}

let letterizer = new Letterizer();

let startButton = document.querySelector('button');

let iterationsElem = document.querySelector('#iterations');
let durationTraditionellVerdrehtElem = document.querySelector('#durationTraditionellVerdreht');
let durationZehneinsElem = document.querySelector('#durationZehneins');

let measurementsCountInput = document.querySelector('input');

let randomNumberPoolFloor = 10011;
let randomNumberPoolCeil = 99999;

let resultMillis;
let currentDurationOutput = durationTraditionellVerdrehtElem;

let maxMeasurementsCount;

let numbersForReading;

startButton.onclick = () => {
	
	numbersForReading = [];
	
	let randomNumbersRadioInput = document.querySelector('#random-numbers');
	
	if(randomNumbersRadioInput.checked) {
	
		maxMeasurementsCount = measurementsCountInput.value;
	
		for(let i = 0; i < maxMeasurementsCount; i++){
			
			let number = randomIntFromInterval(randomNumberPoolFloor, randomNumberPoolCeil);
			numbersForReading.push(number);
		}
	}
	else {
		
		for(let i = 11; i <= 99; i++) {
			numbersForReading.push(i);
		}
	}
	
	resultMillis = 0;
	takeMeasurement(0, true);
};

function takeMeasurement(iteration, traditionellVerdrehtEnabled) {
	
	if(iteration >= numbersForReading.length) {
		
		if(traditionellVerdrehtEnabled) {
			
			traditionellVerdrehtEnabled = false;
			iteration = 0;
			resultMillis = 0;
			currentDurationOutput = durationZehneinsElem;
		}
		else {
			return;
		}
	}
	
	let number = numbersForReading[iteration];
		
	let utteranceOutput;
	
	if(traditionellVerdrehtEnabled) {
		utteranceOutput = letterizer.letterizeTraditionellVerdrehtNumber(number);
	}
	else {
		utteranceOutput = letterizer.letterizeZehnEinsNumber(number);
	}
	
	let nowMillis = new Date().getTime();
	
	playWord(utteranceOutput, () => {
	
		let finishedMillis = new Date().getTime();
		let ellapsedMillis = finishedMillis - nowMillis;
		resultMillis += ellapsedMillis;
		
		iterationsElem.textContent = iteration + 1;
		currentDurationOutput.textContent = millisToMinutesAndSeconds(resultMillis) + ' (' + resultMillis + 'ms)';
		
		takeMeasurement(iteration + 1, traditionellVerdrehtEnabled);
	});
}

function randomIntFromInterval(min, max) { // min and max included
 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function millisToMinutesAndSeconds(millis) {
	
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}