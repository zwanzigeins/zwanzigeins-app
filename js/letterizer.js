export default class Letterizer {

	letterizeZehnEinsNumber(number) {

		if (number > 999999999999) {
			throw new Exception('unsupported number');
		}

		number = number.toString();

		var mode = 'zehneins';
		var triplesArray = this.splitNumber(number);
		var word = this.letterizeNumber(triplesArray, mode);

		return word;
	}

	letterizeZehnEinsNumberEndnull(number) {

		var word = this.letterizeZehnEinsNumber(number);
		word = this.addEndNull(word, number);

		return word;
	}

	letterizeZwanzigEinsNumber(number) {

		if (number > 999999999999) {
			throw new Exception('unsupported number');
		}

		number = number.toString();

		var mode = 'zwanzigeins';
		var numberArray = this.splitNumber(number);
		var word = this.letterizeNumber(numberArray, mode);

		return word;
	}

	letterizeTraditionellVerdrehtNumber(number) {

		if (number > 999999999999) {
			throw new Exception('unsupported number');
		}

		number = number.toString();

		var mode = 'traditionellVerdreht';
		var numberArray = this.splitNumber(number);
		var word = this.letterizeNumber(numberArray, mode);

		return word;
	}

	letterizeZwanzigEinsNumberEndnull(number) {

		var word = this.letterizeZwanzigEinsNumber(number);
		word = this.addEndNull(word, number);

		return word;
	}

	addEndNull(word, number) {

		number = number.toString();

		var numberLength = number.length;
		var lastDigit = number.charAt(numberLength - 1);

		if (lastDigit == '0') {
			word += ' null';
		}

		return word;
	}

	letterizeNumber(triplesArray, mode) {

		let numberWordArray = [];
		let triplesArrayLength = triplesArray.length;
		let mainArity = triplesArrayLength;

		for (let i = 0; i < triplesArrayLength; i++) {

			let triple = triplesArray[i];
			let subArity = triple.length;

			let tripleWordArray = [];

			for (let y = 0; y < triple.length; y++) {

				let digit = triple.charAt(y);

				if (mode == 'zehneins') {
					
					let digitWord = this.getDigitWord(digit, subArity);
					if(digitWord != ''){
						tripleWordArray.push(digitWord);
					}
						
					subArity--;
				}
				else if (mode == 'zwanzigeins') {

					if (subArity == 2 && digit == '1') {

						let lastDigit = triple.charAt(triple.length - 1);
						tripleWordArray.push(this.getDigitWordTenner(lastDigit));
						break;
					}
					else {

						let digitWord = this.getDigitWord(digit, subArity);
						if(digitWord != ''){
							tripleWordArray.push(digitWord);
						}
						subArity--;
					}
				}
				else if (mode == 'traditionellVerdreht') {

					let digitWord = this.getDigitWord(digit, subArity);

					if (subArity == 2 && digit != '0') {

						if(digit == '1') {
							
							let lastDigit = triple.charAt(triple.length - 1);
							tripleWordArray.push(this.getDigitWordTenner(lastDigit));
							break;
						}
						else {

							let lastDigit = triple.charAt(triple.length - 1);						

							if(lastDigit != '0') {

								let lastDigitWord = this.getDigitWord(lastDigit, 1);

								if(lastDigitWord == 'eins') {
									lastDigitWord = 'ein';
								}
	
								digitWord = lastDigitWord + 'und' + digitWord;
							}
							
							if(digitWord != ''){
								tripleWordArray.push(digitWord);
							}

							break;
						}
					}
					else {
						
						if(digitWord != ''){
							tripleWordArray.push(digitWord);
						}
						
						subArity--;						
					}
				}
			}

			let mainArityWord = this.getMainArityWord(mainArity);

			let lastTripleDigitWord = tripleWordArray[tripleWordArray.length - 1];

			if (lastTripleDigitWord == 'eins' && tripleWordArray.length == 1) {

				switch (mainArityWord) {

					case 'tausend':
						tripleWordArray[tripleWordArray.length - 1] = 'ein';
						break;

					case 'millionen':
						tripleWordArray[tripleWordArray.length - 1] = 'eine';
						mainArityWord = 'million';
						break;
						
					case 'milliarden':
						tripleWordArray[tripleWordArray.length - 1] = 'eine';
						mainArityWord = 'milliarde';
						break;
				}
			}

			let tripleWord = tripleWordArray.join(' ');

			if(mainArityWord != '') {
				numberWordArray.push(tripleWord + ' ' + mainArityWord);
			}
			else {
				numberWordArray.push(tripleWord);
			}
			
			mainArity--;
		}
		
		let numberWord = numberWordArray.join(' ');

		return numberWord;
	}


	getMainArityWord(mainArity) {

		switch (mainArity) {
			case 2: return 'tausend';
			case 3: return 'millionen';
			case 4: return 'milliarden';
		}

		return '';
	}

	getDigitWord(digit, subArity) {

		switch (digit) {
			case '1':
				if (subArity == 1) return 'eins';
				if (subArity == 2) return 'zehn';
				if (subArity == 3) return 'hundert';
			case '2':
				if (subArity == 1) return 'zwei';
				if (subArity == 2) return 'zwanzig';
				if (subArity == 3) return 'zweihundert';
			case '3':
				if (subArity == 1) return 'drei';
				if (subArity == 2) return 'dreißig';
				if (subArity == 3) return 'dreihundert';
			case '4':
				if (subArity == 1) return 'vier';
				if (subArity == 2) return 'vierzig';
				if (subArity == 3) return 'vierhundert';
			case '5':
				if (subArity == 1) return 'fünf';
				if (subArity == 2) return 'fünfzig';
				if (subArity == 3) return 'fünfhundert';
			case '6':
				if (subArity == 1) return 'sechs';
				if (subArity == 2) return 'sechzig';
				if (subArity == 3) return 'sechshundert';
			case '7':
				if (subArity == 1) return 'sieben';
				if (subArity == 2) return 'siebzig';
				if (subArity == 3) return 'siebenhundert';
			case '8':
				if (subArity == 1) return 'acht';
				if (subArity == 2) return 'achtzig';
				if (subArity == 3) return 'achthundert';
			case '9':
				if (subArity == 1) return 'neun';
				if (subArity == 2) return 'neunzig';
				if (subArity == 3) return 'neunhundert';
		}

		return '';
	}

	getDigitWordTenner(lastDigit) {

		switch (lastDigit) {
			case '0': return 'zehn';
			case '1': return 'elf';
			case '2': return 'zwölf';
			case '3': return 'dreizehn';
			case '4': return 'vierzehn';
			case '5': return 'fünfzehn';
			case '6': return 'sechzehn';
			case '7': return 'siebzehn';
			case '8': return 'achtzehn';
			case '9': return 'neunzehn';
		}

		return '';
	}

	splitNumber(number) {

		var numberArray = [];
		var numberLength = number.length;
		var cnt = 1;
		var digit = '';

		for (var i = 0; i < numberLength; i++) {

			digit = number.charAt(numberLength - 1 - i) + digit;

			if (cnt == 3 || i == numberLength - 1) {

				numberArray.splice(0, 0, digit);
				cnt = 1;
				digit = '';
			}
			else {
				cnt++;
			}
		}

		return numberArray;
	}
}