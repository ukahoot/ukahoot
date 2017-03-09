class Interface {
    // Methods that all interfaces should implement
    onAnswer(ans) {
        KahootSocket.sendAns(ans);
    }
    showDropdown() { }
    showAlert() { }
    showLoading() { }
    hideLoading() { }
    init() { }
    constructor() {
        this.events = new InterfaceEvents(this);
        // Properties that all interfaces should implement
        this.joinGameButton = null;
        this.joinButton = null;
        this.pidBox = null;
        this.nameArea = null;
        this.clientCountArea = null;
    }
}