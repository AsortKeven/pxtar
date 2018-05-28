'use strict';

/**
 * Created by Administrator on 2017/12/15.
 */
var express = require('express');
var serverConfig = require('./serverConfig');
var app = express();


serverConfig(app,express);