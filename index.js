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
        lastScale: 0,
        setViewport: function () {
            var width = document.documentElement.clientWidth;
            var scale = width / Vars.design.width;

            Helpers.setViewport({
                width: Vars.design.width,
                scale: scale
            }, function () {
                document.documentElement.setAttribute("class", Vars.adapterClass.adapterSuccess);
                document.documentElement.setAttribute("style", 'font-size:' + Math.max(12 / scale, 12) + 'px');
                PxScalable.lastScale = scale;

                // go on listen resize
                setTimeout(function () {
                    // Vars.stopResize = false
                }, 1000);
            });
        },
        run: function () {
            Vars.stopResize = true;

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
            var vp = document.querySelectorAll('meta[name="viewport"]');
            if (!vp || vp.length === 0) {
                Adapter.initViewport();
            }
            Adapter.bindEvent();
        },
        initViewport: function () {
            Helpers.setViewport({
                width: 'device-width',
                scale: 1
            });
        },
        setAdapterDesign: function (design) {
            if (!design) return;

            design.width && (Vars.design.width = design.width);
            design.height && (Vars.design.height = design.height);

            clearTimeout(PxScalable.timer)
            Adapter.runAdapter();
        },
        runAdapter: function () {
            PxScalable.run();
        },
        bindEvent: function () {
            var run = Helpers.debounce(Adapter.runAdapter, 300);

            win.addEventListener("pageshow", function (e) {
                if (e.persisted) {
                    clearTimeout(PxScalable.timer)
                    run()
                }
            }, false);

            win.addEventListener("resize", function (e) {
                if (!Vars.stopResize) {
<<<<<<< HEAD
                    clearTimeout(PxScalable.timer)
=======
                    clearTimeout(dyPx.timer)
>>>>>>> 0eb93113b19bbf36f2912975f5631544bd277392
                    Vars.stopResize = true;
                    run()
                }
            });

            win.addEventListener("orientationchange", function (e) {
<<<<<<< HEAD
                clearTimeout(PxScalable.timer)
                Vars.stopResize = true
                run()
=======
                clearTimeout(dyPx.timer)
                Vars.stopResize = false;
>>>>>>> 0eb93113b19bbf36f2912975f5631544bd277392
            });
        }
    };

    Adapter.init();

    return win.Adapter = {
        setAdapterDesign: Adapter.setAdapterDesign
    };
})(window);
