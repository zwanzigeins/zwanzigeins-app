import ListenAndWriteGame from './listen-and-write-game.js';
import MentalArithmeticGame from './mental-arithmetic-game.js';
import NumberDictationGame from './number-dictation-game.js';
import Pages from './pages.js';
import Sound from './sound.js';
import GlobalSettings from './global-settings.js';
import GameScoreStorageRegistry from './game-score-storage-registry.js';
import Statistics from './statistics.js';

GlobalSettings.INSTANCE = new GlobalSettings();

Sound.INSTANCE = new Sound();
Pages.INSTANCE = new Pages();

new ListenAndWriteGame();
MentalArithmeticGame.INSTANCE = new MentalArithmeticGame();
new NumberDictationGame();


GameScoreStorageRegistry.INSTANCE = new GameScoreStorageRegistry();

new Statistics('listen-and-write');
new Statistics('mental-arithmetic');

Pages.INSTANCE.handleInitialNavigation();

// try to initialize sound early to prevent 
// a delayed, half, first utterance 
let soundWarmedUp = false;

document.addEventListener('hashchange', () => {

	if (!soundWarmedUp) {

		speechSynthesis.getVoices();
		soundWarmedUp = true;
		Sound.INSTANCE.playWord(' ');
	}
});

let urlParams = new URLSearchParams(window.location.search);
let debugParam = urlParams.get('debug');

if (debugParam != null) {

	let scriptElem = document.createElement('script');
	scriptElem.src = 'js/debug-tools.js';
	document.body.appendChild(scriptElem);
}

let swUri = 'service-worker.js';

window.navigator.serviceWorker.getRegistration().then(registration => {

	if (registration == null) {
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
