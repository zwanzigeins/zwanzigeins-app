import Letterizer from '../js/letterizer.js';

let letterizer = new Letterizer();
let zehnEinsNumber = letterizer.letterizeZehnEinsNumber(1111111111);
let zehnEinsNumberEndNull = letterizer.letterizeZehnEinsNumberEndnull(1111111110);
let zwanzigEinsNumber = letterizer.letterizeZwanzigEinsNumber(1111111111);
let zwanzigEinsNumberEndNull = letterizer.letterizeZwanzigEinsNumberEndnull(1111111110);

console.log('zehnEinsNumber: ' + zehnEinsNumber);
console.log('zehnEinsNumberEndNull: ' + zehnEinsNumberEndNull);
console.log('zwanzigEinsNumber: ' + zwanzigEinsNumber);
console.log('zwanzigEinsNumberEndNull: ' + zwanzigEinsNumberEndNull);