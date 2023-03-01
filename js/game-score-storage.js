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
	
	saveGameScore(gameName, elapsedTime, numErrors){
		
		let now = new Date();
		let isoString = now.toISOString();
		let lastColonIdx = isoString.lastIndexOf(':');
		let timeStamp = isoString.substring(0, lastColonIdx);
		
		let profileName = '';
		
		let gameScoreEntry = {
			
			gameName,
			timeStamp,
			profileName,
			elapsedTime,
			numErrors
		}
		
		this.gameScores.push(gameScoreEntry);
		let gameScoresJson = JSON.stringify(this.gameScores);
		localStorage.setItem('game-scores', gameScoresJson);		
	}
	
}