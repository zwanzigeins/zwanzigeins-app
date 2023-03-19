import Utils from './utils.js';

export default class Options {

	constructor(pageId, defaultOptions) {

		this.pageId = pageId;
		
		this.payloadPropertyKeys = [];
		
		this.defaultOptions = defaultOptions;

		// copy default-options in here
		for (var propertyKey in defaultOptions) {
			
			this[propertyKey] = defaultOptions[propertyKey];
			this.payloadPropertyKeys.push(propertyKey);
		}
		
		this.loadOptions();

		this.pageElem = document.getElementById(pageId);
		if (this.pageElem) {
			this.bindInputElements(this.pageElem, defaultOptions);
		}
		else {
			console.log('no page-element found for "' + pageId + "', assuming test-mode.");
		}

		this.applyParamOverrides();
	}

	loadOptions() {

		Utils.loadOptions(this.pageId + '-options', this);
	}

	bindInputElements(pageElem) {

		let inputElems = pageElem.querySelectorAll('[name]');

		for (let i = 0; i < inputElems.length; i++) {
			let inputElem = inputElems[i];
			let name = inputElem.name;

			let curVal = this[name];

			switch (inputElem.type) {

				case 'checkbox':

					inputElem.checked = curVal;
					
					this.updateCheckBoxDataAttribute(inputElem);
					
					inputElem.onchange = e => {
						
						let propertyKey = e.target.name;
						this[propertyKey] = e.target.checked;
						this.updateCheckBoxDataAttribute(inputElem);
						this.saveOptions();
					}
					
					break;

				case 'radio':

					if (inputElem.value == curVal) {
						inputElem.checked = true;
						inputElem.parentElement.dataset.selectedValue = curVal;
					}

					inputElem.onchange = e => {

						let propertyKey = e.target.name;
						
						let newValue = e.target.value;
						
						let defaultOption = this.defaultOptions[name];
						if(typeof defaultOption == 'number'){
							newValue = parseFloat(newValue);
						}
						
						this[propertyKey] = newValue;											
						
						inputElem.parentElement.dataset.selectedValue = curVal;
						this.saveOptions();
					}
					
					break;

				case 'number':
					
					// for input[text] and others
					
					inputElem.value = parseFloat(curVal);
					
					inputElem.oninput = e => {
						
						let propertyKey = e.target.name;
						this[propertyKey] = parseFloat(e.target.value);
						this.saveOptions();
					}
					
					break;
					
				default:

					// for input[text] and others
					inputElem.value = curVal;
					
					inputElem.oninput = e => {
						
						let propertyKey = e.target.name;
						this[propertyKey] = e.target.value;
						this.saveOptions();
					}
			}
		}
	}
	
	updateCheckBoxDataAttribute(checkBoxInput) {
		
		if(checkBoxInput.checked){
			checkBoxInput.parentElement.dataset.checked = 'true';
		}
		else {
			checkBoxInput.parentElement.dataset.checked = 'false';
		}
	}

	saveOptions() {

		var optionsJson = JSON.stringify(this.getPayloadObject());
		localStorage.setItem(this.pageId + '-options', optionsJson);
	}

	applyParamOverrides() {

		let queryParams = Utils.getQueryParams();
		for (let optionKey in this) {

			let overriddenVal = queryParams[optionKey];
			if (overriddenVal) {

				var optionVal = this[optionKey];
				if (Number.isInteger(optionVal)) {
					overriddenVal = parseInt(overriddenVal);
				}
				else if (typeof variable == 'boolean') {
					overriddenVal = new Boolean(overriddenVal);
				}
				else {
					continue;
				}
				console.log('using overriden option "' + optionKey + '", value: ' + overriddenVal);
				this[optionKey] = overriddenVal;
			}
		}
	}
	
	getPayloadObject() {
		
		let payloadObj = {};
		
		for(let propertyKey of this.payloadPropertyKeys){
			payloadObj[propertyKey] = this[propertyKey];
		}
		
		return payloadObj;
	}	

}