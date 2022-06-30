import ListenAndWriteGame from './listen-and-write-game.js';
import MentalArithmeticGame from './mental-arithmetic-game.js';
import NumberDictationGame from './number-dictation-game.js';
import Pages from './pages.js';
import Sound from './sound.js';
import GlobalSettings from './global-settings.js';

GlobalSettings.INSTANCE = new GlobalSettings();

let sound = new Sound();
let pages = new Pages();

new ListenAndWriteGame(sound, pages);
MentalArithmeticGame.INSTANCE = new MentalArithmeticGame(sound, pages);
new NumberDictationGame(pages);

// try to initialize sound early to prevent 
// a delayed, half, first utterance 
let soundWarmedUp = false;

// intended to improve warmup
speechSynthesis.getVoices();

document.addEventListener('hashchange', () => {
	
	if(!soundWarmedUp){
	
		speechSynthesis.getVoices();
		soundWarmedUp = true;
		sound.playWord(' ');
	}
});

let urlParams = new URLSearchParams(window.location.search);
let debugParam = urlParams.get('debug');

if(debugParam != null){
	
	let scriptElem = document.createElement('script');
	scriptElem.src = 'js/debug-tools.js';
	document.body.appendChild(scriptElem);
}

let swUri = 'service-worker.js';
            
window.navigator.serviceWorker.getRegistration().then(registration => {
       
    if(registration == null) {
        window.navigator.serviceWorker.register(swUri);
    }
    else {
        registration.update();
    }
});

let giveConsentAnchor = document.querySelector('a#give-consent');
giveConsentAnchor.addEventListener('click', () => {
	
	document.documentElement.classList.remove('consent-required');
	localStorage.setItem('consent-given', 'true');
});
