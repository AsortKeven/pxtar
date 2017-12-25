/**
 * Created by Administrator on 2017/12/22.
 */
/**
 * Created by Administrator on 2017/12/14.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var upload = multer();
var app = express();
var utils = require('./Utils');
var loginResult = {
    loginStatus: false,
    uuid: '',
    userinfo: {},
    isChecked: '',
    ident: '',
    discription: '',
    photo: '',
    address: '',
    production: '',
    profession: '',
    authority: ''
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var currentDir = __dirname.split('WEB-INF');
// console.log(currentDir[0],__dirname);
app.set('views', path.join(currentDir[0], 'public', 'views'));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 3000);

var connection = mysql.createConnection(utils.con);

connection.connect();

app.get('/login', function (req, res) {
    res.type('html');
    res.render('login', { result: '' });
});

app.post('/login', upload.array(), function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var temp = void 0;
    var search = void 0;
    console.log(username, password);
    if (username !== '用户名' && username !== '手机' && username !== '邮箱') {
        var str = '%' + username + '%';
        search = function search() {
            return new Promise(function (resolve, reject) {
                connection.query(utils.sqls.logincheck, str, function (err, result) {
                    if (err || !result) {
                        return console.error(err);
                    } else if (result.length === 0) {
                        temp = '用户名不存在！';
                    } else if (password !== result[0].password) {
                        temp = '密码错误！';
                        console.log(result);
                        console.log(temp);
                    } else {
                        var _ref = [true, result[0].UUID];
                        loginResult.loginStatus = _ref[0];
                        loginResult.uuid = _ref[1];

                        console.log(loginResult.loginStatus, loginResult.uuid);
                        temp = '欢迎您,' + JSON.parse(result[0].userInfos).用户名 + ',登陆成功！';
                    }
                    resolve(temp);
                });
            });
        };
    } else {
        temp = 'illegal input!';
    }
    search().then(function (msg) {
        console.log(msg);
        res.type('html');
        res.render('login', { result: msg });
    });
});

app.get('/personalPage', function (req, res) {
    res.type('html');
    res.render('personalPage', { result: 1111 });
});

//提交uuid到后台数据库，查询数据并返回
app.post('/personalPage', upload.array(), function (req, res, next) {
    var uuid = req.body.uuid;
    var searchAll = function searchAll() {
        return new Promise(function (resolve, reject) {
            connection.query(utils.sqls.selectLogininfo, uuid, function (err, result) {
                if (err) return console.error(err);else {
                    var _ref2 = [true, result[0].uuid, result[0].userInfos, result[0].isChecked];
                    loginResult.loginStatus = _ref2[0];
                    loginResult.uuid = _ref2[1];
                    loginResult.userinfo = _ref2[2];
                    loginResult.isChecked = _ref2[3];
                }
            });
            resolve(loginResult);
        });
    };
    searchAll().then(function (msg) {
        connection.query(utils.sqls.selectUserinfo, uuid, function (err, result) {
            if (err) return console.error(err);
            else {
                var _ref3 = [result[0].identity, result[0].discription, result[0].photo, result[0].address, result[0].production, result[0].profession, result[0].authority];
                msg.ident = _ref3[0];
                msg.discription = _ref3[1];
                msg.photo = _ref3[2];
                msg.address = _ref3[3];
                msg.production = _ref3[4];
                msg.profession = _ref3[5];
                msg.authority = _ref3[6];
            }msg.userinfo = JSON.parse(msg.userinfo);
            console.log(msg);
            res.type('html');
            res.send(msg);
        });
    });
});

app.get('/register', function (req, res) {
    res.type('html');
    res.render('register');
});

//提交注册数据，存储到数据库，regitser页面显示当前注册用户职业
app.post('/register', upload.array(), function (req, res) {
    var user = {};
    var _ref4 = [req.body.username, req.body.password, req.body.phone, req.body.email, req.body.job, utils.uuid()];
    user.username = _ref4[0];
    user.password = _ref4[1];
    user.phone = _ref4[2];
    user.email = _ref4[3];
    user.job = _ref4[4];
    user.uuid = _ref4[5];

    var tousers = [user.uuid, user.username, user.job];
    var userinfo = JSON.stringify({ 用户名: user.username, 手机: user.phone, 邮箱: user.email });
    var tologin = [user.uuid, userinfo, user.password];
    console.log(user);
    var addUser = function addUser() {
        return new Promise(function (resolve, reject) {
            connection.query(utils.sqls.register.toUsers, tousers, function (err, result) {
                if (err) return console.error(err);else console.log(result);
            });

            connection.query(utils.sqls.register.toLogin, tologin, function (err, result) {
                if (err) return console.error(err);else console.log(result);
            });
            resolve();
        });
    };
    addUser().then(function () {
        res.type('html');
        res.render('about', { Hello: user.job });
    });
});

//post 访问about
app.post('/about', upload.array(), function (req, res) {
    var trunk = 'default';
    trunk += req.body.dataName;
    console.log(req.body.dataName);
    res.type('html');
    res.render('about', { Hello: trunk });
});

//result
app.get('/result', function (req, res) {
    var trunk = "default";
    trunk += req.query.input;
    console.log(req.query.input);
    console.log(trunk);
    res.type('html');
    res.render('result', { Hello: trunk });
});

var trunk = '<a href="/register">注册</a>';

app.get('/', function (req, res) {
    req.on('data', function (data) {
        trunk += data;
    });
    res.type('html');
    res.render('home', { Hello: trunk });
});

app.use('*', function (req, res) {
    res.status(404);
    res.type('html');
    res.render('404');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
});
//# sourceMappingURL=server.js.map