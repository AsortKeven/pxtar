/**
 * Created by Administrator on 2017/12/14.
 */
const fs = require('fs');
const pinyin = require('pinyin');
const crypto = require('crypto.js');
const  archiver = require('archiver');
const unzip = require("unzip");

const utils = {
    con:{
        host:'localhost',
        user:'root',
        password:'123456',
        database:'pxtar'
    },

    sqls: {
        inviteNums:{
            getAll:'select * from inviteNums',
            isUsed:'select usable from invitenums where inviteNum = ?',
            changeUsable:'update invitenums set usable = "0" where inviteNum = ?'
        },
        register: {
            toUsers: 'insert into userinfo(UUID,nickName,profession) values(?,?,?)',
            toLogin: 'insert into logininfo(UUID,userInfos,password) values(?,?,?)'
        },
        modifyInfo: {
            toAuthority:'update userinfo set authority = "2" where uuid = ?',
            toDiscription: 'update userinfo set discription = ? where uuid = ?',
            toAddress: 'update userinfo set address = ? where uuid = ?',
            getProduction:'select production from userinfo where uuid = ?',
            toProduction: 'update userinfo set production = ? where uuid = ?',
            toPassword: 'update logininfo set password = ? where uuid = ?',
            toNormal: 'update userinfo set nickname = ?,photo = ?,qq = ? where uuid = ?',
            toUserInfo:'update logininfo set userInfos = ? where uuid = ?',
            selectUserInfos:'select userInfos from logininfo where uuid = ?'
        },
        selectComic: 'select * from comics where uuid = ?',
        insertComic:'insert into comics(uuid,comicName,sourceName) values(?,?,?)',
        logincheck: 'select * from logininfo where userinfos like ?',
        selectUserinfo: 'select * from userinfo where uuid=?',
        selectLogininfo: 'select * from logininfo where uuid=?'
    },

    //新建配置文件,当前默认到桌面
    newFile: (name, infos) => {
        let destination = 'C:/Users/Administrator/Desktop/' + name;
        fs.writeFile(destination, infos, (err) => {
            if (err)
                return console.error(err);
        });
        return true;
    },

    //文件夹的复制
    createAndCopy:(exsitDir, newDir)=>{
        let source = __dirname + '/' + exsitDir;
        let destination = __dirname + '/' +newDir;

        fs.mkdir(destination,(err)=>{
            if(err)
                return console.error(err);
            else
                console.log('Create dir'+ newDir + 'success');
        });

        let list = fs.readdirSync(source);

        for(let i in list){
            fs.createReadStream(source + '/' + list[i]).pipe(fs.createWriteStream(destination + '/' + list[i]));
        }
        console.log('Files copy success!');
    },

    //uuid生成
    uuid: () => {
        let s = [];
        let hexDigits = '0123456789abcdef';

        for(let i = 0; i < 36; i++){
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10),1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    },

    //生成用户名
    userRandom: ()=>{
        let s ='pxtar';
        let hexDigits = '0123456789';
        for(let i = 0; i < 6; i++){
            s += hexDigits.substr(Math.floor(Math.random() * 10), 1);
        }
        return s;
    },

    //生成验证码
    checkNum:()=>{
        let s =[];
        let hexDigits ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for(let i = 0; i < 6; i++){
            s[i] = hexDigits.substr(Math.floor(Math.random() * 62),1);
        }
        return s.join("");
    },

    //汉字转拼音
    chToPy:(str)=>{

        let temp = pinyin(str,{
            style:pinyin.STYLE_FIRST_LETTER,
            heteronym:true
        });

        let final = '';
        for(let i = 0; i < temp.length; i ++){
            final += temp[i].toString();
        }

        return final;
    },

    //字符串转base64
    strToBase64:(str,key)=>{
        return crypto.cipher('aes-128-cbc',str,key);
    },

    //base64转字符串
    base64ToStr:(str,key)=>{
        return crypto.decipher('aes-128-cbc',str,key);
    },

    //检查登录信息
    check:(userstr)=>{
        if (userstr.match(/^(pxtar)/)) {
            console.log("it's username");
            return true;
        }
        else if (userstr.match(/.*@.*/)) {
            console.log("it's email");
            return true;
        }
        else if (/^1[3|4|5|8][0-9]\d{8}$/.test(userstr)) {
            console.log("it's a phone");
            return true;
        }
        else
            return false;
    },

    //压缩文件
    zipFile:()=>{
        const dirPath = __dirname + '/views/';
        const  dir = fs.readdirSync(dirPath);
        const  zipPath = 'test.zip';
        const output = fs.createWriteStream(zipPath);
        const  zipArchiver = archiver('zip');

        zipArchiver.pipe(output);

        for(let i =0; i < dir.length; i++){
            zipArchiver.append(fs.createReadStream(dirPath+dir[i]), {'name': dir[i]});
        }
        zipArchiver.finalize();
    },

    //解压文件
    unzipFile:(filename,unzipPath)=>{
        fs.createReadStream(filename).pipe(unzip.Extract({ path: unzipPath }));
    }
};

exports = module.exports = utils;