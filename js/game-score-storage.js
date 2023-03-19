import GlobalSettings from './global-settings.js';

export default class GameScoreStorage {
	
	constructor(){
	
		let gameScoresJson = localStorage.getItem('game-scores');
		
		if(gameScoresJson != null){
			this.gameScores = JSON.parse(gameScoresJson);			
		}
		else {
			this.gameScores = [];
		}
	}
	
	saveGameScore(gameName, elapsedTime, numErrors, gameOptions){
		
		let now = new Date();
		let isoString = now.toISOString();
		let lastColonIdx = isoString.lastIndexOf(':');
		let timeStamp = isoString.substring(0, lastColonIdx);
		
		let profileName = GlobalSettings.INSTANCE.getProfileName();
		let twistedSpeechMode = GlobalSettings.INSTANCE.twistedSpeechMode;
		let speechRate = GlobalSettings.INSTANCE.speechRate;
		
		let gameScoreEntry = {
			
			gameName,
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
		localStorage.setItem('game-scores', gameScoresJson);		
	}
	
	clear(){
		localStorage.removeItem('game-scores');
	}
	
}