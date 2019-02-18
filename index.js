(function (win) {
    // util
    var Helpers = {
        // set viewport by config
        setViewport: function (config, callback) {
            var vps = document.querySelectorAll('meta[name="viewport"]');
            var content = 'width=' + config.width +
            ', initial-scale=' + config.scale +
            ', maximum-scale=' + config.scale +
            ', minimum-scale=' + config.scale +
            ', user-scalable=no, viewport-fit=cover';
        
            if (vps.length > 0) {
                vps[0].parentNode.removeChild(vps[0]);
                // vps[vps.length - 1].setAttribute('content', content);
            }

            var vp = document.createElement('meta');
                vp.setAttribute('name', 'viewport');
                vp.setAttribute('content', content);
        
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
        stopResize: true                            // is stop to listen resize
    };

    // doms
    var Doms = {
        doc: win.document,
        docElem: win.document.documentElement,
        docHead: win.document.getElementsByTagName('head')[0]
    };

    // scalable core
    var PxScalable = {
        lastScale: 0,
        setViewport: function () {
            setTimeout(function () {
                var width = document.documentElement.clientWidth;
                var scale = width / Vars.design.width;

                Helpers.setViewport({
                    width: Vars.design.width,
                    scale: scale
                }, function () {
                    // 适配完成标识
                    Doms.docElem.setAttribute("class", Vars.adapterClass.adapterSuccess);
                    // 兼容老业务REM样式
                    Doms.docElem.setAttribute("style", 'font-size: 37.5px');
                    // 记录上次缩放值
                    PxScalable.lastScale = scale;
                    // 解除resize事件限制
                    PxScalable.timer = setTimeout(function () {
                        // Vars.stopResize = false
                    }, 2000);
                });
            }, 27);
        },
        run: function () {
            Vars.stopResize = true;
            clearTimeout(PxScalable.timer)

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

            // 倒退 缓存相关
            win.addEventListener("pageshow", function (e) {
                if (e.persisted) {
                    clearTimeout(PxScalable.timer)
                    Vars.stopResize = true;
                    run()
                }
            }, false);

            win.addEventListener("resize", function (e) {
                if (!Vars.stopResize) {
                    clearTimeout(PxScalable.timer)
                    Vars.stopResize = true;
                    run()
                }
            });

            // 横竖屏切换
            win.addEventListener("orientationchange", function (e) {
                clearTimeout(PxScalable.timer)
                Vars.stopResize = true
                run()
            });
        }
    };

    Adapter.init();

    return win.Adapter = {
        setAdapterDesign: Adapter.setAdapterDesign
    };
})(window);
