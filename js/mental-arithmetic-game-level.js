import NumberGame from './number-game.js';

export default class MentalArithmeticGameLevel extends NumberGame {
	
	constructor(sound, pages, levelOptions){
		
		super(sound, pages, 'mental-arithmetic-menu', 'mental-arithmetic-game');
		this.options = levelOptions;	
	}
	
	startGame(){
	    
		window.location.hash = 'mental-arithmetic-game';
		
	    if(this.options.fullscreen){
	        if(document.documentElement.webkitRequestFullscreen){
	            document.documentElement.webkitRequestFullscreen();
	        }
	        else if(document.documentElement.requestFullscreen){
	            document.documentElement.requestFullscreen();
	        }
	    }

	    this.wrongAnswerOccured = false;
	    this.gameStartTimeStamp = new Date();
	    this.tasksPut = 0;

	    this.putNewTask();
	   
	    window.onkeydown = e => {
	        if(e.keyCode >= 96 && e.keyCode <= 105){ //numpad-tasten von 0 bis 9
	            this.processNumberInput(e.keyCode - 96);
	        }
	    }
	    
	    if(this.options['auditive']){
	        this.gameElem.classList.add('auditive');
	    }
	    else{
	        this.gameElem.classList.remove('auditive');
	    }
	    
	    var queryTerm = 
	        '#mental-arithmetic-game:not(.auditive) .answerWrapper.simple .answer,' + 
	        '#mental-arithmetic-game.auditive .answerWrapper.auditive .answer';
	    this.answerElem = this.gameElem.querySelector(queryTerm);	    	  
	}
	
	putNewTask() {
        
	    var operators = [];
	    let options = this.options;
	    if(options['plus'] && options['plus'].enabled){
	        operators.push("plus");
	    }
	    if(options['minus'] && options['minus'].enabled){
	        operators.push("minus");
	    }
	    if(options['multiply'] && options['multiply'].enabled){
	        operators.push("multiply");
	    }
	    if(options['divide'] && options['divide'].enabled){
	        operators.push("divide");
	    }
	    
	    //würfele eine Zahl, die der Anzahl der gewählten Operatoren entspricht
	    let randomIndex = this.getRandomNumber(0, operators.length - 1);
	    
	    let operator = operators[randomIndex];
	    
	    let num1 = this.getRandomNumber(options[operator]['from1'], options[operator]['to1']);
	    let num2 = this.getRandomNumber(options[operator]['from2'], options[operator]['to2']);	   	  
	    
	    switch(operator){
	    
	    case "plus":
	        this.rightResult = num1 + num2;
	        this.taskElem.innerHTML = num1 + ' + ' + num2;
	        this.sound.playTask(num1, operator, num2);
	        break;
	    
	    case "minus":
	        let minuend, subtrahent;
	        if(num1 > num2){
	            minuend = num1;
	            subtrahent = num2;
	        }
	        else{
	            minuend = num2;
	            subtrahent = num1;
	        }
	        
	        this.sound.playTask(minuend, operator, subtrahent);
	        
	        this.rightResult = minuend - subtrahent;
	        this.taskElem.innerHTML = minuend + ' - ' + subtrahent;
	        
	        break;
	    
	    case "multiply":
	        operator = "mal";
	        this.sound.playTask(num1, operator, num2);
	        this.rightResult = num1 * num2;
	        this.taskElem.innerHTML = num1 + ' &times; ' + num2;
	        break;
	    
	    case "divide":
	        operator = "durch";
	        
	        
	        let parts = this.getIntegralDivisionParts(num1, num2);
	        let dividend = parts[0];
	        let divisor = parts[1];
	        
	        while(divisor == dividend || divisor == 1){
	        	// division by same number or by 1 is pointless so try again
	        	num1 = this.getRandomNumber(options['from1'], options['to1']);
	     	    num2 = this.getRandomNumber(options['from2'], options['to2']);
	     	    
	     	    parts = this.getIntegralDivisionParts(num1, num2);
		        dividend = parts[0];
		        divisor = parts[1];
	        }
	        
	        this.rightResult = parts[2];
	        this.sound.playTask(dividend, operator, divisor);
	        this.taskElem.innerHTML = dividend + ' &divide; ' + divisor;
	        break;	    
	    }
	    
	    this.rightResultStr = new String(this.rightResult);
	    this.currentAnswerReset();
	    this.tasksPut++;
	}
	
	getIntegralDivisionParts(randomNum1, randomNum2){
		
		let dividend, divisor;
        if(randomNum1 > randomNum2){
            dividend = randomNum1;
            divisor = randomNum2;
        }
        else{
            dividend = randomNum2;
            divisor = randomNum1;
        }
        
        let result;
        let integralDivisionFound = false;
        
        // decrement divisor until it's an integral task
        for(let divisorCandidate = divisor; divisorCandidate > 1; divisorCandidate--){
        	result = dividend / divisorCandidate;
        	if(this.isIntegral(result)){
        		integralDivisionFound = true;
        		divisor = divisorCandidate;
        		break;
        	}
        }
        
        if(!integralDivisionFound){
        	for(; divisor <= dividend; divisor++){
	        	result = dividend / divisor;
	        	if(this.isIntegral(result)){
	        		break;
	        	}
	        }
        }
        
        return [dividend, divisor, result];
	}
	
	isIntegral(divisionResult) {
		
		let parts = divisionResult.toString().split('.');
		if(parts.length == 1){
			return true;
		}
		else{
			return false;
		}
	}
}