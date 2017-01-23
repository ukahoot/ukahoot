(() => {
	try {
		class Test {}
	} catch (e) {
		alert('Your browser does not support Ukahoot!\nMake sure you are using the latest version of Chrome.');
		return;
	}
	window.pid = null;
	window.tokenServer = "http://127.0.0.1:5556";
	var getKahootDate = () => {
		return (new Date).getTime();
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
			msg = msg.replace('\n', '<br>');
			alertMsg.textContent = msg;
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
			return new Promise((resolve, reject) => {
				//
			});
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
				// Request for token
				requestToken(pid).then((xhr) => {
					hideLoading();
					// TODO: Finish the rest of the request handling
				}).catch((xhr) => {
					showAlert("There was an error requesting for the session token.\nMake sure you are using the correct PIN.");
				});
			}
		});
		alertOk.addEventListener('click', () => {
			$(alertBox).fadeOut(300);
			$(overlay).fadeOut(200);
		});
	});
})();