import SvgCreator from '../js/svg-creator.js';
import * as fs from 'fs';

let gameScores = [];

let now = new Date();
let isoString = now.toISOString();
let lastColonIdx = isoString.lastIndexOf(':');
let timeStamp = isoString.substring(0, lastColonIdx);

let twistedSpeechMode = 'zehneins';
let speechRate = '1';
let profileName = 'Tester';
let elapsedTime = '1:07';
let numErrors = 2;
let gameOptions = [];

let gameScoreEntry = {

    timeStamp,
    profileName,
    twistedSpeechMode,
    speechRate,
    elapsedTime,
    numErrors,
    gameOptions
}

gameScores.push(gameScoreEntry);

twistedSpeechMode = 'zwanzigeins';
elapsedTime = '1:45';
numErrors = 4;

gameScoreEntry = {

    timeStamp,
    profileName,
    twistedSpeechMode,
    speechRate,
    elapsedTime,
    numErrors,
    gameOptions
}

gameScores.push(gameScoreEntry);

twistedSpeechMode = 'zehneins(endnull)';
elapsedTime = '0:37';
numErrors = 1;

gameScoreEntry = {

    timeStamp,
    profileName,
    twistedSpeechMode,
    speechRate,
    elapsedTime,
    numErrors,
    gameOptions
}

gameScores.push(gameScoreEntry);

let svgCreator = new SvgCreator(gameScores);


let statisticsSvg = svgCreator.createStatisticsSvg();
fs.writeFileSync('local/diagram.svg', statisticsSvg);