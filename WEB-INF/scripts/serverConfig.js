'use strict';

/**
 * Created by Administrator on 2018/1/30.
 */

var serverConfig = function serverConfig(app, express) {
    var path = require('path');
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var mysql = require('mysql');
    var upload = multer();
    var utils = require('./ES6-Utils');
    var sendMail = require('./ES6-mail');
    var fs = require('fs');

    var loginResult = {
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

    //解除上传图片大小限制，目前50
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.set('title', 'Pxtar Engine');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    var currentDir = __dirname.split('WEB-INF');
    // console.log(currentDir[0],__dirname);
    app.set('views', path.join(currentDir[0], 'public', 'views'));
    app.use(express.static(path.join(currentDir[0], 'public', 'source')));
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    app.set('port', process.env.PORT || 3000);

    var connection = mysql.createConnection(utils.con);

    connection.connect();

    //暂时测试用，之后edit页面需要改为post请求，详情查看文档
    app.get('/edit', function (req, res) {
        res.type('html');
        res.render('edit');
    });

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
        if (utils.check(username)) {
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
            res.render('personalPage', { result: msg });
        });
    });

    //暂时测试
    app.get('/personalPage', function (req, res) {
        res.type('html');
        var imgurl = [];
        var imgUrl = function imgUrl(path) {
            //图片传输
            return new Promise(function (resolve, reject) {
                fs.readdir(path, function (err, files) {
                    //读取文件夹内所有图片
                    if (err) {
                        return console.log(err);
                    }
                    files.forEach(function (filename) {
                        var file = fs.readFileSync(path + '/' + filename); //读取单个图片
                        var result = {
                            name: '画诡',
                            num: '第二话',
                            img: 'data:image/png;base64,' + file.toString('base64')
                        };
                        imgurl.push(result);
                    });
                    resolve(imgurl);
                });
            });
        };
        imgUrl('./uploads').then(function (data) {
            var datas = {
                uuid: '大神',
                nav: data
            };
            res.render('personalPage', { datas: datas });
        });
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
                if (err) return console.error(err);else {
                    ;
                    var _ref3 = [result[0].discription, result[0].photo, result[0].address, result[0].production, result[0].profession, result[0].authority];
                    msg.discription = _ref3[0];
                    msg.photo = _ref3[1];
                    msg.address = _ref3[2];
                    msg.production = _ref3[3];
                    msg.profession = _ref3[4];
                    msg.authority = _ref3[5];
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
        var _ref4 = [req.body.nickname, req.body.password, req.body.phone, req.body.email, req.body.job, utils.uuid()];
        user.nickname = _ref4[0];
        user.password = _ref4[1];
        user.phone = _ref4[2];
        user.email = _ref4[3];
        user.job = _ref4[4];
        user.uuid = _ref4[5];

        var userRandom = utils.userRandom();
        var tousers = [user.uuid, user.nickname, user.job];
        var userinfo = JSON.stringify({ 用户名: user.username, 手机: user.phone, 邮箱: user.email });
        var tologin = [user.uuid, userinfo, user.password];
        var flag = true;
        console.log(user);
        var checkUser = function checkUser() {
            return new Promise(function (resolve, reject) {
                connection.query(utils.sqls.selectAllUser, function (err, result) {
                    if (err) {
                        return console.error(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };
        checkUser().then(function (rel) {
            var l = rel.length;
            if (l !== 0) {
                console.log("start check");
                do {
                    for (var i = 0; i < l; i++) {
                        if (JSON.parse(rel[i].userInfos).用户名 === userRandom) {
                            userRandom = utils.userRandom();
                            console.log("new random");
                            break;
                        } else {
                            flag = false;
                        }
                    }
                } while (flag);
            }
        });

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

    //获取验证码
    var curChecks = {
        userstr: [],
        checkNum: []
    };
    app.post('/getCheck', upload.array(), function (req, res) {
        var user = req.body.user;
        var type = utils.check(user);
        var email = void 0;
        var search = void 0;
        if (type) {
            var str = '%' + user + '%';
            search = function search() {
                return new Promise(function (resolve, reject) {
                    connection.query(utils.sqls.logincheck, str, function (err, result) {
                        if (err || !result) {
                            return console.error(err || 'result不存在!');
                        } else {
                            email = JSON.parse(result[0].userInfos).邮箱;
                            var _checkNUm = utils.checkNum();
                            var strs = '您的验证码为:' + '<strong>' + _checkNUm + '</strong>' + '，30分钟内有效，' + '请不要告诉任何人此验证码，以免造成不必要的损失，如不是您本人操作，请忽略';
                            sendMail(email, '来自动态条漫在线编辑器的验证码', strs);
                            curChecks.checkNum.push(_checkNUm);
                            curChecks.userstr.push(user);
                        }
                        resolve(user);
                    });
                });
            };
        } else {
            return console.error('未找到用户！');
        }
        search().then(function (msg) {
            res.send('CheckNum has been send!');
        });
    });

    //提交验证码检验
    app.post('/getCheckResult', upload.array(), function (req, res) {
        var checkResult = false;
        var user = req.body.user;
        var checkNum = req.body.checkNum;
        for (var i in curChecks.userstr) {
            if (user === curChecks.userstr[i]) {
                if (checkNum === curChecks.checkNum[i]) {
                    checkResult = true;
                    curChecks.userstr.splice(i, 1);
                    curChecks.checkNum.splice(i, 1);
                }
            }
        }
        res.send(checkResult);
    });

    //找回密码
    app.post('/resetPass', upload.array(), function (req, res) {
        var user = req.body.user;
        var newPass = req.body.password;
        var userstr = '%' + user + '%';
        var curUUID = void 0;
        var search = function search() {
            return new Promise(function (resolve, reject) {
                connection.query(utils.sqls.logincheck, userstr, function (err, result) {
                    if (err || !result) {
                        return console.error(err || 'result不存在!');
                    } else {
                        curUUID = result[0].UUID;
                    }
                    resolve(curUUID, newPass);
                });
            });
        };
        search().then(function (uuid, pass) {
            var strs = [pass, uuid];
            connection.query(utils.sqls.modifyInfo.toPassword, strs, function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    res.type('html');
                    res.render('login');
                }
            });
        });
    });

    //修改密码
    app.post('/modifyPass', upload.array(), function (req, res) {
        var password = req.body.password;
        var newPass = req.body.newPass;
        var loginStatus = req.body.loginStatus;
        var curUUID = req.body.uuid;
        var modifyResult = false;
        if (loginStatus === false || !curUUID) {
            return console.error('LoginStatus or UUID error! Please correcting your loginStatus and UUID!');
        }
        var search = function search() {
            return new Promise(function (resolve, reject) {
                var strs = [newPass, curUUID];
                connection.query(utils.sqls.modifyInfo.toPassword, strs, function (err, result) {
                    if (err || !result) {
                        return console.error(err || 'result不存在!');
                    } else {
                        modifyResult = true;
                        resolve(modifyResult);
                    }
                });
            });
        };
        search().then(function (msg) {
            res.send(msg);
        });
    });

    //修改无需验证的个人信息
    app.post('/modifyNormal', upload.array(), function (req, res) {
        var datas = req.body.datas;
        var modifyResult = false;
        var search = function search() {
            return new Promise(function (resolve, reject) {
                var strs = [datas.nickname, datas.photo, datas.qq, datas.uuid];
                connection.query(utils.sqls.modifyInfo.toPassword, strs, function (err, result) {
                    if (err || !result) {
                        return console.error(err || 'result不存在!');
                    } else {
                        modifyResult = true;
                        resolve(modifyResult);
                    }
                });
            });
        };
        search().then(function (msg) {
            res.send(msg);
        });
    });

    //修改手机、邮箱
    app.post('/modifyPhoneOrEmail', upload.array(), function (req, res) {
        var userstr = req.body.phone || req.body.email;
        var uuid = req.body.uuid;
        var search = function search() {
            return new Promise(function (resolve, reject) {
                connection.query(utils.sqls.modifyInfo.selectUserInfos, uuid, function (err, result) {
                    if (err) {
                        return console.error(err);
                    } else {
                        var temp = JSON.parse(result[0].userInfos);
                        if (req.body.phone) {
                            temp.手机 = userstr;
                        } else {
                            temp.邮箱 = userstr;
                        }
                        resolve(temp);
                    }
                });
            });
        };
        search().then(function (msg) {
            connection.query(utils.sqls.modifyInfo.toUserInfo, msg, function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    return console.log('userinfos has been updated!');
                }
            });
        }).then(function () {
            res.send('userinfos has been updated!');
        });
    });

    //申请VIP
    app.post('/becomeVip', upload.array(), function (req, res) {
        var inviteNum = req.body.inviteNum;
        var uuid = req.body.uuid;
        var curAuthority = void 0;
        var search = function search() {
            return new Promise(function (resolve, reject) {
                connection.query(utils.sqls.inviteNums.isUsed, inviteNum, function (err, result) {
                    if (err || !result) {
                        return console.error(err || 'illeagal invite num!');
                    } else {
                        if (result[0].usable === 1) {
                            connection.query(utils.sqls.inviteNums.changeUsable, inviteNum, function (err, result) {
                                if (err) {
                                    return console.error(err);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            return console.error('This inviteNum has been used!');
                        }
                    }
                });
            });
        };
        search().then(function () {
            connection.query(utils.sqls.modifyInfo.toAuthority, uuid, function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    curAuthority = 2;
                    res.send({
                        'curuuid': uuid,
                        'curAuthority': curAuthority
                    });
                }
            });
        });
    });

    //新建单话
    //存储封面及信息到userinfo的production中
    //同时建立txt配置文件
    // 目前前端数据缺少用户的uuid，需要封装在req中一起传输过来
    /*
     *
     * 前端数据格式：{
     *                   uuid:'', //用户唯一标识符
     *                   name:'', //新建的名称
     *                   num:'',  //话数
     *                   imgData:'' //图片的base64数据
     *               }
     * */
    app.post('/newComic', upload.array(), function (req, res) {
        var _ref5 = [
                //req.body.uuid,
                'bda67ce4-31b1-40d9-8d65-2a8cfe468956', req.body.name, req.body.num, req.body.imgData],
            uuid = _ref5[0],
            name = _ref5[1],
            num = _ref5[2],
            imgData = _ref5[3];

        var path = 'C:/Users/Administrator/Desktop/';
        var str = void 0,
            fileName = void 0;
        var postName = 'post.png';
        utils.newDir(path, uuid);
        var findName = function findName() {
            return new Promise(function (resolve, reject) {
                connection.query(utils.sqls.findComicName, '', function (err, result) {
                    if (err || !result) {
                        return console.error(err);
                    } else {
                        var resL = result.length;
                        var flag = true;
                        for (var i = 0; i < resL; i++) {
                            if (name + num === result[i].comicName) {
                                flag = false;
                                res.send(false);
                            }
                        }
                        if (flag) {
                            resolve();
                        }
                    }
                });
            });
        };
        findName().then(function () {
            connection.query(utils.sqls.modifyInfo.getProduction, uuid, function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    if (utils.newDir(path + '/' + uuid, name + num)) {
                        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                        var dataBuffer = new Buffer(base64Data, 'base64');
                        fileName = path + uuid + '/' + name + num;
                        if (utils.newFile(fileName, postName, dataBuffer)) {
                            if (err) {
                                return console.error(err);
                            }
                        }
                        if (result[0].production !== "") {
                            var products = result[0].production + ',' + name;
                            str = [products, uuid];
                        } else {
                            str = [name, uuid];
                        }
                        connection.query(utils.sqls.modifyInfo.toProduction, str, function (err, result) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                }
            });
        }).then(function () {
            var str2 = [uuid, name + num, name + num + '.txt', utils.chToPy(name) + num, path + uuid + '/' + name + num, postName];
            connection.query(utils.sqls.insertComic, str2, function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    utils.newFile(path + uuid + '/' + name + num, name + num + '.txt', null);
                }
            });
        }).then(function () {
            res.send('success');
        });
    });

    /* app.post('/modify', imgUploader.single('file', 400), (req, res) => {
     console.log(req.body);
     res.send(req.body)
     })*/
    //用户主动触发保存 或者每隔五分钟保存
    //当前路径为桌面，部署到服务器再进行配置
    /*
     *
     * 数据结构如下： json对象名称：data
     *                       内容:{ uuid:'',
     *                              name:'',
     *                              model:{
     *
     *                               }
     *                              }
     * */
    //测试使用get，实际需改成post
    app.get('/saveAll', upload.array(), function (req, res) {
        //let datas = req.body.datas;
        //let uuid = datas.uuid;
        // let name = datas.name;
        var name = '画诡1.txt';
        var datas = { a: 'sadada', b: 'swwww', c: 'asdasafas' };
        connection.query(utils.sqls.selectComic, 'bda67ce4-31b1-40d9-8d65-2a8cfe468956', function (err, result) {
            if (err || !result) {
                return console.error(err || !result);
            } else {
                var length = result.length;
                for (var i = 0; i < length; i++) {
                    if (name === result[i].sourceName) {
                        if (utils.newFile(name, JSON.stringify(datas))) {
                            res.send('信息保存成功！');
                        }
                    }
                }
            }
        });
    });

    //about页面
    app.get('/about', function (req, res) {
        res.type('html');
        res.render('about', { Hello: 'aboutPage' });
    });

    var trunk = '<a href="/register">注册</a>';

    app.get('/', function (req, res) {
        res.type('html');
        res.render('index', { Hello: trunk });
    });

    app.use('*', function (req, res) {
        res.type('html');
        res.render('404');
    });

    app.listen(app.get('port'), function () {
        console.log('Express started on http://localhost:' + app.get('port'));
    });
};

module.exports = serverConfig;