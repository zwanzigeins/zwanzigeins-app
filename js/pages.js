export default class Pages{
	
	constructor(){
		
		this.pagesElem = document.querySelector('body > .pages');
		
		if(window.location.hash){
		    var navToken = location.hash.substring(1);
		    this.show(navToken);
		}

		window.onhashchange = e =>{
		    var navToken = location.hash.substring(1);
		    this.show(navToken);
		};

		var backBtns = document.querySelectorAll('.back');
		for(var i = 0; i < backBtns.length; i++){
		    backBtns[i].onclick = function(e){
		        history.back();
		    };
		}
	}
	
	show(id){
		  
	    var pageElem = document.getElementById(id);
	    if(!pageElem){
	        pageElem = document.getElementById('mainMenu');
	    }
	    this.pagesElem.insertBefore(pageElem, this.pagesElem.firstChild);
	}
	
	getCurrentId(){
		let hash = window.location.hash;
		
		if(hash){
			return hash.substring(1);
		}
		
		return '';
	}

}
