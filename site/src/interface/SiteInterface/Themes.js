class Theme {
    constructor(borderColor, bgColor) {
        if (borderColor)
            this.borderColor = borderColor;
        else
            this.borderColor = null;
        if (bgColor)
            this.bgColor = bgColor;
        else this.bgColor = bgColor;
    }
}
class ThemeEditor {
    constructor(elem) {
        if (!elem) throw new Error("ThemeEditor needs a container element!");
        this.elm = elem;
    }
}