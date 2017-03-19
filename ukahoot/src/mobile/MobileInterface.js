class MobileInterface extends SiteInterface {
    constructor() {
        super();
        this.style.unload();
        this. style = new Style(MobileInterface.STYLE_PATH);
        this.style.load();
    }
}
MobileInterface.STYLE_PATH = "ukahoot/src/mobile/mobileInterface.css";