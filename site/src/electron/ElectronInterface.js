class ElectronInterface extends SiteInterface {
    constructor() {
        super();
        this.style.unload();
        this.style = new Style(ElectronInterface.STYLE_PATH);
        this.style.load();
    }
}
ElectronInterface.STYLE_PATH = "../interface/SiteInterface/siteInterface.css";