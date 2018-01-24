/**
 * Created by P on 2018/1/9.
 */
//前端判断注册数据是否合格数据是否合格
var users = {
    name: $('input[name=nickname]'),
    password: $('input[name=password]'),
    checkpass: $('input[name=checkpass]'),
    phone: $('input[name=phone]'),
    email: $('input[name=email]'),
    job: $('option:selected')
};
var user = {
    name: "",
    password: "",
    checkpass: "",
    phone: "",
    email: "",
    job: ""
};

$('input').focus(function () {//input获取焦点时效果
    $(this).css('border', '');
    $(this).css('border', '1px solid #ddd')
});

users.name.blur(function () {
    user.name = users.name.val();
    if (user.name ==='') {
        alertcolor(users.name, '1px solid red')
    } else {
        console.log(user.name);
    }
});

users.password.blur(function () {
    user.password = users.password.val();
    if (!user.password.match(/^[a-zA-Z][a-zA-Z0-9_]{5,15}/)) {
        //英文字母开头并且长度为6-16位
        alertcolor(users.password, '1px solid red');
    } else {
        console.log(user.password);
    }
});
users.checkpass.blur(function () {
    user.checkpass = users.checkpass.val();
    if (user.checkpass !== user.password || user.checkpass === '') {
        //两次输入不一致！
        alertcolor(users.checkpass, '1px solid red');
    } else {
        console.log(user.password);
    }
});
users.phone.blur(function () {
    user.phone = users.phone.val();
    if (!user.phone.match(/^1[34578]\d{9}$/)) {
        //手机以1 34578开头，后面9位任意
        alertcolor(users.phone, '1px solid red');
    } else {
        console.log(user.phone);
    }
});

users.email.blur(function () {
    user.email = users.email.val();
    if (!user.email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
        //邮箱判定
        alertcolor(users.email, '1px solid red');
    } else {
        console.log(user.email);
    }
});

function alertcolor(obj, color) {
    obj.css('border', color)
}
