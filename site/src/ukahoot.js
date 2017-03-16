(() => {
	window.ukahoot = {
		isWaiting: false,
		sockets: [],
		clientsConnected: 0,
		wsURI: "wss://kahoot.it/cometd/",
		clients: 1,
		name: "ukahoot",
		token: null,
		pid: null,
		tokenServer: "http://tokenserver.ukahoot.it/",
		interface: null
	}
	if (window["process"] && window.process.type) {
		// The client is running in electron
		// TODO: Add electron compatibility
	} else {
		// The client is running in a browser window
		ukahoot.interface = new SiteInterface;
	}
})();