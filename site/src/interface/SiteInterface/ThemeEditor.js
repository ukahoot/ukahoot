class ThemeEditor {
    show() {
        $("#overlay").fadeIn(250);
        $("#theme-editor").fadeIn(250);
    }
    hide() {
        $("#theme-editor").fadeOut(250);
        $("#overlay").fadeOut(250);
    }
    constructor() {
        var me = this;
        document.getElementById("show-theme").addEventListener("click",
                                                                                                                    me.show);
        document.getElementById("hide-theme").addEventListener("click",
                                                                                                                    me.hide);
    }
}