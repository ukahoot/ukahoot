class Interface {
    static showDropdown(msg) {
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
    static showAlert(msg) {
        $("#alert-box").fadeIn(200);
        $("#overlay").fadeIn(300);
        $("#alert-msg").text(msg);
         $("#alert-msg")[0].innerHTML =  $("#alert-msg")[0].innerHTML.replace('\n', '<br>');
    }
    static showLoading() {
        $("#overlay").fadeIn(200);
        $("#loading").fadeIn(300);
    }
    static hideLoading() {
        $("#overlay").fadeOut(200);
        $("#loading").fadeOut(300);
    }
    static init() {
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

            $("#title").toggle();
            $(".start-body").toggle();
            $("#dropdown-msg").toggle();
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
                ukahoot.pid = pidBox.value;
                // Do sanity checks before requesting for a token
                if (!ukahoot.pid || ukahoot.pid === "" || (isNaN(parseInt(ukahoot.pid)))) {
                    Interface.showAlert('You entered an invalid PID! Please retry.');
                    return;
                } else {
                    Interface.showLoading();
                    // Request for token
                    Token.get().then(token => {
                        Interface.hideLoading();
                        ukahoot.token = token;
                        console.debug('Resolved token', token);
                        $(start).fadeOut(300);
                        setTimeout(() => {
                            $(joinArea).fadeIn(300);
                        }, 300);
                    }).catch(err => {
                        Interface.hideLoading();
                        setTimeout(() => {
                            Interface.showAlert("There was an error requesting for the session token.\nMake sure you are using the correct PIN.");
                            console.error(err);
                        }, 500);
                    });
                }
            });
            alertOk.addEventListener('click', () => {
                $(alertBox).fadeOut(300);
                $(overlay).fadeOut(200);
            });
            tooltip.addEventListener('mouseenter', () => {
                $(tooltipArea).fadeIn(200);
            });
            tooltip.addEventListener('mouseleave', () => {
                $(tooltipArea).fadeOut(200);
            });
            joinButton.addEventListener('click', () => {
                if (nameArea.value) ukahoot.name = nameArea.value;
                if (clientCount.value) ukahoot.clients = clientCount.value;
                if (parseInt(ukahoot.clients) > 67) {
                    Interface.showAlert("The maximum amount of clients allowed is 67.");
                    return;
                }
                Interface.showLoading();
                ukahoot.wsURI += ukahoot.pid;
                ukahoot.wsURI += "/";
                ukahoot.wsURI += ukahoot.token;
                KahootSocket.setupSockets();
                KahootSocket.getReady().then(() => { // Wait until all of them have opened
                    Interface.hideLoading();
                    $(joinArea).fadeOut(250);
                    $(waitingArea).fadeIn(250);
                    ukahoot.isWaiting = true;
                    var pulse = false;
                    var waitInterval = setInterval(() => { // Make the waiting text 'glow'
                        if (ukahoot.isWaiting) {
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
            $(".ans").click(e => {
                var submitPacket = null;
                switch (e.target.id) {
                    case "ans0":
                        KahootSocket.sendAns(0);
                        break;
                    case "ans1":
                        KahootSocket.sendAns(1);
                        break;
                    case "ans2":
                        KahootSocket.sendAns(2);
                        break;
                    case "ans3":
                        KahootSocket.sendAns(3);
                        break;
                }
            });
        });
    }
}