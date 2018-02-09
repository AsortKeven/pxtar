/**
 * Created by Administrator on 2018/1/30.
 */

/*
 *          拖动框效果
 *          obj = {
 *                   type:'',//image,node
 *                   name:'',//title取name的值
 *                   w:'',//宽度取w 图片特有
 *                   h:'',//高度取h 图片特有
 *                   value:'',//image的值为图片src,node的值ElementNode,将整个节点添加到div中显示
 *                   fn:''//text类型才有，传入函数供确认按钮调用
 *               }
 *
 *
 *
 * */

var alertClass = function (obj) {
    var div = document.createElement('div');//弹出框
    var title = document.createElement('p');//标题
    var opac = document.createElement('div');//半透明蒙板

    var body = document.getElementsByTagName('body')[0];

    title.classList.add('title');

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
            'left:' + (document.documentElement.clientWidth - obj.w) / 2 + 'px;';

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

    //node弹窗，value必须为node
    if (obj.type === 'node') {
        title.innerHTML = obj.name;
        div.style.cssText =
            'width:500px;' +
            'height:300px;' +
            'border: 2px solid black;' +
            'border-radius:5px;' +
            'position:absolute;' +
            'top:50px;' +
            'left:' + (document.documentElement.clientWidth - 250) / 2 + 'px;';

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
            opac.style.display = 'none';
            div.style.display = 'none';
        })

    }
    opac.style.cssText = 'width:' + document.documentElement.clientWidth + 'px;' +
        'height:' + document.documentElement.clientHeight + 'px;' +
        'background-color:darkgray;' +
        'opacity:0.5;' +
        'position:absolute;' +
        'left:0;' +
        'top:0;';

    div.appendChild(title);
    body.appendChild(opac);
    body.appendChild(div);

    opac.addEventListener('click', function () {
        this.style.display = 'none';
        div.style.display = 'none';
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
            if(close){
                if (disW >= clientWidth) {
                    close.style.display = 'none';
                } else {
                    close.style.display = 'block';
                }
            }
            console.log(div.style);
            div.style.left = disW + 'px';
            div.style.top = disH + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
};


//禁止网页的右键菜单
(function() {
    // if(window.Event)
    //     document.captureEvents(Event.MOUSEUP);

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
})();

//自定义右键菜单
(function() {

    var forRight = document.getElementById("right-menu");//获取右键面板
    var container = document.getElementById('container');
    var nodeList = container.children || container.childNodes;//获取右键菜单项
    var nodeLength = nodeList.length;
    document.oncontextmenu = function (event) {
        var e = event || window.event;

        forRight.style.display = "block";
        forRight.style.left = e.pageX + "px";
        forRight.style.top = e.pageY + "px";
        //return false为了屏蔽默认事件
        return false;
    };
    //再次点击，菜单消失
    document.onclick = function () {
        forRight.style.display = "none";
    };
   for(var i = 0; i < nodeLength; i++){
       nodeList[i].addEventListener('click',function () {
           alert(this.getAttribute('id'));
       })
   }
})();