/**
 * Created by Administrator on 2017/12/14.
 */

var pinyin = require('pinyin');

function result(str){
    return pinyin(str,{
        style:pinyin.STYLE_FIRST_LETTER,
        hetetonym:true
    })
}

console.log(result('中国'));