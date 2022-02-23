import Options from './options.js';
import MentalArithmeticGameLevel from './mental-arithmetic-game-level.js';

export default class MentalArithmeticGame {

	constructor(sound, pages) {

		this.defaultOptions = {
			numTasks: 10,
			fullscreen: false,
			auditive: false
		};

		this.options = new Options('mentalArithmeticMenu', this.defaultOptions);
		
		let startAnchorElems = document.querySelectorAll('[id$="choose-level"] .btnStart');
		
		for(let elem of startAnchorElems){
			
			elem.onclick = evt => {
				
				let elem = evt.target
				let levelName = elem.dataset.level;
				let levelOptions = this.getPredefinedLevelOptions(levelName);
				
				if(this.options.auditive){
					levelOptions['auditive'] = true;
				}
				
				levelOptions['numTasks'] = this.options.numTasks;
				
				let level = new MentalArithmeticGameLevel(sound, pages, levelOptions);
				level.startGame();
			}		
		}

		// TODO restore
		//		this.ensureFromSmallerThanTo(pageElem, 'from1', 'to1');
		//		this.ensureFromSmallerThanTo(pageElem, 'from2', 'to2');

		// declare empty variables for documentation
		this.rightResult;
		this.rightResultStr;

		this.wrongAnswerOccured;
		this.wrongAnswerTimeStamp;

		this.tasksPut = 0;
		this.gameStartTimeStamp;
	}

	ensureFromSmallerThanTo(optionsPageElem, fromInputName, toInputName) {

		let fromInputSelector = '[name="' + fromInputName + '"]';
		let toInputSelector = '[name="' + toInputName + '"]';

		let fromInputElem = optionsPageElem.querySelector(fromInputSelector);
		let toInputElem = optionsPageElem.querySelector(toInputSelector);

		function setMinOnTo() {

			let val = fromInputElem.value;
			let intVal = parseInt(val);
			let toMin = intVal + 1;
			toInputElem.min = toMin;
		}
		setMinOnTo();

		function setMaxOnFrom() {

			let val = toInputElem.value;
			let intVal = parseInt(val);
			let fromMax = intVal - 1;
			fromInputElem.max = fromMax;
		}
		setMaxOnFrom();

		fromInputElem.addEventListener('input', setMinOnTo);
		toInputElem.addEventListener('input', setMaxOnFrom);

		let onBlur = e => {

			let elem = e.target;

			if (!elem.value || isNaN(elem.value)) {
				let defaultVal = this.defaultOptions[elem.name];
				elem.value = defaultVal;
			}

			let intVal = parseInt(elem.value);
			if (elem.min) {
				let intMin = elem.min;
				if (intVal < intMin) {
					elem.value = elem.min;
					let evt = new Event('input');
					elem.dispatchEvent(evt);
				}
			}
			if (elem.max) {
				let intMax = elem.max;
				if (intVal > intMax) {
					elem.value = elem.max;
					let evt = new Event('input');
					elem.dispatchEvent(evt);
				}
			}
		};

		fromInputElem.addEventListener('blur', onBlur);
		toInputElem.addEventListener('blur', onBlur);
	}

