/**
 * Created by Administrator on 2018/1/30.
 */

const serverConfig = (app, express) => {
    const path = require('path');
    const bodyParser = require('body-parser');
    const multer = require('multer');
    const mysql = require('mysql');
    const upload = multer();
    const utils = require('./ES6-Utils');
    const sendMail = require('./ES6-mail');
    const fs = require('fs');

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

    //解除上传图片大小限制，目前50
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    app.set('title', 'Pxtar Engine');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    let currentDir = __dirname.split('WEB-INF');
    // console.log(currentDir[0],__dirname);
    app.set('views', path.join(currentDir[0], 'public', 'views'));
    app.use(express.static(path.join(currentDir[0], 'public', 'source')));
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    app.set('port', process.env.PORT || 3000);

    const connection = mysql.createConnection(utils.con);

    connection.connect();

//暂时测试用，之后edit页面需要改为post请求，详情查看文档
    app.get('/edit', (req, res) => {
        res.type('html');
        res.render('edit');
    });

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
        if (utils.check(username)) {
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
            res.render('personalPage', {result: msg});
        })
    });

    //暂时测试
    app.get('/personalPage', (req, res) => {
        res.type('html');
        let imgurl = [];
        let imgUrl = (path) => {//图片传输
            return new Promise((resolve, reject) => {
                fs.readdir(path, (err, files) => {//读取文件夹内所有图片
                    if (err) {
                        return console.log(err)
                    }
                    files.forEach((filename) => {
                        let file = fs.readFileSync(path + '/' + filename);//读取单个图片
                        let result = {
                            name: '画诡',
                            num: '第二话',
                            img: 'data:image/png;base64,' + file.toString('base64')
                        }
                        imgurl.push(result);
                    });
                    resolve(imgurl)
                });
            })
        };
        imgUrl('./uploads').then((data) => {
            let datas = {
                uuid: '大神',
                nav: data
            };
            res.render('personalPage', {datas: datas});
        })
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
                connection.query(utils.sqls.selectAllUser, function (err, result) {
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
                let l = rel.length;
                if (l !== 0) {
                    console.log("start check");
                    do {
                        for (let i = 0; i < l; i++) {
                            if (JSON.parse(rel[i].userInfos).用户名 === userRandom) {
                                userRandom = utils.userRandom();
                                console.log("new random");
                                break;
                            }
                            else {
                                flag = false;
                            }
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

//获取验证码
    let curChecks = {
        userstr: [],
        checkNum: []
    };
    app.post('/getCheck', upload.array(), (req, res) => {
        let user = req.body.user;
        let type = utils.check(user);
        let email;
        let search;
        if (type) {
            let str = '%' + user + '%';
            search = () => {
                return new Promise((resolve, reject) => {
                    connection.query(utils.sqls.logincheck, str, (err, result) => {
                        if (err || !result) {
                            return console.error(err || 'result不存在!');
                        } else {
                            email = JSON.parse(result[0].userInfos).邮箱;
                            let _checkNUm = utils.checkNum();
                            let strs = '您的验证码为:' + '<strong>' + _checkNUm + '</strong>' + '，30分钟内有效，' +
                                '请不要告诉任何人此验证码，以免造成不必要的损失，如不是您本人操作，请忽略';
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
        search().then((msg) => {
            res.send('CheckNum has been send!');
        })
    });

//提交验证码检验
    app.post('/getCheckResult', upload.array(), (req, res) => {
        let checkResult = false;
        let user = req.body.user;
        let checkNum = req.body.checkNum;
        for (let i in curChecks.userstr) {
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
    app.post('/resetPass', upload.array(), (req, res) => {
        let user = req.body.user;
        let newPass = req.body.password;
        let userstr = '%' + user + '%';
        let curUUID;
        let search = () => {
            return new Promise((resolve, reject) => {
                connection.query(utils.sqls.logincheck, userstr, (err, result) => {
                    if (err || !result) {
                        return console.error(err || 'result不存在!');
                    } else {
                        curUUID = result[0].UUID;
                    }
                    resolve(curUUID, newPass);
                })
            })
        };
        search().then((uuid, pass) => {
            let strs = [pass, uuid];
            connection.query(utils.sqls.modifyInfo.toPassword, strs, (err, result) => {
                if (err) {
                    return console.error(err);
                } else {
                    res.type('html');
                    res.render('login');
                }
            })
        })

    });


//修改密码
    app.post('/modifyPass', upload.array(), (req, res) => {
        let password = req.body.password;
        let newPass = req.body.newPass;
        let loginStatus = req.body.loginStatus;
        let curUUID = req.body.uuid;
        let modifyResult = false;
        if (loginStatus === false || !curUUID) {
            return console.error('LoginStatus or UUID error! Please correcting your loginStatus and UUID!');
        }
        let search = () => {
            return new Promise((resolve, reject) => {
                let strs = [newPass, curUUID];
                connection.query(utils.sqls.modifyInfo.toPassword, strs, (err, result) => {
                    if (err || !result) {
                        return console.error(err || 'result不存在!');
                    } else {
                        modifyResult = true;
                        resolve(modifyResult);
                    }
                });
            })
        };
        search().then((msg) => {
            res.send(msg);
        });
    });

//修改无需验证的个人信息
    app.post('/modifyNormal', upload.array(), (req, res) => {
        let datas = req.body.datas;
        let modifyResult = false;
        let search = () => {
            return new Promise((resolve, reject) => {
                let strs = [datas.nickname, datas.photo, datas.qq, datas.uuid];
                connection.query(utils.sqls.modifyInfo.toPassword, strs, (err, result) => {
                    if (err || !result) {
                        return console.error(err || 'result不存在!');
                    } else {
                        modifyResult = true;
                        resolve(modifyResult);
                    }
                });
            })
        };
        search().then((msg) => {
            res.send(msg);
        });
    });

//修改手机、邮箱
    app.post('/modifyPhoneOrEmail', upload.array(), (req, res) => {
        let userstr = req.body.phone || req.body.email;
        let uuid = req.body.uuid;
        let search = () => {
            return new Promise((resolve, reject) => {
                connection.query(utils.sqls.modifyInfo.selectUserInfos, uuid, (err, result) => {
                    if (err) {
                        return console.error(err);
                    }
                    else {
                        let temp = JSON.parse(result[0].userInfos);
                        if (req.body.phone) {
                            temp.手机 = userstr;
                        } else {
                            temp.邮箱 = userstr;
                        }
                        resolve(temp);
                    }
                })
            })
        };
        search()
            .then((msg) => {
                connection.query(utils.sqls.modifyInfo.toUserInfo, msg, (err, result) => {
                    if (err) {
                        return console.error(err);
                    } else {
                        return console.log('userinfos has been updated!');
                    }
                });
            }).then(() => {
            res.send('userinfos has been updated!');
        })
    });

//申请VIP
    app.post('/becomeVip', upload.array(), (req, res) => {
        let inviteNum = req.body.inviteNum;
        let uuid = req.body.uuid;
        let curAuthority;
        let search = () => {
            return new Promise((resolve, reject) => {
                connection.query(utils.sqls.inviteNums.isUsed, inviteNum, (err, result) => {
                    if (err || !result) {
                        return console.error(err || 'illeagal invite num!');
                    } else {
                        if (result[0].usable === 1) {
                            connection.query(utils.sqls.inviteNums.changeUsable, inviteNum, (err, result) => {
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
                })
            })
        };
        search().then(() => {
            connection.query(utils.sqls.modifyInfo.toAuthority, uuid, (err, result) => {
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
        })
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
    app.post('/newComic', upload.array(), (req, res) => {
        let [
            uuid,
            name,
            num,
            imgData
        ] = [
            //req.body.uuid,
            'bda67ce4-31b1-40d9-8d65-2a8cfe468956',
            req.body.name,
            req.body.num,
            req.body.imgData
        ];
        let path = 'C:/Users/Administrator/Desktop/';
        let str, fileName;
        let postName = 'post.png';
        utils.newDir(path, uuid);
        let findName = () => {
            return new Promise((resolve, reject) => {
                connection.query(utils.sqls.findComicName, '', (err, result) => {
                    if (err || !result) {
                        return console.error(err)
                    } else {
                        let resL = result.length;
                        let flag = true;
                        for (let i = 0; i < resL; i++) {
                            if (name + num === result[i].comicName) {
                                flag = false;
                                res.send(false);
                            }
                        }
                        if (flag) {
                            resolve();
                        }
                    }
                })
            })
        };
        findName().then(() => {
            connection.query(utils.sqls.modifyInfo.getProduction, uuid, (err, result) => {
                if (err) {
                    return console.error(err);
                } else {
                    if (utils.newDir(path + '/' + uuid, name + num)) {
                        let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                        let dataBuffer = new Buffer(base64Data, 'base64');
                        fileName = path + uuid + '/' + name + num;
                        if (utils.newFile(fileName, postName, dataBuffer)) {
                            if (err) {
                                return console.error(err);
                            }
                        }
                        if (result[0].production !== "") {
                            let products = result[0].production + ',' + name;
                            str = [products, uuid];
                        } else {
                            str = [name, uuid];
                        }
                        connection.query(utils.sqls.modifyInfo.toProduction, str, (err, result) => {
                            if (err) {
                                return console.error(err);
                            }
                        })
                    }
                }
            });
        }).then(() => {
            let str2 = [uuid, name + num, name + num + '.txt', utils.chToPy(name) + num, path + uuid + '/' + name + num, postName];
            connection.query(utils.sqls.insertComic, str2, (err, result) => {
                if (err) {
                    return console.error(err);
                } else {
                    utils.newFile(path + uuid + '/' + name + num, name + num + '.txt', null)
                }
            })
        }).then(() => {
            res.send('success');
        })
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
    app.get('/saveAll', upload.array(), (req, res) => {
        //let datas = req.body.datas;
        //let uuid = datas.uuid;
        // let name = datas.name;
        let name = '画诡1.txt';
        let datas = {a: 'sadada', b: 'swwww', c: 'asdasafas'};
        connection.query(utils.sqls.selectComic, 'bda67ce4-31b1-40d9-8d65-2a8cfe468956', (err, result) => {
            if (err || !result) {
                return console.error(err || !result);
            } else {
                let length = result.length;
                for (let i = 0; i < length; i++) {
                    if (name === result[i].sourceName) {
                        if (utils.newFile(name, JSON.stringify(datas))) {
                            res.send('信息保存成功！');
                        }
                    }
                }
            }
        })
    });

    //about页面
    app.get('/about', (req, res) => {
        res.type('html');
        res.render('about', {Hello: 'aboutPage'});
    });

    let trunk = '<a href="/register">注册</a>';

    app.get('/', (req, res) => {
        res.type('html');
        res.render('index', {Hello: trunk});
    });

    app.use('*', (req, res) => {
        res.type('html');
        res.render('404');
    });

    app.listen(app.get('port'), () => {
        console.log('Express started on http://localhost:' + app.get('port'));
    });
};

module.exports = serverConfig;