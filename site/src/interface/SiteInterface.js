class SiteInterface extends Interface {
    showDropdown(msg) {
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
    showAlert(msg) {
        $("#alert-box").fadeIn(200);
        $("#overlay").fadeIn(300);
        $("#alert-msg").text(msg);
        $("#alert-msg")[0].innerHTML =  $("#alert-msg")[0].innerHTML.replace('\n', '<br>');
    }
    showLoading() {
        $("#overlay").fadeIn(200);
        $("#loading").fadeIn(300);
    }
    hideLoading() {
        $("#overlay").fadeOut(200);
        $("#loading").fadeOut(300);
    }
    onQuestionStart() {
        console.debug('Question started');
        $("#loading-area").fadeOut(250);
        $("#playing-area").fadeIn(250);
        this.parent.playingArea.style.opacity = 1;
        this.parent.showDropdown("Question started.");
    }
    onQuestionSubmit() {
        this.parent.showDropdown("Question submitted!");
        this.parent.playingArea.style.opacity = 0.4;
    }
    onQuestionEnd() {
        this.parent.showDropdown("The question has ended.");
    }
    handleAnswer(me, e) {
        var ans = null;
        switch (e.target.id) {
            case "ans0":
                ans = 0;
                break;
            case "ans1":
                ans = 1;
                break;
            case "ans2":
                ans = 2;
                break;
            case "ans3":
                ans = 3;
                break;
        }
        me.events.onAnswer.call(me, ans);
    }
    onJoin() {
        var me = this;
        // Call the original onJoin
        InterfaceEvents.onJoin
        .call(me.events).then(() => {
            $(me.joinArea).fadeOut(250);
            $(me.waitingArea).fadeIn(250);
            ukahoot.isWaiting = true;
            var pulse = false;
            var waitInterval = setInterval(() => { // Make the waiting text 'glow'
                if (ukahoot.isWaiting) {
                    if (pulse) {
                        me.waitText.style.opacity = 1;
                    } else {
                        me.waitText.style.opacity = 0.5;
                    }
                    pulse = !pulse;
                } else {
                    clearInterval(waitInterval);
                    return;
                }
            }, 750);
        }).catch(e => {
            if (e == "The maximum amount of clients allowed is 67.") {
                return me.showAlert(e);
            } else {
                me.showAlert("There was an issue joining.");
                console.error(e);
                return;
            }
        });
    }
    onJoinGame(pid) {
        var me = this;
        InterfaceEvents.onJoinGame
        .call(me.events, pid).then(token => {
            $(start).fadeOut(300);
            setTimeout(() => {
                $(me.joinArea).fadeIn(300);
            }, 300);
        }).catch(() => {
            me.hideLoading();
            setTimeout(() => {
                me.showAlert("There was an error requesting for the session token.\nMake sure you are using the correct PIN.");
                console.error(err);
            }, 500);
        });
    }
    onQuizEnd() {
        this.parent.showAlert("The Kahoot has ended.");
    }
    init() {
        var me = this;
        me.joinGameButton = document.getElementById('join');
        me.joinButton = document.getElementById('join-game');
        me.pidBox = document.getElementById("pid");
        me.playingArea = document.getElementById("playing-area");
        me.events.onJoinGame = me.onJoinGame;
        me.events.onJoin = me.onJoin;
        me.events.onQuizEnd = me.onQuizEnd;
        me.events.onQuestionStart = me.onQuestionStart;
        me.events.onQuestionSubmit = me.onQuestionSubmit;
        me.events.onQuestionEnd = me.onQuestionEnd;

        $(".ans").click(e => {
            me.handleAnswer.call(this, me, e);
        });
        me.joinGameButton.addEventListener('click', () => {
            me.events.onJoinGame.call(me, me.pidBox.value);
        });
        me.joinButton.addEventListener('click', () => {
            me.events.onJoin.call(me);
        });

        var join     = document.getElementById('join');
        var alertBox = document.getElementById('alert-box');
        var alertOk  = document.getElementById('alert-ok');
        var alertMsg = document.getElementById('alert-msg');
        var overlay  = document.getElementById('overlay');
        var loading  = document.getElementById('loading');
        me.joinArea = document.getElementById('join-area');
        var start    = document.getElementById('start');
        var tooltip  = document.getElementById('help-tooltip');
        var tooltipArea = document.getElementById('tooltip-area');
        me.nameArea = document.getElementById('name-area');
        me.clientCountArea = document.getElementById('client-count-area');
        me.waitingArea = document.getElementById('waiting-area');
        me.waitText = document.getElementById('wait');
        var loadingArea = document.getElementById('loading-area');

        $("#title").toggle();
        $(".start-body").toggle();
        $("#dropdown-msg").toggle();
        $(".description").toggle();
        $(me.joinArea).toggle();
        $(tooltipArea).toggle();
        $(me.waitingArea).toggle();
        $(loadingArea).toggle();
        // Load animations
        $("#title").slideDown({duration: 500});
        setTimeout(() => {
            $(".description").fadeIn(500);
            setTimeout(() => {
                $(".start-body").fadeIn(300);
            }, 300);
        }, 300);
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
    }
    constructor() {
        super();
        var me = this;
        window.addEventListener('load', () => {
            me.init.call(me);
        });
    }
}