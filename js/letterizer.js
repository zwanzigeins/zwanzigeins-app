export default class Letterizer {

	letterizeZehnEinsNumber(num) {
		
		if(num > 999999999999){
			throw new Exception('unsupported number');
		}

		num = num.toString();

		var word = '';
		var numLength = num.length;

		for (var i = 0; i < numLength; i++) {
			
			var digit = parseInt(num.charAt(i));

			var arity = numLength - i;
			switch (digit) {
				
				case 1:
					if (arity > 2) {
						word += this.getArityWord(arity);
					}
					else if (arity == 2) {
						word += 'zehn';
					}
					else {
						word += 'eins';
					}
					break;
					
				case 2:
					word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig');
					break;
					
				case 3:
					word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig');
					break;
					
				case 4:
					word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig');
					break;
					
				case 5:				
					word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig');
					break;
					
				case 6:				
					word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig');
					break;
					
				case 7:
					word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig');
					break;
					
				case 8:
					word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig');
					break;
					
				case 9:
					word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig');
					break;
			}
			
			word += ' ';
		}

		return word;
	}
	
	letterizeDigitZehnEins(arity, digitName, twoArityName) {
		
		var res;
		if (arity == 2) {
			res = twoArityName;
		}
		else {
			res = digitName;
			if (arity > 2) {
				res += this.getArityWord(arity);
			}
		}
		return res;
	}
	
	letterizeZwanzigEinsNumber(num) {

		num = num.toString();

		var word = '';
		var numLength = num.length;
		var arity = numLength - i;

		for (var i = 0; i < numLength; i++) {
			var digit = parseInt(num.charAt(i));

			if (arity == 2 && digit == 1) {

				word += num.substring(i);
				return word;
			}

			switch (digit) {
				case 1:
					if (arity > 2) {
						word += this.getArityWord(arity);
					}
					else if (arity == 2) {
						word += 'zehn';
					}
					else {
						word += 'eins';
					}
					break;
				case 2:
					word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig', digit);
					break;
				case 3:
					word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig', digit);
					break;
				case 4:
					word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig', digit);
					break;
				case 5:
					word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig', digit);
					break;
				case 6:
					word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig', digit);
					break;
				case 7:
					word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig', digit);
					break;
				case 8:
					word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig', digit);
					break;
				case 9:
					word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig', digit);
					break;
			}
			word += ' ';

		}

		return word;
	}

	letterizeZwanzigEinsNumberEndnull(num) {

		num = num.toString();

		var word = '';
		var numLength = num.length;

		for (var i = 0; i < numLength; i++) {
			var digit = parseInt(num.charAt(i));

			var arity = numLength - i;

			if (arity == 2 && digit == 1) {

				word += num.substring(i);
				return word;
			}

			switch (digit) {
				
				case 0:
					if (arity == 1) {//only letterize zero when arity == 1
						word += 'null'
					}
					break;
					
				case 1:
					if (arity > 2) {
						word += this.getArityWord(arity);
					}
					else if (arity == 2) {
						word += 'zehn';
					}
					else {
						word += 'eins';
					}
					break;
				case 2:
					word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig', digit);
					break;
				case 3:
					word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig', digit);
					break;
				case 4:
					word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig', digit);
					break;
				case 5:
					word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig', digit);
					break;
				case 6:
					word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig', digit);
					break;
				case 7:
					word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig', digit);
					break;
				case 8:
					word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig', digit);
					break;
				case 9:
					word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig', digit);
					break;
			}
			word += ' ';

		}

		return word;
	}

	letterizeZehnEinsNumberEndnull(num) {

		num = num.toString();

		var word = '';
		var numLength = num.length;

		for (var i = 0; i < numLength; i++) {
			var digit = parseInt(num.charAt(i));

			var arity = numLength - i;
			switch (digit) {
				case 0:
					if (arity == 1) {//only letterize zero when arity == 1
						word += 'null'
					}
					break;
				case 1:
					if (arity > 2) {
						word += this.getArityWord(arity);
					}
					else if (arity == 2) {
						word += 'zehn';
					}
					else {
						word += 'eins';
					}
					break;
				case 2:
					word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig');
					break;
				case 3:
					word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig');
					break;
				case 4:
					word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig');
					break;
				case 5:
					word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig');
					break;
				case 6:
					word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig');
					break;
				case 7:
					word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig');
					break;
				case 8:
					word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig');
					break;
				case 9:
					word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig');
					break;
			}
			word += ' ';

		}

		return word;
	}

	letterizeVerdreht(num) {

		return num;
	}

	getArityWord(arity) {

		switch (arity) {
			
			case 10:
				return 'milliarde';
			
			case 7:
				return 'million';
				
			case 4:
				return 'tausend';
				
			case 3:
				return 'hundert';
		}
	}
	
	getTwoArityName(digit) {
		
		switch(digit){
		
		case 1:
			return 'zehn';
			
		case 2:
			return 'zwanzig';
			
		case 3:
			return 'dreißig';
			
		case 4:
			return 'vierzig';
			
		case 5:
			return 'fünfzig';
			
		case 6:
			return 'sechzig';
			
		case 7:
			return 'siebzig';
			
		case 8:
			return 'achtzig';
			
		case 9:
			return 'neunzig';
		}
	}
	
	getArityPrefix(digit, pluralEnabled) {
		
		switch(digit){
		
		case 1:
			if(pluralEnabled){
				return 'eine';
			}
			else {
				return 'ein';
			}
			
		case 2:
			return 'zwei';
			
		case 3:
			return 'drei';
			
		case 4:
			return 'vier';
			
		case 5:
			return 'fünf';
			
		case 6:
			return 'sechs';
			
		case 7:
			return 'sieben';
			
		case 8:
			return 'acht';
			
		case 9:
			return 'neun';
		}
	}

}