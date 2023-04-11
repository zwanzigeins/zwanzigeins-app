import NumberGame from './number-game.js';
import Utils from './utils.js';
import Sound from './sound.js';
import MentalArithmeticGameOptions from './mental-arithmetic-game-options.js';

export default class MentalArithmeticGame extends NumberGame{

	constructor() {
		
		super('mental-arithmetic', 'mental-arithmetic-menu', 'mental-arithmetic-game');
		
		this.defaultOptions = this.createDefaultLevelOptions(); 

		this.defaultOptions.numTasks = 5;
		this.defaultOptions.auditive = false;

		this.options = new MentalArithmeticGameOptions('mental-arithmetic-menu', this.defaultOptions);

		let startAnchorElems = document.querySelectorAll('[id$="choose-level"] .btnStart');

		for (let elem of startAnchorElems) {

			elem.onclick = evt => {

				let elem = evt.target
				let levelName = elem.dataset.level;
				let levelOptions = this.getPredefinedLevelOptions(levelName);

				if (this.options.auditive) {
					levelOptions['auditive'] = true;
				}
				else {
					levelOptions['auditive'] = false;
				}

				levelOptions['numTasks'] = this.options.numTasks;
				
				Utils.copyObjectProperties(levelOptions, this.options);
								
				this.startGame();
			}
		}
		
		let defaultLevelOptions = this.createDefaultLevelOptions();
		
		super.initCustomLevelHandling(defaultLevelOptions);
		

		// declare empty variables for documentation
		this.rightResult;
		this.rightResultStr;

		this.wrongAnswerOccured;
		this.wrongAnswerTimeStamp;

		this.tasksPut = 0;
		this.gameStartTimeStamp;
	}

	getPredefinedLevelOptions(levelName) {

		let levelOptions = this.createDefaultLevelOptions();

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
		for (let propertyKey in levelOptions) {

			switch (propertyKey) {
				case 'plus':
				case 'minus':
				case 'multiply':
				case 'divide':
					levelOptions[propertyKey].enabled = true;
			}
		}

		return levelOptions;
	}

	appendAdditionEasy(levelOptions) {
		
		levelOptions['addition-enabled'] = true;
		levelOptions['addition-operand1-from'] = 2;
		levelOptions['addition-operand1-to'] = 20;
		levelOptions['addition-operand2-from'] = 2;
		levelOptions['addition-operand2-to'] = 20;
	}

	appendAdditionMedium(levelOptions) {
		
		levelOptions['addition-enabled'] = true;
		levelOptions['addition-operand1-from'] = 11;
		levelOptions['addition-operand1-to'] = 100;
		levelOptions['addition-operand2-from'] = 11;
		levelOptions['addition-operand2-to'] = 100;
	}

	appendAdditionHard(levelOptions) {
		
		levelOptions['addition-enabled'] = true;
		levelOptions['addition-operand1-from'] = 11;
		levelOptions['addition-operand1-to'] = 500;
		levelOptions['addition-operand2-from'] = 11;
		levelOptions['addition-operand2-to'] = 500;
	}

	appendSubtractionEasy(levelOptions) {
		
		levelOptions['subtraction-enabled'] = true;
		levelOptions['subtraction-operand1-from'] = 2;
		levelOptions['subtraction-operand1-to'] = 20;
		levelOptions['subtraction-operand2-from'] = 2;
		levelOptions['subtraction-operand2-to'] = 20;
	}

	appendSubtractionMedium(levelOptions) {
		
		levelOptions['subtraction-enabled'] = true;
		levelOptions['subtraction-operand1-from'] = 11;
		levelOptions['subtraction-operand1-to'] = 100;
		levelOptions['subtraction-operand2-from'] = 11;
		levelOptions['subtraction-operand2-to'] = 100;
	}

	appendSubtractionHard(levelOptions) {
		
		levelOptions['subtraction-enabled'] = true;
		levelOptions['subtraction-operand1-from'] = 11;
		levelOptions['subtraction-operand1-to'] = 500;
		levelOptions['subtraction-operand2-from'] = 11;
		levelOptions['subtraction-operand2-to'] = 500;
	}

	appendMultiplicatonEasy(levelOptions) {
		
		levelOptions['multiplication-enabled'] = true;
		levelOptions['multiplication-operand1-from'] = 2;
		levelOptions['multiplication-operand1-to'] = 5;
		levelOptions['multiplication-operand2-from'] = 2;
		levelOptions['multiplication-operand2-to'] = 5;
	}

