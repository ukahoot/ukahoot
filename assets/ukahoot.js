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
		var eval = "var _ = {" +
				   "var args = arguments;" +
				   "var s = arguments[0];" + 
				   "return s.replace(args[1], args[2]);" +
				   "}};"; +
				   "var CONSOLE_LOG = function(){}" +
				   "return ";
		var solved = "";
		(() => {
			// Execute (eval) the string
			var solver = Function(eval + challenge);
			solved = solver().toString();
		});
		// return the solved token
		return solved;
	}
	var getKahootToken = (headerToken, challengeToken) => {
		headerToken = atoi(headerToken);
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
						console.debug('Got response object:', resObject);
						// TODO: Further process the response object
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