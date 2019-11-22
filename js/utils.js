export default class Utils{
		
	static addPressHandler(elem, handler) {

	    function processEvent(elem, evt) {
	        // Füge für Berührungsfeedback touching-Klasse hinzu
	        elem.classList.add('touching');
	        handler(evt);
	        // Entferne Berührungsfeedback nach 100ms
	        setTimeout(function() {
	            elem.classList.remove('touching');
	        }, 100);
	    }

	    elem.addEventListener('touchstart', function(evt) {
	        processEvent(elem, evt);
	        evt.preventDefault();
	        evt.stopPropagation();
	        elem.touchFired = true;

	    }, true);

	    elem.addEventListener('mousedown', function(evt) {
	        if (!elem.touchFired) {
	            processEvent(elem, evt);
	            elem.touchFired = false;
	        }

	    }, true);
	}
	
	static getQueryParams(){
		
		let queryDict = {}
		location.search.substr(1).split("&").forEach(
			item => {
				queryDict[item.split("=")[0]] = item.split("=")[1]
			}
		)
		return queryDict;
	}
	
	/**
	 * Loads options from localStorage. Copies every property from saved options
	 * to targetObject. That way default-settings and migrations are easy to
	 * accomplish.
	 * 
	 * @param {string}
	 *            key - key in localStorage
	 * @param {object}
	 *            targetObject - a pre-initialized object with
	 *            option-properties.
	 */
	static loadOptions(key, targetObject){
		
		var optionsJson = localStorage.getItem(key);
	    if(optionsJson){
	        var savedOptions = JSON.parse(optionsJson);
	        
	        // transfer newly introduced options, that were not saved
	        for(var propertyKey in savedOptions){
	            if(typeof targetObject[propertyKey] != 'undefined'){
	            	targetObject[propertyKey] = savedOptions[propertyKey];
	            }
	        }
	    }
	}
}
