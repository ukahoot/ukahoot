(() => {
	"use strict";
	window.tokenServer = "http://127.0.0.1:5556/";
	window.dropDowns = [];
	window.ukahoot = {
		isWaiting: false,
		sockets: [],
		clientsConnected: 0,
		wsURI: "wss://kahoot.it/cometd/",
		clients: 1,
		name: "ukahoot",
		token: null,
		pid: null
	}
	Interface.init();
})();