	appendMultiplicatonMedium(levelOptions) {
		
		levelOptions['multiplication-enabled'] = true;
		levelOptions['multiplication-operand1-from'] = 2;
		levelOptions['multiplication-operand1-to'] = 9;
		levelOptions['multiplication-operand2-from'] = 2;
		levelOptions['multiplication-operand2-to'] = 9;
	}

	appendMultiplicatonHard(levelOptions) {
		
		levelOptions['multiplication-enabled'] = true;
		levelOptions['multiplication-operand1-from'] = 5;
		levelOptions['multiplication-operand1-to'] = 20;
		levelOptions['multiplication-operand2-from'] = 5;
		levelOptions['multiplication-operand2-to'] = 20;
	}

	appendDivisionEasy(levelOptions) {
		
		levelOptions['division-enabled'] = true;
		levelOptions['division-operand1-from'] = 10;
		levelOptions['division-operand1-to'] = 30;
		levelOptions['division-operand2-from'] = 2;
		levelOptions['division-operand2-to'] = 5;
	}

	appendDivisionMedium(levelOptions) {
		
		levelOptions['division-enabled'] = true;
		levelOptions['division-operand1-from'] = 10;
		levelOptions['division-operand1-to'] = 100;
		levelOptions['division-operand2-from'] = 2;
		levelOptions['division-operand2-to'] = 9;
	}

	appendDivisionHard(levelOptions) {
		
		levelOptions['division-enabled'] = true;
		levelOptions['division-operand1-from'] = 100;
		levelOptions['division-operand1-to'] = 1000;
		levelOptions['division-operand2-from'] = 2;
		levelOptions['division-operand2-to'] = 20;
	}
	
