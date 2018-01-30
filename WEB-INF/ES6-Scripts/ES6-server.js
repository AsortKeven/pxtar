/**
 * Created by Administrator on 2017/12/15.
 */

const express = require('express');
const serverConfig = require('./ES6-serverConfig');
const app = express();

serverConfig(app,express);
