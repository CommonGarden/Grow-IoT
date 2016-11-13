var PolymerLayout = function() {
    this.currentLayout = null;
};

// layout[String]
// opt[Object] one-level deep
// rerender[Boolean]

PolymerLayout.prototype.render = function(layout, opt, rerender) {
    if (document.querySelector('mwc-layout[id="' + layout + '"]')) {
        if (this.currentLayout != layout || rerender) {
            if (this.currentLayout) {
                document.querySelector('mwc-layout[id="' + this.currentLayout + '"]').active = false
            }

            document.querySelector('mwc-layout[id="' + layout + '"]').render(Object.prototype.toString.call(opt) == "[object Object]" ? opt : {});

            document.querySelector('mwc-layout[id="' + layout + '"]').active = true;

            this.currentLayout = layout;
        }
    }
};

mwcLayout = new PolymerLayout();
