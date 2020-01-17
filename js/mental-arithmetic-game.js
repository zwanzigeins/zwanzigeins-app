import NumberGame from './number-game.js';
import Options from './options.js';

export default class MentalArithmeticGame extends NumberGame{
	
	constructor(sound, pages){		
		super(sound, pages, 'mentalArithmeticMenu', 'mentalArithmeticGame');
		
		this.defaultOptions = {
		    from1 : 1,
		    to1 : 100,
		    from2 : 1,
		    to2 : 100,
		    plus : true,
		    minus : false,
		    multiply : false,
		    divide : false,
		    numTasks : 10,
		    fullscreen : false,
		    auditive : false
		};
		
		this.options = new Options('mentalArithmeticMenu', this.defaultOptions);
		let pageElem = this.options.pageElem;
		this.ensureFromSmallerThanTo(pageElem, 'from1', 'to1');
		this.ensureFromSmallerThanTo(pageElem, 'from2', 'to2');
		
		// declare empty variables for documentation
		this.rightResult;
		this.rightResultStr;

		this.wrongAnswerOccured;
		this.wrongAnswerTimeStamp;
		
		this.tasksPut = 0;
		this.gameStartTimeStamp;
	}
	
	ensureFromSmallerThanTo(optionsPageElem, fromInputName, toInputName){
		
		let fromInputSelector = '[name="' + fromInputName + '"]';
		let toInputSelector = '[name="' + toInputName + '"]';
		
		let fromInputElem = optionsPageElem.querySelector(fromInputSelector);
		let toInputElem = optionsPageElem.querySelector(toInputSelector);
		
		function setMinOnTo(){
			
			let val = fromInputElem.value;
			let intVal = parseInt(val);
			let toMin = intVal + 1;
			toInputElem.min = toMin;
		}
		setMinOnTo();
		
		function setMaxOnFrom(){
			
			let val = toInputElem.value;
			let intVal = parseInt(val);
			let fromMax = intVal - 1;
			fromInputElem.max = fromMax;
		}
		setMaxOnFrom();
		
		fromInputElem.addEventListener('input', setMinOnTo);
		toInputElem.addEventListener('input', setMaxOnFrom);
		
		let onBlur = e => {
			
			let elem = e.target;
			
			if(!elem.value || isNaN(elem.value)){
				let defaultVal = this.defaultOptions[elem.name];
				elem.value = defaultVal;
			}
			
			let intVal = parseInt(elem.value);
			if(elem.min){
				let intMin = elem.min;
				if(intVal < intMin){
					elem.value = elem.min;
					let evt = new Event('input');
					elem.dispatchEvent(evt);
				}
			}
			if(elem.max){
				let intMax = elem.max;
				if(intVal > intMax){
					elem.value = elem.max;
					let evt = new Event('input');
					elem.dispatchEvent(evt);
				}
			}
		};
		
		fromInputElem.addEventListener('blur', onBlur);
		toInputElem.addEventListener('blur', onBlur);
	}
	
	startGame(){
	    
		window.location.hash = 'mentalArithmeticGame';
		
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

	    this.answerElem.innerHTML = "";
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
	        '#mentalArithmeticGame:not(.auditive) .answerWrapper.simple .answer,' + 
	        '#mentalArithmeticGame.auditive .answerWrapper.auditive .answer';
	    this.answerElem = this.gameElem.querySelector(queryTerm);	    	  
	}
	
	putNewTask() {
        
	    var operators = [];
	    let options = this.options;
	    if(options['plus']){
	        operators.push("plus");
	    }
	    if(options['minus']){
	        operators.push("minus");
	    }
	    if(options['multiply']){
	        operators.push("multiply");
	    }
	    if(options['divide']){
	        operators.push("divide");
	    }
	    
	    //würfele eine Zahl, die der Anzahl der gewählten Operatoren entspricht
	    let randomIndex = this.getRandomNumber(0, operators.length - 1);
	    
	    let operator = operators[randomIndex];
	    
	    let num1 = this.getRandomNumber(options['from1'], options['to1']);
	    let num2 = this.getRandomNumber(options['from2'], options['to2']);	   	  
	    
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
	    this.styleGoodAnswer();
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