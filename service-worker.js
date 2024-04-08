// preset with empty objects to prevent errors in dev-mode-situation
var cacheManifest = {urls: [], endpoints: []};

//get urls from variable to cache it
self.addEventListener("install", event => {

	console.log('installevent received');
	
	self.skipWaiting();
	
	event.waitUntil(
		caches.open("v1")
		.then(cache => {
			
			cache.addAll(cacheManifest.urls);
			
			//get endpoints from variable to cache it
			for(let i = 0; i < cacheManifest.endpoints.length ; i++) {
				
				let endpointUrl = cacheManifest.endpoints[i].url;
				
				// add mode=cacheable, so server can send an
				// appropriate version of a JSP e.g.
				let cacheableUrl = endpointUrl + "?mode=cacheable";
				
				fetch(cacheableUrl).then(response => {
					if (!response.ok) {
						throw new TypeError('bad response status');
				  	}
				
					// use original endpoint-url for cache 
				  	return cache.put(endpointUrl, response);
				})				
			}
		})
	);
});	

//catches fetch-event and serves with live-files or cached-files
self.addEventListener('fetch', event => {
	
	if(event.request.method != 'GET' || cacheManifest.urls.length == 0){
		return; 
	}
	
	let url = getQueryStrippedUrl(event.request.url);
	let excluded = cacheManifest.exclude && cacheManifest.exclude.includes(url.pathname);
	
	if(!excluded){
		
		// SSE-requests like for '/_commands/livesync' must be excluded 
		// because that would block installing new service-workers
		excluded = url.pathname.startsWith("/_commands");
	}
	
	if(excluded){
		return;
	}
	
	let pathnameWithoutSlash = url.pathname.substring(1); 
	let segments = pathnameWithoutSlash.split('/');
	let lastSegment = segments[segments.length - 1];
	
	let cacheMarkedResourceRequested = lastSegment.indexOf('.cache.') != -1;
	
	if(cacheMarkedResourceRequested){		
		serveCacheMarkedResource(event, url);		
	}
	else {
		
		let staticFile = lastSegment.indexOf('.') != -1;
		let sameOrigin = isSameOrigin(url);
		let serviceEndpoint = segments[0].startsWith('_');
		
		if(sameOrigin && !serviceEndpoint && !staticFile) {			
			serveRootHtml(event);
		}
		else {
			serveOther(event);
		}
	}
});

function serveCacheMarkedResource(event, url){
	
	let cacheStorage;
	
	event.respondWith(caches.open("v1")
		.then(cache => {
			// check if resource is already cached
			cacheStorage = cache;
			return cache.match(url.href);
		})
		.then(cacheResponse => {
			if(cacheResponse){
				// => resource is cached, use it as response
				cacheResponse.fromCache = true;
				return cacheResponse;
			}
			else{
				// => resource not cached, fetch it
				return fetch(url.href);
			}
		})
		.then(response => {
			if(!response.fromCache && response.ok){
				// => cacheable resource was fetched, put it into cache, 
				// use a clone, otherwise the response might be 'already used'
				// resulting in showing a network error  
				let responseClone = response.clone();
				cacheStorage.put(url.href, responseClone);
			}
			
			// return either fetched or cached response
			return response;
		})
	);
}

function serveRootHtml(event){
	
	if(typeof adaptRootHtml == 'function'){
		serveAdaptedRootHtml(event);
	}
	else{
		event.respondWith(
			caches.match('/')
				.then(response => {
					
					if(response) {
						return response;
					}
					return fetch(event.request);
				})
		);
	}
}

/**
*	if a function 'adaptRootHtml' is defined we use it to serve dynamically prepared rootHtml. 
*	The expected signature is 'adaptRootHtml(cachedRootHtml, urlObject)' 
*	and it returns a html-string or a promise that resolves to a html-string.
*/
function serveAdaptedRootHtml(event){
	
	event.respondWith(
		caches.match('/')
			.then(cacheResponse => {
				
				if(cacheResponse){
					return cacheResponse.text();
				}
				else{
					return null;
				}
			})
			.then(text => {
				
				if(text){
					let urlObj = new URL(event.request.url);
					let adaptedRootHtml = adaptRootHtml(text, urlObj);
					return adaptedRootHtml;
				}
				else{
					return null;
				}
			})
			.then(adaptedRootHtml => {
				
				if(adaptedRootHtml){
					let responseInit = {status: 200, headers: {'Content-Type': 'text/html'}};
					let response = new Response(adaptedRootHtml, responseInit);
					return Promise.resolve(response);
				}
				else{
					return null;
				}
			})
			.then(response => {
				
				if(response) {
					return response;
				}
				return fetch(event.request);
			})
	);
}

function serveOther(event){
	
	// use original url with query-params
	let url = event.request.url;
	
	if(event.request.headers.get('range')) {
		serveRangeResponse(event);
	}
	else{
		
		let matchingOptions = {};
		
		if(!navigator.onLine){
			let urlObj = new URL(url);
			let variant = urlObj.searchParams.get('variant');
			if(variant == 'thumbnail'){
				matchingOptions.ignoreSearch = true;
			}
		}
		
		event.respondWith(
			caches.match(url, matchingOptions)
				.then(response => {
					// Cache hit - return response
					if(response) {
						return response;
					}
					return fetch(event.request);
				})
		);
	}
}

function serveRangeResponse(event){
	
	let pos = Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
	let cacheHit = false;
	  
    event.respondWith(
    	caches.open("v1")
    		.then(cache => {
    			return cache.match(event.request.url);
    		})
    		.then(cacheResponse => {
	
				if(cacheResponse){
					cacheHit = true;
					return cacheResponse.arrayBuffer();
				}
				else{
					return fetch(event.request);
				}
    		})
    		.then(arrayBufferOrResponse => {
	
				if(cacheHit){
					
					let ab = arrayBufferOrResponse;
					
	    			return new Response(
	    				ab.slice(pos),
	    				{
	    					status: 206,
	    					statusText: 'Partial Content',
	    					headers: [
	    						// ['Content-Type', 'video/webm'],
	    						['Content-Range', 'bytes ' + pos + '-' +
	    							(ab.byteLength - 1) + '/' + ab.byteLength]]
	    				});
				}
				else{
					return arrayBufferOrResponse;
				}
    		})
    );
}

function getQueryStrippedUrl(urlString){
	
	var requestUrlWithoutQuery;
	var questionMarkIdx = urlString.indexOf('?');
	if(questionMarkIdx != -1){
		requestUrlWithoutQuery = urlString.substring(0, questionMarkIdx);
	}
	else{
		requestUrlWithoutQuery = urlString;
	}
	
	let url = new URL(requestUrlWithoutQuery);
	return url;
}

function isSameOrigin(url) {
	
	let serviceworkerUrl = new URL(self.serviceWorker.scriptURL);
	return serviceworkerUrl.origin == url.origin;
}
