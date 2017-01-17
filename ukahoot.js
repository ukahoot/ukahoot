(() => {
	try {
		class Test {}
	} catch (e) {
		alert('Your browser does not support ukahoot!\nMake sure you are using the latest version of Chrome.');
		return;
	}
	window.pid = null;
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
				window.pid = pid;
				var xhr = new XMLHttpRequest;
				// https://kahoot.it/reserve/session/354127/?1484635649624
				xhr.open('GET', 'https://kahoot.it/reserve/session/' + pid + '/?' + getKahootDate(), true);
				xhr.send(null);
				xhr.onreadystatechange = () => {
					switch (this.readyState) {
						case 2: // HEADERS_RECEIVED
							showLoading();
							break;
						case 4: // DONE
							switch (xhr.status) {
								// TODO: check status code
							}
							break;
					}
				}
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
				requestToken().then((xhr) => {
					hideLoading();
					// TODO: Finish the rest of the request handling
				});
			}
		});
		alertOk.addEventListener('click', () => {
			$(alertBox).fadeOut(300);
			$(overlay).fadeOut(200);
		});
	});
})();