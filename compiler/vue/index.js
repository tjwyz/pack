const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const vueCompiler = require('./vue@2.4.0-compiler');
const beautify = require('js-beautify').js_beautify
const uuidV1 = require('uuid/v1');


const log = console.log;
const UglifyJS = require("uglify-js");
const CleanCSS = require('clean-css');

const store = require('../../store');


//默认就一个template
const templateRegular = /<template>([\s\S]*)<\/template>/;
//可以有多个config
const configRegular = /<script(?:\s*)type(?:\s*)=(?:\s*)(?:"|')config(?:"|')(?:\s*)>([^<]*)<\/script>/g;
//多个script
const scriptRegular = /<script>([^<]*)<\/script>/g;
//多个style
const styleRegular = /<style(?:\s*)((?:scoped)?)(?:\s*)>([^<]*)<\/style>/g;


//require
//负向前瞻....((?!require).*)
//https://segmentfault.com/q/1010000004343668
//匹配任意字符
// var reg = /^(?!.*(公司|合伙))(.*)$/
const scriptRequireRegular = /require\((?:'|")((?!require).*)(?:'|")\)/g;
const configRequireRegular = /require\((?:'|")((?!require).*)(?:'|")\)/g;

module.exports = function ( filePath, moduleName ) {
	var templateStr = fs.readFileSync(filePath, {encoding:'utf8'});

	var template = style = script = config = '';

	var temp = '';
	var	requireTemp = '';
	var	requireArr = [];

	if(templateRegular.exec(templateStr)){
		template = templateRegular.exec(templateStr)[0];
		template = template.slice(10,-11);
	}

	while(temp = scriptRegular.exec(templateStr)){
		script = script + '\n' + temp[1];
		while( requireTemp = scriptRequireRegular.exec(temp[1]) ){
			requireArr.push(requireTemp[1]);
		}

	}

	while(temp = configRegular.exec(templateStr)){
		config = config + '\n' + temp[1];
		while( requireTemp = configRequireRegular.exec(temp[1]) ){
			requireArr.push(requireTemp[1]);
		}
	}


	while(temp = styleRegular.exec(templateStr)){
		style = style + '\n' + temp[2];
	}
	var obj = {};


	obj.requireArr = requireArr.map(function(item){
		return JSON.stringify(item);
	}).toString();
	obj.render = beautify(vueCompiler.compile(template).render, { indent_size: 4 });
	obj.staticRenderFns = beautify(vueCompiler.compile(template).staticRenderFns, { indent_size: 4 });
	obj.script = script;
	obj.config = config;
	obj.moduleName = moduleName;

	obj.scopeId = "vue-" + uuidV1();


	var loaderTpl = fs.readFileSync(path.join(__dirname, './template.tpl'), {encoding:'utf8'}); 
	var jsRet = ejs.render(loaderTpl, obj); 
	var cssRet = style;


	jsRet = UglifyJS.minify(jsRet).code;
	cssRet = new CleanCSS({}).minify(cssRet).styles;

	store.set(obj.moduleName + '.js',jsRet);
	store.set(obj.moduleName + '.css',cssRet);
}
