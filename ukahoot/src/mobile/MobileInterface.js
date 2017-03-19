class MobileInterface extends SiteInterface {
    constructor() {
        super();
        this.style.unload();
        this. style = new Style(MobileInterface.STYLE_PATH);
        this.style.load();
    }
}
MobileInterface.STYLE_PATH = "mobileInterface.css";