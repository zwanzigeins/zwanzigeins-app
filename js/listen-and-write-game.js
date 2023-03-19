import Options from './options.js';
import NumberGame from './number-game.js';
import Pages from './pages.js';
import Sound from './sound.js';

export default class ListenAndWriteGame extends NumberGame {

	constructor() {

		super('listen-and-write', 'listen-and-write-menu', 'listen-and-write-game');

		this.defaultOptions = {
			from: 11,
			to: 100,
			numTasks: 5
		};

		this.options = new Options('listen-and-write-menu', this.defaultOptions);

		var btnStart = this.menuElem.querySelector('.btnStart');

		// IOS needs a click-handler to play sound
		btnStart.addEventListener('click', e => {

			e.preventDefault();
			Pages.INSTANCE.show('listen-and-write-game');
			this.startGame();
		});
	}

	putNewTask() {

		let random = this.getRandomNumber(this.options.from, this.options.to);

		Sound.INSTANCE.playInteger(random);
		this.rightResult = random;
		this.taskElem.innerHTML = random;

		this.currentAnswerReset();
		this.tasksPut++;

	}

	startGame() {
		
		super.startGame();

		window.location.hash = 'listen-and-write-game';

		this.putNewTask();

		window.onkeydown = e => {
			let digit = parseInt(e.key);
			if (!isNaN(digit)) {
				this.processNumberInput(digit);
			}
		}
	}

}
