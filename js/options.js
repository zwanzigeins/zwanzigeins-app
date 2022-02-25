import Utils from './utils.js';

export default class Options{
	
	constructor(pageId, defaultOptions){
		
		this.pageId = pageId;
		
		// copy default-options in here
		for(var propertyKey in defaultOptions){
			this[propertyKey] = defaultOptions[propertyKey];
	    }
		
		this.loadOptions();
		
		this.pageElem = document.getElementById(pageId);
		if(this.pageElem){
			this.bindInputElements(this.pageElem, defaultOptions);
		}
		else{
			console.log('no page-element found for "' + pageId + "', assuming test-mode.");
		}
		
		this.applyParamOverrides();
	}
	
	loadOptions(){
		
		Utils.loadOptions(this.pageId + '-options', this); 
	}
	
	bindInputElements(pageElem){
		
		let inputElems = pageElem.querySelectorAll('[name]');
		
		for(let i = 0; i < inputElems.length; i++){
			let inputElem = inputElems[i];
			let name = inputElem.name;
			
			let curVal = this[name];
			
			switch(inputElem.type){
				
			case 'checkbox':
				inputElem.checked = curVal;
				inputElem.onchange = e => {
					let propertyKey = e.target.name;
					this[propertyKey] = e.target.checked;
					this.saveOptions();
				}
				break;
			
			case 'radio':
				if(inputElem.value == curVal){
					inputElem.checked = true;
				}
				inputElem.onchange = e => {
					let propertyKey = e.target.name;
					this[propertyKey] = e.target.value;
					this.saveOptions();
				}
				break;
				
			default:
				// for input[text] and [number]
				inputElem.value = curVal
				inputElem.onchange = e => {
					let propertyKey = e.target.name;
					this[propertyKey] = e.target.value;
					this.saveOptions();
				}
			}			
		}
	}
	
	saveOptions(){
		
	    var optionsJson = JSON.stringify(this);
	    localStorage.setItem(this.pageId + '-options', optionsJson);
	}
	
	applyParamOverrides(){
		
		let queryParams = Utils.getQueryParams();
	    for(let optionKey in this){
	    	
	    	let overriddenVal = queryParams[optionKey];
	    	if(overriddenVal){
	    		var optionVal = this[optionKey];
	    		if(Number.isInteger(optionVal)){
	    			overriddenVal = parseInt(overriddenVal);
	    		}
	    		else if(typeof variable == 'boolean'){
	    			overridenVal = new Boolean(overridenVal)
	    		}
	    		else{
	    			continue;
	    		}
	    		console.log('using overriden option "' + optionKey + '", value: ' + overriddenVal);
	    		this[optionKey] = overriddenVal;
	    	}
	    }
	}
		
}