class Interface {
    // Methods that all interfaces should implement
    showDropdown() { }
    showAlert() { }
    showLoading() { }
    hideLoading() { }
    init() { }
    loadStyle() {
        if (this.style) {
            this.style.load().then(() => {
                console.debug('Loaded interface style');
            });
        } else {
            console.warn("Not loading nonexistent style");
        }
    }
    constructor() {
        this.events = new InterfaceEvents(this);
        // Properties that all interfaces should implement
        this.joinGameButton = null;
        this.joinButton = null;
        this.pidBox = null;
        this.nameArea = null;
        this.clientCountArea = null;
        this.dropDowns = [];
        this.style = null;
    }
}