import Letterizer from '../js/letterizer.js';

let letterizer = new Letterizer();

describe('letterizer - zehneins', () => {
		
	let numberWord = letterizer.letterizeZehnEinsNumber(1111111111);
		
	it('1111111111', () => {
		expect(numberWord).toEqual('einemilliarde hundertzehneinsmillionen hundertzehneinstausend hundertzehneins');
	});	
});

describe('letterizer - zehneins-endnull', () => {
		
	let numberWord = letterizer.letterizeZehnEinsNumberEndnull(1111111110);
	
	it('1111111110', () => {
		expect(numberWord).toEqual('einemilliarde hundertzehneinsmillionen hundertzehneinstausend hundertzehn null');
	});	
});

let zwanzigEinsNumber = letterizer.letterizeZwanzigEinsNumber(1111111111);
let zwanzigEinsNumberEndNull = letterizer.letterizeZwanzigEinsNumberEndnull(1111111110);

console.log('zwanzigEinsNumber: ' + zwanzigEinsNumber);
console.log('zwanzigEinsNumberEndNull: ' + zwanzigEinsNumberEndNull);