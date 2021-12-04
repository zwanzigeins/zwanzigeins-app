import Options from './options.js';

export default class GlobalSettings extends Options{
	
	constructor(){
		super('settings', {
			speechRate: "1",
			twistedSpeechMode: "zehneins",
			theme: "device"
		});
		
		this.applyTheme();
		
		let mainMenuElem = document.getElementById('settings');
		if(mainMenuElem){
			let themeRadioElems = mainMenuElem.querySelectorAll('input[name="theme"]');
			for(let radioElem of themeRadioElems){
				radioElem.addEventListener('change', () => {
					
					this.applyTheme();				
				});		
			}
		}
		// else testmode
	}
	
	applyTheme(){
		
		if(this.theme){
			switch(this.theme){
			
			case 'device':
				this.useDeviceTheme();
				break;
					
			case 'light':
				document.documentElement.classList.remove('dark-theme');
				break;
				
			case 'dark':
				document.documentElement.classList.add('dark-theme');
				break;
			}
		}
		else{
			this.useDeviceTheme();
		}
	}
	
	useDeviceTheme(){
		
		let darkThemeMatch = window.matchMedia('(prefers-color-scheme: dark)');
		if(darkThemeMatch.matches){
			document.documentElement.classList.add('dark-theme');
		}
		else{
			document.documentElement.classList.remove('dark-theme');
		}
	}
	
//	GlobalSettings.speechRate = 1;
	
}
