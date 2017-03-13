class Style {
    load() {
        return new Promise((resolve, reject) => {
            this.element.rel = "stylesheet";
            this.element.type = "text/css";
            this.element.onload = resolve;
            document.head.appendChild(this.element);
        });
    }
    constructor(path) {
        this.path = path;
        this.element = document.createElement("link");
        this.element.href = path;
    }
}