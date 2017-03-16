class ElectronInterface extends SiteInterface {
    constructor() {
        super();
        this.style = new Style(ElectronInterface.STYLE_PATH);
    }
}
ElectronInterface.STYLE_PATH = "../interface/SiteInterface/siteInterface.css";