(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global)));
}(this, (function (exports) { 'use strict';

var unexpected = function (description) {
    description = description || "Unexpected token";
    throw (description);
};

var globalModules = {};
var modGetModulesExports = function (modules, buildinModules){
    var args = [];
    
    modules.forEach(function (id, index) {
        args[index] = buildinModules[id] || globalModules[id].exports;
    });

    return args;
};
var watting4preDefine = [];

var Module = function Module(option){
    this.name = option.name;
    this.deps = option.deps || ['require', 'exports', 'module'];
    this.notBuiltinDeps = this.notBuiltinDependce();
    this.caller = option.caller || [];
    this.factory = option.factory;

    //MODULE_REQUIRE = -1
    //MODULE_UNINIT = 0;
    //MODULE_INIT = 1;
    //MODULE_ANALYZED = 2;
    //MODULE_DEFINED = 3;
    this.state = option.state;
        
    //count deps but not consume default dep(['require', 'exports', 'module'])
    this.depCount = this.notBuiltinDeps.length;
    this.depCountCenter;

    this.exports = {};
    this.require = require;

    var that = this;
    Object.defineProperty(this, 'depCountCenter', {
        get: function get() {
            return that.depCount;
        },
        set: function set(newDepCount) {
            that.depCount = newDepCount;
            if (newDepCount === 0) {
                console.log(("module " + (that.name) + " 's denpendce has been ready"));
                that.invokeFactory();
            }
        }
    });

};
//0=>1
//waiting for reDefine
//entrance: modPrepare->module.modInit()
Module.prototype.modInit = function modInit (){
    nativeAsyncRequire();
};
//1=>2
Module.prototype.modPrepare = function modPrepare (){
        var this$1 = this;


    var deps = this.notBuiltinDeps;
    var factory = this.factory;
    this.state =  2;

    //本来我就没依赖....
    if(!this.depCount){
        this.invokeFactory();
    }
        
    for (var i = 0, list = deps; i < list.length; i += 1) {
        var item = list[i];

            if (globalModules[item]) {
            var module = globalModules[item];
            // state == 2 循环依赖(factory运行中)或者factory涉及异步...
            //            此时module(依赖[])的exports可能有值(看写法...amd必没值,cmd可能有) 
            // state == 1 之前define过但还没触发,"需要手动触发一下"
            // state == 0 异步模块被require过,正在异步,reDefine后会在define模块中触发 ,此处不要触发,静静等待即可
            module.state < 2 ? module.caller.push(this$1) : this$1.depCountCenter = this$1.depCount - 1;

            //正常被define的
            if(module.state == 1){
                module.modPrepare();
            }
        } else {
            //async module...

            //name first
            //The purpose is to prevent multiple references in async stage
            var module$1 = new Module({
                name:name,
                state:0
            });
            module$1.caller.push(this$1);
            globalModules[item] = module$1;

            //come on! reDefine me
            module$1.modInit();
        }
    }
};
//if depCount == 0 
//  invokeFactory();
Module.prototype.invokeFactory = function invokeFactory (){

        var this$1 = this;

    try {
        // 调用factory函数初始化module
        // 赋值this.export 或者return赋值给this.export
        var factory = this.factory;
        var exports = typeof factory === 'function'
            ? factory.apply('', modGetModulesExports(
                    this.deps,
                    {
                        require: this.require,
                        exports: this.exports,
                        module: this
                    }
                ))
            : factory;
        //none or undefined
        if (exports != null) {
            this.exports = exports;
        }
    } catch(e) {
        console.log(e);
    }

    //MODULE_DEFINED
    this.state =  3;

    //clean caller
    for(var i = 0, list = this$1.caller; i < list.length; i += 1){
        var item = list[i];

            item.depCountCenter = item.depCount - 1;
    }
    this.caller = [];
};
Module.prototype.notBuiltinDependce = function notBuiltinDependce (){
        var this$1 = this;

    var notBuiltinDeps = [];
    for(var i = 0, list = this$1.deps; i < list.length; i += 1){
        var item = list[i];

            (['require', 'exports', 'module'].indexOf(item) == -1) && notBuiltinDeps.push(item);
    }
    return notBuiltinDeps
};

var require = function (requireId, callback) {
    var option;
    if (typeof requireId === 'string') {
        return globalModules[requireId].exports;
    }else if (requireId instanceof Array) {
        option = {
            name:'IIFF',
            deps:requireId,
            factory:callback,
            state:-1
        };
    }else{
        unexpected();
    }
    var module = new Module(option);
    module.modPrepare();
};

var define = function (name, deps, factory) {
    if (typeof name === 'function' && !deps && !factory) {
        factory = name;
        name = undefined;
        deps = undefined;
    } else if (typeof name === 'string' && typeof deps === 'function') {
        factory = deps;
        deps = undefined;
    } else if (Array.isArray(name) && typeof deps === 'function') {
        factory = deps;
        deps = name;
        name = undefined;
    } else if (typeof name === 'string' && typeof factory === 'function' && deps.length == 0) {
        deps = undefined;
    }

    if (!name) {
        // unexpected('must input a moduleId');
        watting4preDefine.push({
            deps:deps,
            factory:factory
        });
    }
    var option = {
        name:name,
        deps:deps,
        factory:factory,
        state:1
    };
    if(globalModules[name] && globalModules[name].state == 0){
        //异步模块再次define来覆盖之前的占位module了
        //特殊处理一下  把之前积压的caller继承过来
        //并且， reDefine的模块代表之前被require了 
        //立刻prepare!!!
        option.caller = globalModules[name].caller;

    }
    var module = new Module(option);
    globalModules[name] = module;

};
define.amd = {
    multiversion: true
};

exports.require = require;
exports.define = define;
exports.globalModules = globalModules;

Object.defineProperty(exports, '__esModule', { value: true });

})));