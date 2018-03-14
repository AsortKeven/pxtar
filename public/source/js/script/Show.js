'use strict';

(function (factory) {
    // 前端弹窗
    if(typeof  define ==='function' && define.amd){


        define('Show',factory);
        // define(['js/script/xkTool'],factory);
    }
    if(typeof module !=='undefined'){
        module.exports = factory();
    }
    if(typeof  window !=='undefined'){
        window.Show = factory();
    }else if(typeof global !=='undefined'){
        global.Show = factory();
    }


})(function(){
    var Utils = require('XkTool');
    var Show = (function () {

        var _alert  = {};

        _alert.name = 'zfc' + Utils.getTime();
        _alert.getName = function () {
            _alert.name = 'zfc' + Utils.getTime();
            // return _alert.name;
        }

        return _alert;

    })();

    return Show;

});