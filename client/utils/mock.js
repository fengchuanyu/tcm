(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Mock"] = factory();
	else
		root["Mock"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
 
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
 
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
 
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
 
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
 
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
 
 
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
 
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
 
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
 
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {
 
	/* global require, module, window */
	var Handler = __webpack_require__(1)
	var Util = __webpack_require__(3)
	var Random = __webpack_require__(5)
	var RE = __webpack_require__(20)
	var toJSONSchema = __webpack_require__(23)
	var valid = __webpack_require__(25)
 
	var XHR
	if (typeof window !== 'undefined') XHR = __webpack_require__(27)
 
	/*!
	    Mock - ģ������ & ģ������
	    https://github.com/nuysoft/Mock
	    ī�� mozhi.gyy@taobao.com nuysoft@gmail.com
	*/
	var Mock = {
	    Handler: Handler,
	    Random: Random,
	    Util: Util,
	    XHR: XHR,
	    RE: RE,
	    toJSONSchema: toJSONSchema,
	    valid: valid,
	    heredoc: Util.heredoc,
	    setup: function(settings) {
	        return XHR.setup(settings)
	    },
	    _mocked: {}
	}
 
	Mock.version = '1.0.1-beta3'
 
	// ����ѭ������
	if (XHR) XHR.Mock = Mock
 
	/*
	    * Mock.mock( template )
	    * Mock.mock( function() )
	    * Mock.mock( rurl, template )
	    * Mock.mock( rurl, function(options) )
	    * Mock.mock( rurl, rtype, template )
	    * Mock.mock( rurl, rtype, function(options) )
	    ��������ģ������ģ�����ݡ�
	*/
	Mock.mock = function(rurl, rtype, template) {
	    // Mock.mock(template)
	    if (arguments.length === 1) {
	        return Handler.gen(rurl)
	    }
	    // Mock.mock(rurl, template)
	    if (arguments.length === 2) {
	        template = rtype
	        rtype = undefined
	    }
	    // ���� XHR
	    if (XHR) window.XMLHttpRequest = XHR
	    Mock._mocked[rurl + (rtype || '')] = {
	        rurl: rurl,
	        rtype: rtype,
	        template: template
	    }
	    return Mock
	}
 
	module.exports = Mock
 
/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {
 
	/* 
	    ## Handler
	    ��������ģ�塣
	    
	    * Handler.gen( template, name?, context? )
	        ��ڷ�����
	    * Data Template Definition, DTD
	        
	        ��������ģ�嶨�塣
	        * Handler.array( options )
	        * Handler.object( options )
	        * Handler.number( options )
	        * Handler.boolean( options )
	        * Handler.string( options )
	        * Handler.function( options )
	        * Handler.regexp( options )
	        
	        ����·������Ժ;��ԣ���
	        * Handler.getValueByKeyPath( key, options )
	    * Data Placeholder Definition, DPD
	        ��������ռλ������
	        * Handler.placeholder( placeholder, context, templateContext, options )
	*/
 
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var Parser = __webpack_require__(4)
	var Random = __webpack_require__(5)
	var RE = __webpack_require__(20)
 
	var Handler = {
	    extend: Util.extend
	}
 
	/*
	    template        ����ֵ��������ģ�壩
	    name            ������
	    context         ���������ģ����ɺ������
	    templateContext ģ�������ģ�
	    Handle.gen(template, name, options)
	    context
	        currentContext, templateCurrentContext, 
	        path, templatePath
	        root, templateRoot
	*/
	Handler.gen = function(template, name, context) {
	    /* jshint -W041 */
	    name = name == undefined ? '' : (name + '')
 
	    context = context || {}
	    context = {
	            // ��ǰ����·����ֻ�������������������ɹ���
	            path: context.path || [Constant.GUID],
	            templatePath: context.templatePath || [Constant.GUID++],
	            // ��������ֵ��������
	            currentContext: context.currentContext,
	            // ����ֵģ���������
	            templateCurrentContext: context.templateCurrentContext || template,
	            // ����ֵ�ĸ�
	            root: context.root || context.currentContext,
	            // ģ��ĸ�
	            templateRoot: context.templateRoot || context.templateCurrentContext || template
	        }
	        // console.log('path:', context.path.join('.'), template)
 
	    var rule = Parser.parse(name)
	    var type = Util.type(template)
	    var data
 
	    if (Handler[type]) {
	        data = Handler[type]({
	            // ����ֵ����
	            type: type,
	            // ����ֵģ��
	            template: template,
	            // ������ + ���ɹ���
	            name: name,
	            // ������
	            parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,
 
	            // ����������ɹ���
	            rule: rule,
	            // ���������
	            context: context
	        })
 
	        if (!context.root) context.root = data
	        return data
	    }
 
	    return template
	}
 
	Handler.extend({
	    array: function(options) {
	        var result = [],
	            i, ii;
 
	        // 'name|1': []
	        // 'name|count': []
	        // 'name|min-max': []
	        if (options.template.length === 0) return result
 
	        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
	        if (!options.rule.parameters) {
	            for (i = 0; i < options.template.length; i++) {
	                options.context.path.push(i)
	                options.context.templatePath.push(i)
	                result.push(
	                    Handler.gen(options.template[i], i, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })
	                )
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            }
	        } else {
	            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
	            if (options.rule.min === 1 && options.rule.max === undefined) {
	                // fix #17
	                options.context.path.push(options.name)
	                options.context.templatePath.push(options.name)
	                result = Random.pick(
	                    Handler.gen(options.template, undefined, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })
	                )
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            } else {
	                // 'data|+1': [{}, {}]
	                if (options.rule.parameters[2]) {
	                    options.template.__order_index = options.template.__order_index || 0
 
	                    options.context.path.push(options.name)
	                    options.context.templatePath.push(options.name)
	                    result = Handler.gen(options.template, undefined, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })[
	                        options.template.__order_index % options.template.length
	                    ]
 
	                    options.template.__order_index += +options.rule.parameters[2]
 
	                    options.context.path.pop()
	                    options.context.templatePath.pop()
 
	                } else {
	                    // 'data|1-10': [{}]
	                    for (i = 0; i < options.rule.count; i++) {
	                        // 'data|1-10': [{}, {}]
	                        for (ii = 0; ii < options.template.length; ii++) {
	                            options.context.path.push(result.length)
	                            options.context.templatePath.push(ii)
	                            result.push(
	                                Handler.gen(options.template[ii], result.length, {
	                                    path: options.context.path,
	                                    templatePath: options.context.templatePath,
	                                    currentContext: result,
	                                    templateCurrentContext: options.template,
	                                    root: options.context.root || result,
	                                    templateRoot: options.context.templateRoot || options.template
	                                })
	                            )
	                            options.context.path.pop()
	                            options.context.templatePath.pop()
	                        }
	                    }
	                }
	            }
	        }
	        return result
	    },
	    object: function(options) {
	        var result = {},
	            keys, fnKeys, key, parsedKey, inc, i;
 
	        // 'obj|min-max': {}
	        /* jshint -W041 */
	        if (options.rule.min != undefined) {
	            keys = Util.keys(options.template)
	            keys = Random.shuffle(keys)
	            keys = keys.slice(0, options.rule.count)
	            for (i = 0; i < keys.length; i++) {
	                key = keys[i]
	                parsedKey = key.replace(Constant.RE_KEY, '$1')
	                options.context.path.push(parsedKey)
	                options.context.templatePath.push(key)
	                result[parsedKey] = Handler.gen(options.template[key], key, {
	                    path: options.context.path,
	                    templatePath: options.context.templatePath,
	                    currentContext: result,
	                    templateCurrentContext: options.template,
	                    root: options.context.root || result,
	                    templateRoot: options.context.templateRoot || options.template
	                })
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            }
 
	        } else {
	            // 'obj': {}
	            keys = []
	            fnKeys = [] // #25 �ı��˷Ǻ������Ե�˳�򣬲�������������
	            for (key in options.template) {
	                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
	            }
	            keys = keys.concat(fnKeys)
 
	            /*
	                ��ı�Ǻ������Ե�˳��
	                keys = Util.keys(options.template)
	                keys.sort(function(a, b) {
	                    var afn = typeof options.template[a] === 'function'
	                    var bfn = typeof options.template[b] === 'function'
	                    if (afn === bfn) return 0
	                    if (afn && !bfn) return 1
	                    if (!afn && bfn) return -1
	                })
	            */
 
	            for (i = 0; i < keys.length; i++) {
	                key = keys[i]
	                parsedKey = key.replace(Constant.RE_KEY, '$1')
	                options.context.path.push(parsedKey)
	                options.context.templatePath.push(key)
	                result[parsedKey] = Handler.gen(options.template[key], key, {
	                    path: options.context.path,
	                    templatePath: options.context.templatePath,
	                    currentContext: result,
	                    templateCurrentContext: options.template,
	                    root: options.context.root || result,
	                    templateRoot: options.context.templateRoot || options.template
	                })
	                options.context.path.pop()
	                options.context.templatePath.pop()
	                    // 'id|+1': 1
	                inc = key.match(Constant.RE_KEY)
	                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
	                    options.template[key] += parseInt(inc[2], 10)
	                }
	            }
	        }
	        return result
	    },
	    number: function(options) {
	        var result, parts;
	        if (options.rule.decimal) { // float
	            options.template += ''
	            parts = options.template.split('.')
	                // 'float1|.1-10': 10,
	                // 'float2|1-100.1-10': 1,
	                // 'float3|999.1-10': 1,
	                // 'float4|.3-10': 123.123,
	            parts[0] = options.rule.range ? options.rule.count : parts[0]
	            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
	            while (parts[1].length < options.rule.dcount) {
	                parts[1] += (
	                    // ���һλ����Ϊ 0��������һλΪ 0���ᱻ JS ������Ե�
	                    (parts[1].length < options.rule.dcount - 1) ? Random.character('number') : Random.character('123456789')
	                )
	            }
	            result = parseFloat(parts.join('.'), 10)
	        } else { // integer
	            // 'grade1|1-100': 1,
	            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
	        }
	        return result
	    },
	    boolean: function(options) {
	        var result;
	        // 'prop|multiple': false, ��ǰֵ���෴ֵ�ĸ��ʱ���
	        // 'prop|probability-probability': false, ��ǰֵ���෴ֵ�ĸ���
	        result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template
	        return result
	    },
	    string: function(options) {
	        var result = '',
	            i, placeholders, ph, phed;
	        if (options.template.length) {
 
	            //  'foo': '��',
	            /* jshint -W041 */
	            if (options.rule.count == undefined) {
	                result += options.template
	            }
 
	            // 'star|1-5': '��',
	            for (i = 0; i < options.rule.count; i++) {
	                result += options.template
	            }
	            // 'email|1-10': '@EMAIL, ',
	            placeholders = result.match(Constant.RE_PLACEHOLDER) || [] // A-Z_0-9 > \w_
	            for (i = 0; i < placeholders.length; i++) {
	                ph = placeholders[i]
 
	                // ����ת��б�ܣ�����Ҫ����ռλ��
	                if (/^\\/.test(ph)) {
	                    placeholders.splice(i--, 1)
	                    continue
	                }
 
	                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)
 
	                // ֻ��һ��ռλ��������û�������ַ�
	                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) { // 
	                    result = phed
	                    break
 
	                    if (Util.isNumeric(phed)) {
	                        result = parseFloat(phed, 10)
	                        break
	                    }
	                    if (/^(true|false)$/.test(phed)) {
	                        result = phed === 'true' ? true :
	                            phed === 'false' ? false :
	                            phed // �Ѿ��ǲ���ֵ
	                        break
	                    }
	                }
	                result = result.replace(ph, phed)
	            }
 
	        } else {
	            // 'ASCII|1-10': '',
	            // 'ASCII': '',
	            result = options.rule.range ? Random.string(options.rule.count) : options.template
	        }
	        return result
	    },
	    'function': function(options) {
	        // ( context, options )
	        return options.template.call(options.context.currentContext, options)
	    },
	    'regexp': function(options) {
	        var source = ''
 
	        // 'name': /regexp/,
	        /* jshint -W041 */
	        if (options.rule.count == undefined) {
	            source += options.template.source // regexp.source
	        }
 
	        // 'name|1-5': /regexp/,
	        for (var i = 0; i < options.rule.count; i++) {
	            source += options.template.source
	        }
 
	        return RE.Handler.gen(
	            RE.Parser.parse(
	                source
	            )
	        )
	    }
	})
 
	Handler.extend({
	    _all: function() {
	        var re = {};
	        for (var key in Random) re[key.toLowerCase()] = key
	        return re
	    },
	    // ����ռλ����ת��Ϊ����ֵ
	    placeholder: function(placeholder, obj, templateContext, options) {
	        // console.log(options.context.path)
	        // 1 key, 2 params
	        Constant.RE_PLACEHOLDER.exec('')
	        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
	            key = parts && parts[1],
	            lkey = key && key.toLowerCase(),
	            okey = this._all()[lkey],
	            params = parts && parts[2] || ''
	        var pathParts = this.splitPathToArray(key)
 
	        // ����ռλ���Ĳ���
	        try {
	            // 1. ���Ա��ֲ���������
	            /*
	                #24 [Window Firefox 30.0 ���� ռλ�� �״�](https://github.com/nuysoft/Mock/issues/24)
	                [BX9056: ��������� window.eval ������ִ�������Ĵ��ڲ���](http://www.w3help.org/zh-cn/causes/BX9056)
	                Ӧ������ Window Firefox 30.0 �� BUG
	            */
	            /* jshint -W061 */
	            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
	        } catch (error) {
	            // 2. ���ʧ�ܣ�ֻ�ܽ���Ϊ�ַ���
	            // console.error(error)
	            // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
	            // else throw error
	            params = parts[2].split(/,\s*/)
	        }
 
	        // ռλ��������������ģ���е�����
	        if (obj && (key in obj)) return obj[key]
 
	        // @index @key
	        // if (Constant.RE_INDEX.test(key)) return +options.name
	        // if (Constant.RE_KEY.test(key)) return options.name
 
	        // ����·�� or ���·��
	        if (
	            key.charAt(0) === '/' ||
	            pathParts.length > 1
	        ) return this.getValueByKeyPath(key, options)
 
	        // �ݹ���������ģ���е�����
	        if (templateContext &&
	            (typeof templateContext === 'object') &&
	            (key in templateContext) &&
	            (placeholder !== templateContext[key]) // fix #15 �����Լ������Լ�
	        ) {
	            // �ȼ��㱻���õ�����ֵ
	            templateContext[key] = Handler.gen(templateContext[key], key, {
	                currentContext: obj,
	                templateCurrentContext: templateContext
	            })
	            return templateContext[key]
	        }
 
	        // ���δ�ҵ�����ԭ������
	        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder
 
	        // �ݹ���������е�ռλ��
	        for (var i = 0; i < params.length; i++) {
	            Constant.RE_PLACEHOLDER.exec('')
	            if (Constant.RE_PLACEHOLDER.test(params[i])) {
	                params[i] = Handler.placeholder(params[i], obj, templateContext, options)
	            }
	        }
 
	        var handle = Random[key] || Random[lkey] || Random[okey]
	        switch (Util.type(handle)) {
	            case 'array':
	                // �Զ���������ȡһ�������� @areas
	                return Random.pick(handle)
	            case 'function':
	                // ִ��ռλ������������������
	                handle.options = options
	                var re = handle.apply(Random, params)
	                if (re === undefined) re = '' // ��Ϊ�����ַ����У�����Ĭ��Ϊ���ַ�����
	                delete handle.options
	                return re
	        }
	    },
	    getValueByKeyPath: function(key, options) {
	        var originalKey = key
	        var keyPathParts = this.splitPathToArray(key)
	        var absolutePathParts = []
 
	        // ����·��
	        if (key.charAt(0) === '/') {
	            absolutePathParts = [options.context.path[0]].concat(
	                this.normalizePath(keyPathParts)
	            )
	        } else {
	            // ���·��
	            if (keyPathParts.length > 1) {
	                absolutePathParts = options.context.path.slice(0)
	                absolutePathParts.pop()
	                absolutePathParts = this.normalizePath(
	                    absolutePathParts.concat(keyPathParts)
	                )
 
	            }
	        }
 
	        key = keyPathParts[keyPathParts.length - 1]
	        var currentContext = options.context.root
	        var templateCurrentContext = options.context.templateRoot
	        for (var i = 1; i < absolutePathParts.length - 1; i++) {
	            currentContext = currentContext[absolutePathParts[i]]
	            templateCurrentContext = templateCurrentContext[absolutePathParts[i]]
	        }
	        // ���õ�ֵ�Ѿ������
	        if (currentContext && (key in currentContext)) return currentContext[key]
 
	        // ��δ���㣬�ݹ���������ģ���е�����
	        if (templateCurrentContext &&
	            (typeof templateCurrentContext === 'object') &&
	            (key in templateCurrentContext) &&
	            (originalKey !== templateCurrentContext[key]) // fix #15 �����Լ������Լ�
	        ) {
	            // �ȼ��㱻���õ�����ֵ
	            templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
	                currentContext: currentContext,
	                templateCurrentContext: templateCurrentContext
	            })
	            return templateCurrentContext[key]
	        }
	    },
	    // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
	    normalizePath: function(pathParts) {
	        var newPathParts = []
	        for (var i = 0; i < pathParts.length; i++) {
	            switch (pathParts[i]) {
	                case '..':
	                    newPathParts.pop()
	                    break
	                case '.':
	                    break
	                default:
	                    newPathParts.push(pathParts[i])
	            }
	        }
	        return newPathParts
	    },
	    splitPathToArray: function(path) {
	        var parts = path.split(/\/+/);
	        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
	        if (!parts[0]) parts = parts.slice(1)
	        return parts;
	    }
	})
 
	module.exports = Handler
 
/***/ },
/* 2 */
/***/ function(module, exports) {
 
	/*
	    ## Constant
	    �������ϡ�
	 */
	/*
	    RE_KEY
	        'name|min-max': value
	        'name|count': value
	        'name|min-max.dmin-dmax': value
	        'name|min-max.dcount': value
	        'name|count.dmin-dmax': value
	        'name|count.dcount': value
	        'name|+step': value
	        1 name, 2 step, 3 range [ min, max ], 4 drange [ dmin, dmax ]
	    RE_PLACEHOLDER
	        placeholder(*)
	    [����鿴����](http://www.regexper.com/)
	    #26 ���ɹ��� ֧�� ���������� number|-100-100
	*/
	module.exports = {
	    GUID: 1,
	    RE_KEY: /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
	    RE_RANGE: /([\+\-]?\d+)-?([\+\-]?\d+)?/,
	    RE_PLACEHOLDER: /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g
	    // /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
	    // RE_INDEX: /^index$/,
	    // RE_KEY: /^key$/
	}
 
/***/ },
/* 3 */
/***/ function(module, exports) {
 
	/*
	    ## Utilities
	*/
	var Util = {}
 
	Util.extend = function extend() {
	    var target = arguments[0] || {},
	        i = 1,
	        length = arguments.length,
	        options, name, src, copy, clone
 
	    if (length === 1) {
	        target = this
	        i = 0
	    }
 
	    for (; i < length; i++) {
	        options = arguments[i]
	        if (!options) continue
 
	        for (name in options) {
	            src = target[name]
	            copy = options[name]
 
	            if (target === copy) continue
	            if (copy === undefined) continue
 
	            if (Util.isArray(copy) || Util.isObject(copy)) {
	                if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
	                if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}
 
	                target[name] = Util.extend(clone, copy)
	            } else {
	                target[name] = copy
	            }
	        }
	    }
 
	    return target
	}
 
	Util.each = function each(obj, iterator, context) {
	    var i, key
	    if (this.type(obj) === 'number') {
	        for (i = 0; i < obj; i++) {
	            iterator(i, i)
	        }
	    } else if (obj.length === +obj.length) {
	        for (i = 0; i < obj.length; i++) {
	            if (iterator.call(context, obj[i], i, obj) === false) break
	        }
	    } else {
	        for (key in obj) {
	            if (iterator.call(context, obj[key], key, obj) === false) break
	        }
	    }
	}
 
	Util.type = function type(obj) {
	    return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
	}
 
	Util.each('String Object Array RegExp Function'.split(' '), function(value) {
	    Util['is' + value] = function(obj) {
	        return Util.type(obj) === value.toLowerCase()
	    }
	})
 
	Util.isObjectOrArray = function(value) {
	    return Util.isObject(value) || Util.isArray(value)
	}
 
	Util.isNumeric = function(value) {
	    return !isNaN(parseFloat(value)) && isFinite(value)
	}
 
	Util.keys = function(obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) keys.push(key)
	    }
	    return keys;
	}
	Util.values = function(obj) {
	    var values = [];
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) values.push(obj[key])
	    }
	    return values;
	}
 
	/*
	    ### Mock.heredoc(fn)
	    * Mock.heredoc(fn)
	    ��ֱ�ۡ���ȫ�ķ�ʽ��д�����У�HTML ģ�塣
	    **ʹ��ʾ��**������ʾ��
	        var tpl = Mock.heredoc(function() {
	            /*!
	        {{email}}{{age}}
	        <!-- Mock { 
	            email: '@EMAIL',
	            age: '@INT(1,100)'
	        } -->
	            *\/
	        })
	    
	    **����Ķ�**
	    * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)��
	*/
	Util.heredoc = function heredoc(fn) {
	    // 1. �Ƴ���ʼ�� function(){ /*!
	    // 2. �Ƴ�ĩβ�� */ }
	    // 3. �Ƴ���ʼ��ĩβ�Ŀո�
	    return fn.toString()
	        .replace(/^[^\/]+\/\*!?/, '')
	        .replace(/\*\/[^\/]+$/, '')
	        .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') // .trim()
	}
 
	Util.noop = function() {}
 
	module.exports = Util
 
/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
		## Parser
		��������ģ�壨���������֣���
		* Parser.parse( name )
			
			```json
			{
				parameters: [ name, inc, range, decimal ],
				rnage: [ min , max ],
				min: min,
				max: max,
				count : count,
				decimal: decimal,
				dmin: dmin,
				dmax: dmax,
				dcount: dcount
			}
			```
	 */
 
	var Constant = __webpack_require__(2)
	var Random = __webpack_require__(5)
 
	/* jshint -W041 */
	module.exports = {
		parse: function(name) {
			name = name == undefined ? '' : (name + '')
 
			var parameters = (name || '').match(Constant.RE_KEY)
 
			var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE)
			var min = range && range[1] && parseInt(range[1], 10) // || 1
			var max = range && range[2] && parseInt(range[2], 10) // || 1
				// repeat || min-max || 1
				// var count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1
			var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : undefined
 
			var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE)
			var dmin = decimal && decimal[1] && parseInt(decimal[1], 10) // || 0,
			var dmax = decimal && decimal[2] && parseInt(decimal[2], 10) // || 0,
				// int || dmin-dmax || 0
			var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : undefined
 
			var result = {
				// 1 name, 2 inc, 3 range, 4 decimal
				parameters: parameters,
				// 1 min, 2 max
				range: range,
				min: min,
				max: max,
				// min-max
				count: count,
				// �Ƿ��� decimal
				decimal: decimal,
				dmin: dmin,
				dmax: dmax,
				// dmin-dimax
				dcount: dcount
			}
 
			for (var r in result) {
				if (result[r] != undefined) return result
			}
 
			return {}
		}
	}
 
/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## Mock.Random
	    
	    �����࣬�������ɸ���������ݡ�
	*/
 
	var Util = __webpack_require__(3)
 
	var Random = {
	    extend: Util.extend
	}
 
	Random.extend(__webpack_require__(6))
	Random.extend(__webpack_require__(7))
	Random.extend(__webpack_require__(8))
	Random.extend(__webpack_require__(10))
	Random.extend(__webpack_require__(13))
	Random.extend(__webpack_require__(15))
	Random.extend(__webpack_require__(16))
	Random.extend(__webpack_require__(17))
	Random.extend(__webpack_require__(14))
	Random.extend(__webpack_require__(19))
 
	module.exports = Random
 
/***/ },
/* 6 */
/***/ function(module, exports) {
 
	/*
	    ## Basics
	*/
	module.exports = {
	    // ����һ������Ĳ���ֵ��
	    boolean: function(min, max, cur) {
	        if (cur !== undefined) {
	            min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1
	            max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1
	            return Math.random() > 1.0 / (min + max) * min ? !cur : cur
	        }
 
	        return Math.random() >= 0.5
	    },
	    bool: function(min, max, cur) {
	        return this.boolean(min, max, cur)
	    },
	    // ����һ���������Ȼ�������ڵ��� 0 ����������
	    natural: function(min, max) {
	        min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
	        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
	        return Math.round(Math.random() * (max - min)) + min
	    },
	    // ����һ�������������
	    integer: function(min, max) {
	        min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
	        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
	        return Math.round(Math.random() * (max - min)) + min
	    },
	    int: function(min, max) {
	        return this.integer(min, max)
	    },
	    // ����һ������ĸ�������
	    float: function(min, max, dmin, dmax) {
	        dmin = dmin === undefined ? 0 : dmin
	        dmin = Math.max(Math.min(dmin, 17), 0)
	        dmax = dmax === undefined ? 17 : dmax
	        dmax = Math.max(Math.min(dmax, 17), 0)
	        var ret = this.integer(min, max) + '.';
	        for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
	            ret += (
	                // ���һλ����Ϊ 0��������һλΪ 0���ᱻ JS ������Ե�
	                (i < dcount - 1) ? this.character('number') : this.character('123456789')
	            )
	        }
	        return parseFloat(ret, 10)
	    },
	    // ����һ������ַ���
	    character: function(pool) {
	        var pools = {
	            lower: 'abcdefghijklmnopqrstuvwxyz',
	            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	            number: '0123456789',
	            symbol: '!@#$%^&*()[]'
	        }
	        pools.alpha = pools.lower + pools.upper
	        pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol
 
	        pool = pools[('' + pool).toLowerCase()] || pool
	        return pool.charAt(this.natural(0, pool.length - 1))
	    },
	    char: function(pool) {
	        return this.character(pool)
	    },
	    // ����һ������ַ�����
	    string: function(pool, min, max) {
	        var len
	        switch (arguments.length) {
	            case 0: // ()
	                len = this.natural(3, 7)
	                break
	            case 1: // ( length )
	                len = pool
	                pool = undefined
	                break
	            case 2:
	                // ( pool, length )
	                if (typeof arguments[0] === 'string') {
	                    len = min
	                } else {
	                    // ( min, max )
	                    len = this.natural(pool, min)
	                    pool = undefined
	                }
	                break
	            case 3:
	                len = this.natural(min, max)
	                break
	        }
 
	        var text = ''
	        for (var i = 0; i < len; i++) {
	            text += this.character(pool)
	        }
 
	        return text
	    },
	    str: function( /*pool, min, max*/ ) {
	        return this.string.apply(this, arguments)
	    },
	    // ����һ���������顣
	    range: function(start, stop, step) {
	        // range( stop )
	        if (arguments.length <= 1) {
	            stop = start || 0;
	            start = 0;
	        }
	        // range( start, stop )
	        step = arguments[2] || 1;
 
	        start = +start
	        stop = +stop
	        step = +step
 
	        var len = Math.max(Math.ceil((stop - start) / step), 0);
	        var idx = 0;
	        var range = new Array(len);
 
	        while (idx < len) {
	            range[idx++] = start;
	            start += step;
	        }
 
	        return range;
	    }
	}
 
