class ThemeEditor {
    readStorage() {
        if (localStorage[Theme.STORAGE_KEY]) {
            var themes = null;
            try {
                themes = JSON.parse(localStorage[Theme.STORAGE_KEY]);
            } catch (e) {
                console.error("Error parsing localStorage themes:", e);
            }
            if  (themes) {
                this.theme = new Theme(themes[0]);
                this.theme.load();
                if (this.theme.sc)
                    this.scPicker.jscolor.fromString(this.theme.sc);
                if (this.theme.bg)
                    this.bgPicker.jscolor.fromString(this.theme.bg);
            }
        } else {
            console.debug("No theme(s) to load");
        }
    }
    show() {
        $("#overlay").fadeIn(250);
        $("#theme-editor").fadeIn(250);
    }
    hide() {
        $("#theme-editor").fadeOut(250);
        $("#overlay").fadeOut(250);
    }
    scPickerChange(e) {
        this.theme.sc = "#" + this.scPicker.value;
    }
    bgPickerChange(e) {
        this.theme.bg = "#" + this.bgPicker.value;
    }
    save() {
        Theme.clear(); // Only allow one theme for now
        this.theme.save();
        this.theme.load();
    }
    constructor() {
        var me = this;
        me.theme = new Theme;
        me.bgPicker = document.getElementById("theme-bg-picker");
        me.scPicker = document.getElementById("theme-sc-picker");
        me.saveBtn = document.getElementById("theme-save");

        me.saveBtn.addEventListener("click", e => {
            return me.save.call(me, e);
        });
        me.bgPicker.onchange = e => {
            return me.bgPickerChange.call(me, e);
        }
        me.scPicker.onchange = e => {
            return me.scPickerChange.call(me, e);
        }

        document.getElementById("show-theme").addEventListener("click",
                                                                                                                    me.show);
        document.getElementById("hide-theme").addEventListener("click",
                                                                                                                    me.hide);
    }
}