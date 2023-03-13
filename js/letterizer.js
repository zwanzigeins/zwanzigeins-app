export default class Letterizer {

	letterizeZehnEinsNumber(number) {
		
		if(number > 999999999999){
			throw new Exception('unsupported number');
		}

		number = number.toString();
		
		var mode = 1;
		var numberArray = this.splitNumber(number);
		var word = this.letterizeNumber(numberArray, mode);

		return word;
	}

	letterizeZehnEinsNumberEndnull(number) {

		var word = this.letterizeZehnEinsNumber(number);
		word = this.addEndNull(word, number);

		return word;
	}

	letterizeZwanzigEinsNumber(number) {

		if(number > 999999999999){
			throw new Exception('unsupported number');
		}

		number = number.toString();
		
		var mode = 2;
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

		if(lastDigit == '0') {
			word += ' null';
		}

		return word;
	}

	letterizeNumber(numberArray, mode) {

		var numberWord = '';
		var numberWordArray = [];
		var numberArrayLength = numberArray.length;
		var mainArity = numberArrayLength;

		for(var i = 0; i < numberArrayLength; i++) {

			var number = numberArray[i];
			var numberLength = number.length;
			var subArity = numberLength;

			for(var y = 0; y < numberLength; y++) {

				var digit = number.charAt(y);
				if(mode == 1) {

					numberWordArray.push(this.getDigitWord(digit, subArity));
					subArity--; 
				}
				else if(mode == 2) {

					if(subArity == 2 && digit == '1') {

						var lastDigit = number.charAt(numberLength - 1);
						numberWordArray.push(this.getDigitWordTenner(lastDigit));
						break;
					}
					else {

						numberWordArray.push(this.getDigitWord(digit, subArity));
						subArity--; 
					}
				}
			}

			numberWordArray.push(this.getMainArityWord(mainArity));
			mainArity--;
		}

		numberWord = this.getCleanNumberWord(numberWordArray);

		return numberWord;
	}

	getCleanNumberWord(numberWordArray) {

		var filteredNumberWordArray = numberWordArray.filter(a => a !== '');
		var firstWord = filteredNumberWordArray[0];

		if(firstWord == 'eins' && filteredNumberWordArray.length > 1) {

			var secondWord = filteredNumberWordArray[1];

			switch(secondWord) {
				case 'tausend' : filteredNumberWordArray[0] = 'ein'; break;
				case 'millionen': filteredNumberWordArray[0] = 'eine'; break;
				case 'milliarden': 	filteredNumberWordArray[0] = 'eine';
									filteredNumberWordArray[1] = 'milliarde'; 
									break;
			}
		}

		var numberWord = filteredNumberWordArray.join(' ');

		return numberWord;
	}

	getMainArityWord(mainArity) {

		switch(mainArity) {
			case 2: return 'tausend';
			case 3: return 'millionen';
			case 4: return 'milliarden';
		}

		return '';
	}

	getDigitWord(digit, subArity) {

		switch(digit) {
			case '1':
				if(subArity == 1) return 'eins';
				if(subArity == 2) return 'zehn';
				if(subArity == 3) return 'hundert';
			case '2':
				if(subArity == 1) return 'zwei';
				if(subArity == 2) return 'zwanzig';
				if(subArity == 3) return 'zwei hundert';
			case '3':
				if(subArity == 1) return 'drei';
				if(subArity == 2) return 'dreißig';
				if(subArity == 3) return 'drei hundert';
			case '4':
				if(subArity == 1) return 'vier';
				if(subArity == 2) return 'vierzig';
				if(subArity == 3) return 'vier hundert';
			case '5':
				if(subArity == 1) return 'fünf';
				if(subArity == 2) return 'fünfzig';
				if(subArity == 3) return 'fünf hundert';
			case '6':
				if(subArity == 1) return 'sechs';
				if(subArity == 2) return 'sechzig';
				if(subArity == 3) return 'sechs hundert';
			case '7':
				if(subArity == 1) return 'sieben';
				if(subArity == 2) return 'siebzig';
				if(subArity == 3) return 'sieben hundert';
			case '8':
				if(subArity == 1) return 'acht';
				if(subArity == 2) return 'achtzig';
				if(subArity == 3) return 'acht hundert';
			case '9':
				if(subArity == 1) return 'neun';
				if(subArity == 2) return 'neunzig';
				if(subArity == 3) return 'neun hundert';
		}

		return '';
	}

	getDigitWordTenner(lastDigit) {

		switch(lastDigit) {
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
			
			digit = number.charAt(numberLength -1 -i) + digit;
			
			if(cnt == 3 || i == numberLength - 1) {
				
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