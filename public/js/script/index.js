
require(['config'],function () {
    require(['Utils','Show'],function (Utils, Show) {

        var z1 = document.getElementById('z1');
        Utils.addEvent(window,'mouseup',function (e) {
            Utils.addClass(e.target,'add-border');
            // console.log(e.target,e.currentTarget,e.target.parentNode,Utils.getRect(e.target));
            console.log(Show.name,Show.getName());
        },false);

        var _View = function () {
            var that = this;
            that.init();
        }

        _View.prototype = {
            constructor : _View,
            init : function () {

            },
        }

        var _Controller = function () {
            var that = this;

        }
        _Controller.prototype = {
            constructor : _Controller,

        }


        var _Model = {
            page : [],
            history : [],
            config : {}
        }

        _Model.page.push(1,2,3,45);

        var v = new _View();
        var c = new _Controller();
        console.log(_Model.page,v.constructor);

        Utils.addEvent(window,'resize',function (e) {
            console.log(document.documentElement.offsetWidth, Show.name);
        })


        /*end*/
    });
});
