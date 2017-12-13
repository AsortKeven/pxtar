/**
 * Created by Administrator on 2017/12/5.
 */

/*
 *
 * 注册必要信息：用户名,手机，邮箱，密码，职业；后台生成UUID，账号；
 * 账号，手机，邮箱构成一个json,存在logininfo的userinfos中
 * userInfo为主表，loginInfo为附表，操作主表对应的信息附表随之变化（UUID）
 * 清空表后使自增重新开始alter table table_name auto_increment=1;
 * */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var upload = multer();
var app = express();
var utils = require('./utils');
var sendMail = require('./mail');

var loginResults = {
    loginStatus: false,
    uuid: '',
    userinfo: {},
    isChecked: '',
    identity: '',
    discription: '',
    photo: '',
    address: '',
    production: '',
    profession: '',
    authority: ''
};
/*设置网站图标为favicon.ico
 var favicon = require('serve-favicon');
 app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));
 */

/* 设置日志显示
 var logger = require('morgan');
 app.use(logger('dev'));
 */

/*cookies的解析
 var cookieParser = require('cookie-parser');
 app.use(cookieParser());
 app.get('/',function(req,res){
 res.cookie('cookie1','这里是cookie1',{expires: new Date(Date.now() + 900000), httpOnly:true});
 res.end('cookie set ok);
 })

 app.get('/',function(req,res){
 var cookie = req.cookie.cookie1;
 console.log(cookie);
 })
 */


app.set('title', 'Pxtar Engine');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var currentDir = __dirname.split('WEB-INF');
// console.log(currentDir[0],__dirname);
app.set('views', path.join(currentDir[0],'public','views'));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 3000);

var connection = mysql.createConnection(utils.con);

// var userinfos=JSON.stringify({
//     用户名:'111',
//     手机:'222',
//     邮箱:'633'
// });
connection.connect();
/*console.log(process.cwd());
process.chdir('G:/Pxtar/LoaclGit/pxtar');
console.log(process.cwd());*/

/*测试数据：往数据库中添加对应信息
var addUserParams=[uuid,'没名字','漫画家'];
var addUserParams2 = [uuid,userinfos,'123456789'];
connection.query(addUserToUsers,addUserParams,function (err,result,fields) {
    if(err)
        return console.error(err);
    else
        console.log(result);
});
connection.query(addUserToLogin,addUserParams2,function (err,result,fields) {
    if(err)
        return console.error(err);
    else
        console.log(result);
});*/
app.get('/login', function (req, res) {
    res.type('html');
    res.render('login', {result: ''});
});

//登陆判定
app.post('/login', upload.array(), function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var temp;
    console.log(username, password);

    if (username !== '用户名' && username !== '手机' && username !== '邮箱') {
        var str = '%' + username + '%';
                connection.query(utils.sqls.logincheck, str, function (err, result) {
                    if (err || !result) {
                        return console.error(err);
                    }
                    else if(result.length  === 0){
                        temp = '用户名不存在！';
                    }
                    else if (password !== result[0].password) {
                        temp = '密码错误！请核对！';
                        console.log(result);
                        console.log(temp);
                    } else {
                        loginResults.loginStatus = true;
                        loginResults.uuid = result[0].UUID;
                        console.log("loginstatus:"+loginResults.loginStatus);
                        console.log("uuid:"+loginResults.uuid);
                        temp = '欢迎您,' + JSON.parse(result[0].userInfos).用户名 + ',登陆成功！';
                    }
                });
    } else {
        temp = 'illegal input！';
    }
    setTimeout(function () {
        console.log(temp);
        res.type('html');
        res.render('login', {result: temp});
    }, 50);

});

app.get('/personalPage', function (req, res) {
    res.type('html');
    res.render('personalPage', {result: 111});
});

//进入个人页面，提交uuid到后台，查询数据返回到页面(数据待处理)
app.post('/personalPage', upload.array(), function (req, res, next) {
    var uuid = req.body.uuid;
    connection.query(utils.sqls.selectLogininfo, uuid, function (err, result) {
        if (err)
            return console.error(err);
        else {
            loginResults.loginStatus = true;
            loginResults.uuid = result[0].UUID;
            loginResults.userinfo = result[0].userInfos;
            loginResults.isChecked = result[0].isChecked;
            connection.query(utils.sqls.selectUserinfo, uuid, function (err, result) {
                if (err)
                    return console.error(err);
                else {
                    loginResults.identity = result[0].identity;
                    loginResults.discription = result[0].discription;
                    loginResults.photo = result[0].photo;
                    loginResults.address = result[0].address;
                    loginResults.production = result[0].production;
                    loginResults.profession = result[0].profession;
                    loginResults.authority = result[0].authority;
                }
                loginResults.userinfo = JSON.parse(loginResults.userinfo);
                console.log(loginResults);
                res.type('html');
                res.send(loginResults);
            });
        }

    });
});

//get请求访问register
app.get('/register', function (req, res) {
    res.type('html');
    res.render('register');
});

//提交注册数据，存储到数据库，regitser页面显示当前注册用户职业
app.post('/register', upload.array(), function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var phone = req.body.phone;
    var email = req.body.email;
    var job = req.body.job;
    var uuid = utils.uuid();
    var tousers = [uuid, username, job];
    var userinfo = JSON.stringify({用户名: username, 手机: phone, 邮箱: email});
    var tologin = [uuid, userinfo, password];
    console.log(username, password, phone, email, job, uuid);
    connection.query(utils.sqls.register.toUsers, tousers, function (err, result) {
        if (err) {
            return console.error(err);
        } else
            console.log(result);
    });
    connection.query(utils.sqls.register.toLogin, tologin, function (err, result) {
        if (err) {
            return console.error(err);
        } else
            console.log(result);
    });
    res.type('html');
    res.render('about', {Hello: job});
});


//首页
var trunk = "<a href='/register'>注册</a>";
app.get('/', function (req, res) {
    req.on('data', function (data) {
        trunk += data;
    });
    //发送邮件到指定邮箱(邮箱地址，标题，内容)
    // sendMail(arg1,arg2,arg3);
    res.type('html');
    res.render('home', {Hello: trunk});
});
//post访问about
app.post('/about', upload.array(), function (req, res, next) {
    var trunk = "default";
    trunk += req.body.dataName;
    console.log(req.body.dataName);
    res.type('html');
    res.render('about', {Hello: trunk});
});
//result
app.get('/result', function (req, res) {
    var trunk = "default";
    trunk += req.query.input;
    console.log(req.query.input);
    console.log(trunk);
    res.type('html');
    res.render('result', {Hello: trunk});
});

app.use(function (req, res) {
    res.type('html');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function (req, res) {
    res.type('html');
    res.status(500);
    res.send('500 - Server Error')
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
});