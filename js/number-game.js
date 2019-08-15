import Pages from './pages.js';
import Utils from './utils.js';

export default class NumberGame{
	
	constructor(sound, pages, gameElemId){
		this.sound = sound;
		this.pages = pages;
		this.gameElem = document.getElementById(gameElemId);
		
		
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

	}
	
	
	styleWrongAnswer(){
	    this.answerElem.classList.add('error');
	}

	styleGoodAnswer(){
	    this.answerElem.classList.remove('error');
	}
}
