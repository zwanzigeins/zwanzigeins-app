import Options from './options.js';
import Pages from './pages.js';

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
			quickAccessZwanzigeinsEndnullEnabled: false,
			experimentModeEnabled: false
		});

		this.applyTheme();

		let settingsPageElem = document.getElementById('settings');
		if (settingsPageElem) {
			
			this.pageElem = settingsPageElem;

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

			this.experimentModeEnabledCheckbox = settingsPageElem.querySelector('#experimentModeEnabled');

			this.experimentModeEnabledCheckbox.addEventListener('input', () => {

				if (this.experimentModeEnabledCheckbox.checked) {

					this.downloadAudioFiles(() => {
						
						setTimeout(() => {
							
							this.updateDownloadedIndication();
						}, 1000);
					});
				}
			});

			Pages.INSTANCE.addBeforeOpenedHandler(id => {

				if (id == 'settings') {

					if (this.experimentModeEnabled) {
						this.updateDownloadedIndication();
					}
				}
			});
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

	isDarkThemeActive() {

		return document.documentElement.classList.contains('dark-theme');
	}
	
	isExperimentModeEnabled() {
		
		return this.experimentModeEnabled;
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

			if (speechModeQuickAccessCheckbox.value == this.twistedSpeechMode) {
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

	showOrHideQuickAccessOption(checkboxElem, speechModeName, quickAccessEnabled) {

		if (checkboxElem.value == speechModeName) {

			let fieldElem = checkboxElem.parentElement;

			if (quickAccessEnabled) {
				fieldElem.removeAttribute('hidden');
			}
			else {
				fieldElem.setAttribute('hidden', '');
			}
		}
	}

	updateDownloadedIndication() {

		this.areAudioFilesDownloaded(downloaded => {

			let msg;

			let audioFilesDownloadedInfoElem = this.pageElem.querySelector('.audioFilesDownloadedInfo');

			if (downloaded) {

				audioFilesDownloadedInfoElem.classList.add('downloaded');
				msg = 'Audio-Dateien vollständig heruntergeladen.';
			}
			else {

				audioFilesDownloadedInfoElem.classList.remove('downloaded');
				msg = 'Audio-Dateien nicht heruntergeladen.';
			}

			audioFilesDownloadedInfoElem.textContent = msg;
		});
	}

	areAudioFilesDownloaded(yesNoHandler) {

		let expectedAudioFiles = [];
		
		let audioFileUri;

		for (let number = 1; number <= 100; number++) {

			this.getAudioFileUri(number, true);
			expectedAudioFiles.push(audioFileUri);

			audioFileUri = this.getAudioFileUri(number, false);
			expectedAudioFiles.push(audioFileUri);
		}

		let foundAudioFiles = 0;

		caches.open('v1')
			.then(cache => {

				return cache.keys();
			})
			.then(requests => {

				for (let request of requests) {

					let url = new URL(request.url);

					if (url.pathname.endsWith('.mp3')) {
						foundAudioFiles++;
					}
				}

				if (foundAudioFiles >= 200) {
					yesNoHandler(true);
				}
				else {
					yesNoHandler(false);
				}
			})
			;
	}

	downloadAudioFiles(finishedHandler) {

		let number = 1;
		let traditionellVerdrehtEnabled = true;
		
		this.updateDownloadProgressMsg(number);

		let downloadFinishedHandler = () => {

			number++;

			if (number <= 100) {
				this.downloadAudioFileToCache(number, traditionellVerdrehtEnabled, downloadFinishedHandler);
				
				let progressNumber = number; 
				
				if(!traditionellVerdrehtEnabled) {
					progressNumber  = number + 100;
				}
				
				this.updateDownloadProgressMsg(progressNumber);
			}
			else {

				if (traditionellVerdrehtEnabled) {

					traditionellVerdrehtEnabled = false;
					number = 1;
					this.downloadAudioFileToCache(number, traditionellVerdrehtEnabled, downloadFinishedHandler);
				}
				else {
					this.updateDownloadProgressMsg(-1);
					finishedHandler();
				}
			}
		}

		this.downloadAudioFileToCache(number, traditionellVerdrehtEnabled, downloadFinishedHandler);
	}
	
	updateDownloadProgressMsg(currentDownloadCount) {
		
		let downloadProgressElem = this.pageElem.querySelector('.downloadProgress');
		
		if(currentDownloadCount == -1) {
			downloadProgressElem.textContent = '';	
		}
		else {
			
			let msg = 'Lade Datei ' + currentDownloadCount + '/200';
			downloadProgressElem.textContent = msg;
		}
	}

	downloadAudioFileToCache(number, traditionellVerdrehtEnabled, finishedHandler) {

		let mp3uri = this.getAudioFileUri(number, traditionellVerdrehtEnabled);

		let fetchResponse;

		fetch(mp3uri)
			.then(response => {

				fetchResponse = response;
				return caches.open('v1');
			})
			.then(cache => {

				cache.put(mp3uri, fetchResponse);
				finishedHandler();
			})
			.catch(() => {
				alert('Fehler beim Herunterladen von ' + mp3uri);
			})
			;

	}

	getAudioFileUri(number, traditionellVerdrehtEnabled) {

		let mp3uri = 'mp3/';

		if (location.host == 'zwanzigeins.jetzt') {
			mp3uri = '../app/mp3/';
		}

		if (traditionellVerdrehtEnabled) {
			mp3uri += 'traditionell-verdreht';
		}
		else {
			mp3uri += 'zehneins';
		}

		if (number < 10) {
			number = '00' + number;
		}
		else if (number < 100) {
			number = '0' + number;
		}

		mp3uri += '/rate-100/audio-' + number + '.mp3';

		return mp3uri;
	}

}
