/**
 * Created by Administrator on 2017/12/14.
 */

var pinyin = require('pinyin');
var utils = require('./utils');
function result(str) {
    var temp = pinyin(str, {
        style: pinyin.STYLE_FIRST_LETTER,
        hetetonym: true
    });
    var final ='';
    for(var i = 0; i < temp.length; i++){
        final += temp[i].toString();
    }
    return final;
}

console.log(result('中国'));


var str = '123456';
//加密
str = utils.strToBase64(str,'its my key');
console.log(str);
//解密
var str2 = utils.base64ToStr(str,'its my key');
console.log(str2);