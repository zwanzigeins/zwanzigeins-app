import Utils from './utils.js';

export default class NumberGame{
	
	constructor(sound, pages, menuPageId, gamePageId){
		
		this.sound = sound;
		this.pages = pages;
		
		this.menuElem = document.getElementById(menuPageId);
		this.gameElem = document.getElementById(gamePageId);
		
		// hint: the page-dom is 'reused', so clear previous residues
		
		// remove alle event-listeners
		this.gameElem.innerHTML = this.gameElem.innerHTML;
		
		let answerElemSelector;
		
		if(this.gameElem.classList.contains('auditive')){
			answerElemSelector = '.auditive > .answer';
		}
		else{
			answerElemSelector = ':not(.auditive) > .answer';
		}
		
		this.answerElem = this.gameElem.querySelector(answerElemSelector);
		this.answerElem.innerHTML = '';		
		
		this.taskElem = this.gameElem.querySelector('.task > td');
		this.playAgainBtn = this.gameElem.querySelector('.playAgainBtn');
		
		Utils.addPressHandler(this.playAgainBtn, () => {
			
			this.sound.playAgain();
		});
		
		var numBtns = this.gameElem.getElementsByClassName('numBtn');
		for (var i = 0; i < numBtns.length; i++) {
		    Utils.addPressHandler(numBtns[i], e =>{
		    	 var number = parseInt(e.currentTarget.innerHTML);
				 this.processNumberInput(number);
		    });
		}
		
		var clearBtn = this.gameElem.querySelector('.clearBtn');

		Utils.addPressHandler(clearBtn, () => {
			
		    this.answerElem.innerHTML = '';
		    this.styleGoodAnswer();
		});
	}
	
	/**
	 * Verarbeitet die Eingabe einer Zahl. 
	 */
	processNumberInput(number) {
	    
	    if(this.wrongAnswerOccured){
	        //wenn die eingegebene Antwort bereits falsch war
	        //und mehr als 500ms seitdem vergangen sind, lösche 
	        //bisherige Eingabe um automatisch neue, richtige Antwort zu ermöglichen
	        var now = new Date();
	        var elapsedMs = now.getTime() - this.wrongAnswerTimeStamp.getTime();
	    
	        if(elapsedMs > 500){
	            this.answerElem.innerHTML = "";
	            this.styleGoodAnswer();
	            this.wrongAnswerOccured = false;
	        }
	        
	    }
	    var rightResultStr = this.rightResult.toString();
	    
	    this.answerElem.innerHTML = this.answerElem.innerHTML + number;

	    if (rightResultStr == this.answerElem.innerHTML) {
	        if(this.tasksPut < this.options.numTasks){
	            this.putNewTask();
	            this.answerElem.innerHTML = "";
	        }
	        else{
	            this.finishGame();
	        }        
	    } 
	    else {
	    	var givenAnswer = this.answerElem.innerHTML;
	        var rightResultBeginning = rightResultStr.substr(0, givenAnswer.length);
	        if (rightResultBeginning != givenAnswer) {
	            this.styleWrongAnswer();
	            this.wrongAnswerOccured = true;
	            this.wrongAnswerTimeStamp = new Date();
	        }
	    }
	}

	getRandomNumber(from, to) {
	    var min = parseInt(from);
	    var max = parseInt(to);
	     return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	finishGame(){
	    
	    let ellapsed = new Date().getTime() - this.gameStartTimeStamp.getTime();
	    let ellapsedDate = new Date(ellapsed);
	    
	    let overlayDialog = document.querySelector(".overlayDialog")
	    
	    overlayDialog.classList.add("showing");
		let minutes = ellapsedDate.getMinutes();
		let seconds = ellapsedDate.getSeconds();
		if(seconds < 10){
			seconds = '0' + seconds;
		}
		document.getElementById('lastGameTime').innerHTML = minutes + ":" + seconds;

		setTimeout(() => {
			overlayDialog.classList.remove("showing");
		}, 2000);
		
		window.history.back();
	}
	
	styleWrongAnswer(){
	    this.answerElem.classList.add('error');
	}

	styleGoodAnswer(){
	    this.answerElem.classList.remove('error');
	}
}
