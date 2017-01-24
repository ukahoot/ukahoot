(() => {
	try {
		class Test {}
	} catch (e) {
		alert('Your browser does not support Ukahoot!\nMake sure you are using the latest version of Chrome.');
		return;
	}
	window.pid = null;
	window.tokenServer = "http://127.0.0.1:5556/";
	window.requestConfig = {
		method: 'GET',
		headers: new Headers(),
		cache: 'default'
	}
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
		console.log(eval + challenge);
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
		// Load animations
		$("#title").slideDown({duration: 500});
		setTimeout(() => {
			$(".description").fadeIn(500);
			setTimeout(() => {
				$(".start-body").fadeIn(300);
			}, 300);
		}, 300);
		join.addEventListener('click', () => {
			var pid = pidBox.value;
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
								var token = getKahootToken(resObject.tokenHeader, challengeObject.challenge);
								console.debug('Resolved token', token);
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
	});
})();