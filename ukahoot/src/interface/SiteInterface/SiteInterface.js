class SiteInterface extends Interface {
    showDropdown(msg) {
        this.dropDowns.push($("<div class='dropdown'></div>"));
		var currentBox = this.dropDowns[this.dropDowns.length - 1];
        if (this.dropdownColor)
            currentBox.css("backgroundColor", this.dropdownColor);
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
        this.parent.isAnswering = true;
        console.debug('Question started');
        if (!this.parent.firstQuestionStarted) {
            this.parent.firstQuestionStarted = true;
            $("#playing-area").fadeIn(250);
            $(this.parent.waitingArea).fadeOut(250);
        } else {
            this.parent.playingArea.style.opacity = 1;
            this.parent.showDropdown("Question started.");
        }
    }
    onQuestionSubmit() {
        this.parent.showDropdown("Your answer has been submitted!");
        this.parent.playingArea.style.opacity = 0.4;
    }
    onQuestionEnd(data) {
        this.isAnswering = false;
        console.debug('Question ended. Packet data:', data);
        var response = "The question has ended. ";
        if (data.isCorrect)
            response += "You got it right!";
        else
            response += "You got it wrong...";
        this.parent.showDropdown(response);
        this.parent.playingArea.style.opacity = 0.4;
    }
    onQuizStart() {
        this.parent.waitText.innerHTML = "The quiz is starting!";
    }
    onQuizFinish(data) {
        var color = "";
        switch (data.metal) {
            case "gold":
                color = "yellow";
                $("#finish-metal").text("Gold");
                break;
            case "silver":
                color = "grey";
                $("#finish-metal").text("Silver");
                break;
            case "bronze":
                color = "brown";
                $("#finish-metal").text("Bronze");
                break;
            default:
                $("#finish-metal").text("None"); 
                break;
        }
        $("#finish-metal").css("color", color);
        $("#finish-msg").text(data.msg);
        this.parent.showFinishArea();
    }
    handleAnswer(me, e) {
        if (this.isAnswering) {
            var ans = null;
            var targetElem = null;
            if (e.target.className == "shape") {
                // The user clicked a shape
                targetElem = e.target.parentElement; // Make sure the correct element is used
            } else {
                // The user clicked the answer element
                targetElem = e.target;
            }
            switch (targetElem.id) {
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
                default:
                    debugger;
                    break;
            }
            me.events.onAnswer.call(me, ans);
        }
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
        }).catch(err => {
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
    showFinishArea() {
        $("#playing-area").fadeOut(250);
        $("#start").fadeOut(250); // For debugging CSS
        setTimeout(() => {
            $("#finish-area").fadeIn(250);
        }, 100);
    }
    init() {
        var me = this;
        me.themeEditor = new ThemeEditor();
        me.themeEditor.readStorage();

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
        me.events.onQuizStart = me.onQuizStart;
        me.events.onQuizFinish = me.onQuizFinish;
        me.firstQuestionStarted = false;

        me.events.onError = e => {
            $("#wait-message").html("Failed to join the quiz.");
            $(me.waitText).html("");
            this.showAlert("An error has occured:\n'" +
            e + "'\nPlease refresh the page.");
        }
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

        $("#title").toggle();
        $(".start-body").toggle();
        $("#dropdown-msg").toggle();
        $(".description").toggle();
        $(me.joinArea).toggle();
        $(tooltipArea).toggle();
        $(me.waitingArea).toggle();
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
        me.isAnswering = false;
        me.dropdownColor = null;
        me.style = new Style(SiteInterface.STYLE_PATH);
        me.loadStyle();
        // Remove innerHTML until the window is ready
        me.siteHTML = document.innerHTML;
        document.innerHTML = "";
        window.addEventListener('load', () => {
            // Replace site HTML
            document.innerHTML = me.siteHTML;
            me.init.call(me);
        });
    }
}
SiteInterface.STYLE_PATH = "ukahoot/src/interface/SiteInterface/siteInterface.css";