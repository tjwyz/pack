#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const ejs = require('ejs');
const program = require('commander');
const shell = require("shelljs");
const chalk = require('chalk');
const timestamp = require('time-stamp');
const writeFile = require('write');
const log = console.log;
const store = require('./store');
program
  .version('0.0.1','-v, --version')
  .option('-h, --help', 'helpInfomation')
  .parse(process.argv);

const commander = program.parse(process.argv);



var configFilePath = commander.args[0] || 'vtp.config.js';
configFilePath = path.normalize(process.cwd() + '/' + configFilePath);
var configCwdPath = path.dirname(configFilePath);
var config = require(configFilePath);
var workSrcDirectroy = path.normalize(configCwdPath + '/' + config.src);
var outPutDirectroy = path.normalize(configCwdPath + '/' + config.output);



var compiler = require('./compiler/index');
var packer = require('./packer/index');




var compiling = false;


chokidar.watch(workSrcDirectroy, {ignored: /(^|[\/\\])\../}).on('change', (event, currenpath) => {
	if (compiling) {
		return;
	}
	var startTime = new Date().getTime();
	compiling = true;

	log(chalk.green(timestamp('YYYY/MM/DD HH:mm:ss')));
	// 1 compile 编译
	compiler(workSrcDirectroy);
	log(chalk.green('compile has been done!'));
	
	// 2. pack  打包
	packer(workSrcDirectroy);
	log(chalk.green('pack has been done!'));
	
	// 3.release 发布
	// console.log(store.all());
	var output = store.all();
	// shell.mkdir('-p', outPutDirectroy);
	// shell.cd(outPutDirectroy);
	for (var i in output) {
		writeFile.sync(path.normalize(outPutDirectroy + '/' + i),output[i]);
		// console.log(path.normalize(outPutDirectroy +  i));
	}
	// shell.cd('-');
	log(chalk.green('release has been done!'));
	var endTime = new Date().getTime();
	compiling = false;
	log(chalk.red('%s s has been used up!'), (endTime - startTime) / 1000);
});