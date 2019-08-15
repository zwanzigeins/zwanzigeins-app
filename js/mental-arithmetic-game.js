import NumberGame from './number-game.js'
import Pages from './pages.js';
import Utils from './utils.js';

export default class MentalArithmeticGame extends NumberGame{
	
	constructor(sound, pages){
		super(sound, pages, 'mentalArithmeticGame');
		
		let menuElem = document.getElementById('mentalArithmeticMenu');		
		let gameElem = document.getElementById('mentalArithmeticGame');
		this.gameElem = gameElem;
					
		this.taskElem = gameElem.querySelector('.task > td');
		this.playAgainBtn = gameElem.querySelector('.playAgainBtn');
		this.answerElem = gameElem.querySelector('.answer');
		
		this.options = {
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
		
		var rightResult;
		var rightResultStr;

		var wrongAnswerOccured;
		var wrongAnswerTimeStamp;
		
		var tasksPut = 0;
		var gameStartTimeStamp;
		
		var numBtns = this.gameElem.getElementsByClassName('numBtn');
		for (var i = 0; i < numBtns.length; i++) {
		    Utils.addPressHandler(numBtns[i], e =>{
		    	 var number = parseInt(e.currentTarget.innerHTML);
				 this.processNumberInput(number);
		    });
		}
		
		var clearBtn = document.getElementById('clearBtn');

		Utils.addPressHandler(clearBtn, e => {
		    this.answerElem.innerHTML = "";
		    this.styleGoodAnswer();
		});

		var btnStart = document.getElementById('btnStart');
		Utils.addPressHandler(btnStart, e => {
		    e.preventDefault();
		    pages.show('mentalArithmeticGame');
		    this.startGame();
		});

		this.bindOptions();
		
		let currentPageId = pages.getCurrentId();

		// speech synthesis is only allowed on user-interaction, 
		// so always go back to mentalArithmeticMenu if
		// page-reload was triggered on mentalArithmeticGame
		if(currentPageId == 'mentalArithmeticGame'){
			history.back();
		}
		
	}
	
	loadOptions(){
	    var optionsJson = localStorage.getItem("options");
	    if(optionsJson){
	        var savedOptions = JSON.parse(optionsJson);
	        
	        //transfer newly introduced options, that were not saved 
	        for(var propertyKey in options){
	            if(typeof savedOptions[propertyKey] == 'undefined'){
	                savedOptions[propertyKey] = options[propertyKey];
	            }
	        }
	        this.options = savedOptions;
	    }
	}
	
	bindOptions(){
	    
	    try{
	        loadOptions();
	    }
	    catch(e){
	        
	    }
	    
	    let bindInputElem = id => {
	        var inputElem = document.getElementById(id);
	        inputElem.value = this.options[id];
	        inputElem.oninput = e => {
	            var id = e.target.getAttribute("id");
	            this.options[id] = e.target.value;
	            this.saveOptions();
	        };
	    }
	        
	    bindInputElem("from1");
	    bindInputElem("to1");
	    bindInputElem("from2");
	    bindInputElem("to2");
	    
	    let bindCheckboxElem = id =>{
	        var checkboxElem = document.getElementById(id);
	        checkboxElem.checked = this.options[id];
	        checkboxElem.onchange = e => {
	            var id = e.target.getAttribute("id");
	            this.options[id] = e.target.checked;
	            this.saveOptions();
	        }
	    }
	    
	    bindCheckboxElem("plus");
	    bindCheckboxElem("multiply");
	    bindCheckboxElem("minus");
	    bindCheckboxElem("divide");
	    bindCheckboxElem("fullscreen");
	    bindCheckboxElem("auditive");
	    
	    
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

	saveOptions(){
	    var optionsJson = JSON.stringify(this.options);
	    localStorage.setItem("options", optionsJson);
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
	    var randomIndex = this.getRandomNumber(0, operators.length - 1);
	    
	    var operator = operators[randomIndex];
	    console.log("random operator: " + operator);
	    
	    var num1 = this.getRandomNumber(options['from1'], options['to1']);
	    var num2 = this.getRandomNumber(options['from2'], options['to2']);
	    console.log("random numbers: " + num1 + ", " + num2);
	    
	   
	    
	    switch(operator){
	    
	    case "plus":
	        this.rightResult = num1 + num2;
	        this.taskElem.innerHTML = num1 + ' + ' + num2;
	        this.sound.playTask(num1, operator, num2);
	        break;
	    
	    case "minus":
	        var minuend, subtrahent;
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
	        sound.playTask(num1, operator, num2);
	        rightResult = num1 * num2;
	        taskElem.innerHTML = num1 + ' &times; ' + num2;
	        break;
	    
	    case "divide":
	        operator = "durch";
	        var dividend, divisor;
	        if(num1 > num2){
	            dividend = num1;
	            divisor = num2;
	        }
	        else{
	            dividend = num2;
	            divisor = num1;
	        }
	        sound.playTask(dividend, operator, divisor);
	        rightResult = dividend / divisor;
	        taskElem.innerHTML = dividend + ' &divide; ' + divisor;
	        break;
	    
	    }
	    
	    this.rightResultStr = new String(this.rightResult);
	    this.styleGoodAnswer();
	    this.tasksPut++;
	}

}