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
			let digit = parseInt(e.key);
			if (!isNaN(digit)) {
				this.processNumberInput(digit);
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
			let subOptions = options[operator];
			operator = "durch";
			
			// Vorgehen um Werte ohne Rest zu erhalten:
			//
			// geg.: Divisor liegt in einem bestimmten Intervall (z.B. [2;5],
			// Dividend ebenso (z.B. [10;30])
			//
			// - Divisor wird zufällig gezogen (z.B. [2;5] -> 3)
			// - Ergebnis (= Dividend/Divisor) wird zufällig gezogen, Dividend
			//   liegt in [10;30], also muss das Ergebnis in [10/3;30/3] bzw.
			//   [3.3;10] liegen (z.B. 7)
			// - Dividend ist Ergebnis*Divisor -> 21
			// - die Aufgabe lautet 21:3

			let divisor = this.getRandomNumber(subOptions['from2'], subOptions['to2']);
			let result = this.getRandomNumber(
				Math.ceil(subOptions.from1 / divisor),
				Math.floor(subOptions.to1 / divisor)
			);
			let dividend = result * divisor;

			this.rightResult = result;
			this.sound.playTask(dividend, operator, divisor);
			this.taskElem.innerHTML = dividend + ' &divide; ' + divisor;
			break;
		}
	    
	    this.rightResultStr = new String(this.rightResult);
	    this.currentAnswerReset();
	    this.tasksPut++;
	}

}