	getPredefinedLevelOptions(levelName) {

		let levelOptions = {};
		
		switch (levelName) {

			case 'addition-easy':

				this.appendAdditionEasy(levelOptions);
				break;

			case 'addition-medium':

				this.appendAdditionMedium(levelOptions);
				break;
				
			case 'addition-hard':

				this.appendAdditionHard(levelOptions);
				break;
				
			case 'subtraction-easy':

				this.appendSubtractionEasy(levelOptions);
				break;

			case 'subtraction-medium':

				this.appendSubtractionMedium(levelOptions);
				break;
				
			case 'subtraction-hard':

				this.appendSubtractionHard(levelOptions);				
				break;
				
			case 'addition-subtraction-easy':
			
				this.appendAdditionEasy(levelOptions);
				this.appendSubtractionEasy(levelOptions);
				break;
				
			case 'addition-subtraction-medium':
			
				this.appendAdditionMedium(levelOptions);
				this.appendSubtractionMedium(levelOptions);
				break;
				
			case 'addition-subtraction-hard':
			
				this.appendAdditionHard(levelOptions);
				this.appendSubtractionHard(levelOptions);
				break;
				
			case 'multiplication-easy':
				
				this.appendMultiplicatonEasy(levelOptions);
				break;
				
			case 'multiplication-medium':
				
				this.appendMultiplicatonMedium(levelOptions);
				break;
				
			case 'multiplication-hard':
				
				this.appendMultiplicatonHard(levelOptions);
				break;
				
			case 'division-easy':
				
				this.appendDivisionEasy(levelOptions);
				break;
				
			case 'division-medium':
				
				this.appendDivisionMedium(levelOptions);
				break;
				
			case 'division-hard':
				
				this.appendDivisionHard(levelOptions);
				break;
				
			case 'multiplication-division-easy':
				
				this.appendMultiplicatonEasy(levelOptions);
				this.appendDivisionEasy(levelOptions);
				break;
				
			case 'multiplication-division-medium':
				
				this.appendMultiplicatonMedium(levelOptions);
				this.appendDivisionMedium(levelOptions);
				break;
				
			case 'multiplication-division-hard':
				
				this.appendMultiplicatonHard(levelOptions);
				this.appendDivisionHard(levelOptions);
				break;
				
			case 'mixed-easy':
			
				this.appendAdditionEasy(levelOptions);
				this.appendSubtractionEasy(levelOptions);
				this.appendMultiplicatonEasy(levelOptions);
				this.appendDivisionEasy(levelOptions);
				break;
				
			case 'mixed-medium':
			
				this.appendAdditionMedium(levelOptions);
				this.appendSubtractionMedium(levelOptions);
				this.appendMultiplicatonMedium(levelOptions);
				this.appendDivisionMedium(levelOptions);
				break;
				
			case 'mixed-hard':
			
				this.appendAdditionHard(levelOptions);
				this.appendSubtractionHard(levelOptions);
				this.appendMultiplicatonHard(levelOptions);
				this.appendDivisionHard(levelOptions);
				break;
				
		}

		levelOptions['levelName'] = levelName;
		for(let propertyKey in levelOptions){

			switch(propertyKey){
				case 'plus':
				case 'minus':
				case 'multiply':
				case 'divide':
				levelOptions[propertyKey].enabled = true;
			}		
		}

		return levelOptions;
	}
	
	appendAdditionEasy(levelOptions){
		
		levelOptions.plus = {
			from1: 2,
			to1: 20,
			from2: 2,
			to2: 20
		}
	}
	
	appendAdditionMedium(levelOptions){
		
		levelOptions.plus = {
			from1: 11,
			to1: 100,
			from2: 11,
			to2: 100
		}
	}
	
	appendAdditionHard(levelOptions){
		
		levelOptions.plus = {
			from1: 11,
			to1: 500,
			from2: 11,
			to2: 500
		}
	}
	
	appendSubtractionEasy(levelOptions){
		
		levelOptions.minus = {
			from1: 2,
			to1: 20,
			from2: 2,
			to2: 20
		}
	}
	
	appendSubtractionMedium(levelOptions){
		
		levelOptions.minus = {
			from1: 11,
			to1: 100,
			from2: 11,
			to2: 100
		}
	}
	
	appendSubtractionHard(levelOptions){
		
		levelOptions.minus = {
			from1: 11,
			to1: 500,
			from2: 11,
			to2: 500
		}
	}
	
	appendMultiplicatonEasy(levelOptions){
		
		levelOptions.multiply = {
			from1: 2,
			to1: 5,
			from2: 2,
			to2: 5
		}
	}
	
	appendMultiplicatonMedium(levelOptions){
		
		levelOptions.multiply = {
			from1: 2,
			to1: 9,
			from2: 2,
			to2: 9
		}
	}
	
	appendMultiplicatonHard(levelOptions){
		
		levelOptions.multiply = {
			from1: 5,
			to1: 20,
			from2: 5,
			to2: 20
		}
	}
	
	appendDivisionEasy(levelOptions){
		
		levelOptions.divide = {
			from1: 10,
			to1: 30,
			from2: 2,
			to2: 5
		}
	}
	
	appendDivisionMedium(levelOptions){
		
		levelOptions.divide = {
			from1: 10,
			to1: 100,
			from2: 2,
			to2: 9
		}
	}
	
	appendDivisionHard(levelOptions){
		
		levelOptions.divide = {
			from1: 100,
			to1: 1000,
			from2: 2,
			to2: 20
		}
	}

}