/***/ },
/* 7 */
/***/ function(module, exports) {
 
	/*
	    ## Date
	*/
	var patternLetters = {
	    yyyy: 'getFullYear',
	    yy: function(date) {
	        return ('' + date.getFullYear()).slice(2)
	    },
	    y: 'yy',
 
	    MM: function(date) {
	        var m = date.getMonth() + 1
	        return m < 10 ? '0' + m : m
	    },
	    M: function(date) {
	        return date.getMonth() + 1
	    },
 
	    dd: function(date) {
	        var d = date.getDate()
	        return d < 10 ? '0' + d : d
	    },
	    d: 'getDate',
 
	    HH: function(date) {
	        var h = date.getHours()
	        return h < 10 ? '0' + h : h
	    },
	    H: 'getHours',
	    hh: function(date) {
	        var h = date.getHours() % 12
	        return h < 10 ? '0' + h : h
	    },
	    h: function(date) {
	        return date.getHours() % 12
	    },
 
	    mm: function(date) {
	        var m = date.getMinutes()
	        return m < 10 ? '0' + m : m
	    },
	    m: 'getMinutes',
 
	    ss: function(date) {
	        var s = date.getSeconds()
	        return s < 10 ? '0' + s : s
	    },
	    s: 'getSeconds',
 
	    SS: function(date) {
	        var ms = date.getMilliseconds()
	        return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms
	    },
	    S: 'getMilliseconds',
 
	    A: function(date) {
	        return date.getHours() < 12 ? 'AM' : 'PM'
	    },
	    a: function(date) {
	        return date.getHours() < 12 ? 'am' : 'pm'
	    },
	    T: 'getTime'
	}
	module.exports = {
	    // ����ռλ�����ϡ�
	    _patternLetters: patternLetters,
	    // ����ռλ������
	    _rformat: new RegExp((function() {
	        var re = []
	        for (var i in patternLetters) re.push(i)
	        return '(' + re.join('|') + ')'
	    })(), 'g'),
	    // ��ʽ�����ڡ�
	    _formatDate: function(date, format) {
	        return format.replace(this._rformat, function creatNewSubString($0, flag) {
	            return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) :
	                patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) :
	                date[patternLetters[flag]]()
	        })
	    },
	    // ����һ������� Date ����
	    _randomDate: function(min, max) { // min, max
	        min = min === undefined ? new Date(0) : min
	        max = max === undefined ? new Date() : max
	        return new Date(Math.random() * (max.getTime() - min.getTime()))
	    },
	    // ����һ������������ַ�����
	    date: function(format) {
	        format = format || 'yyyy-MM-dd'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // ����һ�������ʱ���ַ�����
	    time: function(format) {
	        format = format || 'HH:mm:ss'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // ����һ����������ں�ʱ���ַ�����
	    datetime: function(format) {
	        format = format || 'yyyy-MM-dd HH:mm:ss'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // ���ص�ǰ�����ں�ʱ���ַ�����
	    now: function(unit, format) {
	        // now(unit) now(format)
	        if (arguments.length === 1) {
	            // now(format)
	            if (!/year|month|day|hour|minute|second|week/.test(unit)) {
	                format = unit
	                unit = ''
	            }
	        }
	        unit = (unit || '').toLowerCase()
	        format = format || 'yyyy-MM-dd HH:mm:ss'
 
	        var date = new Date()
 
	        /* jshint -W086 */
	        // �ο��� http://momentjs.cn/docs/#/manipulating/start-of/
	        switch (unit) {
	            case 'year':
	                date.setMonth(0)
	            case 'month':
	                date.setDate(1)
	            case 'week':
	            case 'day':
	                date.setHours(0)
	            case 'hour':
	                date.setMinutes(0)
	            case 'minute':
	                date.setSeconds(0)
	            case 'second':
	                date.setMilliseconds(0)
	        }
	        switch (unit) {
	            case 'week':
	                date.setDate(date.getDate() - date.getDay())
	        }
 
	        return this._formatDate(date, format)
	    }
	}
 
/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {
 
	/* WEBPACK VAR INJECTION */(function(module) {/* global document  */
	/*
	    ## Image
	*/
	module.exports = {
	    // �����Ĺ����
	    _adSize: [
	        '300x250', '250x250', '240x400', '336x280', '180x150',
	        '720x300', '468x60', '234x60', '88x31', '120x90',
	        '120x60', '120x240', '125x125', '728x90', '160x600',
	        '120x600', '300x600'
	    ],
	    // ��������Ļ���
	    _screenSize: [
	        '320x200', '320x240', '640x480', '800x480', '800x480',
	        '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200',
	        '2560x1600'
	    ],
	    // ��������Ƶ���
	    _videoSize: ['720x480', '768x576', '1280x720', '1920x1080'],
	    /*
	        ����һ�������ͼƬ��ַ��
	        ���ͼƬԴ
	            http://fpoimg.com/
	        �ο��� 
	            http://rensanning.iteye.com/blog/1933310
	            http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
	    */
	    image: function(size, background, foreground, format, text) {
	        // Random.image( size, background, foreground, text )
	        if (arguments.length === 4) {
	            text = format
	            format = undefined
	        }
	        // Random.image( size, background, text )
	        if (arguments.length === 3) {
	            text = foreground
	            foreground = undefined
	        }
	        // Random.image()
	        if (!size) size = this.pick(this._adSize)
 
	        if (background && ~background.indexOf('#')) background = background.slice(1)
	        if (foreground && ~foreground.indexOf('#')) foreground = foreground.slice(1)
 
	        // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
	        return 'http://dummyimage.com/' + size +
	            (background ? '/' + background : '') +
	            (foreground ? '/' + foreground : '') +
	            (format ? '.' + format : '') +
	            (text ? '&text=' + text : '')
	    },
	    img: function() {
	        return this.image.apply(this, arguments)
	    },
 
	    /*
	        BrandColors
	        http://brandcolors.net/
	        A collection of major brand color codes curated by Galen Gidman.
	        ���ƹ�˾����ɫ����
	        // ��ȡƷ�ƺ���ɫ
	        $('h2').each(function(index, item){
	            item = $(item)
	            console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
	        })
	    */
	    _brandColors: {
	        '4ormat': '#fb0a2a',
	        '500px': '#02adea',
	        'About.me (blue)': '#00405d',
	        'About.me (yellow)': '#ffcc33',
	        'Addvocate': '#ff6138',
	        'Adobe': '#ff0000',
	        'Aim': '#fcd20b',
	        'Amazon': '#e47911',
	        'Android': '#a4c639',
	        'Angie\'s List': '#7fbb00',
	        'AOL': '#0060a3',
	        'Atlassian': '#003366',
	        'Behance': '#053eff',
	        'Big Cartel': '#97b538',
	        'bitly': '#ee6123',
	        'Blogger': '#fc4f08',
	        'Boeing': '#0039a6',
	        'Booking.com': '#003580',
	        'Carbonmade': '#613854',
	        'Cheddar': '#ff7243',
	        'Code School': '#3d4944',
	        'Delicious': '#205cc0',
	        'Dell': '#3287c1',
	        'Designmoo': '#e54a4f',
	        'Deviantart': '#4e6252',
	        'Designer News': '#2d72da',
	        'Devour': '#fd0001',
	        'DEWALT': '#febd17',
	        'Disqus (blue)': '#59a3fc',
	        'Disqus (orange)': '#db7132',
	        'Dribbble': '#ea4c89',
	        'Dropbox': '#3d9ae8',
	        'Drupal': '#0c76ab',
	        'Dunked': '#2a323a',
	        'eBay': '#89c507',
	        'Ember': '#f05e1b',
	        'Engadget': '#00bdf6',
	        'Envato': '#528036',
	        'Etsy': '#eb6d20',
	        'Evernote': '#5ba525',
	        'Fab.com': '#dd0017',
	        'Facebook': '#3b5998',
	        'Firefox': '#e66000',
	        'Flickr (blue)': '#0063dc',
	        'Flickr (pink)': '#ff0084',
	        'Forrst': '#5b9a68',
	        'Foursquare': '#25a0ca',
	        'Garmin': '#007cc3',
	        'GetGlue': '#2d75a2',
	        'Gimmebar': '#f70078',
	        'GitHub': '#171515',
	        'Google Blue': '#0140ca',
	        'Google Green': '#16a61e',
	        'Google Red': '#dd1812',
	        'Google Yellow': '#fcca03',
	        'Google+': '#dd4b39',
	        'Grooveshark': '#f77f00',
	        'Groupon': '#82b548',
	        'Hacker News': '#ff6600',
	        'HelloWallet': '#0085ca',
	        'Heroku (light)': '#c7c5e6',
	        'Heroku (dark)': '#6567a5',
	        'HootSuite': '#003366',
	        'Houzz': '#73ba37',
	        'HTML5': '#ec6231',
	        'IKEA': '#ffcc33',
	        'IMDb': '#f3ce13',
	        'Instagram': '#3f729b',
	        'Intel': '#0071c5',
	        'Intuit': '#365ebf',
	        'Kickstarter': '#76cc1e',
	        'kippt': '#e03500',
	        'Kodery': '#00af81',
	        'LastFM': '#c3000d',
	        'LinkedIn': '#0e76a8',
	        'Livestream': '#cf0005',
	        'Lumo': '#576396',
	        'Mixpanel': '#a086d3',
	        'Meetup': '#e51937',
	        'Nokia': '#183693',
	        'NVIDIA': '#76b900',
	        'Opera': '#cc0f16',
	        'Path': '#e41f11',
	        'PayPal (dark)': '#1e477a',
	        'PayPal (light)': '#3b7bbf',
	        'Pinboard': '#0000e6',
	        'Pinterest': '#c8232c',
	        'PlayStation': '#665cbe',
	        'Pocket': '#ee4056',
	        'Prezi': '#318bff',
	        'Pusha': '#0f71b4',
	        'Quora': '#a82400',
	        'QUOTE.fm': '#66ceff',
	        'Rdio': '#008fd5',
	        'Readability': '#9c0000',
	        'Red Hat': '#cc0000',
	        'Resource': '#7eb400',
	        'Rockpack': '#0ba6ab',
	        'Roon': '#62b0d9',
	        'RSS': '#ee802f',
	        'Salesforce': '#1798c1',
	        'Samsung': '#0c4da2',
	        'Shopify': '#96bf48',
	        'Skype': '#00aff0',
	        'Snagajob': '#f47a20',
	        'Softonic': '#008ace',
	        'SoundCloud': '#ff7700',
	        'Space Box': '#f86960',
	        'Spotify': '#81b71a',
	        'Sprint': '#fee100',
	        'Squarespace': '#121212',
	        'StackOverflow': '#ef8236',
	        'Staples': '#cc0000',
	        'Status Chart': '#d7584f',
	        'Stripe': '#008cdd',
	        'StudyBlue': '#00afe1',
	        'StumbleUpon': '#f74425',
	        'T-Mobile': '#ea0a8e',
	        'Technorati': '#40a800',
	        'The Next Web': '#ef4423',
	        'Treehouse': '#5cb868',
	        'Trulia': '#5eab1f',
	        'Tumblr': '#34526f',
	        'Twitch.tv': '#6441a5',
	        'Twitter': '#00acee',
	        'TYPO3': '#ff8700',
	        'Ubuntu': '#dd4814',
	        'Ustream': '#3388ff',
	        'Verizon': '#ef1d1d',
	        'Vimeo': '#86c9ef',
	        'Vine': '#00a478',
	        'Virb': '#06afd8',
	        'Virgin Media': '#cc0000',
	        'Wooga': '#5b009c',
	        'WordPress (blue)': '#21759b',
	        'WordPress (orange)': '#d54e21',
	        'WordPress (grey)': '#464646',
	        'Wunderlist': '#2b88d9',
	        'XBOX': '#9bc848',
	        'XING': '#126567',
	        'Yahoo!': '#720e9e',
	        'Yandex': '#ffcc00',
	        'Yelp': '#c41200',
	        'YouTube': '#c4302b',
	        'Zalongo': '#5498dc',
	        'Zendesk': '#78a300',
	        'Zerply': '#9dcc7a',
	        'Zootool': '#5e8b1d'
	    },
	    _brandNames: function() {
	        var brands = [];
	        for (var b in this._brandColors) {
	            brands.push(b)
	        }
	        return brands
	    },
	    /*
	        ����һ������� Base64 ͼƬ���롣
	        https://github.com/imsky/holder
	        Holder renders image placeholders entirely on the client side.
	        dataImageHolder: function(size) {
	            return 'holder.js/' + size
	        },
	    */
	    dataImage: function(size, text) {
	        var canvas
	        if (typeof document !== 'undefined') {
	            canvas = document.createElement('canvas')
	        } else {
	            /*
	                https://github.com/Automattic/node-canvas
	                    npm install canvas --save
	                ��װ���⣺
	                * http://stackoverflow.com/questions/22953206/gulp-issues-with-cario-install-command-not-found-when-trying-to-installing-canva
	                * https://github.com/Automattic/node-canvas/issues/415
	                * https://github.com/Automattic/node-canvas/wiki/_pages
	                PS��node-canvas �İ�װ����ʵ����̫�����ˣ����Բ����� package.json �� dependencies��
	             */
	            var Canvas = module.require('canvas')
	            canvas = new Canvas()
	        }
 
	        var ctx = canvas && canvas.getContext && canvas.getContext("2d")
	        if (!canvas || !ctx) return ''
 
	        if (!size) size = this.pick(this._adSize)
	        text = text !== undefined ? text : size
 
	        size = size.split('x')
 
	        var width = parseInt(size[0], 10),
	            height = parseInt(size[1], 10),
	            background = this._brandColors[this.pick(this._brandNames())],
	            foreground = '#FFF',
	            text_height = 14,
	            font = 'sans-serif';
 
	        canvas.width = width
	        canvas.height = height
	        ctx.textAlign = 'center'
	        ctx.textBaseline = 'middle'
	        ctx.fillStyle = background
	        ctx.fillRect(0, 0, width, height)
	        ctx.fillStyle = foreground
	        ctx.font = 'bold ' + text_height + 'px ' + font
	        ctx.fillText(text, (width / 2), (height / 2), width)
	        return canvas.toDataURL('image/png')
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module)))
 
/***/ },
/* 9 */
/***/ function(module, exports) {
 
	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}
 
 
/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## Color
	    http://llllll.li/randomColor/
	        A color generator for JavaScript.
	        randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.
	    http://randomcolour.com/
	        var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
	        bg_colour = "#" + ("000000" + bg_colour).slice(-6);
	        document.bgColor = bg_colour;
	    
	    http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	        Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
	        https://github.com/devongovett/color-generator
	    http://www.paulirish.com/2009/random-hex-color-code-snippets/
	        Random Hex Color Code Generator in JavaScript
	    http://chancejs.com/#color
	        chance.color()
	        // => '#79c157'
	        chance.color({format: 'hex'})
	        // => '#d67118'
	        chance.color({format: 'shorthex'})
	        // => '#60f'
	        chance.color({format: 'rgb'})
	        // => 'rgb(110,52,164)'
	    http://tool.c7sky.com/webcolor
	        ��ҳ��Ƴ���ɫ�ʴ����
	    
	    https://github.com/One-com/one-color
	        An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.
	        API ����
	    https://github.com/harthur/color
	        JavaScript color conversion and manipulation library
	    https://github.com/leaverou/css-colors
	        Share & convert CSS colors
	    http://leaverou.github.io/css-colors/#slategray
	        Type a CSS color keyword, #hex, hsl(), rgba(), whatever:
	    ɫ�� hue
	        http://baike.baidu.com/view/23368.htm
	        ɫ��ָ����һ�����л���ɫ�ʵ����������Ǵ��ɫ��Ч����
	    ���Ͷ� saturation
	        http://baike.baidu.com/view/189644.htm
	        ���Ͷ���ָɫ�ʵ����޳̶ȣ�Ҳ��ɫ�ʵĴ��ȡ����Ͷ�ȡ���ڸ�ɫ�к�ɫ�ɷֺ���ɫ�ɷ֣���ɫ���ı�������ɫ�ɷ�Խ�󣬱��Ͷ�Խ����ɫ�ɷ�Խ�󣬱��Ͷ�ԽС��
	    ���� brightness
	        http://baike.baidu.com/view/34773.htm
	        ������ָ�����壨�����壩���淢�⣨���⣩ǿ������������
	    �ն� luminosity
	        ���屻�����ĳ̶�,���õ�λ��������ܵĹ�ͨ������ʾ,��ʾ��λΪ��[��˹](Lux,lx) ,�� 1m / m2 ��
	    http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
	        var letters = '0123456789ABCDEF'.split('')
	        var color = '#'
	        for (var i = 0; i < 6; i++) {
	            color += letters[Math.floor(Math.random() * 16)]
	        }
	        return color
	    
	        // �������һ�����Ե���ɫ����ʽΪ '#RRGGBB'��
	        // _brainlessColor()
	        var color = Math.floor(
	            Math.random() *
	            (16 * 16 * 16 * 16 * 16 * 16 - 1)
	        ).toString(16)
	        color = "#" + ("000000" + color).slice(-6)
	        return color.toUpperCase()
	*/
 
	var Convert = __webpack_require__(11)
	var DICT = __webpack_require__(12)
 
	module.exports = {
	    // �������һ��������������ɫ����ʽΪ '#RRGGBB'��
	    color: function(name) {
	        if (name || DICT[name]) return DICT[name].nicer
	        return this.hex()
	    },
	    // #DAC0DE
	    hex: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2])
	        return hex
	    },
	    // rgb(128,255,255)
	    rgb: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        return 'rgb(' +
	            parseInt(rgb[0], 10) + ', ' +
	            parseInt(rgb[1], 10) + ', ' +
	            parseInt(rgb[2], 10) + ')'
	    },
	    // rgba(128,255,255,0.3)
	    rgba: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        return 'rgba(' +
	            parseInt(rgb[0], 10) + ', ' +
	            parseInt(rgb[1], 10) + ', ' +
	            parseInt(rgb[2], 10) + ', ' +
	            Math.random().toFixed(2) + ')'
	    },
	    // hsl(300,80%,90%)
	    hsl: function() {
	        var hsv = this._goldenRatioColor()
	        var hsl = Convert.hsv2hsl(hsv)
	        return 'hsl(' +
	            parseInt(hsl[0], 10) + ', ' +
	            parseInt(hsl[1], 10) + ', ' +
	            parseInt(hsl[2], 10) + ')'
	    },
	    // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	    // https://github.com/devongovett/color-generator/blob/master/index.js
	    // �������һ��������������ɫ��
	    _goldenRatioColor: function(saturation, value) {
	        this._goldenRatio = 0.618033988749895
	        this._hue = this._hue || Math.random()
	        this._hue += this._goldenRatio
	        this._hue %= 1
 
	        if (typeof saturation !== "number") saturation = 0.5;
	        if (typeof value !== "number") value = 0.95;
 
	        return [
	            this._hue * 360,
	            saturation * 100,
	            value * 100
	        ]
	    }
	}
 
/***/ },
/* 11 */
/***/ function(module, exports) {
 
	/*
	    ## Color Convert
	    http://blog.csdn.net/idfaya/article/details/6770414
	        ��ɫ�ռ�RGB��HSV(HSL)��ת��
	*/
	// https://github.com/harthur/color-convert/blob/master/conversions.js
	module.exports = {
		rgb2hsl: function rgb2hsl(rgb) {
			var r = rgb[0] / 255,
				g = rgb[1] / 255,
				b = rgb[2] / 255,
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, l;
 
			if (max == min)
				h = 0;
			else if (r == max)
				h = (g - b) / delta;
			else if (g == max)
				h = 2 + (b - r) / delta;
			else if (b == max)
				h = 4 + (r - g) / delta;
 
			h = Math.min(h * 60, 360);
 
			if (h < 0)
				h += 360;
 
			l = (min + max) / 2;
 
			if (max == min)
				s = 0;
			else if (l <= 0.5)
				s = delta / (max + min);
			else
				s = delta / (2 - max - min);
 
			return [h, s * 100, l * 100];
		},
		rgb2hsv: function rgb2hsv(rgb) {
			var r = rgb[0],
				g = rgb[1],
				b = rgb[2],
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, v;
 
			if (max === 0)
				s = 0;
			else
				s = (delta / max * 1000) / 10;
 
			if (max == min)
				h = 0;
			else if (r == max)
				h = (g - b) / delta;
			else if (g == max)
				h = 2 + (b - r) / delta;
			else if (b == max)
				h = 4 + (r - g) / delta;
 
			h = Math.min(h * 60, 360);
 
			if (h < 0)
				h += 360;
 
			v = ((max / 255) * 1000) / 10;
 
			return [h, s, v];
		},
		hsl2rgb: function hsl2rgb(hsl) {
			var h = hsl[0] / 360,
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				t1, t2, t3, rgb, val;
 
			if (s === 0) {
				val = l * 255;
				return [val, val, val];
			}
 
			if (l < 0.5)
				t2 = l * (1 + s);
			else
				t2 = l + s - l * s;
			t1 = 2 * l - t2;
 
			rgb = [0, 0, 0];
			for (var i = 0; i < 3; i++) {
				t3 = h + 1 / 3 * -(i - 1);
				if (t3 < 0) t3++;
				if (t3 > 1) t3--;
 
				if (6 * t3 < 1)
					val = t1 + (t2 - t1) * 6 * t3;
				else if (2 * t3 < 1)
					val = t2;
				else if (3 * t3 < 2)
					val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
				else
					val = t1;
 
				rgb[i] = val * 255;
			}
 
			return rgb;
		},
		hsl2hsv: function hsl2hsv(hsl) {
			var h = hsl[0],
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				sv, v;
			l *= 2;
			s *= (l <= 1) ? l : 2 - l;
			v = (l + s) / 2;
			sv = (2 * s) / (l + s);
			return [h, sv * 100, v * 100];
		},
		hsv2rgb: function hsv2rgb(hsv) {
			var h = hsv[0] / 60
			var s = hsv[1] / 100
			var v = hsv[2] / 100
			var hi = Math.floor(h) % 6
 
			var f = h - Math.floor(h)
			var p = 255 * v * (1 - s)
			var q = 255 * v * (1 - (s * f))
			var t = 255 * v * (1 - (s * (1 - f)))
 
			v = 255 * v
 
			switch (hi) {
				case 0:
					return [v, t, p]
				case 1:
					return [q, v, p]
				case 2:
					return [p, v, t]
				case 3:
					return [p, q, v]
				case 4:
					return [t, p, v]
				case 5:
					return [v, p, q]
			}
		},
		hsv2hsl: function hsv2hsl(hsv) {
			var h = hsv[0],
				s = hsv[1] / 100,
				v = hsv[2] / 100,
				sl, l;
 
			l = (2 - s) * v;
			sl = s * v;
			sl /= (l <= 1) ? l : 2 - l;
			l /= 2;
			return [h, sl * 100, l * 100];
		},
		// http://www.140byt.es/keywords/color
		rgb2hex: function(
			a, // red, as a number from 0 to 255
			b, // green, as a number from 0 to 255
			c // blue, as a number from 0 to 255
		) {
			return "#" + ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)
		},
		hex2rgb: function(
			a // take a "#xxxxxx" hex string,
		) {
			a = '0x' + a.slice(1).replace(a.length > 4 ? a : /./g, '$&$&') | 0;
			return [a >> 16, a >> 8 & 255, a & 255]
		}
	}
 
/***/ },
/* 12 */
/***/ function(module, exports) {
 
	/*
	    ## Color �ֵ�����
	    �ֵ�������Դ [A nicer color palette for the web](http://clrs.cc/)
	*/
	module.exports = {
	    // name value nicer
	    navy: {
	        value: '#000080',
	        nicer: '#001F3F'
	    },
	    blue: {
	        value: '#0000ff',
	        nicer: '#0074D9'
	    },
	    aqua: {
	        value: '#00ffff',
	        nicer: '#7FDBFF'
	    },
	    teal: {
	        value: '#008080',
	        nicer: '#39CCCC'
	    },
	    olive: {
	        value: '#008000',
	        nicer: '#3D9970'
	    },
	    green: {
	        value: '#008000',
	        nicer: '#2ECC40'
	    },
	    lime: {
	        value: '#00ff00',
	        nicer: '#01FF70'
	    },
	    yellow: {
	        value: '#ffff00',
	        nicer: '#FFDC00'
	    },
	    orange: {
	        value: '#ffa500',
	        nicer: '#FF851B'
	    },
	    red: {
	        value: '#ff0000',
	        nicer: '#FF4136'
	    },
	    maroon: {
	        value: '#800000',
	        nicer: '#85144B'
	    },
	    fuchsia: {
	        value: '#ff00ff',
	        nicer: '#F012BE'
	    },
	    purple: {
	        value: '#800080',
	        nicer: '#B10DC9'
	    },
	    silver: {
	        value: '#c0c0c0',
	        nicer: '#DDDDDD'
	    },
	    gray: {
	        value: '#808080',
	        nicer: '#AAAAAA'
	    },
	    black: {
	        value: '#000000',
	        nicer: '#111111'
	    },
	    white: {
	        value: '#FFFFFF',
	        nicer: '#FFFFFF'
	    }
	}
 
/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## Text
	    http://www.lipsum.com/
	*/
	var Basic = __webpack_require__(6)
	var Helper = __webpack_require__(14)
 
	function range(defaultMin, defaultMax, min, max) {
	    return min === undefined ? Basic.natural(defaultMin, defaultMax) : // ()
	        max === undefined ? min : // ( len )
	        Basic.natural(parseInt(min, 10), parseInt(max, 10)) // ( min, max )
	}
 
	module.exports = {
	    // �������һ���ı���
	    paragraph: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.sentence())
	        }
	        return result.join(' ')
	    },
	    // 
	    cparagraph: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.csentence())
	        }
	        return result.join('')
	    },
	    // �������һ�����ӣ���һ�����ʵ�����ĸ��д��
	    sentence: function(min, max) {
	        var len = range(12, 18, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.word())
	        }
	        return Helper.capitalize(result.join(' ')) + '.'
	    },
	    // �������һ�����ľ��ӡ�
	    csentence: function(min, max) {
	        var len = range(12, 18, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.cword())
	        }
 
	        return result.join('') + '��'
	    },
	    // �������һ�����ʡ�
	    word: function(min, max) {
	        var len = range(3, 10, min, max)
	        var result = '';
	        for (var i = 0; i < len; i++) {
	            result += Basic.character('lower')
	        }
	        return result
	    },
	    // �������һ���������֡�
	    cword: function(pool, min, max) {
	        // ��õ� 500 ������ http://baike.baidu.com/view/568436.htm
	        var DICT_KANZI = '��һ���ڲ����к������д�Ϊ�ϸ�������Ҫ��ʱ���������������ڳ��ͷֶԳɻ�������궯ͬ��Ҳ���¹���˵�����������ඨ��ѧ������þ�ʮ��֮���ŵȲ��ȼҵ�������ˮ�����Զ�����С����ʵ�����������ƻ���ʹ���ҵ��ȥ���Ժ�Ӧ�����ϻ�������ЩȻǰ������������������ƽ����ȫ�������ظ��������������ķ�������ԭ��ô���Ȼ�������������˱���ֻû������⽨�¹���ϵ������������������ͨ����ֱ�⵳��չ�������Ա��λ�볣���ܴ�Ʒʽ���輰���ؼ�������ͷ���ʱ���·����ͼɽͳ��֪�Ͻ�����Ʊ����ֽ��ڸ�����ũָ������ǿ�ž�����������ս�Ȼ�����ȡ�ݴ����ϸ�ɫ���ż����α���ٹ������ߺ��ڶ�����ѹ־���������ý���˼����������ʲ������Ȩ��֤���强���ٲ�ת�������д�׽��ٻ������������������ÿĿ�����߻�ʾ��������������뻪��ȷ�ſ�������ڻ�������Ԫ�����´�����Ⱥ��ʯ������н������ɽ��Ҿ���Խ֯װӰ��ͳ������鲼���ݶ�����̷����������ѽ���ǧ��ί�ؼ��������ʡ��ϰ��Լ֧��ʷ���ͱ����������п˺γ���������̫׼��ֵ������ά��ѡ��д���ë�׿�Ч˹Ժ�齭�����������������ɲ�Ƭʼȴר״������ʶ����Բ����ס�����ؾ��ղκ�ϸ����������������'
 
	        var len
	        switch (arguments.length) {
	            case 0: // ()
	                pool = DICT_KANZI
	                len = 1
	                break
	            case 1: // ( pool )
	                if (typeof arguments[0] === 'string') {
	                    len = 1
	                } else {
	                    // ( length )
	                    len = pool
	                    pool = DICT_KANZI
	                }
	                break
	            case 2:
	                // ( pool, length )
	                if (typeof arguments[0] === 'string') {
	                    len = min
	                } else {
	                    // ( min, max )
	                    len = this.natural(pool, min)
	                    pool = DICT_KANZI
	                }
	                break
	            case 3:
	                len = this.natural(min, max)
	                break
	        }
 
	        var result = ''
	        for (var i = 0; i < len; i++) {
	            result += pool.charAt(this.natural(0, pool.length - 1))
	        }
	        return result
	    },
	    // �������һ����⣬����ÿ�����ʵ�����ĸ��д��
	    title: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.capitalize(this.word()))
	        }
	        return result.join(' ')
	    },
	    // �������һ�����ı��⡣
	    ctitle: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.cword())
	        }
	        return result.join('')
	    }
	}
 
/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## Helpers
	*/
 
	var Util = __webpack_require__(3)
 
	module.exports = {
		// ���ַ����ĵ�һ����ĸת��Ϊ��д��
		capitalize: function(word) {
			return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
		},
		// ���ַ���ת��Ϊ��д��
		upper: function(str) {
			return (str + '').toUpperCase()
		},
		// ���ַ���ת��ΪСд��
		lower: function(str) {
			return (str + '').toLowerCase()
		},
		// �����������ѡȡһ��Ԫ�أ������ء�
		pick: function pick(arr, min, max) {
			// pick( item1, item2 ... )
			if (!Util.isArray(arr)) {
				arr = [].slice.call(arguments)
				min = 1
				max = 1
			} else {
				// pick( [ item1, item2 ... ] )
				if (min === undefined) min = 1
 
				// pick( [ item1, item2 ... ], count )
				if (max === undefined) max = min
			}
 
			if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]
 
			// pick( [ item1, item2 ... ], min, max )
			return this.shuffle(arr, min, max)
 
			// ͨ�����������жϷ���ǩ������չ��̫�#90
			// switch (arguments.length) {
			// 	case 1:
			// 		// pick( [ item1, item2 ... ] )
			// 		return arr[this.natural(0, arr.length - 1)]
			// 	case 2:
			// 		// pick( [ item1, item2 ... ], count )
			// 		max = min
			// 			/* falls through */
			// 	case 3:
			// 		// pick( [ item1, item2 ... ], min, max )
			// 		return this.shuffle(arr, min, max)
			// }
		},
		/*
		    ����������Ԫ�ص�˳�򣬲����ء�
		    Given an array, scramble the order and return it.
		    ������ʵ��˼·��
		        // https://code.google.com/p/jslibs/wiki/JavascriptTips
		        result = result.sort(function() {
		            return Math.random() - 0.5
		        })
		*/
		shuffle: function shuffle(arr, min, max) {
			arr = arr || []
			var old = arr.slice(0),
				result = [],
				index = 0,
				length = old.length;
			for (var i = 0; i < length; i++) {
				index = this.natural(0, old.length - 1)
				result.push(old[index])
				old.splice(index, 1)
			}
			switch (arguments.length) {
				case 0:
				case 1:
					return result
				case 2:
					max = min
						/* falls through */
				case 3:
					min = parseInt(min, 10)
					max = parseInt(max, 10)
					return result.slice(0, this.natural(min, max))
			}
		},
		/*
		    * Random.order(item, item)
		    * Random.order([item, item ...])
		    ˳���ȡ�����е�Ԫ��
		    [JSON��������֧����������¼��](https://github.com/thx/RAP/issues/22)
		    ��֧�ֵ������ã�
		*/
		order: function order(array) {
			order.cache = order.cache || {}
 
			if (arguments.length > 1) array = [].slice.call(arguments, 0)
 
			// options.context.path/templatePath
			var options = order.options
			var templatePath = options.context.templatePath.join('.')
 
			var cache = (
				order.cache[templatePath] = order.cache[templatePath] || {
					index: 0,
					array: array
				}
			)
 
			return cache.array[cache.index++ % cache.array.length]
		}
	}
 
