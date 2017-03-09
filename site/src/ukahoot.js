(() => {
	"use strict";
	window.pid = null;
	window.tokenServer = "http://127.0.0.1:5556/";
	window.token = null;
	window.name = "ukahoot";
	window.clients = 1;
	window.wsURI = "wss://kahoot.it/cometd/";
	window.requestConfig = {
		method: 'GET',
		headers: new Headers(),
		cache: 'default'
	}
	window.clientsConnected = 0;
	window.dropDowns = [];
	window.isWaiting = false;
	window.showDropdown = (msg) => {
		dropDowns.push($("<div class='dropdown'></div>"));
		var currentBox = dropDowns[dropDowns.length - 1];
		currentBox.toggle();
		$("#dropdowns").prepend(currentBox);
		$("#dropdowns").prepend("<br>");
		currentBox.text(msg);
		currentBox.slideDown({duration: 500});
		setTimeout(() => {
			currentBox.slideUp({duration: 500});
		}, 4000);
	}
	window.sockets = [];
	Interface.init();
})();