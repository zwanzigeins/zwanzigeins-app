import Letterizer from "./letterizer.js";

let letterizer = new Letterizer();

let startButton = document.querySelector('button');

let iterationsElem = document.querySelector('#iterations');
let durationTraditionellVerdrehtElem = document.querySelector('#durationTraditionellVerdreht');
let durationZehneinsElem = document.querySelector('#durationZehneins');

let measurementsCountInput = document.querySelector('#maxIterations');

let randomNumberPoolFloor = 10011;
let randomNumberPoolCeil = 99999;

let resultMillis;
let currentDurationOutput;

let maxMeasurementsCount;


let numbersForReading;

startButton.onclick = () => {
	
	numbersForReading = [];
	
	iterationsElem.textContent = '';
	durationTraditionellVerdrehtElem.textContent = '';
	durationZehneinsElem.textContent = '';
	
	currentDurationOutput = durationTraditionellVerdrehtElem;
		
	let randomNumbersRadioInput = document.querySelector('#random-numbers');
	
	if(randomNumbersRadioInput.checked) {
	
		maxMeasurementsCount = parseInt(measurementsCountInput.value);
	
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
		
	let utteranceContent;
	
	if(traditionellVerdrehtEnabled) {
		utteranceContent = letterizer.letterizeTraditionellVerdrehtNumber(number);
	}
	else {
		utteranceContent = letterizer.letterizeZehnEinsNumber(number);
	}
	
	let utterance = new SpeechSynthesisUtterance(utteranceContent);
	
	let nowMillis;
	
	utterance.onstart = () => {
		
		nowMillis = new Date().getTime();
	};
	
	utterance.onend = () => {
		
		let finishedMillis = new Date().getTime();
		let ellapsedMillis = finishedMillis - nowMillis;
		resultMillis += ellapsedMillis;
		
		iterationsElem.textContent = iteration + 1;
		currentDurationOutput.textContent = millisToMinutesAndSeconds(resultMillis) + ' (' + resultMillis + 'ms)';
		
		takeMeasurement(iteration + 1, traditionellVerdrehtEnabled);		
	};
	
	utterance.lang = 'de-DE';	
	window.speechSynthesis.speak(utterance);	
}

function randomIntFromInterval(min, max) { // min and max included
 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function millisToMinutesAndSeconds(millis) {
	
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}