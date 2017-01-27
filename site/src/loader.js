(() => {
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
        constructor(filename) {
            this.file = filename;
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
                    console.log('loaded module', me.file);
                    resolve();
                });
            });
        }
    }
    window.modules = {
        core: new UKahootModule("site/src/ukahoot.js"),
        packet: new UKahootModule("site/src/Packet.js"),
        jquery: new UKahootModule("site/jquery-3.1.1.min.js")
    };
    modules.jquery.load()
        .then(() => modules.packet.load())
        .then(() => modules.core.load());
})();