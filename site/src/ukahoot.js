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
	Packet.Handler = {
		"handshake": new PacketHandler("handshake", packet => {
			// Store the client ID the server gave 
			packet.client.cid = packet.obj.clientId;
			// Handshake accepted, send back a subscription packet
			var handsh = new Packet(null, packet.client);
			handsh.timesync(packet.obj);
			// Handshake response doesn't want the ACK extension
			handsh.obj[0].ext.ack = undefined;
			handsh.obj[0].channel = "/meta/subscribe";
			handsh.obj[0].clientId = packet.client.cid;
			// subscribe to the controller channel
			handsh.obj[0].subscription = "/service/controller";
			handsh.obj[0].id = packet.client.msgCount + "";
			packet.client.send(handsh);
		}),
		"subscribe": new PacketHandler("subscribe", packet => {
			// Send info about the client to the server
			var p = new Packet(null, packet.client);
			p.timesync(packet.obj);
			// subscribe to a new channel
			p.obj[0].channel = "/meta/subscribe";
			p.obj[0].clientId = packet.client.cid;
			p.obj[0].subscription = "/service/player";
			packet.client.send(p);
			// send another packet containing connection info
			var p2 = new Packet(null, packet.client);
			p2.timesync(packet.obj);
			p2.obj[0].channel = "/meta/connect";
			p2.obj[0].clientId = packet.client.cid;
			p2.obj[0].connectionType = "websocket";
			p2.obj[0].advice = {
				timeout: 0
			};
			packet.client.send(p2);
			// send one more packet to subscribe to the status channel
			var p3 = new Packet(null, packet.client);
			p3.timesync(packet.obj);
			p3.obj[0].channel = "/meta/subscribe";
			p3.obj[0].clientId = packet.client.cid;
			p3.obj[0].subscription = "/service/status";
			packet.client.send(p3);
		}),
		"keepalive": new PacketHandler('keepalive', packet => {
			var keepalive = new Packet();
			keepalive.timesync(packet.obj);
			keepalive.obj[0].clientId = packet.client.cid;
			keepalive.obj[0].id = packet.client.msgCount+"";
			packet.client.send(keepalive);
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
		onmessage(msg, me) {
			var packet = new Packet(msg.data, me);
			// Log the incoming packets (this is temporary)
			console.debug(packet.obj);
			// Handle packets
			if (packet.obj.channel == "/meta/handshake" && packet.obj.clientId) {
				console.debug('recieved handshake packet');
				Packet.Handler["handshake"].handle(packet);
			} else if (packet.obj.channel == "/meta/subscribe" && packet.obj.subscription == "/service/controller" && packet.obj.successful == true) {
				console.debug('recieved subscribe success packet');
				Packet.Handler["subscribe"].handle(packet);
			} else {
				// TODO: add packet type handling
			}
			// Control keep alive packets
			if (packet.obj.ext && packet.obj.channel != "/meta/subscribe" && packet.obj.channel != "/meta/handshake") {
				console.debug('recieved keepalive packet');
				Packet.Handler['keepalive'].handle(packet);
			}
		}
		constructor(ip, isMaster) {
			var me = this;
			console.debug('Constructed client ' + clients.length);
			this.ws = new window.WebSocket(ip);
			// The client ID given by the server
			this.cid = null;
			// The master socket will control all the website's events
			if (isMaster) this.isMaster = true;
			else this.isMaster = false;
			this.ws.onopen = this.onopen;
			this.ws.onclose = this.onclose;
			this.ws.onmessage = msg => {
				me.onmessage(msg, me);
			}
			this.msgCount = 0;
		}
		send(packet) {
			var msg = packet.str();
			this.msgCount++;
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
		var lib = "var _ = {replace: function(){" +
				   "var args = arguments;" +
				   "var s = arguments[0];" + 
				   "return s.replace(args[1], args[2]);" +
				   "}};" +
				   "return ";
		var solver = new Function(lib + challenge);
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