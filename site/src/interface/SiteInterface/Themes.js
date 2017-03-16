class Theme {
    static clear() {
        // Clear all themes from localStorage
        if (delete localStorage['themes'] === true) {
            console.debug("Deleted themes successfully");
        } else {
            console.error("Couldn't delete themes");
        }
    }
    constructor(saveObject) {
        // bg is background color, sc is secondary color
        if (saveObject) {
            this.bg = saveObject.bg;
            this.sc = saveObject.sc;
        } else {
            this.bg = null;
            this.sc = null;
        }
    }
    save() {
        if (localStorage[Theme.STORAGE_KEY] !== 'undefined') {
            // There are no themes in localStorage, it is safe to write to
            var saveObject = this.getSaveObject();
            localStorage[Theme.STORAGE_KEY] = JSON.stringify([saveObject]);
        } else {
            var oldThemes = null;
            try {
                oldThemes = JSON.parse(localStorage[Theme.STORAGE_KEY]);
            } catch (e) {
                ukahoot.interface.showAlert('There was an error saving the theme!');
                console.error('There was an error parsing localStorage JSON:', e);
            }
            if (oldThemes) {
                // TODO: append this theme to localStorage
            }
        }
    }
    getSaveObject() {
        return {
            'bg': this.bg,
            'sc': this.sc
        }
    }
    apply() {
        var me = this;
        if (this.bg) {
            document.documentElement.style.backgroundColor = this.bg;
            document.body.style.backgroundColor = this.bg;
        } else console.warn('Not applying nonexistent theme background color');
        if (this.sc) {
            var elms = Array.prototype.slice.call(document.getElementsByTagName('h1'));
            elms.push.apply(elms,
                                        document.getElementsByTagName('h2'));
            elms.push.apply(elms,
                                        document.getElementsByClassName('shape'));
            elms.push(document.getElementById('wait'));
            elms.forEach(e => {
                if (e) {
                    e.style.color = me.sc;
                } else console.warn('Not applying theme CSS to null element');
            });
            elms = Array.prototype.slice.call(document.getElementsByTagName('input'));
            elms.push.apply(elms,
                                        document.getElementsByTagName('button'));
            elms.push.apply(elms,
                                        document.getElementsByClassName('ans'));
           elms.push(document.getElementById('alert-box'));
           elms.forEach(e => {
                if (e) {
                    e.style.borderColor = me.sc;
                } else console.warn('Not applying theme CSS to null element');
            });
        } else console.warn('Not applying nonexistent theme secondary color');
    }
}
Theme.STORAGE_KEY = 'themes';
class ThemeEditor {
    constructor(elem) {
        if (!elem) throw new Error("ThemeEditor needs a container element!");
        this.elm = elem;
    }
}