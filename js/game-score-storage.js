import GlobalSettings from './global-settings.js';

export default class GameScoreStorage {

	constructor(gameName) {

		this.gameName = gameName;

		this.storageNameSpaceKey = 'game-scores: ' + gameName;
	}

	saveGameScore(elapsedTime, numErrors, gameOptions) {

		let now = new Date();
		let isoString = now.toISOString();
		
		// format is e.g.: 2023-08-11T20:19:14.394Z
		
		let millisecondsDelimiterIdx = isoString.lastIndexOf('.');
		let timeStamp = isoString.substring(0, millisecondsDelimiterIdx);

		let profileName = GlobalSettings.INSTANCE.getProfileName();
		let twistedSpeechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
		let speechRate = GlobalSettings.INSTANCE.speechRate;
		
		let theme = GlobalSettings.INSTANCE.isDarkThemeActive() ? 'dark' : 'bright';
		let userAgent = navigator.userAgent;

		let gameScoreEntry = {

			timeStamp,
			profileName,
			twistedSpeechMode,
			speechRate,
			theme,
			elapsedTime,
			numErrors,
			gameOptions,			
			userAgent
		};

		let gameOptionsJson = JSON.stringify(gameOptions);

		let storageKey = this.storageNameSpaceKey + '|' + gameOptionsJson;

		let gameScores = this.getGameScores(gameOptions);
		gameScores.push(gameScoreEntry);

		let gameScoresJson = JSON.stringify(gameScores);

		localStorage.setItem(storageKey, gameScoresJson);
	}

	getGameScores(levelOptions) {

		let storageKey = this.storageNameSpaceKey + '|' + JSON.stringify(levelOptions);

		let json = localStorage.getItem(storageKey);

		if(json){
			return JSON.parse(json);
		}
		else {
			return [];
		}		
	}

	deleteGameScores(levelOptions) {

		let levelOptionsJsonToDelete = JSON.stringify(levelOptions);

		for (let key in localStorage) {

			if (key.startsWith(this.storageNameSpaceKey)) {

				if (key.indexOf('|') == -1) {
					continue;
				}

				let levelOptionsJson = key.split('|')[1];

				if (levelOptionsJson == levelOptionsJsonToDelete) {
					localStorage.removeItem(key);
				}
			}
		}
	}

	clear() {

		for (let key in localStorage) {

			if (key.startsWith(this.storageNameSpaceKey)) {
				localStorage.removeItem(key);
			}
		}
	}

	getAllGameScoreLevelOptions() {

		let allGameScoreLevelOptions = [];

		for (let key in localStorage) {

			if (key.startsWith(this.storageNameSpaceKey)) {

				if (key.indexOf('|') == -1) {
					continue;
				}

				let levelOptionsJson = key.split('|')[1];

				let levelOptions = JSON.parse(levelOptionsJson);
				allGameScoreLevelOptions.push(levelOptions);
			}
		}

		return allGameScoreLevelOptions;
	}

	getAllGameScores() {

		let result = [];

		for (let key in localStorage) {

			if (key.startsWith(this.storageNameSpaceKey)) {

				let json = localStorage.getItem(key);
				let gameScores = JSON.parse(json);
				result = result.concat(gameScores);
			}
		}

		return result;
	}

}