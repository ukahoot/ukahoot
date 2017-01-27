(() => {
	{
		var supported = true;
		try {
			class Test {}
		} catch (e) {
			supported = false;
		}
		if (typeof fetch === "undefined") supported = false;
		if (!supported) {
			alert('Your browser does not support Ukahoot!\nMake sure you are using the latest version of Chrome.');
			return;
		}
	}
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
	class PacketHandler {
		constructor(id, handler) {
			// The handler is the function called when a packet is recieved
			this.handler = handler;
			this.id = id;
		}
		handle(packet) {
			this.currentPacket = packet;
			return this.handler.call(this, packet);
		}
	}
	class Packet {
		constructor(rawString, client) {
			this.outgoing = true;
			this.raw = null;
			this.obj = [{}];
			if (client) this.client = client;
			else this.client = null;
			if (rawString) {
				this.outgoing = false;
				this.raw = rawString;
				this.obj = JSON.parse(rawString)[0];
			}
		}
		timesync(packet2) {
			if (typeof packet2 == "string") packet2 = JSON.parse(packet2);
			var that = this;
			this.obj[0].channel = packet2.channel;
			this.obj[0].ext = {
				ack: packet2.ext.ack,
				timesync: {
					l: ((new Date).getTime() - packet2.ext.timesync.tc - packet2.ext.timesync.p) / 2,
					o: (packet2.ext.timesync.ts - packet2.ext.timesync.tc - 1),
					tc: (new Date()).getTime()
				}
			}
			this.raw = JSON.stringify(that.obj);
		}
		str() {
			var that = this;
			this.raw = JSON.stringify(that.obj);
		}
	}
	Packet.HANDSHAKE = [{
		advice: {
			interval: 0,
			timeout: 60000
		},
		channel: '/meta/handshake',
		ext: {
			ack: true,
			timesync: {
				l: 0,
				o: 0,
				tc: (new Date).getTime()
			},
			id: "1",
			minimumVersion: "1.0",
			supportedConnectionTypes: [
				"websocket",
				"long-polling"
			],
			version: "1.0"
		}
	}];
	Packet.Handler = {
		"handshake": new PacketHandler("handshake", packet => {
			// Store the client ID the server gave 
			packet.client.cid = packet.obj[0].clientId;
			// Handshake accepted, send back a subscription packet
			var handsh = new Packet(null, packet.client);
			handsh.timesync(packet.obj);
			// Handshake response doesn't want the ACK extension
			handsh.obj[0].ext.ack = undefined;
			handsh.obj[0].channel = "/meta/subscribe";
			handsh.obj[0].clientId = packet.client.cid;
			// subscribe to the controller channel
			handsh.obj[0].subscription = "/service/controller";
			packet.client.send(handsh);
		}),
		9: new PacketHandler(9, packet => {
			// Ignore non master messages
			if (packet.client.isMaster) {
				// This packet indicates that the quiz is starting
				// TODO: handle quiz starting
			}
		})
	};
	class KahootSocket {
		static getReady() {
			return new Promise((resolve, reject) => {
				var check = setInterval(() => {
					if (clientsConnected >= window.clients) {
						clearInterval(check);
						resolve();
					}
				}, 100);
			});
		}
		static send(msg) {
			for (var i = 0; i < window.clients; ++i) {
				try {
					clients[i].send(msg);
				} catch (e) {
					console.debug("socket" + i + " encountered send exception:");
					console.error(e);
				}
			}
		}
		onopen() {
			console.debug('socket opened, sending handshake');
			clientsConnected += 1;
			// Sync the packet time
			Packet.HANDSHAKE[0].ext.timesync.tc = (new Date()).getTime();
			// send the handshake
			this.send(JSON.stringify(Packet.HANDSHAKE));
		}
		onclose() {
			// TODO: handle onclose events from sockets
		}
		onmessage(msg) {
			var packet = new Packet(msg.data, this);
			// Log the incoming packets (this is temporary)
			console.debug(packet.obj);
			// Handle packets
			if (packet.obj.channel == "/meta/handshake" && packet.obj.clientId) {
				console.debug('recieved handshake packet');
				Packet.Handler["handshake"].handle(packet);
			} else {
				// TODO: add packet type handling
			}
		}
		constructor(ip, isMaster) {
			console.debug('Constructed client ' + clients.length);
			this.ws = new window.WebSocket(ip);
			// The client ID given by the server
			this.cid = null;
			// The master socket will control all the website's events
			if (isMaster) this.isMaster = true;
			else this.isMaster = false;
			this.ws.onopen = this.onopen;
			this.ws.onclose = this.onclose;
			this.ws.onmessage = this.onmessage;
		}
		send(packet) {
			var msg = packet.str();
			try {
				this.ws.send(msg);
			} catch (e) {
				console.debug("socket" + i + " encountered send exception:");
				console.error(e);
			}
		}
	}
	var clients = [];
	var getKahootDate = () => {
		return (new Date).getTime();
	}
	var solveChallenge = challenge => {
		var eval = "var _ = {replace: function(){" +
				   "var args = arguments;" +
				   "var s = arguments[0];" + 
				   "return s.replace(args[1], args[2]);" +
				   "}};" +
				   "return ";
		var solver = new Function(eval + challenge);
		// return the solved token
		return solver().toString();
	}
	var getKahootToken = (headerToken, challengeToken) => {
		headerToken = atob(headerToken);
		challengeToken = solveChallenge(challengeToken);
		var token = "";
		for (var i = 0; i < headerToken.length; i++) {
		    var chr = headerToken.charCodeAt(i);
		    var mod = challengeToken.charCodeAt(i % challengeToken.length);
		    var dc = chr ^ mod;
		    token += String.fromCharCode(dc);
		}
		return token;
	}
	window.addEventListener('load', () => {
		var join     = document.getElementById('join');
		var pidBox   = document.getElementById('pid');
		var alertBox = document.getElementById('alert-box');
		var alertOk  = document.getElementById('alert-ok');
		var alertMsg = document.getElementById('alert-msg');
		var overlay  = document.getElementById('overlay');
		var loading  = document.getElementById('loading');
		var joinArea = document.getElementById('join-area');
		var start    = document.getElementById('start');
		var tooltip  = document.getElementById('help-tooltip');
		var tooltipArea = document.getElementById('tooltip-area');
		var joinButton = document.getElementById('join-game');
		var nameArea = document.getElementById('name-area');
		var clientCount = document.getElementById('client-count-area');
		var waitingArea = document.getElementById('waiting-area');
		var waitText = document.getElementById('wait');
		var loadingArea = document.getElementById('loading-area');
		var isWaiting = false;

		var showAlert = msg => {
			$(alertBox).fadeIn(200);
			$(overlay).fadeIn(300);
			alertMsg.textContent = msg;
			alertMsg.innerHTML = alertMsg.innerHTML.replace('\n', '<br>');
		}
		var showLoading = () => {
			$(overlay).fadeIn(200);
			$(loading).fadeIn(300);
		}
		var hideLoading = () => {
			$(overlay).fadeOut(200);
			$(loading).fadeOut(300);
		}
		var requestToken = pid => {
			var req = new Request(window.tokenServer + "?pid=" + pid, window.requestConfig);
			return fetch(req);
		}
		$("#title").toggle();
		$(".start-body").toggle();
		$(".description").toggle();
		$(joinArea).toggle();
		$(tooltipArea).toggle();
		$(waitingArea).toggle();
		$(loadingArea).toggle();
		// Load animations
		$("#title").slideDown({duration: 500});
		setTimeout(() => {
			$(".description").fadeIn(500);
			setTimeout(() => {
				$(".start-body").fadeIn(300);
			}, 300);
		}, 300);
		join.addEventListener('click', () => {
			window.pid = pidBox.value;
			// Do sanity checks before requesting for a token
			if (!pid || pid === "" || (isNaN(parseInt(pid)))) {
				showAlert('You entered an invalid PID! Please retry.');
				return;
			} else {
				showLoading();
				// Request for token
				requestToken(pid).then(response => {
					hideLoading();
					response.json().then(resObject => {
						if (resObject.error) {
							setTimeout(() => {
								showAlert("Your PIN is invalid! The Kahoot server responded with:\n" + resObject.responseCode);
							}, 200);
							return;
						} else {
							console.debug('Got response object:', resObject);
							var challengeObject = null;
							resObject.responseBody = resObject.responseBody.replace('console.log("Offset derived as:", offset);', "");
							try {
								challengeObject = JSON.parse(resObject.responseBody);
							} catch (e) {
								console.debug('There was an error parsing the challenge JSON:');
								console.error(e);
								setTimeout(() => {
									showAlert("There was an error processing the server's response.");
								}, 200);
								return;
							}
							if (challengeObject !== null) {
								window.token = getKahootToken(resObject.tokenHeader, challengeObject.challenge);
								if (token) {
									console.debug('Resolved token', token);
									$(start).fadeOut(300);
									setTimeout(() => {
										$(joinArea).fadeIn(300);
									}, 300);
								} else {
									setTimeout(() => {
										showAlert("There was an error resloving the join token.\nPlease use another PIN.");
									});
									return;
								}
							}
						}
					}).catch(err => {
						console.debug('There was an error parsing the response JSON:');
						console.error(err);
						setTimeout(() => {
							showAlert("There was an error processing the server's response.");
						}, 200);
						return;
					});
				}).catch(error => {
					hideLoading();
					setTimeout(() => {
						showAlert("There was an error requesting for the session token.\nMake sure you are using the correct PIN.");
						console.error(error);
					}, 500);
				});
			}
		});
		alertOk.addEventListener('click', () => {
			$(alertBox).fadeOut(300);
			$(overlay).fadeOut(200);
		});
		tooltip.addEventListener('mouseenter', () => {
			$(tooltipArea).fadeIn	(200);
		});
		tooltip.addEventListener('mouseleave', () => {
			$(tooltipArea).fadeOut(200);
		});
		joinButton.addEventListener('click', () => {
			if (nameArea.value) window.name = nameArea.value;
			if (clientCount.value) window.clients = clientCount.value;
			showLoading();
			window.wsURI += window.pid;
			window.wsURI += "/";
			window.wsURI += window.token;
			for (var i = 0; i < window.clients; ++i) {
				if (i == 1) clients.push(new KahootSocket(wsURI, true));
				else clients.push(new KahootSocket(wsURI));
			}
			KahootSocket.getReady().then(() => {
				hideLoading();
				$(joinArea).fadeOut(250);
				$(waitingArea).fadeIn(250);
				isWaiting = true;
				var pulse = false;
				var waitInterval = setInterval(() => {
					if (isWaiting) {
						if (pulse) {
							waitText.style.opacity = 1;
						} else {
							waitText.style.opacity = 0.5;
						}
						pulse = !pulse;
					} else {
						clearInterval(waitInterval);
						return;
					}
				}, 750);
			});
		});
	});
})();