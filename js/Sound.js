export default class Sound{

    constructor(){
        this.lastNum1 = null;
        this.lastNum2 = null;
        this.lastOperator = null;
    }
    
    playNumber(numStr, finishedHandler) {
        playWord(numStr, finishedHandler);
    }
    
    playWord(word, finishedHandler) {
        var msg = new SpeechSynthesisUtterance(word);
        msg.rate = 1.1;
        msg.onend = finishedHandler;
        window.speechSynthesis.speak(msg);
    }
    
    letterizeZwanzigEinsNumber(num){
        var word = '';
        var numLength = num.length;
        
        function getArityWord(arity){
            switch(arity){               
            case 4:
                return 'tausend';
            case 3:
                return 'hundert';
            }
        }
        
        function getDigitWord(arity, digitName, twoArityName){
            var res;
            if(arity == 2){
                res = twoArityName;
            }
            else{
                res = digitName;
                if(arity > 2){
                    res += getArityWord(arity);
                }
            }
            return res;
        }
        
        for(var i = 0; i < numLength; i++){
            var digit = parseInt(num.charAt(i));
            
            var arity = numLength - i;
            switch(digit){
            case 1:
                if(arity > 2){
                    word += getArityWord(arity);
                }
                else if(arity == 2){
                    word += 'zehn';
                }
                else{
                    word += 'eins';
                }
                break;
            case 2:
                word += getDigitWord(arity, 'zwei', 'zwanzig');
                break;
            case 3:
                word += getDigitWord(arity, 'drei', 'dreißig');
                break;
            case 4:
                word += getDigitWord(arity, 'vier', 'vierzig');
                break;
            case 5:
                word += getDigitWord(arity, 'fünf', 'fünfzig');
                break;
            case 6:
                word += getDigitWord(arity, 'sechs', 'sechzig');
                break;
            case 7:
                word += getDigitWord(arity, 'sieben', 'siebzig');
                break;
            case 8:
                word += getDigitWord(arity, 'acht', 'achtzig');
                break;
            case 9:
                word += getDigitWord(arity, 'neun', 'neunzig');
                break;
            }
            word += ' ';
                
        }
        
        return word;
    }
    
    
    
    playTask(num1, operator, num2){
        
        this.lastNum1 = num1;
        this.lastOperator = operator;
        this.lastNum2 = num2;
        
        num1 = num1.toString();
        var num1Word = this.letterizeZwanzigEinsNumber(num1);
        num2 = num2.toString();
        var num2Word = this.letterizeZwanzigEinsNumber(num2);

        var word = num1Word + " " + operator + " " + num2Word;
        this.playWord(word);
        
    } 
    
    playAgain = function(){
        this.playTask(this.lastNum1, this.lastOperator, this.lastNum2);        
    }

}