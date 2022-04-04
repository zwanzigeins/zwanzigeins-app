import Options from './options.js';
import NumberGame from './number-game.js'

export default class ListenAndWriteGame extends NumberGame{
	
	constructor(sound, pages){
		super(sound, pages, 'listen-and-write-menu', 'listen-and-write-game');
		
		this.defaultOptions = {
		    from : 11,
		    to : 100,
		    numTasks : 5,
		    fullscreen : false
		};
		
		this.options = new Options('listen-and-write-menu', this.defaultOptions);
		
		var btnStart = this.menuElem.querySelector('.btnStart');
		
		// IOS needs a click-handler to play sound
		btnStart.addEventListener('click', e => {
		    e.preventDefault();
		    pages.show('listen-and-write-game');
		    this.startGame();
		});
	}
	
	putNewTask() {
		
		let random = this.getRandomNumber(this.options.from, this.options.to);
		
		this.sound.playInteger(random);
        this.rightResult = random;
        this.taskElem.innerHTML = random;
		
		this.currentAnswerReset();
	    this.tasksPut++;
		
	}
	
	startGame(){
				
		window.location.hash = 'listen-and-write-game';
		
		this.wrongAnswerOccured = false;
	    this.gameStartTimeStamp = new Date();
	    this.tasksPut = 0;

	    this.putNewTask();
	    
	    window.onkeydown = e => {
	        if(e.keyCode >= 96 && e.keyCode <= 105){ //numpad-tasten von 0 bis 9
	            this.processNumberInput(e.keyCode - 96);
	        }
	    }
	}
	
}
