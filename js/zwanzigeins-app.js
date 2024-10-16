import ListenAndWriteGame from './listen-and-write-game.js';


import MentalArithmeticGame from './mental-arithmetic-game.js';
import NumberDictationGame from './number-dictation-game.js';
import Pages from './pages.js';
import Sound from './sound.js';
import GlobalSettings from './global-settings.js';
import Statistics from './statistics.js';

Sound.INSTANCE = new Sound();
Pages.INSTANCE = new Pages();

GlobalSettings.INSTANCE = new GlobalSettings();

let listenAndWriteGame = new ListenAndWriteGame();
let mentalArithmeticGame = new MentalArithmeticGame();

new NumberDictationGame();

new Statistics(listenAndWriteGame);
new Statistics(mentalArithmeticGame);

function initExpandables(container) {

	let h2s = container.querySelectorAll('h2');

	h2s.forEach(h2 => {

		h2.onclick = () => {

			h2.classList.toggle('expanded');
		};
	});
}

Pages.INSTANCE.addBeforeOpenedHandler(pageId => {

	if (pageId == 'manual') {

		let manualContentContainer = document.getElementById('manualContent');
		if (manualContentContainer.textContent == '') {
			// dev-mode => load manual-content from file
			// in prod-mode it is already inserted by build-process
			fetch("manual.html")
				.then(response => {

					return response.text();
				})
				.then(text => {

					manualContentContainer.innerHTML = text;
					initExpandables(manualContentContainer);
				})
				;
		}
		else {
			initExpandables(manualContentContainer);
		}
	}
});

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

let reloadButton = document.querySelector('#reloadForUpdate > button');
reloadButton.onclick = () => {
	location.reload();
};

if(window.navigator.serviceWorker) {
	
	window.navigator.serviceWorker.getRegistration().then(registration => {
	
		if (registration == null) {
			window.navigator.serviceWorker.register(swUri);
		}
		else {
			registration.update();
	
			window.navigator.serviceWorker.addEventListener('controllerchange', () => {
	
				document.body.classList.add('updateInstalled');
			});
		}
	});
}

let giveConsentAnchor = document.querySelector('a#give-consent');
giveConsentAnchor.addEventListener('click', () => {

	document.documentElement.classList.remove('consent-required');
	localStorage.setItem('consent-given', 'true');
});



if (typeof speechSynthesis === "undefined") {
	
	alert('Dieses Gerät unterstützt keine Sprachausgabe. Die App ist so nur eingeschränkt nutzbar.');
}
else {
	
	// at app-start, the voices-list ist not always populated, 
	// so wait until document loaded and add some delay
	
	document.addEventListener('load', evt => {
		
		setTimeout(() => {
			
			const voices = speechSynthesis.getVoices();
					
			let deDeVoiceFound = false;
			
			for(let voice of voices) {
							
				if(voice.lang == 'de_DE' || voice.lang == 'de-DE') {
					deDeVoiceFound = true;
				}			
			}

			if (!deDeVoiceFound) {

				alert('Auf diesem Gerät ist keine deutsche Stimme für die Sprachausgabe installiert. Die App ist so nur eingeschränkt nutzbar.\n' +
					'Bitte installiere eine deutsche Stimme für die Sprachausgabe.');
			}
			
		}, 500);
	});
	
	// wait on voices to be loaded before fetching list
	window.speechSynthesis.onvoiceschanged = () => {
		
		
	};
	
	// trigger onvoiceschanged
	speechSynthesis.getVoices();

}
