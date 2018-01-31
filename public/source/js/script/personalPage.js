/**
 * Created by Administrator on 2017/12/26.
 */
var curId = 1;

var contens = document.querySelectorAll('.xk-per-content');
//console.log(contens);

//主显示区切换
$('#nav li').click(function () {
    $(this).siblings('li').removeClass('xk-per-nav-active');
    $(this).addClass('xk-per-nav-active');
    curId = this.getAttribute('data-id');

    checkId(curId);
});

//点击判定
function checkId(id) {
   // console.log(id);
    for (var i = 0; i < contens.length; i++) {
        if (id === '3') {
            if (confirm('确定要注销登录么？')) {
                alert('注销成功');
                return;
            } else {
                return;
            }
        }
        if (i === parseInt(id)) {
            contens[i].style.cssText = 'display:block';
        }
        else {
            contens[i].style.cssText = 'display:none';
        }
    }
}

//修改信息
$('#xk-per-modify').click(function () {
    console.log('modify user infos');
    var lists='';
    var nodeInfos = '';
    var xkInpur =$('.xk-per-input');
    xkInpur.children().each(function () {
            var value = $(this).find('span').html();
            var temp = this.innerHTML;
            var str1 = /<span/g;
            var str2 = /<\/span>/g;
            nodeInfos += '<p>'+temp+'</p>';
            temp = temp.replace(str1,'<input')
                    .replace(str2,'')
                    .split('>')[0]+' value="'+value+'"/>'+'<br/>';
            this.parentNode.removeChild(this);
            lists += temp;
           /* console.log(this.innerHTML);
            var name = this.innerHTML.split('<')[0];
            console.log(name);
            console.log($(this).find('span').attr('id'));
            console.log($(this).find('span').html());*/
        });
    xkInpur.html(lists);
    $('#xk-per-save').css('display', 'block');
    $('.xk-per-saveGroup').click(function () {
        if(this.getAttribute('type') === 'button'){
            xkInpur.empty();
            xkInpur.html(nodeInfos);
        }
        $('#xk-per-save').css('display', 'none');
    });
});
$('#xk-per-beVip').click(function () {
    console.log(this.parentNode.childNodes.length === 12);
    if(this.parentNode.childNodes.length === 12){
        var node = document.createElement('form');
        var childnode = document.createElement('input');
        var submit = document.createElement('input');
        node.action = 'becomeVip';
        node.method = 'post';
        childnode.value = '';
        childnode.name = 'inviteNum';
        submit.type = 'submit';
        submit.value = '提交';
        node.appendChild(childnode);
        node.appendChild(submit);
        this.parentNode.appendChild(node);
    }
});

//新建单话
$('.xk-per-cartoon-addbtn').click(function () {
    var box=$('.xk-per-box');
    var inName=$('input[name=name]'),
        inNumber=$('input[name=number]');
    box.css('display','block');
    var nav,html,objUrl;
    //获取封面图片
    $(".xk-per-box-img").unbind('click').click(function () {
        $("#upload").click();
        $("#upload").on("change",function(){
            objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
        });
    });
    $('.xk-per-box-but-yes').unbind('click').on('click',function () {//确定新建
        var date=new Date();
        box.css('display','none');
        nav={
            name:inName.val(),
            number:inNumber.val(),
            time:date.toLocaleString(),
            url:objUrl
        };
        $.ajax({
            type:'post',
            url:'/personalPage',
            datatype:'josn',
            data:nav,
            success:function (data) {
                console.log(data)
            }
        })
        html='<div class="xk-per-list xk-per-list-style">'+
            '<div class="xk-per-cartoon-box">'+
            '<div class="xk-cartoon-box-top xk-cartoon-item-style">'+
            '<p class="xk-cartoon-box-nav xk-cartoon-box-top-top">'+
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-left"><a href="##">预览</a></span>'+
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-right"><a href="##">编辑</a></span>'+
            '</p>'+
            '<p class="xk-cartoon-box-nav xk-cartoon-box-bottom">'+
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-left"><a href="##">删除</a></span>'+
            '</p>'+
            '<img class="xk-per-cartoon-img" src="'+nav.url+'">'+
            '</div>'+
            '<p class="xk-cartoon-box-center xk-cartoon-item-style">'+
            '<span class="xk-per-cartoon-txt xk-per-cartoon-name">'+nav.name+'</span>'+
            '<span class="xk-per-cartoon-txt xk-per-cartoon-number">'+nav.number+'</span>'+
            '</p>'+
            '<p class="xk-cartoon-box-bottom xk-cartoon-item-style">'+
            '<span class="xk-per-cartoon-txt">'+'最后:'+nav.time+'</span>'+
            '</p>'+
            '</div>'+
            '</div>';
        console.log(nav);
        inName.val("");
        inNumber.val("");
        // console.log(nav);
        $('.xk-per-cinter-nav').prepend(html);
        $('.xk-per-box-but-yes').attr('disabled','disabled');
    });
    $('.xk-per-box-but-no').on('click',function () {//取消新建
        box.css('display','none');
        inName.val("");
        inNumber.val("");
        inName.css('border','1px solid #ddd');
        inNumber.css('border','1px solid #ddd');
    });
    //判断格式
    inName.change(function () {
        if(inName.val()==""){
            inName.css('border','1px solid red');
            $('.xk-per-box-but-yes').attr('disabled','disabled')
        }else {
            inName.css('border','1px solid #ddd');
        };
        if (inName.val()!==""&&inNumber.val()!=="") {
            $('.xk-per-box-but-yes').removeAttr('disabled')
        }
    });
    inNumber.change(function () {
        if(inNumber.val()==""){
            inNumber.css('border','1px solid red');
            $('.xk-per-box-but-yes').attr('disabled','disabled')
        }else {
            inNumber.css('border','1px solid #ddd');
        };
        if (inName.val()!==""&&inNumber.val()!==""){
            $('.xk-per-box-but-yes').removeAttr('disabled')
        }
    });

});

//鼠标悬浮到单话
$('.xk-per-cinter-nav').on('mouseenter mouseleave','.xk-cartoon-box-top',function (event) {
    var _this=$(this),timer;
    if(event.type == "mouseenter"){
        //鼠标悬浮
        // timer=setTimeout(function () {
            _this.find('.xk-cartoon-box-top-top').animate({top:0});
            _this.find('.xk-cartoon-box-bottom').animate({bottom:0});
            _this.find('.xk-cartoon-box-bottom .xk-cartoon-box-left').click(function () {
                _this.parent().parent().remove();
            });
        // },1000)

    }else if(event.type == "mouseleave"){
        //鼠标离开
        // clearTimeout(timer);
        $(this).find('.xk-cartoon-box-bottom').animate({bottom:'-1.5rem'});
        $(this).find('.xk-cartoon-box-top-top').animate({top:'-1.5rem'})
    }

});

//预览
$('.xk-per-cinter-nav').on('click','.xk-cartoon-box-top .xk-cartoon-box-top-top .xk-cartoon-box-left',function () {
    alert('这是预览');
    console.log($(this).text())
});
//编辑
$('.xk-per-cinter-nav').on('click','.xk-cartoon-box-top .xk-cartoon-box-top-top .xk-cartoon-box-right',function () {
    alert('这是编辑')
})

function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}