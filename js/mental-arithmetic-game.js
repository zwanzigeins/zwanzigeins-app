import NumberGame from './number-game.js';
import Utils from './utils.js';
import Sound from './sound.js';
import MentalArithmeticGameOptions from './mental-arithmetic-game-options.js';

export default class MentalArithmeticGame extends NumberGame {

	constructor() {

		super('mental-arithmetic', 'mental-arithmetic-menu', 'mental-arithmetic-game');

		this.defaultOptions = this.createDefaultLevelOptions();

		this.defaultOptions.numTasks = 5;
		this.defaultOptions.auditive = true;

		this.options = new MentalArithmeticGameOptions('mental-arithmetic-menu', this.defaultOptions, false);

		let startAnchorElems = document.querySelectorAll('[id$="choose-level"] .btnStart');

		for (let elem of startAnchorElems) {

			elem.onclick = evt => {

				let elem = evt.target
				let levelName = elem.dataset.level;
				let levelOptions = this.getPredefinedLevelOptions(levelName);

				levelOptions['numTasks'] = 10;

				Utils.copyObjectProperties(levelOptions, this.options);

				this.startGame();
			}
		}

		let defaultLevelOptions = this.createDefaultLevelOptions();

		super.initCustomLevelHandling(defaultLevelOptions);


		// declare empty variables for documentation
		this.rightResult;

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

		for (let propertyKey in levelOptions) {

			switch (propertyKey) {

				case 'plus':
				case 'minus':
				case 'multiply':
				case 'divide':
					levelOptions[propertyKey].enabled = true;
			}
		}

		levelOptions['levelName'] = levelName;

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

	getAllPredefinedLevelOptions() {




	}

	startGame() {

		super.startGame();

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

	generateNewTask() {

		let task = {};

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

				task.problem = num1 + ' + ' + num2;
				task.rightResult = num1 + num2;

				task.num1 = num1;
				task.operator = 'plus';
				task.num2 = num2;

				break;

			case 'subtraction':

				let minuend, subtrahent;
				if (num1 > num2) {
					minuend = num1;
					subtrahent = num2;
				}
				else {
					minuend = num2;
					subtrahent = num1;
				}

				task.problem = minuend + ' - ' + subtrahent;
				task.rightResult = minuend - subtrahent;

				task.num1 = minuend;
				task.operator = 'minus';
				task.num2 = subtrahent;

				break;

			case 'multiplication':

				task.problem = num1 + ' &times; ' + num2;
				task.rightResult = num1 * num2;

				task.num1 = num1;
				task.operator = 'mal';
				task.num2 = num2;

				break;

			case 'division':

				let subOptions = options[operator];

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

				task.problem = dividend + ' &divide; ' + divisor;
				task.rightResult = result;

				task.num1 = dividend;
				task.operator = 'durch';
				task.num2 = divisor;

				break;
		}

		return task;
	}

	presentNewTask(task) {

		Sound.INSTANCE.playTask(task.num1, task.operator, task.num2);
		this.taskElem.innerHTML = task.problem;
	}

	createDefaultLevelOptions() {

		let defaultLevelOptions = {

			"addition-enabled": false,
			"addition-operand1-from": 11,
			"addition-operand1-to": 100,
			"addition-operand2-from": 11,
			"addition-operand2-to": 100,

			"subtraction-enabled": false,
			"subtraction-operand1-from": 11,
			"subtraction-operand1-to": 100,
			"subtraction-operand2-from": 11,
			"subtraction-operand2-to": 100,

			"multiplication-enabled": false,
			"multiplication-operand1-from": 2,
			"multiplication-operand1-to": 9,
			"multiplication-operand2-from": 2,
			"multiplication-operand2-to": 9,

			"division-enabled": false,
			"division-operand1-from": 11,
			"division-operand1-to": 100,
			"division-operand2-from": 2,
			"division-operand2-to": 9,

			"numTasks": 10,
			"auditive": true
		}

		return defaultLevelOptions;
	}

	initPredefinedLevelsIfNeeded() {

		if (!this.predefinedLevelsInitialized) {

			this.predefinedLevelIds = [
				'addition-easy',
				'addition-medium',
				'addition-hard',
				'subtraction-easy',
				'subtraction-medium',
				'subtraction-hard',
				'addition-subtraction-easy',
				'addition-subtraction-medium',
				'addition-subtraction-hard',
				'multiplication-easy',
				'multiplication-medium',
				'multiplication-hard',
				'division-easy',
				'division-medium',
				'division-hard',
				'multiplication-division-easy',
				'multiplication-division-medium',
				'multiplication-division-hard',
				'mixed-easy',
				'mixed-medium',
				'mixed-hard'
			];

			this.predefinedLevels = [];

			for (let predefinedLevelId of this.predefinedLevelIds) {

				let levelOptions = this.getPredefinedLevelOptions(predefinedLevelId);
				this.predefinedLevels.push(levelOptions);
			}

			this.predefinedLevelsInitialized = true;
		}
	}

	provideCustomLevelLabelText(customLevel) {

		this.initPredefinedLevelsIfNeeded();

		for (let i = 0; i < this.predefinedLevels.length; i++) {

			let predefinedLevel = this.predefinedLevels[i];

			let equals = true;

			for (let propertyName in customLevel) {

				if (customLevel[propertyName] != predefinedLevel[propertyName]) {

					equals = false;
					break;
				}
			}

			if (equals) {

				let levelNameParts = predefinedLevel.levelName.split('-');
				let result = '';

				for (let levelNamePart of levelNameParts) {

					let resultPart;

					switch (levelNamePart) {

						case 'addition':
							resultPart = 'Addition ';
							break;

						case 'subtraction':
							resultPart = 'Subtraktion ';
							break;

						case 'multiplication':
							resultPart = 'Multiplikation ';
							break;

						case 'division':
							resultPart = 'Division ';
							break;

						case 'mixed':
							resultPart = 'Gemischt ';
							break;

						case 'easy':
							resultPart = 'einfach';
							break;

						case 'medium':
							resultPart = 'mittel';
							break;

						case 'hard':
							resultPart = 'schwer';
							break;
					}

					result += resultPart;
				}

				return result;
			}
		}

		let parts = [];

		let labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'addition');
		if (labelPart) {
			parts.push(labelPart);
		}

		labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'subtraction');
		if (labelPart) {
			parts.push(labelPart);
		}

		labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'multiplication');
		if (labelPart) {
			parts.push(labelPart);
		}

		labelPart = this.createCustomLevelLabelSpanTerm(customLevel, 'division');
		if (labelPart) {
			parts.push(labelPart);
		}

		if (customLevel.auditive) {
			parts.push('auditiv');
		}

		let labelText = parts.join(', ');

		labelText += ', ' + customLevel.numTasks + '&nbsp;Aufgaben';

		return labelText;
	}

	createCustomLevelLabelSpanTerm(customLevel, operatorName) {

		let operatorEnabledKey = operatorName + '-enabled';
		if (customLevel[operatorEnabledKey]) {

			let operand1From = customLevel[operatorName + '-operand1-from'];
			let operand1To = customLevel[operatorName + '-operand1-to'];

			let operand2From = customLevel[operatorName + '-operand2-from'];
			let operand2To = customLevel[operatorName + '-operand2-to'];

			let operatorSign;

			switch (operatorName) {

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

			return `[${operand1From};${operand1To}] ${operatorSign} [${operand2From};${operand2To}]`;
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

	validateCustomLevel(customLevel) {

		if (!customLevel['addition-enabled'] &&
			!customLevel['subtraction-enabled'] &&
			!customLevel['multiplication-enabled'] &&
			!customLevel['division-enabled']) {

			return 'Mindestens ein Operator muss gewählt sein.';
		}
	}

}