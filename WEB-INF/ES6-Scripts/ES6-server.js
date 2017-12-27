/**
 * Created by Administrator on 2017/12/15.
 */
/**
 * Created by Administrator on 2017/12/14.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const upload = multer();
const app = express();
const utils = require('./ES6-Utils');

const loginResult = {
    loginStatus: false,
    uuid: '',
    userinfo: {},
    isChecked: '',
    discription: '',
    photo: '',
    address: '',
    production: '',
    profession: '',
    authority: ''
};

app.set('title', 'Pxtar Engine');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let currentDir = __dirname.split('WEB-INF');
// console.log(currentDir[0],__dirname);
app.set('views', path.join(currentDir[0], 'public', 'views'));
app.use(express.static(path.join(currentDir[0], 'public')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 3000);

const connection = mysql.createConnection(utils.con);

connection.connect();

app.get('/login', (req, res) => {
    res.type('html');
    res.render('login', {result: ''})
});

app.post('/login', upload.array(), (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let temp;
    let search;
    console.log(username, password);
    if (utils.check(username, password)) {
        let str = '%' + username + '%';
        search = () => {
            return new Promise((resolve, reject) => {
                    connection.query(utils.sqls.logincheck, str, (err, result) => {
                        if (err || !result) {
                            return console.error(err);
                        } else if (result.length === 0) {
                            temp = '用户名不存在！';
                        } else if (password !== result[0].password) {
                            temp = '密码错误！';
                            console.log(result);
                            console.log(temp);
                        } else {
                            [loginResult.loginStatus, loginResult.uuid] = [true, result[0].UUID];
                            console.log(loginResult.loginStatus, loginResult.uuid);
                            temp = '欢迎您,' + JSON.parse(result[0].userInfos).用户名 + ',登陆成功！';
                        }
                        resolve(temp);
                    });
                }
            )
        };

    } else {
        temp = 'illegal input!';
    }
    search().then((msg) => {
        console.log(msg);
        res.type('html');
        res.render('login', {result: msg});
    })
});

app.get('/personalPage', (req, res) => {
    res.type('html');
    res.render('personalPage', {result: 1111});
});

//提交uuid到后台数据库，查询数据并返回
app.post('/personalPage', upload.array(), (req, res, next) => {
    let uuid = req.body.uuid;
    let searchAll = () => {
        return new Promise((resolve, reject) => {
            connection.query(utils.sqls.selectLogininfo, uuid, (err, result) => {
                if (err)
                    return console.error(err);
                else {
                    [
                        loginResult.loginStatus,
                        loginResult.uuid,
                        loginResult.userinfo,
                        loginResult.isChecked
                    ] = [
                        true,
                        result[0].uuid,
                        result[0].userInfos,
                        result[0].isChecked
                    ]
                }
            });
            resolve(loginResult);
        })
    };
    searchAll().then((msg) => {
        connection.query(utils.sqls.selectUserinfo, uuid, (err, result) => {
            if (err)
                return console.error(err);
            else
                [
                    msg.discription,
                    msg.photo,
                    msg.address,
                    msg.production,
                    msg.profession,
                    msg.authority
                ] = [
                    result[0].discription,
                    result[0].photo,
                    result[0].address,
                    result[0].production,
                    result[0].profession,
                    result[0].authority
                ];
            msg.userinfo = JSON.parse(msg.userinfo);
            console.log(msg);
            res.type('html');
            res.send(msg);
        })
    })
});

app.get('/register', (req, res) => {
    res.type('html');
    res.render('register');
});

//提交注册数据，存储到数据库，regitser页面显示当前注册用户职业
app.post('/register', upload.array(), (req, res) => {
    let user = {};
    [
        user.nickname,
        user.password,
        user.phone,
        user.email,
        user.job,
        user.uuid
    ] = [
        req.body.nickname,
        req.body.password,
        req.body.phone,
        req.body.email,
        req.body.job,
        utils.uuid()
    ];
    let userRandom = utils.userRandom();
    let tousers = [user.uuid, user.nickname, user.job];
    let userinfo = JSON.stringify({用户名: user.username, 手机: user.phone, 邮箱: user.email});
    let tologin = [user.uuid, userinfo, user.password];
    let flag = true;
    console.log(user);
    let checkUser = () => {
        return new Promise((resolve, reject) => {
            connection.query(utils.sqls.logincheck, str, function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    resolve(result);
                }
            });
        })
    };
    checkUser()
        .then((rel) => {
            if (rel.length !== 0) {
                console.log("start check");
                do {
                    if (JSON.parse(rel[0].userInfos).用户名 === userRandom) {
                        userRandom = utils.userRandom();
                        console.log("new random");
                    }
                    else {
                        flag = false;
                    }
                } while (flag);
            }
        });

    let addUser = () => {
        return new Promise((resolve, reject) => {
            connection.query(utils.sqls.register.toUsers, tousers, (err, result) => {
                if (err)
                    return console.error(err);
                else
                    console.log(result);
            });

            connection.query(utils.sqls.register.toLogin, tologin, (err, result) => {
                if (err)
                    return console.error(err);
                else
                    console.log(result);
            });
            resolve();
        })
    };
    addUser()
        .then(() => {
            res.type('html');
            res.render('about', {Hello: user.job});
        })
});

//post 访问about
app.post('/about', upload.array(), (req, res) => {
    let trunk = 'default';
    trunk += req.body.dataName;
    console.log(req.body.dataName);
    res.type('html');
    res.render('about', {Hello: trunk});
});

//result
app.get('/result', (req, res) => {
    let trunk = "default";
    trunk += req.query.input;
    console.log(req.query.input);
    console.log(trunk);
    res.type('html');
    res.render('result', {Hello: trunk});
});

let trunk = '<a href="/register">注册</a>';

app.get('/', (req, res) => {
    res.type('html');
    res.render('index', {Hello: trunk});
});

app.use('*', (req, res) => {
    res.status(404);
    res.type('html');
    res.render('404');
});

app.listen(app.get('port'), () => {
    console.log('Express started on http://localhost:' + app.get('port'));
});
