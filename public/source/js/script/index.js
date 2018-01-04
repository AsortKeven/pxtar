require(['config'], function () {
    require(['Utils', 'Show'], function (Utils, Show) {

        var z1 = document.getElementById('z1');
        Utils.addEvent(window, 'mouseup', function (e) {
            Utils.addClass(e.target, 'add-border');
            // console.log(e.target,e.currentTarget,e.target.parentNode,Utils.getRect(e.target));
            console.log(Show.name, Show.getName());
        }, false);

        var _View = function () {
            var that = this;
            that.init();
        };

        _View.prototype = {
            constructor: _View,
            init: function () {

            }
        };

        var _Controller = function () {
            var that = this;

        };

        _Controller.prototype = {
            constructor: _Controller

        };


        var _Model = {
            page: [],
            history: [],
            chufaBody: [
                {
                    text: '图层出现时',
                    value: 0
                },
                {
                    text: 'page出现时',
                    value: 1
                },
                {
                    text: '与上一个效果一起',
                    value: 2
                },
                {
                    text: '上一个效果结束后',
                    value: 3
                }
            ],
            speedBody: [
                {
                    text: '很慢',
                    value: 1
                },
                {
                    text: '慢',
                    value: 0.8
                },
                {
                    text: '普通',
                    value: 0.6
                },
                {
                    text: '快',
                    value: 0.4
                },
                {
                    text: '很快',
                    value: 0.2
                }
            ],
            delayBody: [
                {
                    text: '无',
                    value: 0
                },
                {
                    text: '很少',
                    value: 0.1
                },
                {
                    text: '少',
                    value: 0.2
                },
                {
                    text: '普通',
                    value: 0.4
                },
                {
                    text: '多',
                    value: 0.6
                },
                {
                    text: '很多',
                    value: 0.8
                }
            ],
            timesBody: [
                {
                    text: '1',
                    value: 1
                },
                {
                    text: '2',
                    value: 2
                },
                {
                    text: '3',
                    value: 3
                },
                {
                    text: '4',
                    value: 4
                },
                {
                    text: '5',
                    value: 5
                },
                {
                    text: '无限',
                    value: 'infinite'
                }
            ],
            originBody: [
                {
                    text: '中心',
                    value: 0
                },
                {
                    text: '左',
                    value: 1
                },
                {
                    text: '右',
                    value: 2
                },
                {
                    text: '上',
                    value: 3
                },
                {
                    text: '下',
                    value: 4
                },
                {
                    text: '左上',
                    value: 5
                },
                {
                    text: '右上',
                    value: 6
                },
                {
                    text: '左下',
                    value: 7
                },
                {
                    text: '右下',
                    value: 8
                }
            ],
            extentBody: [
                {
                    text: '很弱',
                    value: 0
                },
                {
                    text: '弱',
                    value: 0
                },
                {
                    text: '普通',
                    value: 0
                },
                {
                    text: '强',
                    value: 0
                },
                {
                    text: '很强',
                    value: 0
                }

            ],
            config: {
                101: {
                    name: '保存全局'
                },
                102: {
                    name: '导出动态条漫包'
                },
                103: {
                    name: '上一步'
                },
                104: {
                    name: '下一步'
                },
                105: {
                    name: '预览全篇'
                },

                201: {
                    name: '移动',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    position: {
                        title: '位置',
                        body: [
                            {
                                start: {x: 0, y: 0},
                                end: {x: 0, y: 0}
                            }
                        ],
                        type: 'select'
                    }
                },

                202: {
                    name: '旋转',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    rotate: {
                        title: '旋转',
                        body: [
                            {
                                start: {r: 0},
                                end: {r: 0},
                                min: -360,
                                max: 360,
                                value: 0,
                                step: 1
                            }
                        ],
                        type: 'select'
                    }
                },

                203: {
                    name: '缩放',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    scale: {
                        title: '缩放',
                        body: [
                            {
                                from: {r: 0},
                                to: {r: 0},
                                min: 0,
                                max: 300,
                                value: 100,
                                step: 1
                            }
                        ],
                        type: 'select'
                    }
                },

                204: {
                    name: '透明度',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    opacity: {
                        title: '透明度',
                        body: [
                            {
                                from: {r: 0},
                                to: {r: 0},
                                min: 0,
                                max: 100,
                                value: 100,
                                step: 1
                            }
                        ],
                        type: 'range'
                    }
                },

                205: {
                    name: '淡入',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    fadeIn: {
                        title: '淡入',
                        body: [
                            {}
                        ],
                        type: 'select'
                    }
                },

                206: {
                    name: '淡出',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: {
                            tab: 'select'
                        }
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    fadeOut: {
                        title: '淡出',
                        body: [
                            {}
                        ],
                        type: 'select'
                    }
                },

                207: {
                    name: '摇晃',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    direction: {
                        title: '方向',
                        body: [
                            {
                                text: '上下',
                                value: 0
                            },
                            {
                                text: '左右',
                                value: 1
                            }
                        ],
                        type: 'select'
                    },
                    origin: {
                        title: '中心点',
                        body: function () {
                            return _Model.originBody;
                        },
                        type: 'select'
                    },
                    extent: {
                        title: '强度',
                        body: function () {
                            return _Model.extentBody;
                        },
                        type: 'select'
                    },
                    times: {
                        title: '次数',
                        body: function () {
                            return _Model.timesBody;
                        },
                        type: 'select'
                    }
                },

                208: {
                    name: '漂浮',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    extent: {
                        title: '强度',
                        body: function () {
                            return _Model.extentBody;
                        },
                        type: 'select'
                    },
                    times: {
                        title: '次数',
                        body: function () {
                            return _Model.timesBody;
                        },
                        type: 'select'
                    }
                },

                209: {
                    name: '闪烁',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    times: {
                        title: '次数',
                        body: function () {
                            return _Model.timesBody;
                        },
                        type: 'select'
                    }
                },

                210: {
                    name: '效果音',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    effect: {
                        title: '效果',
                        body: [
                            {
                                text: '缓慢淡入',
                                value: 0
                            },
                            {
                                text: '淡入',
                                value: 1
                            },
                            {
                                text: '普通',
                                value: 2
                            },
                            {
                                text: '淡出',
                                value: 3
                            },
                            {
                                text: '缓慢淡出',
                                value: 4
                            }
                        ],
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    files: {
                        title: '文件',
                        body: [
                            //这个要根据 音乐库 返回数据，生成 下拉列表
                        ],
                        type: 'select'
                    }
                },

                211: {
                    name: '大旋转',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    direction: {
                        title: '方向',
                        body: [
                            {
                                text: '顺时针',
                                value: 0
                            },
                            {
                                text: '逆时针',
                                value: 1
                            }
                        ],
                        type: 'select'
                    },
                    origin: {
                        title: '中心点',
                        body: function () {
                            return _Model.originBody;
                        },
                        type: 'select'
                    },
                    times: {
                        title: '圈数',
                        body: function () {
                            return _Model.timesBody;
                        },
                        type: 'select'
                    }
                },

                212: {
                    name: '帧动画',
                    start: {
                        title: '触发点',
                        body: function () {
                            return _Model.chufaBody;
                        },
                        type: 'select'
                    },
                    speed: {
                        title: '速度',
                        body: function () {
                            return _Model.speedBody;
                        },
                        type: 'select'
                    },
                    delay: {
                        title: '延迟',
                        body: function () {
                            return _Model.delayBody;
                        },
                        type: 'select'
                    },
                    times: {
                        title: '圈数',
                        body: function () {
                            return _Model.timesBody;
                        },
                        type: 'select'
                    },
                    list: {
                        title: '帧序',
                        body: [
                            //根据前面点选的图片，生成列表。然后可以拖动，改变顺序
                        ],
                        type: 'select'
                    }

                }
            }
        };

        _Model.page.push(1, 2, 3, 45);

        var v = new _View();
        var c = new _Controller();
        console.log(_Model.page, v.constructor);

        Utils.addEvent(window, 'resize', function (e) {
            console.log(document.documentElement.offsetWidth, Show.name);
        })


        /*end*/
    });
});