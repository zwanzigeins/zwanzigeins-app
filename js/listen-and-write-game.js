import Options from './options.js';
import NumberGame from './number-game.js';
import Sound from './sound.js';

export default class ListenAndWriteGame extends NumberGame {

	constructor() {

		super('listen-and-write', 'listen-and-write-menu', 'listen-and-write-game');

		var startButtons = this.menuElem.querySelectorAll('.btnStart');

		for (let i = 0; i < startButtons.length; i++) {

			let startButton = startButtons[i];

			// IOS needs a click-handler to play sound
			startButton.addEventListener('click', e => {

				let levelName = e.currentTarget.dataset.level;

				this.options = this.getPredefinedLevelOptions(levelName);

				this.startGame();
			});
		}

		let defaultLevelCreationOptions = {
			from: 11,
			to: 100,
			numTasks: 5
		};

		super.initCustomLevelHandling(defaultLevelCreationOptions);
	}

	getPredefinedLevelOptions(levelName) {

		let levelOptions = {};

		switch (levelName) {

			case 'easy':
				levelOptions.from = 11;
				levelOptions.to = 99;
				break;

			case 'medium':
				levelOptions.from = 111;
				levelOptions.to = 999;
				break;

			case 'hard':
				levelOptions.from = 10011;
				levelOptions.to = 99999;
				break;
		}

		levelOptions.numTasks = 10;

		levelOptions['levelName'] = levelName;

		return levelOptions;
	}

	generateNewTask() {

		let random = this.getRandomNumber(this.options.from, this.options.to);
		let task = {
			problem: random,
			rightResult: random
		};

		return task;
	}

	presentNewTask(task) {

		Sound.INSTANCE.playInteger(task.problem);
		this.taskElem.innerHTML = task.problem;
	}

	initPredefinedLevelsIfNeeded() {

		if (!this.predefinedLevelsInitialized) {

			this.predefinedLevelIds = [
				'easy',
				'medium',
				'hard'
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

				switch (predefinedLevel.levelName) {

					case 'easy':
						return 'Leicht';

					case 'medium':
						return 'Mittel';

					case 'hard':
						return 'Schwer';
				}
			}
		}

		return `Von ${customLevel.from} bis ${customLevel.to}, ${customLevel.numTasks} Aufgaben`;
	}

	getGameNameTranslation() {

		return 'Hören & Schreiben';
	}

	getGameNameTranslationForFileName() {

		return 'hoeren-und-schreiben';
	}

}
