var debugTools = (function() {

	function DebugTools() {

		var debugBar = document.createElement('div');
		debugBar.classList.add('debugBar');

		var loggingTab = document.createElement('div');
		loggingTab.classList.add('loggingTab');
		debugBar.appendChild(loggingTab);

		var oldLog = console.log;
		var oldError = console.error;

		console.log = function(message) {

			var logMsg = document.createElement('div');
			logMsg.classList.add('logMessage');
			logMsg.textContent = message;
			loggingTab.appendChild(logMsg);
			oldLog.apply(console, arguments);
			debugBar.lastElementChild.scrollIntoView();
		};

		console.error = function(message) {

			var logMsg = document.createElement('div');
			logMsg.classList.add('logMessage error');
			logMsg.textContent = message;
			loggingTab.appendChild(logMsg);
			oldError.apply(console, arguments);
			debugBar.lastElementChild.scrollIntoView();
		};

		var linkHtml = '<link rel="stylesheet" href="css/debug-tools.css">';

		if (document.readyState == 'complete') {

			document.body.appendChild(debugBar);
			document.head.insertAdjacentHTML('beforeend', linkHtml);
		}
		else {

			window.addEventListener('load', function(e) {
				document.body.appendChild(debugBar);
				document.head.insertAdjacentHTML('beforeend', linkHtml);
			});
		}
	}

	return new DebugTools();

}());