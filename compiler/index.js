const path = require('path');
const preCompileVue = require('./vue/index');
const store = require('../store');
const rread = require('readdir-recursive');
const UglifyJS = require("uglify-js");
const CleanCSS = require('clean-css');

module.exports = function(workSrcDirectroy){
	var files = rread.fileSync(workSrcDirectroy);
	files.forEach(function(realPath){
		var relativePath = path.relative(workSrcDirectroy, realPath);
		var extName = path.extname(realPath).slice(1);
		//moduleName中反斜杠 统一写成斜杠
		var moduleName = relativePath.split(".")[0].replace(/\\/g, "/");
		if (extName == 'vue') {
			preCompileVue(realPath,moduleName);
		} else if (extName == 'js') {
			var jsStr = fs.readFileSync(realPath, {encoding:'utf8'});
			// jsStr = UglifyJS.minify(jsStr).code;
			store.set(moduleName + '.js',jsStr);
		} else if (extName == 'css') {
			var cssStr = fs.readFileSync(realPath, {encoding:'utf8'});
			cssStr = new CleanCSS({}).minify(cssStr).styles;
			store.set(moduleName + '.css',cssStr);
		}
	});
}