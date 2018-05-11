'use strict';

// 使用可能有兼容性的方法,后面需要去兼容或者测试:
// node.insertadjacenthtml
//


require(['config'], function () {
    require(['XkTool'], function (XkTool) {
        require(['Show'], function (Show) {

            //  require(['XkTool', 'Show'], function (XkTool,Show) {

            // 获取服务器数据，之前做好的内容
            var serverData = [];

            // tab组件
            // 供控制器调用
            function Tab_tools(name, list, panelCon) {
                var that = this;
                that.name = name;
                var i = 0, len;
                var doc = document;
                for (i in list) {
                    that.tabBox[i] = list[i];
                    var panel = doc.createElement('ul');
                    panel.setAttribute('data-tab', i);
                    // panel.innerHTML =~~i + 1;
                    // panel.innerHTML = '<li>' + i + '</li>';
                    that.panelBox[i] = panel;
                    panel.style.display = 'none';
                    if (i == 0) {
                        XkTool.addClass(panel, 'xk-edit-sub-img');
                        panel.style.display = 'block';
                    }
                    if (i == 1) {
                        XkTool.addClass(panel, 'xk-edit-sub-music');
                    }
                    panelCon.appendChild(panel);
                }
                that.init();
            }

            Tab_tools.prototype = {
                constructor: Tab_tools,
                name: '',
                tabBox: [],
                panelBox: [],
                selectIndex: 0,
                init: function () {
                    var that = this;
                    XkTool.addEvent(that.tabBox[0].parentNode, 'click', function (e) {
                        var len = that.tabBox.length;
                        while (len--) {
                            if (e.target == that.tabBox[len]) {
                                that.setShow(len);
                            }
                        }
                    })

                },
                setShow: function (index) {
                    var that = this;
                    if (that.selectIndex == index) return;
                    XkTool.removeClass(that.tabBox[that.selectIndex], 'opacity-show');
                    that.tabBox[that.selectIndex].style.opacity = 0.7;
                    that.panelBox[that.selectIndex].style.display = 'none';
                    that.selectIndex = index;
                    that.tabBox[that.selectIndex].style.opacity = 1;
                    that.panelBox[that.selectIndex].style.display = 'block';

                }
            };

            function getChildes(parent) {
                // 返回合法节点
                var list = [];
                var child = parent.childNodes;
                for (var i in child) {
                    if (child[i].nodeType == 1) {
                        list[list.length] = child[i];
                    }
                }
                return list;
            }

            function Index(parList, child) {
                // 返回节点处于父级的位置
                var i;
                if (!parList.length && parList.length == undefined) parList = getChildes(parList);
                for (i in parList) {
                    if (parList[i] == child) {
                        return i;
                    }
                }
                return null;
            }


            var _View = function (o) {
                var that = this;
                that.init(o);
            };

            _View.prototype = {
                constructor: _View,
                _isInit: false,
                preValue: '',
                init: function (o) {
                    var that = this;
                    XkTool.cancelRightMenu();
                    that.rightMenu();
                    var page = o.page;
                    var imgList = o.imgList;
                    var musicList = o.musicList;
                    if (that._isInit) return;
                    var i = 0, j = 0, len = 0, nodeString = '', layerItem = {}, id;
                    var doc = document;
                    var pageEdit = doc.getElementById('xk-edit-center-edit');
                    var subEdit_img = doc.getElementById('xk-edit-sub-edit-img');
                    var subEdit_music = doc.getElementById('xk-edit-sub-edit-music');
                    var subEdit_panel = doc.getElementById('xk-edit-sub-panel');
                    that.preValue = doc.getElementsByClassName('xk-edit-center-top')[0].lastElementChild.firstElementChild.value;
                    // 组件按钮初始化
                    subEdit_panel.innerHTML = '';
                    //音乐、图片组件
                    var subEdit = new Tab_tools('组件1', {0: subEdit_img, 1: subEdit_music}, subEdit_panel);

                    if (page && typeof page !== undefined && typeof page === 'object') {
                        // 初始化page
                        for (i in page) {
                            id = ~~page[i].id + 1;

                            nodeString += '<li style="z-index: ' + 0 + '"><p class="noselect"><span class="float_left">page-' + id +
                                '</span> <span class="float_right"><span class="hand" data-id="311">高度设置</span><span class="hand" data-id="312">设置背景图</span><span class="hand" data-id="313">删除</span></span></p>';

                            var style = '', sty, rect;
                            rect = page[i].rect;
                            for (sty in rect) {
                                style += sty + ': ' + rect[sty] + 'px; ';
                            }
                            nodeString += '<div class="xk-edit-center-page-page" style="' + style + '">';
                            for (j = 0, len = page[i].layerList.length; j < len; j++) {
                                layerItem = page[i].layerList[j];
                                style = '';
                                for (sty in layerItem.rect) {
                                    style += sty + ': ' + layerItem.rect[sty] + 'px; ';
                                }
                                style += 'z-index:' + j;
                                nodeString += '<img src=" ' + layerItem.src + '"' + 'style="' + style + '"' + ' >';
                            }

                            nodeString += '</div></li>';
                        }
                        pageEdit.firstElementChild.innerHTML = nodeString;
                    }

                    if ((imgList && typeof imgList !== undefined && typeof imgList === 'object') || (musicList && typeof musicList !== undefined && typeof musicList === 'object')) {
                        // 初始化组件
                        // 存储组件的字符串， 组件tab标签列表
                        // 将imgList和musicList整合到subList中，后面根据tab值显示
                        var subNameList = {}, subPanelChild = {}, subList = {length: 0};
                        var tabId, subItem, subItemTab;
                        subPanelChild = getChildes(subEdit_panel);
                        for (var i = 0; i < imgList.length; i++) {
                            subList[i] = imgList[i];
                            subList.length++;
                        }
                        var sLen = subList.length, mLen = musicList.length;
                        for (var j = subList.length, temp = 0; j < sLen + mLen; j++, temp++) {
                            subList[j] = musicList[temp];
                            subList.length++;
                        }
                        // 生成存储字符串的对象列
                        for (var i = 0, childLen = subPanelChild.length; i < childLen; i++) {
                            tabId = subPanelChild[i].getAttribute('data-tab');
                            subNameList[tabId] = '';
                        }
                        for (var i in subList) {
                            if (subList[i].hasOwnProperty('id')) {
                                subItem = subList[i];
                                subItemTab = subItem.tab;

                                // console.log(subItemTab, subList[i]);
                                switch (subItemTab) {
                                    case 0:
                                        // 图片tab
                                        subNameList[subItemTab] += '<li data-id="' + subList[i].id + '"><div class="xk-edit-right-top">' +
                                            '<span data-id="422" class="xk-edit-right-label xk-edit-right-img"> </span>' +
                                            '<span data-id="423" class="xk-edit-right-label ">' + subList[i].name + '</span>' +
                                            '<span data-id="425" class="xk-edit-right-label xk-edit-right-label-dir"></span></div>' +
                                            ' <div class="xk-edit-right-data xk-edit-right-data-none">' +
                                            '<p><span>W:<i>' + subList[i].width + '</i></span><span class="">H:<i>' + subList[i].height + '</i></span></p>' +
                                            '<p><span>类型：<i>' + subList[i].src.split('.')[1] + '</i></span><span class="">大小:<i>' + subList[i].size + '</i></span></p>' +
                                            '</div></li>';
                                        break;
                                    case 1:
                                        subNameList[subItemTab] += '<li data-id="' + subList[i].id + '"><div class="xk-edit-right-top">' +
                                            '<span data-id="422" class="xk-edit-right-label xk-edit-right-img"></span>' +
                                            '<span data-id="423" class="xk-edit-right-label">' + subList[i].name + '</span>' +
                                            '<span data-id="425" class="xk-edit-right-label xk-edit-right-label-dir xk-edit-right-label-dir"></span></div>' +
                                            '<div class="xk-edit-right-data xk-edit-right-data-none">' +
                                            '<p><span>类型：<i>' + subList[i].src.split('.')[1] + '</i></span><span class="">大小:<i>' + subList[i].size + '</i></span></p>' +
                                            '</div></li>';
                                        break;
                                }
                            }
                        }

                        for (i = 0, childLen = subPanelChild.length; i < childLen; i++) {
                            // 生成各tab标签内容
                            subPanelChild[i].innerHTML = subNameList[i];
                        }

                        /*  function gettabList() {
                         // 得到单个li标签内容,并返回

                         }*/

                    }
                    ;


                    that._isInit = true;
                },
                addPage: function (ele, parentEle) {
                    // 新增一个page
                    console.log(ele, ele.id);
                    var i = 0, j = 0, len = 0, nodeString = '', layerItem = {}, id;
                    var doc = document;
                    var pageEdit = doc.getElementById('xk-edit-center-edit');
                    var li = doc.createElement('li');
                    id = ~~ele.id + 1;
                    li.style.zIndex = ele.id * 10;
                    nodeString += '<p class="noselect"><span class="float_left">page-' + id +
                        '</span> <span class="float_right"><span class="hand" data-id="311">高度设置</span><span class="hand" data-id="312">设置背景图</span><span class="hand" data-id="313">删除</span></span></p>';
                    var style = '', sty, rect;
                    rect = ele.rect;
                    for (sty in rect) {
                        style += sty + ': ' + rect[sty] + 'px; ';
                    }
                    nodeString += '<div class="xk-edit-center-page-page" style="' + style + '">';
                    nodeString += '</div>';
                    li.innerHTML = nodeString;
                    parentEle.firstElementChild.appendChild(li);
                },
                insertPage: function (parentEle, cb) {
                    var innerDiv = document.createElement('div');
                    var total = parentEle.firstElementChild.childNodes.length;
                    var curPos;//当前要插入的位置
                    var opt = '';
                    for (var i = 1; i <= total; i++) {
                        opt += '<option id="' + i + '">' + i + '</option>';
                    }
                    innerDiv.innerHTML = '在第<select id="xk-select">' + opt + '</select>页后插入，当前共' + total + '页';
                    var obj = {
                        type: 'node',
                        value: innerDiv,
                        name: '插入page',
                        fn: function () {
                            curPos = ~~document.getElementById('xk-select').value;
                            var i = 0, j = 0, len = 0, nodeString = '', layerItem = {}, id;
                            var doc = document;
                            var pageEdit = doc.getElementById('xk-edit-center-edit');
                            var li = doc.createElement('li');
                            id = curPos + 1;
                            li.style.zIndex = id * 10;
                            nodeString += '<p class="noselect"><span class="float_left">page-' + id +
                                '</span> <span class="float_right"><span class="hand" data-id="311">高度设置</span><span class="hand" data-id="312">设置背景图</span><span class="hand" data-id="313">删除</span></span></p>';
                            var style = '', sty, rect;
                            rect = {
                                bottom: 656,
                                height: 540,
                                left: 0,
                                right: 0,
                                top: 0,
                                width: 298.96875,
                                x: 440.515625,
                                y: 116
                            };
                            for (sty in rect) {
                                style += sty + ': ' + rect[sty] + 'px; ';
                            }
                            nodeString += '<div class="xk-edit-center-page-page" style="' + style + '">';
                            nodeString += '</div>';
                            li.innerHTML = nodeString;
                            parentEle.firstElementChild.insertBefore(li, parentEle.firstElementChild.childNodes[curPos]);
                            document.body.removeChild(document.getElementById('alertWindow'));
                            document.body.removeChild(document.getElementById('opac'));

                            //刷新页面ID
                            var nodes = parentEle.firstElementChild.childNodes;
                            var len = nodes.length;
                            for (var i = curPos; i < len; i++) {
                                nodes[i].firstElementChild.firstElementChild.innerHTML = 'page-' + (i + 1);
                            }
                            console.log(nodes, len);
                            cb(curPos);
                        }
                    };
                    this.alertWindow(obj);
                },
                insertBgMusic: function () {
                    // 插入一个背景音乐

                },

                initLayer: function (ele, dataList) {
                    // 选择page后，初始化该page的图层
                    var that = this;
                    var str = '', i = 0, len, dataIndex;
                    if (dataList && dataList.length > 0) {
                        len = dataList.length;
                        for (i = 0; i < len; i++) {
                            dataIndex = dataList[i];
                            str += '<li class="noselect">' + that._getLayer(dataIndex) + '</li>';
                        }
                    }
                    ele.firstElementChild.innerHTML = str;
                },
                addLayer: function (ele, data) {
                    // 新增一个图层
                    var that = this;
                    var li = document.createElement('li');
                    li.innerHTML = that._getLayer(data);
                    ele.appendChild(li);
                },
                _getLayer: function (data) {
                    //返回标准化后的单个层级 字符串，供调用

                    var str = '';
                    str = '<div class="xk-edit-right-top">' +
                        '<span data-id="421" class="xk-edit-right-label xk-edit-right-label-eyes"></span> ' +
                        '<span data-id="422" class="xk-edit-right-label xk-edit-right-img"></span> ' +
                        '<span data-id="423" class="xk-edit-right-label">' + data.name + '</span> ' +
                        '<span data-id="424" class="xk-edit-right-label xk-edit-right-label-abled"></span> ' +
                        '<span data-id="425" class="xk-edit-right-label xk-edit-right-label-dir"></span> </div> ' +
                        '<div class="xk-edit-right-data xk-edit-right-data-none"> ' +
                        '<p><span>W: <i>' + data.rect.width + ' </i></span> ' +
                        '<span>H: <i>' + data.rect.height + ' </i></span></p> ' +
                        '<p><span>X: <i>' + data.rect.left + ' </i></span> ' +
                        '<span>Y: <i>' + data.rect.top + ' </i></span></p> ' +
                        '</div>';


                    return str;
                },

                initEffect: function (ele, dataList) {
                    // 选择图层后，初始化该图层的效果层
                    // console.log(ele,dataList);
                    var that = this;
                    var i, len, str = '', data;
                    len = dataList.length;
                    for (i = 0; i < len; i++) {
                        data = dataList[i];

                        that._getEffect(data);
                    }
                },
                addEffect: function (ele, data) {
                    // 新增一个效果层

                },
                _getEffect: function (data) {
                    // 生成基础的效果层
                    console.log('生成图层');
                },
                alertWindow: function (obj) {
                    //弹窗样式,传入一个Object
                    var body = document.getElementsByTagName('body')[0];  //页面body
                    var div = document.createElement('div');//弹出框
                    var title = document.createElement('p');//标题
                    var opac = document.createElement('div');//半透明蒙板
                    title.classList.add('xk-alert-title');
                    //图片弹窗
                    if (obj.type === 'image') {
                        title.innerHTML = obj.name;
                        div.style.cssText =
                            'width:' + obj.w + 'px;' +
                            'height:' + obj.h + 'px;' +
                            'background-color : blue;' +
                            'border-radius:5px;' +
                            'position:absolute;' +
                            'top:50px;' +
                            'left:' + (document.documentElement.clientWidth - obj.w) / 2 + 'px;' +
                            'z-index:9999';

                        var close = document.createElement('span');//关闭按钮
                        var image = document.createElement('img');//图片显示区

                        close.innerHTML = 'ⅹ';
                        close.classList.add('closeBtn');
                        close.addEventListener('click', function () {
                            opac.style.display = 'none';
                            div.style.display = 'none';
                        });

                        image.src = obj.value;
                        image.style.cssText = 'position:absolute;' +
                            'width:100%;' +
                            'height:' + (obj.h - 24) + 'px;' +
                            'top:24px';

                        title.appendChild(close);
                        div.appendChild(image);
                    }
                    //node弹窗，type必须为node,value必须为节点
                    if (obj.type === 'node') {
                        title.innerHTML = obj.name;
                        div.id = 'alertWindow';
                        div.style.cssText =
                            'width:500px;' +
                            'height:300px;' +
                            'border: 2px solid black;' +
                            'border-radius:5px;' +
                            'position:absolute;' +
                            'top:200px;' +
                            'left:' + (document.documentElement.clientWidth - 250) / 2 + 'px;' +
                            'z-index:9999';

                        var innerDiv = document.createElement('div');//内容块
                        var cancle = document.createElement('input');//取消按钮
                        var ensure = document.createElement('input');//确定按钮
                        var bottomP = document.createElement('p');//底部确定取消的容器

                        cancle.value = '取消';
                        ensure.value = '确定';
                        cancle.setAttribute('type', 'button');
                        ensure.setAttribute('type', 'button');
                        cancle.classList.add('btn');
                        ensure.classList.add('btn');
                        bottomP.appendChild(cancle);
                        bottomP.appendChild(ensure);
                        bottomP.classList.add('bottom');

                        innerDiv.style.cssText = 'position:absolute;' +
                            'width:90%;' +
                            'height: 240px;' +
                            'top:24px;' +
                            'left:5%;';

                        innerDiv.appendChild(obj.value);
                        innerDiv.appendChild(bottomP);

                        div.appendChild(innerDiv);

                        ensure.addEventListener('click', obj.fn);
                        cancle.addEventListener('click', function () {
                            body.removeChild(opac);
                            body.removeChild(div);
                        })

                    }
                    opac.id = 'opac';
                    opac.style.cssText = 'width:' + document.documentElement.clientWidth + 'px;' +
                        'height:' + document.documentElement.clientHeight + 'px;' +
                        'background-color:darkgray;' +
                        'opacity:0.5;' +
                        'position:absolute;' +
                        'z-index:9998;' +
                        'left:0;' +
                        'top:0;';

                    div.appendChild(title);
                    body.appendChild(opac);
                    body.appendChild(div);

                    opac.addEventListener('click', function () {
                        body.removeChild(opac);
                        body.removeChild(div);
                    });

                    title.onmousedown = function (ev) {
                        var oevent = ev || window.event;

                        var distanceX = oevent.clientX - div.offsetLeft;
                        var distanceY = oevent.clientY - div.offsetTop;

                        document.onmousemove = function (ev) {
                            var oevent = ev || window.event;
                            var clientWidth = document.documentElement.clientWidth - div.offsetWidth;
                            var clientHeight = document.documentElement.clientHeight - div.offsetHeight;
                            var disW = oevent.clientX - distanceX;
                            var disH = oevent.clientY - distanceY;
                            disW = disW < 0 ? 0 : disW;
                            disW = disW > clientWidth ? clientWidth : disW;
                            disH = disH < 0 ? 0 : disH;
                            disH = disH > clientHeight ? clientHeight : disH;

                            //设置图片的关闭按钮
                            if (close) {
                                if (disW >= clientWidth) {
                                    close.style.display = 'none';
                                } else {
                                    close.style.display = 'block';
                                }
                            }
                            div.style.left = disW + 'px';
                            div.style.top = disH + 'px';
                        };
                        document.onmouseup = function () {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    }

                },
                //自定义右键菜单
                rightMenu: function () {
                    var body = document.querySelector('body');
                    var rightMenuContainer = document.createElement('div');
                    var rightMenu = document.createElement('div');
                    var secondMenuContainer = document.createElement('div');
                    var secondMenu = document.createElement('div');
                    var containerEnter = false;
                    /*XkTool.addClass(secondMenu, 'xk-right-menu');
                     XkTool.addClass(secondMenuContainer, 'xk-right-menu-container');*/
                    XkTool.addClass(rightMenu, 'xk-right-menu');
                    XkTool.addClass(rightMenuContainer, 'xk-right-menu-container');
                    document.oncontextmenu = function (e) {
                        var xkMenuStr = '';
                        var secondMenuStr = '';
                        var event = e || window.event;
                        var t = event.target;
                        var klass;
                        //判断点击位置
                        if (XkTool.hasClass(t, 'xk-edit-right-top') || XkTool.hasClass(t.parentNode, 'xk-edit-right-top')) {
                            klass = 'toolsOrLayer';
                        } else if (XkTool.hasClass(t.parentNode, 'xk-edit-center-page-page')) {
                            klass = 'pageImg';
                        } else if (XkTool.hasClass(t, 'xk-edit-effect-item')) {
                            klass = 'effect';
                        }
                        XkTool.addClass(secondMenu, 'xk-right-menu');
                        XkTool.addClass(secondMenuContainer, 'xk-right-menu-container');
                        switch (klass) {
                            case 'toolsOrLayer':
                                //组件或者图层
                                xkMenuStr = ' <p id="xk-upper">上移</p>' +
                                    '<p id="xk-lower">下移</p>' +
                                    '<p id="xk-preview">预览</p>' +
                                    '<p id="xk-del">删除</p>';
                                break;
                            case 'pageImg':
                                //page
                                xkMenuStr = ' <p id="xk-upper">上移一层</p>' +
                                    '<p id="xk-lower">下移一层</p>' +
                                    '<p id="xk-del">删除</p>' +
                                    '<p id="xk-position">定位方式</p>';

                                secondMenuStr = '<p id="xk-style-top">顶部对齐</p>' +
                                    '<p id="xk-style-bottom">底部对齐</p>' +
                                    '<p id="xk-style-left">左对齐</p>' +
                                    '<p id="xk-style-right">右对齐</p>';
                                break;
                            case 'effect':
                                //动效右键菜单
                                break
                        }


                        if (xkMenuStr !== '') {
                            rightMenu.innerHTML = xkMenuStr;
                            rightMenuContainer.appendChild(rightMenu);
                            body.appendChild(rightMenuContainer);
                            XkTool.setStyle(rightMenuContainer, {
                                'display': 'block',
                                left: event.pageX + 'px',
                                top: event.pageY + 'px'
                            });
                            if (klass === 'pageImg') {
                                var pos = document.querySelector('#xk-position');
                                XkTool.addEvent(pos, 'mouseout', function () {
                                    XkTool.setStyle(secondMenuContainer, {display: 'none'});
                                });
                                XkTool.addEvent(pos, 'mouseenter', function () {
                                    secondMenu.innerHTML = secondMenuStr;
                                    secondMenuContainer.appendChild(secondMenu);
                                    body.appendChild(secondMenuContainer);
                                    var rect = XkTool.getRect(rightMenuContainer);
                                    var x = rect.left + rect.width - 3 + 'px';
                                    var y = rect.top + (rect.height - 2) * 3 / 4 + 1 + 'px';
                                    XkTool.setStyle(secondMenuContainer, {
                                        'box-shadow': '-4px 0 5px -3px #696969',
                                        'z-index': '99999',
                                        'display': 'block',
                                        left: x,
                                        top: y
                                    })
                                });
                                if (!containerEnter) {
                                    XkTool.addEvent(secondMenuContainer, 'mouseenter', function () {
                                        containerEnter = true;
                                        XkTool.addClass(pos, ':hover');
                                        XkTool.setStyle(secondMenuContainer, {display: 'block'});
                                    });
                                    XkTool.addEvent(secondMenuContainer, 'mouseout', function () {
                                        XkTool.removeClass(pos, ':hover');
                                    });
                                    //todo 事件处理
                                    XkTool.addEvent(secondMenuContainer, 'click', function (e) {
                                        switch (e.target.id) {
                                            case 'xk-style-top':
                                                console.log('top!');
                                                break;
                                            case 'xk-style-bottom':
                                                console.log('bottom!');
                                                break;
                                            case 'xk-style-left':
                                                console.log('left!');
                                                break;
                                            case 'xk-style-right':
                                                console.log('right!');
                                                break;
                                        }
                                    });
                                }
                                document.onclick = function () {
                                    XkTool.setStyle(rightMenuContainer, {display: 'none'});
                                    XkTool.setStyle(secondMenuContainer, {display: 'none'});
                                };
                            } else {
                                document.onclick = function () {
                                    XkTool.setStyle(rightMenuContainer, {display: 'none'});
                                };
                            }

                        }
                        //必须加return false屏蔽默认事件
                        return false;
                    }
                }

            };


            var _Controller = function (o, v) {
                var that = this;
                that.v = v;
                that.init(o);
            };

            _Controller.prototype = {
                constructor: _Controller,
                effectBox: {},                                      // 效果 栏 容器
                effect_currentTarget_select: {},                    // 效果 栏 当前选择目标
                eff_select: [],                                     // 效果 栏 选中列表
                pageBox: {},                                        // page 栏 容器
                page_currentTarget_select: {},                      // page 栏 当前选择目标
                page_select: [],                                    // page 栏 选中列表
                subBox: {},                                         // 组件 栏
                sub_show_id: NaN,                                   // 组件 栏 切换id
                sub_select: [],                                     // 组件 栏 选中列表
                layerBox: {},                                       // 图层 栏 选中列表
                layer_select: [],                                   // 图层 栏 选中列表
                class_list: [],                                     // 组件待清除选中样式的数组
                subBox_layer_curr_select_ul: {},                    // 选择的ul
                subBox_layer_curr_select_li: null,                  // 选择的li
                subBox_layer_effect_sct_index: NaN,                 // 选择的li的 索引

                ctrl: false,
                shift: false,
                alt: false,
                ctrl_shift: false,

                init: function (o) {
                    // console.log(o);
                    var doc = document, that = this;

                    // 顶部div，用来展示(包裹） 拖动组件 所用；
                    that.headDiv = doc.getElementById('xk-edit-body-header');
                    // 画布div
                    that.pagePanel = doc.getElementById('xk-edit-center-edit');
                    // 组件div
                    that.subPanel = doc.getElementById('xk-edit-sub-edit');
                    that.subPanelBox = doc.getElementById('xk-edit-sub-panel');
                    that.subPanel_img = doc.getElementById('xk-edit-sub-edit-img');
                    that.subPanel_music = doc.getElementById('xk-edit-sub-edit-music');
                    that.subPanel_imgBox = doc.getElementById('xk-edit-sub-img');
                    that.subPanel_musicBox = doc.getElementById('xk-edit-sub-music');
                    // 图层div
                    that.layerPanel = doc.getElementById('xk-edit-layer-edit');
                    that.layerPanelBox = doc.getElementById('xk-edit-layer-panel');

                    // 动效div
                    that.effectPanel = doc.getElementById('xk-edit-effect-edit');
                    that.effectPanelBox = doc.getElementById('xk-edit-effect-panel');
                    that.effectani = doc.getElementById('xk-edit-anitab');

                    // 画布侦听
                    var llli = that.pagePanel.firstElementChild.childNodes;
                    XkTool.addEvent(that.pagePanel.firstElementChild, 'mousedown', function (e) {
                        e.preventDefault();

                    });
                    XkTool.addEvent(that.pagePanel.firstElementChild, 'mouseup', function (e) {
                        //画布侦听
                        // console.log(e.currentTarget,e.target,lll.contains(e.target),llli);
                        var element, j = 0, pageLen = 0, selectIndex;
                        for (var i in llli) {
                            if (llli[i].nodeType === 1 && llli[i].contains(e.target)) {
                                element = llli[i];
                                selectIndex = i;
                                if (that.ctrl || that.shift || that.ctrl_shift) {
                                    if (XkTool.hasClass(element, 'box-bg-green')) {
                                        XkTool.removeClass(element, 'box-bg-green');
                                        for (j = 0, pageLen = that.page_select.length; j < pageLen; j++) {
                                            if (element == that.page_select[j].ele) {
                                                that.page_select.splice(j, 1);
                                            }
                                        }
                                    } else {
                                        XkTool.addClass(element, 'box-bg-green');
                                        that.page_select[that.page_select.length] = {
                                            index: selectIndex,
                                            ele: element
                                        };
                                    }

                                } else {
                                    j = 0;
                                    pageLen = that.page_select.length;

                                    if (XkTool.hasClass(element, 'box-bg-green')) {
                                        if (pageLen <= 1) {
                                            // that.page_select = [];
                                            // XkTool.removeClass(element,'box-bg-green');
                                        } else {
                                            for (j = 0; j < pageLen; j++) {
                                                if (element == that.page_select[j].ele) continue;
                                                XkTool.removeClass(that.page_select[j].ele, 'box-bg-green');
                                                that.page_select.splice(j, 1);
                                                j--, pageLen--;
                                            }
                                        }
                                    } else {
                                        XkTool.addClass(element, 'box-bg-green');
                                        if (pageLen <= 1) {
                                            if (that.page_select[0]) {
                                                XkTool.removeClass(that.page_select[0].ele, 'box-bg-green');
                                            }
                                            that.page_select[0] = {
                                                index: selectIndex,
                                                ele: element
                                            };
                                        } else {
                                            for (j = 0; j < pageLen; j++) {
                                                if (element == that.page_select[j].ele) continue;
                                                XkTool.removeClass(that.page_select[j].ele, 'box-bg-green');
                                            }
                                            that.page_select = [];
                                            that.page_select[0] = {
                                                index: selectIndex,
                                                ele: element
                                            };
                                        }
                                    }


                                }

                            }
                        }

                        if (that.page_currentTarget_select.index != selectIndex && element) {

                            // 之前选择的page 层级下降
                            if (that.page_currentTarget_select.ele) that.page_currentTarget_select.ele.style.zIndex = 0;

                            // 新选择的page 及 其子节点，层级提示
                            element.style.zIndex = 1;
                            var page = element.firstElementChild.nextElementSibling;
                            var pageChild = page.childNodes;
                            var pageChildLen = pageChild.length;
                            while (pageChildLen--) {
                                pageChild[pageChildLen].style.zIndex = pageChildLen;
                            }

                            that.page_currentTarget_select = {
                                index: selectIndex,
                                ele: element
                            };

                            if (that.layerPanelBox && that.page_currentTarget_select.index) {
                                var id = ~~_Model.page[that.page_currentTarget_select.index].id + 1;
                                getChildes(that.layerPanel.firstElementChild)[1].innerHTML = 'page-' + id;
                                that.v.initLayer(that.layerPanelBox, _Model.page[that.page_currentTarget_select.index].layerList);
                            }
                        }
                    });


                    // 组件方法
                    sub_class();
                    // 键盘方法
                    key_Event();


                    function sub_class() {
                        //组件,图层，效果层 方法
                        var duobleClick = false;
                        // 组件
                        function subDownEvent(e) {
                            // 组件，图层，效果层 的按下事件
                            //
                            // 组件mousedown 按下

                            //顶部导航是固定布局，占了55px，因此，如果用的是offsetTop，计算的时候就要考虑
                            var _headHeight = 55;
                            var _downTime = XkTool.getTime();

                            var list, i = 0, len, selectUl = {}, indexUl = NaN, indexLi = NaN, selectLi, UlChild = {},
                                parentEle = {}, element = {}, eleId;
                            // 拷贝的节点，供拖动;
                            var isDrop = true, isMove = false, eleName, _x, _y, _mx, _my;
                            // 拖动的 ul 容器
                            var moveUl = null;
                            // 当前容器的的scrolltop
                            var eleScrrollTop = 0, scrollHeight = 0;
                            // 拖动对象 当前num，当前节点
                            var moveNextIndex, nextLi;

                            var isPanelMove = false;    //多个li拖动
                            var currIndex = NaN;        //滚条上一个滚动位置

                            var moveNextCss = '';       // 记录move的li 的border css
                            var currCss = '';           // 上一个li 的border css

                            // 双击修改名字或者打开显示


                            parentEle = e.currentTarget;
                            element = e.target;
                            if (e.button == 0) {
                                eleId = e.currentTarget.id;
                            }
                            _mx = _x = e.pageX;
                            _my = _y = e.pageY;

                            list = getChildes(e.currentTarget);
                            len = list.length;

                            eleScrrollTop = parentEle.scrollTop;
                            scrollHeight = parentEle.scrollHeight;

                            for (i = 0; i < len; i++) {
                                if (list[i].contains(element)) {
                                    selectUl = list[i];
                                    indexUl = selectUl.getAttribute('data-tab');
                                    break;
                                }
                            }


                            UlChild = getChildes(selectUl);


                            for (i = 0, len = UlChild.length; i < len; i++) {
                                if (UlChild[i].contains(element)) {
                                    selectLi = UlChild[i];
                                    eleName = selectLi.nodeName;
                                    indexLi = i;
                                    that.subBox_layer_effect_sct_index = i;
                                    break;
                                }
                            }

                            if (!selectLi) return;

                            if (that.subBox_layer_curr_select_ul != selectUl) {
                                that.subBox_layer_curr_select_ul = selectUl;
                            }
                            if (that.subBox_layer_curr_select_li != selectLi) {
                                that.subBox_layer_curr_select_li = selectLi;
                            }

                            var _dataId = ~~element.getAttribute('data-id');


                            var selectUlRect = selectUl.getBoundingClientRect();
                            var copyNodeRect = selectLi.getBoundingClientRect();


                            switch (eleId) {
                                case 'xk-edit-effect-panel':
                                    // 效果层
                                    //  console.log(e.currentTarget.id, element);
                                    var target = element;
                                    if (target.getAttribute('type') === 'range') {//组件滑动速度模块
                                        var demo_obj = target.parentNode.parentNode.parentNode.previousSibling;
                                        aniclick.Rangesider(target, demo_obj)
                                    } else {
                                        dropLayer(selectUl, selectLi, that.eff_select, function () {
                                            // console.log('xk-edit-effect-panel');
                                        });
                                    }
                                    if (target.title) {
                                        var obj1 = target.parentNode.parentNode.parentNode.parentNode.previousSibling;
                                        var obj2;
                                        target.parentNode.parentNode.previousSibling != null ? obj2 = target.parentNode.parentNode.previousSibling.childNodes[1].firstChild : obj2 = null;
                                        aniclick.Choice(target, obj1, obj2);
                                    }
                                    ;
                                    break;
                               /* case 'xk-edit-anitab':
                                    var effect_tab = that.effectPanelBox.getElementsByClassName('xk-edit-left-bottom-body')[0];
                                    var layer_tab_li = that.layerPanelBox.getElementsByTagName('li');
                                    for (var i = 0; i < layer_tab_li.length; i++) {
                                        if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                            aniclick.onfor(that.effectani.getElementsByTagName('span'), effect_tab);
                                        }
                                    }
                                    break;*/
                                case 'xk-edit-sub-panel':
                                    // 组件层
                                    // console.log(e.currentTarget.id,element,indexUl);
                                    //组件当前显示的id
                                    if (!that.sub_select[indexUl]) that.sub_select[indexUl] = [];
                                    that.sub_show_id = indexUl;
                                    dropItem(selectUl, selectLi, that.sub_select[indexUl], function () {
                                        console.log('xk-edit-sub-panel');
                                    });
                                    break;
                                case 'xk-edit-layer-panel':
                                    // 图层层
                                    dropLayer(selectUl, selectLi, that.layer_select, function () {
                                        console.log('xk-edit-layer-panel');
                                    });
                                    break;
                            }

                            function moveNode(ele, top) {
                                // 拖动的节点
                                var newLi = doc.createElement('li');
                                var liTop, liLeft, liWidth, liHeight;
                                var eleChild, ourSrt = '';
                                var copyNodeRect = ele.getBoundingClientRect(), mi, mLen;
                                eleChild = getChildes(ele);
                                for (mi = 0, mLen = eleChild.length; mi < mLen; mi++) {
                                    ourSrt += eleChild[mi].outerHTML;
                                }
                                newLi.innerHTML = ourSrt;
                                liTop = Math.round(copyNodeRect.top - eleScrrollTop);
                                liLeft = Math.round(copyNodeRect.left);
                                liWidth = Math.round(copyNodeRect.width);
                                liHeight = Math.round((copyNodeRect.height > 46 ? 46 : copyNodeRect.height ));
                                newLi.style.top = Math.round(copyNodeRect.top - top) + 'px';
                                newLi.style.left = '0px';
                                newLi.style.width = liWidth + 'px';
                                newLi.style.height = liHeight + 'px';
                                // newLi.style.opacity = 0;
                                newLi.style.overflow = 'hidden';
                                newLi.style.zIndex = -1;
                                newLi.style.position = 'absolute';
                                return {
                                    ele: newLi,
                                    top: liTop,
                                    left: liLeft,
                                    width: liWidth,
                                    height: liHeight
                                };

                            }

                            function movePanel(cuUl, cuLi, selectArr) {
                                // 生成拖动的ul，及其子节点li；
                                // 子节点li，全部是 通过 moveNode 方法，传回的 复制体（完全遍历复制）

                                var _moveUl = doc.createElement('ul');
                                var _delEle, nextH = 0, getEleObj;
                                var len = selectArr.length;
                                if (isPanelMove) {
                                    var moveArr = [], childItem, firstIndex = false, firstEleTop;

                                    for (i = 0; i < len; i++) {
                                        childItem = selectArr[i];
                                        if (!cuUl.contains(childItem.ele)) continue;
                                        moveArr[childItem.index] = childItem;
                                    }
                                    for (i = 0, len = moveArr.length; i < len; i++) {
                                        childItem = moveArr[i];
                                        if (childItem) {
                                            if (!firstIndex) {
                                                firstEleTop = childItem.ele.getBoundingClientRect().top;
                                            }
                                            getEleObj = moveNode(childItem.ele, firstEleTop);
                                            if (!firstIndex) {
                                                nextH = getEleObj.top;
                                                _moveUl.style.top = getEleObj.top + eleScrrollTop + 'px';
                                                _moveUl.style.left = getEleObj.left + 'px';
                                                firstIndex = true;
                                            }
                                            _moveUl.style.height = getEleObj.top - nextH + getEleObj.height + 'px';
                                            _moveUl.appendChild(getEleObj.ele);
                                        }

                                    }

                                } else {

                                    len = selectArr.length;
                                    while (len--) {
                                        _delEle = selectArr[len];
                                        selectArr.splice(len, 1);
                                        that.class_list.push(_delEle);
                                    }

                                    getEleObj = moveNode(cuLi);
                                    _moveUl.style.top = getEleObj.top + eleScrrollTop + 'px';
                                    _moveUl.style.left = getEleObj.left + 'px';
                                    _moveUl.style.height = getEleObj.height + 'px';
                                    _moveUl.appendChild(getEleObj.ele);

                                }
                                _moveUl.style.width = getEleObj.width + 'px';
                                _moveUl.style.position = 'absolute';
                                _moveUl.style.zIndex = 10000;
                                _moveUl.style.opacity = 0;
                                return _moveUl;
                            }

                            function hasNextEle(ele, arr) {
                                // 获取目标节点，是否在选择数组内
                                var _isHasEle = false;
                                var ni, nextArrLen;
                                var nextChild;
                                for (ni = 0, nextArrLen = arr.length; ni < nextArrLen; ni++) {
                                    nextChild = arr[ni];
                                    if (nextChild) {
                                        if (ele == nextChild.ele) {
                                            _isHasEle = true;
                                            return _isHasEle;
                                        }
                                    }

                                }

                                return _isHasEle;
                            }

                            function setLIcss(index, styleValue) {
                                // 设置css,styleValue 为style的属性值 , borderTopColor,borderBottomColor;

                                styleValue == undefined ? styleValue = moveNextCss : styleValue = styleValue;
                                UlChild[index].style[styleValue] = 'red';

                                if (!isNaN(currIndex)) {
                                    UlChild[currIndex].style[currCss] = '#9d9d9d';
                                }
                                currIndex = index;
                                currCss = styleValue;
                            }

                            function dropLayer(cuUl, cuLi, selectArr, callback) {
                                // 图层和效果层 拖动

                                // if(moveUl!=null){
                                //     that.headDiv.removeChild(moveUl);
                                //     moveUl=null;
                                // }
                                callback();

                                var childItem;
                                var scrollIndex = NaN;
                                var liLen = UlChild.length;

                                //拖动存在的四个属性
                                var isTop = false;
                                var isBottom = false;

                                // 当前 ul 的rect属性
                                var cuUlRect = cuUl.getBoundingClientRect();


                                moveNextIndex = indexLi;
                                nextLi = cuLi;

                                len = selectArr.length;

                                for (i = 0; i < len; i++) {
                                    if (cuLi == selectArr[i].ele) {
                                        isPanelMove = true;
                                        break;
                                    }
                                }


                                XkTool.addEvent(cuLi, 'mouseup', subUpEvent);

                                XkTool.addEvent(window, 'mousemove', copyMove);
                                XkTool.addEvent(window, 'mouseup', copyUp);

                                function copyUp(e) {
                                    //鼠标抬起后，按需插入
                                    XkTool.removeEvent(window, 'mousemove', copyMove);
                                    if (!isDrop) return;
                                    isDrop = false;

                                    if (isMove) {

                                        var moveArr = [];                       //按点击目前的位置（index）来排序的数组
                                        var minArr = [], maxArr = [];           //分离出，比 当前移动的对象moveNextIndex 大 or 小 的二个数组
                                        var nextItem;
                                        var excEle;                             //交换节点
                                        var moveLi;                             //保存一次拖入目标
                                        var moveLiNext;                         //
                                        var arrIndex;

                                        var removeEle;                          // 移除的li

                                        var modePage = _Model.page[~~that.page_currentTarget_select.index];       //获取当前选择的page 对应的 mode数据
                                        var modeLayer = modePage.layerList;                         //获取当前mode数据下的 图层数组
                                        var excModeData;                                             //临时保存待图层数组变更位置的对象

                                        moveLi = UlChild[moveNextIndex];
                                        moveLiNext = moveLi.nextElementSibling;
                                        setLIcss(moveNextIndex);

                                        len = selectArr.length;
                                        if (isPanelMove && len > 1) {

                                            // 对选择的节点，按索引进行排序
                                            for (i = 0; i < len; i++) {
                                                childItem = selectArr[i];
                                                if (!cuUl.contains(childItem.ele)) continue;
                                                moveArr[childItem.index] = childItem;
                                            }

                                            // 排序完成后，以移入目标索引，进行大小数组分割
                                            for (i = 0, len = moveArr.length; i < len; i++) {
                                                childItem = moveArr[i];
                                                if (childItem) {
                                                    childItem.index >= moveNextIndex ? maxArr.push(childItem) : minArr.push(childItem);
                                                }
                                            }

                                            len = minArr.length;
                                            nextItem = len;
                                            var UlIndex;
                                            var minLiNum = moveNextIndex;
                                            var minLi;
                                            while (len--) {
                                                childItem = minArr[len];
                                                minLi = UlChild[minLiNum];
                                                var minNum = moveNextIndex - childItem.index;
                                                var _minNUm = minNum;

                                                while (minNum--) {
                                                    // 根据当前位置 与 移动位置  差值，进行循环，遍历目标是否可以移动
                                                    UlIndex = ~~childItem.index + _minNUm;
                                                    var excNode = UlChild[UlIndex];
                                                    var hasEle = hasNextEle(excNode, moveArr);

                                                    if (!hasEle) {

                                                        excEle = excNode.nextElementSibling;

                                                        removeEle = cuUl.removeChild(childItem.ele);
                                                        UlChild.splice(childItem.index, 1);                  //更新UlChild数组索引

                                                        excModeData = modeLayer[childItem.index];               //更新mode图层数组
                                                        modeLayer.splice(childItem.index, 1);
                                                        if (!isBottom) {
                                                            cuUl.insertBefore(removeEle, excEle);
                                                            arrIndex = Index(cuUl, removeEle);
                                                            UlChild.splice(UlIndex, 0, removeEle);            //更新UlChild数组索引

                                                            modeLayer.splice(UlIndex, 0, excModeData);            //更新mode图层数组

                                                        } else {

                                                            excEle = minLi.nextElementSibling;
                                                            console.log(minLi)
                                                            if (excEle) {
                                                                cuUl.insertBefore(removeEle, excEle);
                                                                arrIndex = Index(cuUl, removeEle);
                                                                UlChild.splice(arrIndex, 0, removeEle);                        //更新UlChild数组索引
                                                                modeLayer.splice(arrIndex, 0, excModeData);                        //更新mode图层数组
                                                            } else {
                                                                cuUl.appendChild(removeEle);
                                                                UlChild.push(removeEle);                        //更新UlChild数组索引
                                                                arrIndex = UlChild.length - 1;
                                                                modeLayer.push(excModeData);                        //更新mode图层数组
                                                            }
                                                            minLiNum--;

                                                        }
                                                        childItem.index = arrIndex;

                                                        break;
                                                    }

                                                    _minNUm--;
                                                }
                                                removeEle = null;
                                            }


                                            len = maxArr.length;
                                            nextItem = 0;
                                            while (nextItem < len) {
                                                childItem = maxArr[nextItem];
                                                var maxNum = childItem.index - moveNextIndex;
                                                var _maxNum = maxNum;
                                                while (maxNum--) {

                                                    UlIndex = ~~childItem.index - _maxNum;

                                                    var excNode = UlChild[UlIndex];
                                                    var hasEle = hasNextEle(excNode, maxArr);

                                                    if (!hasEle) {
                                                        excEle = excNode.nextElementSibling;
                                                        if (childItem.ele == moveLiNext) {
                                                            moveLiNext = moveLiNext.nextElementSibling;
                                                        }

                                                        removeEle = cuUl.removeChild(childItem.ele);

                                                        UlChild.splice(childItem.index, 1);                  //更新UlChild数组索引
                                                        excModeData = modeLayer[childItem.index];               //更新mode图层数组
                                                        modeLayer.splice(childItem.index, 1);
                                                        if (!isTop) {
                                                            cuUl.insertBefore(removeEle, moveLiNext);
                                                            arrIndex = Index(cuUl, removeEle);
                                                            UlChild.splice(arrIndex, 0, removeEle);            //更新UlChild数组索引

                                                            modeLayer.splice(arrIndex, 0, excModeData);            //更新mode图层数组
                                                        } else {

                                                            cuUl.insertBefore(removeEle, excNode);
                                                            arrIndex = Index(cuUl, removeEle);
                                                            UlChild.splice(arrIndex, 0, removeEle);            //更新UlChild数组索引

                                                            modeLayer.splice(arrIndex, 0, excModeData);            //更新mode图层数组

                                                        }
                                                        childItem.index = arrIndex;
                                                        break;
                                                    }

                                                    _maxNum--;
                                                }

                                                removeEle = moveLi = null;
                                                nextItem++;
                                            }
                                            // console.log(excModeData,modeLayer,arrIndex);
                                            // console.log(UlChild,selectArr);
                                            // console.log(modeLayer,that.page_currentTarget_select);

                                            excNode = moveLiNext = null;

                                        } else {

                                            len = selectArr.length;
                                            if (len > 0) {
                                                while (len--) {
                                                    var delEle = selectArr[len];
                                                    selectArr.splice(len, 1);
                                                    that.class_list.push(delEle);
                                                }
                                            }
                                            var excNode = UlChild[moveNextIndex];

                                            excEle = excNode.nextElementSibling;
                                            removeEle = cuUl.removeChild(cuLi);

                                            UlChild.splice(indexLi, 1);                  //更新UlChild数组索引
                                            excModeData = modeLayer[indexLi];           //更新mode图层数组
                                            modeLayer.splice(indexLi, 1);

                                            if (!isTop && excEle != cuLi) {
                                                cuUl.insertBefore(removeEle, excEle);
                                            } else if (removeEle === excNode) {
                                                cuUl.insertBefore(removeEle, cuUl.firstElementChild);
                                            }
                                            else {
                                                cuUl.insertBefore(removeEle, excNode);
                                            }
                                            arrIndex = Index(cuUl, removeEle);
                                            UlChild.splice(arrIndex, 0, removeEle);                  //更新UlChild数组索引
                                            modeLayer.splice(arrIndex, 0, excModeData);                //更新mode图层数组
                                            selectArr.push({
                                                ele: removeEle,
                                                index: moveNextIndex
                                            });
                                            XkTool.addClass(removeEle, 'box-bg-blue');

                                            for (i = 0, len = that.class_list.length; i < len; i++) {
                                                if (removeEle == that.class_list[i].ele) continue;
                                                XkTool.removeClass(that.class_list[i].ele, 'box-bg-blue');

                                            }
                                            removeEle = null;


                                            that.class_list = [];
                                            console.log(UlChild, selectArr, modeLayer);

                                        }

                                        if (!isNaN(currIndex)) {
                                            UlChild[currIndex].style.borderBottomColor = '#9d9d9d';
                                        }

                                        that.headDiv.removeChild(moveUl);
                                        moveUl = null;

                                    }

                                    XkTool.removeEvent(window, 'mouseup', copyUp);
                                    XkTool.removeEvent(window, 'mousemove', copyMove);
                                }

                                function copyMove(e) {
                                    // 拖动move事件
                                    var cuUlTop = cuUl.offsetTop, cuUlHeight = cuUl.offsetHeight;
                                    var nextRect;          //目标的 rect 属性
                                    isDrop = true;


                                    if (!isMove) {
                                        if (XkTool.getTime() - _downTime <= 150) return;

                                        len = selectArr.length;

                                        moveUl = movePanel(cuUl, cuLi, selectArr);

                                        that.headDiv.appendChild(moveUl);
                                        XkTool.addClass(moveUl, 'isDrop');
                                        moveUl.style.opacity = 0.7;

                                        isMove = true;
                                    }

                                    if (scrollIndex != moveNextIndex) {
                                        // 滚动条  跟随滚动
                                        // parentEle.scrollTop = 46* (moveNextIndex - scrollIndex) ;
                                        // parentEle.scrollTop = scrollHeight * (moveNextIndex / liLen / 2) ;
                                        // scrollIndex=moveNextIndex;

                                    }

                                    if (_y != e.pageY) {

                                        if (moveUl) {

                                            moveUl.style.top = e.pageY - moveUl.offsetHeight / 2 + 'px';

                                            if (moveUl.offsetTop < cuUlTop + _headHeight) {
                                                moveUl.style.top = cuUlTop + _headHeight + 'px';
                                            }
                                            if (moveUl.offsetTop >= cuUlTop + _headHeight + cuUlHeight - moveUl.offsetHeight) {

                                                moveUl.style.top = cuUlTop + _headHeight + cuUlHeight - moveUl.offsetHeight + 'px';
                                            }

                                        }

                                        _x = e.pageX , _y = e.pageY;

                                    }

                                    len = UlChild.length;
                                    if (Math.abs(_my - e.pageY) >= 2) {

                                        // 下个兄弟节点,
                                        var nextEleChild, nextEleChildRect, childTopAndHeight = 0;
                                        // if(_my - e.pageY >= 1){
                                        //     //往上滚动
                                        //     console.log('上');
                                        //
                                        // }else if(_my - e.pageY <= -1){
                                        //     //往下滚动
                                        //     console.log('下');
                                        //
                                        // }

                                        nextRect = nextLi.getBoundingClientRect();
                                        nextEleChild = nextLi.nextElementSibling;
                                        if (nextEleChild) {
                                            nextEleChildRect = nextEleChild.getBoundingClientRect();
                                            childTopAndHeight = childTopAndHeight + nextEleChildRect.height / 2;
                                        }
                                        if (e.pageY < nextRect.top + nextRect.height / 2) {
                                            moveNextIndex--;
                                            // moveNextIndex >= UlChild.length-1 ? moveNextIndex = UlChild.length-1 : moveNextIndex;
                                            if (moveNextIndex < 0) {
                                                moveNextIndex = 0;
                                                if (!isTop) {
                                                    moveNextCss = 'borderTopColor';
                                                    setLIcss(moveNextIndex, moveNextCss);
                                                    isTop = true;
                                                }
                                                return;
                                            }
                                            moveNextCss = 'borderBottomColor';
                                            setLIcss(moveNextIndex, moveNextCss);


                                        } else if (e.pageY > nextRect.top + nextRect.height + childTopAndHeight) {

                                            moveNextIndex++;
                                            // moveNextIndex < 0 ? moveNextIndex = 0 : moveNextIndex = moveNextIndex;

                                            if (moveNextIndex >= len - 1) {
                                                moveNextIndex = len - 1;
                                                if (!isBottom) {
                                                    moveNextCss = 'borderBottomColor';
                                                    setLIcss(moveNextIndex, moveNextCss);
                                                    isBottom = true;
                                                }
                                                return;
                                            }
                                            moveNextCss = 'borderBottomColor';
                                            setLIcss(moveNextIndex, moveNextCss);
                                            // console.log(moveNextIndex,currIndex,e.pageY,nextRect.top)
                                        } else {
                                            isTop = isBottom = false;
                                            moveNextCss = 'borderBottomColor';
                                            currCss = 'borderTopColor';
                                            setLIcss(moveNextIndex, moveNextCss);
                                        }

                                        nextLi = UlChild[moveNextIndex];

                                        _my = e.pageY;
                                        _mx = e.pageX;
                                    }


                                }

                            }

                            function dropItem(cuUl, cuLi, selectArr, callback) {
                                // 组件拖动
                                if (moveUl != null) {
                                    that.headDiv.removeChild(moveUl);
                                    moveUl = null;
                                }
                                callback();

                                // 画布的rect模型值
                                var pageRect = that.pagePanel.getBoundingClientRect();
                                // 画布的滚条值
                                var pageScrollTop = that.pagePanel.scrollTop;

                                var childItem;
                                var indexRect = cuUl;
                                var moveBoxBool = true;

                                //拖动存在的四个属性
                                var isTop = false;
                                var isBottom = false;

                                moveNextIndex = indexLi;
                                nextLi = cuLi;

                                len = selectArr.length;

                                for (i = 0; i < len; i++) {
                                    if (cuLi == selectArr[i].ele) {
                                        isPanelMove = true;
                                        break;
                                    }
                                }


                                XkTool.addEvent(cuLi, 'mouseup', subUpEvent);


                                XkTool.addEvent(window, 'mousemove', copyMove);
                                XkTool.addEvent(window, 'mouseup', copyUp);

                                function copyUp(e) {
                                    XkTool.removeEvent(window, 'mousemove', copyMove);
                                    if (!isDrop) return;
                                    isDrop = false;

                                    if (isMove) {

                                        if (moveBoxBool) {
                                            // 在组件容器内部拖动


                                            var moveArr = [];                       //按点击目前的位置（index）来排序的数组
                                            var minArr = [], maxArr = [];           //分离出，比 当前移动的对象moveNextIndex 大 or 小 的二个数组
                                            var nextItem;
                                            var excEle;                             //交换节点
                                            var moveLi;                             //保存一次拖入目标
                                            var moveLiNext;                         //
                                            var arrIndex;

                                            var removeEle;                          // 移除的li

                                            var modePage = _Model.page[~~that.page_currentTarget_select.index];       //获取当前选择的page 对应的 mode数据
                                            var modeLayer = modePage.layerList;                         //获取当前mode数据下的 图层数组
                                            var excModeData;                                             //临时保存待图层数组变更位置的对象

                                            moveLi = UlChild[moveNextIndex];
                                            moveLiNext = moveLi.nextElementSibling;
                                            setLIcss(moveNextIndex);

                                            len = selectArr.length;
                                            if (isPanelMove && len > 1) {

                                                for (i = 0; i < len; i++) {
                                                    childItem = selectArr[i];
                                                    if (!cuUl.contains(childItem.ele)) continue;
                                                    moveArr[childItem.index] = childItem;
                                                }

                                                for (i = 0, len = moveArr.length; i < len; i++) {
                                                    childItem = moveArr[i];
                                                    if (childItem) {
                                                        childItem.index >= moveNextIndex ? maxArr.push(childItem) : minArr.push(childItem);
                                                    }
                                                }

                                                len = minArr.length;
                                                nextItem = len;
                                                var UlIndex;
                                                var minLiNum = moveNextIndex;
                                                var minLi;
                                                while (len--) {
                                                    childItem = minArr[len];
                                                    minLi = UlChild[minLiNum];
                                                    var minNum = moveNextIndex - childItem.index;
                                                    var _minNUm = minNum;

                                                    while (minNum--) {
                                                        // 根据当前位置 与 移动位置  差值，进行循环，遍历目标是否可以移动
                                                        UlIndex = ~~childItem.index + _minNUm;
                                                        var excNode = UlChild[UlIndex];
                                                        var hasEle = hasNextEle(excNode, moveArr);
                                                        if (!hasEle) {

                                                            excEle = excNode.nextElementSibling;

                                                            removeEle = cuUl.removeChild(childItem.ele);
                                                            UlChild.splice(childItem.index, 1);                  //更新UlChild数组索引

                                                            // excModeData = modeLayer[childItem.index];               //更新mode图层数组
                                                            // modeLayer.splice(childItem.index,1);

                                                            if (!isBottom) {
                                                                cuUl.insertBefore(removeEle, excEle);
                                                                arrIndex = Index(cuUl, removeEle);
                                                                UlChild.splice(UlIndex, 0, removeEle);            //更新UlChild数组索引
                                                                console.log(UlIndex)

                                                            } else {
                                                                excEle = minLi.nextElementSibling;

                                                                if (excEle) {
                                                                    cuUl.insertBefore(removeEle, excEle);
                                                                    arrIndex = Index(cuUl, removeEle);
                                                                    UlChild.splice(arrIndex, 0, removeEle);                        //更新UlChild数组索引
                                                                } else {
                                                                    cuUl.appendChild(removeEle);
                                                                    UlChild.push(removeEle);                        //更新UlChild数组索引
                                                                    arrIndex = UlChild.length - 1;
                                                                }
                                                                minLiNum--;

                                                            }
                                                            childItem.index = arrIndex;

                                                            break;
                                                        }

                                                        _minNUm--;
                                                    }
                                                    removeEle = excNode = null;

                                                }


                                                len = maxArr.length;
                                                nextItem = 0;
                                                while (nextItem < len) {
                                                    childItem = maxArr[nextItem];
                                                    var maxNum = childItem.index - moveNextIndex;
                                                    var _maxNum = maxNum;

                                                    while (maxNum--) {
                                                        UlIndex = ~~childItem.index - _maxNum;
                                                        var excNode = UlChild[UlIndex];
                                                        var hasEle = hasNextEle(excNode, maxArr);

                                                        if (!hasEle) {
                                                            excEle = excNode.nextElementSibling;
                                                            if (childItem.ele == moveLiNext) {
                                                                moveLiNext = moveLiNext.nextElementSibling;
                                                            }

                                                            removeEle = cuUl.removeChild(childItem.ele);
                                                            UlChild.splice(childItem.index, 1);                  //更新UlChild数组索引

                                                            if (!isTop) {
                                                                if (excEle == childItem.ele) continue;
                                                                cuUl.insertBefore(removeEle, moveLiNext);
                                                                arrIndex = Index(cuUl, removeEle);
                                                                UlChild.splice(arrIndex, 0, removeEle);            //更新UlChild数组索引

                                                            } else {
                                                                cuUl.insertBefore(removeEle, excNode);
                                                                arrIndex = Index(cuUl, removeEle);
                                                                UlChild.splice(arrIndex, 0, removeEle);            //更新UlChild数组索引

                                                            }
                                                            childItem.index = Index(cuUl, removeEle);

                                                            break;
                                                        }

                                                        _maxNum--;
                                                    }

                                                    removeEle = excNode = null;

                                                    nextItem++;
                                                }


                                            } else {
                                                len = selectArr.length;
                                                if (len > 0) {
                                                    while (len--) {
                                                        var delEle = selectArr[len];
                                                        selectArr.splice(len, 1)
                                                        that.class_list.push(delEle);
                                                    }
                                                }
                                                var excNode = UlChild[moveNextIndex];
                                                excEle = excNode.nextElementSibling;
                                                // var hasEle = hasNextEle(excNode);
                                                removeEle = cuUl.removeChild(cuLi);

                                                UlChild.splice(indexLi, 1);                  //更新UlChild数组索引

                                                if (!isTop && excEle != cuLi) {
                                                    cuUl.insertBefore(removeEle, excEle);
                                                } else if (removeEle === excNode) {
                                                    cuUl.insertBefore(removeEle, cuUl.firstElementChild)
                                                }
                                                else {
                                                    cuUl.insertBefore(removeEle, excNode);
                                                }
                                                arrIndex = Index(cuUl, removeEle);
                                                UlChild.splice(arrIndex, 0, removeEle);                  //更新UlChild数组索引

                                                selectArr.push({
                                                    ele: removeEle,
                                                    index: moveNextIndex
                                                });
                                                XkTool.addClass(removeEle, 'box-bg-blue');

                                                for (i = 0, len = that.class_list.length; i < len; i++) {
                                                    if (removeEle == that.class_list[i].ele) continue;
                                                    XkTool.removeClass(that.class_list[i].ele, 'box-bg-blue');

                                                }

                                                removeEle = null;
                                                that.class_list = [];
                                            }


                                        } else {

                                            // 拖动到画布上

                                            var pageLen = that.page_select.length;
                                            var page;               //选择的 page 对象
                                            var pageEle;            //选择的 page 节点 子容器
                                            var pageEleRect;        //page的 模型数据
                                            var sctEle;             //选择的节点
                                            var dataItem;           //获取数据 对象
                                            var layerLen;           //层级
                                            var regNum = /^(\d)*/g;
                                            if (pageLen == 1) {
                                                // 目前不知道，是否具备，一个组件，同时拖入N个选择的page。
                                                // 如果不可以，那么采用 that.page_currentTarget_select
                                                // 如果可以，就要遍历这里了。。。。

                                                // console.log(that.page_select,'1234',pageLen);

                                                // 插入组件 的 目标page节点
                                                page = that.page_select[pageLen - 1];
                                                pageEle = page.ele.firstElementChild.nextElementSibling;
                                                pageEleRect = pageEle.getBoundingClientRect();
                                                var _x = e.pageX, _y = e.pageY;
                                                var imgWidth, imgHeight, imgTop, imgLeft;
                                                var newImg;
                                                // 页面单个图层数据对象
                                                var modeLayerItem;
                                                var newLi;
                                                if (isPanelMove) {

                                                    for (i = 0; i < len; i++) {
                                                        sctEle = selectArr[i];

                                                        // 通过选择的 li 包含的 data-subId，然后在 数据层 遍历，找到这个 数据。
                                                        // 目前 先随便获取，后面数据对应后，再删除这里
                                                        dataItem = _Model.subList[sctEle.index];
                                                        if (dataItem.tab != 0) return;

                                                        newLi = doc.createElement('li');
                                                        layerLen = _Model.page[page.index].layerList.length;

                                                        imgWidth = dataItem.width.match(regNum);
                                                        imgHeight = dataItem.height.match(regNum);

                                                        imgTop = e.pageY - imgHeight / 2;
                                                        imgLeft = e.pageX - imgWidth / 2;
                                                        imgTop = Math.round(imgTop - pageEleRect.top);
                                                        imgLeft = Math.round(imgLeft - pageEleRect.left);
                                                        newImg = doc.createElement('img');
                                                        newImg.src = dataItem.src;
                                                        newImg.style.left = imgLeft + 'px';
                                                        newImg.style.top = imgTop + 'px';
                                                        newImg.style.width = imgWidth + 'px';
                                                        newImg.style.height = imgHeight + 'px';
                                                        newImg.style.zIndex = layerLen;
                                                        pageEle.appendChild(newImg);
                                                        dataItem.citeAdd.push({
                                                            index: page.index,
                                                            pageEle: page.ele,
                                                            ele: newImg
                                                        });

                                                        //插入页面数据层；
                                                        _Model.page[page.index].layerList[layerLen] = {
                                                            subId: dataItem.id,
                                                            layer: layerLen - 1,
                                                            src: dataItem.src,
                                                            name: 0,
                                                            rect: {
                                                                width: imgWidth,
                                                                height: imgHeight,
                                                                left: imgLeft,
                                                                top: imgTop,
                                                            },
                                                            animal: [1],
                                                        };
                                                        modeLayerItem = _Model.page[page.index].layerList[layerLen];
                                                        //page图层增加相应节点
                                                        newLi.innerHTML = that.v._getLayer(modeLayerItem);
                                                        that.layerPanelBox.firstElementChild.appendChild(newLi);
                                                        newLi = newImg = null;
                                                        console.log(sctEle.index, '123')
                                                    }

                                                } else {
                                                    // 通过选择的 li 包含的 data-subId ，然后在 数据层 遍历，找到这个 数据。
                                                    // 目前 先随便获取，后面数据对应后，再删除这里

                                                    dataItem = _Model.subList[Index(cuUl, cuLi)];

                                                    if (dataItem.tab == 0) {
                                                        // 图片组件
                                                        newLi = doc.createElement('li');
                                                        layerLen = _Model.page[page.index].layerList.length;

                                                        imgWidth = dataItem.width.match(regNum);
                                                        imgHeight = dataItem.height.match(regNum);

                                                        imgTop = e.pageY - imgHeight / 2;
                                                        imgLeft = e.pageX - imgWidth / 2;
                                                        imgTop = Math.round(imgTop - pageEleRect.top);
                                                        imgLeft = Math.round(imgLeft - pageEleRect.left);
                                                        newImg = doc.createElement('img');
                                                        newImg.src = dataItem.src;
                                                        newImg.style.left = imgLeft + 'px';
                                                        newImg.style.top = imgTop + 'px';
                                                        newImg.style.width = imgWidth + 'px';
                                                        newImg.style.height = imgHeight + 'px';
                                                        newImg.style.zIndex = layerLen;
                                                        pageEle.appendChild(newImg);
                                                        dataItem.citeAdd.push({
                                                            index: page.index,
                                                            pageEle: page.ele,
                                                            ele: newImg
                                                        });

                                                        //插入页面数据层；
                                                        _Model.page[page.index].layerList[layerLen] = {
                                                            subId: dataItem.id,
                                                            layer: layerLen - 1,
                                                            src: dataItem.src,
                                                            name: 0,
                                                            rect: {
                                                                width: imgWidth,
                                                                height: imgHeight,
                                                                left: imgLeft,
                                                                top: imgTop,
                                                            },
                                                            animal: [1],
                                                        };
                                                        modeLayerItem = _Model.page[page.index].layerList[layerLen];
                                                        //page图层增加相应节点
                                                        newLi.innerHTML = that.v._getLayer(modeLayerItem);

                                                        that.layerPanelBox.firstElementChild.appendChild(newLi);


                                                        // 清楚不是本次选择的节点的样式
                                                        len = selectArr.length;
                                                        if (len > 0) {
                                                            while (len--) {
                                                                var delEle = selectArr[len];
                                                                selectArr.splice(len, 1)
                                                                that.class_list.push(delEle);
                                                            }
                                                        }
                                                        selectArr.push({
                                                            ele: cuLi,
                                                            index: Index(cuUl, cuLi)
                                                        });
                                                        XkTool.addClass(cuLi, 'box-bg-blue');

                                                        for (i = 0, len = that.class_list.length; i < len; i++) {
                                                            if (cuLi == that.class_list[i].ele) continue;
                                                            XkTool.removeClass(that.class_list[i].ele, 'box-bg-blue');

                                                        }

                                                        that.class_list = [];
                                                        newLi = null;
                                                        newImg = null;
                                                    }

                                                }


                                            }


                                        }


                                        if (!isNaN(currIndex)) {
                                            UlChild[currIndex].style.borderBottomColor = '#9d9d9d';
                                        }

                                        that.headDiv.removeChild(moveUl);
                                        moveUl = null;

                                    }

                                }

                                function copyMove(e) {
                                    //组件拖动事件
                                    var cuUlTop = cuUl.offsetTop, cuUlHeight = cuUl.offsetHeight;
                                    var nextRect;          //目标的 rect 属性
                                    isDrop = true;
                                    if (!isMove) {
                                        if (XkTool.getTime() - _downTime <= 150) return;
                                        len = selectArr.length;
                                        moveUl = movePanel(cuUl, cuLi, selectArr);
                                        that.headDiv.appendChild(moveUl);
                                        XkTool.addClass(moveUl, 'isDrop');
                                        moveUl.style.opacity = 0.5;
                                        isMove = true;
                                    }

                                    // parentEle.scrollTop += 46* (currIndex - moveNextIndex);
                                    // console.log(parentEle.scrollTop,'11111');
                                    if (moveBoxBool) {
                                        // 在组件盒子内拖动
                                        if ((e.pageX < pageRect.x + pageRect.width && e.pageX > pageRect.x) && (e.pageY < pageRect.y + pageRect.height && e.pageY > pageRect.y)) {
                                            moveBoxBool = false;
                                            indexRect = that.pagePanel;
                                        }
                                        if (_y != e.pageY) {

                                            if (moveUl) {
                                                moveUl.style.top = e.pageY - moveUl.offsetHeight / 2 + 'px';
                                                moveUl.style.left = indexRect.offsetLeft + 'px';
                                                if (moveUl.offsetTop < cuUlTop + _headHeight) {
                                                    moveUl.style.top = cuUlTop + _headHeight + 'px';
                                                }
                                                if (moveUl.offsetTop >= cuUlTop + _headHeight + cuUlHeight - moveUl.offsetHeight) {

                                                    moveUl.style.top = cuUlTop + _headHeight + cuUlHeight - moveUl.offsetHeight + 'px';
                                                }
                                            }

                                            _x = e.pageX , _y = e.pageY;
                                        }

                                        len = UlChild.length;
                                        if (Math.abs(_my - e.pageY) >= 2) {

                                            // 下个兄弟节点,
                                            var nextEleChild, nextEleChildRect, childTopAndHeight = 0;

                                            nextRect = nextLi.getBoundingClientRect();
                                            nextEleChild = nextLi.nextElementSibling;
                                            if (nextEleChild) {
                                                nextEleChildRect = nextEleChild.getBoundingClientRect();
                                                childTopAndHeight = childTopAndHeight + nextEleChildRect.height / 2;
                                            }
                                            if (e.pageY < nextRect.top + nextRect.height / 2) {
                                                moveNextIndex--;
                                                // moveNextIndex >= UlChild.length-1 ? moveNextIndex = UlChild.length-1 : moveNextIndex;
                                                if (moveNextIndex < 0) {
                                                    moveNextIndex = 0;
                                                    if (!isTop) {
                                                        moveNextCss = 'borderTopColor';
                                                        setLIcss(moveNextIndex, moveNextCss);
                                                        isTop = true;
                                                    }
                                                    return;
                                                }
                                                moveNextCss = 'borderBottomColor';
                                                setLIcss(moveNextIndex, moveNextCss);


                                            } else if (e.pageY > nextRect.top + nextRect.height + childTopAndHeight) {

                                                moveNextIndex++;
                                                // moveNextIndex < 0 ? moveNextIndex = 0 : moveNextIndex = moveNextIndex;
                                                if (moveNextIndex > len - 1) {
                                                    moveNextIndex = len - 1;
                                                    if (!isBottom) {
                                                        moveNextCss = 'borderBottomColor';
                                                        setLIcss(moveNextIndex, moveNextCss);
                                                        isBottom = true;
                                                    }
                                                    return;
                                                }
                                                moveNextCss = 'borderBottomColor';
                                                setLIcss(moveNextIndex, moveNextCss);
                                                // console.log(moveNextIndex,currIndex,e.pageY,nextRect.top)
                                            } else {
                                                isTop = isBottom = false;
                                                moveNextCss = 'borderBottomColor';
                                                currCss = 'borderTopColor';
                                                setLIcss(moveNextIndex, moveNextCss);
                                            }

                                            nextLi = UlChild[moveNextIndex];

                                            _my = e.pageY;
                                            _mx = e.pageX;
                                        }


                                    } else {
                                        // 在画布上拖动
                                        if ((e.pageX < selectUlRect.x + selectUlRect.width && e.pageX > selectUlRect.x) && (e.pageY < selectUlRect.y + selectUlRect.height && e.pageY > selectUlRect.y)) {
                                            moveBoxBool = true;
                                            indexRect = cuUl;
                                        }

                                        if (_y != e.pageY || _x != e.pageY) {

                                            if (_x > moveUl.offsetLeft || _x < moveUl.offsetLeft || _y > moveUl.offsetTop || _y < moveUl.offsetTop) {
                                                moveUl.style.top = e.pageY - 23 + 'px';
                                                moveUl.style.left = e.pageX - 92 + 'px';
                                            }
                                            moveUl.style.top = moveUl.offsetTop - (_y - e.pageY) + 'px';
                                            moveUl.style.left = moveUl.offsetLeft - (_x - e.pageX) + 'px';

                                            if (moveUl.offsetTop < indexRect.offsetTop + 55) {
                                                // 上
                                                moveUl.style.top = indexRect.offsetTop + 55 + 'px';
                                            }
                                            if (moveUl.offsetLeft + moveUl.offsetWidth > indexRect.offsetLeft + indexRect.offsetWidth) {
                                                // 右
                                                moveUl.style.left = indexRect.offsetLeft + indexRect.offsetWidth - moveUl.offsetWidth + 'px';
                                            }
                                            if (moveUl.offsetTop + moveUl.offsetHeight > indexRect.offsetTop + indexRect.offsetHeight + 55) {
                                                // 下
                                                moveUl.style.top = indexRect.offsetTop + indexRect.offsetHeight + 55 - moveUl.offsetHeight + 'px';
                                            }
                                            if (moveUl.offsetLeft < indexRect.offsetLeft) {
                                                // 左
                                                moveUl.style.left = indexRect.offsetLeft + 'px';
                                            }

                                            _x = e.pageX , _y = e.pageY;
                                        }

                                    }


                                }

                            }


                            function subUpEvent(e) {
                                // 组件 mouseup(抬起)

                                var _dataId, eleId, selectUl, selectLi, element, indexUl, indexLi, index;
                                var getIndex = 0;                               //得到当前选择节点 位于 父节点 的位置(index)；
                                var _delEle;                                    //递归删除的对象节点

                                element = e.target;
                                _dataId = ~~element.getAttribute('data-id');
                                selectLi = e.currentTarget;
                                selectUl = selectLi.parentNode;
                                indexUl = selectUl.getAttribute('data-tab');
                                eleId = selectUl.parentNode.id;
                                indexLi = that.subBox_layer_effect_sct_index;

                                getIndex = Index(getChildes(selectUl), selectLi);


                                switch (eleId) {
                                    case 'xk-edit-effect-panel':
                                        // 效果层
                                        // console.log(e.currentTarget.id,element);
                                        // that.eff_select
                                        clickItem(that.eff_select);
                                        typeItem();
                                        break;
                                    case 'xk-edit-sub-panel':
                                        // 组件层
                                        // console.log(e.currentTarget.id,element,indexUl);
                                        if (!that.sub_select[indexUl]) that.sub_select[indexUl] = [];
                                        // that.sub_select
                                        clickItem(that.sub_select[indexUl]);
                                        typeItem();

                                        break;
                                    case 'xk-edit-layer-panel':
                                        // 图层层
                                        index = that.page_currentTarget_select.index;
                                        // that.layer_select
                                        clickItem(that.layer_select);
                                        if (index && !isNaN(indexLi)) {
                                            that.v.initEffect(that.effectPanelBox, _Model.page[index].layerList[indexLi].animal);
                                            typeItem();
                                        }
                                        break;
                                }

                                function clickItem(selectArr) {
                                    // 点击单个 li 相应的显示与数据处理
                                    if (!selectLi) return;

                                    var _currItem, _isCurr = false;
                                    len = selectArr.length;

                                    for (i = 0; i < len; i++) {
                                        _currItem = selectArr[i];
                                        if (selectLi == _currItem.ele) {
                                            _isCurr = true;
                                            break;
                                        }
                                    }

                                    if (isPanelMove) {
                                        // 是在已选 的 目标上 点击
                                        if (isMove) {
                                            selectLi.style.borderBottomColor = '#9d9d9d';
                                            if (!isNaN(currIndex)) {
                                                UlChild[currIndex].style.borderBottomColor = '#9d9d9d';
                                            }
                                            return;
                                        }
                                        if (!(that.ctrl || that.shift || that.ctrl_shift)) {
                                            while (len--) {
                                                if (selectLi == selectArr[len].ele) continue;
                                                _delEle = selectArr[len];
                                                selectArr.splice(len, 1);
                                                that.class_list.push(_delEle);
                                            }


                                        } else {
                                            that.class_list = [];
                                        }
                                    } else {
                                        // 不在已选 的 目标上 点击
                                        if (isMove) {
                                            selectLi.style.borderBottomColor = '#9d9d9d';
                                            if (!isNaN(currIndex)) {
                                                UlChild[currIndex].style.borderBottomColor = '#9d9d9d';
                                            }
                                        }
                                        if (that.ctrl || that.shift || that.ctrl_shift) {
                                            selectArr[len] = {
                                                ele: selectLi,
                                                index: getIndex
                                            };
                                        } else {
                                            while (len--) {
                                                _delEle = selectArr[len];
                                                selectArr.splice(len, 1);
                                                that.class_list.push(_delEle);
                                            }
                                            selectArr[0] = {
                                                ele: selectLi,
                                                index: getIndex
                                            };
                                        }
                                    }
                                    // console.log(getIndex,'返回当前节点位置',selectArr);

                                    XkTool.addClass(selectLi, 'box-bg-blue');
                                    if (that.ctrl || that.shift || that.ctrl_shift) {
                                        // XkTool.addClass(selectLi,'box-bg-blue');
                                    } else {
                                        len = that.class_list.length;
                                        while (len--) {
                                            XkTool.removeClass(that.class_list[len].ele, 'box-bg-blue');
                                            that.class_list.splice(len, 1);
                                        }


                                    }


                                }

                                function typeItem() {
                                    // 处理单个按钮

                                    switch (_dataId) {
                                        // case 302:
                                        //     console.log(_dataId,_Model.config[_dataId]);
                                        //     break;
                                        case 421:
                                            console.log(_dataId, _Model.config[_dataId]);

                                            break;
                                        case 422:
                                            console.log(_dataId, _Model.config[_dataId]);

                                            break;
                                        case 423:
                                            console.log(_dataId, _Model.config[_dataId]);

                                            break;
                                        case 424:
                                            console.log(_dataId, _Model.config[_dataId]);

                                            break;
                                        case 425:
                                            // console.log(id,_Model.config[id]);
                                            var list = getChildes(that.subBox_layer_curr_select_li);
                                            console.log(that.subBox_layer_curr_select_li, 1111);
                                            if (XkTool.hasClass(element, 'xk-edit-right-label-dirbottom')) {
                                                XkTool.removeClass(element, 'xk-edit-right-label-dirbottom');
                                                XkTool.addClass(list[1], 'xk-edit-right-data-none');
                                            } else {
                                                XkTool.addClass(element, 'xk-edit-right-label-dirbottom');
                                                XkTool.removeClass(list[1], 'xk-edit-right-data-none');
                                            }

                                            break;
                                    }

                                }

                                XkTool.removeEvent(e.currentTarget, 'mouseup', subUpEvent);
                            };


                        }


                        XkTool.addEvent(that.subPanelBox, 'mousedown', subDownEvent);
                        XkTool.addEvent(that.layerPanelBox, 'mousedown', subDownEvent);
                        XkTool.addEvent(that.effectPanelBox, 'mousedown', subDownEvent);
                        XkTool.addEvent(that.effectani, 'mousedown', subDownEvent);

                    }


                    function key_Event() {
                        //键盘方法
                        XkTool.addEvent(doc, 'keydown', keydownEvents);
                        XkTool.addEvent(doc, 'keyup', keyupEvents);
                        function keydownEvents(e) {
                            e.preventDefault();
                            if (e.ctrlKey || e.keyCode == 17) {
                                //按下ctrl
                                console.log(e.keyCode, 'ctrl');
                                that.ctrl = true;
                                that.shift = that.alt = that.ctrl_shift = false;
                            }
                            if (e.shiftKey || e.keyCode == 16) {
                                console.log(e.keyCode, 'shift');
                                that.shift = true;
                                that.ctrl = that.alt = that.ctrl_shift = false;
                            }
                            if (e.altKey || e.keyCode == 18) {
                                console.log(e.keyCode, 'alt');
                                that.alt = true;
                                that.ctrl = that.shift = that.ctrl_shift = false;
                            }
                            if ((e.ctrlKey || e.keyCode == 17) && (e.shiftKey || e.keyCode == 16)) {
                                console.log(e.keyCode, 'ctrl + shift');
                                that.ctrl_shift = true;
                                that.ctrl = that.shift = that.alt = false;
                            }
                        }

                        function keyupEvents(e) {
                            e.preventDefault();
                            that.ctrl = that.shift = that.alt = that.ctrl_shift = false;
                        }

                    }


                },
                setEffect: function () {

                },
                setType: function (id, ele) {
                    var that = this;
                    var effect_tab = that.effectPanelBox.getElementsByClassName('xk-edit-left-bottom-body')[0];
                    var layer_tab_li = that.layerPanelBox.getElementsByTagName('li');
                    switch (id) {
                        case 101:
                            console.log(id, _Model.config[id]);
                            console.log(Date.now());
                            break;
                        case 102:
                            console.log(id, _Model.config[id]);

                            break;
                        case 103:
                            console.log(id, _Model.config[id]);

                            break;
                        case 104:
                            console.log(id, _Model.config[id]);

                            break;
                        case 105:
                            console.log(id, _Model.config[id]);

                            break;
                        case 106:
                            console.log(id, _Model.config[id]);

                            break;
                        case 201:
                            console.log(id, _Model.config[id]);
                            var obj_201 = {};
                            obj_201.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_201.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">位置</div>' +
                                        '<p>X: <input type="txt">' +
                                        'Y: <input type="txt"></p>' +
                                        '</li>';
                                    aniclick.addLi(obj_201, effect_tab)
                                }
                            }
                            break;
                        case 202:
                            console.log(id, _Model.config[id]);
                            var obj_202 = {};
                            obj_202.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_202.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">旋转</div>' +
                                        '<p><span>顺时针: <input type="txt"></span>' +
                                        '<span>逆时针: <input type="txt"></span></p>' +
                                        '</li>';
                                    aniclick.addLi(obj_202, effect_tab)
                                }
                            }
                            break;
                        case 203:
                            console.log(id, _Model.config[id]);
                            var obj_203 = {};
                            obj_203.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_203.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">缩放</div>' +
                                        '<p><span>缩放: <input type="txt"></span></p>' +
                                        '</li>';
                                    aniclick.addLi(obj_203, effect_tab)
                                }
                            }
                            break;
                        case 204:
                            console.log(id, _Model.config[id]);
                            var obj_204 = {};
                            obj_204.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_204.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">透明度</div>' +
                                        '<p><span>透明度: <input type="txt"></span></p>' +
                                        '</li>';
                                    aniclick.addLi(obj_204, effect_tab)
                                }
                            }
                            break;
                        case 205:
                            console.log(id, _Model.config[id]);
                            var obj_205 = {};
                            obj_205.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_205.data = '';
                                    aniclick.addLi(obj_205, effect_tab)
                                }
                            }
                            break;
                        case 206:
                            console.log(id, _Model.config[id]);
                            var obj_206 = {};
                            obj_206.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_206.data = '';
                                    aniclick.addLi(obj_206, effect_tab)
                                }
                            }
                            break;
                        case 207:
                            console.log(id, _Model.config[id]);
                            var obj_207 = {};
                            obj_207.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_207.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">方向</div>' +
                                        '<p><select title="方向"><option class="hand">上下</option><option class="hand">左右</option></select></p>' +
                                        '</li>' +
                                        '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">中心点</div>' +
                                        '<p><select title="中心点"><option value="中心">中心</option><option value="左">左</option><option value="右">右</option><option value="上">上</option><option value="下">下</option><option value="左上">左上</option><option value="右上">右上</option><option value="左下">左下</option><option value="右下">右下</option></select></p>' +
                                        '</li>' +
                                        '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">强度</div>' +
                                        '<p><select title="强度"><option value="很弱">很弱</option><option value="弱">弱</option><option value="普通">普通</option><option value="强">强</option><option value="很强">很强</option></select></p>' +
                                        '</li>' +
                                        '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">次数</div>' +
                                        '<p><select title="次数"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="无限">无限</option></select></p>' +
                                        '</li>';
                                    aniclick.addLi(obj_207, effect_tab)
                                }
                            }
                            break;
                        case 208:
                            console.log(id, _Model.config[id]);
                            var obj_208 = {};
                            obj_208.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_208.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">强度</div>' +
                                        '<p><select title="强度"><option value="很弱">很弱</option><option value="弱">弱</option><option value="普通">普通</option><option value="强">强</option><option value="很强">很强</option></select></p>' +
                                        '</li>' +
                                        '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">次数</div>' +
                                        '<p><select title="次数"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="无限">无限</option></select></p>' +
                                        '</li>';
                                    aniclick.addLi(obj_208, effect_tab)
                                }
                            }
                            break;
                        case 209:
                            console.log(id, _Model.config[id]);
                            var obj_209 = {};
                            obj_209.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_209.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">次数</div>' +
                                        '<p><select title="次数"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="无限">无限</option></select></p>' +
                                        '</li>';
                                    ;
                                    aniclick.addLi(obj_209, effect_tab)
                                }
                            }
                            break;
                        case 212:
                            console.log(id, _Model.config[id]);
                            var obj_212 = {};
                            obj_212.name = _Model.config[id].name;
                            for (var i = 0; i < layer_tab_li.length; i++) {
                                if (XkTool.hasClass(layer_tab_li[i], 'box-bg-blue')) {
                                    obj_212.data = '<li class="clearfix1">' +
                                        '<div class="xk-edit-left-tab hand">次数</div>' +
                                        '<p><select title="次数"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="无限">无限</option></select></p>' +
                                        '</li>';
                                    ;
                                    aniclick.addLi(obj_212, effect_tab)
                                }
                            }
                            break;
                        case 221:
                            console.log(id, that.effectPanelBox);
                            var _ul = that.effectPanelBox.firstElementChild
                            var _li = _ul.children;
                            var li_len = _li.length;
                            console.log(_li)
                            for (var i = 0; i < li_len; i++) {
                                if (XkTool.hasClass(_li[i], 'box-bg-blue')) {
                                    console.log(_li[i])
                                    _ul.removeChild(_li[i]);
                                    break;
                                }
                            }
                            break;

                        case 301:
                            console.log(id, _Model.config[id]);
                            // console.log(that.pagePanel,'page 对象');
                            // _Model.page
                            var len = _Model.page.length;
                            console.log(id);
                            _Model.page[len] = {
                                id: len,
                                rect: {
                                    bottom: 656,
                                    height: 540,
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    width: 298.96875,
                                    x: 440.515625,
                                    y: 116
                                },
                                layerList: [
                                    {
                                        layer: 0,
                                        src: '',
                                        name: 0,
                                        rect: {},
                                        animal: [],
                                    },
                                ],
                            };
                            that.v.addPage(_Model.page[len], that.pagePanel);
                            break;
                        case 302:
                            console.log(id, _Model.config[id]);
                            var len = _Model.page.length;
                            that.v.insertPage(that.pagePanel, function (id) {
                                _Model.page.splice(id, 0, {
                                    id: id,
                                    rect: {
                                        bottom: 656,
                                        height: 540,
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        width: 298.96875,
                                        x: 440.515625,
                                        y: 116
                                    },
                                    layerList: [
                                        {
                                            layer: 0,
                                            src: '',
                                            name: 0,
                                            rect: {},
                                            animal: [],
                                        },
                                    ],
                                });
                                for (var i = id + 1; i <= len; i++) {
                                    _Model.page[i].id++;
                                }
                            });
                            break;
                        case 303:
                            //插入背景音乐
                            var wrap = document.createElement('div');
                            var bgmDiv = document.createElement('div');
                            var selectDiv = document.createElement('div');
                            var addDiv = document.createElement('div');
                            var detailDiv = document.createElement('div');
                            var bgmInfo = {
                                name: '',
                                isLoop: '',
                                outFade: '',
                                inFade: '',
                                startPage: '',
                                endPage: '',
                                startPoint: '',
                                endPoint: ''
                            };
                            bgmDiv.classList.add('xk-bgmDiv');
                            selectDiv.classList.add('xk-selectDiv');
                            addDiv.classList.add('xk-addDiv');
                            detailDiv.classList.add('xk-detailDiv');
                            bgmDiv.innerHTML = '<div id="xk-select-bgm" style="float: left;margin-left: 32px"><img class="xk-bgm-img" src="images/1.jpg"><p>选择已有bgm</p></div>' +
                                '<div id="xk-add-bgm"><img class="xk-bgm-img" src="images/1.jpg"><p>上传新的bgm</p></div>';

                            selectDiv.innerHTML = '<span class="xk-insertbgm-back"><返回</span><ul class="xk-bgm-list"></ul>';

                            addDiv.innerHTML = '<span class="xk-insertbgm-back"><返回</span></span><form enctype="multipart/form-data">' +
                                '<input type="file" id="upBgm" accept="audio/*" style="width:200px;;position:relative;left:50px;top: 40px;">' +
                                '</form><input type="button" id="submit" style="position: relative;top: 50px;" value="上传">';

                            detailDiv.innerHTML = '<span class="xk-insertbgm-back"><返回</span></span>' +
                                '<ul class="xk-bgm-info"><li class="bgmName">当前bgm名称:<span></span></li>' +
                                '<li class="bgmLoop">是否循环:<input type="radio" value="true" name="isLoop">是<input type="radio" value="false" name="isLoop" checked>否</li>' +
                                '<li class="inFade">淡入:<select>' +
                                '<option value="0">无</option>' +
                                '<option value="1000">1秒</option>' +
                                '<option value="2000">2秒</option>' +
                                '<option value="3000">3秒</option>' +
                                '</select></li>' +
                                '<li class="outFade">淡出:<select>' +
                                '<option value="0">无</option>' +
                                '<option value="1000">1秒</option>' +
                                '<option value="2000">2秒</option>' +
                                '<option value="3000">3秒</option>' +
                                '</select></li>' +
                                '<li>开始page:<select class="startPage"></select></li>' +
                                '<li>结束page:<select class="endPage"></select></li>' +
                                '<li>在开始page的<select class="startPoint">' +
                                '<option value="0">0%</option>' +
                                '<option value="1">10%</option>' +
                                '<option value="2">20%</option>' +
                                '<option value="3">30%</option>' +
                                '<option value="4">40%</option>' +
                                '<option value="5">50%</option>' +
                                '<option value="6">60%</option>' +
                                '<option value="7">70%</option>' +
                                '<option value="8">80%</option>' +
                                '<option value="9">90%</option>' +
                                '<option value="10">100%</option>' +
                                '</select>开始播放</li>' +
                                '<li>在结束page的<select class="endPoint">' +
                                '<option value="0">0%</option>' +
                                '<option value="1">10%</option>' +
                                '<option value="2">20%</option>' +
                                '<option value="3">30%</option>' +
                                '<option value="4">40%</option>' +
                                '<option value="5">50%</option>' +
                                '<option value="6">60%</option>' +
                                '<option value="7">70%</option>' +
                                '<option value="8">80%</option>' +
                                '<option value="9">90%</option>' +
                                '<option value="10">100%</option>' +
                                '</select>结束播放' +
                                '</li></ul>';
                            wrap.appendChild(bgmDiv);
                            wrap.appendChild(selectDiv);
                            wrap.appendChild(addDiv);
                            wrap.appendChild(detailDiv);
                            var obj = {
                                type: 'node',
                                value: wrap,
                                name: '插入背景音乐',
                                fn: function () {
                                    var isLoopList = document.querySelectorAll('.bgmLoop input');
                                    for (var i = 0; i < isLoopList.length; i++) {
                                        if (isLoopList[i].checked) {
                                            bgmInfo.isLoop = isLoopList[i].value;
                                        }
                                    }
                                    bgmInfo.name = document.querySelector('.bgmName span').innerHTML;
                                    bgmInfo.inFade = document.querySelector('.inFade select').value;
                                    bgmInfo.outFade = document.querySelector('.outFade select').value;
                                    bgmInfo.startPage = document.querySelector('.startPage').value;
                                    bgmInfo.endPage = document.querySelector('.endPage').value;
                                    bgmInfo.startPoint = document.querySelector('.startPoint').value;
                                    bgmInfo.endPoint = document.querySelector('.endPoint').value;
                                    for (var key in bgmInfo) {
                                        if (bgmInfo[key] === '') {
                                            alert('请上传后再确定!');
                                            return;
                                        }
                                    }
                                    console.log(bgmInfo);
                                }
                            };
                            that.v.alertWindow(obj);
                            var img1 = document.querySelector('#xk-select-bgm img'),
                                img2 = document.querySelector('#xk-add-bgm img'),
                                back = document.querySelectorAll('.xk-insertbgm-back'),
                                bgmList = document.querySelector('.xk-bgm-list'),
                                submit = document.querySelector('#submit');
                            img1.onclick = function () {
                                console.log(_Model.musicList);
                                XkTool.setStyle(bgmDiv, {'display': 'none'});
                                XkTool.setStyle(selectDiv, {'display': 'block'});
                                var bgmTotal = _Model.musicList.length;
                                var str = '';
                                for (var i = 0; i < bgmTotal; i++) {
                                    str += '<li>' + _Model.musicList[i].name + '</li>'
                                }
                                bgmList.innerHTML = str;
                            };
                            img2.onclick = function () {
                                XkTool.setStyle(bgmDiv, {'display': 'none'});
                                XkTool.setStyle(addDiv, {'display': 'block'});
                            };
                            back[0].onclick = back[1].onclick = function () {
                                XkTool.setStyle(bgmDiv, {'display': 'block'});
                                XkTool.setStyle(selectDiv, {'display': 'none'});
                                XkTool.setStyle(addDiv, {'display': 'none'});
                            };
                            back[2].onclick = function () {
                                XkTool.setStyle(detailDiv, {'display': 'none'});
                                XkTool.setStyle(selectDiv, {'display': 'block'});
                            };
                            bgmList.onclick = function (e) {
                                XkTool.setStyle(selectDiv, {'display': 'none'});
                                XkTool.setStyle(detailDiv, {'display': 'block'});
                                document.querySelector('.bgmName span').innerHTML = e.target.innerHTML;
                                var l = _Model.page.length, str = '',
                                    startPage = document.querySelector('.startPage'),
                                    endPage = document.querySelector('.endPage');
                                for (var i = 1; i <= l; i++) {
                                    str += '<option value="' + i + '">' + i + '</option>';
                                }
                                startPage.innerHTML = str;
                                endPage.innerHTML = str;
                            };

                            submit.onclick = function () {
                                var upFile = document.querySelector('#upBgm').files[0];
                                var reader = new FileReader();
                                var base64Str = reader.readAsDataURL(upFile);
                                var bgmData = {};
                                reader.onload = function () {
                                    bgmData.fileData = reader.result;
                                    bgmData.fileName = upFile.name;
                                    bgmData.fileType = upFile.type;
                                    bgmData.comicName = '画诡5';
                                    bgmData.uuid = 'bda67ce4-31b1-40d9-8d65-2a8cfe468956';
                                    $.ajax({
                                        type: 'post',
                                        url: '/newBgm',
                                        datatype: 'json',
                                        data: bgmData,
                                        success: function (res) {
                                            console.log(res);
                                            if (res.status) {
                                                document.querySelector('body').removeChild(document.querySelector('#alertWindow'));
                                                document.querySelector('body').removeChild(document.querySelector('#opac'));
                                            }
                                        }
                                    })
                                };

                            };
                            //todo 111
                            break;
                        case 305:
                            console.log(id, _Model.config[id]);

                            break;
                        case 311:
                            console.log(id, _Model.config[id]);

                            break;
                        case 312:
                            console.log(id, _Model.config[id]);

                            break;
                        case 313:
                            var arr = [];
                            // console.log(_Model.page);
                            var first = that.pagePanel.firstElementChild;
                            var list = first.childNodes;
                            // var list = ele.parentNode.parentNode.parentNode.parentNode.childNodes;
                            for (var i in list) {
                                if (list[i].nodeType === 1) {
                                    arr[arr.length] = list[i];
                                }
                            }

                            var slt = {};
                            for (var j = 0; j < arr.length; j++) {
                                if (ele.parentNode.parentNode.parentNode == arr[j]) {
                                    var m = 0, len, id;
                                    //后面完善
                                    first.removeChild(arr[j]);
                                    for (m = 0, len = that.page_select.length; m < len; m++) {
                                        slt = that.page_select[m];
                                        if (slt.ele == arr[j]) {
                                            that.page_select.splice(m, 1);
                                            // return;
                                        }
                                    }
                                    that.page_currentTarget_select.ele.style.zIndex = 0;
                                    that.page_currentTarget_select = {};


                                    m = j + 1;
                                    for (m, len = _Model.page.length; m < len; m++) {
                                        id = ~~_Model.page[m].id - 1;
                                        _Model.page[m].id = id;
                                        arr[m].firstElementChild.firstElementChild.innerHTML = 'page-' + (id + 1);
                                        console.log(len, arr[m].firstElementChild.firstElementChild, _Model.page[m].id);
                                    }
                                    _Model.page.splice(j, 1);
                                    return;
                                }
                            }
                            // console.log(id,ele.parentNode.parentNode.parentNode.parentNode.childNodes,ele.parentNode.parentNode.nextSibling);
                            break;

                        case 401:
                            // console.log(id,_Model.config[id]);

                            break;
                        case 402:
                            // console.log(id,_Model.config[id]);

                            break;

                        //新增组件事件
                        case 403:
                            var uploadForm = document.createElement('form');
                            var panel = document.querySelector('#xk-edit-sub-panel');
                            var panelChild = panel.children, panelLen = panelChild.length;
                            var fileType;
                            for (var i = 0; i < panelLen; i++) {
                                if (panelChild[i].style.display === 'block') {
                                    if (i === 0) {
                                        fileType = 'image/*'
                                    } else if (i === 1) {
                                        fileType = 'audio/*'
                                    }
                                }
                            }
                            uploadForm.enctype = 'multipart/form-data';
                            uploadForm.style.cssText = 'width:300px;height:110px;z-index:9999;';
                            uploadForm.innerHTML = '<input type="file" id="upFile" accept="' + fileType + '" style="width:200px;;position:relative;left:50px;top: 40px;">'
                            var obj = {
                                type: 'node',
                                value: uploadForm,
                                name: '上传组件',
                                fn: function () {
                                    var datas = {};
                                    //限制大小2M以下
                                    var allowSize = 2100000;
                                    var files = document.querySelector('#upFile').files[0];
                                    var reader = new FileReader();
                                    var fileBase64 = reader.readAsDataURL(files);
                                    reader.onload = function () {
                                        if (allowSize !== 0 && allowSize < reader.result.length) {
                                            alert('上传失败，请选择小于2M的组件');
                                            return;
                                        } else {
                                            datas.fileSize = Math.floor(reader.result.length / 1048) + 'KB';
                                            datas.fileData = reader.result;
                                            datas.fileType = fileType;
                                            datas.fileName = files.name;
                                            //todo 当前用户的uuid与当前漫画名称需要获取，暂时手动设置
                                            datas.comicName = '画诡5';
                                            datas.uuid = 'bda67ce4-31b1-40d9-8d65-2a8cfe468956';
                                            console.log(datas);
                                            $.ajax({
                                                type: 'post',
                                                url: '/newTools',
                                                datatype: 'json',
                                                data: datas,
                                                success: function (res) {
                                                    if (res.status) {
                                                        var list = {};
                                                        var subNameList;
                                                        var content = document.querySelector('#xk-edit-sub-panel').children;
                                                        if (datas.fileType === 'image/*') {
                                                            list.citeAdd = [];
                                                            list.height = res.imgH + 'px';
                                                            list.width = res.imgW + 'px';
                                                            list.id = 11111 + _Model.imgList.length;
                                                            list.name = datas.fileName;
                                                            list.size = datas.fileSize;
                                                            list.src = res.url;
                                                            list.tab = 0;
                                                            list.type = 'image';
                                                            _Model.imgList.push(list);
                                                            //图片组件
                                                            subNameList = '<li data-id="' + list.id + '"><div class="xk-edit-right-top">' +
                                                                '<span data-id="422" class="xk-edit-right-label xk-edit-right-img"> </span>' +
                                                                '<span data-id="423" class="xk-edit-right-label ">' + list.name + '</span>' +
                                                                '<span data-id="425" class="xk-edit-right-label xk-edit-right-label-dir"></span></div>' +
                                                                ' <div class="xk-edit-right-data xk-edit-right-data-none">' +
                                                                '<p><span>W:<i>' + list.width + '</i></span><span class="">H:<i>' + list.height + '</i></span></p>' +
                                                                '<p><span>类型：<i>' + list.src.split('.')[1] + '</i></span><span class="">大小:<i>' + list.size + '</i></span></p>' +
                                                                '</div></li>';
                                                            content[list.tab].innerHTML += subNameList;
                                                        } else if (datas.fileType === 'audio/*') {
                                                            list.citeAdd = [];
                                                            list.id = 21111 + _Model.imgList.length;
                                                            list.name = datas.fileName;
                                                            list.size = datas.fileSize;
                                                            list.src = res.url;
                                                            list.tab = 1;
                                                            list.type = 'music';
                                                            var audio = document.createElement('audio');
                                                            audio.innerHTML = '<source src=' + '\"' + res.url + '\"' + '>';
                                                            audio.muted = true;
                                                            audio.play();
                                                            audio.oncanplay = function () {
                                                                list.duration = audio.duration;
                                                                _Model.musicList.push(list);
                                                                //音效组件
                                                                subNameList = '<li data-id="' + list.id + '"><div class="xk-edit-right-top">' +
                                                                    '<span data-id="422" class="xk-edit-right-label xk-edit-right-img"></span>' +
                                                                    '<span data-id="423" class="xk-edit-right-label">' + list.name + '</span>' +
                                                                    '<span data-id="425" class="xk-edit-right-label xk-edit-right-label-dir xk-edit-right-label-dir"></span></div>' +
                                                                    '<div class="xk-edit-right-data xk-edit-right-data-none">' +
                                                                    '<p><span>类型：<i>' + list.src.split('.')[1] + '</i></span><span class="">大小:<i>' + list.size + '</i></span></p>' +
                                                                    '<p><span>时长：<i>' + list.duration.toFixed(2) + '秒' + '</i></span></p>' +
                                                                    '</div></li>';
                                                                content[list.tab].innerHTML += subNameList;
                                                            };
                                                        }

                                                    } else {
                                                        alert('组件已存在!');
                                                    }
                                                }
                                            });
                                            var tbody = document.querySelector('body');
                                            tbody.removeChild(document.querySelector('#alertWindow'));
                                            tbody.removeChild(document.querySelector('#opac'));
                                        }
                                    }
                                }
                            };
                            that.v.alertWindow(obj);
                            break;

                        case 404:
                            //还需要同步移除页面上的组件以及Model里面的组件
                            var show_panel = getChildes(that.subPanelBox)[that.sub_show_id];
                            var data = that.sub_select[that.sub_show_id], len = data.length;
                            while (len--) {
                                show_panel.removeChild(data[len].ele);
                                data.splice(len, 1);
                            }

                            break;
                        case 406:
                            //判断page是否有选中的，没有的话直接返回。
                            if (JSON.stringify(that.page_currentTarget_select) === '{}')
                                return;
                            var data = that.layer_select, len = data.length;
                            if (len <= 0) return;
                            var show_panel = that.layerPanelBox.firstElementChild;
                            var show_list = getChildes(show_panel), panel_len, index = 0, i = 0;
                            while (len--) {
                                for (i = 0, panel_len = show_list.length; i < panel_len; i++) {
                                    if (data[len].ele == show_list[i]) {
                                        index = i;
                                        break;
                                    }
                                }
                                _Model.page[that.page_currentTarget_select.index].layerList.splice(index, 1);
                                show_panel.removeChild(data[len].ele);
                                data.splice(len, 1);
                            }
                            break;

                    }
                },
                //进度条的拖动事件
                setProg: function (id, ele) {
                    switch (id) {
                        case 304:
                            var nodeUl = document.getElementById('xk-edit-center-edit').firstElementChild;
                            var lis = nodeUl.children;
                            var sty = getComputedStyle(nodeUl);
                            //   var
                            var percent = (~~ele.value * 0.4 + 30) / (this.v.preValue * 0.4 + 30);
                            // console.log(percent);
                            var setHeight = sty.height.split('p')[0] * percent;
                            var setWidth = sty.width.split('p')[0] * percent;
                            var padLR = (1 - (~~ele.value / 100 * 0.4 + 0.3)) * 50;
                            XkTool.setStyle(nodeUl, {
                                width: setWidth + 'px',
                                height: setHeight + 'px',
                                "padding-left": padLR + '%',
                                "padding-right": padLR + '%'
                            });
                            this.setChildrenStyle(nodeUl, percent);
                            this.v.preValue = ~~ele.value;
                            break;
                    }
                },
                changeName: function (e, cb) {
                    e.innerHTML = '<input type="text" id="tempInput" value="' + e.innerHTML + '" style="border: none;width: 100px">';
                    e.onkeydown = function (ev) {
                        if (ev.keyCode == 13) {
                            e.firstElementChild.removeEventListener('blur', setVal);
                            e.innerHTML = document.getElementById('tempInput').value;
                            cb(e.innerHTML, ~~e.parentNode.parentNode.getAttribute('data-id'));
                        }
                    };
                    e.firstElementChild.addEventListener('blur', setVal);
                    function setVal() {
                        e.innerHTML = document.getElementById('tempInput').value;
                        cb(e.innerHTML, ~~e.parentNode.parentNode.getAttribute('data-id'));
                    }
                },
                //遍历设置子节点属性
                setChildrenStyle: function (node, p) {
                    if (node.children.length !== 0) {
                        var len = node.children.length;
                        for (var i = 0; i < len; i++) {
                            var curNode = node.children[i];
                            if (curNode.tagName !== 'P') {
                                var curStyle = getComputedStyle(curNode);
                                var finalSty = {
                                    width: curStyle.width.split('p')[0] * p + 'px',
                                    height: curStyle.height.split('p')[0] * p + 'px'
                                };
                                // console.log(curNode.tagName,curStyle.width, curStyle.height);
                                // console.log(curNode.tagName,finalSty);
                                XkTool.setStyle(curNode, finalSty);
                                this.setChildrenStyle(curNode, p);
                            }
                        }
                    }
                }
            };


            function init() {
                // _Model.subList[0] = [];
                // _Model.subList[1] = [];
                // _Model.subList[0][0] = {
                //     id: 0,
                //     name: '动效组件',
                //     list: {
                //         name: '草泥马',
                //         src: '',
                //         type: 'JPG',
                //         size: '200kb',
                //         height: '200px',
                //         width: '200px'
                //     }
                // };
                // _Model.subList[1][0] = {
                //     id: 1,
                //     name: '音效组件',
                //     list: {
                //         name: '草泥马',
                //         src: '',
                //         type: 'mp3',
                //         size: '200kb',
                //         duration: '3',
                //     }
                // };
                _Model.imgList.push({
                    id: 11111,
                    tab: 0,
                    type: 'image',
                    name: '草泥马',
                    src: 'images/LZS1-18-mama.png',
                    size: '200kb',
                    width: '200px',
                    height: '200px',
                    citeAdd: [],

                });

                // 组件的被引用情况数组结构
                // citeAdd[{
                //     index: 0,        //page的索引
                //     ele: node,       //组件承载的节点
                // }]

                //_Model.imgList
                //_Model.musicList
                _Model.imgList.push({
                    id: 11112,
                    tab: 0,
                    type: 'image',
                    name: '草泥马',
                    src: 'images/LZS1-42-nvzhu.png',
                    size: '200kb',
                    width: '200px',
                    height: '200px',
                    citeAdd: [],
                });

                _Model.musicList.push({
                    id: 21111,
                    tab: 1,
                    type: 'music',
                    name: '草泥马',
                    src: '草泥马.mp3',
                    size: '200kb',
                    duration: 3,
                    citeAdd: [],
                });

                _Model.musicList.push({
                    id: 21112,
                    tab: 1,
                    type: 'music',
                    name: '测试mp3',
                    src: '测试mp3.m4a',
                    size: '200kb',
                    duration: 3,
                    citeAdd: [],
                });
                _Model.page[0] = {
                    id: 0,
                    rect: {
                        bottom: 656,
                        height: 540,
                        left: 0,
                        right: 0,
                        top: 0,
                        width: 298,
                        x: 440,
                        y: 116
                    },
                    layerList: [            //图层列表
                        {
                            subId: 0,
                            layer: 0,
                            src: 'images/warning.jpg',
                            name: 0,
                            rect: {
                                bottom: 656,
                                height: 540,
                                left: 0,
                                right: 739,
                                top: 0,
                                width: 298,
                                x: 440,
                                y: 116
                            },
                            animal: [1],
                        },
                        {
                            subId: 0,
                            layer: 1,
                            src: 'images/warning.jpg',
                            name: 1,
                            rect: {
                                bottom: 656,
                                height: 540,
                                left: 0,
                                right: 739,
                                top: 0,
                                width: 298,
                                x: 440,
                                y: 116
                            },
                            animal: [2],
                        },
                    ],
                };
                _Model.page[1] = {
                    id: 1,
                    rect: {
                        bottom: 656,
                        height: 3000,
                        left: 0,
                        right: 0,
                        top: 0,
                        width: 298,
                        x: 440,
                        y: 116
                    },
                    layerList: [
                        {
                            subId: 0,
                            layer: 0,
                            src: 'images/xx3-01-bg.jpg',
                            name: 1,
                            rect: {
                                bottom: 656,
                                height: 3000,
                                left: 0,
                                right: 739,
                                top: 0,
                                width: 298,
                                x: 440,
                                y: 116
                            },
                            animal: [],
                            onelevel: true,
                        },
                    ],
                };
                _Model.page[2] = {
                    id: 2,
                    rect: {
                        bottom: 656,
                        height: 1051,
                        left: 0,
                        right: 0,
                        top: 0,
                        width: 298,
                        x: 440,
                        y: 116
                    },
                    layerList: [
                        {
                            subId: 0,
                            layer: 0,
                            src: 'images/xx3-12-bg.jpg',
                            name: 2,
                            rect: {
                                bottom: 656,
                                height: 1051,
                                left: 0,
                                right: 739,
                                top: 0,
                                width: 298,
                                x: 440,
                                y: 116
                            },
                            animal: [],
                            onelevel: true,
                        },
                        {
                            subId: 0,
                            layer: 0,
                            src: 'images/xx3-12-biyan.png',
                            name: 2,
                            rect: {
                                bottom: 656,
                                height: 1051,
                                left: 0,
                                right: 0,
                                top: 0,
                                width: 298,
                                x: 440,
                                y: 116
                            },
                            animal: [],
                            onelevel: true,
                        },
                    ],
                };
                _Model.page[3] = {
                    id: 3,
                    rect: {
                        bottom: 656,
                        height: 540,
                        left: 0,
                        right: 0,
                        top: 0,
                        width: 298,
                        x: 440,
                        y: 116
                    },
                    layerList: [
                        {
                            subId: 0,
                            layer: 0,
                            src: '',
                            name: 0,
                            rect: {},
                            animal: [],
                            onelevel: true,
                        },
                    ],
                };
                _Model.page[4] = {
                    id: 4,
                    rect: {
                        bottom: 656,
                        height: 540,
                        left: 0,
                        right: 0,
                        top: 0,
                        width: 298,
                        x: 440,
                        y: 116
                    },
                    layerList: [
                        {
                            subId: 0,
                            layer: 0,
                            src: '',
                            name: 0,
                            rect: {},
                            animal: [],
                            onelevel: true,
                        },
                    ],
                };
                var v = new _View({page: _Model.page, musicList: _Model.musicList, imgList: _Model.imgList});
                var c = new _Controller({name: 'zfc'}, v);
                XkTool.addEvent(window, 'mousedown', function (e) {
                    // e.preventDefault(); 会影响双击修改名称

                }, true);
                XkTool.addEvent(window, 'mouseup', function (e) {
                    e.preventDefault();
                    var _dataId = e.target.getAttribute('data-id');
                    if (_dataId) {
                        c.setType(~~_dataId, e.target);
                    } else {

                    }
                }, true);

                XkTool.addEvent(window, 'input', function (e) {
                    e.preventDefault();
                    var _dataId = e.target.getAttribute('data-id');
                    //进度条滚动的id需要加到数组中
                    var progressGroup = [304, 666, 999];
                    var len = progressGroup.length;
                    while (len--) {
                        if (~~_dataId === progressGroup[len]) {
                            c.setProg(~~_dataId, e.target);
                        }
                    }
                }, true);
                //双击事件 主要用于双击改名，后期可扩展
                XkTool.addEvent(window, 'dblclick', function (e) {
                    var _dataId = e.target.getAttribute('data-id');
                    if (_dataId == 423) {
                        c.changeName(e.target, function (val, id) {
                            if (id.toString().split('')[0] == 1) {
                                _Model.imgList.forEach(function (el, index) {
                                    if (el.id === id) {
                                        el.name = val;
                                    }
                                })
                            } else {
                                _Model.musicList.forEach(function (el, index) {
                                    if (el.id === id) {
                                        el.name = val;
                                    }
                                })
                            }

                        });
                    }
                })

            }

            init();

            /*XkTool.addEvent(document,'readystatechange',initDoc);

             function initDoc(e) {
             console.log('渲染完成');
             }*/


            XkTool.addEvent(window, 'resize', function (e) {
                console.log(document.documentElement.offsetWidth, Show.name);
            });


            //动效Tab
            var aniclick = {
                siblings: function (elm) {//获取兄弟元素
                    var a = [];
                    var p = elm.parentNode.children;
                    for (var i = 0, pl = p.length; i < pl; i++) {
                        if (p[i] !== elm) a.push(p[i]);
                    }
                    return a;
                },
                onfor: function (elm, elm2) {
                    for (var i = 0; i < elm.length - 1; i++) {
                        (function (i) {
                            var elm_attr = elm[i].innerText;
                            elm[i].onclick = function () {
                                var str = aniclick.addTab(elm_attr);
                                var li = document.createElement('li');
                                var elm2_child = elm2.children;
                                if (elm2_child.length == 0) {
                                    li.innerHTML = str;
                                    li.setAttribute('name', elm_attr)
                                    elm2.appendChild(li);
                                } else {
                                    var elm2_attr = [];
                                    for (var j = 0; j < elm2_child.length; j++) {
                                        elm2_attr.push(elm2_child[j].getAttribute('name'));
                                    }
                                    if (elm2_attr.indexOf(elm_attr) == -1) {
                                        li.setAttribute('name', elm_attr);
                                        li.innerHTML = str;
                                        elm2.appendChild(li);
                                    }
                                }
                            }
                        })(i)
                    }
                },
                addLi: function (obj, obj2) {//添加动效具体模块
                    var li = document.createElement('li');
                    var elm2 = obj2,
                        elm = obj;
                    var str = aniclick.addTab(elm)
                    var elm2_child = elm2.children;
                    if (elm2_child.length == 0) {
                        li.innerHTML = str;
                        li.setAttribute('name', elm.name);
                        elm2.appendChild(li);
                    } else {
                        var elm2_attr = [];
                        for (var j = 0; j < elm2_child.length; j++) {
                            elm2_attr.push(elm2_child[j].getAttribute('name'));
                        }
                        ;
                        if (elm2_attr.indexOf(elm.name) == -1) {
                            li.setAttribute('name', elm.name);
                            li.innerHTML = str;
                            elm2.appendChild(li);
                        }
                    }
                },
                double_click: function (obj) {
                    var a = aniclick.getstyle(obj, 'display');
                    if (a == 'none') {
                        obj.style.display = 'block'
                    } else if (obj.style.display == "block") {
                        obj.style.display = 'none'
                    }
                },
                getstyle: function (obj, cssproperty, csspropertyNS) {//提取外联css属性兼容
                    if (obj.style[cssproperty]) {
                        return obj.style[cssproperty];
                    }
                    if (obj.currentStyle) {// IE5+
                        return obj.currentStyle[cssproperty];
                    } else if (document.defaultView.getComputedStyle(obj, null)) {// FF/Mozilla
                        var currentStyle = document.defaultView.getComputedStyle(obj, null);
                        var value = currentStyle.getPropertyValue(csspropertyNS);
                        if (!value) {//try this method
                            value = currentStyle[cssproperty];
                        }
                        return value;
                    } else if (window.getComputedStyle) {// NS6+
                        var currentStyle = window.getComputedStyle(obj, "");
                        return currentStyle.getPropertyValue(csspropertyNS);
                    }
                },
                Rangesider: function (obj, obj1) {
                    var range = obj;//滑块对象
                    var pross = obj1;//滑块关联对象
                    range.addEventListener('input', function () {
                        range.previousSibling.firstChild.value = '自定义';
                        range.parentNode.nextSibling.lastChild.firstChild.value = '无';
                        range.setAttribute('value', this.value);
                        pross.setAttribute('value', this.value);
                        range.style.background = 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)';
                    }, false);

                },
                Choice: function (obj, objs, obj3) {//具体动效交互
                    var obj_title = obj.title || null;
                    var obj2 = objs || null;
                    switch (obj_title) {
                        case '触发点':
                            console.log(obj_title)
                            XkTool.addEvent(obj, 'change', function (e) {
                                if (obj.value === '上个动效结束后') {
                                    var ele = e.target || e.srcElement;
                                    var ele_val = ele.parentNode.parentNode.parentNode.parentNode.previousSibling;
                                    var next_obj = ele.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling;
                                    var previous_obj = next_obj.childNodes[1];
                                    var pre_val = previous_obj != null ? previous_obj.value : null;
                                    if (pre_val + ele_val.value >= 100) {
                                        console.log(previous_obj.value + ele_val.value)
                                    }
                                }
                            })
                            break;
                        case '速度':
                            var relevant_obj = {};
                            relevant_obj.delay = obj.parentNode.parentNode.nextSibling.lastChild.firstChild;
                            relevant_obj.speed = obj.parentNode.nextSibling;
                            relevant_obj.delay.value = '无';
                            obj.addEventListener('change', function () {
                                relevant_obj.speed.value = 0;
                                relevant_obj.speed.setAttribute('value', 0);
                                relevant_obj.speed.style.background = 'linear-gradient(to right, #059CFA, white 0%, white)';
                                if (obj.value === '很慢') {
                                    obj2.setAttribute('value', 100);
                                }
                                ;
                                if (obj.value === '慢') {
                                    obj2.setAttribute('value', 80);
                                }
                                ;
                                if (obj.value === '普通') {
                                    obj2.setAttribute('value', 60);
                                }
                                ;
                                if (obj.value === '快') {
                                    obj2.setAttribute('value', 40);
                                }
                                ;
                                if (obj.value === '很快') {
                                    obj2.setAttribute('value', 20);
                                }
                                ;
                            }, false);
                            break;
                        case '延迟':
                            var old_val = obj3.value;
                            if (old_val === '很慢') {
                                old_val = 100;
                            }
                            ;
                            if (old_val === '慢') {
                                old_val = 80;
                            }
                            ;
                            if (old_val === '普通') {
                                old_val = 60;
                            }
                            ;
                            if (old_val === '快') {
                                old_val = 40;
                            }
                            ;
                            if (old_val === '很快') {
                                old_val = 20;
                            }
                            ;
                            if (old_val === '自定义') {
                                old_val = obj3.parentNode.nextSibling;
                                old_val = Number(old_val.value);
                            }
                            ;
                            obj.addEventListener('change', function () {
                                if (obj.value === '无') {
                                    obj2.setAttribute('value', old_val);
                                }
                                ;
                                if (obj.value === '很少') {
                                    obj2.setAttribute('value', old_val + 5);
                                }
                                ;
                                if (obj.value === '少') {
                                    obj2.setAttribute('value', old_val + 10);
                                }
                                ;
                                if (obj.value === '普通') {
                                    obj2.setAttribute('value', old_val + 20);
                                }
                                ;
                                if (obj.value === '很多') {
                                    obj2.setAttribute('value', old_val + 60);
                                }
                                ;
                                if (obj.value === '多') {
                                    obj2.setAttribute('value', old_val + 40);
                                }
                                ;
                            }, false);
                            break;
                    }
                },
                addTab: function (data) {//添加具体动效选项
                    var str = '<p class="noselect"><span class="hand">动效说明</span><span class="float_right hand">' + data.name + '</span></p>' +
                        '<progress value="60" max="100"></progress>' +
                        '<div class="xk-edit-left-body-box">' +
                        '<ul class="clearfix1">' +
                        '<li class="clearfix1">' +
                        '<div class="xk-edit-left-tab hand">触发点</div>' +
                        '<p><select title="触发点"><option value="图层出现时">图层出现时</option><option value="Page出现时">Page出现时</option><option value="与上一个动效一起">与上一个动效一起</option><option value="上个动效结束后">上个动效结束后</option></select></p>' +
                        '</li>' +
                        '<li class="clearfix1">' +
                        '<div class="xk-edit-left-tab hand">速度</div>' +
                        '<p><select title="速度"><option class="hand">很慢</option><option value="慢">慢</option><option selected value="普通">普通</option><option value="快">快</option><option value="很快">很快</option><option value="自定义">自定义</option></select></p><input type="range" value="0" max="100" min="0" step="1">' +
                        '</li>' +
                        '<li class="clearfix1">' +
                        '<div class="xk-edit-left-tab hand">延迟</div>' +
                        '<p><select title="延迟"><option selected value="无">无</option><option value="很少">很少</option><option value="少">少</option><option value="普通">普通</option><option value="多">多</option><option value="很多">很多</option></select></p>' +
                        '</li>' + data.data +
                        '</ul>' +
                        '</div>';
                    return str;
                }
            };
            /*end*/
        });

    })
});
