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
            this.loaded = false;
        }
        load() {
            return new Promise((resolve, reject) => {
                var moduleScript = document.createElement('script');
                moduleScript.src = this.file;
                moduleScript.type = "text/javascript";
                document.head.appendChild(moduleScript);
            });
        }
    }
})();