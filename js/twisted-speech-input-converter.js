export default class TwistedSpeechInputConverter {

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