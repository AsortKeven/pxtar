'use strict';

(function (factory) {
    // 前端工具js
    if (typeof define === 'function' && define.amd) {
        define('XkTool', factory);
    }
    if (typeof module !== 'undefined') {
        module.XkTool = factory();
    }
    if (typeof window !== 'undefined') {
        window.XkTool = factory();
    } else if (typeof global !== 'undefined') {
        global.XkTool = factory();
    }
})(function () {
    var XkTool = (function () {
        /*基本工具*/
        var tool = {},
            _eleStyle = document.createElement('div').style,
            _vector = (function () {
                var arr = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                    transform,
                    i = 0,
                    l = arr.length;

                for (; i < l; i++) {
                    transform = arr[i] + 'ransform';
                    if (transform in _eleStyle) return arr[i].substr(0, arr[i].length - 1);
                }

                return false;
            })();

        function _vectorCssStyle(style) {
            if (_vector === false) return false;
            if (_vector === '') return style;
            return _vector + style.charAt(0).toUpperCase() + style.substr(1);
        }

        tool.getTime = Date.now || function getTime() {
                return new Date().getTime();
            };
        tool.extend = function (target, currentTarget) {
            for (var i in currentTarget) {
                target[i] = currentTarget[i];
            }
        }
        var _transform = _vectorCssStyle('transform');
        var _animation = _vectorCssStyle('animation');
        var _userAgent = window.navigator.userAgent;
        tool.extend(tool, {
            isWindowsPhone: _userAgent.indexOf('Windows Phone') !== -1,
            isIos: _userAgent.indexOf('iPhone') !== -1
        });
        tool.extend(tool, {
            hasTransform: _transform !== false,
            hasPerspective: _vectorCssStyle('perspective') in _eleStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
            hasTransition: _vectorCssStyle('transition') in _eleStyle
        });

        tool.extend(tool.style = {}, {
            transform: _transform,
            transitionTimingFunction: _vectorCssStyle('transitionTimingFunction'),
            transitionDuration: _vectorCssStyle('transitionDuration'),
            transitionDelay: _vectorCssStyle('transitionDelay'),
            transformOrigin: _vectorCssStyle('transformOrigin'),
            touchAction: _vectorCssStyle('touchAction')
        });
        tool.extend(tool.style = {}, {
            animation: _animation,
            animationName: _vectorCssStyle('animationName'),
            animationDuration: _vectorCssStyle('animationDuration'),
            animationTimingFunction: _vectorCssStyle('animationTimingFunction'),
            animationDelay: _vectorCssStyle('animationDelay'),
            animationIterationCount: _vectorCssStyle('animationIterationCount'),
            animationDirection: _vectorCssStyle('animationDirection'),
            animationPlayState: _vectorCssStyle('animationPlayState'),
            animationFillMode: _vectorCssStyle('animationFillMode')
        });
        tool.hasClass = function (e, c) {
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className);
        };
        tool.addClass = function (e, c) {
            if (tool.hasClass(e, c)) {
                return;
            }
            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        };

        tool.removeClass = function (e, c) {
            if (!tool.hasClass(e, c)) {
                return;
            }
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, ' ');
        };
        tool.addEvent = function (el, type, fn, useCapture) {
            useCapture = useCapture || false;
            if (el.addEventListener) {
                el.addEventListener(type, fn, useCapture);
            } else {
                el.attachEvent('on' + type, fn);
            }
        };
        tool.removeEvent = function (el, type, fn, useCapture) {
            useCapture = useCapture || false;
            if (el.removeEventListener) {
                el.removeEventListener(type, fn, useCapture);
            } else {
                el.detachEvent('on' + type, fn);
            }
        };
        tool.getRect = function (el) {
            if (el instanceof SVGElement) {
                var rect = el.getBoundingClientRect();
                return {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
            } else {
                return {
                    top: el.offsetTop,
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                    height: el.offsetHeight
                };
            }
        };
        tool.getElementTop = function (element) {
            var actualTop = element.offsetTop;
            var current = element.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        };
        tool.setStyle = function (el, tf) {
            var sty = '';
            if (typeof tf === 'string') {
                sty = tf;
            } else if (typeof tf === 'object') {
                for (var s in tf) {
                    sty += s + ':' + tf[s] + ';';
                }
            }
            el.style.cssText += ';' + sty;
        };

        tool.error = function (str) {
            throw Error(str);
        };

        tool.getChild = function (ele, index) {
            /**
             * 得到纯element child Node
             *
             */
            var childs = ele.childNodes;
            var arr = [];
            for (var i in childs) {
                if (childs[i].nodeType == 1) {
                    arr.push(childs[i]);
                }
            }
            return arr[index];
        };
        //屏蔽右键菜单
        tool.cancelRightMenu = function () {

            function noContextMenu() {
                event.cancelBubble = true;
                event.returnvalue = false;
                return false;
            }

            function noRightClick(e) {
                if (window.Event) {
                    if (e.which === 2 || e.which === 3)
                        return false;
                }

                else if (event.button === 2 || event.button === 3) {
                    event.cancelBubble = true;
                    event.returnvalue = false;
                    return false;
                }
            }

            document.oncontextmenu = noContextMenu;  // for IE5+
            document.onmousedown = noRightClick;

        };
        return tool;
    })();


    return XkTool;
});