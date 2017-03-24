(() => {
    class UKahootModule {
        constructor(filename, name) {
            this.file = filename;
            this.name = name;
        }
        load() {
            var me = this;
            return new Promise((resolve, reject) => {
                var moduleScript = document.createElement('script');
                moduleScript.src = me.file;
                moduleScript.type = "text/javascript";
                document.head.appendChild(moduleScript);
                moduleScript.addEventListener('load', function postLoad() {
                    moduleScript.removeEventListener('load', postLoad, false);
                    console.log("Loaded module '" + me.name + "'");
                    resolve();
                });
            });
        }
    }
    var modules = {
        core: new UKahootModule("../ukahoot.js", "Core"),
        style: new UKahootModule("../Style.js", "Style"),
        interfaceEvents: new UKahootModule("../interface/InterfaceEvents.js", "Interface Events"),
        interface: new UKahootModule("../interface/Interface.js", "Interface"),
        siteInterface: new UKahootModule('../interface/SiteInterface/SiteInterface.js',
                                        "Site Interface"),
        electronInterface: new UKahootModule('interface/ElectronInterface.js',
                                        "Electron Interface"),
        token: new UKahootModule("../protocol/Token.js", "Token Util"),
        packet: new UKahootModule("../protocol/Packet.js", "Packet"),
        themeEditor: new UKahootModule('../interface/SiteInterface/ThemeEditor.js',
                                        "Theme Editor"),
        theme: new UKahootModule('../interface/SiteInterface/Theme.js',
                                        "Theme"),
        packetHandler: new UKahootModule("../protocol/PacketHandler.js", "PacketHandler"),
        kahootSocket: new UKahootModule("../protocol/KahootSocket.js", "KahootSocket"),
        bypass: new UKahootModule("../Bypass.js", "Bypass"),
        jscolor: new UKahootModule("../../lib/jscolor.min.js", "jscolor")
    };
    modules.bypass.load();
    modules.jscolor.load()
    .then(() => modules.interfaceEvents.load())
    .then(() => modules.interface.load())
    .then(() => modules.siteInterface.load())
    .then(() => modules.themeEditor.load())
    .then(() => modules.theme.load())
    .then(() => modules.electronInterface.load())
    .then(() => modules.core.load());
    modules.token.load();
    modules.style.load();
    modules.kahootSocket.load();
    modules.packet.load()
        .then(() => modules.packetHandler.load())
})();