class InterfaceEvents {
    onJoinGame(inputPID) {
        var me = this.parent;
        ukahoot.pid = inputPID;
        return new Promise((resolve, reject) => {
            // Do sanity checks before requesting for a token
            if (!ukahoot.pid || ukahoot.pid === "" || (isNaN(parseInt(ukahoot.pid)))) {
                me.showAlert('You entered an invalid PID! Please retry.');
                return;
            } else {
                me.showLoading();
                // Request for token
                Token.get().then(token => {
                    me.hideLoading();
                    ukahoot.token = token;
                    console.debug('Resolved token', token);
                    resolve(token);
                }).catch(reject);
            }
        });
    }
    onJoin() {
        return new Promise((resolve, reject) => {
            var me = this.parent;
            if (me.nameArea.value) {
                ukahoot.name = me.nameArea.value;
                ukahoot.name = Bypass.patchStr(ukahoot.name);
            }
            if (me.clientCountArea.value) ukahoot.clients = me.clientCountArea.value;
            if (parseInt(ukahoot.clients) > 67) {
                return reject("The maximum amount of clients allowed is 67.");
            }
            me.showLoading();
            ukahoot.wsURI += ukahoot.pid;
            ukahoot.wsURI += "/";
            ukahoot.wsURI += ukahoot.token;
            KahootSocket.setupSockets();
            KahootSocket.getReady().then(() => { // Wait until all of them have opened
                me.hideLoading();
                resolve();
            });
        });
    }
    onAnswer(ans) {
        KahootSocket.sendAns(ans);
    }
    onQuestionEnd(data) { }
    onQuestionSubmit() { }
    onQuestionStart() { }
    onLoad() { }
    onQuizEnd() { }
    onQuizStart() { }
    onQuizFinish(data) { }
    onError(e) { }
    constructor(parent) {
        this.parent = parent;
    }
}
// Add static methods
InterfaceEvents.onJoin = InterfaceEvents.prototype.onJoin;
InterfaceEvents.onJoinGame = InterfaceEvents.prototype.onJoinGame;