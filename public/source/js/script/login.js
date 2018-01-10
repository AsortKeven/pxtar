/**
 * Created by P on 2018/1/9.
 */
//前端登陆数据判断
$('input[type=submit]').click(function () {
    var user={
        name:$('input[name=username]').val(),
        password:$('input[name=password]').val()
    };
    if(user.name.length!==0&&user.password!==''){//判断登陆信息不能为空
        $('form').attr('onsubmit','');
    }else if(user.name.length==0){
        $('input[name=username]').css('border','1px solid red')
    };
    if(user.password==''){
        $('input[name=password]').css('border','1px solid red')
    }
    $('input').focus(function () {//获取焦点时效果
        $(this).css('border','1px solid #ddd')
    })
})
