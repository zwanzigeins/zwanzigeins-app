import Options from './options.js';
import NumberGame from './number-game.js'

export default class ListenAndWriteGame extends NumberGame{
	
	constructor(sound, pages){
		super(sound, pages, 'listenAndWrite', 'listenAndWriteGame');
		
		this.defaultOptions = {
		    from : 11,
		    to : 100,
		    numTasks : 5,
		    fullscreen : false
		};
		
		this.options = new Options('listenAndWrite', this.defaultOptions);
		
		var btnStart = this.menuElem.querySelector('.btnStart');
		
		// IOS needs a click-handler to play sound
		btnStart.addEventListener('click', e => {
		    e.preventDefault();
		    pages.show('listenAndWriteGame');
		    this.startGame();
		});
	}
	
	putNewTask() {
		
		let random = this.getRandomNumber(this.options.from, this.options.to);
		
		this.sound.playInteger(random);
        this.rightResult = random;
        this.taskElem.innerHTML = random;
		
	    this.styleGoodAnswer();
	    this.tasksPut++;
		
	}
	
	startGame(){
				
		window.location.hash = 'listenAndWriteGame';
		
		this.wrongAnswerOccured = false;
	    this.gameStartTimeStamp = new Date();
	    this.tasksPut = 0;

	    this.answerElem.innerHTML = "";
	    this.putNewTask();
	    
	    window.onkeydown = e => {
	        if(e.keyCode >= 96 && e.keyCode <= 105){ //numpad-tasten von 0 bis 9
	            this.processNumberInput(e.keyCode - 96);
	        }
	    }
	}
	
}
