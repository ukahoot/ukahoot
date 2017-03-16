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
	};
	if (!window.ElectronInterface)
		window.ukahoot.interface = new SiteInterface;
	else
		window.ukahoot.interface = new ElectronInterface;
})();