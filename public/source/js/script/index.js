require(['config'], function () {
    require(['Utils', 'Show'], function (Utils, Show) {

        // 获取服务器数据，之前做好的内容
        var serverData = [];
        
        // tab组件
        // 供控制器调用
        function Tab_tools(name,list,panelCon) {
            var that = this;
            that.name = name;
            var i=0,len;
            var doc =document;
            console.log(list[0]);
            for(i in list){
                that.tabBox[i] = list[i];
                var panel = doc.createElement('ul');
                panel.setAttribute('data-tab',i);
                // panel.innerHTML =~~i + 1;
                panel.innerHTML ='<li>'+ i +'</li>';
                that.panelBox[i] = panel;
                panel.style.display = 'none';
                if(i==0)panel.style.display = 'block';
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
                Utils.addEvent(that.tabBox[0].parentNode,'click',function (e) {
                    var len = that.tabBox.length;
                    while(len--){
                        if(e.target == that.tabBox[len]){
                            that.setShow(len);
                        }
                    }
                })
                
            },
            setShow: function (index) {
                var that = this;
                if(that.selectIndex == index) return;
                Utils.removeClass(that.tabBox[that.selectIndex],'opacity-show');
                that.tabBox[that.selectIndex].style.opacity = 0.7;
                that.panelBox[that.selectIndex].style.display = 'none';
                that.selectIndex = index;
                that.tabBox[that.selectIndex].style.opacity = 1;
                that.panelBox[that.selectIndex].style.display = 'block';
                console.log(index)
            }
        };

        function getChildes(parent) {
            // 返回合法节点
            var list = [];
            var child = parent.childNodes;
            for(var i in child){
                if(child[i].nodeType == 1){
                    list[list.length] = child[i];
                }
            }
            return list;
        }

        // Utils.addEvent(window, 'mouseup', function (e) {
        //     Utils.addClass(e.target, 'add-border');
        //     // console.log(e.target,e.currentTarget,e.target.parentNode,Utils.getRect(e.target));
        //     // console.log(Show.name, Show.getName());
        //     console.log(e.target.getAttribute('data-id'));
        // }, false);

        // var lll = document.getElementById('xk-edit-center-edit');
        //
        // // lll[0].getBoundingClientRect().top;
        // var llli = lll.firstElementChild.childNodes;
        // Utils.addEvent(lll.firstElementChild,'mouseup',function (e) {
        //     // console.log(e.currentTarget,e.target,lll.contains(e.target),llli);
        //     for(var i in llli){
        //         if(llli[i].nodeType===1 && llli[i].contains(e.target)){
        //             console.log(i,llli[i])
        //         }
        //     }
        // });

        var _View = function (o) {
            var that = this;
            that.init(o);
        };

        _View.prototype = {
            constructor: _View,
            _isInit: false,
            init: function (o) {
                var that = this;
                var page = o.page;
                var subList = o.subList;
                if(that._isInit) return;
                var i=0, j=0, len=0, nodeString='', layerItem={}, id;
                var doc = document;
                var pageEdit = doc.getElementById('xk-edit-center-edit');
                var subEdit_img = doc.getElementById('xk-edit-sub-edit-img');
                var subEdit_musci = doc.getElementById('xk-edit-sub-edit-music');
                var subEdit_panel = doc.getElementById('xk-edit-sub-panel');

                // 组件按钮初始化
                // subEdit_panel.innerHTML = '';

                // subEdit = new Tab_tools('组件1',{0:subEdit_img,1:subEdit_musci},subEdit_panel);

                if(page && typeof page !== undefined && typeof page ==='object'){
                    // 初始化page
                    for(i in page){
                        id = ~~page[i].id + 1;
                        nodeString += '<li style="z-index: '+ i*10 + '"><p class="noselect"><span class="float_left">page-'+ id +
                            '</span> <span class="float_right"><span class="hand" data-id="311">高度设置</span><span class="hand" data-id="312">设置背景图</span><span class="hand" data-id="313">删除</span></span></p>';
                        // console.log(page[i].rect);
                        var style = '',sty,rect;
                        rect = page[i].rect;
                        for(sty in rect){
                            style += sty + ': '+ rect[sty] +'px; ';
                            // console.log(sty,layerItem.rect[sty])
                        }
                        nodeString += '<div class="xk-edit-center-page-page" style="'+ style +'">';
                        for(j=0,len=page[i].layerList.length;j<len;j++){
                            layerItem = page[i].layerList[j];
                            style = '';
                            for(sty in layerItem.rect){
                                style += sty + ': '+ layerItem.rect[sty] +'px; ';
                                // console.log(sty,layerItem.rect[sty])
                            }

                            nodeString += '<img src=" ' + layerItem.src + '"' + 'style="' + style + '"' +' >';
                        }

                        nodeString += '</div></li>';
                    }
                    pageEdit.firstElementChild.innerHTML = nodeString;
                };


                if(subList && typeof subList !== undefined && typeof subList ==='object'){
                    // 初始化组件
                    i=0;

                    // 存储组件的字符串， 组件tab标签列表
                    var subNameList = {},  subPanelChild ={};
                    var childLen, tabId, subItem, subItemTab;
                    subPanelChild = getChildes(subEdit_panel);

                    // 生成存储字符串的对象列
                    for(i=0,childLen=subPanelChild.length; i<childLen; i++){
                        tabId = subPanelChild[i].getAttribute('data-tab');
                        subNameList[tabId] = '';
                    }

                    // console.log(subList);
                    i=0;
                    for(i in subList){

                        subItem = subList[i];
                        subItemTab = subItem.tab;

                        console.log(subItemTab,subList[i]);
                        switch(subItemTab){
                            case 0:
                                // 图片tab
                                // 方法 返回拼接 的 li 标签及其内容
                                // subNameList[subItemTab] +=
                                break;
                            case 1:
                                // 音乐tab
                                // subNameList[subItemTab] +=
                                break;
                        }

                    }

                    for(i=0,childLen=subPanelChild.length; i<childLen; i++){
                        // 生成各tab标签内容
                    }

                    function gettabList() {
                        // 得到单个li标签内容,并返回

                    }

                };


                that._isInit = true;
            },
            addPage: function (ele,parentEle) {
                // 新增一个page
                console.log(ele,ele.id);
                var i=0, j=0, len=0, nodeString='', layerItem={}, id;
                var doc = document;
                var pageEdit = doc.getElementById('xk-edit-center-edit');
                var li = doc.createElement('li');
                id = ~~ele.id + 1;
                li.style.zIndex=ele.id*10;
                nodeString += '<p class="noselect"><span class="float_left">page-'+ id +
                    '</span> <span class="float_right"><span class="hand" data-id="311">高度设置</span><span class="hand" data-id="312">设置背景图</span><span class="hand" data-id="313">删除</span></span></p>';
                var style = '',sty,rect;
                rect = ele.rect;
                for(sty in rect){
                    style += sty + ': '+ rect[sty] +'px; ';
                }
                nodeString += '<div class="xk-edit-center-page-page" style="'+ style +'">';
                nodeString += '</div>';
                li.innerHTML = nodeString;
                parentEle.firstElementChild.appendChild(li);
            },
            insertPage: function () {
                // 插入一个page

            },
            insertBgMusic: function () {
                // 插入一个背景音乐

            },

            initLayer:function (ele,dataList) {
                // 选择page后，初始化该page的图层
                var that = this;
                var str = '', i = 0, len, dataIndex;
                if(dataList && dataList.length>0){
                    len = dataList.length;
                    for(i=0; i<len; i++){
                        dataIndex = dataList[i];
                        str += '<li>' + that._getLayer(dataIndex) + '</li>';
                    }
                }
                ele.firstElementChild.innerHTML = str;
            },
            addLayer:function (ele,data) {
                // 新增一个图层
                var that = this;
                var li = document.createElement('li');
                li.innerHTML = that._getLayer(data);
                ele.appendChild(li);
            },
            _getLayer:function (data) {
              //返回标准化后的单个层级 字符串，供调用

                var str='';
                str = '<div class="xk-edit-right-top">' +
                    '<span data-id="421" class="xk-edit-right-label xk-edit-right-label-eyes"></span> ' +
                    '<span data-id="422" class="xk-edit-right-label xk-edit-right-img"></span> ' +
                    '<span data-id="423" class="xk-edit-right-label">' + data.name + '</span> ' +
                    '<span data-id="424" class="xk-edit-right-label xk-edit-right-label-abled"></span> ' +
                    '<span data-id="425" class="xk-edit-right-label xk-edit-right-label-dir"></span> </div> ' +
                    '<div class="xk-edit-right-data xk-edit-right-data-none"> ' +
                    '<p><span>W: <i>'+ data.rect.width +' </i></span> ' +
                    '<span>H: <i>'+ data.rect.height +' </i></span></p> ' +
                    '<p><span>X: <i>'+ data.rect.x +' </i></span> ' +
                    '<span>Y: <i>'+ data.rect.y +' </i></span></p> ' +
                    '</div>';


                return str;
            },

            initEffect:function (ele,dataList) {
                // 选择图层后，初始化该图层的效果层
                // console.log(ele,dataList);
                var that = this;
                var i, len, str='', data;
                len = dataList.length;
                for(i=0; i<len; i++){
                    data = dataList[i];

                    that._getEffect(data);
                }
            },
            addEffect:function (ele,data) {
                // 新增一个效果层

            },
            _getEffect:function (data) {
                // 生成基础的效果层
                console.log('生成图层');
            },


        };


        var _Controller = function (o,v) {
            var that = this;
            that.v = v;
            that.init(o);
        };

        _Controller.prototype = {
            constructor: _Controller,
            effectBox: {},
            effect_currentTarget_select: {},
            eff_select: [],
            pageBox: {},
            page_currentTarget_select: NaN,
            page_select: [],
            subBox: {},
            sub_show_id: NaN,
            sub_select: [],
            layerBox: {},
            layer_select: [],
            subBox_layer_curr_select_ul: {},
            subBox_layer_curr_select_li: null,
            subBox_layer_effect_sct_index: NaN,

            ctrl: false,
            shift: false,
            alt: false,
            ctrl_shift: false,

            init : function (o) {
                // console.log(o);
                var doc = document, that = this;

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

                // 画布侦听
                var llli = that.pagePanel.firstElementChild.childNodes;
                Utils.addEvent(that.pagePanel.firstElementChild,'mousedown',function (e) {
                    e.preventDefault();

                });
                Utils.addEvent(that.pagePanel.firstElementChild,'mouseup',function (e) {
                    // console.log(e.currentTarget,e.target,lll.contains(e.target),llli);
                    var element = {}, j=0,pageLen=0, selectIndex;
                    for(var i in llli){
                        if(llli[i].nodeType===1 && llli[i].contains(e.target)){
                            element = llli[i];
                            selectIndex = i;
                            if(that.ctrl || that.shift || that.ctrl_shift){
                                if( Utils.hasClass(element,'box-bg-green') ){
                                    Utils.removeClass(element,'box-bg-green');
                                    for(j=0,pageLen=that.page_select.length; j<pageLen; j++){
                                        if(element == that.page_select[j]){
                                            that.page_select.splice(j,1);
                                        }
                                    }
                                }else{
                                    Utils.addClass(element,'box-bg-green');
                                    that.page_select[that.page_select.length] = element;
                                }

                            }else{
                                j = 0;
                                pageLen = that.page_select.length;

                                if( Utils.hasClass(element,'box-bg-green') ){
                                    if(pageLen <= 1){
                                        // that.page_select = [];
                                        // Utils.removeClass(element,'box-bg-green');
                                    }else{
                                        for(j=0; j<pageLen; j++){
                                            if(element == that.page_select[j]) continue;
                                            Utils.removeClass(that.page_select[j],'box-bg-green');
                                            that.page_select.splice(j,1);
                                            j--,pageLen--;
                                        }
                                    }
                                }else{
                                    Utils.addClass(element,'box-bg-green');
                                    if(pageLen <= 1){
                                        if(that.page_select[0]){
                                            Utils.removeClass(that.page_select[0],'box-bg-green');
                                        }
                                        that.page_select[0] = element;
                                    }else{
                                        for(j=0; j<pageLen; j++){
                                            if(element == that.page_select[j]) continue;
                                            Utils.removeClass(that.page_select[j],'box-bg-green');
                                        }
                                        that.page_select = [];
                                        that.page_select[0] = element;
                                    }
                                }


                            }

                        }
                    }

                    if(that.page_currentTarget_select != selectIndex){
                        that.page_currentTarget_select = selectIndex;
                        if(that.layerPanelBox && that.page_currentTarget_select){
                            var id = ~~_Model.page[that.page_currentTarget_select].id + 1;
                            getChildes(that.layerPanel.firstElementChild)[1].innerHTML = 'page-' + id  ;
                            that.v.initLayer(that.layerPanelBox,_Model.page[that.page_currentTarget_select].layerList);
                        }
                    }
                });


                // 组件
                function subEvent(e) {

                    var list = getChildes(e.currentTarget);
                    var i = 0, len=list.length, selectUl={}, indexUl=NaN, indexLi=NaN,selectLi,UlChild={},
                        element = {},
                        eleId;
                    var index;
                    if(that.subBox_layer_curr_select_ul){


                    }

                    element = e.target;
                    eleId = e.currentTarget.id;

                    for(i=0; i<len; i++){
                        if(list[i].contains(element)){
                            selectUl = list[i];
                            indexUl = i;

                            break;
                        }
                    }

                    //组件当前显示的id
                    that.sub_show_id = indexUl;

                    UlChild = getChildes(selectUl);
                    for(i=0,len=UlChild.length; i<len; i++){
                        if(UlChild[i].contains(element)){
                            selectLi = UlChild[i];
                            indexLi = i;

                            break;
                        }
                    }

                    var _dataId = ~~element.getAttribute('data-id');
                    switch(eleId){
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
                            if(!that.sub_select[indexUl]) that.sub_select[indexUl] =[];
                            // that.sub_select
                            clickItem(that.sub_select[indexUl]);
                            typeItem();
                            break;
                        case 'xk-edit-layer-panel':
                            // 图层层
                            index = that.page_currentTarget_select;
                            // that.layer_select
                            clickItem(that.layer_select);
                            if(index && !isNaN(indexLi)){
                                that.v.initEffect(that.effectPanelBox,_Model.page[index].layerList[indexLi].animal);
                                typeItem();
                            }
                            break;
                    }

                    function clickItem(ulSelectArr) {
                        // 点击单个 li 相应的显示与数据处理
                        if(!selectLi) return;

                        if(that.ctrl || that.shift || that.ctrl_shift){
                            if(!Utils.hasClass(selectLi,'box-bg-blue')){
                                Utils.addClass(selectLi,'box-bg-blue');
                                ulSelectArr[ulSelectArr.length] = selectLi;
                            }

                        }else{

                            if(Utils.hasClass(selectLi,'box-bg-blue')){
                                len=ulSelectArr.length;
                                if(len>1){
                                    while(len--){
                                        if(ulSelectArr[len]){
                                            if(ulSelectArr[len] == selectLi) continue;
                                            Utils.removeClass(ulSelectArr[len],'box-bg-blue');
                                            ulSelectArr.splice(len,1);
                                        }
                                    }
                                }
                            }else{
                                // if(that.subBox_layer_curr_select_ul != selectUl){
                                    len=ulSelectArr.length;
                                    while(len--){
                                        if(ulSelectArr[len]){
                                            Utils.removeClass(ulSelectArr[len],'box-bg-blue');
                                            ulSelectArr.splice(len,1);
                                        }
                                    }
                                // }else{
                                //     Utils.removeClass(that.subBox_layer_curr_select_li,'box-bg-blue');
                                // }
                                Utils.addClass(selectLi,'box-bg-blue');
                            }
                            ulSelectArr[0]=selectLi;

                        }

                        if(that.subBox_layer_curr_select_ul != selectUl){
                            that.subBox_layer_curr_select_ul = selectUl;
                        }
                        if(that.subBox_layer_curr_select_li != selectLi){
                            that.subBox_layer_curr_select_li=selectLi;
                        }

                    }


                    function typeItem() {
                        // 处理单个按钮

                        switch(_dataId){
                            case 421:
                                console.log(_dataId,_Model.config[_dataId]);

                                break;
                            case 422:
                                console.log(_dataId,_Model.config[_dataId]);

                                break;
                            case 423:
                                console.log(_dataId,_Model.config[_dataId]);

                                break;
                            case 424:
                                console.log(_dataId,_Model.config[_dataId]);

                                break;
                            case 425:
                                // console.log(id,_Model.config[id]);
                                var list = getChildes(that.subBox_layer_curr_select_li);
                                console.log(that.subBox_layer_curr_select_li,1111);
                                if(Utils.hasClass(element,'xk-edit-right-label-dirbottom')){
                                    Utils.removeClass(element,'xk-edit-right-label-dirbottom');
                                    Utils.addClass(list[1],'xk-edit-right-data-none');
                                }else{
                                    Utils.addClass(element,'xk-edit-right-label-dirbottom');
                                    Utils.removeClass(list[1],'xk-edit-right-data-none');
                                }

                                break;
                        }

                    }

                };
                Utils.addEvent(that.subPanelBox,'mouseup',subEvent);
                Utils.addEvent(that.layerPanelBox,'mouseup',subEvent);
                Utils.addEvent(that.effectPanelBox,'mouseup',subEvent);


                // 键盘事件
                Utils.addEvent(doc,'keydown',keydownEvents);
                Utils.addEvent(doc,'keyup',keyupEvents);
                function keydownEvents(e) {
                    e.preventDefault();
                    if (e.ctrlKey || e.keyCode == 17) {
                        //按下ctrl
                        console.log(e.keyCode,'ctrl'  );
                        that.ctrl = true;
                        that.shift = that.alt = that.ctrl_shift = false;
                    }
                    if(e.shiftKey || e.keyCode == 16){
                        console.log(e.keyCode,'shift'  );
                        that.shift = true;
                        that.ctrl = that.alt = that.ctrl_shift = false;
                    }
                    if(e.altKey || e.keyCode == 18){
                        console.log(e.keyCode,'alt'  );
                        that.alt = true;
                        that.ctrl = that.shift = that.ctrl_shift = false;
                    }
                    if((e.ctrlKey || e.keyCode == 17) && (e.shiftKey || e.keyCode == 16)){
                        console.log(e.keyCode,'ctrl + shift' );
                        that.ctrl_shift = true;
                        that.ctrl = that.shift = that.alt = false;
                    }
                }
                function keyupEvents(e) {
                    e.preventDefault();
                    that.ctrl = that.shift = that.alt = that.ctrl_shift = false;
                }


            },
            setEffect : function () {

            },
            setType : function (id,ele) {
                var that = this;
                switch(id){
                    case 101:
                        console.log(id,_Model.config[id]);
                        console.log(Date.now());
                        break;
                    case 102:
                        console.log(id,_Model.config[id]);

                        break;
                    case 103:
                        console.log(id,_Model.config[id]);

                        break;
                    case 104:
                        console.log(id,_Model.config[id]);

                        break;
                    case 105:
                        console.log(id,_Model.config[id]);

                        break;
                    case 106:
                        console.log(id,_Model.config[id]);

                        break;
                    case 201:
                        console.log(id,_Model.config[id]);

                        break;
                    case 202:
                        console.log(id,_Model.config[id]);

                        break;
                    case 203:
                        console.log(id,_Model.config[id]);

                        break;
                    case 204:
                        console.log(id,_Model.config[id]);

                        break;
                    case 205:
                        console.log(id,_Model.config[id]);

                        break;
                    case 206:
                        console.log(id,_Model.config[id]);

                        break;
                    case 207:
                        console.log(id,_Model.config[id]);

                        break;
                    case 208:
                        console.log(id,_Model.config[id]);

                        break;
                    case 209:
                        console.log(id,_Model.config[id]);

                        break;
                    case 221:
                        console.log(id,_Model.config[id]);
                        break;

                    case 301:
                        console.log(id,_Model.config[id]);
                        // console.log(that.pagePanel,'page 对象');
                        var len = _Model.page.length;
                        _Model.page[len] = {
                            id: len,
                            rect: {bottom:656,
                                height: 540,
                                left:0,
                                right:0,
                                top:0,
                                width:298.96875,
                                x:440.515625,
                                y:116
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
                        }
                        // _Model.page

                        that.v.addPage(_Model.page[len],that.pagePanel);

                        break;
                    case 302:
                        console.log(id,_Model.config[id]);

                        break;
                    case 303:
                        console.log(id,_Model.config[id]);

                        break;
                    case 304:
                        console.log(id,_Model.config[id]);

                        break;
                    case 305:
                        console.log(id,_Model.config[id]);

                        break;
                    case 311:
                        console.log(id,_Model.config[id]);

                        break;
                    case 312:
                        console.log(id,_Model.config[id]);

                        break;
                    case 313:
                        var arr=[];
                        // console.log(_Model.page);
                        var first = that.pagePanel.firstElementChild;
                        var list = first.childNodes;
                        // var list = ele.parentNode.parentNode.parentNode.parentNode.childNodes;
                        for(var i in list){
                            if(list[i].nodeType === 1){
                                arr[arr.length] = list[i];
                            }
                        }

                        var slt = {};
                        for(var j=0;j<arr.length;j++){
                            if(ele.parentNode.parentNode.parentNode == arr[j]){
                                var m = 0, len, id;
                                //后面完善
                                first.removeChild(arr[j]);
                                for(m=0,len=that.page_select.length; m<len; m++){
                                    slt = that.page_select[m];
                                    if(slt == arr[j]){
                                        that.page_select.splice(m,1);
                                        // return;
                                    }
                                }
                                that.page_currentTarget_select = NaN;


                                m = j+1;
                                for(m,len = _Model.page.length;m<len;m++){
                                    id = ~~_Model.page[m].id -1;
                                    _Model.page[m].id = id;
                                    arr[m].firstElementChild.firstElementChild.innerHTML = 'page-'+ (id+1);
                                    console.log(len,arr[m].firstElementChild.firstElementChild,_Model.page[m].id);
                                }
                                _Model.page.splice(j,1);
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
                    case 404:
                        var show_panel = getChildes(that.subPanelBox)[that.sub_show_id];
                        var data = that.sub_select[that.sub_show_id], len = data.length;
                        while(len--){
                            show_panel.removeChild(data[len]);
                            data.splice(len,1);
                        }

                        break;
                    case 406:
                        if(!that.page_currentTarget_select) return;
                        var data = that.layer_select, len = data.length;
                        if(len<=0) return;
                        var show_panel = that.layerPanelBox.firstElementChild;
                        var show_list = getChildes(show_panel.firstElementChild), panel_len ,index = 0, i= 0;

                        while(len--){
                            for(i=0,panel_len = show_list.length; i<panel_len; i++){
                                if(data[len] == show_list[i]){
                                    index = i;
                                    break;
                                }
                            }
                            _Model.page[that.page_currentTarget_select].layerList.splice(index,1);
                            show_panel.removeChild(data[len]);
                            data.splice(len,1);
                        }
                        break;

                }
            }

        };


        var _Model = {
            page: [],
            subList: [],
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
                106: {
                    name: '返回我的动态条漫'
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

            _Model.subList.push({
                id: 11111,
                tab: 0,
                type: 'image',
                name: '草泥马',
                src: '',
                size: '200kb',
                width: '200px',
                height: '200px',

            });
            _Model.subList.push({
                id: 11112,
                tab: 1,
                type: 'mp3',
                name: '草泥马',
                src: '',
                size: '200kb',
                duration: '3',

            });


            console.log(_Model.subList,'111');

            _Model.page[0]={
                id: 0,
                rect: {bottom:656,
                    height: 540,
                    left:0,
                    right:0,
                    top:0,
                    width:298,
                    x:440,
                    y:116
                },
                layerList: [
                    {
                        layer: 0,
                        src: 'images/warning.jpg',
                        name: 0,
                        rect: {bottom:656,
                            height: 540,
                            left:0,
                            right:739,
                            top:0,
                            width:298,
                            x:440,
                            y:116
                        },
                        animal: [1],
                    },
                    {
                        layer: 1,
                        src: 'images/warning.jpg',
                        name: 1,
                        rect: {bottom:656,
                            height: 540,
                            left:0,
                            right:739,
                            top:0,
                            width:298,
                            x:440,
                            y:116
                        },
                        animal: [2],
                    },
                ],
            };
            _Model.page[1]={
                id: 1,
                rect: {bottom:656,
                    height: 3000,
                    left:0,
                    right:0,
                    top:0,
                    width:298.96875,
                    x:440.515625,
                    y:116
                },
                layerList: [
                    {
                        layer: 0,
                        src: 'images/xx3-01-bg.jpg',
                        name: 1,
                        rect: {bottom:656,
                            height: 3000,
                            left:0,
                            right:739.484375,
                            top:0,
                            width:298.96875,
                            x:440.515625,
                            y:116
                        },
                        animal: [],
                        onelevel: true,
                    },
                ],
            };
            _Model.page[2]={
                id: 2,
                rect: {bottom:656,
                    height: 1051,
                    left:0,
                    right:0,
                    top:0,
                    width:298.96875,
                    x:440.515625,
                    y:116
                },
                layerList: [
                    {
                        layer: 0,
                        src: 'images/xx3-12-bg.jpg',
                        name: 2,
                        rect: {bottom:656,
                            height: 1051,
                            left:0,
                            right:739.484375,
                            top:0,
                            width:298.96875,
                            x:440.515625,
                            y:116
                        },
                        animal: [],
                        onelevel: true,
                    },
                    {
                        layer: 0,
                        src: 'images/xx3-12-biyan.png',
                        name: 2,
                        rect: {bottom:656,
                            height: 1051,
                            left:0,
                            right:0,
                            top:0,
                            width:298,
                            x:440.515625,
                            y:116
                        },
                        animal: [],
                        onelevel: true,
                    },
                ],
            };
            _Model.page[3]={
                id: 3,
                rect: {bottom:656,
                    height: 540,
                    left:0,
                    right:0,
                    top:0,
                    width:298.96875,
                    x:440.515625,
                    y:116
                },
                layerList: [
                    {
                        layer: 0,
                        src: '',
                        name: 0,
                        rect: {},
                        animal: [],
                        onelevel: true,
                    },
                ],
            };
            _Model.page[4]={
                id: 4,
                rect: {bottom:656,
                    height: 540,
                    left:0,
                    right:0,
                    top:0,
                    width:298.96875,
                    x:440.515625,
                    y:116
                },
                layerList: [
                    {
                        layer: 0,
                        src: '',
                        name: 0,
                        rect: {},
                        animal: [],
                        onelevel: true,
                    },
                ],
            };
            var v = new _View({page:_Model.page, subList: _Model.subList});
            var c = new _Controller({name:'zfc'},v);

            Utils.addEvent(window, 'mousedown', function (e) {
                // e.preventDefault();

            }, true);
            Utils.addEvent(window, 'mouseup', function (e) {
                e.preventDefault();
                var _dataId = e.target.getAttribute('data-id');
                if(_dataId){
                    c.setType(~~_dataId,e.target);
                }else{

                }
            }, true);


        }
        init();

        /*Utils.addEvent(document,'readystatechange',initDoc);

        function initDoc(e) {
            console.log('渲染完成');
        }*/


        Utils.addEvent(window, 'resize', function (e) {
            console.log(document.documentElement.offsetWidth, Show.name);
        })


        /*end*/
    });
});
