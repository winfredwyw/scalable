(function (win) {
    // util
    var Helpers = {
        // set viewport by config
        setViewport: function (config, callback) {
            var vps = document.querySelectorAll('meta[name="viewport"]');
        
            if (vps.length > 0) {
                vps[0].parentNode.removeChild(vps[0]);
            }

            var vp = document.createElement('meta');
                vp.setAttribute('name', 'viewport');
                vp.setAttribute('content', '');
                vp.setAttribute(
                    'content',
                    'width=' + config.width +
                    ',initial-scale=' + config.scale +
                    ', maximum-scale=' + config.scale +
                    ', minimum-scale=' + config.scale +
                    ', user-scalable=no, viewport-fit=cover'
                );
        
            if (document.documentElement.firstElementChild) {
                document.documentElement.firstElementChild.appendChild(vp);
            } else {
                var div = document.createElement('div');
                div.appendChild(vp);
                document.write(div.innerHTML);
            }

            callback && callback()
        },
        debounce: function (fn, delay) {
            var timer = null;

            return function () {
                var ctx = this, args = arguments;
                if (timer)
                    clearTimeout(timer);

                timer = setTimeout(function () {
                    fn.apply(ctx, args);
                }, delay);
            }
        }
    };

    // vars
    var Vars = {
        design: {
            width: 375                              // design width
        },
        adapterClass: {
            adapterSuccess: 'adapter-complete',     // add adapter complete class
            adapterContain: 'adapter-content'       // fullscreen adapter (todo) container class
        },
        stopResize: false                           // is stop to listen resize
    };

    // scalable core
    var PxScalable = {
        setViewport: function () {
            var width = document.documentElement.clientWidth;
            var scale = width / Vars.design.width;

            Helpers.setViewport({
                width: Vars.design.width,
                scale: scale
            }, function () {
                document.documentElement.setAttribute("class", Vars.adapterClass.adapterSuccess);
                document.documentElement.setAttribute("style", Math.max(12 / scale, 12) + 'px');

                // temporarily stop listen resize
                Vars.stopResize = true;
                // go on listen resize
                setTimeout(function () {
                    Vars.stopResize = false
                }, 1000);
            });
        },
        run: function () {
            Helpers.setViewport({
                width: 'device-width',
                scale: 1
            }, function () {
                setTimeout(function () {
                    PxScalable.setViewport();
                }, 50);
            })
        }
    };

    // adapter entrance
    var Adapter = {
        init: function () {
            Adapter.runAdapter();
            Adapter.bindEvent();
        },
        setAdapterDesign: function (design) {
            if (!design) return;

            Vars.design.width = design.width;
            Vars.stopResize = false;

            Adapter.runAdapter();
        },
        runAdapter: function () {
            PxScalable.run();
        },
        bindEvent: function () {
            var run = Helpers.debounce(Adapter.runAdapter, 200);

            win.addEventListener("pageshow", function (e) {
                if (e.persisted) {
                    run()
                }
            }, false);

            win.addEventListener("resize", function (e) {
                if (!Vars.stopResize) {
                    run()
                }
            });

            win.addEventListener("orientationchange", function (e) {
                Vars.stopResize = false;
            });
        }
    };

    Adapter.init();

    window.Adapter = {
        setAdapterDesign: Adapter.setAdapterDesign
    };
})(window);
