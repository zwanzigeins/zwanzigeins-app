import Letterizer from '../js/letterizer.js';

let letterizer = new Letterizer();

describe('letterizer - traditionell-verdreht', () => {
		
	it('20', () => {
		expect(letterizer.letterizeTraditionellVerdrehtNumber(20))
		.toEqual('zwanzig');
	});	

	it('21', () => {
		expect(letterizer.letterizeTraditionellVerdrehtNumber(21))
		.toEqual('einundzwanzig');
	});
		
	it('10000', () => {
		expect(letterizer.letterizeTraditionellVerdrehtNumber(10000))
		.toEqual('zehn tausend ');
	});	
		
	it('102000', () => {
		expect(letterizer.letterizeTraditionellVerdrehtNumber(102000))
		.toEqual('hundert zwei tausend ');
	});	

	it('1131121111', () => {
		expect(letterizer.letterizeTraditionellVerdrehtNumber(1131121111))
		.toEqual('eine milliarde hundert einunddreißig millionen hundert einundzwanzig tausend hundert elf');
	});	
});

describe('letterizer - zehneins', () => {
		
	let numberWord = letterizer.letterizeZehnEinsNumber(1111111111);
		
	it('1111111111', () => {
		expect(numberWord).toEqual('eine milliarde hundert zehn eins millionen hundert zehn eins tausend hundert zehn eins');
	});	
});

describe('letterizer - zehneins-endnull', () => {
		
	let numberWord = letterizer.letterizeZehnEinsNumberEndnull(1111111110);
	
	it('1111111110', () => {
		expect(numberWord).toEqual('eine milliarde hundert zehn eins millionen hundert zehn eins tausend hundert zehn null');
	});	
});

let traditionellVerdrehtNumber = letterizer.letterizeTraditionellVerdrehtNumber(1131121111);
let zwanzigEinsNumber = letterizer.letterizeZwanzigEinsNumber(1111111111);
let zwanzigEinsNumberEndNull = letterizer.letterizeZwanzigEinsNumberEndnull(1111111110);

console.log('traditionellVerdrehtNumber: ' + traditionellVerdrehtNumber);
console.log('zwanzigEinsNumber: ' + zwanzigEinsNumber);
console.log('zwanzigEinsNumberEndNull: ' + zwanzigEinsNumberEndNull);