/***/ },
/* 15 */
/***/ function(module, exports) {
 
	/*
	    ## Name
	    [Beyond the Top 1000 Names](http://www.ssa.gov/oact/babynames/limits.html)
	*/
	module.exports = {
		// �������һ��������Ӣ������
		first: function() {
			var names = [
				// male
				"James", "John", "Robert", "Michael", "William",
				"David", "Richard", "Charles", "Joseph", "Thomas",
				"Christopher", "Daniel", "Paul", "Mark", "Donald",
				"George", "Kenneth", "Steven", "Edward", "Brian",
				"Ronald", "Anthony", "Kevin", "Jason", "Matthew",
				"Gary", "Timothy", "Jose", "Larry", "Jeffrey",
				"Frank", "Scott", "Eric"
			].concat([
				// female
				"Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
				"Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
				"Lisa", "Nancy", "Karen", "Betty", "Helen",
				"Sandra", "Donna", "Carol", "Ruth", "Sharon",
				"Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
				"Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
				"Brenda", "Amy", "Anna"
			])
			return this.pick(names)
				// or this.capitalize(this.word())
		},
		// �������һ��������Ӣ���ա�
		last: function() {
			var names = [
				"Smith", "Johnson", "Williams", "Brown", "Jones",
				"Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
				"Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
				"Moore", "Martin", "Jackson", "Thompson", "White",
				"Lopez", "Lee", "Gonzalez", "Harris", "Clark",
				"Lewis", "Robinson", "Walker", "Perez", "Hall",
				"Young", "Allen"
			]
			return this.pick(names)
				// or this.capitalize(this.word())
		},
		// �������һ��������Ӣ��������
		name: function(middle) {
			return this.first() + ' ' +
				(middle ? this.first() + ' ' : '') +
				this.last()
		},
		/*
		    �������һ�������������ա�
		    [���糣����������](http://baike.baidu.com/view/1719115.htm)
		    [������ - ����С˵��������ƽ̨](http://xuanpai.sinaapp.com/)
		 */
		cfirst: function() {
			var names = (
				'�� �� �� �� �� �� �� �� �� �� ' +
				'�� �� �� �� �� �� �� �� �� �� ' +
				'�� �� ֣ л �� �� �� �� �� �� ' +
				'�� �� Ԭ �� �� �� �� �� �� �� ' +
				'�� ¬ �� �� �� �� κ Ѧ Ҷ �� ' +
				'�� �� �� �� �� �� �� �� �� �� ' +
				'�� �� ʯ Ҧ ̷ �� �� �� �� ½ ' +
				'�� �� �� �� �� ë �� �� �� ʷ ' +
				'�� �� �� �� �� �� �� �� Ǯ �� ' +
				'�� �� �� �� �� �� �� �� �� ��'
			).split(' ')
			return this.pick(names)
		},
		/*
		    �������һ����������������
		    [�й��������ǰ50��_����������](http://www.name999.net/xingming/xingshi/20131004/48.html)
		 */
		clast: function() {
			var names = (
				'ΰ �� �� ��Ӣ �� �� �� ǿ �� �� ' +
				'�� �� �� �� �� �� �� �� ���� ϼ ' +
				'ƽ �� ��Ӣ'
			).split(' ')
			return this.pick(names)
		},
		// �������һ������������������
		cname: function() {
			return this.cfirst() + this.clast()
		}
	}
 
/***/ },
/* 16 */
/***/ function(module, exports) {
 
	/*
	    ## Web
	*/
	module.exports = {
	    /*
	        �������һ�� URL��
	        [URL �淶](http://www.w3.org/Addressing/URL/url-spec.txt)
	            http                    Hypertext Transfer Protocol 
	            ftp                     File Transfer protocol 
	            gopher                  The Gopher protocol 
	            mailto                  Electronic mail address 
	            mid                     Message identifiers for electronic mail 
	            cid                     Content identifiers for MIME body part 
	            news                    Usenet news 
	            nntp                    Usenet news for local NNTP access only 
	            prospero                Access using the prospero protocols 
	            telnet rlogin tn3270    Reference to interactive sessions
	            wais                    Wide Area Information Servers 
	    */
	    url: function(protocol, host) {
	        return (protocol || this.protocol()) + '://' + // protocol?
	            (host || this.domain()) + // host?
	            '/' + this.word()
	    },
	    // �������һ�� URL Э�顣
	    protocol: function() {
	        return this.pick(
	            // Э���
	            'http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais'.split(' ')
	        )
	    },
	    // �������һ��������
	    domain: function(tld) {
	        return this.word() + '.' + (tld || this.tld())
	    },
	    /*
	        �������һ������������
	        ���ʶ������� international top-level domain-names, iTLDs
	        ���Ҷ������� national top-level domainnames, nTLDs
	        [������׺��ȫ](http://www.163ns.com/zixun/post/4417.html)
	    */
	    tld: function() { // Top Level Domain
	        return this.pick(
	            (
	                // ������׺
	                'com net org edu gov int mil cn ' +
	                // ��������
	                'com.cn net.cn gov.cn org.cn ' +
	                // ���Ĺ�������
	                '�й� �й�����.��˾ �й�����.���� ' +
	                // �¹�������
	                'tel biz cc tv info name hk mobi asia cd travel pro museum coop aero ' +
	                // �������������׺
	                'ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw'
	            ).split(' ')
	        )
	    },
	    // �������һ���ʼ���ַ��
	    email: function(domain) {
	        return this.character('lower') + '.' + this.word() + '@' +
	            (
	                domain ||
	                (this.word() + '.' + this.tld())
	            )
	            // return this.character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
	            // return this.word() + '@' + (domain || this.domain())
	    },
	    // �������һ�� IP ��ַ��
	    ip: function() {
	        return this.natural(0, 255) + '.' +
	            this.natural(0, 255) + '.' +
	            this.natural(0, 255) + '.' +
	            this.natural(0, 255)
	    }
	}
 
/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## Address
	*/
 
	var DICT = __webpack_require__(18)
	var REGION = ['����', '����', '����', '����', '����', '����', '����']
 
	module.exports = {
	    // �������һ��������
	    region: function() {
	        return this.pick(REGION)
	    },
	    // �������һ�����й���ʡ����ֱϽ�С����������ر�����������
	    province: function() {
	        return this.pick(DICT).name
	    },
	    // �������һ�����й����С�
	    city: function(prefix) {
	        var province = this.pick(DICT)
	        var city = this.pick(province.children)
	        return prefix ? [province.name, city.name].join(' ') : city.name
	    },
	    // �������һ�����й����ء�
	    county: function(prefix) {
	        var province = this.pick(DICT)
	        var city = this.pick(province.children)
	        var county = this.pick(city.children) || {
	            name: '-'
	        }
	        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
	    },
	    // �������һ���������루��λ���֣���
	    zip: function(len) {
	        var zip = ''
	        for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
	        return zip
	    }
 
	    // address: function() {},
	    // phone: function() {},
	    // areacode: function() {},
	    // street: function() {},
	    // street_suffixes: function() {},
	    // street_suffix: function() {},
	    // states: function() {},
	    // state: function() {},
	}
 
/***/ },
/* 18 */
/***/ function(module, exports) {
 
	/*
	    ## Address �ֵ�����
	    �ֵ�������Դ http://www.atatech.org/articles/30028?rnd=254259856
	    ���� ʡ���У��������������
	    ����   ������ ����� �ӱ�ʡ ɽ��ʡ ���ɹ�������
	    ����   ����ʡ ����ʡ ������ʡ
	    ����   �Ϻ��� ����ʡ �㽭ʡ ����ʡ ����ʡ ����ʡ ɽ��ʡ
	    ����   �㶫ʡ ����׳�������� ����ʡ
	    ����   ����ʡ ����ʡ ����ʡ
	    ����   ������ �Ĵ�ʡ ����ʡ ����ʡ ����������
	    ����   ����ʡ ����ʡ �ຣʡ ���Ļ��������� �½�ά���������
	    �۰�̨ ����ر������� �����ر������� ̨��ʡ
	    
	    **����**
	    
	    ```js
	    var map = {}
	    _.each(_.keys(REGIONS),function(id){
	      map[id] = REGIONS[ID]
	    })
	    JSON.stringify(map)
	    ```
	*/
	var DICT = {
	    "110000": "����",
	    "110100": "������",
	    "110101": "������",
	    "110102": "������",
	    "110105": "������",
	    "110106": "��̨��",
	    "110107": "ʯ��ɽ��",
	    "110108": "������",
	    "110109": "��ͷ����",
	    "110111": "��ɽ��",
	    "110112": "ͨ����",
	    "110113": "˳����",
	    "110114": "��ƽ��",
	    "110115": "������",
	    "110116": "������",
	    "110117": "ƽ����",
	    "110228": "������",
	    "110229": "������",
	    "110230": "������",
	    "120000": "���",
	    "120100": "�����",
	    "120101": "��ƽ��",
	    "120102": "�Ӷ���",
	    "120103": "������",
	    "120104": "�Ͽ���",
	    "120105": "�ӱ���",
	    "120106": "������",
	    "120110": "������",
	    "120111": "������",
	    "120112": "������",
	    "120113": "������",
	    "120114": "������",
	    "120115": "������",
	    "120116": "��������",
	    "120221": "������",
	    "120223": "������",
	    "120225": "����",
	    "120226": "������",
	    "130000": "�ӱ�ʡ",
	    "130100": "ʯ��ׯ��",
	    "130102": "������",
	    "130103": "�Ŷ���",
	    "130104": "������",
	    "130105": "�»���",
	    "130107": "�������",
	    "130108": "ԣ����",
	    "130121": "������",
	    "130123": "������",
	    "130124": "�����",
	    "130125": "������",
	    "130126": "������",
	    "130127": "������",
	    "130128": "������",
	    "130129": "�޻���",
	    "130130": "�޼���",
	    "130131": "ƽɽ��",
	    "130132": "Ԫ����",
	    "130133": "����",
	    "130181": "������",
	    "130182": "޻����",
	    "130183": "������",
	    "130184": "������",
	    "130185": "¹Ȫ��",
	    "130186": "������",
	    "130200": "��ɽ��",
	    "130202": "·����",
	    "130203": "·����",
	    "130204": "��ұ��",
	    "130205": "��ƽ��",
	    "130207": "������",
	    "130208": "������",
	    "130223": "����",
	    "130224": "������",
	    "130225": "��ͤ��",
	    "130227": "Ǩ����",
	    "130229": "������",
	    "130230": "��������",
	    "130281": "����",
	    "130283": "Ǩ����",
	    "130284": "������",
	    "130300": "�ػʵ���",
	    "130302": "������",
	    "130303": "ɽ������",
	    "130304": "��������",
	    "130321": "��������������",
	    "130322": "������",
	    "130323": "������",
	    "130324": "¬����",
	    "130398": "������",
	    "130400": "������",
	    "130402": "��ɽ��",
	    "130403": "��̨��",
	    "130404": "������",
	    "130406": "������",
	    "130421": "������",
	    "130423": "������",
	    "130424": "�ɰ���",
	    "130425": "������",
	    "130426": "����",
	    "130427": "����",
	    "130428": "������",
	    "130429": "������",
	    "130430": "����",
	    "130431": "������",
	    "130432": "��ƽ��",
	    "130433": "������",
	    "130434": "κ��",
	    "130435": "������",
	    "130481": "�䰲��",
	    "130482": "������",
	    "130500": "��̨��",
	    "130502": "�Ŷ���",
	    "130503": "������",
	    "130521": "��̨��",
	    "130522": "�ٳ���",
	    "130523": "������",
	    "130524": "������",
	    "130525": "¡Ң��",
	    "130526": "����",
	    "130527": "�Ϻ���",
	    "130528": "������",
	    "130529": "��¹��",
	    "130530": "�º���",
	    "130531": "������",
	    "130532": "ƽ����",
	    "130533": "����",
	    "130534": "�����",
	    "130535": "������",
	    "130581": "�Ϲ���",
	    "130582": "ɳ����",
	    "130583": "������",
	    "130600": "������",
	    "130602": "������",
	    "130603": "������",
	    "130604": "������",
	    "130621": "������",
	    "130622": "��Է��",
	    "130623": "�ˮ��",
	    "130624": "��ƽ��",
	    "130625": "��ˮ��",
	    "130626": "������",
	    "130627": "����",
	    "130628": "������",
	    "130629": "�ݳ���",
	    "130630": "�Դ��",
	    "130631": "������",
	    "130632": "������",
	    "130633": "����",
	    "130634": "������",
	    "130635": "���",
	    "130636": "˳ƽ��",
	    "130637": "��Ұ��",
	    "130638": "����",
	    "130681": "������",
	    "130682": "������",
	    "130683": "������",
	    "130684": "�߱�����",
	    "130699": "������",
	    "130700": "�żҿ���",
	    "130702": "�Ŷ���",
	    "130703": "������",
	    "130705": "������",
	    "130706": "�»�԰��",
	    "130721": "������",
	    "130722": "�ű���",
	    "130723": "������",
	    "130724": "��Դ��",
	    "130725": "������",
	    "130726": "ε��",
	    "130727": "��ԭ��",
	    "130728": "������",
	    "130729": "��ȫ��",
	    "130730": "������",
	    "130731": "��¹��",
	    "130732": "�����",
	    "130733": "������",
	    "130734": "������",
	    "130800": "�е���",
	    "130802": "˫����",
	    "130803": "˫����",
	    "130804": "ӥ��Ӫ�ӿ���",
	    "130821": "�е���",
	    "130822": "��¡��",
	    "130823": "ƽȪ��",
	    "130824": "��ƽ��",
	    "130825": "¡����",
	    "130826": "��������������",
	    "130827": "�������������",
	    "130828": "Χ�������ɹ���������",
	    "130829": "������",
	    "130900": "������",
	    "130902": "�»���",
	    "130903": "�˺���",
	    "130921": "����",
	    "130922": "����",
	    "130923": "������",
	    "130924": "������",
	    "130925": "��ɽ��",
	    "130926": "������",
	    "130927": "��Ƥ��",
	    "130928": "������",
	    "130929": "����",
	    "130930": "�ϴ����������",
	    "130981": "��ͷ��",
	    "130982": "������",
	    "130983": "������",
	    "130984": "�Ӽ���",
	    "130985": "������",
	    "131000": "�ȷ���",
	    "131002": "������",
	    "131003": "������",
	    "131022": "�̰���",
	    "131023": "������",
	    "131024": "�����",
	    "131025": "�����",
	    "131026": "�İ���",
	    "131028": "�󳧻���������",
	    "131081": "������",
	    "131082": "������",
	    "131083": "������",
	    "131100": "��ˮ��",
	    "131102": "�ҳ���",
	    "131121": "��ǿ��",
	    "131122": "������",
	    "131123": "��ǿ��",
	    "131124": "������",
	    "131125": "��ƽ��",
	    "131126": "�ʳ���",
	    "131127": "����",
	    "131128": "������",
	    "131181": "������",
	    "131182": "������",
	    "131183": "������",
	    "140000": "ɽ��ʡ",
	    "140100": "̫ԭ��",
	    "140105": "С����",
	    "140106": "ӭ����",
	    "140107": "�ӻ�����",
	    "140108": "���ƺ��",
	    "140109": "�������",
	    "140110": "��Դ��",
	    "140121": "������",
	    "140122": "������",
	    "140123": "¦����",
	    "140181": "�Ž���",
	    "140182": "������",
	    "140200": "��ͬ��",
	    "140202": "����",
	    "140203": "����",
	    "140211": "�Ͻ���",
	    "140212": "������",
	    "140221": "�����",
	    "140222": "������",
	    "140223": "������",
	    "140224": "������",
	    "140225": "��Դ��",
	    "140226": "������",
	    "140227": "��ͬ��",
	    "140228": "������",
	    "140300": "��Ȫ��",
	    "140302": "����",
	    "140303": "����",
	    "140311": "����",
	    "140321": "ƽ����",
	    "140322": "����",
	    "140323": "������",
	    "140400": "������",
	    "140421": "������",
	    "140423": "��ԫ��",
	    "140424": "������",
	    "140425": "ƽ˳��",
	    "140426": "�����",
	    "140427": "������",
	    "140428": "������",
	    "140429": "������",
	    "140430": "����",
	    "140431": "��Դ��",
	    "140481": "º����",
	    "140482": "����",
	    "140483": "����",
	    "140485": "������",
	    "140500": "������",
	    "140502": "����",
	    "140521": "��ˮ��",
	    "140522": "�����",
	    "140524": "�괨��",
	    "140525": "������",
	    "140581": "��ƽ��",
	    "140582": "������",
	    "140600": "˷����",
	    "140602": "˷����",
	    "140603": "ƽ³��",
	    "140621": "ɽ����",
	    "140622": "Ӧ��",
	    "140623": "������",
	    "140624": "������",
	    "140625": "������",
	    "140700": "������",
	    "140702": "�ܴ���",
	    "140721": "������",
	    "140722": "��Ȩ��",
	    "140723": "��˳��",
	    "140724": "������",
	    "140725": "������",
	    "140726": "̫����",
	    "140727": "����",
	    "140728": "ƽң��",
	    "140729": "��ʯ��",
	    "140781": "������",
	    "140782": "������",
	    "140800": "�˳���",
	    "140802": "�κ���",
	    "140821": "�����",
	    "140822": "������",
	    "140823": "��ϲ��",
	    "140824": "�ɽ��",
	    "140825": "�����",
	    "140826": "���",
	    "140827": "ԫ����",
	    "140828": "����",
	    "140829": "ƽ½��",
	    "140830": "�ǳ���",
	    "140881": "������",
	    "140882": "�ӽ���",
	    "140883": "������",
	    "140900": "������",
	    "140902": "�ø���",
	    "140921": "������",
	    "140922": "��̨��",
	    "140923": "����",
	    "140924": "������",
	    "140925": "������",
	    "140926": "������",
	    "140927": "�����",
	    "140928": "��կ��",
	    "140929": "����",
	    "140930": "������",
	    "140931": "������",
	    "140932": "ƫ����",
	    "140981": "ԭƽ��",
	    "140982": "������",
	    "141000": "�ٷ���",
	    "141002": "Ң����",
	    "141021": "������",
	    "141022": "�����",
	    "141023": "�����",
	    "141024": "�鶴��",
	    "141025": "����",
	    "141026": "������",
	    "141027": "��ɽ��",
	    "141028": "����",
	    "141029": "������",
	    "141030": "������",
	    "141031": "����",
	    "141032": "������",
	    "141033": "����",
	    "141034": "������",
	    "141081": "������",
	    "141082": "������",
	    "141083": "������",
	    "141100": "������",
	    "141102": "��ʯ��",
	    "141121": "��ˮ��",
	    "141122": "������",
	    "141123": "����",
	    "141124": "����",
	    "141125": "������",
	    "141126": "ʯ¥��",
	    "141127": "���",
	    "141128": "��ɽ��",
	    "141129": "������",
	    "141130": "������",
	    "141181": "Т����",
	    "141182": "������",
	    "141183": "������",
	    "150000": "���ɹ�������",
	    "150100": "��ͺ�����",
	    "150102": "�³���",
	    "150103": "������",
	    "150104": "��Ȫ��",
	    "150105": "������",
	    "150121": "��Ĭ������",
	    "150122": "�п�����",
	    "150123": "���ָ����",
	    "150124": "��ˮ����",
	    "150125": "�䴨��",
	    "150126": "������",
	    "150200": "��ͷ��",
	    "150202": "������",
	    "150203": "��������",
	    "150204": "��ɽ��",
	    "150205": "ʯ����",
	    "150206": "���ƶ�������",
	    "150207": "��ԭ��",
	    "150221": "��Ĭ������",
	    "150222": "������",
	    "150223": "�����ï����������",
	    "150224": "������",
	    "150300": "�ں���",
	    "150302": "��������",
	    "150303": "������",
	    "150304": "�ڴ���",
	    "150305": "������",
	    "150400": "�����",
	    "150402": "��ɽ��",
	    "150403": "Ԫ��ɽ��",
	    "150404": "��ɽ��",
	    "150421": "��³�ƶ�����",
	    "150422": "��������",
	    "150423": "��������",
	    "150424": "������",
	    "150425": "��ʲ������",
	    "150426": "��ţ����",
	    "150428": "��������",
	    "150429": "������",
	    "150430": "������",
	    "150431": "������",
	    "150500": "ͨ����",
	    "150502": "�ƶ�����",
	    "150521": "�ƶ�����������",
	    "150522": "�ƶ����������",
	    "150523": "��³��",
	    "150524": "������",
	    "150525": "������",
	    "150526": "��³����",
	    "150581": "���ֹ�����",
	    "150582": "������",
	    "150600": "������˹��",
	    "150602": "��ʤ��",
	    "150621": "��������",
	    "150622": "׼�����",
	    "150623": "���п�ǰ��",
	    "150624": "���п���",
	    "150625": "������",
	    "150626": "������",
	    "150627": "���������",
	    "150628": "������",
	    "150700": "���ױ�����",
	    "150702": "��������",
	    "150703": "����ŵ����",
	    "150721": "������",
	    "150722": "Ī�����ߴ��Ӷ���������",
	    "150723": "���״�������",
	    "150724": "���¿���������",
	    "150725": "�°Ͷ�����",
	    "150726": "�°Ͷ�������",
	    "150727": "�°Ͷ�������",
	    "150781": "��������",
	    "150782": "����ʯ��",
	    "150783": "��������",
	    "150784": "���������",
	    "150785": "������",
	    "150786": "������",
	    "150800": "�����׶���",
	    "150802": "�ٺ���",
	    "150821": "��ԭ��",
	    "150822": "�����",
	    "150823": "������ǰ��",
	    "150824": "����������",
	    "150825": "�����غ���",
	    "150826": "��������",
	    "150827": "������",
	    "150900": "�����첼��",
	    "150902": "������",
	    "150921": "׿����",
	    "150922": "������",
	    "150923": "�̶���",
	    "150924": "�˺���",
	    "150925": "������",
	    "150926": "���������ǰ��",
	    "150927": "�������������",
	    "150928": "������������",
	    "150929": "��������",
	    "150981": "������",
	    "150982": "������",
	    "152200": "�˰���",
	    "152201": "����������",
	    "152202": "����ɽ��",
	    "152221": "�ƶ�������ǰ��",
	    "152222": "�ƶ�����������",
	    "152223": "��������",
	    "152224": "ͻȪ��",
	    "152225": "������",
	    "152500": "���ֹ�����",
	    "152501": "����������",
	    "152502": "���ֺ�����",
	    "152522": "���͸���",
	    "152523": "����������",
	    "152524": "����������",
	    "152525": "������������",
	    "152526": "������������",
	    "152527": "̫������",
	    "152528": "�����",
	    "152529": "�������",
	    "152530": "������",
	    "152531": "������",
	    "152532": "������",
	    "152900": "��������",
	    "152921": "����������",
	    "152922": "����������",
	    "152923": "�������",
	    "152924": "������",
	    "210000": "����ʡ",
	    "210100": "������",
	    "210102": "��ƽ��",
	    "210103": "�����",
	    "210104": "����",
	    "210105": "�ʹ���",
	    "210106": "������",
	    "210111": "�ռ�����",
	    "210112": "������",
	    "210113": "�³�����",
	    "210114": "�ں���",
	    "210122": "������",
	    "210123": "��ƽ��",
	    "210124": "������",
	    "210181": "������",
	    "210184": "������",
	    "210185": "������",
	    "210200": "������",
	    "210202": "��ɽ��",
	    "210203": "������",
	    "210204": "ɳ�ӿ���",
	    "210211": "�ʾ�����",
	    "210212": "��˳����",
	    "210213": "������",
	    "210224": "������",
	    "210281": "�߷�����",
	    "210282": "��������",
	    "210283": "ׯ����",
	    "210298": "������",
	    "210300": "��ɽ��",
	    "210302": "������",
	    "210303": "������",
	    "210304": "��ɽ��",
	    "210311": "ǧɽ��",
	    "210321": "̨����",
	    "210323": "�������������",
	    "210381": "������",
	    "210382": "������",
	    "210400": "��˳��",
	    "210402": "�¸���",
	    "210403": "������",
	    "210404": "������",
	    "210411": "˳����",
	    "210421": "��˳��",
	    "210422": "�±�����������",
	    "210423": "��ԭ����������",
	    "210424": "������",
	    "210500": "��Ϫ��",
	    "210502": "ƽɽ��",
	    "210503": "Ϫ����",
	    "210504": "��ɽ��",
	    "210505": "�Ϸ���",
	    "210521": "��Ϫ����������",
	    "210522": "��������������",
	    "210523": "������",
	    "210600": "������",
	    "210602": "Ԫ����",
	    "210603": "������",
	    "210604": "����",
	    "210624": "�������������",
	    "210681": "������",
	    "210682": "�����",
	    "210683": "������",
	    "210700": "������",
	    "210702": "������",
	    "210703": "�����",
	    "210711": "̫����",
	    "210726": "��ɽ��",
	    "210727": "����",
	    "210781": "�躣��",
	    "210782": "������",
	    "210783": "������",
	    "210800": "Ӫ����",
	    "210802": "վǰ��",
	    "210803": "������",
	    "210804": "����Ȧ��",
	    "210811": "�ϱ���",
	    "210881": "������",
	    "210882": "��ʯ����",
	    "210883": "������",
	    "210900": "������",
	    "210902": "������",
	    "210903": "������",
	    "210904": "̫ƽ��",
	    "210905": "�������",
	    "210911": "ϸ����",
	    "210921": "�����ɹ���������",
	    "210922": "������",
	    "210923": "������",
	    "211000": "������",
	    "211002": "������",
	    "211003": "��ʥ��",
	    "211004": "��ΰ��",
	    "211005": "��������",
	    "211011": "̫�Ӻ���",
	    "211021": "������",
	    "211081": "������",
	    "211082": "������",
	    "211100": "�̽���",
	    "211102": "˫̨����",
	    "211103": "��¡̨��",
	    "211121": "������",
	    "211122": "��ɽ��",
	    "211123": "������",
	    "211200": "������",
	    "211202": "������",
	    "211204": "�����",
	    "211221": "������",
	    "211223": "������",
	    "211224": "��ͼ��",
	    "211281": "����ɽ��",
	    "211282": "��ԭ��",
	    "211283": "������",
	    "211300": "������",
	    "211302": "˫����",
	    "211303": "������",
	    "211321": "������",
	    "211322": "��ƽ��",
	    "211324": "�����������ɹ���������",
	    "211381": "��Ʊ��",
	    "211382": "��Դ��",
	    "211383": "������",
	    "211400": "��«����",
	    "211402": "��ɽ��",
	    "211403": "������",
	    "211404": "��Ʊ��",
	    "211421": "������",
	    "211422": "������",
	    "211481": "�˳���",
	    "211482": "������",
	    "220000": "����ʡ",
	    "220100": "������",
	    "220102": "�Ϲ���",
	    "220103": "�����",
	    "220104": "������",
	    "220105": "������",
	    "220106": "��԰��",
	    "220112": "˫����",
	    "220122": "ũ����",
	    "220181": "��̨��",
	    "220182": "������",
	    "220183": "�»���",
	    "220188": "������",
	    "220200": "������",
	    "220202": "������",
	    "220203": "��̶��",
	    "220204": "��Ӫ��",
	    "220211": "������",
	    "220221": "������",
	    "220281": "�Ժ���",
	    "220282": "�����",
	    "220283": "������",
	    "220284": "��ʯ��",
	    "220285": "������",
	    "220300": "��ƽ��",
	    "220302": "������",
	    "220303": "������",
	    "220322": "������",
	    "220323": "��ͨ����������",
	    "220381": "��������",
	    "220382": "˫����",
	    "220383": "������",
	    "220400": "��Դ��",
	    "220402": "��ɽ��",
	    "220403": "������",
	    "220421": "������",
	    "220422": "������",
	    "220423": "������",
	    "220500": "ͨ����",
	    "220502": "������",
	    "220503": "��������",
	    "220521": "ͨ����",
	    "220523": "������",
	    "220524": "������",
	    "220581": "÷�ӿ���",
	    "220582": "������",
	    "220583": "������",
	    "220600": "��ɽ��",
	    "220602": "�뽭��",
	    "220621": "������",
	    "220622": "������",
	    "220623": "���׳�����������",
	    "220625": "��Դ��",
	    "220681": "�ٽ���",
	    "220682": "������",
	    "220700": "��ԭ��",
	    "220702": "������",
	    "220721": "ǰ������˹�ɹ���������",
	    "220722": "������",
	    "220723": "Ǭ����",
	    "220724": "������",
	    "220725": "������",
	    "220800": "�׳���",
	    "220802": "䬱���",
	    "220821": "������",
	    "220822": "ͨ����",
	    "220881": "�����",
	    "220882": "����",
	    "220883": "������",
	    "222400": "�ӱ߳�����������",
	    "222401": "�Ӽ���",
	    "222402": "ͼ����",
	    "222403": "�ػ���",
	    "222404": "������",
	    "222405": "������",
	    "222406": "������",
	    "222424": "������",
	    "222426": "��ͼ��",
	    "222427": "������",
	    "230000": "������ʡ",
	    "230100": "��������",
	    "230102": "������",
	    "230103": "�ϸ���",
	    "230104": "������",
	    "230106": "�㷻��",
	    "230108": "ƽ����",
	    "230109": "�ɱ���",
	    "230111": "������",
	    "230123": "������",
	    "230124": "������",
	    "230125": "����",
	    "230126": "������",
	    "230127": "ľ����",
	    "230128": "ͨ����",
	    "230129": "������",
	    "230181": "������",
	    "230182": "˫����",
	    "230183": "��־��",
	    "230184": "�峣��",
	    "230186": "������",
	    "230200": "���������",
	    "230202": "��ɳ��",
	    "230203": "������",
	    "230204": "������",
	    "230205": "����Ϫ��",
	    "230206": "����������",
	    "230207": "����ɽ��",
	    "230208": "÷��˹���Ӷ�����",
	    "230221": "������",
	    "230223": "������",
	    "230224": "̩����",
	    "230225": "������",
	    "230227": "��ԣ��",
	    "230229": "��ɽ��",
	    "230230": "�˶���",
	    "230231": "��Ȫ��",
	    "230281": "ګ����",
	    "230282": "������",
	    "230300": "������",
	    "230302": "������",
	    "230303": "��ɽ��",
	    "230304": "�ε���",
	    "230305": "������",
	    "230306": "���Ӻ���",
	    "230307": "��ɽ��",
	    "230321": "������",
	    "230381": "������",
	    "230382": "��ɽ��",
	    "230383": "������",
	    "230400": "�׸���",
	    "230402": "������",
	    "230403": "��ũ��",
	    "230404": "��ɽ��",
	    "230405": "�˰���",
	    "230406": "��ɽ��",
	    "230407": "��ɽ��",
	    "230421": "�ܱ���",
	    "230422": "�����",
	    "230423": "������",
	    "230500": "˫Ѽɽ��",
	    "230502": "��ɽ��",
	    "230503": "�붫��",
	    "230505": "�ķ�̨��",
	    "230506": "��ɽ��",
	    "230521": "������",
	    "230522": "������",
	    "230523": "������",
	    "230524": "�ĺ���",
	    "230525": "������",
	    "230600": "������",
	    "230602": "����ͼ��",
	    "230603": "������",
	    "230604": "�ú�·��",
	    "230605": "�����",
	    "230606": "��ͬ��",
	    "230621": "������",
	    "230622": "��Դ��",
	    "230623": "�ֵ���",
	    "230624": "�Ŷ������ɹ���������",
	    "230625": "������",
	    "230700": "������",
	    "230702": "������",
	    "230703": "�ϲ���",
	    "230704": "�Ѻ���",
	    "230705": "������",
	    "230706": "������",
	    "230707": "������",
	    "230708": "��Ϫ��",
	    "230709": "��ɽ����",
	    "230710": "��Ӫ��",
	    "230711": "�������",
	    "230712": "��������",
	    "230713": "������",
	    "230714": "��������",
	    "230715": "������",
	    "230716": "�ϸ�����",
	    "230722": "������",
	    "230781": "������",
	    "230782": "������",
	    "230800": "��ľ˹��",
	    "230803": "������",
	    "230804": "ǰ����",
	    "230805": "������",
	    "230811": "����",
	    "230822": "������",
	    "230826": "�봨��",
	    "230828": "��ԭ��",
	    "230833": "��Զ��",
	    "230881": "ͬ����",
	    "230882": "������",
	    "230883": "������",
	    "230900": "��̨����",
	    "230902": "������",
	    "230903": "��ɽ��",
	    "230904": "���Ӻ���",
	    "230921": "������",
	    "230922": "������",
	    "231000": "ĵ������",
	    "231002": "������",
	    "231003": "������",
	    "231004": "������",
	    "231005": "������",
	    "231024": "������",
	    "231025": "�ֿ���",
	    "231081": "��Һ���",
	    "231083": "������",
	    "231084": "������",
	    "231085": "������",
	    "231086": "������",
	    "231100": "�ں���",
	    "231102": "������",
	    "231121": "�۽���",
	    "231123": "ѷ����",
	    "231124": "������",
	    "231181": "������",
	    "231182": "���������",
	    "231183": "������",
	    "231200": "�绯��",
	    "231202": "������",
	    "231221": "������",
	    "231222": "������",
	    "231223": "�����",
	    "231224": "�찲��",
	    "231225": "��ˮ��",
	    "231226": "������",
	    "231281": "������",
	    "231282": "�ض���",
	    "231283": "������",
	    "231284": "������",
	    "232700": "���˰������",
	    "232702": "������",
	    "232703": "������",
	    "232704": "������",
	    "232721": "������",
	    "232722": "������",
	    "232723": "Į����",
	    "232724": "�Ӹ������",
	    "232725": "������",
	    "310000": "�Ϻ�",
	    "310100": "�Ϻ���",
	    "310101": "������",
	    "310104": "�����",
	    "310105": "������",
	    "310106": "������",
	    "310107": "������",
	    "310108": "բ����",
	    "310109": "�����",
	    "310110": "������",
	    "310112": "������",
	    "310113": "��ɽ��",
	    "310114": "�ζ���",
	    "310115": "�ֶ�����",
	    "310116": "��ɽ��",
	    "310117": "�ɽ���",
	    "310118": "������",
	    "310120": "������",
	    "310230": "������",
	    "310231": "������",
	    "320000": "����ʡ",
	    "320100": "�Ͼ���",
	    "320102": "������",
	    "320104": "�ػ���",
	    "320105": "������",
	    "320106": "��¥��",
	    "320111": "�ֿ���",
	    "320113": "��ϼ��",
	    "320114": "�껨̨��",
	    "320115": "������",
	    "320116": "������",
	    "320124": "��ˮ��",
	    "320125": "�ߴ���",
	    "320126": "������",
	    "320200": "������",
	    "320202": "�簲��",
	    "320203": "�ϳ���",
	    "320204": "������",
	    "320205": "��ɽ��",
	    "320206": "��ɽ��",
	    "320211": "������",
	    "320281": "������",
	    "320282": "������",
	    "320297": "������",
	    "320300": "������",
	    "320302": "��¥��",
	    "320303": "������",
	    "320305": "������",
	    "320311": "Ȫɽ��",
	    "320321": "����",
	    "320322": "����",
	    "320323": "ͭɽ��",
	    "320324": "�����",
	    "320381": "������",
	    "320382": "������",
	    "320383": "������",
	    "320400": "������",
	    "320402": "������",
	    "320404": "��¥��",
	    "320405": "��������",
	    "320411": "�±���",
	    "320412": "�����",
	    "320481": "������",
	    "320482": "��̳��",
	    "320483": "������",
	    "320500": "������",
	    "320505": "������",
	    "320506": "������",
	    "320507": "�����",
	    "320508": "������",
	    "320581": "������",
	    "320582": "�żҸ���",
	    "320583": "��ɽ��",
	    "320584": "�⽭��",
	    "320585": "̫����",
	    "320596": "������",
	    "320600": "��ͨ��",
	    "320602": "�紨��",
	    "320611": "��բ��",
	    "320612": "ͨ����",
	    "320621": "������",
	    "320623": "�綫��",
	    "320681": "����",
	    "320682": "�����",
	    "320684": "������",
	    "320694": "������",
	    "320700": "���Ƹ���",
	    "320703": "������",
	    "320705": "������",
	    "320706": "������",
	    "320721": "������",
	    "320722": "������",
	    "320723": "������",
	    "320724": "������",
	    "320725": "������",
	    "320800": "������",
	    "320802": "�����",
	    "320803": "������",
	    "320804": "������",
	    "320811": "������",
	    "320826": "��ˮ��",
	    "320829": "������",
	    "320830": "������",
	    "320831": "�����",
	    "320832": "������",
	    "320900": "�γ���",
	    "320902": "ͤ����",
	    "320903": "�ζ���",
	    "320921": "��ˮ��",
	    "320922": "������",
	    "320923": "������",
	    "320924": "������",
	    "320925": "������",
	    "320981": "��̨��",
	    "320982": "�����",
	    "320983": "������",
	    "321000": "������",
	    "321002": "������",
	    "321003": "������",
	    "321023": "��Ӧ��",
	    "321081": "������",
	    "321084": "������",
	    "321088": "������",
	    "321093": "������",
	    "321100": "����",
	    "321102": "������",
	    "321111": "������",
	    "321112": "��ͽ��",
	    "321181": "������",
	    "321182": "������",
	    "321183": "������",
	    "321184": "������",
	    "321200": "̩����",
	    "321202": "������",
	    "321203": "�߸���",
	    "321281": "�˻���",
	    "321282": "������",
	    "321283": "̩����",
	    "321284": "������",
	    "321285": "������",
	    "321300": "��Ǩ��",
	    "321302": "�޳���",
	    "321311": "��ԥ��",
	    "321322": "������",
	    "321323": "������",
	    "321324": "�����",
	    "321325": "������",
	    "330000": "�㽭ʡ",
	    "330100": "������",
	    "330102": "�ϳ���",
	    "330103": "�³���",
	    "330104": "������",
	    "330105": "������",
	    "330106": "������",
	    "330108": "������",
	    "330109": "��ɽ��",
	    "330110": "�ຼ��",
	    "330122": "ͩ®��",
	    "330127": "������",
	    "330182": "������",
	    "330183": "������",
	    "330185": "�ٰ���",
	    "330186": "������",
	    "330200": "������",
	    "330203": "������",
	    "330204": "������",
	    "330205": "������",
	    "330206": "������",
	    "330211": "����",
	    "330212": "۴����",
	    "330225": "��ɽ��",
	    "330226": "������",
	    "330281": "��Ҧ��",
	    "330282": "��Ϫ��",
	    "330283": "���",
	    "330284": "������",
	    "330300": "������",
	    "330302": "¹����",
	    "330303": "������",
	    "330304": "걺���",
	    "330322": "��ͷ��",
	    "330324": "������",
	    "330326": "ƽ����",
	    "330327": "������",
	    "330328": "�ĳ���",
	    "330329": "̩˳��",
	    "330381": "����",
	    "330382": "������",
	    "330383": "������",
	    "330400": "������",
	    "330402": "�Ϻ���",
	    "330411": "������",
	    "330421": "������",
	    "330424": "������",
	    "330481": "������",
	    "330482": "ƽ����",
	    "330483": "ͩ����",
	    "330484": "������",
	    "330500": "������",
	    "330502": "������",
	    "330503": "�����",
	    "330521": "������",
	    "330522": "������",
	    "330523": "������",
	    "330524": "������",
	    "330600": "������",
	    "330602": "Խ����",
	    "330621": "������",
	    "330624": "�²���",
	    "330681": "������",
	    "330682": "������",
	    "330683": "������",
	    "330684": "������",
	    "330700": "����",
	    "330702": "�ĳ���",
	    "330703": "����",
	    "330723": "������",
	    "330726": "�ֽ���",
	    "330727": "�Ͱ���",
	    "330781": "��Ϫ��",
	    "330782": "������",
	    "330783": "������",
	    "330784": "������",
	    "330785": "������",
	    "330800": "������",
	    "330802": "�³���",
	    "330803": "�齭��",
	    "330822": "��ɽ��",
	    "330824": "������",
	    "330825": "������",
	    "330881": "��ɽ��",
	    "330882": "������",
	    "330900": "��ɽ��",
	    "330902": "������",
	    "330903": "������",
	    "330921": "�ɽ��",
	    "330922": "������",
	    "330923": "������",
	    "331000": "̨����",
	    "331002": "������",
	    "331003": "������",
	    "331004": "·����",
	    "331021": "����",
	    "331022": "������",
	    "331023": "��̨��",
	    "331024": "�ɾ���",
	    "331081": "������",
	    "331082": "�ٺ���",
	    "331083": "������",
	    "331100": "��ˮ��",
	    "331102": "������",
	    "331121": "������",
	    "331122": "������",
	    "331123": "�����",
	    "331124": "������",
	    "331125": "�ƺ���",
	    "331126": "��Ԫ��",
	    "331127": "�������������",
	    "331181": "��Ȫ��",
	    "331182": "������",
	    "340000": "����ʡ",
	    "340100": "�Ϸ���",
	    "340102": "������",
	    "340103": "®����",
	    "340104": "��ɽ��",
	    "340111": "������",
	    "340121": "������",
	    "340122": "�ʶ���",
	    "340123": "������",
	    "340192": "������",
	    "340200": "�ߺ���",
	    "340202": "������",
	    "340203": "߮����",
	    "340207": "𯽭��",
	    "340208": "��ɽ��",
	    "340221": "�ߺ���",
	    "340222": "������",
	    "340223": "������",
	    "340224": "������",
	    "340300": "������",
	    "340302": "���Ӻ���",
	    "340303": "��ɽ��",
	    "340304": "�����",
	    "340311": "������",
	    "340321": "��Զ��",
	    "340322": "�����",
	    "340323": "������",
	    "340324": "������",
	    "340400": "������",
	    "340402": "��ͨ��",
	    "340403": "�������",
	    "340404": "л�Ҽ���",
	    "340405": "�˹�ɽ��",
	    "340406": "�˼���",
	    "340421": "��̨��",
	    "340422": "������",
	    "340500": "��ɽ��",
	    "340503": "��ɽ��",
	    "340504": "��ɽ��",
	    "340506": "������",
	    "340521": "��Ϳ��",
	    "340522": "������",
	    "340600": "������",
	    "340602": "�ż���",
	    "340603": "��ɽ��",
	    "340604": "��ɽ��",
	    "340621": "�Ϫ��",
	    "340622": "������",
	    "340700": "ͭ����",
	    "340702": "ͭ��ɽ��",
	    "340703": "ʨ��ɽ��",
	    "340711": "����",
	    "340721": "ͭ����",
	    "340722": "������",
	    "340800": "������",
	    "340802": "ӭ����",
	    "340803": "�����",
	    "340811": "������",
	    "340822": "������",
	    "340823": "������",
	    "340824": "Ǳɽ��",
	    "340825": "̫����",
	    "340826": "������",
	    "340827": "������",
	    "340828": "������",
	    "340881": "ͩ����",
	    "340882": "������",
	    "341000": "��ɽ��",
	    "341002": "��Ϫ��",
	    "341003": "��ɽ��",
	    "341004": "������",
	    "341021": "���",
	    "341022": "������",
	    "341023": "����",
	    "341024": "������",
	    "341025": "������",
	    "341100": "������",
	    "341102": "������",
	    "341103": "������",
	    "341122": "������",
	    "341124": "ȫ����",
	    "341125": "��Զ��",
	    "341126": "������",
	    "341181": "�쳤��",
	    "341182": "������",
	    "341183": "������",
	    "341200": "������",
	    "341202": "�����",
	    "341203": "򣶫��",
	    "341204": "�Ȫ��",
	    "341221": "��Ȫ��",
	    "341222": "̫����",
	    "341225": "������",
	    "341226": "�����",
	    "341282": "������",
	    "341283": "������",
	    "341300": "������",
	    "341302": "������",
	    "341321": "�ɽ��",
	    "341322": "����",
	    "341323": "�����",
	    "341324": "����",
	    "341325": "������",
	    "341400": "������",
	    "341421": "®����",
	    "341422": "��Ϊ��",
	    "341423": "��ɽ��",
	    "341424": "����",
	    "341500": "������",
	    "341502": "����",
	    "341503": "ԣ����",
	    "341521": "����",
	    "341522": "������",
	    "341523": "�����",
	    "341524": "��կ��",
	    "341525": "��ɽ��",
	    "341526": "������",
	    "341600": "������",
	    "341602": "�۳���",
	    "341621": "������",
	    "341622": "�ɳ���",
	    "341623": "������",
	    "341624": "������",
	    "341700": "������",
	    "341702": "�����",
	    "341721": "������",
	    "341722": "ʯ̨��",
	    "341723": "������",
	    "341724": "������",
	    "341800": "������",
	    "341802": "������",
	    "341821": "��Ϫ��",
	    "341822": "�����",
	    "341823": "����",
	    "341824": "��Ϫ��",
	    "341825": "캵���",
	    "341881": "������",
	    "341882": "������",
	    "350000": "����ʡ",
	    "350100": "������",
	    "350102": "��¥��",
	    "350103": "̨����",
	    "350104": "��ɽ��",
	    "350105": "��β��",
	    "350111": "������",
	    "350121": "������",
	    "350122": "������",
	    "350123": "��Դ��",
	    "350124": "������",
	    "350125": "��̩��",
	    "350128": "ƽ̶��",
	    "350181": "������",
	    "350182": "������",
	    "350183": "������",
	    "350200": "������",
	    "350203": "˼����",
	    "350205": "������",
	    "350206": "������",
	    "350211": "������",
	    "350212": "ͬ����",
	    "350213": "�谲��",
	    "350214": "������",
	    "350300": "������",
	    "350302": "������",
	    "350303": "������",
	    "350304": "�����",
	    "350305": "������",
	    "350322": "������",
	    "350323": "������",
	    "350400": "������",
	    "350402": "÷����",
	    "350403": "��Ԫ��",
	    "350421": "��Ϫ��",
	    "350423": "������",
	    "350424": "������",
	    "350425": "������",
	    "350426": "��Ϫ��",
	    "350427": "ɳ��",
	    "350428": "������",
	    "350429": "̩����",
	    "350430": "������",
	    "350481": "������",
	    "350482": "������",
	    "350500": "Ȫ����",
	    "350502": "�����",
	    "350503": "������",
	    "350504": "�彭��",
	    "350505": "Ȫ����",
	    "350521": "�ݰ���",
	    "350524": "��Ϫ��",
	    "350525": "������",
	    "350526": "�»���",
	    "350527": "������",
	    "350581": "ʯʨ��",
	    "350582": "������",
	    "350583": "�ϰ���",
	    "350584": "������",
	    "350600": "������",
	    "350602": "ܼ����",
	    "350603": "������",
	    "350622": "������",
	    "350623": "������",
	    "350624": "گ����",
	    "350625": "��̩��",
	    "350626": "��ɽ��",
	    "350627": "�Ͼ���",
	    "350628": "ƽ����",
	    "350629": "������",
	    "350681": "������",
	    "350682": "������",
	    "350700": "��ƽ��",
	    "350702": "��ƽ��",
	    "350721": "˳����",
	    "350722": "�ֳ���",
	    "350723": "������",
	    "350724": "��Ϫ��",
	    "350725": "������",
	    "350781": "������",
	    "350782": "����ɽ��",
	    "350783": "�����",
	    "350784": "������",
	    "350785": "������",
	    "350800": "������",
	    "350802": "������",
	    "350821": "��͡��",
	    "350822": "������",
	    "350823": "�Ϻ���",
	    "350824": "��ƽ��",
	    "350825": "������",
	    "350881": "��ƽ��",
	    "350882": "������",
	    "350900": "������",
	    "350902": "������",
	    "350921": "ϼ����",
	    "350922": "������",
	    "350923": "������",
	    "350924": "������",
	    "350925": "������",
	    "350926": "������",
	    "350981": "������",
	    "350982": "������",
	    "350983": "������",
	    "360000": "����ʡ",
	    "360100": "�ϲ���",
	    "360102": "������",
	    "360103": "������",
	    "360104": "��������",
	    "360105": "������",
	    "360111": "��ɽ����",
	    "360121": "�ϲ���",
	    "360122": "�½���",
	    "360123": "������",
	    "360124": "������",
	    "360128": "������",
	    "360200": "��������",
	    "360202": "������",
	    "360203": "��ɽ��",
	    "360222": "������",
	    "360281": "��ƽ��",
	    "360282": "������",
	    "360300": "Ƽ����",
	    "360302": "��Դ��",
	    "360313": "�涫��",
	    "360321": "������",
	    "360322": "������",
	    "360323": "«Ϫ��",
	    "360324": "������",
	    "360400": "�Ž���",
	    "360402": "®ɽ��",
	    "360403": "�����",
	    "360421": "�Ž���",
	    "360423": "������",
	    "360424": "��ˮ��",
	    "360425": "������",
	    "360426": "�°���",
	    "360427": "������",
	    "360428": "������",
	    "360429": "������",
	    "360430": "������",
	    "360481": "�����",
	    "360482": "������",
	    "360483": "�������",
	    "360500": "������",
	    "360502": "��ˮ��",
	    "360521": "������",
	    "360522": "������",
	    "360600": "ӥ̶��",
	    "360602": "�º���",
	    "360622": "�཭��",
	    "360681": "��Ϫ��",
	    "360682": "������",
	    "360700": "������",
	    "360702": "�¹���",
	    "360721": "����",
	    "360722": "�ŷ���",
	    "360723": "������",
	    "360724": "������",
	    "360725": "������",
	    "360726": "��Զ��",
	    "360727": "������",
	    "360728": "������",
	    "360729": "ȫ����",
	    "360730": "������",
	    "360731": "�ڶ���",
	    "360732": "�˹���",
	    "360733": "�����",
	    "360734": "Ѱ����",
	    "360735": "ʯ����",
	    "360781": "�����",
	    "360782": "�Ͽ���",
	    "360783": "������",
	    "360800": "������",
	    "360802": "������",
	    "360803": "��ԭ��",
	    "360821": "������",
	    "360822": "��ˮ��",
	    "360823": "Ͽ����",
	    "360824": "�¸���",
	    "360825": "������",
	    "360826": "̩����",
	    "360827": "�촨��",
	    "360828": "����",
	    "360829": "������",
	    "360830": "������",
	    "360881": "����ɽ��",
	    "360882": "������",
	    "360900": "�˴���",
	    "360902": "Ԭ����",
	    "360921": "������",
	    "360922": "������",
	    "360923": "�ϸ���",
	    "360924": "�˷���",
	    "360925": "������",
	    "360926": "ͭ����",
	    "360981": "�����",
	    "360982": "������",
	    "360983": "�߰���",
	    "360984": "������",
	    "361000": "������",
	    "361002": "�ٴ���",
	    "361021": "�ϳ���",
	    "361022": "�质��",
	    "361023": "�Ϸ���",
	    "361024": "������",
	    "361025": "�ְ���",
	    "361026": "�˻���",
	    "361027": "��Ϫ��",
	    "361028": "��Ϫ��",
	    "361029": "������",
	    "361030": "�����",
	    "361031": "������",
	    "361100": "������",
	    "361102": "������",
	    "361121": "������",
	    "361122": "�����",
	    "361123": "��ɽ��",
	    "361124": "Ǧɽ��",
	    "361125": "�����",
	    "361126": "߮����",
	    "361127": "�����",
	    "361128": "۶����",
	    "361129": "������",
	    "361130": "��Դ��",
	    "361181": "������",
	    "361182": "������",
	    "370000": "ɽ��ʡ",
	    "370100": "������",
	    "370102": "������",
	    "370103": "������",
	    "370104": "������",
	    "370105": "������",
	    "370112": "������",
	    "370113": "������",
	    "370124": "ƽ����",
	    "370125": "������",
	    "370126": "�̺���",
	    "370181": "������",
	    "370182": "������",
	    "370200": "�ൺ��",
	    "370202": "������",
	    "370203": "�б���",
	    "370211": "�Ƶ���",
	    "370212": "��ɽ��",
	    "370213": "�����",
	    "370214": "������",
	    "370281": "������",
	    "370282": "��ī��",
	    "370283": "ƽ����",
	    "370285": "������",
	    "370286": "������",
	    "370300": "�Ͳ���",
	    "370302": "�ʹ���",
	    "370303": "�ŵ���",
	    "370304": "��ɽ��",
	    "370305": "������",
	    "370306": "�ܴ���",
	    "370321": "��̨��",
	    "370322": "������",
	    "370323": "��Դ��",
	    "370324": "������",
	    "370400": "��ׯ��",
	    "370402": "������",
	    "370403": "Ѧ����",
	    "370404": "ỳ���",
	    "370405": "̨��ׯ��",
	    "370406": "ɽͤ��",
	    "370481": "������",
	    "370482": "������",
	    "370500": "��Ӫ��",
	    "370502": "��Ӫ��",
	    "370503": "�ӿ���",
	    "370521": "������",
	    "370522": "������",
	    "370523": "������",
	    "370591": "������",
	    "370600": "��̨��",
	    "370602": "֥���",
	    "370611": "��ɽ��",
	    "370612": "Ĳƽ��",
	    "370613": "��ɽ��",
	    "370634": "������",
	    "370681": "������",
	    "370682": "������",
	    "370683": "������",
	    "370684": "������",
	    "370685": "��Զ��",
	    "370686": "��ϼ��",
	    "370687": "������",
	    "370688": "������",
	    "370700": "Ϋ����",
	    "370702": "Ϋ����",
	    "370703": "��ͤ��",
	    "370704": "������",
	    "370705": "������",
	    "370724": "������",
	    "370725": "������",
	    "370781": "������",
	    "370782": "�����",
	    "370783": "�ٹ���",
	    "370784": "������",
	    "370785": "������",
	    "370786": "������",
	    "370787": "������",
	    "370800": "������",
	    "370802": "������",
	    "370811": "�γ���",
	    "370826": "΢ɽ��",
	    "370827": "��̨��",
	    "370828": "������",
	    "370829": "������",
	    "370830": "������",
	    "370831": "��ˮ��",
	    "370832": "��ɽ��",
	    "370881": "������",
	    "370882": "������",
	    "370883": "�޳���",
	    "370884": "������",
	    "370900": "̩����",
	    "370902": "̩ɽ��",
	    "370903": "�����",
	    "370921": "������",
	    "370923": "��ƽ��",
	    "370982": "��̩��",
	    "370983": "�ʳ���",
	    "370984": "������",
	    "371000": "������",
	    "371002": "������",
	    "371081": "�ĵ���",
	    "371082": "�ٳ���",
	    "371083": "��ɽ��",
	    "371084": "������",
	    "371100": "������",
	    "371102": "������",
	    "371103": "�ɽ��",
	    "371121": "������",
	    "371122": "����",
	    "371123": "������",
	    "371200": "������",
	    "371202": "������",
	    "371203": "�ֳ���",
	    "371204": "������",
	    "371300": "������",
	    "371302": "��ɽ��",
	    "371311": "��ׯ��",
	    "371312": "�Ӷ���",
	    "371321": "������",
	    "371322": "۰����",
	    "371323": "��ˮ��",
	    "371324": "��ɽ��",
	    "371325": "����",
	    "371326": "ƽ����",
	    "371327": "������",
	    "371328": "������",
	    "371329": "������",
	    "371330": "������",
	    "371400": "������",
	    "371402": "�³���",
	    "371421": "����",
	    "371422": "������",
	    "371423": "������",
	    "371424": "������",
	    "371425": "�����",
	    "371426": "ƽԭ��",
	    "371427": "�Ľ���",
	    "371428": "�����",
	    "371481": "������",
	    "371482": "�����",
	    "371483": "������",
	    "371500": "�ĳ���",
	    "371502": "��������",
	    "371521": "�����",
	    "371522": "ݷ��",
	    "371523": "��ƽ��",
	    "371524": "������",
	    "371525": "����",
	    "371526": "������",
	    "371581": "������",
	    "371582": "������",
	    "371600": "������",
	    "371602": "������",
	    "371621": "������",
	    "371622": "������",
	    "371623": "�����",
	    "371624": "մ����",
	    "371625": "������",
	    "371626": "��ƽ��",
	    "371627": "������",
	    "371700": "������",
	    "371702": "ĵ����",
	    "371721": "����",
	    "371722": "����",
	    "371723": "������",
	    "371724": "��Ұ��",
	    "371725": "۩����",
	    "371726": "۲����",
	    "371727": "������",
	    "371728": "������",
	    "371729": "������",
	    "410000": "����ʡ",
	    "410100": "֣����",
	    "410102": "��ԭ��",
	    "410103": "������",
	    "410104": "�ܳǻ�����",
	    "410105": "��ˮ��",
	    "410106": "�Ͻ���",
	    "410108": "�ݼ���",
	    "410122": "��Ĳ��",
	    "410181": "������",
	    "410182": "������",
	    "410183": "������",
	    "410184": "��֣��",
	    "410185": "�Ƿ���",
	    "410188": "������",
	    "410200": "������",
	    "410202": "��ͤ��",
	    "410203": "˳�ӻ�����",
	    "410204": "��¥��",
	    "410205": "����̨��",
	    "410211": "������",
	    "410221": "���",
	    "410222": "ͨ����",
	    "410223": "ξ����",
	    "410224": "������",
	    "410225": "������",
	    "410226": "������",
	    "410300": "������",
	    "410302": "�ϳ���",
	    "410303": "������",
	    "410304": "�e�ӻ�����",
	    "410305": "������",
	    "410306": "������",
	    "410307": "������",
	    "410322": "�Ͻ���",
	    "410323": "�°���",
	    "410324": "�ﴨ��",
	    "410325": "����",
	    "410326": "������",
	    "410327": "������",
	    "410328": "������",
	    "410329": "������",
	    "410381": "��ʦ��",
	    "410400": "ƽ��ɽ��",
	    "410402": "�»���",
	    "410403": "������",
	    "410404": "ʯ����",
	    "410411": "տ����",
	    "410421": "������",
	    "410422": "Ҷ��",
	    "410423": "³ɽ��",
	    "410425": "ۣ��",
	    "410481": "�����",
	    "410482": "������",
	    "410483": "������",
	    "410500": "������",
	    "410502": "�ķ���",
	    "410503": "������",
	    "410505": "����",
	    "410506": "������",
	    "410522": "������",
	    "410523": "������",
	    "410526": "����",
	    "410527": "�ڻ���",
	    "410581": "������",
	    "410582": "������",
	    "410600": "�ױ���",
	    "410602": "��ɽ��",
	    "410603": "ɽ����",
	    "410611": "俱���",
	    "410621": "����",
	    "410622": "���",
	    "410623": "������",
	    "410700": "������",
	    "410702": "������",
	    "410703": "������",
	    "410704": "��Ȫ��",
	    "410711": "��Ұ��",
	    "410721": "������",
	    "410724": "�����",
	    "410725": "ԭ����",
	    "410726": "�ӽ���",
	    "410727": "������",
	    "410728": "��ԫ��",
	    "410781": "������",
	    "410782": "������",
	    "410783": "������",
	    "410800": "������",
	    "410802": "�����",
	    "410803": "��վ��",
	    "410804": "�����",
	    "410811": "ɽ����",
	    "410821": "������",
	    "410822": "������",
	    "410823": "������",
	    "410825": "����",
	    "410881": "��Դ��",
	    "410882": "������",
	    "410883": "������",
	    "410884": "������",
	    "410900": "�����",
	    "410902": "������",
	    "410922": "�����",
	    "410923": "������",
	    "410926": "����",
	    "410927": "̨ǰ��",
	    "410928": "�����",
	    "410929": "������",
	    "411000": "�����",
	    "411002": "κ����",
	    "411023": "�����",
	    "411024": "۳����",
	    "411025": "�����",
	    "411081": "������",
	    "411082": "������",
	    "411083": "������",
	    "411100": "�����",
	    "411102": "Դ����",
	    "411103": "۱����",
	    "411104": "������",
	    "411121": "������",
	    "411122": "�����",
	    "411123": "������",
	    "411200": "����Ͽ��",
	    "411202": "������",
	    "411221": "�ų���",
	    "411222": "����",
	    "411224": "¬����",
	    "411281": "������",
	    "411282": "�鱦��",
	    "411283": "������",
	    "411300": "������",
	    "411302": "�����",
	    "411303": "������",
	    "411321": "������",
	    "411322": "������",
	    "411323": "��Ͽ��",
	    "411324": "��ƽ��",
	    "411325": "������",
	    "411326": "������",
	    "411327": "������",
	    "411328": "�ƺ���",
	    "411329": "��Ұ��",
	    "411330": "ͩ����",
	    "411381": "������",
	    "411382": "������",
	    "411400": "������",
	    "411402": "��԰��",
	    "411403": "�����",
	    "411421": "��Ȩ��",
	    "411422": "���",
	    "411423": "������",
	    "411424": "�ϳ���",
	    "411425": "�ݳ���",
	    "411426": "������",
	    "411481": "������",
	    "411482": "������",
	    "411500": "������",
	    "411502": "������",
	    "411503": "ƽ����",
	    "411521": "��ɽ��",
	    "411522": "��ɽ��",
	    "411523": "����",
	    "411524": "�̳���",
	    "411525": "��ʼ��",
	    "411526": "�괨��",
	    "411527": "������",
	    "411528": "Ϣ��",
	    "411529": "������",
	    "411600": "�ܿ���",
	    "411602": "������",
	    "411621": "������",
	    "411622": "������",
	    "411623": "��ˮ��",
	    "411624": "������",
	    "411625": "������",
	    "411626": "������",
	    "411627": "̫����",
	    "411628": "¹����",
	    "411681": "�����",
	    "411682": "������",
	    "411700": "פ�����",
	    "411702": "�����",
	    "411721": "��ƽ��",
	    "411722": "�ϲ���",
	    "411723": "ƽ����",
	    "411724": "������",
	    "411725": "ȷɽ��",
	    "411726": "������",
	    "411727": "������",
	    "411728": "��ƽ��",
	    "411729": "�²���",
	    "411730": "������",
	    "420000": "����ʡ",
	    "420100": "�人��",
	    "420102": "������",
	    "420103": "������",
	    "420104": "�~����",
	    "420105": "������",
	    "420106": "�����",
	    "420107": "��ɽ��",
	    "420111": "��ɽ��",
	    "420112": "��������",
	    "420113": "������",
	    "420114": "�̵���",
	    "420115": "������",
	    "420116": "������",
	    "420117": "������",
	    "420118": "������",
	    "420200": "��ʯ��",
	    "420202": "��ʯ����",
	    "420203": "����ɽ��",
	    "420204": "��½��",
	    "420205": "��ɽ��",
	    "420222": "������",
	    "420281": "��ұ��",
	    "420282": "������",
	    "420300": "ʮ����",
	    "420302": "é����",
	    "420303": "������",
	    "420321": "����",
	    "420322": "������",
	    "420323": "��ɽ��",
	    "420324": "��Ϫ��",
	    "420325": "����",
	    "420381": "��������",
	    "420383": "������",
	    "420500": "�˲���",
	    "420502": "������",
	    "420503": "��Ҹ���",
	    "420504": "�����",
	    "420505": "�Vͤ��",
	    "420506": "������",
	    "420525": "Զ����",
	    "420526": "��ɽ��",
	    "420527": "������",
	    "420528": "����������������",
	    "420529": "���������������",
	    "420581": "�˶���",
	    "420582": "������",
	    "420583": "֦����",
	    "420584": "������",
	    "420600": "������",
	    "420602": "�����",
	    "420606": "������",
	    "420607": "������",
	    "420624": "������",
	    "420625": "�ȳ���",
	    "420626": "������",
	    "420682": "�Ϻӿ���",
	    "420683": "������",
	    "420684": "�˳���",
	    "420685": "������",
	    "420700": "������",
	    "420702": "���Ӻ���",
	    "420703": "������",
	    "420704": "������",
	    "420705": "������",
	    "420800": "������",
	    "420802": "������",
	    "420804": "�޵���",
	    "420821": "��ɽ��",
	    "420822": "ɳ����",
	    "420881": "������",
	    "420882": "������",
	    "420900": "Т����",
	    "420902": "Т����",
	    "420921": "Т����",
	    "420922": "������",
	    "420923": "������",
	    "420981": "Ӧ����",
	    "420982": "��½��",
	    "420984": "������",
	    "420985": "������",
	    "421000": "������",
	    "421002": "ɳ����",
	    "421003": "������",
	    "421022": "������",
	    "421023": "������",
	    "421024": "������",
	    "421081": "ʯ����",
	    "421083": "�����",
	    "421087": "������",
	    "421088": "������",
	    "421100": "�Ƹ���",
	    "421102": "������",
	    "421121": "�ŷ���",
	    "421122": "�찲��",
	    "421123": "������",
	    "421124": "Ӣɽ��",
	    "421125": "�ˮ��",
	    "421126": "ޭ����",
	    "421127": "��÷��",
	    "421181": "�����",
	    "421182": "��Ѩ��",
	    "421183": "������",
	    "421200": "������",
	    "421202": "�̰���",
	    "421221": "������",
	    "421222": "ͨ����",
	    "421223": "������",
	    "421224": "ͨɽ��",
	    "421281": "�����",
	    "421283": "������",
	    "421300": "������",
	    "421302": "������",
	    "421321": "����",
	    "421381": "��ˮ��",
	    "421382": "������",
	    "422800": "��ʩ����������������",
	    "422801": "��ʩ��",
	    "422802": "������",
	    "422822": "��ʼ��",
	    "422823": "�Ͷ���",
	    "422825": "������",
	    "422826": "�̷���",
	    "422827": "������",
	    "422828": "�׷���",
	    "422829": "������",
	    "429004": "������",
	    "429005": "Ǳ����",
	    "429006": "������",
	    "429021": "��ũ������",
	    "430000": "����ʡ",
	    "430100": "��ɳ��",
	    "430102": "ܽ����",
	    "430103": "������",
	    "430104": "��´��",
	    "430105": "������",
	    "430111": "�껨��",
	    "430121": "��ɳ��",
	    "430122": "������",
	    "430124": "������",
	    "430181": "�����",
	    "430182": "������",
	    "430200": "������",
	    "430202": "������",
	    "430203": "«����",
	    "430204": "ʯ����",
	    "430211": "��Ԫ��",
	    "430221": "������",
	    "430223": "����",
	    "430224": "������",
	    "430225": "������",
	    "430281": "������",
	    "430282": "������",
	    "430300": "��̶��",
	    "430302": "�����",
	    "430304": "������",
	    "430321": "��̶��",
	    "430381": "������",
	    "430382": "��ɽ��",
	    "430383": "������",
	    "430400": "������",
	    "430405": "������",
	    "430406": "�����",
	    "430407": "ʯ����",
	    "430408": "������",
	    "430412": "������",
	    "430421": "������",
	    "430422": "������",
	    "430423": "��ɽ��",
	    "430424": "�ⶫ��",
	    "430426": "���",
	    "430481": "������",
	    "430482": "������",
	    "430483": "������",
	    "430500": "������",
	    "430502": "˫����",
	    "430503": "������",
	    "430511": "������",
	    "430521": "�۶���",
	    "430522": "������",
	    "430523": "������",
	    "430524": "¡����",
	    "430525": "������",
	    "430527": "������",
	    "430528": "������",
	    "430529": "�ǲ�����������",
	    "430581": "�����",
	    "430582": "������",
	    "430600": "������",
	    "430602": "����¥��",
	    "430603": "��Ϫ��",
	    "430611": "��ɽ��",
	    "430621": "������",
	    "430623": "������",
	    "430624": "������",
	    "430626": "ƽ����",
	    "430681": "������",
	    "430682": "������",
	    "430683": "������",
	    "430700": "������",
	    "430702": "������",
	    "430703": "������",
	    "430721": "������",
	    "430722": "������",
	    "430723": "���",
	    "430724": "�����",
	    "430725": "��Դ��",
	    "430726": "ʯ����",
	    "430781": "������",
	    "430782": "������",
	    "430800": "�żҽ���",
	    "430802": "������",
	    "430811": "����Դ��",
	    "430821": "������",
	    "430822": "ɣֲ��",
	    "430823": "������",
	    "430900": "������",
	    "430902": "������",
	    "430903": "��ɽ��",
	    "430921": "����",
	    "430922": "�ҽ���",
	    "430923": "������",
	    "430981": "�佭��",
	    "430982": "������",
	    "431000": "������",
	    "431002": "������",
	    "431003": "������",
	    "431021": "������",
	    "431022": "������",
	    "431023": "������",
	    "431024": "�κ���",
	    "431025": "������",
	    "431026": "�����",
	    "431027": "����",
	    "431028": "������",
	    "431081": "������",
	    "431082": "������",
	    "431100": "������",
	    "431102": "������",
	    "431103": "��ˮ̲��",
	    "431121": "������",
	    "431122": "������",
	    "431123": "˫����",
	    "431124": "����",
	    "431125": "������",
	    "431126": "��Զ��",
	    "431127": "��ɽ��",
	    "431128": "������",
	    "431129": "��������������",
	    "431130": "������",
	    "431200": "������",
	    "431202": "�׳���",
	    "431221": "�з���",
	    "431222": "������",
	    "431223": "��Ϫ��",
	    "431224": "������",
	    "431225": "��ͬ��",
	    "431226": "��������������",
	    "431227": "�»ζ���������",
	    "431228": "�ƽ�����������",
	    "431229": "�������嶱��������",
	    "431230": "ͨ������������",
	    "431281": "�齭��",
	    "431282": "������",
	    "431300": "¦����",
	    "431302": "¦����",
	    "431321": "˫����",
	    "431322": "�»���",
	    "431381": "��ˮ����",
	    "431382": "��Դ��",
	    "431383": "������",
	    "433100": "��������������������",
	    "433101": "������",
	    "433122": "��Ϫ��",
	    "433123": "�����",
	    "433124": "��ԫ��",
	    "433125": "������",
	    "433126": "������",
	    "433127": "��˳��",
	    "433130": "��ɽ��",
	    "433131": "������",
	    "440000": "�㶫ʡ",
	    "440100": "������",
	    "440103": "������",
	    "440104": "Խ����",
	    "440105": "������",
	    "440106": "�����",
	    "440111": "������",
	    "440112": "������",
	    "440113": "��خ��",
	    "440114": "������",
	    "440115": "��ɳ��",
	    "440116": "�ܸ���",
	    "440183": "������",
	    "440184": "�ӻ���",
	    "440189": "������",
	    "440200": "�ع���",
	    "440203": "�佭��",
	    "440204": "䥽���",
	    "440205": "������",
	    "440222": "ʼ����",
	    "440224": "�ʻ���",
	    "440229": "��Դ��",
	    "440232": "��Դ����������",
	    "440233": "�·���",
	    "440281": "�ֲ���",
	    "440282": "������",
	    "440283": "������",
	    "440300": "������",
	    "440303": "�޺���",
	    "440304": "������",
	    "440305": "��ɽ��",
	    "440306": "������",
	    "440307": "������",
	    "440308": "������",
	    "440309": "������",
	    "440320": "��������",
	    "440321": "ƺɽ����",
	    "440322": "��������",
	    "440323": "��������",
	    "440400": "�麣��",
	    "440402": "������",
	    "440403": "������",
	    "440404": "������",
	    "440488": "������",
	    "440500": "��ͷ��",
	    "440507": "������",
	    "440511": "��ƽ��",
	    "440512": "婽���",
	    "440513": "������",
	    "440514": "������",
	    "440515": "�κ���",
	    "440523": "�ϰ���",
	    "440524": "������",
	    "440600": "��ɽ��",
	    "440604": "������",
	    "440605": "�Ϻ���",
	    "440606": "˳����",
	    "440607": "��ˮ��",
	    "440608": "������",
	    "440609": "������",
	    "440700": "������",
	    "440703": "���",
	    "440704": "������",
	    "440705": "�»���",
	    "440781": "̨ɽ��",
	    "440783": "��ƽ��",
	    "440784": "��ɽ��",
	    "440785": "��ƽ��",
	    "440786": "������",
	    "440800": "տ����",
	    "440802": "�࿲��",
	    "440803": "ϼɽ��",
	    "440804": "��ͷ��",
	    "440811": "������",
	    "440823": "��Ϫ��",
	    "440825": "������",
	    "440881": "������",
	    "440882": "������",
	    "440883": "�⴨��",
	    "440884": "������",
	    "440900": "ï����",
	    "440902": "ï����",
	    "440903": "ï����",
	    "440923": "�����",
	    "440981": "������",
	    "440982": "������",
	    "440983": "������",
	    "440984": "������",
	    "441200": "������",
	    "441202": "������",
	    "441203": "������",
	    "441223": "������",
	    "441224": "������",
	    "441225": "�⿪��",
	    "441226": "������",
	    "441283": "��Ҫ��",
	    "441284": "�Ļ���",
	    "441285": "������",
	    "441300": "������",
	    "441302": "�ݳ���",
	    "441303": "������",
	    "441322": "������",
	    "441323": "�ݶ���",
	    "441324": "������",
	    "441325": "������",
	    "441400": "÷����",
	    "441402": "÷����",
	    "441421": "÷��",
	    "441422": "������",
	    "441423": "��˳��",
	    "441424": "�廪��",
	    "441426": "ƽԶ��",
	    "441427": "������",
	    "441481": "������",
	    "441482": "������",
	    "441500": "��β��",
	    "441502": "����",
	    "441521": "������",
	    "441523": "½����",
	    "441581": "½����",
	    "441582": "������",
	    "441600": "��Դ��",
	    "441602": "Դ����",
	    "441621": "�Ͻ���",
	    "441622": "������",
	    "441623": "��ƽ��",
	    "441624": "��ƽ��",
	    "441625": "��Դ��",
	    "441626": "������",
	    "441700": "����",
	    "441702": "������",
	    "441721": "������",
	    "441723": "����",
	    "441781": "����",
	    "441782": "������",
	    "441800": "��Զ��",
	    "441802": "�����",
	    "441821": "�����",
	    "441823": "��ɽ��",
	    "441825": "��ɽ׳������������",
	    "441826": "��������������",
	    "441827": "������",
	    "441881": "Ӣ����",
	    "441882": "������",
	    "441883": "������",
	    "441900": "��ݸ��",
	    "442000": "��ɽ��",
	    "442101": "��ɳȺ��",
	    "445100": "������",
	    "445102": "������",
	    "445121": "������",
	    "445122": "��ƽ��",
	    "445186": "������",
	    "445200": "������",
	    "445202": "�ų���",
	    "445221": "�Ҷ���",
	    "445222": "������",
	    "445224": "������",
	    "445281": "������",
	    "445285": "������",
	    "445300": "�Ƹ���",
	    "445302": "�Ƴ���",
	    "445321": "������",
	    "445322": "������",
	    "445323": "�ư���",
	    "445381": "�޶���",
	    "445382": "������",
	    "450000": "����׳��������",
	    "450100": "������",
	    "450102": "������",
	    "450103": "������",
	    "450105": "������",
	    "450107": "��������",
	    "450108": "������",
	    "450109": "������",
	    "450122": "������",
	    "450123": "¡����",
	    "450124": "��ɽ��",
	    "450125": "������",
	    "450126": "������",
	    "450127": "����",
	    "450128": "������",
	    "450200": "������",
	    "450202": "������",
	    "450203": "�����",
	    "450204": "������",
	    "450205": "������",
	    "450221": "������",
	    "450222": "������",
	    "450223": "¹կ��",
	    "450224": "�ڰ���",
	    "450225": "��ˮ����������",
	    "450226": "��������������",
	    "450227": "������",
	    "450300": "������",
	    "450302": "�����",
	    "450303": "������",
	    "450304": "��ɽ��",
	    "450305": "������",
	    "450311": "��ɽ��",
	    "450321": "��˷��",
	    "450322": "�ٹ���",
	    "450323": "�鴨��",
	    "450324": "ȫ����",
	    "450325": "�˰���",
	    "450326": "������",
	    "450327": "������",
	    "450328": "��ʤ����������",
	    "450329": "��Դ��",
	    "450330": "ƽ����",
	    "450331": "������",
	    "450332": "��������������",
	    "450333": "������",
	    "450400": "������",
	    "450403": "������",
	    "450405": "������",
	    "450406": "������",
	    "450421": "������",
	    "450422": "����",
	    "450423": "��ɽ��",
	    "450481": "�Ϫ��",
	    "450482": "������",
	    "450500": "������",
	    "450502": "������",
	    "450503": "������",
	    "450512": "��ɽ����",
	    "450521": "������",
	    "450522": "������",
	    "450600": "���Ǹ���",
	    "450602": "�ۿ���",
	    "450603": "������",
	    "450621": "��˼��",
	    "450681": "������",
	    "450682": "������",
	    "450700": "������",
	    "450702": "������",
	    "450703": "�ձ���",
	    "450721": "��ɽ��",
	    "450722": "�ֱ���",
	    "450723": "������",
	    "450800": "�����",
	    "450802": "�۱���",
	    "450803": "������",
	    "450804": "������",
	    "450821": "ƽ����",
	    "450881": "��ƽ��",
	    "450882": "������",
	    "450900": "������",
	    "450902": "������",
	    "450903": "������",
	    "450921": "����",
	    "450922": "½����",
	    "450923": "������",
	    "450924": "��ҵ��",
	    "450981": "������",
	    "450982": "������",
	    "451000": "��ɫ��",
	    "451002": "�ҽ���",
	    "451021": "������",
	    "451022": "�ﶫ��",
	    "451023": "ƽ����",
	    "451024": "�±���",
	    "451025": "������",
	    "451026": "������",
	    "451027": "������",
	    "451028": "��ҵ��",
	    "451029": "������",
	    "451030": "������",
	    "451031": "¡�ָ���������",
	    "451032": "������",
	    "451100": "������",
	    "451102": "�˲���",
	    "451119": "ƽ�������",
	    "451121": "��ƽ��",
	    "451122": "��ɽ��",
	    "451123": "��������������",
	    "451124": "������",
	    "451200": "�ӳ���",
	    "451202": "��ǽ���",
	    "451221": "�ϵ���",
	    "451222": "�����",
	    "451223": "��ɽ��",
	    "451224": "������",
	    "451225": "�޳�������������",
	    "451226": "����ë����������",
	    "451227": "��������������",
	    "451228": "��������������",
	    "451229": "������������",
	    "451281": "������",
	    "451282": "������",
	    "451300": "������",
	    "451302": "�˱���",
	    "451321": "�ó���",
	    "451322": "������",
	    "451323": "������",
	    "451324": "��������������",
	    "451381": "��ɽ��",
	    "451382": "������",
	    "451400": "������",
	    "451402": "������",
	    "451421": "������",
	    "451422": "������",
	    "451423": "������",
	    "451424": "������",
	    "451425": "�����",
	    "451481": "ƾ����",
	    "451482": "������",
	    "460000": "����ʡ",
	    "460100": "������",
	    "460105": "��Ӣ��",
	    "460106": "������",
	    "460107": "��ɽ��",
	    "460108": "������",
	    "460109": "������",
	    "460200": "������",
	    "460300": "��ɳ��",
	    "460321": "��ɳȺ��",
	    "460322": "��ɳȺ��",
	    "460323": "��ɳȺ���ĵ������亣��",
	    "469001": "��ָɽ��",
	    "469002": "����",
	    "469003": "������",
	    "469005": "�Ĳ���",
	    "469006": "������",
	    "469007": "������",
	    "469025": "������",
	    "469026": "�Ͳ���",
	    "469027": "������",
	    "469028": "�ٸ���",
	    "469030": "��ɳ����������",
	    "469031": "��������������",
	    "469033": "�ֶ�����������",
	    "469034": "��ˮ����������",
	    "469035": "��ͤ��������������",
	    "469036": "������������������",
	    "471005": "������",
	    "500000": "����",
	    "500100": "������",
	    "500101": "������",
	    "500102": "������",
	    "500103": "������",
	    "500104": "��ɿ���",
	    "500105": "������",
	    "500106": "ɳƺ����",
	    "500107": "��������",
	    "500108": "�ϰ���",
	    "500109": "������",
	    "500110": "��ʢ��",
	    "500111": "˫����",
	    "500112": "�山��",
	    "500113": "������",
	    "500114": "ǭ����",
	    "500115": "������",
	    "500222": "�뽭��",
	    "500223": "������",
	    "500224": "ͭ����",
	    "500225": "������",
	    "500226": "�ٲ���",
	    "500227": "�ɽ��",
	    "500228": "��ƽ��",
	    "500229": "�ǿ���",
	    "500230": "�ᶼ��",
	    "500231": "�潭��",
	    "500232": "��¡��",
	    "500233": "����",
	    "500234": "����",
	    "500235": "������",
	    "500236": "�����",
	    "500237": "��ɽ��",
	    "500238": "��Ϫ��",
	    "500240": "ʯ��������������",
	    "500241": "��ɽ����������������",
	    "500242": "��������������������",
	    "500243": "��ˮ����������������",
	    "500381": "������",
	    "500382": "�ϴ���",
	    "500383": "������",
	    "500384": "�ϴ���",
	    "500385": "������",
	    "510000": "�Ĵ�ʡ",
	    "510100": "�ɶ���",
	    "510104": "������",
	    "510105": "������",
	    "510106": "��ţ��",
	    "510107": "�����",
	    "510108": "�ɻ���",
	    "510112": "��Ȫ����",
	    "510113": "��׽���",
	    "510114": "�¶���",
	    "510115": "�½���",
	    "510121": "������",
	    "510122": "˫����",
	    "510124": "ۯ��",
	    "510129": "������",
	    "510131": "�ѽ���",
	    "510132": "�½���",
	    "510181": "��������",
	    "510182": "������",
	    "510183": "������",
	    "510184": "������",
	    "510185": "������",
	    "510300": "�Թ���",
	    "510302": "��������",
	    "510303": "������",
	    "510304": "����",
	    "510311": "��̲��",
	    "510321": "����",
	    "510322": "��˳��",
	    "510323": "������",
	    "510400": "��֦����",
	    "510402": "����",
	    "510403": "����",
	    "510411": "�ʺ���",
	    "510421": "������",
	    "510422": "�α���",
	    "510423": "������",
	    "510500": "������",
	    "510502": "������",
	    "510503": "��Ϫ��",
	    "510504": "����̶��",
	    "510521": "����",
	    "510522": "�Ͻ���",
	    "510524": "������",
	    "510525": "������",
	    "510526": "������",
	    "510600": "������",
	    "510603": "�����",
	    "510623": "�н���",
	    "510626": "�޽���",
	    "510681": "�㺺��",
	    "510682": "ʲ����",
	    "510683": "������",
	    "510684": "������",
	    "510700": "������",
	    "510703": "������",
	    "510704": "������",
	    "510722": "��̨��",
	    "510723": "��ͤ��",
	    "510724": "����",
	    "510725": "������",
	    "510726": "����Ǽ��������",
	    "510727": "ƽ����",
	    "510781": "������",
	    "510782": "������",
	    "510800": "��Ԫ��",
	    "510802": "������",
	    "510811": "�ѻ���",
	    "510812": "������",
	    "510821": "������",
	    "510822": "�ന��",
	    "510823": "������",
	    "510824": "��Ϫ��",
	    "510825": "������",
	    "510900": "������",
	    "510903": "��ɽ��",
	    "510904": "������",
	    "510921": "��Ϫ��",
	    "510922": "�����",
	    "510923": "��Ӣ��",
	    "510924": "������",
	    "511000": "�ڽ���",
	    "511002": "������",
	    "511011": "������",
	    "511024": "��Զ��",
	    "511025": "������",
	    "511028": "¡����",
	    "511029": "������",
	    "511100": "��ɽ��",
	    "511102": "������",
	    "511111": "ɳ����",
	    "511112": "��ͨ����",
	    "511113": "��ں���",
	    "511123": "��Ϊ��",
	    "511124": "������",
	    "511126": "�н���",
	    "511129": "�崨��",
	    "511132": "�������������",
	    "511133": "�������������",
	    "511181": "��üɽ��",
	    "511182": "������",
	    "511300": "�ϳ���",
	    "511302": "˳����",
	    "511303": "��ƺ��",
	    "511304": "������",
	    "511321": "�ϲ���",
	    "511322": "Ӫɽ��",
	    "511323": "���",
	    "511324": "��¤��",
	    "511325": "������",
	    "511381": "������",
	    "511382": "������",
	    "511400": "üɽ��",
	    "511402": "������",
	    "511421": "������",
	    "511422": "��ɽ��",
	    "511423": "������",
	    "511424": "������",
	    "511425": "������",
	    "511426": "������",
	    "511500": "�˱���",
	    "511502": "������",
	    "511521": "�˱���",
	    "511522": "��Ϫ��",
	    "511523": "������",
	    "511524": "������",
	    "511525": "����",
	    "511526": "����",
	    "511527": "������",
	    "511528": "������",
	    "511529": "��ɽ��",
	    "511530": "������",
	    "511600": "�㰲��",
	    "511602": "�㰲��",
	    "511603": "ǰ����",
	    "511621": "������",
	    "511622": "��ʤ��",
	    "511623": "��ˮ��",
	    "511681": "������",
	    "511683": "������",
	    "511700": "������",
	    "511702": "ͨ����",
	    "511721": "�ﴨ��",
	    "511722": "������",
	    "511723": "������",
	    "511724": "������",
	    "511725": "����",
	    "511781": "��Դ��",
	    "511782": "������",
	    "511800": "�Ű���",
	    "511802": "�����",
	    "511821": "��ɽ��",
	    "511822": "������",
	    "511823": "��Դ��",
	    "511824": "ʯ����",
	    "511825": "��ȫ��",
	    "511826": "«ɽ��",
	    "511827": "������",
	    "511828": "������",
	    "511900": "������",
	    "511902": "������",
	    "511903": "������",
	    "511921": "ͨ����",
	    "511922": "�Ͻ���",
	    "511923": "ƽ����",
	    "511924": "������",
	    "512000": "������",
	    "512002": "�㽭��",
	    "512021": "������",
	    "512022": "������",
	    "512081": "������",
	    "512082": "������",
	    "513200": "���Ӳ���Ǽ��������",
	    "513221": "�봨��",
	    "513222": "����",
	    "513223": "ï��",
	    "513224": "������",
	    "513225": "��կ����",
	    "513226": "����",
	    "513227": "С����",
	    "513228": "��ˮ��",
	    "513229": "�������",
	    "513230": "������",
	    "513231": "������",
	    "513232": "�������",
	    "513233": "��ԭ��",
	    "513234": "������",
	    "513300": "���β���������",
	    "513321": "������",
	    "513322": "����",
	    "513323": "������",
	    "513324": "������",
	    "513325": "�Ž���",
	    "513326": "������",
	    "513327": "¯����",
	    "513328": "������",
	    "513329": "������",
	    "513330": "�¸���",
	    "513331": "������",
	    "513332": "ʯ����",
	    "513333": "ɫ����",
	    "513334": "������",
	    "513335": "������",
	    "513336": "�����",
	    "513337": "������",
	    "513338": "������",
	    "513339": "������",
	    "513400": "��ɽ����������",
	    "513401": "������",
	    "513422": "ľ�����������",
	    "513423": "��Դ��",
	    "513424": "�²���",
	    "513425": "������",
	    "513426": "�ᶫ��",
	    "513427": "������",
	    "513428": "�ո���",
	    "513429": "������",
	    "513430": "������",
	    "513431": "�Ѿ���",
	    "513432": "ϲ����",
	    "513433": "������",
	    "513434": "Խ����",
	    "513435": "������",
	    "513436": "������",
	    "513437": "�ײ���",
	    "513438": "������",
	    "520000": "����ʡ",
	    "520100": "������",
	    "520102": "������",
	    "520103": "������",
	    "520111": "��Ϫ��",
	    "520112": "�ڵ���",
	    "520113": "������",
	    "520121": "������",
	    "520122": "Ϣ����",
	    "520123": "������",
	    "520151": "��ɽ����",
	    "520181": "������",
	    "520182": "������",
	    "520200": "����ˮ��",
	    "520201": "��ɽ��",
	    "520203": "��֦����",
	    "520221": "ˮ����",
	    "520222": "����",
	    "520223": "������",
	    "520300": "������",
	    "520302": "�컨����",
	    "520303": "�㴨��",
	    "520321": "������",
	    "520322": "ͩ����",
	    "520323": "������",
	    "520324": "������",
	    "520325": "��������������������",
	    "520326": "������������������",
	    "520327": "�����",
	    "520328": "��̶��",
	    "520329": "������",
	    "520330": "ϰˮ��",
	    "520381": "��ˮ��",
	    "520382": "�ʻ���",
	    "520383": "������",
	    "520400": "��˳��",
	    "520402": "������",
	    "520421": "ƽ����",
	    "520422": "�ն���",
	    "520423": "��������������������",
	    "520424": "���벼��������������",
	    "520425": "�������岼����������",
	    "520426": "������",
	    "522200": "ͭ����",
	    "522201": "�̽���",
	    "522222": "������",
	    "522223": "��������������",
	    "522224": "ʯ����",
	    "522225": "˼����",
	    "522226": "ӡ������������������",
	    "522227": "�½���",
	    "522228": "�غ�������������",
	    "522229": "��������������",
	    "522230": "��ɽ��",
	    "522231": "������",
	    "522300": "ǭ���ϲ���������������",
	    "522301": "������",
	    "522322": "������",
	    "522323": "�հ���",
	    "522324": "��¡��",
	    "522325": "�����",
	    "522326": "������",
	    "522327": "�����",
	    "522328": "������",
	    "522329": "������",
	    "522400": "�Ͻ���",
	    "522401": "���ǹ���",
	    "522422": "����",
	    "522423": "ǭ����",
	    "522424": "��ɳ��",
	    "522425": "֯����",
	    "522426": "��Ӻ��",
	    "522427": "���������������������",
	    "522428": "������",
	    "522429": "������",
	    "522600": "ǭ�������嶱��������",
	    "522601": "������",
	    "522622": "��ƽ��",
	    "522623": "ʩ����",
	    "522624": "������",
	    "522625": "��Զ��",
	    "522626": "᯹���",
	    "522627": "������",
	    "522628": "������",
	    "522629": "������",
	    "522630": "̨����",
	    "522631": "��ƽ��",
	    "522632": "�Ž���",
	    "522633": "�ӽ���",
	    "522634": "��ɽ��",
	    "522635": "�齭��",
	    "522636": "��կ��",
	    "522637": "������",
	    "522700": "ǭ�ϲ���������������",
	    "522701": "������",
	    "522702": "��Ȫ��",
	    "522722": "����",
	    "522723": "����",
	    "522725": "�Ͱ���",
	    "522726": "��ɽ��",
	    "522727": "ƽ����",
	    "522728": "�޵���",
	    "522729": "��˳��",
	    "522730": "������",
	    "522731": "��ˮ��",
	    "522732": "����ˮ��������",
	    "522733": "������",
	    "530000": "����ʡ",
	    "530100": "������",
	    "530102": "�廪��",
	    "530103": "������",
	    "530111": "�ٶ���",
	    "530112": "��ɽ��",
	    "530113": "������",
	    "530121": "�ʹ���",
	    "530122": "������",
	    "530124": "������",
	    "530125": "������",
	    "530126": "ʯ������������",
	    "530127": "������",
	    "530128": "»Ȱ��������������",
	    "530129": "Ѱ���������������",
	    "530181": "������",
	    "530182": "������",
	    "530300": "������",
	    "530302": "������",
	    "530321": "������",
	    "530322": "½����",
	    "530323": "ʦ����",
	    "530324": "��ƽ��",
	    "530325": "��Դ��",
	    "530326": "������",
	    "530328": "մ����",
	    "530381": "������",
	    "530382": "������",
	    "530400": "��Ϫ��",
	    "530402": "������",
	    "530421": "������",
	    "530422": "�ν���",
	    "530423": "ͨ����",
	    "530424": "������",
	    "530425": "������",
	    "530426": "��ɽ����������",
	    "530427": "��ƽ�������������",
	    "530428": "Ԫ���������������������",
	    "530429": "������",
	    "530500": "��ɽ��",
	    "530502": "¡����",
	    "530521": "ʩ����",
	    "530522": "�ڳ���",
	    "530523": "������",
	    "530524": "������",
	    "530525": "������",
	    "530600": "��ͨ��",
	    "530602": "������",
	    "530621": "³����",
	    "530622": "�ɼ���",
	    "530623": "�ν���",
	    "530624": "�����",
	    "530625": "������",
	    "530626": "�罭��",
	    "530627": "������",
	    "530628": "������",
	    "530629": "������",
	    "530630": "ˮ����",
	    "530631": "������",
	    "530700": "������",
	    "530702": "�ų���",
	    "530721": "����������������",
	    "530722": "��ʤ��",
	    "530723": "��ƺ��",
	    "530724": "��������������",
	    "530725": "������",
	    "530800": "�ն���",
	    "530802": "˼é��",
	    "530821": "��������������������",
	    "530822": "ī��������������",
	    "530823": "��������������",
	    "530824": "���ȴ�������������",
	    "530825": "�������������������������",
	    "530826": "���ǹ���������������",
	    "530827": "������������������������",
	    "530828": "����������������",
	    "530829": "��������������",
	    "530830": "������",
	    "530900": "�ٲ���",
	    "530902": "������",
	    "530921": "������",
	    "530922": "����",
	    "530923": "������",
	    "530924": "����",
	    "530925": "˫�����������岼�������������",
	    "530926": "�����������������",
	    "530927": "��Դ����������",
	    "530928": "������",
	    "532300": "��������������",
	    "532301": "������",
	    "532322": "˫����",
	    "532323": "Ĳ����",
	    "532324": "�ϻ���",
	    "532325": "Ҧ����",
	    "532326": "��Ҧ��",
	    "532327": "������",
	    "532328": "Ԫı��",
	    "532329": "�䶨��",
	    "532331": "»����",
	    "532332": "������",
	    "532500": "��ӹ���������������",
	    "532501": "������",
	    "532502": "��Զ��",
	    "532522": "������",
	    "532523": "��������������",
	    "532524": "��ˮ��",
	    "532525": "ʯ����",
	    "532526": "������",
	    "532527": "������",
	    "532528": "Ԫ����",
	    "532529": "�����",
	    "532530": "��ƽ�����������������",
	    "532531": "�̴���",
	    "532532": "�ӿ�����������",
	    "532533": "������",
	    "532600": "��ɽ׳������������",
	    "532621": "��ɽ��",
	    "532622": "��ɽ��",
	    "532623": "������",
	    "532624": "��������",
	    "532625": "�����",
	    "532626": "����",
	    "532627": "������",
	    "532628": "������",
	    "532629": "������",
	    "532800": "��˫���ɴ���������",
	    "532801": "������",
	    "532822": "�º���",
	    "532823": "������",
	    "532824": "������",
	    "532900": "�������������",
	    "532901": "������",
	    "532922": "�������������",
	    "532923": "������",
	    "532924": "������",
	    "532925": "�ֶ���",
	    "532926": "�Ͻ�����������",
	    "532927": "Ρɽ�������������",
	    "532928": "��ƽ��",
	    "532929": "������",
	    "532930": "��Դ��",
	    "532931": "������",
	    "532932": "������",
	    "532933": "������",
	    "533100": "�º���徰����������",
	    "533102": "������",
	    "533103": "â��",
	    "533122": "������",
	    "533123": "ӯ����",
	    "533124": "¤����",
	    "533125": "������",
	    "533300": "ŭ��������������",
	    "533321": "��ˮ��",
	    "533323": "������",
	    "533324": "��ɽ������ŭ��������",
	    "533325": "��ƺ����������������",
	    "533326": "������",
	    "533400": "�������������",
	    "533421": "���������",
	    "533422": "������",
	    "533423": "ά��������������",
	    "533424": "������",
	    "540000": "����������",
	    "540100": "������",
	    "540102": "�ǹ���",
	    "540121": "������",
	    "540122": "������",
	    "540123": "��ľ��",
	    "540124": "��ˮ��",
	    "540125": "����������",
	    "540126": "������",
	    "540127": "ī�񹤿���",
	    "540128": "������",
	    "542100": "��������",
	    "542121": "������",
	    "542122": "������",
	    "542123": "������",
	    "542124": "��������",
	    "542125": "������",
	    "542126": "������",
	    "542127": "������",
	    "542128": "����",
	    "542129": "â����",
	    "542132": "��¡��",
	    "542133": "�߰���",
	    "542134": "������",
	    "542200": "ɽ�ϵ���",
	    "542221": "�˶���",
	    "542222": "������",
	    "542223": "������",
	    "542224": "ɣ����",
	    "542225": "�����",
	    "542226": "������",
	    "542227": "������",
	    "542228": "������",
	    "542229": "�Ӳ���",
	    "542231": "¡����",
	    "542232": "������",
	    "542233": "�˿�����",
	    "542234": "������",
	    "542300": "�տ������",
	    "542301": "�տ�����",
	    "542322": "��ľ����",
	    "542323": "������",
	    "542324": "������",
	    "542325": "������",
	    "542326": "������",
	    "542327": "������",
	    "542328": "лͨ����",
	    "542329": "������",
	    "542330": "�ʲ���",
	    "542331": "������",
	    "542332": "������",
	    "542333": "�ٰ���",
	    "542334": "�Ƕ���",
	    "542335": "��¡��",
	    "542336": "����ľ��",
	    "542337": "������",
	    "542338": "�ڰ���",
	    "542339": "������",
	    "542400": "��������",
	    "542421": "������",
	    "542422": "������",
	    "542423": "������",
	    "542424": "������",
	    "542425": "������",
	    "542426": "������",
	    "542427": "����",
	    "542428": "�����",
	    "542429": "������",
	    "542430": "������",
	    "542431": "������",
	    "542432": "˫����",
	    "542500": "�������",
	    "542521": "������",
	    "542522": "������",
	    "542523": "������",
	    "542524": "������",
	    "542525": "�Ｊ��",
	    "542526": "������",
	    "542527": "������",
	    "542528": "������",
	    "542600": "��֥����",
	    "542621": "��֥��",
	    "542622": "����������",
	    "542623": "������",
	    "542624": "ī����",
	    "542625": "������",
	    "542626": "������",
	    "542627": "����",
	    "542628": "������",
	    "610000": "����ʡ",
	    "610100": "������",
	    "610102": "�³���",
	    "610103": "������",
	    "610104": "������",
	    "610111": "�����",
	    "610112": "δ����",
	    "610113": "������",
	    "610114": "������",
	    "610115": "������",
	    "610116": "������",
	    "610122": "������",
	    "610124": "������",
	    "610125": "����",
	    "610126": "������",
	    "610127": "������",
	    "610200": "ͭ����",
	    "610202": "������",
	    "610203": "ӡ̨��",
	    "610204": "ҫ����",
	    "610222": "�˾���",
	    "610223": "������",
	    "610300": "������",
	    "610302": "μ����",
	    "610303": "��̨��",
	    "610304": "�²���",
	    "610322": "������",
	    "610323": "�ɽ��",
	    "610324": "������",
	    "610326": "ü��",
	    "610327": "¤��",
	    "610328": "ǧ����",
	    "610329": "������",
	    "610330": "����",
	    "610331": "̫����",
	    "610332": "������",
	    "610400": "������",
	    "610402": "�ض���",
	    "610403": "������",
	    "610404": "μ����",
	    "610422": "��ԭ��",
	    "610423": "������",
	    "610424": "Ǭ��",
	    "610425": "��Ȫ��",
	    "610426": "������",
	    "610427": "����",
	    "610428": "������",
	    "610429": "Ѯ����",
	    "610430": "������",
	    "610431": "�书��",
	    "610481": "��ƽ��",
	    "610482": "������",
	    "610500": "μ����",
	    "610502": "��μ��",
	    "610521": "����",
	    "610522": "������",
	    "610523": "������",
	    "610524": "������",
	    "610525": "�γ���",
	    "610526": "�ѳ���",
	    "610527": "��ˮ��",
	    "610528": "��ƽ��",
	    "610581": "������",
	    "610582": "������",
	    "610583": "������",
	    "610600": "�Ӱ���",
	    "610602": "������",
	    "610621": "�ӳ���",
	    "610622": "�Ӵ���",
	    "610623": "�ӳ���",
	    "610624": "������",
	    "610625": "־����",
	    "610626": "������",
	    "610627": "��Ȫ��",
	    "610628": "����",
	    "610629": "�崨��",
	    "610630": "�˴���",
	    "610631": "������",
	    "610632": "������",
	    "610633": "������",
	    "610700": "������",
	    "610702": "��̨��",
	    "610721": "��֣��",
	    "610722": "�ǹ���",
	    "610723": "����",
	    "610724": "������",
	    "610725": "����",
	    "610726": "��ǿ��",
	    "610727": "������",
	    "610728": "�����",
	    "610729": "�����",
	    "610730": "��ƺ��",
	    "610731": "������",
	    "610800": "������",
	    "610802": "������",
	    "610821": "��ľ��",
	    "610822": "������",
	    "610823": "��ɽ��",
	    "610824": "������",
	    "610825": "������",
	    "610826": "�����",
	    "610827": "��֬��",
	    "610828": "����",
	    "610829": "�Ɽ��",
	    "610830": "�彧��",
	    "610831": "������",
	    "610832": "������",
	    "610900": "������",
	    "610902": "������",
	    "610921": "������",
	    "610922": "ʯȪ��",
	    "610923": "������",
	    "610924": "������",
	    "610925": "᰸���",
	    "610926": "ƽ����",
	    "610927": "��ƺ��",
	    "610928": "Ѯ����",
	    "610929": "�׺���",
	    "610930": "������",
	    "611000": "������",
	    "611002": "������",
	    "611021": "������",
	    "611022": "������",
	    "611023": "������",
	    "611024": "ɽ����",
	    "611025": "����",
	    "611026": "��ˮ��",
	    "611027": "������",
	    "620000": "����ʡ",
	    "620100": "������",
	    "620102": "�ǹ���",
	    "620103": "�������",
	    "620104": "������",
	    "620105": "������",
	    "620111": "�����",
	    "620121": "������",
	    "620122": "������",
	    "620123": "������",
	    "620124": "������",
	    "620200": "��������",
	    "620300": "�����",
	    "620302": "����",
	    "620321": "������",
	    "620322": "������",
	    "620400": "������",
	    "620402": "������",
	    "620403": "ƽ����",
	    "620421": "��Զ��",
	    "620422": "������",
	    "620423": "��̩��",
	    "620424": "������",
	    "620500": "��ˮ��",
	    "620502": "������",
	    "620503": "�����",
	    "620521": "��ˮ��",
	    "620522": "�ذ���",
	    "620523": "�ʹ���",
	    "620524": "��ɽ��",
	    "620525": "�żҴ�����������",
	    "620526": "������",
	    "620600": "������",
	    "620602": "������",
	    "620621": "������",
	    "620622": "������",
	    "620623": "��ף����������",
	    "620624": "������",
	    "620700": "��Ҵ��",
	    "620702": "������",
	    "620721": "����ԣ����������",
	    "620722": "������",
	    "620723": "������",
	    "620724": "��̨��",
	    "620725": "ɽ����",
	    "620726": "������",
	    "620800": "ƽ����",
	    "620802": "�����",
	    "620821": "������",
	    "620822": "��̨��",
	    "620823": "������",
	    "620824": "��ͤ��",
	    "620825": "ׯ����",
	    "620826": "������",
	    "620827": "������",
	    "620900": "��Ȫ��",
	    "620902": "������",
	    "620921": "������",
	    "620922": "������",
	    "620923": "�౱�ɹ���������",
	    "620924": "��������������������",
	    "620981": "������",
	    "620982": "�ػ���",
	    "620983": "������",
	    "621000": "������",
	    "621002": "������",
	    "621021": "�����",
	    "621022": "����",
	    "621023": "������",
	    "621024": "��ˮ��",
	    "621025": "������",
	    "621026": "����",
	    "621027": "��ԭ��",
	    "621028": "������",
	    "621100": "������",
	    "621102": "������",
	    "621121": "ͨμ��",
	    "621122": "¤����",
	    "621123": "μԴ��",
	    "621124": "�����",
	    "621125": "����",
	    "621126": "���",
	    "621127": "������",
	    "621200": "¤����",
	    "621202": "�䶼��",
	    "621221": "����",
	    "621222": "����",
	    "621223": "崲���",
	    "621224": "����",
	    "621225": "������",
	    "621226": "����",
	    "621227": "����",
	    "621228": "������",
	    "621229": "������",
	    "622900": "���Ļ���������",
	    "622901": "������",
	    "622921": "������",
	    "622922": "������",
	    "622923": "������",
	    "622924": "�����",
	    "622925": "������",
	    "622926": "������������",
	    "622927": "��ʯɽ�����嶫����������������",
	    "622928": "������",
	    "623000": "���ϲ���������",
	    "623001": "������",
	    "623021": "��̶��",
	    "623022": "׿����",
	    "623023": "������",
	    "623024": "������",
	    "623025": "������",
	    "623026": "µ����",
	    "623027": "�ĺ���",
	    "623028": "������",
	    "630000": "�ຣʡ",
	    "630100": "������",
	    "630102": "�Ƕ���",
	    "630103": "������",
	    "630104": "������",
	    "630105": "�Ǳ���",
	    "630121": "��ͨ��������������",
	    "630122": "������",
	    "630123": "��Դ��",
	    "630124": "������",
	    "632100": "������",
	    "632121": "ƽ����",
	    "632122": "��ͻ�������������",
	    "632123": "�ֶ���",
	    "632126": "��������������",
	    "632127": "��¡����������",
	    "632128": "ѭ��������������",
	    "632129": "������",
	    "632200": "��������������",
	    "632221": "��Դ����������",
	    "632222": "������",
	    "632223": "������",
	    "632224": "�ղ���",
	    "632225": "������",
	    "632300": "���ϲ���������",
	    "632321": "ͬ����",
	    "632322": "������",
	    "632323": "�����",
	    "632324": "�����ɹ���������",
	    "632325": "������",
	    "632500": "���ϲ���������",
	    "632521": "������",
	    "632522": "ͬ����",
	    "632523": "�����",
	    "632524": "�˺���",
	    "632525": "������",
	    "632526": "������",
	    "632600": "�������������",
	    "632621": "������",
	    "632622": "������",
	    "632623": "�ʵ���",
	    "632624": "������",
	    "632625": "������",
	    "632626": "�����",
	    "632627": "������",
	    "632700": "��������������",
	    "632721": "������",
	    "632722": "�Ӷ���",
	    "632723": "�ƶ���",
	    "632724": "�ζ���",
	    "632725": "��ǫ��",
	    "632726": "��������",
	    "632727": "������",
	    "632800": "�����ɹ������������",
	    "632801": "���ľ��",
	    "632802": "�������",
	    "632821": "������",
	    "632822": "������",
	    "632823": "�����",
	    "632824": "������",
	    "640000": "���Ļ���������",
	    "640100": "������",
	    "640104": "������",
	    "640105": "������",
	    "640106": "�����",
	    "640121": "������",
	    "640122": "������",
	    "640181": "������",
	    "640182": "������",
	    "640200": "ʯ��ɽ��",
	    "640202": "�������",
	    "640205": "��ũ��",
	    "640221": "ƽ����",
	    "640222": "������",
	    "640300": "������",
	    "640302": "��ͨ��",
	    "640303": "���±���",
	    "640323": "�γ���",
	    "640324": "ͬ����",
	    "640381": "��ͭϿ��",
	    "640382": "������",
	    "640400": "��ԭ��",
	    "640402": "ԭ����",
	    "640422": "������",
	    "640423": "¡����",
	    "640424": "��Դ��",
	    "640425": "������",
	    "640426": "������",
	    "640500": "������",
	    "640502": "ɳ��ͷ��",
	    "640521": "������",
	    "640522": "��ԭ��",
	    "640523": "������",
	    "650000": "�½�ά���������",
	    "650100": "��³ľ����",
	    "650102": "��ɽ��",
	    "650103": "ɳ���Ϳ���",
	    "650104": "������",
	    "650105": "ˮĥ����",
	    "650106": "ͷ�ͺ���",
	    "650107": "�������",
	    "650109": "�׶���",
	    "650121": "��³ľ����",
	    "650122": "������",
	    "650200": "����������",
	    "650202": "��ɽ����",
	    "650203": "����������",
	    "650204": "�׼�̲��",
	    "650205": "�ڶ�����",
	    "650206": "������",
	    "652100": "��³������",
	    "652101": "��³����",
	    "652122": "۷����",
	    "652123": "�п�ѷ��",
	    "652124": "������",
	    "652200": "���ܵ���",
	    "652201": "������",
	    "652222": "������������������",
	    "652223": "������",
	    "652224": "������",
	    "652300": "��������������",
	    "652301": "������",
	    "652302": "������",
	    "652323": "��ͼ����",
	    "652324": "����˹��",
	    "652325": "��̨��",
	    "652327": "��ľ������",
	    "652328": "ľ�ݹ�����������",
	    "652329": "������",
	    "652700": "���������ɹ�������",
	    "652701": "������",
	    "652702": "����ɽ����",
	    "652722": "������",
	    "652723": "��Ȫ��",
	    "652724": "������",
	    "652800": "��������ɹ�������",
	    "652801": "�������",
	    "652822": "��̨��",
	    "652823": "ξ����",
	    "652824": "��Ǽ��",
	    "652825": "��ĩ��",
	    "652826": "���Ȼ���������",
	    "652827": "�;���",
	    "652828": "��˶��",
	    "652829": "������",
	    "652830": "������",
	    "652900": "�����յ���",
	    "652901": "��������",
	    "652922": "������",
	    "652923": "�⳵��",
	    "652924": "ɳ����",
	    "652925": "�º���",
	    "652926": "�ݳ���",
	    "652927": "��ʲ��",
	    "652928": "��������",
	    "652929": "��ƺ��",
	    "652930": "������",
	    "653000": "�������տ¶�����������",
	    "653001": "��ͼʲ��",
	    "653022": "��������",
	    "653023": "��������",
	    "653024": "��ǡ��",
	    "653025": "������",
	    "653100": "��ʲ����",
	    "653101": "��ʲ��",
	    "653121": "�踽��",
	    "653122": "������",
	    "653123": "Ӣ��ɳ��",
	    "653124": "������",
	    "653125": "ɯ����",
	    "653126": "Ҷ����",
	    "653127": "�������",
	    "653128": "���պ���",
	    "653129": "٤ʦ��",
	    "653130": "�ͳ���",
	    "653131": "��ʲ�����������������",
	    "653132": "������",
	    "653200": "�������",
	    "653201": "������",
	    "653221": "������",
	    "653222": "ī����",
	    "653223": "Ƥɽ��",
	    "653224": "������",
	    "653225": "������",
	    "653226": "������",
	    "653227": "�����",
	    "653228": "������",
	    "654000": "���������������",
	    "654002": "������",
	    "654003": "������",
	    "654021": "������",
	    "654022": "�첼�������������",
	    "654023": "�����",
	    "654024": "������",
	    "654025": "��Դ��",
	    "654026": "������",
	    "654027": "�ؿ�˹��",
	    "654028": "���տ���",
	    "654029": "������",
	    "654200": "���ǵ���",
	    "654201": "������",
	    "654202": "������",
	    "654221": "������",
	    "654223": "ɳ����",
	    "654224": "������",
	    "654225": "ԣ����",
	    "654226": "�Ͳ��������ɹ�������",
	    "654227": "������",
	    "654300": "����̩����",
	    "654301": "����̩��",
	    "654321": "��������",
	    "654322": "������",
	    "654323": "������",
	    "654324": "���ͺ���",
	    "654325": "�����",
	    "654326": "��ľ����",
	    "654327": "������",
	    "659001": "ʯ������",
	    "659002": "��������",
	    "659003": "ͼľ�����",
	    "659004": "�������",
	    "710000": "̨��",
	    "710100": "̨����",
	    "710101": "������",
	    "710102": "��ͬ��",
	    "710103": "��ɽ��",
	    "710104": "��ɽ��",
	    "710105": "����",
	    "710106": "����",
	    "710107": "������",
	    "710108": "ʿ����",
	    "710109": "��Ͷ��",
	    "710110": "�ں���",
	    "710111": "�ϸ���",
	    "710112": "��ɽ��",
	    "710113": "������",
	    "710200": "������",
	    "710201": "������",
	    "710202": "ǰ����",
	    "710203": "������",
	    "710204": "������",
	    "710205": "��ɽ��",
	    "710206": "�����",
	    "710207": "ǰ����",
	    "710208": "������",
	    "710209": "��Ӫ��",
	    "710210": "�����",
	    "710211": "С����",
	    "710212": "������",
	    "710241": "������",
	    "710242": "������",
	    "710243": "������",
	    "710244": "��ɽ��",
	    "710245": "·����",
	    "710246": "������",
	    "710247": "�����",
	    "710248": "�ೲ��",
	    "710249": "��ͷ��",
	    "710250": "������",
	    "710251": "������",
	    "710252": "������",
	    "710253": "������",
	    "710254": "��ɽ��",
	    "710255": "�����",
	    "710256": "��԰��",
	    "710257": "������",
	    "710258": "������",
	    "710259": "��ɽ��",
	    "710260": "��Ũ��",
	    "710261": "������",
	    "710262": "������",
	    "710263": "ɼ����",
	    "710264": "������",
	    "710265": "��Դ��",
	    "710266": "��������",
	    "710267": "ï����",
	    "710268": "���b��",
	    "710300": "̨����",
	    "710301": "������",
	    "710302": "����",
	    "710303": "����",
	    "710304": "����",
	    "710305": "��ƽ��",
	    "710306": "������",
	    "710307": "������",
	    "710339": "������",
	    "710340": "������",
	    "710341": "�»���",
	    "710342": "������",
	    "710343": "����",
	    "710344": "�����",
	    "710345": "�ϻ���",
	    "710346": "�ʵ���",
	    "710347": "������",
	    "710348": "������",
	    "710349": "������",
	    "710350": "�鶹��",
	    "710351": "������",
	    "710352": "������",
	    "710353": "�߹���",
	    "710354": "������",
	    "710355": "ѧ����",
	    "710356": "������",
	    "710357": "��Ӫ��",
	    "710358": "�����",
	    "710359": "�׺���",
	    "710360": "��ɽ��",
	    "710361": "������",
	    "710362": "��Ӫ��",
	    "710363": "��Ӫ��",
	    "710364": "��ˮ��",
	    "710365": "�ƻ���",
	    "710366": "������",
	    "710367": "ɽ����",
	    "710368": "������",
	    "710369": "������",
	    "710400": "̨����",
	    "710401": "����",
	    "710402": "����",
	    "710403": "����",
	    "710404": "����",
	    "710405": "����",
	    "710406": "������",
	    "710407": "������",
	    "710408": "������",
	    "710409": "������",
	    "710431": "̫ƽ��",
	    "710432": "������",
	    "710433": "�����",
	    "710434": "������",
	    "710435": "��ԭ��",
	    "710436": "������",
	    "710437": "ʯ����",
	    "710438": "������",
	    "710439": "��ƽ��",
	    "710440": "������",
	    "710441": "̶����",
	    "710442": "������",
	    "710443": "�����",
	    "710444": "�����",
	    "710445": "ɳ¹��",
	    "710446": "������",
	    "710447": "������",
	    "710448": "��ˮ��",
	    "710449": "�����",
	    "710450": "������",
	    "710451": "����",
	    "710500": "������",
	    "710507": "��ɳ��",
	    "710508": "�����",
	    "710509": "������",
	    "710510": "�����",
	    "710511": "������",
	    "710512": "�ڈw��",
	    "710600": "��Ͷ��",
	    "710614": "��Ͷ��",
	    "710615": "�����",
	    "710616": "������",
	    "710617": "������",
	    "710618": "������",
	    "710619": "�ʰ���",
	    "710620": "������",
	    "710621": "������",
	    "710622": "ˮ����",
	    "710623": "�����",
	    "710624": "������",
	    "710625": "��ɽ��",
	    "710626": "¹����",
	    "710700": "��¡��",
	    "710701": "�ʰ���",
	    "710702": "������",
	    "710703": "������",
	    "710704": "��ɽ��",
	    "710705": "������",
	    "710706": "ůů��",
	    "710707": "�߶���",
	    "710708": "������",
	    "710800": "������",
	    "710801": "����",
	    "710802": "����",
	    "710803": "��ɽ��",
	    "710804": "������",
	    "710900": "������",
	    "710901": "����",
	    "710902": "����",
	    "710903": "������",
	    "711100": "�±���",
	    "711130": "������",
	    "711131": "��ɽ��",
	    "711132": "������",
	    "711133": "ϫֹ��",
	    "711134": "�����",
	    "711135": "ʯ����",
	    "711136": "����",
	    "711137": "ƽϪ��",
	    "711138": "˫Ϫ��",
	    "711139": "�����",
	    "711140": "�µ���",
	    "711141": "ƺ����",
	    "711142": "������",
	    "711143": "������",
	    "711144": "�к���",
	    "711145": "������",
	    "711146": "��Ͽ��",
	    "711147": "������",
	    "711148": "ݺ����",
	    "711149": "������",
	    "711150": "��ׯ��",
	    "711151": "̩ɽ��",
	    "711152": "�ֿ���",
	    "711153": "«����",
	    "711154": "�����",
	    "711155": "������",
	    "711156": "��ˮ��",
	    "711157": "��֥��",
	    "711158": "ʯ����",
	    "711200": "������",
	    "711214": "������",
	    "711215": "ͷ����",
	    "711216": "��Ϫ��",
	    "711217": "׳Χ��",
	    "711218": "Աɽ��",
	    "711219": "�޶���",
	    "711220": "������",
	    "711221": "��ͬ��",
	    "711222": "�����",
	    "711223": "��ɽ��",
	    "711224": "�հ���",
	    "711225": "�ϰ���",
	    "711226": "����̨",
	    "711300": "������",
	    "711314": "����",
	    "711315": "������",
	    "711316": "�·���",
	    "711317": "������",
	    "711318": "������",
	    "711319": "ܺ����",
	    "711320": "��ɽ��",
	    "711321": "����",
	    "711322": "�����",
	    "711323": "��ɽ��",
	    "711324": "��ʯ��",
	    "711325": "������",
	    "711326": "��ü��",
	    "711400": "��԰��",
	    "711414": "������",
	    "711415": "ƽ����",
	    "711416": "��̶��",
	    "711417": "��÷��",
	    "711418": "������",
	    "711419": "������",
	    "711420": "��԰��",
	    "711421": "��ɽ��",
	    "711422": "�˵���",
	    "711423": "��Ϫ��",
	    "711424": "������",
	    "711425": "��԰��",
	    "711426": "«����",
	    "711500": "������",
	    "711519": "������",
	    "711520": "ͷ����",
	    "711521": "������",
	    "711522": "��ׯ��",
	    "711523": "ʨ̶��",
	    "711524": "������",
	    "711525": "ͨ����",
	    "711526": "Է����",
	    "711527": "������",
	    "711528": "������",
	    "711529": "ͷ����",
	    "711530": "������",
	    "711531": "�����",
	    "711532": "̩����",
	    "711533": "ͭ����",
	    "711534": "������",
	    "711535": "������",
	    "711536": "׿����",
	    "711700": "�û���",
	    "711727": "�û���",
	    "711728": "��԰��",
	    "711729": "��̳��",
	    "711730": "��ˮ��",
	    "711731": "¹����",
	    "711732": "������",
	    "711733": "������",
	    "711734": "������",
	    "711735": "�����",
	    "711736": "Ա����",
	    "711737": "��ͷ��",
	    "711738": "������",
	    "711739": "������",
	    "711740": "Ϫ����",
	    "711741": "�����",
	    "711742": "������",
	    "711743": "������",
	    "711744": "������",
	    "711745": "��β��",
	    "711746": "��ͷ��",
	    "711747": "Ϫ����",
	    "711748": "������",
	    "711749": "������",
	    "711750": "�����",
	    "711751": "��Է��",
	    "711752": "��ˮ��",
	    "711900": "������",
	    "711919": "��·��",
	    "711920": "÷ɽ��",
	    "711921": "������",
	    "711922": "����ɽ��",
	    "711923": "������",
	    "711924": "������",
	    "711925": "ˮ����",
	    "711926": "¹����",
	    "711927": "̫����",
	    "711928": "������",
	    "711929": "��ʯ��",
	    "711930": "������",
	    "711931": "�¸���",
	    "711932": "������",
	    "711933": "������",
	    "711934": "Ϫ����",
	    "711935": "������",
	    "711936": "������",
	    "712100": "������",
	    "712121": "������",
	    "712122": "������",
	    "712123": "��β��",
	    "712124": "������",
	    "712125": "������",
	    "712126": "������",
	    "712127": "̨����",
	    "712128": "�ر���",
	    "712129": "�����",
	    "712130": "������",
	    "712131": "������",
	    "712132": "�ſ���",
	    "712133": "Ǆͩ��",
	    "712134": "������",
	    "712135": "������",
	    "712136": "������",
	    "712137": "ˮ����",
	    "712138": "�ں���",
	    "712139": "�ĺ���",
	    "712140": "Ԫ����",
	    "712400": "������",
	    "712434": "������",
	    "712435": "��������",
	    "712436": "��̨��",
	    "712437": "�����",
	    "712438": "������",
	    "712439": "�����",
	    "712440": "������",
	    "712441": "������",
	    "712442": "������",
	    "712443": "������",
	    "712444": "������",
	    "712445": "������",
	    "712446": "����",
	    "712447": "������",
	    "712448": "̩����",
	    "712449": "������",
	    "712450": "������",
	    "712451": "������",
	    "712452": "������",
	    "712453": "������",
	    "712454": "�ֱ���",
	    "712455": "������",
	    "712456": "������",
	    "712457": "�Ѷ���",
	    "712458": "��԰��",
	    "712459": "�����",
	    "712460": "��ɽ��",
	    "712461": "������",
	    "712462": "ʨ����",
	    "712463": "������",
	    "712464": "ĵ����",
	    "712465": "�㴺��",
	    "712466": "������",
	    "712500": "̨����",
	    "712517": "̨����",
	    "712518": "�̵���",
	    "712519": "������",
	    "712520": "��ƽ��",
	    "712521": "������",
	    "712522": "¹Ұ��",
	    "712523": "��ɽ��",
	    "712524": "������",
	    "712525": "������",
	    "712526": "������",
	    "712527": "�ɹ���",
	    "712528": "������",
	    "712529": "�����",
	    "712530": "������",
	    "712531": "������",
	    "712532": "̫������",
	    "712600": "������",
	    "712615": "������",
	    "712616": "�³���",
	    "712617": "̫³��",
	    "712618": "������",
	    "712619": "������",
	    "712620": "�ٷ���",
	    "712621": "������",
	    "712622": "�⸴��",
	    "712623": "�����",
	    "712624": "������",
	    "712625": "������",
	    "712626": "������",
	    "712627": "׿Ϫ��",
	    "712628": "������",
	    "712700": "�����",
	    "712707": "����",
	    "712708": "������",
	    "712709": "������",
	    "712710": "������",
	    "712711": "��ɳ��",
	    "712712": "������",
	    "712800": "������",
	    "712805": "�ϸ���",
	    "712806": "������",
	    "712807": "�����",
	    "712808": "������",
	    "810000": "����ر�������",
	    "810100": "��۵�",
	    "810101": "������",
	    "810102": "����",
	    "810103": "����",
	    "810104": "����",
	    "810200": "����",
	    "810201": "��������",
	    "810202": "�ͼ�����",
	    "810203": "��ˮ����",
	    "810204": "�ƴ�����",
	    "810205": "������",
	    "810300": "�½�",
	    "810301": "����",
	    "810302": "������",
	    "810303": "ɳ����",
	    "810304": "������",
	    "810305": "Ԫ����",
	    "810306": "������",
	    "810307": "������",
	    "810308": "������",
	    "810309": "�뵺��",
	    "820000": "�����ر�������",
	    "820100": "���Ű뵺",
	    "820200": "�뵺",
	    "990000": "����",
	    "990100": "����"
	}
 
	// id pid/parentId name children
	function tree(list) {
	    var mapped = {}
	    for (var i = 0, item; i < list.length; i++) {
	        item = list[i]
	        if (!item || !item.id) continue
	        mapped[item.id] = item
	    }
 
	    var result = []
	    for (var ii = 0; ii < list.length; ii++) {
	        item = list[ii]
 
	        if (!item) continue
	            /* jshint -W041 */
	        if (item.pid == undefined && item.parentId == undefined) {
	            result.push(item)
	            continue
	        }
	        var parent = mapped[item.pid] || mapped[item.parentId]
	        if (!parent) continue
	        if (!parent.children) parent.children = []
	        parent.children.push(item)
	    }
	    return result
	}
 
	var DICT_FIXED = function() {
	    var fixed = []
	    for (var id in DICT) {
	        var pid = id.slice(2, 6) === '0000' ? undefined :
	            id.slice(4, 6) == '00' ? (id.slice(0, 2) + '0000') :
	            id.slice(0, 4) + '00'
	        fixed.push({
	            id: id,
	            pid: pid,
	            name: DICT[id]
	        })
	    }
	    return tree(fixed)
	}()
 
	module.exports = DICT_FIXED
 
/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## Miscellaneous
	*/
	var DICT = __webpack_require__(18)
	module.exports = {
		// Dice
		d4: function() {
			return this.natural(1, 4)
		},
		d6: function() {
			return this.natural(1, 6)
		},
		d8: function() {
			return this.natural(1, 8)
		},
		d12: function() {
			return this.natural(1, 12)
		},
		d20: function() {
			return this.natural(1, 20)
		},
		d100: function() {
			return this.natural(1, 100)
		},
		/*
		    �������һ�� GUID��
		    http://www.broofa.com/2008/09/javascript-uuid-function/
		    [UUID �淶](http://www.ietf.org/rfc/rfc4122.txt)
		        UUIDs (Universally Unique IDentifier)
		        GUIDs (Globally Unique IDentifier)
		        The formal definition of the UUID string representation is provided by the following ABNF [7]:
		            UUID                   = time-low "-" time-mid "-"
		                                   time-high-and-version "-"
		                                   clock-seq-and-reserved
		                                   clock-seq-low "-" node
		            time-low               = 4hexOctet
		            time-mid               = 2hexOctet
		            time-high-and-version  = 2hexOctet
		            clock-seq-and-reserved = hexOctet
		            clock-seq-low          = hexOctet
		            node                   = 6hexOctet
		            hexOctet               = hexDigit hexDigit
		            hexDigit =
		                "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
		                "a" / "b" / "c" / "d" / "e" / "f" /
		                "A" / "B" / "C" / "D" / "E" / "F"
		    
		    https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349
		*/
		guid: function() {
			var pool = "abcdefABCDEF1234567890",
				guid = this.string(pool, 8) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 12);
			return guid
		},
		uuid: function() {
			return this.guid()
		},
		/*
		    �������һ�� 18 λ���֤��
		    [���֤](http://baike.baidu.com/view/1697.htm#4)
		        ��ַ�� 6 + ���������� 8 + ˳���� 3 + У���� 1
		    [���л����񹲺͹������������롷���ұ�׼(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
		*/
		id: function() {
			var id,
				sum = 0,
				rank = [
					"7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"
				],
				last = [
					"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"
				]
 
			id = this.pick(DICT).id +
				this.date('yyyyMMdd') +
				this.string('number', 3)
 
			for (var i = 0; i < id.length; i++) {
				sum += id[i] * rank[i];
			}
			id += last[sum % 11];
 
			return id
		},
 
		/*
		    ����һ��ȫ�ֵ�����������
		    ��������������auto increment primary key����
		*/
		increment: function() {
			var key = 0
			return function(step) {
				return key += (+step || 1) // step?
			}
		}(),
		inc: function(step) {
			return this.increment(step)
		}
	}
 
