import Letterizer from "./letterizer.js";

let letterizer = new Letterizer();

let startButton = document.querySelector('button');

let iterationsElem = document.querySelector('#iterations');
let durationTraditionellVerdrehtElem = document.querySelector('#durationTraditionellVerdreht');
let durationZehneinsElem = document.querySelector('#durationZehneins');

let measurementsCountInput = document.querySelector('#maxIterations');

let useAudioFilesInput = document.querySelector('#use-audio-files');

let useAudioFileEnabled;

let speechRateInput = document.querySelector('#speechrate');

let randomNumberPoolFloor = 10011;
let randomNumberPoolCeil = 99999;

let resultMillis;
let currentDurationOutput;

let maxMeasurementsCount;

let numbersForReading;

let versionDiv = document.createElement('div');
versionDiv.innerHTML = '<br><br>Version 2024-04-08';
document.body.appendChild(versionDiv);

let speechRate;

let audioContext;

let audioBuffersTV = {};
let audioBuffersZE = {};

startButton.onclick = () => {

	numbersForReading = [];

	iterationsElem.textContent = '';
	durationTraditionellVerdrehtElem.textContent = '';
	durationZehneinsElem.textContent = '';

	useAudioFileEnabled = useAudioFilesInput.checked;

	currentDurationOutput = durationTraditionellVerdrehtElem;

	let randomNumbersRadioInput = document.querySelector('#random-numbers');

	if (randomNumbersRadioInput.checked) {

		maxMeasurementsCount = parseInt(measurementsCountInput.value);

		for (let i = 0; i < maxMeasurementsCount; i++) {

			let number = randomIntFromInterval(randomNumberPoolFloor, randomNumberPoolCeil);
			numbersForReading.push(number);
		}
	}
	else {

		for (let i = 11; i <= 99; i++) {
			numbersForReading.push(i);
		}
	}

	let speechRateString = speechRateInput.value;
	speechRate = parseFloat(speechRateString);

	resultMillis = 0;

	if (useAudioFileEnabled) {

		audioContext = new AudioContext();

		let traditionellVerdrehtEnabled = true;
		let i = 0;

		let number = numbersForReading[0];

		let downloadFinishedHandler = () => {

			i++;

			if (i < numbersForReading.length) {

				number = numbersForReading[i];
				downloadAudioFileToBuffer(number, traditionellVerdrehtEnabled, downloadFinishedHandler);
			}
			else {
				if (traditionellVerdrehtEnabled) {

					traditionellVerdrehtEnabled = false;
					i = 0;
					number = numbersForReading[i];
					downloadAudioFileToBuffer(number, traditionellVerdrehtEnabled, downloadFinishedHandler);
				}
				else {
					takeMeasurement(0, true);
				}
			}
		}

		downloadAudioFileToBuffer(number, traditionellVerdrehtEnabled, downloadFinishedHandler);
	}
};

function takeMeasurement(iteration, traditionellVerdrehtEnabled) {

	if (iteration >= numbersForReading.length) {

		if (traditionellVerdrehtEnabled) {

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

	let nowMillis = new Date().getTime();

	playSound(number, traditionellVerdrehtEnabled, () => {

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

function playSound(number, traditionellVerdrehtEnabled, finishedHandler) {

	if (useAudioFileEnabled) {
		playAudioFile(number, traditionellVerdrehtEnabled, finishedHandler);
	}
	else {

		let utteranceContent;

		if (traditionellVerdrehtEnabled) {
			utteranceContent = letterizer.letterizeTraditionellVerdrehtNumber(number);
		}
		else {
			utteranceContent = letterizer.letterizeZehnEinsNumber(number);
		}

		let utterance = new SpeechSynthesisUtterance(utteranceContent);

		utterance.rate = speechRate;

		utterance.onend = finishedHandler;

		utterance.lang = 'de-DE';
		window.speechSynthesis.speak(utterance);
	}
}

function playAudioFile(number, traditionellVerdrehtEnabled, finishedHandler) {

	let audioBuffer;
	
	if (number < 10) {
		number = '00' + number;
	}
	else if (number < 100) {
		number = '0' + number;
	}

	let key = '_' + number;

	if (traditionellVerdrehtEnabled) {
		audioBuffer = audioBuffersTV[key];
	}
	else {
		audioBuffer = audioBuffersZE[key];
	}

	let sourceNode = audioContext.createBufferSource();
	sourceNode.buffer = audioBuffer;

	sourceNode.connect(audioContext.destination);

	sourceNode.onended = finishedHandler;

	sourceNode.start();

}

function downloadAudioFileToBuffer(number, traditionellVerdrehtEnabled, finishedHandler) {

	let mp3uri = 'mp3/';

	if (location.host == 'zwanzigeins.jetzt') {
		mp3uri = '../app/mp3/';
	}

	if (traditionellVerdrehtEnabled) {
		mp3uri += 'traditionell-verdreht';
	}
	else {
		mp3uri += 'zehneins';
	}


	if (number < 10) {
		number = '00' + number;
	}
	else if (number < 100) {
		number = '0' + number;
	}

	mp3uri += '/rate-100/audio-' + number + '.mp3';

	fetch(mp3uri)
		.then(response => {

			return response.arrayBuffer();
		})
		.then(arrayBuffer => {

			return audioContext.decodeAudioData(arrayBuffer);
		})
		.then(audioBuffer => {
			
			let key = "_" + number;

			if (traditionellVerdrehtEnabled) {
				audioBuffersTV[key] = audioBuffer;
			}
			else {
				audioBuffersZE[key] = audioBuffer;
			}

			finishedHandler();
		})
		.catch(() => {
			alert('Fehler beim Herunterladen von ' + mp3uri);
		})
		;

}


function millisToMinutesAndSeconds(millis) {

	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}