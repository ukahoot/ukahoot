(function() {
    "use strict";
    {
		var supported = true;
		try {
			class Test {}
		} catch (e) {
			supported = false;
		}
		if (typeof fetch === "undefined") supported = false;
		if (!supported) {
			alert('Your browser does not support Ukahoot!\nMake sure you are using the latest version of Chrome.');
			return;
		}
	}
    // Small module system to load JS source files
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
    window.modules = {
        core: new UKahootModule("site/src/ukahoot.js", "Core"),
        interfaceEvents: new UKahootModule("site/src/interface/InterfaceEvents.js", "Interface Events"),
        interface: new UKahootModule("site/src/interface/Interface.js", "Interface"),
        siteInterface: new UKahootModule('site/src/interface/SiteInterface.js', "Site Interface"),
        token: new UKahootModule("site/src/protocol/Token.js", "Token Util"),
        packet: new UKahootModule("site/src/protocol/Packet.js", "Packet"),
        packetHandler: new UKahootModule("site/src/protocol/PacketHandler.js", "PacketHandler"),
        kahootSocket: new UKahootModule("site/src/protocol/KahootSocket.js", "KahootSocket"),
        jquery: new UKahootModule("site/jquery-3.1.1.min.js", "jquery")
    };
    window.shared = {};
    modules.jquery.load()
        .then(() => modules.packet.load())
        .then(() => modules.packetHandler.load())
        .then(() => modules.kahootSocket.load())
        .then(() => modules.interfaceEvents.load())
        .then(() => modules.interface.load())
        .then(() => modules.siteInterface.load())
        .then(() => modules.token.load())
        .then(() => modules.core.load());
})();