/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {
 
	var Parser = __webpack_require__(21)
	var Handler = __webpack_require__(22)
	module.exports = {
		Parser: Parser,
		Handler: Handler
	}
 
/***/ },
/* 21 */
/***/ function(module, exports) {
 
	// https://github.com/nuysoft/regexp
	// forked from https://github.com/ForbesLindesay/regexp
 
	function parse(n) {
	    if ("string" != typeof n) {
	        var l = new TypeError("The regexp to parse must be represented as a string.");
	        throw l;
	    }
	    return index = 1, cgs = {}, parser.parse(n);
	}
 
	function Token(n) {
	    this.type = n, this.offset = Token.offset(), this.text = Token.text();
	}
 
	function Alternate(n, l) {
	    Token.call(this, "alternate"), this.left = n, this.right = l;
	}
 
	function Match(n) {
	    Token.call(this, "match"), this.body = n.filter(Boolean);
	}
 
	function Group(n, l) {
	    Token.call(this, n), this.body = l;
	}
 
	function CaptureGroup(n) {
	    Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++), 
	    this.body = n;
	}
 
	function Quantified(n, l) {
	    Token.call(this, "quantified"), this.body = n, this.quantifier = l;
	}
 
	function Quantifier(n, l) {
	    Token.call(this, "quantifier"), this.min = n, this.max = l, this.greedy = !0;
	}
 
	function CharSet(n, l) {
	    Token.call(this, "charset"), this.invert = n, this.body = l;
	}
 
	function CharacterRange(n, l) {
	    Token.call(this, "range"), this.start = n, this.end = l;
	}
 
	function Literal(n) {
	    Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
	}
 
	function Unicode(n) {
	    Token.call(this, "unicode"), this.code = n.toUpperCase();
	}
 
	function Hex(n) {
	    Token.call(this, "hex"), this.code = n.toUpperCase();
	}
 
	function Octal(n) {
	    Token.call(this, "octal"), this.code = n.toUpperCase();
	}
 
	function BackReference(n) {
	    Token.call(this, "back-reference"), this.code = n.toUpperCase();
	}
 
	function ControlCharacter(n) {
	    Token.call(this, "control-character"), this.code = n.toUpperCase();
	}
 
	var parser = function() {
	    function n(n, l) {
	        function u() {
	            this.constructor = n;
	        }
	        u.prototype = l.prototype, n.prototype = new u();
	    }
	    function l(n, l, u, t, r) {
	        function e(n, l) {
	            function u(n) {
	                function l(n) {
	                    return n.charCodeAt(0).toString(16).toUpperCase();
	                }
	                return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n) {
	                    return "\\x0" + l(n);
	                }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n) {
	                    return "\\x" + l(n);
	                }).replace(/[\u0180-\u0FFF]/g, function(n) {
	                    return "\\u0" + l(n);
	                }).replace(/[\u1080-\uFFFF]/g, function(n) {
	                    return "\\u" + l(n);
	                });
	            }
	            var t, r;
	            switch (n.length) {
	              case 0:
	                t = "end of input";
	                break;
 
	              case 1:
	                t = n[0];
	                break;
 
	              default:
	                t = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
	            }
	            return r = l ? '"' + u(l) + '"' : "end of input", "Expected " + t + " but " + r + " found.";
	        }
	        this.expected = n, this.found = l, this.offset = u, this.line = t, this.column = r, 
	        this.name = "SyntaxError", this.message = e(n, l);
	    }
	    function u(n) {
	        function u() {
	            return n.substring(Lt, qt);
	        }
	        function t() {
	            return Lt;
	        }
	        function r(l) {
	            function u(l, u, t) {
	                var r, e;
	                for (r = u; t > r; r++) e = n.charAt(r), "\n" === e ? (l.seenCR || l.line++, l.column = 1, 
	                l.seenCR = !1) : "\r" === e || "\u2028" === e || "\u2029" === e ? (l.line++, l.column = 1, 
	                l.seenCR = !0) : (l.column++, l.seenCR = !1);
	            }
	            return Mt !== l && (Mt > l && (Mt = 0, Dt = {
	                line: 1,
	                column: 1,
	                seenCR: !1
	            }), u(Dt, Mt, l), Mt = l), Dt;
	        }
	        function e(n) {
	            Ht > qt || (qt > Ht && (Ht = qt, Ot = []), Ot.push(n));
	        }
	        function o(n) {
	            var l = 0;
	            for (n.sort(); l < n.length; ) n[l - 1] === n[l] ? n.splice(l, 1) : l++;
	        }
	        function c() {
	            var l, u, t, r, o;
	            return l = qt, u = i(), null !== u ? (t = qt, 124 === n.charCodeAt(qt) ? (r = fl, 
	            qt++) : (r = null, 0 === Wt && e(sl)), null !== r ? (o = c(), null !== o ? (r = [ r, o ], 
	            t = r) : (qt = t, t = il)) : (qt = t, t = il), null === t && (t = al), null !== t ? (Lt = l, 
	            u = hl(u, t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, 
	            l = il), l;
	        }
	        function i() {
	            var n, l, u, t, r;
	            if (n = qt, l = f(), null === l && (l = al), null !== l) if (u = qt, Wt++, t = d(), 
	            Wt--, null === t ? u = al : (qt = u, u = il), null !== u) {
	                for (t = [], r = h(), null === r && (r = a()); null !== r; ) t.push(r), r = h(), 
	                null === r && (r = a());
	                null !== t ? (r = s(), null === r && (r = al), null !== r ? (Lt = n, l = dl(l, t, r), 
	                null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il);
	            } else qt = n, n = il; else qt = n, n = il;
	            return n;
	        }
	        function a() {
	            var n;
	            return n = x(), null === n && (n = Q(), null === n && (n = B())), n;
	        }
	        function f() {
	            var l, u;
	            return l = qt, 94 === n.charCodeAt(qt) ? (u = pl, qt++) : (u = null, 0 === Wt && e(vl)), 
	            null !== u && (Lt = l, u = wl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function s() {
	            var l, u;
	            return l = qt, 36 === n.charCodeAt(qt) ? (u = Al, qt++) : (u = null, 0 === Wt && e(Cl)), 
	            null !== u && (Lt = l, u = gl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function h() {
	            var n, l, u;
	            return n = qt, l = a(), null !== l ? (u = d(), null !== u ? (Lt = n, l = bl(l, u), 
	            null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), n;
	        }
	        function d() {
	            var n, l, u;
	            return Wt++, n = qt, l = p(), null !== l ? (u = k(), null === u && (u = al), null !== u ? (Lt = n, 
	            l = Tl(l, u), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, 
	            n = il), Wt--, null === n && (l = null, 0 === Wt && e(kl)), n;
	        }
	        function p() {
	            var n;
	            return n = v(), null === n && (n = w(), null === n && (n = A(), null === n && (n = C(), 
	            null === n && (n = g(), null === n && (n = b()))))), n;
	        }
	        function v() {
	            var l, u, t, r, o, c;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (44 === n.charCodeAt(qt) ? (r = ml, qt++) : (r = null, 
	            0 === Wt && e(Rl)), null !== r ? (o = T(), null !== o ? (125 === n.charCodeAt(qt) ? (c = Fl, 
	            qt++) : (c = null, 0 === Wt && e(Ql)), null !== c ? (Lt = l, u = Sl(t, o), null === u ? (qt = l, 
	            l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function w() {
	            var l, u, t, r;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (n.substr(qt, 2) === Ul ? (r = Ul, qt += 2) : (r = null, 
	            0 === Wt && e(El)), null !== r ? (Lt = l, u = Gl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function A() {
	            var l, u, t, r;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (125 === n.charCodeAt(qt) ? (r = Fl, qt++) : (r = null, 
	            0 === Wt && e(Ql)), null !== r ? (Lt = l, u = Bl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function C() {
	            var l, u;
	            return l = qt, 43 === n.charCodeAt(qt) ? (u = jl, qt++) : (u = null, 0 === Wt && e($l)), 
	            null !== u && (Lt = l, u = ql()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function g() {
	            var l, u;
	            return l = qt, 42 === n.charCodeAt(qt) ? (u = Ll, qt++) : (u = null, 0 === Wt && e(Ml)), 
	            null !== u && (Lt = l, u = Dl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function b() {
	            var l, u;
	            return l = qt, 63 === n.charCodeAt(qt) ? (u = Hl, qt++) : (u = null, 0 === Wt && e(Ol)), 
	            null !== u && (Lt = l, u = Wl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function k() {
	            var l;
	            return 63 === n.charCodeAt(qt) ? (l = Hl, qt++) : (l = null, 0 === Wt && e(Ol)), 
	            l;
	        }
	        function T() {
	            var l, u, t;
	            if (l = qt, u = [], zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 
	            0 === Wt && e(Il)), null !== t) for (;null !== t; ) u.push(t), zl.test(n.charAt(qt)) ? (t = n.charAt(qt), 
	            qt++) : (t = null, 0 === Wt && e(Il)); else u = il;
	            return null !== u && (Lt = l, u = Jl(u)), null === u ? (qt = l, l = u) : l = u, 
	            l;
	        }
	        function x() {
	            var l, u, t, r;
	            return l = qt, 40 === n.charCodeAt(qt) ? (u = Kl, qt++) : (u = null, 0 === Wt && e(Nl)), 
	            null !== u ? (t = R(), null === t && (t = F(), null === t && (t = m(), null === t && (t = y()))), 
	            null !== t ? (41 === n.charCodeAt(qt) ? (r = Pl, qt++) : (r = null, 0 === Wt && e(Vl)), 
	            null !== r ? (Lt = l, u = Xl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function y() {
	            var n, l;
	            return n = qt, l = c(), null !== l && (Lt = n, l = Yl(l)), null === l ? (qt = n, 
	            n = l) : n = l, n;
	        }
	        function m() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === Zl ? (u = Zl, qt += 2) : (u = null, 0 === Wt && e(_l)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = nu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function R() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === lu ? (u = lu, qt += 2) : (u = null, 0 === Wt && e(uu)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = tu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function F() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === ru ? (u = ru, qt += 2) : (u = null, 0 === Wt && e(eu)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = ou(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function Q() {
	            var l, u, t, r, o;
	            if (Wt++, l = qt, 91 === n.charCodeAt(qt) ? (u = iu, qt++) : (u = null, 0 === Wt && e(au)), 
	            null !== u) if (94 === n.charCodeAt(qt) ? (t = pl, qt++) : (t = null, 0 === Wt && e(vl)), 
	            null === t && (t = al), null !== t) {
	                for (r = [], o = S(), null === o && (o = U()); null !== o; ) r.push(o), o = S(), 
	                null === o && (o = U());
	                null !== r ? (93 === n.charCodeAt(qt) ? (o = fu, qt++) : (o = null, 0 === Wt && e(su)), 
	                null !== o ? (Lt = l, u = hu(t, r), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il)) : (qt = l, l = il);
	            } else qt = l, l = il; else qt = l, l = il;
	            return Wt--, null === l && (u = null, 0 === Wt && e(cu)), l;
	        }
	        function S() {
	            var l, u, t, r;
	            return Wt++, l = qt, u = U(), null !== u ? (45 === n.charCodeAt(qt) ? (t = pu, qt++) : (t = null, 
	            0 === Wt && e(vu)), null !== t ? (r = U(), null !== r ? (Lt = l, u = wu(u, r), null === u ? (qt = l, 
	            l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), Wt--, 
	            null === l && (u = null, 0 === Wt && e(du)), l;
	        }
	        function U() {
	            var n, l;
	            return Wt++, n = G(), null === n && (n = E()), Wt--, null === n && (l = null, 0 === Wt && e(Au)), 
	            n;
	        }
	        function E() {
	            var l, u;
	            return l = qt, Cu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 0 === Wt && e(gu)), 
	            null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function G() {
	            var n;
	            return n = L(), null === n && (n = Y(), null === n && (n = H(), null === n && (n = O(), 
	            null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), 
	            null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), 
	            null === n && (n = X(), null === n && (n = _(), null === n && (n = nl(), null === n && (n = ll(), 
	            null === n && (n = ul(), null === n && (n = tl()))))))))))))))))), n;
	        }
	        function B() {
	            var n;
	            return n = j(), null === n && (n = q(), null === n && (n = $())), n;
	        }
	        function j() {
	            var l, u;
	            return l = qt, 46 === n.charCodeAt(qt) ? (u = ku, qt++) : (u = null, 0 === Wt && e(Tu)), 
	            null !== u && (Lt = l, u = xu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function $() {
	            var l, u;
	            return Wt++, l = qt, mu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 
	            0 === Wt && e(Ru)), null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, 
	            Wt--, null === l && (u = null, 0 === Wt && e(yu)), l;
	        }
	        function q() {
	            var n;
	            return n = M(), null === n && (n = D(), null === n && (n = Y(), null === n && (n = H(), 
	            null === n && (n = O(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), 
	            null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), 
	            null === n && (n = V(), null === n && (n = X(), null === n && (n = Z(), null === n && (n = _(), 
	            null === n && (n = nl(), null === n && (n = ll(), null === n && (n = ul(), null === n && (n = tl()))))))))))))))))))), 
	            n;
	        }
	        function L() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
	            null !== u && (Lt = l, u = Su()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function M() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
	            null !== u && (Lt = l, u = Uu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function D() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Eu ? (u = Eu, qt += 2) : (u = null, 0 === Wt && e(Gu)), 
	            null !== u && (Lt = l, u = Bu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function H() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ju ? (u = ju, qt += 2) : (u = null, 0 === Wt && e($u)), 
	            null !== u && (Lt = l, u = qu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function O() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Lu ? (u = Lu, qt += 2) : (u = null, 0 === Wt && e(Mu)), 
	            null !== u && (Lt = l, u = Du()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function W() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Hu ? (u = Hu, qt += 2) : (u = null, 0 === Wt && e(Ou)), 
	            null !== u && (Lt = l, u = Wu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function z() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === zu ? (u = zu, qt += 2) : (u = null, 0 === Wt && e(Iu)), 
	            null !== u && (Lt = l, u = Ju()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function I() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Ku ? (u = Ku, qt += 2) : (u = null, 0 === Wt && e(Nu)), 
	            null !== u && (Lt = l, u = Pu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function J() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Vu ? (u = Vu, qt += 2) : (u = null, 0 === Wt && e(Xu)), 
	            null !== u && (Lt = l, u = Yu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function K() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Zu ? (u = Zu, qt += 2) : (u = null, 0 === Wt && e(_u)), 
	            null !== u && (Lt = l, u = nt()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function N() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === lt ? (u = lt, qt += 2) : (u = null, 0 === Wt && e(ut)), 
	            null !== u && (Lt = l, u = tt()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function P() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === rt ? (u = rt, qt += 2) : (u = null, 0 === Wt && e(et)), 
	            null !== u && (Lt = l, u = ot()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function V() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ct ? (u = ct, qt += 2) : (u = null, 0 === Wt && e(it)), 
	            null !== u && (Lt = l, u = at()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function X() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ft ? (u = ft, qt += 2) : (u = null, 0 === Wt && e(st)), 
	            null !== u && (Lt = l, u = ht()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function Y() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === dt ? (u = dt, qt += 2) : (u = null, 0 === Wt && e(pt)), 
	            null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
	            null !== t ? (Lt = l, u = wt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function Z() {
	            var l, u, t;
	            return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
	            null !== u ? (gt.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(bt)), 
	            null !== t ? (Lt = l, u = kt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function _() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
	            null !== u) {
	                if (t = [], yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(mt)), 
	                null !== r) for (;null !== r; ) t.push(r), yt.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(mt)); else t = il;
	                null !== t ? (Lt = l, u = Rt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function nl() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Ft ? (u = Ft, qt += 2) : (u = null, 0 === Wt && e(Qt)), 
	            null !== u) {
	                if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
	                null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
	                null !== t ? (Lt = l, u = Et(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function ll() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Gt ? (u = Gt, qt += 2) : (u = null, 0 === Wt && e(Bt)), 
	            null !== u) {
	                if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
	                null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
	                null !== t ? (Lt = l, u = jt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function ul() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
	            null !== u && (Lt = l, u = $t()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function tl() {
	            var l, u, t;
	            return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
	            null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
	            null !== t ? (Lt = l, u = bu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        var rl, el = arguments.length > 1 ? arguments[1] : {}, ol = {
	            regexp: c
	        }, cl = c, il = null, al = "", fl = "|", sl = '"|"', hl = function(n, l) {
	            return l ? new Alternate(n, l[1]) : n;
	        }, dl = function(n, l, u) {
	            return new Match([ n ].concat(l).concat([ u ]));
	        }, pl = "^", vl = '"^"', wl = function() {
	            return new Token("start");
	        }, Al = "$", Cl = '"$"', gl = function() {
	            return new Token("end");
	        }, bl = function(n, l) {
	            return new Quantified(n, l);
	        }, kl = "Quantifier", Tl = function(n, l) {
	            return l && (n.greedy = !1), n;
	        }, xl = "{", yl = '"{"', ml = ",", Rl = '","', Fl = "}", Ql = '"}"', Sl = function(n, l) {
	            return new Quantifier(n, l);
	        }, Ul = ",}", El = '",}"', Gl = function(n) {
	            return new Quantifier(n, 1/0);
	        }, Bl = function(n) {
	            return new Quantifier(n, n);
	        }, jl = "+", $l = '"+"', ql = function() {
	            return new Quantifier(1, 1/0);
	        }, Ll = "*", Ml = '"*"', Dl = function() {
	            return new Quantifier(0, 1/0);
	        }, Hl = "?", Ol = '"?"', Wl = function() {
	            return new Quantifier(0, 1);
	        }, zl = /^[0-9]/, Il = "[0-9]", Jl = function(n) {
	            return +n.join("");
	        }, Kl = "(", Nl = '"("', Pl = ")", Vl = '")"', Xl = function(n) {
	            return n;
	        }, Yl = function(n) {
	            return new CaptureGroup(n);
	        }, Zl = "?:", _l = '"?:"', nu = function(n) {
	            return new Group("non-capture-group", n);
	        }, lu = "?=", uu = '"?="', tu = function(n) {
	            return new Group("positive-lookahead", n);
	        }, ru = "?!", eu = '"?!"', ou = function(n) {
	            return new Group("negative-lookahead", n);
	        }, cu = "CharacterSet", iu = "[", au = '"["', fu = "]", su = '"]"', hu = function(n, l) {
	            return new CharSet(!!n, l);
	        }, du = "CharacterRange", pu = "-", vu = '"-"', wu = function(n, l) {
	            return new CharacterRange(n, l);
	        }, Au = "Character", Cu = /^[^\\\]]/, gu = "[^\\\\\\]]", bu = function(n) {
	            return new Literal(n);
	        }, ku = ".", Tu = '"."', xu = function() {
	            return new Token("any-character");
	        }, yu = "Literal", mu = /^[^|\\\/.[()?+*$\^]/, Ru = "[^|\\\\\\/.[()?+*$\\^]", Fu = "\\b", Qu = '"\\\\b"', Su = function() {
	            return new Token("backspace");
	        }, Uu = function() {
	            return new Token("word-boundary");
	        }, Eu = "\\B", Gu = '"\\\\B"', Bu = function() {
	            return new Token("non-word-boundary");
	        }, ju = "\\d", $u = '"\\\\d"', qu = function() {
	            return new Token("digit");
	        }, Lu = "\\D", Mu = '"\\\\D"', Du = function() {
	            return new Token("non-digit");
	        }, Hu = "\\f", Ou = '"\\\\f"', Wu = function() {
	            return new Token("form-feed");
	        }, zu = "\\n", Iu = '"\\\\n"', Ju = function() {
	            return new Token("line-feed");
	        }, Ku = "\\r", Nu = '"\\\\r"', Pu = function() {
	            return new Token("carriage-return");
	        }, Vu = "\\s", Xu = '"\\\\s"', Yu = function() {
	            return new Token("white-space");
	        }, Zu = "\\S", _u = '"\\\\S"', nt = function() {
	            return new Token("non-white-space");
	        }, lt = "\\t", ut = '"\\\\t"', tt = function() {
	            return new Token("tab");
	        }, rt = "\\v", et = '"\\\\v"', ot = function() {
	            return new Token("vertical-tab");
	        }, ct = "\\w", it = '"\\\\w"', at = function() {
	            return new Token("word");
	        }, ft = "\\W", st = '"\\\\W"', ht = function() {
	            return new Token("non-word");
	        }, dt = "\\c", pt = '"\\\\c"', vt = "any character", wt = function(n) {
	            return new ControlCharacter(n);
	        }, At = "\\", Ct = '"\\\\"', gt = /^[1-9]/, bt = "[1-9]", kt = function(n) {
	            return new BackReference(n);
	        }, Tt = "\\0", xt = '"\\\\0"', yt = /^[0-7]/, mt = "[0-7]", Rt = function(n) {
	            return new Octal(n.join(""));
	        }, Ft = "\\x", Qt = '"\\\\x"', St = /^[0-9a-fA-F]/, Ut = "[0-9a-fA-F]", Et = function(n) {
	            return new Hex(n.join(""));
	        }, Gt = "\\u", Bt = '"\\\\u"', jt = function(n) {
	            return new Unicode(n.join(""));
	        }, $t = function() {
	            return new Token("null-character");
	        }, qt = 0, Lt = 0, Mt = 0, Dt = {
	            line: 1,
	            column: 1,
	            seenCR: !1
	        }, Ht = 0, Ot = [], Wt = 0;
	        if ("startRule" in el) {
	            if (!(el.startRule in ol)) throw new Error("Can't start parsing from rule \"" + el.startRule + '".');
	            cl = ol[el.startRule];
	        }
	        if (Token.offset = t, Token.text = u, rl = cl(), null !== rl && qt === n.length) return rl;
	        throw o(Ot), Lt = Math.max(qt, Ht), new l(Ot, Lt < n.length ? n.charAt(Lt) : null, Lt, r(Lt).line, r(Lt).column);
	    }
	    return n(l, Error), {
	        SyntaxError: l,
	        parse: u
	    };
	}(), index = 1, cgs = {};
 
	module.exports = parser
 
/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## RegExp Handler
	    https://github.com/ForbesLindesay/regexp
	    https://github.com/dmajda/pegjs
	    http://www.regexper.com/
	    ÿ���ڵ�Ľṹ
	        {
	            type: '',
	            offset: number,
	            text: '',
	            body: {},
	            escaped: true/false
	        }
	    type ��ѡֵ
	        alternate             |         ѡ��
	        match                 ƥ��
	        capture-group         ()        ������
	        non-capture-group     (?:...)   �ǲ�����
	        positive-lookahead    (?=p)     ����������ж���
	        negative-lookahead    (?!p)     ��������ж���
	        quantified            a*        �ظ��ڵ�
	        quantifier            *         ����
	        charset               []        �ַ���
	        range                 {m, n}    ��Χ
	        literal               a         ֱ�����ַ�
	        unicode               \uxxxx    Unicode
	        hex                   \x        ʮ������
	        octal                 �˽���
	        back-reference        \n        ��������
	        control-character     \cX       �����ַ�
	        // Token
	        start               ^       ��ͷ
	        end                 $       ��β
	        any-character       .       �����ַ�
	        backspace           [\b]    �˸�ֱ����
	        word-boundary       \b      ���ʱ߽�
	        non-word-boundary   \B      �ǵ��ʱ߽�
	        digit               \d      ASCII ���֣�[0-9]
	        non-digit           \D      �� ASCII ���֣�[^0-9]
	        form-feed           \f      ��ҳ��
	        line-feed           \n      ���з�
	        carriage-return     \r      �س���
	        white-space         \s      �հ׷�
	        non-white-space     \S      �ǿհ׷�
	        tab                 \t      �Ʊ��
	        vertical-tab        \v      ��ֱ�Ʊ��
	        word                \w      ASCII �ַ���[a-zA-Z0-9]
	        non-word            \W      �� ASCII �ַ���[^a-zA-Z0-9]
	        null-character      \o      NUL �ַ�
	 */
 
	var Util = __webpack_require__(3)
	var Random = __webpack_require__(5)
	    /*
	        
	    */
	var Handler = {
	    extend: Util.extend
	}
 
	// http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
	/*var ASCII_CONTROL_CODE_CHART = {
	    '@': ['\u0000'],
	    A: ['\u0001'],
	    B: ['\u0002'],
	    C: ['\u0003'],
	    D: ['\u0004'],
	    E: ['\u0005'],
	    F: ['\u0006'],
	    G: ['\u0007', '\a'],
	    H: ['\u0008', '\b'],
	    I: ['\u0009', '\t'],
	    J: ['\u000A', '\n'],
	    K: ['\u000B', '\v'],
	    L: ['\u000C', '\f'],
	    M: ['\u000D', '\r'],
	    N: ['\u000E'],
	    O: ['\u000F'],
	    P: ['\u0010'],
	    Q: ['\u0011'],
	    R: ['\u0012'],
	    S: ['\u0013'],
	    T: ['\u0014'],
	    U: ['\u0015'],
	    V: ['\u0016'],
	    W: ['\u0017'],
	    X: ['\u0018'],
	    Y: ['\u0019'],
	    Z: ['\u001A'],
	    '[': ['\u001B', '\e'],
	    '\\': ['\u001C'],
	    ']': ['\u001D'],
	    '^': ['\u001E'],
	    '_': ['\u001F']
	}*/
 
	// ASCII printable code chart
	// var LOWER = 'abcdefghijklmnopqrstuvwxyz'
	// var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	// var NUMBER = '0123456789'
	// var SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
	var LOWER = ascii(97, 122)
	var UPPER = ascii(65, 90)
	var NUMBER = ascii(48, 57)
	var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126) // �ų� 95 _ ascii(91, 94) + ascii(96, 96)
	var PRINTABLE = ascii(32, 126)
	var SPACE = ' \f\n\r\t\v\u00A0\u2028\u2029'
	var CHARACTER_CLASSES = {
	    '\\w': LOWER + UPPER + NUMBER + '_', // ascii(95, 95)
	    '\\W': OTHER.replace('_', ''),
	    '\\s': SPACE,
	    '\\S': function() {
	        var result = PRINTABLE
	        for (var i = 0; i < SPACE.length; i++) {
	            result = result.replace(SPACE[i], '')
	        }
	        return result
	    }(),
	    '\\d': NUMBER,
	    '\\D': LOWER + UPPER + OTHER
	}
 
	function ascii(from, to) {
	    var result = ''
	    for (var i = from; i <= to; i++) {
	        result += String.fromCharCode(i)
	    }
	    return result
	}
 
	// var ast = RegExpParser.parse(regexp.source)
	Handler.gen = function(node, result, cache) {
	    cache = cache || {
	        guid: 1
	    }
	    return Handler[node.type] ? Handler[node.type](node, result, cache) :
	        Handler.token(node, result, cache)
	}
 
	Handler.extend({
	    /* jshint unused:false */
	    token: function(node, result, cache) {
	        switch (node.type) {
	            case 'start':
	            case 'end':
	                return ''
	            case 'any-character':
	                return Random.character()
	            case 'backspace':
	                return ''
	            case 'word-boundary': // TODO
	                return ''
	            case 'non-word-boundary': // TODO
	                break
	            case 'digit':
	                return Random.pick(
	                    NUMBER.split('')
	                )
	            case 'non-digit':
	                return Random.pick(
	                    (LOWER + UPPER + OTHER).split('')
	                )
	            case 'form-feed':
	                break
	            case 'line-feed':
	                return node.body || node.text
	            case 'carriage-return':
	                break
	            case 'white-space':
	                return Random.pick(
	                    SPACE.split('')
	                )
	            case 'non-white-space':
	                return Random.pick(
	                    (LOWER + UPPER + NUMBER).split('')
	                )
	            case 'tab':
	                break
	            case 'vertical-tab':
	                break
	            case 'word': // \w [a-zA-Z0-9]
	                return Random.pick(
	                    (LOWER + UPPER + NUMBER).split('')
	                )
	            case 'non-word': // \W [^a-zA-Z0-9]
	                return Random.pick(
	                    OTHER.replace('_', '').split('')
	                )
	            case 'null-character':
	                break
	        }
	        return node.body || node.text
	    },
	    /*
	        {
	            type: 'alternate',
	            offset: 0,
	            text: '',
	            left: {
	                boyd: []
	            },
	            right: {
	                boyd: []
	            }
	        }
	    */
	    alternate: function(node, result, cache) {
	        // node.left/right {}
	        return this.gen(
	            Random.boolean() ? node.left : node.right,
	            result,
	            cache
	        )
	    },
	    /*
	        {
	            type: 'match',
	            offset: 0,
	            text: '',
	            body: []
	        }
	    */
	    match: function(node, result, cache) {
	        result = ''
	            // node.body []
	        for (var i = 0; i < node.body.length; i++) {
	            result += this.gen(node.body[i], result, cache)
	        }
	        return result
	    },
	    // ()
	    'capture-group': function(node, result, cache) {
	        // node.body {}
	        result = this.gen(node.body, result, cache)
	        cache[cache.guid++] = result
	        return result
	    },
	    // (?:...)
	    'non-capture-group': function(node, result, cache) {
	        // node.body {}
	        return this.gen(node.body, result, cache)
	    },
	    // (?=p)
	    'positive-lookahead': function(node, result, cache) {
	        // node.body
	        return this.gen(node.body, result, cache)
	    },
	    // (?!p)
	    'negative-lookahead': function(node, result, cache) {
	        // node.body
	        return ''
	    },
	    /*
	        {
	            type: 'quantified',
	            offset: 3,
	            text: 'c*',
	            body: {
	                type: 'literal',
	                offset: 3,
	                text: 'c',
	                body: 'c',
	                escaped: false
	            },
	            quantifier: {
	                type: 'quantifier',
	                offset: 4,
	                text: '*',
	                min: 0,
	                max: Infinity,
	                greedy: true
	            }
	        }
	    */
	    quantified: function(node, result, cache) {
	        result = ''
	            // node.quantifier {}
	        var count = this.quantifier(node.quantifier);
	        // node.body {}
	        for (var i = 0; i < count; i++) {
	            result += this.gen(node.body, result, cache)
	        }
	        return result
	    },
	    /*
	        quantifier: {
	            type: 'quantifier',
	            offset: 4,
	            text: '*',
	            min: 0,
	            max: Infinity,
	            greedy: true
	        }
	    */
	    quantifier: function(node, result, cache) {
	        var min = Math.max(node.min, 0)
	        var max = isFinite(node.max) ? node.max :
	            min + Random.integer(3, 7)
	        return Random.integer(min, max)
	    },
	    /*
	        
	    */
	    charset: function(node, result, cache) {
	        // node.invert
	        if (node.invert) return this['invert-charset'](node, result, cache)
 
	        // node.body []
	        var literal = Random.pick(node.body)
	        return this.gen(literal, result, cache)
	    },
	    'invert-charset': function(node, result, cache) {
	        var pool = PRINTABLE
	        for (var i = 0, item; i < node.body.length; i++) {
	            item = node.body[i]
	            switch (item.type) {
	                case 'literal':
	                    pool = pool.replace(item.body, '')
	                    break
	                case 'range':
	                    var min = this.gen(item.start, result, cache).charCodeAt()
	                    var max = this.gen(item.end, result, cache).charCodeAt()
	                    for (var ii = min; ii <= max; ii++) {
	                        pool = pool.replace(String.fromCharCode(ii), '')
	                    }
	                    /* falls through */
	                default:
	                    var characters = CHARACTER_CLASSES[item.text]
	                    if (characters) {
	                        for (var iii = 0; iii <= characters.length; iii++) {
	                            pool = pool.replace(characters[iii], '')
	                        }
	                    }
	            }
	        }
	        return Random.pick(pool.split(''))
	    },
	    range: function(node, result, cache) {
	        // node.start, node.end
	        var min = this.gen(node.start, result, cache).charCodeAt()
	        var max = this.gen(node.end, result, cache).charCodeAt()
	        return String.fromCharCode(
	            Random.integer(min, max)
	        )
	    },
	    literal: function(node, result, cache) {
	        return node.escaped ? node.body : node.text
	    },
	    // Unicode \u
	    unicode: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 16)
	        )
	    },
	    // ʮ������ \xFF
	    hex: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 16)
	        )
	    },
	    // �˽��� \0
	    octal: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 8)
	        )
	    },
	    // ��������
	    'back-reference': function(node, result, cache) {
	        return cache[node.code] || ''
	    },
	    /*
	        http://en.wikipedia.org/wiki/C0_and_C1_control_codes
	    */
	    CONTROL_CHARACTER_MAP: function() {
	        var CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ')
	        var CONTROL_CHARACTER_UNICODE = '\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F'.split(' ')
	        var map = {}
	        for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
	            map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i]
	        }
	        return map
	    }(),
	    'control-character': function(node, result, cache) {
	        return this.CONTROL_CHARACTER_MAP[node.code]
	    }
	})
 
	module.exports = Handler
 
/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {
 
	module.exports = __webpack_require__(24)
 
/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## toJSONSchema
	    �� Mock.js ��������ģ��ת���� JSON Schema��
	    > [JSON Schema](http://json-schema.org/)
	 */
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var Parser = __webpack_require__(4)
 
	function toJSONSchema(template, name, path /* Internal Use Only */ ) {
	    // type rule properties items
	    path = path || []
	    var result = {
	        name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
	        template: template,
	        type: Util.type(template), // ���ܲ�׼ȷ������ { 'name|1': [{}, {} ...] }
	        rule: Parser.parse(name)
	    }
	    result.path = path.slice(0)
	    result.path.push(name === undefined ? 'ROOT' : result.name)
 
	    switch (result.type) {
	        case 'array':
	            result.items = []
	            Util.each(template, function(value, index) {
	                result.items.push(
	                    toJSONSchema(value, index, result.path)
	                )
	            })
	            break
	        case 'object':
	            result.properties = []
	            Util.each(template, function(value, name) {
	                result.properties.push(
	                    toJSONSchema(value, name, result.path)
	                )
	            })
	            break
	    }
 
	    return result
 
	}
 
	module.exports = toJSONSchema
 
 
/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {
 
	module.exports = __webpack_require__(26)
 
/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {
 
	/*
	    ## valid(template, data)
	    У����ʵ���� data �Ƿ�������ģ�� template ƥ�䡣
	    
	    ʵ��˼·��
	    1. ��������
	        �Ȱ�����ģ�� template ����Ϊ��������������� JSON-Schame
	        name               ������ 
	        type               ����ֵ����
	        template           ����ֵģ��
	        properties         ������������
	        items              ����Ԫ������
	        rule               ����ֵ���ɹ���
	    2. �ݹ���֤����
	        Ȼ���� JSON-Schema У����ʵ���ݣ�У���������������ֵ���͡�ֵ��ֵ���ɹ���
	    ��ʾ��Ϣ 
	    https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
	    [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
	    [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
	*/
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var toJSONSchema = __webpack_require__(23)
 
	function valid(template, data) {
	    var schema = toJSONSchema(template)
	    var result = Diff.diff(schema, data)
	    for (var i = 0; i < result.length; i++) {
	        // console.log(template, data)
	        // console.warn(Assert.message(result[i]))
	    }
	    return result
	}
 
	/*
	    ## name
	        �����ɹ��򣺱ȽϽ������ name
	        �����ɹ���ֱ�ӱȽ�
	    ## type
	        ������ת����ֱ�ӱȽ�
	        ������ת���������Ž��� template��Ȼ���ټ�飿
	    ## value vs. template
	        ��������
	            �����ɹ���ֱ�ӱȽ�
	            �����ɹ���
	                number
	                    min-max.dmin-dmax
	                    min-max.dcount
	                    count.dmin-dmax
	                    count.dcount
	                    +step
	                    ��������
	                    С������
	                boolean 
	                string  
	                    min-max
	                    count
	    ## properties
	        ����
	            �����ɹ��򣺼�����������Ը����������ݹ�
	            �����ɹ��򣺼��ȫ�������Ը����������ݹ�
	    ## items
	        ����
	            �����ɹ���
	                `'name|1': [{}, {} ...]`            ����֮һ�������ݹ�
	                `'name|+1': [{}, {} ...]`           ˳���⣬�����ݹ�
	                `'name|min-max': [{}, {} ...]`      �������������ݹ�
	                `'name|count': [{}, {} ...]`        �������������ݹ�
	            �����ɹ��򣺼��ȫ����Ԫ�ظ����������ݹ�
	*/
	var Diff = {
	    diff: function diff(schema, data, name /* Internal Use Only */ ) {
	        var result = []
 
	        // �ȼ������ name ������ type�����ƥ�䣬���б�Ҫ�������
	        if (
	            this.name(schema, data, name, result) &&
	            this.type(schema, data, name, result)
	        ) {
	            this.value(schema, data, name, result)
	            this.properties(schema, data, name, result)
	            this.items(schema, data, name, result)
	        }
 
	        return result
	    },
	    /* jshint unused:false */
	    name: function(schema, data, name, result) {
	        var length = result.length
 
	        Assert.equal('name', schema.path, name + '', schema.name + '', result)
 
	        return result.length === length
	    },
	    type: function(schema, data, name, result) {
	        var length = result.length
 
	        switch (schema.type) {
	            case 'string':
	                // �������С�ռλ����������ֵ����Ϊ��ռλ��������ֵ�����Ϳ��ܺ�ģ�岻һ�£����� '@int' �᷵��һ������ֵ
	                if (schema.template.match(Constant.RE_PLACEHOLDER)) return true
	                break
	            case 'array':
	                if (schema.rule.parameters) {
	                    // name|count: array
	                    if (schema.rule.min !== undefined && schema.rule.max === undefined) {
	                        // ���� name|1: array����Ϊ����ֵ�����ͣ��ܿ��ܣ��������飬Ҳ��һ���� `array` �е�����һ��
	                        if (schema.rule.count === 1) return true
	                    }
	                    // ���� name|+inc: array
	                    if (schema.rule.parameters[2]) return true
	                }
	                break
	            case 'function':
	                // ���� `'name': function`����Ϊ�������Է����κ����͵�ֵ��
	                return true
	        }
 
	        Assert.equal('type', schema.path, Util.type(data), schema.type, result)
 
	        return result.length === length
	    },
	    value: function(schema, data, name, result) {
	        var length = result.length
 
	        var rule = schema.rule
	        var templateType = schema.type
	        if (templateType === 'object' || templateType === 'array' || templateType === 'function') return true
 
	        // �����ɹ���
	        if (!rule.parameters) {
	            switch (templateType) {
	                case 'regexp':
	                    Assert.match('value', schema.path, data, schema.template, result)
	                    return result.length === length
	                case 'string':
	                    // ͬ���������С�ռλ����������ֵ����Ϊ��ռλ�����ķ���ֵ��ͨ������ģ�岻һ��
	                    if (schema.template.match(Constant.RE_PLACEHOLDER)) return result.length === length
	                    break
	            }
	            Assert.equal('value', schema.path, data, schema.template, result)
	            return result.length === length
	        }
 
	        // �����ɹ���
	        var actualRepeatCount
	        switch (templateType) {
	            case 'number':
	                var parts = (data + '').split('.')
	                parts[0] = +parts[0]
 
	                // ��������
	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('value', schema.path, parts[0], Math.min(rule.min, rule.max), result)
	                        // , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
	                    Assert.lessThanOrEqualTo('value', schema.path, parts[0], Math.max(rule.min, rule.max), result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name)
	                }
 
	                // С������
	                if (rule.decimal) {
	                    // |dmin-dmax
	                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
	                        Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result)
	                        Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result)
	                    }
	                    // |dcount
	                    if (rule.dmin !== undefined && rule.dmax === undefined) {
	                        Assert.equal('value', schema.path, parts[1].length, rule.dmin, result)
	                    }
	                }
 
	                break
 
	            case 'boolean':
	                break
 
	            case 'string':
	                // 'aaa'.match(/a/g)
	                actualRepeatCount = data.match(new RegExp(schema.template, 'g'))
	                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0
 
	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                }
 
	                break
 
	            case 'regexp':
	                actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ''), 'g'))
	                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0
 
	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                }
	                break
	        }
 
	        return result.length === length
	    },
	    properties: function(schema, data, name, result) {
	        var length = result.length
 
	        var rule = schema.rule
	        var keys = Util.keys(data)
	        if (!schema.properties) return
 
	        // �����ɹ���
	        if (!schema.rule.parameters) {
	            Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result)
	        } else {
	            // �����ɹ���
	            // |min-max
	            if (rule.min !== undefined && rule.max !== undefined) {
	                Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, Math.min(rule.min, rule.max), result)
	                Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, Math.max(rule.min, rule.max), result)
	            }
	            // |count
	            if (rule.min !== undefined && rule.max === undefined) {
	                // |1, |>1
	                if (rule.count !== 1) Assert.equal('properties length', schema.path, keys.length, rule.min, result)
	            }
	        }
 
	        if (result.length !== length) return false
 
	        for (var i = 0; i < keys.length; i++) {
	            result.push.apply(
	                result,
	                this.diff(
	                    function() {
	                        var property
	                        Util.each(schema.properties, function(item /*, index*/ ) {
	                            if (item.name === keys[i]) property = item
	                        })
	                        return property || schema.properties[i]
	                    }(),
	                    data[keys[i]],
	                    keys[i]
	                )
	            )
	        }
 
	        return result.length === length
	    },
	    items: function(schema, data, name, result) {
	        var length = result.length
 
	        if (!schema.items) return
 
	        var rule = schema.rule
 
	        // �����ɹ���
	        if (!schema.rule.parameters) {
	            Assert.equal('items length', schema.path, data.length, schema.items.length, result)
	        } else {
	            // �����ɹ���
	            // |min-max
	            if (rule.min !== undefined && rule.max !== undefined) {
	                Assert.greaterThanOrEqualTo('items', schema.path, data.length, (Math.min(rule.min, rule.max) * schema.items.length), result,
	                    '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements')
	                Assert.lessThanOrEqualTo('items', schema.path, data.length, (Math.max(rule.min, rule.max) * schema.items.length), result,
	                    '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements')
	            }
	            // |count
	            if (rule.min !== undefined && rule.max === undefined) {
	                // |1, |>1
	                if (rule.count === 1) return result.length === length
	                else Assert.equal('items length', schema.path, data.length, (rule.min * schema.items.length), result)
	            }
	            // |+inc
	            if (rule.parameters[2]) return result.length === length
	        }
 
	        if (result.length !== length) return false
 
	        for (var i = 0; i < data.length; i++) {
	            result.push.apply(
	                result,
	                this.diff(
	                    schema.items[i % schema.items.length],
	                    data[i],
	                    i % schema.items.length
	                )
	            )
	        }
 
	        return result.length === length
	    }
	}
 
	/*
	    ���ơ��Ѻõ���ʾ��Ϣ
	    
	    Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
	    ·�� ��֤���� ���� 
	    Expect path.name is less than or equal to expected, but path.name is actual.
	    Expect path.name is less than or equal to expected, but path.name is actual.
	    Expect path.name is greater than or equal to expected, but path.name is actual.
	*/
	var Assert = {
	    message: function(item) {
	        return (item.message ||
	                '[{utype}] Expect {path}\'{ltype} {action} {expected}, but is {actual}')
	            .replace('{utype}', item.type.toUpperCase())
	            .replace('{ltype}', item.type.toLowerCase())
	            .replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path)
	            .replace('{action}', item.action)
	            .replace('{expected}', item.expected)
	            .replace('{actual}', item.actual)
	    },
	    equal: function(type, path, actual, expected, result, message) {
	        if (actual === expected) return true
	        switch (type) {
	            case 'type':
	                // ����ģ�� === �ַ�������ֵ
	                if (expected === 'regexp' && actual === 'string') return true
	                break
	        }
 
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    // actual matches expected
	    match: function(type, path, actual, expected, result, message) {
	        if (expected.test(actual)) return true
 
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'matches',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    notEqual: function(type, path, actual, expected, result, message) {
	        if (actual !== expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is not equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    greaterThan: function(type, path, actual, expected, result, message) {
	        if (actual > expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is greater than',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    lessThan: function(type, path, actual, expected, result, message) {
	        if (actual < expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is less to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    greaterThanOrEqualTo: function(type, path, actual, expected, result, message) {
	        if (actual >= expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is greater than or equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    lessThanOrEqualTo: function(type, path, actual, expected, result, message) {
	        if (actual <= expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is less than or equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    }
	}
 
	valid.Diff = Diff
	valid.Assert = Assert
 
	module.exports = valid
 
/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {
 
	module.exports = __webpack_require__(28)
 
/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {
 
	/* global window, document, location, Event, setTimeout */
	/*
	    ## MockXMLHttpRequest
	    �����Ĺ��ܣ�
	    1. �����ظ���ԭ�� XHR ����Ϊ
	    2. ������ģ��ԭ�� XHR ����Ϊ
	    3. �ڷ�������ʱ���Զ�����Ƿ���Ҫ����
	    4. ����������أ���ִ��ԭ�� XHR ����Ϊ
	    5. �����Ҫ���أ���ִ������ XHR ����Ϊ
	    6. ���� XMLHttpRequest �� ActiveXObject
	        new window.XMLHttpRequest()
	        new window.ActiveXObject("Microsoft.XMLHTTP")
	    �ؼ��������߼���
	    * new   ��ʱ���޷�ȷ���Ƿ���Ҫ���أ����Դ���ԭ�� XHR �����Ǳ���ġ�
	    * open  ��ʱ����ȡ�� URL�����Ծ����Ƿ�������ء�
	    * send  ��ʱ�Ѿ�ȷ��������ʽ��
	    �淶��
	    http://xhr.spec.whatwg.org/
	    http://www.w3.org/TR/XMLHttpRequest2/
	    �ο�ʵ�֣�
	    https://github.com/philikon/MockHttpRequest/blob/master/lib/mock.js
	    https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js
	    https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
	    https://github.com/firebug/firebug-lite/blob/master/content/lite/xhr.js
	    https://github.com/thx/RAP/blob/master/lab/rap.plugin.xinglie.js
	    **�費��Ҫȫ����д XMLHttpRequest��**
	        http://xhr.spec.whatwg.org/#interface-xmlhttprequest
	        �ؼ����� readyState��status��statusText��response��responseText��responseXML �� readonly�����ԣ���ͼͨ���޸���Щ״̬����ģ����Ӧ�ǲ����еġ�
	        ��ˣ�Ψһ�İ취��ģ������ XMLHttpRequest������ jQuery ���¼�ģ�͵ķ�װ��
	    // Event handlers
	    onloadstart         loadstart
	    onprogress          progress
	    onabort             abort
	    onerror             error
	    onload              load
	    ontimeout           timeout
	    onloadend           loadend
	    onreadystatechange  readystatechange
	 */
 
	var Util = __webpack_require__(3)
 
	// ����ԭ�� XMLHttpRequest
	window._XMLHttpRequest = window.XMLHttpRequest
	window._ActiveXObject = window.ActiveXObject
 
	/*
	    PhantomJS
	    TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')
	    https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
	    https://github.com/ariya/phantomjs/issues/11289
	*/
	try {
	    new window.Event('custom')
	} catch (exception) {
	    window.Event = function(type, bubbles, cancelable, detail) {
	        var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
	        event.initCustomEvent(type, bubbles, cancelable, detail)
	        return event
	    }
	}
 
	var XHR_STATES = {
	    // The object has been constructed.
	    UNSENT: 0,
	    // The open() method has been successfully invoked.
	    OPENED: 1,
	    // All redirects (if any) have been followed and all HTTP headers of the response have been received.
	    HEADERS_RECEIVED: 2,
	    // The response's body is being received.
	    LOADING: 3,
	    // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
	    DONE: 4
	}
 
	var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ')
	var XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ')
	var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ')
 
	// https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js#L32
	var HTTP_STATUS_CODES = {
	    100: "Continue",
	    101: "Switching Protocols",
	    200: "OK",
	    201: "Created",
	    202: "Accepted",
	    203: "Non-Authoritative Information",
	    204: "No Content",
	    205: "Reset Content",
	    206: "Partial Content",
	    300: "Multiple Choice",
	    301: "Moved Permanently",
	    302: "Found",
	    303: "See Other",
	    304: "Not Modified",
	    305: "Use Proxy",
	    307: "Temporary Redirect",
	    400: "Bad Request",
	    401: "Unauthorized",
	    402: "Payment Required",
	    403: "Forbidden",
	    404: "Not Found",
	    405: "Method Not Allowed",
	    406: "Not Acceptable",
	    407: "Proxy Authentication Required",
	    408: "Request Timeout",
	    409: "Conflict",
	    410: "Gone",
	    411: "Length Required",
	    412: "Precondition Failed",
	    413: "Request Entity Too Large",
	    414: "Request-URI Too Long",
	    415: "Unsupported Media Type",
	    416: "Requested Range Not Satisfiable",
	    417: "Expectation Failed",
	    422: "Unprocessable Entity",
	    500: "Internal Server Error",
	    501: "Not Implemented",
	    502: "Bad Gateway",
	    503: "Service Unavailable",
	    504: "Gateway Timeout",
	    505: "HTTP Version Not Supported"
	}
 
	/*
	    MockXMLHttpRequest
	*/
 
	function MockXMLHttpRequest() {
	    // ��ʼ�� custom �������ڴ洢�Զ�������
	    this.custom = {
	        events: {},
	        requestHeaders: {},
	        responseHeaders: {}
	    }
	}
 
	MockXMLHttpRequest._settings = {
	    timeout: '10-100',
	    /*
	        timeout: 50,
	        timeout: '10-100',
	     */
	}
 
	MockXMLHttpRequest.setup = function(settings) {
	    Util.extend(MockXMLHttpRequest._settings, settings)
	    return MockXMLHttpRequest._settings
	}
 
	Util.extend(MockXMLHttpRequest, XHR_STATES)
	Util.extend(MockXMLHttpRequest.prototype, XHR_STATES)
 
	// ��ǵ�ǰ����Ϊ MockXMLHttpRequest
	MockXMLHttpRequest.prototype.mock = true
 
	// �Ƿ����� Ajax ����
	MockXMLHttpRequest.prototype.match = false
 
	// ��ʼ�� Request ��ص����Ժͷ���
	Util.extend(MockXMLHttpRequest.prototype, {
	    // https://xhr.spec.whatwg.org/#the-open()-method
	    // Sets the request method, request URL, and synchronous flag.
	    open: function(method, url, async, username, password) {
	        var that = this
 
	        Util.extend(this.custom, {
	            method: method,
	            url: url,
	            async: typeof async === 'boolean' ? async : true,
	            username: username,
	            password: password,
	            options: {
	                url: url,
	                type: method
	            }
	        })
 
	        this.custom.timeout = function(timeout) {
	            if (typeof timeout === 'number') return timeout
	            if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10)
	            if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
	                var tmp = timeout.split('-')
	                var min = parseInt(tmp[0], 10)
	                var max = parseInt(tmp[1], 10)
	                return Math.round(Math.random() * (max - min)) + min
	            }
	        }(MockXMLHttpRequest._settings.timeout)
 
	        // �������������ƥ�������ģ��
	        var item = find(this.custom.options)
 
	        function handle(event) {
	            // ͬ������ NativeXMLHttpRequest => MockXMLHttpRequest
	            for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
	                try {
	                    that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
	                } catch (e) {}
	            }
	            // ���� MockXMLHttpRequest �ϵ�ͬ���¼�
	            that.dispatchEvent(new Event(event.type /*, false, false, that*/ ))
	        }
 
	        // ���δ�ҵ�ƥ�������ģ�壬�����ԭ�� XHR ��������
	        if (!item) {
	            // ����ԭ�� XHR ���󣬵���ԭ�� open()����������ԭ���¼�
	            var xhr = createNativeXMLHttpRequest()
	            this.custom.xhr = xhr
 
	            // ��ʼ�������¼������ڼ���ԭ�� XHR ������¼�
	            for (var i = 0; i < XHR_EVENTS.length; i++) {
	                xhr.addEventListener(XHR_EVENTS[i], handle)
	            }
 
	            // xhr.open()
	            if (username) xhr.open(method, url, async, username, password)
	            else xhr.open(method, url, async)
 
	            // ͬ������ MockXMLHttpRequest => NativeXMLHttpRequest
	            for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
	                try {
	                    xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]]
	                } catch (e) {}
	            }
 
	            return
	        }
 
	        // �ҵ���ƥ�������ģ�壬��ʼ���� XHR ����
	        this.match = true
	        this.custom.template = item
	        this.readyState = MockXMLHttpRequest.OPENED
	        this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/ ))
	    },
	    // https://xhr.spec.whatwg.org/#the-setrequestheader()-method
	    // Combines a header in author request headers.
	    setRequestHeader: function(name, value) {
	        // ԭ�� XHR
	        if (!this.match) {
	            this.custom.xhr.setRequestHeader(name, value)
	            return
	        }
 
	        // ���� XHR
	        var requestHeaders = this.custom.requestHeaders
	        if (requestHeaders[name]) requestHeaders[name] += ',' + value
	        else requestHeaders[name] = value
	    },
	    timeout: 0,
	    withCredentials: false,
	    upload: {},
	    // https://xhr.spec.whatwg.org/#the-send()-method
	    // Initiates the request.
	    send: function send(data) {
	        var that = this
	        this.custom.options.body = data
 
	        // ԭ�� XHR
	        if (!this.match) {
	            this.custom.xhr.send(data)
	            return
	        }
 
	        // ���� XHR
 
	        // X-Requested-With header
	        this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest')
 
	        // loadstart The fetch initiates.
	        this.dispatchEvent(new Event('loadstart' /*, false, false, this*/ ))
 
	        if (this.custom.async) setTimeout(done, this.custom.timeout) // �첽
	        else done() // ͬ��
 
	        function done() {
	            that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
	            that.readyState = MockXMLHttpRequest.LOADING
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
 
	            that.status = 200
	            that.statusText = HTTP_STATUS_CODES[200]
 
	            // fix #92 #93 by @qddegtya
	            that.response = that.responseText = JSON.stringify(
	                convert(that.custom.template, that.custom.options),
	                null, 4
	            )
 
	            that.readyState = MockXMLHttpRequest.DONE
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
	            that.dispatchEvent(new Event('load' /*, false, false, that*/ ));
	            that.dispatchEvent(new Event('loadend' /*, false, false, that*/ ));
	        }
	    },
	    // https://xhr.spec.whatwg.org/#the-abort()-method
	    // Cancels any network activity.
	    abort: function abort() {
	        // ԭ�� XHR
	        if (!this.match) {
	            this.custom.xhr.abort()
	            return
	        }
 
	        // ���� XHR
	        this.readyState = MockXMLHttpRequest.UNSENT
	        this.dispatchEvent(new Event('abort', false, false, this))
	        this.dispatchEvent(new Event('error', false, false, this))
	    }
	})
 
	// ��ʼ�� Response ��ص����Ժͷ���
	Util.extend(MockXMLHttpRequest.prototype, {
	    responseURL: '',
	    status: MockXMLHttpRequest.UNSENT,
	    statusText: '',
	    // https://xhr.spec.whatwg.org/#the-getresponseheader()-method
	    getResponseHeader: function(name) {
	        // ԭ�� XHR
	        if (!this.match) {
	            return this.custom.xhr.getResponseHeader(name)
	        }
 
	        // ���� XHR
	        return this.custom.responseHeaders[name.toLowerCase()]
	    },
	    // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
	    // http://www.utf8-chartable.de/
	    getAllResponseHeaders: function() {
	        // ԭ�� XHR
	        if (!this.match) {
	            return this.custom.xhr.getAllResponseHeaders()
	        }
 
	        // ���� XHR
	        var responseHeaders = this.custom.responseHeaders
	        var headers = ''
	        for (var h in responseHeaders) {
	            if (!responseHeaders.hasOwnProperty(h)) continue
	            headers += h + ': ' + responseHeaders[h] + '\r\n'
	        }
	        return headers
	    },
	    overrideMimeType: function( /*mime*/ ) {},
	    responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
	    response: null,
	    responseText: '',
	    responseXML: null
	})
 
	// EventTarget
	Util.extend(MockXMLHttpRequest.prototype, {
	    addEventListener: function addEventListener(type, handle) {
	        var events = this.custom.events
	        if (!events[type]) events[type] = []
	        events[type].push(handle)
	    },
	    removeEventListener: function removeEventListener(type, handle) {
	        var handles = this.custom.events[type] || []
	        for (var i = 0; i < handles.length; i++) {
	            if (handles[i] === handle) {
	                handles.splice(i--, 1)
	            }
	        }
	    },
	    dispatchEvent: function dispatchEvent(event) {
	        var handles = this.custom.events[event.type] || []
	        for (var i = 0; i < handles.length; i++) {
	            handles[i].call(this, event)
	        }
 
	        var ontype = 'on' + event.type
	        if (this[ontype]) this[ontype](event)
	    }
	})
 
	// Inspired by jQuery
	function createNativeXMLHttpRequest() {
	    var isLocal = function() {
	        var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
	        var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
	        var ajaxLocation = location.href
	        var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
	        return rlocalProtocol.test(ajaxLocParts[1])
	    }()
 
	    return window.ActiveXObject ?
	        (!isLocal && createStandardXHR() || createActiveXHR()) : createStandardXHR()
 
	    function createStandardXHR() {
	        try {
	            return new window._XMLHttpRequest();
	        } catch (e) {}
	    }
 
	    function createActiveXHR() {
	        try {
	            return new window._ActiveXObject("Microsoft.XMLHTTP");
	        } catch (e) {}
	    }
	}
 
 
	// �������������ƥ�������ģ�壺URL��Type
	function find(options) {
 
	    for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
	        var item = MockXMLHttpRequest.Mock._mocked[sUrlType]
	        if (
	            (!item.rurl || match(item.rurl, options.url)) &&
	            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
	        ) {
	            // console.log('[mock]', options.url, '>', item.rurl)
	            return item
	        }
	    }
 
	    function match(expected, actual) {
	        if (Util.type(expected) === 'string') {
	            return expected === actual
	        }
	        if (Util.type(expected) === 'regexp') {
	            return expected.test(actual)
	        }
	    }
 
	}
 
	// ����ģ�� ��> ��Ӧ����
	function convert(item, options) {
	    return Util.isFunction(item.template) ?
	        item.template(options) : MockXMLHttpRequest.Mock.mock(item.template)
	}
 
	module.exports = MockXMLHttpRequest
 
/***/ }
/******/ ])
});
;
