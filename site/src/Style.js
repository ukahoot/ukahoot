class Style {
    load() {
        var me = this;
        return new Promise((resolve, reject) => {
            if (!me.path)
                reject("Can't load style without a path");
            else {
                me.element.rel = "stylesheet";
                me.element.type = "text/css";
                me.element.onload = resolve;
                document.head.appendChild(me.element);
            }
        });
    }
    constructor(path) {
        this.element = document.createElement("link");
        if (path) {
            this.path = path;
            this.element.href = path;
        } else {
            this.path = null;
        }
    }
}