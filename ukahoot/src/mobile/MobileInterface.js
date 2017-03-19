class MobileInterface extends SiteInterface {
    constructor() {
        super();
        this.style.unload();
        this. style = new Style(MobileInterface.STYLE_PATH);
        this.style.load();
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
    }
}
MobileInterface.STYLE_PATH = "mobileInterface.css";
window.MobileInterface = MobileInterface;