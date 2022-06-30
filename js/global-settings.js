import Options from './options.js';

export default class GlobalSettings extends Options{
	
	constructor(){
		
		super('settings', {
			speechRate: "1",
			twistedSpeechMode: "zehneins",
			theme: "device"
		});
		
		this.applyTheme();
		
		let settingsPageElem = document.getElementById('settings');
		if(settingsPageElem){
			
			let themeRadioElems = settingsPageElem.querySelectorAll('input[name="theme"]');
			for(let radioElem of themeRadioElems){
				radioElem.addEventListener('change', () => {
					
					this.applyTheme();				
				});		
			}
			
			let deleteAllDataButton = document.getElementById('delete-all-data');
			deleteAllDataButton.addEventListener('click', evt => {
				
				this.processDataClearRequest();
			});
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
	
	processDataClearRequest(){
		
		let confirmed = confirm("Wollen Sie wirklich alle gespeicherten Daten löschen?");
		
		if(confirmed){
			
			localStorage.clear();
			
			navigator.serviceWorker.getRegistrations()
				.then(registrations => {
				
					for(let registration of registrations) {
				 		registration.unregister();
				 	}
				})
				.then(() => {
					location.reload();
				})
				;
			
			if(!navigator.serviceWorker){
				location.reload();
			}
		}
	}
	
}
