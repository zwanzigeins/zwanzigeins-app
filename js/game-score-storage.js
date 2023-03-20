import GlobalSettings from './global-settings.js';

export default class GameScoreStorage {

	constructor(gameName) {

		this.gameName = gameName;

		this.storageKey = 'game-scores: ' + gameName;

		let gameScoresJson = localStorage.getItem(this.storageKey);

		if (gameScoresJson != null) {
			this.gameScores = JSON.parse(gameScoresJson);
		}
		else {
			this.gameScores = [];
		}
	}

	saveGameScore(elapsedTime, numErrors, gameOptions) {

		let now = new Date();
		let isoString = now.toISOString();
		let lastColonIdx = isoString.lastIndexOf(':');
		let timeStamp = isoString.substring(0, lastColonIdx);

		let profileName = GlobalSettings.INSTANCE.getProfileName();
		let twistedSpeechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
		let speechRate = GlobalSettings.INSTANCE.speechRate;

		let gameScoreEntry = {

			timeStamp,
			profileName,
			twistedSpeechMode,
			speechRate,
			elapsedTime,
			numErrors,
			gameOptions
		}

		this.gameScores.push(gameScoreEntry);
		let gameScoresJson = JSON.stringify(this.gameScores);
		localStorage.setItem(this.storageKey, gameScoresJson);
	}

	clear() {
		
		localStorage.removeItem(this.storageKey);
	}

}