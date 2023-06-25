import Options from './options.js';

export default class GlobalSettings extends Options {

	constructor() {

		super('settings', {
			speechRate: '1',
			twistedSpeechMode: 'zehneins',
			theme: 'device',
			profileEnabled: false,
			profileName: '',
			quickAccessZehneinsEnabled: true,
			quickAccessZwanzigeinsEnabled: false,
			quickAccessTraditionellVerdrehtEnabled: true,
			quickAccessZehneinsEndnullEnabled: false,
			quickAccessZwanzigeinsEndnullEnabled: false
		});

		this.applyTheme();

		let settingsPageElem = document.getElementById('settings');
		if (settingsPageElem) {

			let themeRadioElems = settingsPageElem.querySelectorAll('input[name="theme"]');
			for (let radioElem of themeRadioElems) {
				radioElem.addEventListener('change', () => {

					this.applyTheme();
				});
			}

			let deleteAllDataButton = document.getElementById('delete-all-data');
			deleteAllDataButton.addEventListener('click', () => {

				this.processDataClearRequest();
			});

			this.speechModeQuickAccessElem = document.getElementById('speechModeQuickAccess');
			this.speechModeQuickAccessCheckboxes = this.speechModeQuickAccessElem.querySelectorAll('[name]');

			for (let speechModeQuickAccessCheckbox of this.speechModeQuickAccessCheckboxes) {

				speechModeQuickAccessCheckbox.onchange = evt => {

					let value = evt.target.value;
					this.twistedSpeechMode = value;
					this.saveOptions();					
				};
			}
			
			this.quickAccessCheckboxZehneins = this.speechModeQuickAccessElem.querySelector('[value="zehneins"]');
			this.quickAccessCheckboxZwanzigeins = this.speechModeQuickAccessElem.querySelector('[value="zwanzigeins"]');
			this.quickAccessCheckboxTraditonellVerdreht = this.speechModeQuickAccessElem.querySelector('[value="traditionellVerdreht"]');
			this.quickAccessCheckboxZehneinsEndnull = this.speechModeQuickAccessElem.querySelector('[value="zehneinsEndnull"]');
			this.quickAccessCheckboxZwanzigeinsEndnull = this.speechModeQuickAccessElem.querySelector('[value="zwanzigeinsEndnull"]');
		}

		// else testmode
	}

	applyTheme() {

		if (this.theme) {

			switch (this.theme) {

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
		else {
			this.useDeviceTheme();
		}
	}

	useDeviceTheme() {

		let darkThemeMatch = window.matchMedia('(prefers-color-scheme: dark)');
		if (darkThemeMatch.matches) {
			document.documentElement.classList.add('dark-theme');
		}
		else {
			document.documentElement.classList.remove('dark-theme');
		}
	}

	processDataClearRequest() {

		let confirmed = confirm('Wollen Sie wirklich alle gespeicherten Daten löschen?');

		if (confirmed) {

			localStorage.clear();

			navigator.serviceWorker.getRegistrations()
				.then(registrations => {

					for (let registration of registrations) {
						registration.unregister();
					}
				})
				.then(() => {
					location.reload();
				})
				;

			if (!navigator.serviceWorker) {
				location.reload();
			}
		}
	}

	getProfileName() {

		if (this.profileEnabled) {
			return this.profileName;
		}
		else {
			return '';
		}
	}

	getSpeechModeQuickAccessElement() {

		for (let speechModeQuickAccessCheckbox of this.speechModeQuickAccessCheckboxes) {
			
			if(speechModeQuickAccessCheckbox.value == this.twistedSpeechMode){
				speechModeQuickAccessCheckbox.checked = true;
				break;
			}
		}
		
		this.showOrHideQuickAccessOption(this.quickAccessCheckboxZehneins, 'zehneins', this.quickAccessZehneinsEnabled);
		this.showOrHideQuickAccessOption(this.quickAccessCheckboxZwanzigeins, 'zwanzigeins', this.quickAccessZwanzigeinsEnabled);
		this.showOrHideQuickAccessOption(this.quickAccessCheckboxTraditonellVerdreht, 'traditionellVerdreht', this.quickAccessTraditionellVerdrehtEnabled);
		this.showOrHideQuickAccessOption(this.quickAccessCheckboxZehneinsEndnull, 'zehneinsEndnull', this.quickAccessZehneinsEndnullEnabled);
		this.showOrHideQuickAccessOption(this.quickAccessCheckboxZwanzigeinsEndnull, 'zwanzigeinsEndnull', this.quickAccessZwanzigeinsEndnullEnabled);			
		
		return this.speechModeQuickAccessElem;
	}
	
	showOrHideQuickAccessOption(checkboxElem, speechModeName, quickAccessEnabled){
		
		if(checkboxElem.value == speechModeName){
				
			let fieldElem = checkboxElem.parentElement;
			
			if(quickAccessEnabled) {
				fieldElem.removeAttribute('hidden');
			}
			else {
				fieldElem.setAttribute('hidden', '');					
			}
		}
	}

}
