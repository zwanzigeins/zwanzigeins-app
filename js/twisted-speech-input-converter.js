export default class TwistedSpeechInputConverter {

	convertTwistedSpeechRecognition(speechRecognitionEvent) {

		let speechRecognitionResultList = speechRecognitionEvent.results[0];
		
		let rightTranscript;
		
		let maxWhiteSpaces = 0;		
		
		for (let speechRecognitionAlternative of speechRecognitionResultList) {

			let transcript = speechRecognitionAlternative.transcript;
			
			let numWhitespaces = 0;
			
			let onlyDigitsOrWhitespace = true;
			
			for(let c of transcript) {
				
				if(onlyDigitsOrWhitespace) {
				
					switch(c) {
						
						case ' ':
							numWhitespaces++;
							break;
							
						case ',':
						case '.':
							
							// consider version with comma or dot
							// as potentially right candidate 
							if(!rightTranscript) {
								rightTranscript = transcript; 
							}
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
			return null;
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