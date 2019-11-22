import Options from './options.js';

export default class GlobalSettings extends Options{
	
	constructor(){
		super('settings', {
			speechRate: "1",
			twistedSpeechMode: "zehneins"
		});
	}
	
//	GlobalSettings.speechRate = 1;
	
}
