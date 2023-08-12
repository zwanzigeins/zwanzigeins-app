import Options from './options.js';
import NumberGame from './number-game.js';
import Sound from './sound.js';

export default class ListenAndWriteGame extends NumberGame {

	constructor() {

		super('listen-and-write', 'listen-and-write-menu', 'listen-and-write-game');

		this.defaultOptions = {
			from: 11,
			to: 100,
			numTasks: 10
		};

		this.options = new Options('listen-and-write-menu', this.defaultOptions, false);

		var startButtons = this.menuElem.querySelectorAll('.btnStart');
		
		for(let i = 0; i < startButtons.length; i++){
			
			let startButton = startButtons[i];
			
			// IOS needs a click-handler to play sound
			startButton.addEventListener('click', e => {
				
				let levelName = e.currentTarget.dataset.level;
				
				this.options.numTasks = 10;
				
				switch(levelName){
					
					case 'easy':
						this.options.from = 11;
						this.options.to = 99;
						break;
						
					case 'medium':
						this.options.from = 111;
						this.options.to = 999;
						break;
						
					case 'hard':
						this.options.from = 10011;
						this.options.to = 99999;
						break;
				}
				
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

	provideCustomLevelLabelText(customLevel) {
		
		return `Von ${customLevel.from} bis ${customLevel.to}, ${customLevel.numTasks} Aufgaben`;
	}
	
	getGameNameTranslation(){
		
		return 'Hören & Schreiben';
	}
	
	getGameNameTranslationForFileName(){
		
		return 'hoeren-und-schreiben';
	}

}
