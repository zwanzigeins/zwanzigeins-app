export default class Utils {

	static addPressHandler(elem, handler) {

		function processEvent(elem, evt) {
			// Füge für Berührungsfeedback touching-Klasse hinzu
			elem.classList.add('touching');
			handler(evt);
			// Entferne Berührungsfeedback nach 100ms
			setTimeout(function() {
				elem.classList.remove('touching');
			}, 100);
		}

		elem.addEventListener('touchdown', evt => {

			processEvent(elem, evt);
			evt.preventDefault();
			evt.stopPropagation();
			elem.touchFired = true;

		}, true);

		elem.addEventListener('mousedown', evt => {

			if (!elem.touchFired) {
				processEvent(elem, evt);
				elem.touchFired = false;
			}

		}, true);
	}

	static setPressHandler(elem, handler) {

		function processEvent(elem, evt) {
			// Füge für Berührungsfeedback touching-Klasse hinzu
			elem.classList.add('touching');
			handler(evt);
			// Entferne Berührungsfeedback nach 100ms
			setTimeout(function() {
				elem.classList.remove('touching');
			}, 100);
		}

		elem.ontouchstart = evt => {

			processEvent(elem, evt);
			evt.preventDefault();
			evt.stopPropagation();
			elem.touchFired = true;
		};

		elem.onmousedown = evt => {

			if (!elem.touchFired) {
				processEvent(elem, evt);
				elem.touchFired = false;
			}
		};
	}

	static getQueryParams() {

		let queryDict = {};
		location.search.substr(1).split("&").forEach(
			item => {
				queryDict[item.split("=")[0]] = item.split("=")[1]
			}
		)

		return queryDict;
	}

	/**
	 * Loads options from localStorage. Copies every property from saved options
	 * to targetObject. That way default-settings and migrations are easy to
	 * accomplish.
	 * 
	 * @param {string}
	 *            key - key in localStorage
	 * @param {object}
	 *            targetObject - a pre-initialized object with
	 *            option-properties.
	 */
	static loadOptions(key, targetObject) {

		var optionsJson = localStorage.getItem(key);
		if (optionsJson) {
			var savedOptions = JSON.parse(optionsJson);

			// transfer newly introduced options, that were not saved
			for (var propertyKey in savedOptions) {
				if (typeof targetObject[propertyKey] != 'undefined') {
					targetObject[propertyKey] = savedOptions[propertyKey];
				}
			}
		}
	}

	static numberifySpeechResult(resultText) {

		let numberStrings = [];

		let currentNumberString = '';

		for (let i = 0; i < resultText.length; i++) {

			let c = resultText.charAt(i);
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
	
	static getTimeStampWithMinutesPrecision(){
		
		let now = new Date();
			
		let timestamp = '';
		
		let fullYear = now.getFullYear();
		timestamp += fullYear;
		
		let month = now.getMonth() + 1;
		if(month < 10){
			timestamp += '0';
		}
		timestamp += month;
		
		let date = now.getDate();
		if(date < 10){
			timestamp += '0';
		}
		timestamp += date;
		
		let timeString = now.toLocaleTimeString();
		
		timestamp += 'T' + timeString.replaceAll(':', '');
		
		return timestamp;		
	}
	
	static parseTimeToSeconds(minutesSecondsTimeStr){
		
		let timeParts = minutesSecondsTimeStr.split(':');
		let minutes = parseInt(timeParts[0]);
		let seconds = parseInt(timeParts[1]);
		
		let result = minutes * 60 + seconds;
		
		return result;
	}
}
