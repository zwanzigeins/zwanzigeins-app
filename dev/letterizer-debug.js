import Letterizer from '../js/letterizer.js';

let letterizer = new Letterizer();

let numberWord = letterizer.letterizeZehnEinsNumber(21321);

console.log('21321:' + numberWord);

numberWord = letterizer.letterizeZehnEinsNumber(11321);

console.log('11321: ' + numberWord);