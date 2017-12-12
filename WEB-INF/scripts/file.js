/**
 * Created by Administrator on 2017/12/8.
 * 文件操作
 */



//文件压缩模块
var archiver = require('archiver');
var fs = require('fs');
var dirPath = __dirname+'/views/';
var dir = fs.readdirSync(dirPath);
var zipPath = 'test.zip';
var output = fs.createWriteStream(zipPath);
var zipArchiver = archiver('zip');

zipArchiver.pipe(output);
for(var i=0; i < dir.length; i++) {
    console.log(dir[i]);
    zipArchiver.append(fs.createReadStream(dirPath+dir[i]), {'name': dir[i]});
}
zipArchiver.finalize();


//文件解压模块
var fs = require("fs");
var unzip = require("unzip");

fs.createReadStream('test.zip').pipe(unzip.Extract({ path: __dirname }));
