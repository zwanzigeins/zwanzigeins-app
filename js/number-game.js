import Pages from './pages.js';
import Utils from './utils.js';

export default class NumberGame{
	
	constructor(sound, pages, menuPageId, gamePageId){
		this.sound = sound;
		this.pages = pages;
		
		this.menuElem = document.getElementById(menuPageId);
		this.gameElem = document.getElementById(gamePageId);
		
		this.taskElem = this.gameElem.querySelector('.task > td');
		this.playAgainBtn = this.gameElem.querySelector('.playAgainBtn');
		
		Utils.addPressHandler(this.playAgainBtn, e => {
			this.sound.playAgain();
		});
		
		this.answerElem = this.gameElem.querySelector('.answer');
		
		var numBtns = this.gameElem.getElementsByClassName('numBtn');
		for (var i = 0; i < numBtns.length; i++) {
		    Utils.addPressHandler(numBtns[i], e =>{
		    	 var number = parseInt(e.currentTarget.innerHTML);
				 this.processNumberInput(number);
		    });
		}
		
		var clearBtn = this.gameElem.querySelector('.clearBtn');

		Utils.addPressHandler(clearBtn, e => {
		    this.answerElem.innerHTML = "";
		    this.styleGoodAnswer();
		});
		
		var btnStart = this.menuElem.querySelector('.btnStart');
		Utils.addPressHandler(btnStart, e => {
		    e.preventDefault();
		    pages.show(gamePageId);
		    this.startGame();
		});
		
		// speech synthesis is only allowed on user-interaction, 
		// so always go back to mentalArithmeticMenu if
		// page-reload was triggered on mentalArithmeticGame
		let currentPageId = pages.getCurrentId();
		if(currentPageId == gamePageId){
			history.back();
		}
		
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
	    
	    var ellapsed = new Date().getTime() - this.gameStartTimeStamp.getTime();
	    var ellapsedDate = new Date(ellapsed);
	    
	    window.history.back();
	    
		setTimeout(() =>{
			 let pageElem = this.pages.getCurrentPageElement();
	    
			pageElem.querySelector(".dialog").classList.add("showing");
			var minutes = ellapsedDate.getMinutes();
			var seconds = ellapsedDate.getSeconds();
			if(seconds < 10){
				seconds = '0' + seconds;
			}
			document.getElementById('lastGameTime').innerHTML = minutes + ":" + seconds;

			setTimeout(function(){
				pageElem.querySelector(".dialog").classList.remove("showing");
			}, 2000);
		}, 10);

	   
	}
	
	applyParamOverrides(){
		let queryParams = Utils.getQueryParams();
	    for(let optionKey in this.options){
	    	
	    	let overriddenVal = queryParams[optionKey];
	    	if(overriddenVal){
	    		var optionVal = this.options[optionKey];
	    		if(Number.isInteger(optionVal)){
	    			overriddenVal = parseInt(overriddenVal);
	    		}
	    		else if(typeof variable == 'boolean'){
	    			overridenVal = new Boolean(overridenVal)
	    		}
	    		else{
	    			continue;
	    		}
	    		console.log('using overriden option "' + optionKey + '", value: ' + overriddenVal);
	    		this.options[optionKey] = overriddenVal;
	    	}
	    }
	}
	
	
	styleWrongAnswer(){
	    this.answerElem.classList.add('error');
	}

	styleGoodAnswer(){
	    this.answerElem.classList.remove('error');
	}
}
