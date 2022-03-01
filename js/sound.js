import GlobalSettings from './global-settings.js';

export default class Sound{

    constructor(){
	
        this.lastPlayed = null;
    }

    setLetterizer(){
	
        let speechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
    	switch(speechMode){
    	case 'zwanzigeins':
    		this.letterizer = this.letterizeZwanzigEinsNumber;
    		break;
    	case 'traditionellVerdreht':
    		this.letterizer = this.letterizeVerdreht;
            break;
        case 'zwanzigeinsEndnull':
            this.letterizer = this.letterizeZwanzigEinsNumberEndnull;
            break;
        case 'zehneinsEndnull':
            this.letterizer = this.letterizeZehnEinsNumberEndnull;
            break;
    	default:
    		this.letterizer = this.letterizeZehnEinsNumber;
    	}
    }
    
    playInteger(integer, finishedHandler) {
    	
    	this.setLetterizer();
    	    	
    	let word = this.letterizer(integer);
        this.playWord(word, finishedHandler);
    }
    
    playWord(word, finishedHandler) {
	
    	this.lastPlayed = word;
        var msg = new SpeechSynthesisUtterance(word);
        
        let speechRateString = GlobalSettings.INSTANCE.speechRate;
        let speechRate = parseFloat(speechRateString);
        
        msg.rate = speechRate;
        msg.onend = finishedHandler;
        msg.lang = 'de-DE';
        window.speechSynthesis.speak(msg);
    }
    
    letterizeZehnEinsNumber(num){
    	
    	num = num.toString();
    	
        var word = '';
        var numLength = num.length;
        
        for(var i = 0; i < numLength; i++){
            var digit = parseInt(num.charAt(i));
            
            var arity = numLength - i;
            switch(digit){
            case 1:
                if(arity > 2){
                    word += this.getArityWord(arity);
                }
                else if(arity == 2){
                    word += 'zehn';
                }
                else{
                    word += 'eins';
                }
                break;
            case 2:
                word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig');
                break;
            case 3:
                word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig');
                break;
            case 4:
                word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig');
                break;
            case 5:
                word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig');
                break;
            case 6:
                word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig');
                break;
            case 7:
                word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig');
                break;
            case 8:
                word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig');
                break;
            case 9:
                word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig');
                break;
            }
            word += ' ';
                
        }
        
        return word;
    }

    letterizeDigitZehnEins(arity, digitName, twoArityName){
	
        var res;
        if(arity == 2){
            res = twoArityName;
        }
        else{
            res = digitName;
            if(arity > 2){
                res += this.getArityWord(arity);
            }
        }
        return res;
    }
        
    letterizeZwanzigEinsNumber(num){
    	
    	num = num.toString();
    	
        var word = '';
        var numLength = num.length;
        var arity = numLength - i;
        
        for(var i = 0; i < numLength; i++){
            var digit = parseInt(num.charAt(i));
            
            if(arity == 2 && digit == 1){
            	
            	word += num.substring(i);
            	return word;
            }
            
            switch(digit){
            case 1:
                if(arity > 2){
                    word += this.getArityWord(arity);
                }
                else if(arity == 2){
                    word += 'zehn';
                }
                else{
                    word += 'eins';
                }
                break;
            case 2:
                word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig', digit);
                break;
            case 3:
                word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig', digit);
                break;
            case 4:
                word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig', digit);
                break;
            case 5:
                word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig', digit);
                break;
            case 6:
                word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig', digit);
                break;
            case 7:
                word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig', digit);
                break;
            case 8:
                word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig', digit);
                break;
            case 9:
                word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig', digit);
                break;
            }
            word += ' ';
                
        }
        
        return word;
    }

    letterizeZwanzigEinsNumberEndnull(num){
    	
    	num = num.toString();
    	
        var word = '';
        var numLength = num.length;
        
        for(var i = 0; i < numLength; i++){
            var digit = parseInt(num.charAt(i));
            
            var arity = numLength - i;
            
            if(arity == 2 && digit == 1){
            	
            	word += num.substring(i);
            	return word;
            }
            
            switch(digit){
            case 0:
                if (arity == 1){//only letterize zero when arity == 1
                    word += 'null'
                }
                break;
            case 1:
                if(arity > 2){
                    word += this.getArityWord(arity);
                }
                else if(arity == 2){
                    word += 'zehn';
                }
                else{
                    word += 'eins';
                }
                break;
            case 2:
                word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig', digit);
                break;
            case 3:
                word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig', digit);
                break;
            case 4:
                word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig', digit);
                break;
            case 5:
                word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig', digit);
                break;
            case 6:
                word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig', digit);
                break;
            case 7:
                word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig', digit);
                break;
            case 8:
                word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig', digit);
                break;
            case 9:
                word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig', digit);
                break;
            }
            word += ' ';
                
        }
        
        return word;
    }

    letterizeZehnEinsNumberEndnull(num){
    	
    	num = num.toString();
    	
        var word = '';
        var numLength = num.length;
        
        for(var i = 0; i < numLength; i++){
            var digit = parseInt(num.charAt(i));
            
            var arity = numLength - i;
            switch(digit){
            case 0:
                if (arity == 1){//only letterize zero when arity == 1
                    word += 'null'
                }
                break;
            case 1:
                if(arity > 2){
                    word += this.getArityWord(arity);
                }
                else if(arity == 2){
                    word += 'zehn';
                }
                else{
                    word += 'eins';
                }
                break;
            case 2:
                word += this.letterizeDigitZehnEins(arity, 'zwei', 'zwanzig');
                break;
            case 3:
                word += this.letterizeDigitZehnEins(arity, 'drei', 'dreißig');
                break;
            case 4:
                word += this.letterizeDigitZehnEins(arity, 'vier', 'vierzig');
                break;
            case 5:
                word += this.letterizeDigitZehnEins(arity, 'fünf', 'fünfzig');
                break;
            case 6:
                word += this.letterizeDigitZehnEins(arity, 'sechs', 'sechzig');
                break;
            case 7:
                word += this.letterizeDigitZehnEins(arity, 'sieben', 'siebzig');
                break;
            case 8:
                word += this.letterizeDigitZehnEins(arity, 'acht', 'achtzig');
                break;
            case 9:
                word += this.letterizeDigitZehnEins(arity, 'neun', 'neunzig');
                break;
            }
            word += ' ';
                
        }
        
        return word;
    }

    letterizeVerdreht(num){
	
    	return num;
    }
    
    getArityWord(arity){
	
        switch(arity){               
        case 4:
            return 'tausend';
        case 3:
            return 'hundert';
        }
    }    
    
    playTask(num1, operator, num2){

        this.setLetterizer();
    	    	        
        let num1Word = this.letterizer(num1);
        let num2Word = this.letterizer(num2);

        var word = num1Word + " " + operator + " " + num2Word;
        this.playWord(word);
    } 
    
    playAgain(){
	
    	if(this.lastPlayed){
    		this.playWord(this.lastPlayed);        
    	}
    }

}