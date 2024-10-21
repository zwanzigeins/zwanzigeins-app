export default class TwistedSpeechInputConverter {

	convertTwistedSpeechRecognition(arity, speechRecognitionEvent) {
		
		let rightTranscript;		
		let maxWhiteSpaces = 0;		
		
		let speechRecognitionResultList = speechRecognitionEvent.results[0];
		
		for (let speechRecognitionAlternative of speechRecognitionResultList) {

			let transcript = speechRecognitionAlternative.transcript;
			
			// iphone sometimes has number-words in it's transcript
			transcript = transcript.toLowerCase();
			
			transcript = transcript
				.replaceAll('.', ' ')
				.replaceAll(',', ' ')
				.replaceAll('-', ' ')
				.replaceAll(':', ' ')
				.replaceAll('/', ' ')
				.replaceAll('eins', '1')
				.replaceAll('zwei', '2')
				.replaceAll('II', '2')
				.replaceAll('drei', '3')
				.replaceAll('vier', '4')
				.replaceAll('fünf', '5')
				.replaceAll('sechs', '6')
				.replaceAll('sieben', '7')
				.replaceAll('acht', '8')
				.replaceAll('neun', '9')
				.replaceAll('zehn', '10')
				.replaceAll('zwanzig', '20')
				.replaceAll('dreißig', '30')
				.replaceAll('vierzig', '40')
				.replaceAll('fünfzig', '50')
				.replaceAll('sechzig', '60')
				.replaceAll('siebzig', '70')
				.replaceAll('achtzig', '80')
				.replaceAll('neunzig', '90')
				.replaceAll('hundert', '100')
				;
						
			let numWhitespaces = 0;
			
			let onlyDigitsOrWhitespace = true;
			
			for(let c of transcript) {
				
				if(onlyDigitsOrWhitespace) {
				
					switch(c) {
						
						case ' ':
							numWhitespaces++;
							break;
							
						case '0':	
						case '1':
						case '2':
						case '3':
						case '4':
						case '5':
						case '6':
						case '7':
						case '8':
						case '9':
							break;
							
						default:
							
							onlyDigitsOrWhitespace = false;
							break;
					}
				}
			}
						
			if(onlyDigitsOrWhitespace && numWhitespaces >= maxWhiteSpaces) {
				
				rightTranscript = transcript;
				maxWhiteSpaces = numWhitespaces;
			}
		}
				
		if(maxWhiteSpaces == 0) {
			
			let firstAlternative = speechRecognitionResultList[0];
			let transcript = firstAlternative.transcript;
			
			var digitsOnlyRegex = /^\d+$/;
			
			if(digitsOnlyRegex.test(transcript)) {
				
				// insert whitespace before last character
			    let preparedTranscript = transcript.substring(0, transcript.length - 1);
				preparedTranscript += ' ';
				preparedTranscript += transcript.substring(transcript.length - 1);
				
				console.log('preparedTranscript: ' + preparedTranscript);
				
				rightTranscript = preparedTranscript;				
			}
			else {
				return null;
			}
		}
		
		return this.convertTwistedSpeechInput(rightTranscript);
	}

	convertTwistedSpeechInput(speechInput) {

		let numberStrings = [];

		let currentNumberString = '';

		for (let i = 0; i < speechInput.length; i++) {

			let c = speechInput.charAt(i);
			let isDigit = /^\d+$/.test(c);

			if (isDigit) {
				currentNumberString += c;
			}
			else {

				if (currentNumberString != '') {

					numberStrings.push(currentNumberString);
					currentNumberString = '';
				}
			}
		}

		// handle potentially leftover segment
		if (currentNumberString != '') {
			numberStrings.push(currentNumberString);
		}

		if (numberStrings.length == 0) {
			return -1;
		}

		let resultNumber = 0;

		let currentMultiplicator;

		for (let i = 0; i < numberStrings.length; i++) {

			let numberString = numberStrings[i];
			let number = parseInt(numberString);

			if (numberString.length == 2) {

				currentMultiplicator = number;
			}
			else if (numberString.length == 1) {

				if (currentMultiplicator) {
					currentMultiplicator += number;
				}
				else {
					currentMultiplicator = number;
				}
			}
			else {

				let c = numberString.charAt(numberString.length - 1);

				if (c == '1') {

					resultNumber += currentMultiplicator * number;
				}
				else {
					resultNumber += number;
				}

				currentMultiplicator = 0;
			}
		}

		if (currentMultiplicator > 0) {
			resultNumber += currentMultiplicator;
		}

		return resultNumber;
	}

}