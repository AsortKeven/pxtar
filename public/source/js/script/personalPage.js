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
        node.action = 'beVip';
        node.method = 'post';
        childnode.value = '';
        childnode.id = 'vipInvite';
        submit.type = 'submit';
        submit.value = '提交';
        node.appendChild(childnode);
        node.appendChild(submit);
        this.parentNode.appendChild(node);
    }
});

//新建单话
$('.xk-per-cartoon-addbtn').click(function () {
    alert('新建单话');
});