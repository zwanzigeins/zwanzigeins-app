import TwistedSpeechInputConverter from '../js/twisted-speech-input-converter.js';

let twistedSpeechInputConverter = new TwistedSpeechInputConverter();


describe('twistedSpeechInputConverter', () => {
	
	let input = '320 1';
		
	it(input, () => {
		expect(twistedSpeechInputConverter.convertTwistedSpeechInput(input))
		.toEqual(321);
	});	
});

describe('twistedSpeechInputConverter', () => {
	
	let input = '1000 1';
		
	it(input, () => {
		expect(twistedSpeechInputConverter.convertTwistedSpeechInput(input))
		.toEqual(1001);
	});	
});
