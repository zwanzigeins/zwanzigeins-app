import GameScoreStorage from './game-score-storage.js';

export default class GameScoreStorageRegistry {
	
	constructor(){
		
		this['listen-and-write'] = new GameScoreStorage('listen-and-write');
		this['mental-arithmetic'] = new GameScoreStorage('mental-arithmetic');
	}
	
	saveGameScore(gameName, elapsedTime, numErrors, gameOptions){
		
		let gameScoreStorage = this[gameName];		
		gameScoreStorage.saveGameScore(elapsedTime, numErrors, gameOptions);		
	}
	
	clear() {
		
		localStorage.removeItem('game-scores');
	}
	
	getGameScoreStorage(gameName) {
		
		return this[gameName];
	}
	
}