	startGame() {
		
		super.startGame();

		window.location.hash = 'mental-arithmetic-game';

		if (this.options.fullscreen) {
			
			if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			}
			else if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			}
		}

		this.putNewTask();

		window.onkeydown = e => {
			
			let digit = parseInt(e.key);
			if (!isNaN(digit)) {
				this.processNumberInput(digit);
			}
		}

		if (this.options['auditive']) {
			this.gameElem.classList.add('auditive');
		}
		else {
			this.gameElem.classList.remove('auditive');
		}

		var queryTerm =
			'#mental-arithmetic-game:not(.auditive) .answerWrapper.simple .answer,' +
			'#mental-arithmetic-game.auditive .answerWrapper.auditive .answer';
			
		this.answerElem = this.gameElem.querySelector(queryTerm);
	}

	putNewTask() {

		let operators = [];
		let options = this.options;
		if (options['addition-enabled']) {
			operators.push('addition');
		}
		if (options['subtraction-enabled']) {
			operators.push('subtraction');
		}
		if (options['multiplication-enabled']) {
			operators.push('multiplication');
		}
		if (options['division-enabled']) {
			operators.push('division');
		}

		// choose a random operator
		let randomIndex = this.getRandomNumber(0, operators.length - 1);
		let operator = operators[randomIndex];
		
		let from1 = options[operator + '-operand1-from'];
		let to1 = options[operator + '-operand1-to'];
		
		let from2 = options[operator + '-operand2-from'];
		let to2 = options[operator + '-operand2-to'];
		
		let num1 = this.getRandomNumber(from1, to1);
		let num2 = this.getRandomNumber(from2, to2);

		switch (operator) {

			case 'addition':
				
				operator = 'plus';

				this.rightResult = num1 + num2;
				this.taskElem.innerHTML = num1 + ' + ' + num2;
				
				Sound.INSTANCE.playTask(num1, operator, num2);
				break;

			case 'subtraction':
				
				operator = 'minus';

				let minuend, subtrahent;
				if (num1 > num2) {
					minuend = num1;
					subtrahent = num2;
				}
				else {
					minuend = num2;
					subtrahent = num1;
				}

				Sound.INSTANCE.playTask(minuend, operator, subtrahent);

				this.rightResult = minuend - subtrahent;
				this.taskElem.innerHTML = minuend + ' - ' + subtrahent;

				break;

			case 'multiplication':

				operator = "mal";
				Sound.INSTANCE.playTask(num1, operator, num2);
				this.rightResult = num1 * num2;
				this.taskElem.innerHTML = num1 + ' &times; ' + num2;
				break;

			case 'division':

				let subOptions = options[operator];
				operator = "durch";

				// Vorgehen um Werte ohne Rest zu erhalten:
				//
				// geg.: Divisor liegt in einem bestimmten Intervall (z.B. [2;5],
				// Dividend ebenso (z.B. [10;30])
				//
				// - Divisor wird zufällig gezogen (z.B. [2;5] -> 3)
				// - Ergebnis (= Dividend/Divisor) wird zufällig gezogen, Dividend
				//   liegt in [10;30], also muss das Ergebnis in [10/3;30/3] bzw.
				//   [3.3;10] liegen (z.B. 7)
				// - Dividend ist Ergebnis*Divisor -> 21
				// - die Aufgabe lautet 21:3

				let divisor = this.getRandomNumber(subOptions['from2'], subOptions['to2']);
				let result = this.getRandomNumber(
					Math.ceil(subOptions.from1 / divisor),
					Math.floor(subOptions.to1 / divisor)
				);
				let dividend = result * divisor;

				this.rightResult = result;
				Sound.INSTANCE.playTask(dividend, operator, divisor);
				this.taskElem.innerHTML = dividend + ' &divide; ' + divisor;
				break;
		}

		this.rightResultStr = new String(this.rightResult);
		this.currentAnswerReset();
		this.tasksPut++;
	}
	
	createDefaultLevelOptions() {
		
		let defaultLevelOptions = {
			
			"addition-enabled" : false,
			"addition-operand1-from" : 11,
			"addition-operand1-to" : 100,
			"addition-operand2-from" : 11,
			"addition-operand2-to" : 100,
			
			"subtraction-enabled" : false,
			"subtraction-operand1-from" : 11,
			"subtraction-operand1-to" : 100,
			"subtraction-operand2-from" : 11,
			"subtraction-operand2-to" : 100,
			
			"multiplication-enabled" : false,
			"multiplication-operand1-from" : 2,
			"multiplication-operand1-to" : 9,
			"multiplication-operand2-from" : 2,
			"multiplication-operand2-to" : 9,
			
			"division-enabled" : false,
			"division-operand1-from" : 11,
			"division-operand1-to" : 100,
			"division-operand2-from" : 2,
			"division-operand2-to" : 9,
			
			"numTasks": 10,
			"auditive": true
		}
		
		return defaultLevelOptions;
	}
	
	provideCustomLevelLabelText(customLevel) {
		
		let parts = [];
		
		let labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'addition');
		if(labelPart){
			parts.push(labelPart);
		}
		
		labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'subtraction');
		if(labelPart){
			parts.push(labelPart);
		}
		
		labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'multiplication');
		if(labelPart){
			parts.push(labelPart);
		}
		
		labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'division');
		if(labelPart){
			parts.push(labelPart);
		}
		
		if(customLevel.auditive){
			parts.push('auditiv');
		}
				
		let labelText = parts.join(', ');
		
		labelText += ', ' + customLevel.numTasks + '&nbsp;Aufgaben';
		
		return labelText;
	}
	
	createCustomLevelLabelSpanTerm(customLevel, operatorName) {
		
		let operatorEnabledKey = operatorName + '-enabled';
		if(customLevel[operatorEnabledKey]){
			
			let operand1From = customLevel[operatorName	+ '-operand1-from'];
			let operand1To = customLevel[operatorName	+ '-operand1-to'];
			
			let operand2From = customLevel[operatorName	+ '-operand2-from'];
			let operand2To = customLevel[operatorName	+ '-operand2-to'];
			
			let operatorSign;
			
			switch(operatorName){
				
				case 'addition':
					operatorSign = '+';
					break;
					
				case 'subtraction':
					operatorSign = '−';
					break;
					
				case 'multiplication':
					operatorSign = '×';
					break;
					
				case 'division':
					operatorSign = '÷';
					break;
			}
			
			return `[${operand1From} - ${operand1To}] ${operatorSign} [${operand2From} - ${operand2To}]`;			
		}
		else {
			return null;
		}
		
	}
	
	getGameNameTranslation() {
		
		return 'Kopfrechnen';
	}
	
	getGameNameTranslationForFileName() {
		
		return 'kopfrechnen';
	}

}