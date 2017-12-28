/**
 * Created by Administrator on 2017/12/27.
 */
/**
 * Created by Administrator on 2017/12/6.
 * 工具模块，尽量将工具封装
 */
var fs = require('fs');
var pinyin = require('pinyin');
var crypto = require('crypto.js');
var utils = {

    //连接参数
    con: {
        host: 'localhost',
        user: 'root',
        password: 'rung',
        database: 'pxtar'
    },

    //sql语句封装
    sqls: {
        register: {
            toUsers: 'insert into userinfo(UUID,nickName,profession) values(?,?,?)',
            toLogin: 'insert into logininfo(UUID,userinfos,password) values(?,?,?)'
        },
        modifyInfo: {
            toIdentity: 'update userinfo set identity = ? where uuid=?',
            toDiscription: 'update userinfo set discription = ? where uuid=?',
            toPhoto: 'update userinfo set photo = ? where uuid=?',
            toAddress: 'update userinfo set address = ? where uuid=?',
            toProduction: 'update userinfo set production = ? where uuid=?'
        },
        logincheck: 'select * from logininfo where userinfos like ?',
        selectUserinfo: 'select * from userinfo where uuid=?',
        selectLogininfo: 'select * from logininfo where uuid=?'
    },


    //复制当前路径下的文件夹到当前路径的新文件夹中
    createAndCopy: function (existDir, createDir) {
        var source = __dirname + '/' + existDir;
        var destination = __dirname + '/' + createDir;
        fs.mkdir(destination, function (err) {
            if (err)
                return console.error(err);
            else
                console.log("Create dir " + createDir + " finish");
        });

        var list = fs.readdirSync(source);

        for (var i = 0; i < list.length; i++) {
            fs.createReadStream(source + '/' + list[i]).pipe(fs.createWriteStream(destination + '/' + list[i]));
        }
        console.log('Files copy success!');
    },

    //生成uuid
    uuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },

    //生成用户名
    userRandom: function () {
        var s = 'pxtar';
        var hexDigits = '0123456789';
        for (var i = 0; i < 6; i++) {
            s += hexDigits.substr(Math.floor(Math.random() * 10), 1);
        }
        return s;
    },

    //汉字转拼音
    chToPy: function (str) {
        var temp = pinyin(str, {
            style: pinyin.STYLE_FIRST_LETTER,
            hetetonym: true
        });
        var final = '';
        for (var i = 0; i < temp.length; i++) {
            final += temp[i].toString();
        }
        return final;
    },
    //密码转base64
    strToBase64: function (str, key) {
        return crypto.cipher('aes-128-cbc', str, key);
    },

    //base64转回密码
    base64ToStr: function (str, key) {
        return crypto.decipher('aes-128-cbc', str, key);
    },

    //检验对应参数是否符合规范
    check: function (userstr) {
        if (userstr.match(/^(pxtar)/)) {
            console.log("it's username");
            return 'username';
        }
        else if (userstr.match(/.*@.*/)) {
            console.log("it's email");
            return 'email';
        }
        else if ((/^1[3|4|5|8][0-9]\d{8}$/.test(userstr))) {
            console.log("it's a phone");
            return 'phone';
        }
        else
            return console.error('it`s not a correct userstr!');
    },

    //压缩文件
    zipFile: function zipFile() {
        var dirPath = __dirname + '/views/';
        var dir = fs.readdirSync(dirPath);
        var zipPath = 'test.zip';
        var output = fs.createWriteStream(zipPath);
        var zipArchiver = archiver('zip');

        zipArchiver.pipe(output);

        for (var i = 0; i < dir.length; i++) {
            zipArchiver.append(fs.createReadStream(dirPath + dir[i]), {'name': dir[i]});
        }
        zipArchiver.finalize();
    },

    //解压文件
    unzipFile: function unzipFile(filename, unzipPath) {
        fs.createReadStream(filename).pipe(unzip.Extract({path: unzipPath}));
    }

};

exports = module.exports = utils;