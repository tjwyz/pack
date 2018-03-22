const path = require('path');
const rread = require('readdir-recursive');
const store = require('../store');
const replaceString = require('replace-string');

// 想用一个完美的正则实现 捕获是否存在__inline  失败了..
// const scriptForHtml = /<script(?:\s*)type=(?:"|')text\/javascript(?:"|')(?:\s*)src=(?:"|')((?!__inline).*)((?:__inline)?)(?:"|')>([^<]*)<\/script>/g;
const scriptForHtml =  /<script(?:\s*)type=(?:"|')text\/javascript(?:"|')(?:\s*)src=(?:"|')([^<]*)(?:"|')>([^<]*)<\/script>/g;
//默认就一个template
const styleForHtml = /<link(?:\s*)rel=(?:"|')stylesheet(?:"|')(?:\s*)type=(?:"|')text\/css(?:"|')(?:\s*)href=(?:"|')([^<]*)(?:"|')\/>/g;

//可以有多个config

const scriptForScript = /__inline/g;
const styleForStyle = /__inline/g;


module.exports = function (workSrcDirectroy) {
	var files = rread.fileSync(workSrcDirectroy);
	var temp = '';

	files.forEach(function(realPath){
		var relativePath = path.relative(workSrcDirectroy, realPath);
		var extName = path.extname(realPath).slice(1);
		//moduleName中反斜杠 统一写成斜杠
		var moduleName = relativePath.split(".")[0].replace(/\\/g, "/");

		// if (extName == 'js') {
		// 	var jsStr = fs.readFileSync(realPath, {encoding:'utf8'});

		// 	while(temp = scriptForScript.exec(jsStr)){
		// 		script = script + '\n' + temp[1];

		// 	}

		// } else if (extName == 'css') {
		// 	var cssStr = fs.readFileSync(realPath, {encoding:'utf8'});

		// 	while(temp = scriptForScript.exec(jsStr)){
		// 		script = script + '\n' + temp[1];
		// 	}
		if (extName == 'html') {
			var htmlStr = fs.readFileSync(realPath, {encoding:'utf8'});
			var jsCbArray = [];
			var cssCbArray = [];
			while(temp = scriptForHtml.exec(htmlStr)){
				if (temp[2]) {
					return;
				}
				var srcName = temp[1];

				if (srcName.indexOf("__inline") > -1) {
					srcName = replaceString(srcName, '__inline', '');
					var storeInMemory = store.get(srcName);
					if(storeInMemory){
						jsCbArray.push({
							from: temp[0],
							to: '<script>' + storeInMemory + '</script>'
						});
					}
				}else {
					var storeInMemory = store.get(srcName);
					if(storeInMemory){
						jsCbArray.push({
							from: temp[0],
							to: '<script type="text/javascript" src=/static/' + srcName + '></script>'
						});
					}
				}
			}

			
			while(temp = styleForHtml.exec(htmlStr)){
				var storeInMemory = store.get(temp[1]);
				if(storeInMemory){
					cssCbArray.push({
						from: temp[0],
						to: '<style>' + storeInMemory + '</style>'
					});
				}
			}
			jsCbArray.forEach(function(item){
				htmlStr = replaceString(htmlStr, item.from, item.to);
			})
			cssCbArray.forEach(function(item){
				htmlStr = replaceString(htmlStr, item.from, item.to);
			})
			// console.log(htmlStr);
			store.set(moduleName + '.html',htmlStr);
		}
	});
}