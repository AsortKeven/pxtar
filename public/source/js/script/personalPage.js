/**
 * Created by Administrator on 2017/12/26.
 */

var curId = 1;
var contens = document.querySelectorAll('.xk-per-content');
console.log(contens);
$('#nav li').click(function () {
    $(this).siblings('li').removeClass('xk-per-nav-active');
    $(this).addClass('xk-per-nav-active');
    curId = this.getAttribute('data-id');

    checkId(curId);
});

function checkId(id) {
    console.log(id);
    for (var i = 0; i < contens.length; i++) {
        if(id === '3'){
            if(confirm('确定要注销登录么？')){
                alert('注销成功');
                return;
            }else {
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
