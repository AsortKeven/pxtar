/**
 * Created by P on 2018/1/9.
 */
//前端判断注册数据是否合格数据是否合格

$('input[type=submit]').click(function () {
    var users={
        name:$('input[name=nickname]'),
        password:$('input[name=password]'),
        checkpass:$('input[name=checkpass]'),
        phone:$('input[name=phone]'),
        email:$('input[name=email]'),
        job:$('option:selected')
    }
    var user={
        name:users.name.val(),
        password:users.password.val(),
        checkpass:users.checkpass.val(),
        phone:users.phone.val(),
        email:users.email.val(),
        job:users.job.val()
    }
    if (user.name.length!==0&&user.phone!==''&&user.password!==''&&user.checkpass!==''&&user.email!==''){
        if(user.password==user.checkpass&&user.email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)){
            $('form').attr('onsubmit','');
        };
        if (!user.email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)){
            alertcolor(users.email,'1px solid red');
        }else{
            alertcolor(users.email,'1px solid #ddd')
        };
        if (user.password!==user.checkpass){
            alertcolor(users.checkpass,'1px solid red');
        }else{
            alertcolor(users.checkpass,'1px solid #ddd')
        };
        if(!(/^1[34578]\d{9}$/.test(user.phone))){
            alertcolor(users.phone,'1px solid red');
        }else {
            alertcolor(users.checkpass,'1px solid #ddd')
        };

    }
});
function alertcolor(obj,color) {
    obj.css('border',color)
}
