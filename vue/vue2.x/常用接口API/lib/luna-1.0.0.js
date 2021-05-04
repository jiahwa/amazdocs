/*!
* [Sat Apr 28 2018 09:14:29 GMT+0800 (CST)]
*/
/*!
 * Luna.js - A JavaScript library to facilitate more friendly browser side operations.
 * https://github.com/yelloxing/Luna.js
 * 
 * author yelloxing 心叶
 * 
 * version v1.0.0
 * 
 * build 2018/02/01
 *
 * Copyright yelloxing
 * Released under the MIT license
 * 
 ******************************************************************
 * 
 *第一段：Luna构造函数
 *
 *Luna本身就提供了一系列方法，除此之外你还可以创建一个Luna对象，调用对象身上的方法，二者是不同的；Luna本身的方法很容易理解，直接查看API就清楚了，下面来主要说说Luna对象相关问题。
 *
 *创建Luna对象的方法推荐使用var lunaObj=Luna(param1[,param2])的方式，具体的参数说明如下：
 *1.传递一个函数：比如这样Luna(function(){console.log('这是传递的函数')})，可以保证函数在页面加载完毕的时候执行；
 *2.传递DOM结点或Luna对象：返回的是Luna对象，传递进去的结点信息会被返回的Luna对象保存，后续调用Luna对象的方法会直接应用到上面去；
 *3.传递进去的是HTML字符串：这段字符串会被转成结点，并保存在返回的Luna对象中；
 *4.传递的字符串是CSS选择器：会参考第二段列出的支持的选择器来查找DOM结点并保存在返回的Luna对象中。
 *
 *
 *第二段：CSS选择器
 *
 *提供类似CSS选择器的方法来查找结点的目的是方便操作，具体可以使用的包括下面三类：
 *第一类：class选择器、ID选择器、属性选择器和元素选择器。
 *第二类：第一类选择器的任意组合。
 *第三类：在前面二类中可以增加这四种结点关系选择器：'>',"空","~","+"。
 *
 *
 *第三段：扩展Luna
 *
 *有时候默认提供的方法不足以满足日常开发的时候，可以通过下面的方法来扩展Luna和Luna对象的方法，具体如下：
 *扩展Luna方法：Luna.extend({"funName":function(){}})
 *扩展Luna对象方法：Luna.prototype.extend({"funName":function(){}})
 *
 *
 *第四段：重要方法
 *
 *如果之前有$$或者Luna对象，现在被本库覆盖了，可以调用Luna上面的noConflict方法来恢复，传递一个boolean，如果是true表示也恢复Luna，否则只恢复$$。
 */
(function (global, factory, undefined) {
    'use strict';

    if (global && global.document) {
        factory(global);
    } else if (typeof module === "object" && typeof module.exports === "object") {
        throw new Error("Node.js is not supported!");
    } else {
        throw new Error("Unexcepted Error!");
    }

})(typeof window !== "undefined" ? window : this, function (window, undefined) {
    'use strict';

    var Luna = function (selector, context) {
        return new Luna.prototype.init(selector, context);
    };

    /**
     *
     * @param selector [string,function,dom,Luna Object] 选择器
     * @param context [dom,Luna Object] 查找上下文，默认document
     *
     * @return Luna Object
     *
     * {
     *  [],//查找的结果保存在数组中
     *  context,//查找时使用的上下文
     *  length,//查找回来的个数
     *  isTouch//返回是否是已经查找过的结点
     *  selector//选择器
     * }
     *
     */
    Luna.prototype.init = function (selector, context, root) {

        //准备工作
        if (typeof selector === 'string') {
            selector = (selector + "").trim();
        }

        var flag;
        this.length = 0;
        root = root || rootLuna;

        if (!context) {
            context = document;
        } else {
            context = Luna(context)[0];
        }

        //选择器: $$(""), $$(null), $$(undefined), $$(false)，兼容一下
        if (!selector) {
            return this;
        } else {
            this.selector = selector;
        }

        //body比较特殊，直接提出来
        if (selector == "body") {
            this.context = document;
            this[0] = document.body;
            this.isTouch = true;
            this.length = 1;
            return this;
        }
        //document比较特殊，直接提出来
        if (selector == "document") {
            this.context = null;
            this[0] = document;
            this.isTouch = true;
            this.length = 1;
            return this;
        }

        //如果是字符串
        if (typeof selector === 'string') {
            if (/^</.test((selector + "").trim())) {
                //如果是html文档
                if (!context) {
                    throw new Error("Parameter error!");
                }
                var frameDiv;
                switch (Luna._code_environment_) {
                    case 'HTML':
                        {
                            frameDiv = document.createElement("div");
                            break;
                        }
                    case 'SVG':
                        {
                            frameDiv = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
                            break;
                        }
                    default:
                        {
                            frameDiv = document.createElement("div");
                        }
                }
                frameDiv.innerHTML = selector;
                this[0] = frameDiv.childNodes[0];
                this.isTouch = true;
                this.length = 1;
                this.context = undefined;
                return this;
            } else {
                //去掉：换行，换页，回车
                selector = (selector + "").trim().replace(/[\n\f\r]/g, '');
                //内置小型sizzle选择器
                if (!Luna.sizzle) {
                    throw new Error("Sizzle is necessary for Luna!");
                }
                var nodes = Luna.sizzle(selector, context);
                flag = 0;
                var _flag_ = 0;
                for (; flag < nodes.length; flag++) {
                    if (nodes[flag]) {
                        this[_flag_] = nodes[flag];
                        _flag_++;
                    }
                }
                this.length = _flag_;
                this.isTouch = true;
                this.context = context;
                return this;
            }
        }
        //如果是DOM节点
        if (selector.nodeType === 1 || selector.nodeType === 11 || selector.nodeType === 9) {
            this.context = context;
            this[0] = selector;
            this.isTouch = true;
            this.length = 1;
            return this;
        }

        //如果是function
        if (typeof selector === 'function') {
            if (Luna.__isLoad__) {
                selector();
            } else {
                if (document.addEventListener) {
                    //Mozilla, Opera and webkit
                    document.addEventListener("DOMContentLoaded", function doListenter() {
                        document.removeEventListener("DOMContentLoaded", doListenter, false);
                        selector();
                        Luna.__isLoad__ = true;
                    });

                } else if (document.attachEvent) {
                    //IE
                    document.attachEvent("onreadystatechange", function doListenter() {
                        if (document.readyState === "complete") {
                            document.detachEvent("onreadystatechange", doListenter);
                            selector();
                            Luna.__isLoad__ = true;
                        }
                    });

                }
            }
            return this;
        }

        //如果是Luna对象
        if (selector.isTouch) {
            this.isTouch = true;
            flag = 0;
            for (; flag < selector.length; flag++) {
                this[flag] = selector[flag];
            }
            this.context = selector.context || context;
            this.length = selector.length;
            this.selector = selector.selector;
            return this;
        }

        return this;
    };


    var rootLuna = Luna(document);

    Luna.prototype.extend = Luna.extend = function () {

        var target = arguments[0] || {};
        var source = arguments[1] || {};
        var length = arguments.length;

        /*
         * 确定复制目标和源
         */
        if (length === 1) {
            //如果只有一个参数，目标对象是自己
            source = target;
            target = this;
        }
        if (typeof target !== "object" && typeof target !== 'function') {
            //如果目标不是对象或函数，则初始化为空对象
            target = {};
        }

        /*
         * 复制属性到对象上面
         */
        for (var key in source) {
            try {
                target[key] = source[key];
            } catch (e) {
                throw new Error("Illegal property value！");
            }
        }

        return target;
    };

    Luna.prototype.init.prototype = Luna.prototype;

    Luna.__isLoad__ = false;

    /*动画相关全局定义*/
    Luna.clock = {
        //当前正在运动的动画的tick函数堆栈
        timers: [],
        //唯一定时器的定时间隔
        interval: 13,
        //指定了动画时长duration默认值
        speeds: 400,
        //定时器ID
        timerId: null
    };

    /*sizzle特殊使用 */
    Luna._sizzle_ = {};

    /*SVG配置使用 */
    Luna._SVG_config_ = {};

    // 代码环境【默认HTML】
    Luna._code_environment_ = 'HTML';

    /* 恢复旧的Luna(可以通过参数来控制是否恢复)和$$ */
    var _Luna = window.Luna,
        _$$ = window.$$;
    Luna.noConflict = function (flag) {
        if (window.$$ === Luna) {
            window.$$ = _$$;
        }
        if (flag && window.Luna === Luna) {
            window.Luna = _Luna;
        }
        return Luna;
    };

    // 一些项目信息
    Luna.author = 'yelloxing';
    Luna.description = 'A JavaScript library to facilitate more friendly browser side operations';
    Luna.build = '2018/02/01 NanJin';

    Luna.version = 'v1.0.0';

    window.Luna = window.$$ = Luna;

    return Luna;

});
/*!======= event.base.js =======*/
(function(window, Luna, undefined) {
    'use strict';

    Luna.prototype.extend({

        /*添加绑定事件*/
        "bind": function(eventType, callback, useCapture) {
            var $$this = Luna(this),
                flag;
            if (window.attachEvent) {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].attachEvent("on" + eventType, callback);
                }

            } else {
                //默认捕获
                useCapture = useCapture || false;
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].addEventListener(eventType, callback, useCapture);
                }
            }
            return $$this;
        },

        /*解除绑定事件*/
        "unbind": function(eventType, callback, useCapture) {
            var $$this = Luna(this),
                flag;
            if (window.detachEvent) {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].detachEvent("on" + eventType, callback);
                }
            } else {
                //默认捕获
                useCapture = useCapture || false;
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].removeEventListener(eventType, callback, useCapture);
                }
            }
            return $$this;
        },

        /* 在特定元素上面触发特定事件*/
        "trigger": function(eventType, useCapture) {
            var $$this = Luna(this),
                event, flag;
            useCapture = useCapture || false;
            //创建event的对象实例。
            if (document.createEventObject) {
                // IE浏览器支持fireEvent方法
                event = document.createEventObject();
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].fireEvent('on' + eventType, event);
                }
            } else {
                // 其他标准浏览器使用dispatchEvent方法
                event = document.createEvent('HTMLEvents');
                // 3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为
                event.initEvent(eventType, !useCapture, false);
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].dispatchEvent(event);
                }
            }
        },
        /*让元素获取焦点*/
        "focus": function() {
            var $$this = Luna(this);
            if ($$this.length > 0) {
                $$this[0].focus();
            }
            return $$this;
        },
        /*判断元素是否获取焦点*/
        "isFocus": function() {
            var $$this = Luna(this);
            return (!document.hasFocus || document.hasFocus()) && $$this.length > 0 && document.activeElement === $$this[0] && !!($$this[0].type || $$this[0].href || ~$$this[0].tabIndex);
        }
    });

    Luna.extend({
        /* 取消冒泡事件 */
        "cancelBubble": function(event) {
            var $$this = Luna(this);
            event = event || window.event;
            if (event && event.stopPropagation) { //这是其他非IE浏览器
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            return $$this;
        },

        /* 阻止默认事件 */
        "preventDefault": function(event) {
            var $$this = Luna(this);
            event = event || window.event;
            if (event && event.stopPropagation) { //这是其他非IE浏览器
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
            return $$this;
        }
    });
})(window, window.Luna);
/*!======= dom.search.js =======*/
(function(window, Luna, undefined) {
    'use strict';

    Luna.prototype.extend({
        /**
         * 返回全部被选元素的直接父元素
         */
        "parent": function() {
            var $$this = Luna(this),
                flag, num = 0,
                parent;
            for (flag = 0; flag < $$this.length; flag++) {
                if (!!$$this[flag]) {
                    parent = $$this[flag].parentNode;
                }
                while (parent && parent.nodeType !== 1 && parent.nodeType !== 11 && parent.nodeType !== 9 && parent.parentNode) {
                    parent = parent.parentNode;
                }
                if (parent && (parent.nodeType === 1 || parent.nodeType === 11 || parent.nodeType === 9)) {
                    $$this[num] = parent;
                    num++;
                }
            }
            for (flag = num; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = num;
            $$this.selector = $$this.selector + ":parent()";
            return $$this;
        },

        /**
         * 返回被选元素的所有祖先元素（不包括祖先的兄弟）
         * selector只支持二类选择器
         */
        "parents": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag,
                parent = $$this[0],
                tempResult = [];
            while (parent && parent.parentNode) {
                parent = parent.parentNode;
                if (parent.nodeType === 1 || parent.nodeType === 11 || parent.nodeType === 9) {
                    tempResult.push(parent);
                }
            }
            tempResult = Luna._sizzle_.filter(tempResult, selector);
            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":parents('" + selector + "')";
            return $$this;
        },

        /**
         * 返回被选元素的所有直接子元素
         * selector只支持二类选择器
         */
        "children": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag,
                child = $$this[0],
                tempResult = [];
            if (!child) {
                tempResult = [];
            } else {
                child = child.childNodes;
                for (flag = 0; flag < child.length; flag++) {
                    if (child[flag].nodeType === 1 || child[flag].nodeType === 11 || child[flag].nodeType === 9) {
                        tempResult.push(child[flag]);
                    }
                }
                tempResult = Luna._sizzle_.filter(tempResult, selector);
            }

            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":children('" + selector + "')";
            return $$this;
        },

        /**
         * 返回被选元素的所有同胞元素，包括自己
         * selector只支持二类选择器
         */
        "siblings": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag,
                sibling = $$this[0],
                tempResult = [];
            if (!sibling) {
                tempResult = [];
            } else {
                sibling = sibling.parentNode;
                while (sibling && sibling.nodeType !== 1 && sibling.nodeType !== 11 && sibling.nodeType !== 9 && sibling.parentNode) {
                    sibling = sibling.parentNode;
                }
                if (!sibling) {
                    tempResult = [];
                } else {
                    sibling = sibling.childNodes;
                    for (flag = 0; flag < sibling.length; flag++) {
                        if (sibling[flag].nodeType === 1 || sibling[flag].nodeType === 11 || sibling[flag].nodeType === 9) {
                            tempResult.push(sibling[flag]);
                        }
                    }
                    tempResult = Luna._sizzle_.filter(tempResult, selector);
                }

            }

            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":siblings('" + selector + "')";
            return $$this;
        },

        /**
         * 返回全部被选元素的下一个同胞元素
         */
        "next": function() {
            var $$this = Luna(this),
                flag, num = 0,
                next;
            for (flag = 0; flag < $$this.length; flag++) {
                if (!!$$this[flag]) {
                    next = $$this[flag].nextSibling;
                }
                while (next && next.nodeType !== 1 && next.nodeType !== 11 && next.nodeType !== 9 && next.nextSibling) {
                    next = next.nextSibling;
                }
                if (next && (next.nodeType === 1 || next.nodeType === 11 || next.nodeType === 9)) {
                    $$this[num] = next;
                    num++;
                }
            }
            for (flag = num; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = num;
            $$this.selector = $$this.selector + ":next()";
            return $$this;
        },

        /**
         * 返回被选元素的所有跟随的同胞元素
         * selector只支持二类选择器
         */
        "nextAll": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag,
                next = $$this[0],
                tempResult = [];
            while (next && next.nextSibling) {
                next = next.nextSibling;
                if (next.nodeType === 1 || next.nodeType === 11 || next.nodeType === 9) {
                    tempResult.push(next);
                }
            }
            tempResult = Luna._sizzle_.filter(tempResult, selector);
            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":nextAll('" + selector + "')";
            return $$this;
        },

        /**
         * 返回全部被选元素的前一个同胞元素
         */
        "prev": function() {
            var $$this = Luna(this),
                flag, num = 0,
                prev;
            for (flag = 0; flag < $$this.length; flag++) {
                if (!!$$this[flag]) {
                    prev = $$this[flag].previousSibling;
                }
                while (prev && prev.nodeType !== 1 && prev.nodeType !== 11 && prev.nodeType !== 9 && prev.previousSibling) {
                    prev = prev.previousSibling;
                }
                if (prev && (prev.nodeType === 1 || prev.nodeType === 11 || prev.nodeType === 9)) {
                    $$this[num] = prev;
                    num++;
                }
            }
            for (flag = num; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = num;
            $$this.selector = $$this.selector + ":prev()";
            return $$this;
        },

        /**
         * 返回被选元素的所有之前的同胞元素
         * selector只支持二类选择器
         */
        "prevAll": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag,
                prev = $$this[0],
                tempResult = [];
            while (prev && prev.previousSibling) {
                prev = prev.previousSibling;
                if (prev.nodeType === 1 || prev.nodeType === 11 || prev.nodeType === 9) {
                    tempResult.push(prev);
                }
            }
            tempResult = Luna._sizzle_.filter(tempResult, selector);
            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":prevAll('" + selector + "')";
            return $$this;
        },
        /**
         * 根据选择器过滤已经选择的节点
         * selector只支持二类选择器
         */
        "filter": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag, tempResult = [];
            for (flag = 0; flag < $$this.length; flag++) {
                tempResult.push($$this[flag]);
            }
            tempResult = Luna._sizzle_.filter(tempResult, selector);
            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":filter('" + selector + "')";
            return $$this;
        },
        /**
         * 返回第一个被选元素的满足条件的元素
         * selector只支持二类选择器
         */
        "find": function(selector) {
            selector = selector || '';
            var $$this = Luna(this),
                flag,
                tempResult;
            if ($$this.length <= 0) {
                tempResult = [];
            } else {
                tempResult = Luna.sizzle(selector, $$this[0]);
            }
            for (flag = tempResult.length; flag < $$this.length; flag++) {
                delete $$this[flag];
            }
            $$this.length = tempResult.length;
            for (flag = 0; flag < tempResult.length; flag++) {
                $$this[flag] = tempResult[flag];
            }
            $$this.selector = $$this.selector + ":find('" + selector + "')";
            return $$this;
        }
    });
})(window, window.Luna);
/*!======= dom.modify.js =======*/
(function(window, Luna, undefined) {
    'use strict';

    Luna.prototype.extend({

        /**
         * 设置或获取内部html
         */
        "html": function(template) {
            var $$this = Luna(this);
            if ('' != template && !template) {
                return $$this[0].innerHTML;
            } else {
                var flag = 0;
                for (; flag < $$this.length; flag++) {
                    $$this[flag].innerHTML = template;
                }
                return $$this;
            }
        },

        /**
         * 设置或返回所选元素的文本内容
         */
        "text": function(val) {
            var $$this = Luna(this);
            if (!val) {
                return $$this[0].innerText;
            } else {
                var flag = 0;
                for (; flag < $$this.length; flag++) {
                    $$this[0].innerText = val;
                }
                return $$this;
            }
        },

        /**
         * 设置或返回表单字段的值
         */
        "val": function(val) {
            var $$this = Luna(this);
            if (!val) {
                return $$this[0].value;
            } else {
                var flag = 0;
                for (; flag < $$this.length; flag++) {
                    $$this[0].value = val;
                }
                return $$this;
            }
        },

        /**
         * 用于设置/改变属性值
         */
        "attr": function(attr, val) {
            var $$this = Luna(this);
            if (!val) {
                return $$this[0].getAttribute(attr);
            } else {
                var flag = 0;
                for (; flag < $$this.length; flag++) {
                    if (Luna._code_environment_ == 'SVG' && Luna._SVG_config_.xlink[attr]) {
                        $$this[flag].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:' + attr, val);
                    } else {
                        $$this[flag].setAttribute(attr, val);
                    }
                }
                return $$this;
            }
        },

        /**
         * 判断是否存在指定的class
         */
        "hasClass": function(val) {
            var $$this = Luna(this[0]);
            if (typeof val === "string" && val) {
                if ((" " + $$this.class() + " ").search(" " + val + " ") >= 0) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 向被选元素添加一个或多个类
         */
        "addClass": function(val) {
            var $$this = Luna(this);
            var node;
            var curClass;
            if (typeof val === "string" && val) {
                var i = 0;
                node = $$this[i++];
                while (node) {
                    curClass = node.getAttribute('class') || '';
                    var uniqueClass = Luna.uniqueClass(curClass, val);
                    node.setAttribute('class', uniqueClass);
                    node = $$this[i++];
                }
            }
            return $$this;
        },

        /**
         * 从被选元素删除一个或多个类
         */
        "removeClass": function(val) {
            var $$this = Luna(this);
            var node;
            var curClass;
            if (typeof val === "string" && val) {
                var i = 0;
                node = $$this[i++];
                while (node) {
                    curClass = node.getAttribute('class') || '';
                    var resultClass = Luna.operateClass(curClass, val, true);
                    node.setAttribute('class', resultClass);
                    node = $$this[i++];
                }
            }
            return $$this;
        },

        /**
         * 对被选元素进行添加/删除类的切换操作
         */
        "toggleClass": function(val) {
            var $$this = Luna(this);
            var node;
            var curClass;
            if (typeof val === "string" && val) {
                var i = 0;
                node = $$this[i++];
                while (node) {
                    curClass = node.getAttribute('class') || '';
                    var resultClass = Luna.operateClass(curClass, val);
                    node.setAttribute('class', resultClass);
                    node = $$this[i++];
                }
            }
            return $$this;
        },

        /**
         * 设置或获取class
         */
        "class": function(val) {
            var $$this = Luna(this);
            var node;
            if (typeof val === "string" && val) {
                var i = 0;
                node = $$this[i++];
                while (node) {
                    node.setAttribute('class', Luna.uniqueClass(val));
                    node = $$this[i++];
                }
            } else {
                return $$this[0].getAttribute('class') || '';
            }
            return $$this;
        },

        /**
         * 设置或返回被选元素的一个样式属性
         */
        "css": function(name, style) {
            var $$this = Luna(this),
                flag;
            if (typeof name === 'string' && arguments.length === 1) {
                return Luna.styles($$this[0], name);
            }
            if (typeof name === 'string' && typeof style === 'string') {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].style[name] = style;
                }
            } else if (typeof name === 'object') {
                for (var key in name) {
                    for (flag = 0; flag < $$this.length; flag++) {
                        $$this[flag].style[key] = name[key];
                    }
                }
            } else {
                return Luna.styles($$this[0]);
            }
            return $$this;
        },

        /**
         * 在被选元素内部的结尾插入内容
         */
        "append": function(node) {
            var $$this = Luna(this),
                flag;
            if (node.nodeType === 1 || node.nodeType === 11 || node.nodeType === 9) {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].appendChild(node);
                }
            } else if (node.isTouch) {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].appendChild(node[0]);
                }
            } else if (typeof node == 'string') {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].appendChild(Luna(node)[0]);
                }
            } else {
                throw new Error("Not acceptable type!");
            }
            return $$this;
        },

        /**
         * 在被选元素内部的开头插入内容
         */
        "prepend": function(node) {
            var $$this = Luna(this),
                flag;
            if (node.nodeType === 1 || node.nodeType === 11 || node.nodeType === 9) {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].insertBefore(node, $$this[0].childNodes[0]);
                }
            } else if (node.isTouch) {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].insertBefore(node[0], $$this[0].childNodes[0]);
                }
            } else if (typeof node == 'string') {
                for (flag = 0; flag < $$this.length; flag++) {
                    $$this[flag].insertBefore(Luna(node)[0], $$this[0].childNodes[0]);
                }
            } else {
                throw new Error("Not acceptable type!");
            }
            return $$this;
        },

        /**
         * 在被选元素之后插入内容
         */
        "after": function(node) {
            var $$this = Luna(this),
                flag, $$parent;
            for (flag = 0; flag < $$this.length; flag++) {
                $$parent = $$this[flag].parentNode || Luna('body')[0];
                if (node.nodeType === 1 || node.nodeType === 11 || node.nodeType === 9) {
                    $$parent.insertBefore(node, $$this[flag].nextSibling); //如果第二个参数undefined,在结尾追加，目的一样达到
                } else if (node.isTouch) {
                    $$parent.insertBefore(node[0], $$this[flag].nextSibling);
                } else if (typeof node == 'string') {
                    $$parent.insertBefore(Luna(node)[0], $$this[flag].nextSibling);
                } else {
                    throw new Error("Not acceptable type!");
                }
            }
            return $$this;
        },

        /**
         * 在被选元素之前插入内容
         */
        "before": function(node) {
            var $$this = Luna(this),
                $$parent, flag;
            for (flag = 0; flag < $$this.length; flag++) {
                $$parent = $$this[flag].parentNode || Luna('body')[0];
                if (node.nodeType === 1 || node.nodeType === 11 || node.nodeType === 9) {
                    $$parent.insertBefore(node, $$this[flag]);
                } else if (node.isTouch) {
                    $$parent.insertBefore(node[0], $$this[flag]);
                } else if (typeof node == 'string') {
                    $$parent.insertBefore(Luna(node)[0], $$this[flag]);
                } else {
                    throw new Error("Not acceptable type!");
                }
            }
            return $$this;
        },

        /**
         * 删除被选元素（及其子元素）
         */
        "remove": function() {
            var $$this = Luna(this),
                flag, $$parent;
            for (flag = 0; flag < $$this.length; flag++) {
                $$parent = Luna($$this[flag]).parent();
                $$parent[0].removeChild($$this[flag]);
            }
            return $$this;
        },

        /**
         * 从被选元素中删除子元素
         */
        "empty": function() {
            var $$this = Luna(this),
                flag;
            for (flag = 0; flag < $$this.length; flag++) {
                Luna($$this[flag]).html('');
            }
            return $$this;
        },
        /**
         * 进入全屏
         */
        "launchFullScreen": function() {
            var $$this = Luna(this);
            if ($$this[0] && $$this[0].requestFullScreen) {
                $$this[0].requestFullScreen();
            } else if ($$this[0] && $$this[0].mozRequestFullScreen) {
                $$this[0].mozRequestFullScreen();
            } else if ($$this[0] && $$this[0].webkitRequestFullScreen) {
                $$this[0].webkitRequestFullScreen();
            }
            return $$this;
        }
    });

})(window, window.Luna);
/*!======= dom.calc.js =======*/
(function (window, Luna, undefined) {
    'use strict';

    Luna.prototype.extend({

        /**
         * 获取元素大小
         */
        "size": function (type) {
            var $$this = Luna(this);
            var elemHeight, elemWidth;
            if (type == 'content') { //内容
                elemWidth = $$this[0].clientWidth - (($$this.css('padding-left') + "").replace('px', '')) - (($$this.css('padding-right') + "").replace('px', ''));
                elemHeight = $$this[0].clientHeight - (($$this.css('padding-top') + "").replace('px', '')) - (($$this.css('padding-bottom') + "").replace('px', ''));
            } else if (type == 'padding') { //内容+内边距
                elemWidth = $$this[0].clientWidth;
                elemHeight = $$this[0].clientHeight;
            } else if (type == 'border') { //内容+内边距+边框
                elemWidth = $$this[0].offsetWidth;
                elemHeight = $$this[0].offsetHeight;
            } else if (type == 'scroll') { //滚动的宽（不包括border）
                elemWidth = $$this[0].scrollWidth;
                elemHeight = $$this[0].scrollHeight;
            } else {
                elemWidth = $$this[0].offsetWidth;
                elemHeight = $$this[0].offsetHeight;
            }
            return {
                width: elemWidth,
                height: elemHeight
            };
        }
    });
})(window, window.Luna);
/*!======= sizzle.tool.js =======*/
(function (window, Luna, undefined) {
    'use strict';

    Luna.extend(Luna._sizzle_, {
        "notLayer": function (selector) {
            // 判断是否是关系选择器，只可以确定不是关系选择器
            if (/[> ~+]/.test(selector)) {
                return false;
            } else {
                return true;
            }
        },
        "notComplex": function (selector) {
            // 判断是否是复合的单选择器，只可以确定不是复合的单选择器
            if (!Luna._sizzle_.notLayer(selector)) {
                return true; //如果可能是关系选择器又认为它不是复合的单选择器
            } else {
                if (!/[#.[]/.test(selector)) { //如果只是元素选择器，一定不是复合的单选择器
                    return true;
                } else if (!/^[#.[]/.test(selector)) { //如果不只是元素选择器，而且元素选择器开头，就一定不是复合的单选择器
                    return false;
                }
                //去掉开头的非元素选择器标志
                selector = selector.replace(/^[#.[]/, '');
                if (/[#.[]/.test(selector)) { //如果不只是元素选择器，一定是复合的单选择器
                    return false;
                } else {
                    return true;
                }
            }
        },
        "isSingle": function (selector) {
            //判断是不是最单纯的选择器
            if (Luna._sizzle_.notLayer(selector) && Luna._sizzle_.notComplex(selector)) {
                return true;
            } else {
                return false;
            }
        },
        "isID": function (selector) {
            // #id 前置条件：已经知道是最单纯的选择器
            if (/^#/.test(selector)) {
                return true;
            } else {
                return false;
            }
        },
        "isClass": function (selector) {
            // .class 前置条件：已经知道是最单纯的选择器
            if (/^\./.test(selector)) {
                return true;
            } else {
                return false;
            }
        },
        "isElemment": function (selector) {
            // element 前置条件：已经知道是最单纯的选择器
            if (!/^[#.[]/.test(selector)) {
                return true;
            } else {
                return false;
            }
        },
        "isAttr": function (selector) {
            //[attr="val"] 前置条件：已经知道是最单纯的选择器
            if (/^\[([^=]+)(=(["'])([^=]+)\2){0,1}\]$/.test(selector)) {
                return true;
            } else {
                return false;
            }
        },
        "isValidComplex": function (selector) {
            //判断是不是合法的第二类选择器 前置条件：已经知道只可能是第二类选择器或者非法
            selector = selector.replace(/^[^#.[]+/, ''); //去掉开头的标签选择器
            selector = selector.replace(/\[([^=]+)(=(["'])([^=]+)\2){0,1}\]/g, ''); //去掉合法的属性选择器
            selector = selector.replace(/#[^#.[]+/g, ''); //去掉id选择器
            selector = selector.replace(/\.[^#.[]+/g, ''); //去掉class选择器
            if (selector != "") { //如果此时还存在，一定是非法的
                return false;
            } else {
                return true;
            }
        },
        "toComplexSelectorObject": function (selector) {
            //前置条件：已经知道确定是第二类选择器
            var selectorObj = {},
                flag;
            var currentSelector = selector.match(/^[^#.[]+/); //标签
            if (!!currentSelector && currentSelector.length > 0) {
                selectorObj._elem_ = currentSelector[0];
            }
            currentSelector = selector.match(/\[([^=]+)(=(["'])([^=]+)\2){0,1}\]/g); //属性选择器
            if (!!currentSelector && currentSelector.length > 0) {
                selectorObj._attr_ = [];
                for (flag = 0; flag < currentSelector.length; flag++) {
                    selectorObj._attr_.push(currentSelector[flag]);
                }
            }
            currentSelector = selector.match(/#[^#.[]+/g); //id选择器
            if (!!currentSelector && currentSelector.length > 0) {
                selectorObj._id_ = (currentSelector[0]).replace(/^#/, "");
            }
            currentSelector = selector.match(/\.[^#.[]+/g); //class选择器
            if (!!currentSelector && currentSelector.length > 0) {
                selectorObj._class_ = [];
                for (flag = 0; flag < currentSelector.length; flag++) {
                    selectorObj._class_.push(currentSelector[flag].replace(/^\./, ""));
                }
            }
            return selectorObj;
        },
        "checkedElems": function (needCheckResultArray, selectorObj) {
            //id选择器不用匹配了，如果有一定会用，不用就是错误
            var flag, resultData = [],
                innerFlag, tempClass, selector_exec,
                isAccept;
            for (flag = 0; flag < needCheckResultArray.length; flag++) {
                isAccept = true;
                if (!!selectorObj._elem_ && isAccept) { //1.检测元素类型
                    if (needCheckResultArray[flag].tagName != (selectorObj._elem_ + "").toUpperCase() && needCheckResultArray[flag].tagName != (selectorObj._elem_ + "").toLowerCase()) {
                        isAccept = false;
                    }
                }
                if (!!selectorObj._class_ && selectorObj._class_.length > 0 && isAccept) { //2.检测class
                    if (!needCheckResultArray[flag].getAttribute) {
                        isAccept = false;
                    } else {
                        tempClass = needCheckResultArray[flag].getAttribute('class') || '';
                        tempClass = " " + tempClass + " ";
                    }
                    for (innerFlag = 0; innerFlag < selectorObj._class_.length && isAccept; innerFlag++) {
                        if (tempClass.search(" " + selectorObj._class_[innerFlag] + " ") < 0) {
                            isAccept = false;
                        }
                    }
                }
                if (!!selectorObj._attr_ && selectorObj._attr_.length > 0 && isAccept) { //3.检测attr
                    for (innerFlag = 0; innerFlag < selectorObj._attr_.length && isAccept; innerFlag++) {

                        if (/^\[([^=]+)]$/.test(selectorObj._attr_[innerFlag])) {
                            selector_exec = /^\[([^=]+)\]$/.exec(selectorObj._attr_[innerFlag]);
                            if (!needCheckResultArray[flag].getAttribute || needCheckResultArray[flag].getAttribute(selector_exec[1]) == null) {
                                isAccept = false;
                            }
                        } else {
                            selector_exec = /^\[([^=]+)=(["'])([^=]+)\2\]$/.exec(selectorObj._attr_[innerFlag]);
                            if (!needCheckResultArray[flag].getAttribute || needCheckResultArray[flag].getAttribute(selector_exec[1]) != selector_exec[3]) {
                                isAccept = false;
                            }
                        }
                    }
                }
                if (isAccept) { //通过全部检测就接受
                    resultData.push(needCheckResultArray[flag]);
                }
            }
            return resultData;
        },
        "filter": function (tempResult, selector) {
            var selector_exec,
                helpResult, flag;
            if (!!selector && selector != "*") {
                selector = selector.trim();
                if (Luna._sizzle_.isSingle(selector)) {
                    if (Luna._sizzle_.isID(selector)) {
                        helpResult = tempResult;
                        tempResult = [];
                        for (flag = 0; flag < helpResult.length; flag++) {
                            if (helpResult[flag].getAttribute && ("#" + helpResult[flag].getAttribute('id')) == selector) {
                                tempResult.push(helpResult[flag]);
                            }
                        }
                    } else if (Luna._sizzle_.isClass(selector)) {
                        helpResult = tempResult;
                        tempResult = [];
                        for (flag = 0; flag < helpResult.length; flag++) {
                            if (helpResult[flag].getAttribute && (" " + helpResult[flag].getAttribute('class') + " ").search(" " + (selector.replace(/^\./, '')) + " ") >= 0) {
                                tempResult.push(helpResult[flag]);
                            }
                        }
                    } else if (Luna._sizzle_.isElemment(selector)) {
                        helpResult = tempResult;
                        tempResult = [];
                        for (flag = 0; flag < helpResult.length; flag++) {
                            if (helpResult[flag].tagName == ((selector + "").toUpperCase()) || helpResult[flag].tagName == ((selector + "").toLowerCase())) {
                                tempResult.push(helpResult[flag]);
                            }
                        }
                    } else if (Luna._sizzle_.isAttr(selector)) {
                        helpResult = tempResult;
                        tempResult = [];
                        for (flag = 0; flag < helpResult.length; flag++) {
                            if (/^\[([^=]+)]$/.test(selector)) {
                                selector_exec = /^\[([^=]+)\]$/.exec(selector);
                                if (!helpResult[flag].getAttribute || helpResult[flag].getAttribute(selector_exec[1]) != null) {
                                    tempResult.push(helpResult[flag]);
                                }
                            } else {
                                selector_exec = /^\[([^=]+)=(["'])([^=]+)\2\]$/.exec(selector);
                                if (helpResult[flag].getAttribute && helpResult[flag].getAttribute(selector_exec[1]) == selector_exec[3]) {
                                    tempResult.push(helpResult[flag]);
                                }
                            }
                        }
                    } else {
                        throw new Error('invalid selector1:' + selector);
                    }
                } else if (Luna._sizzle_.notLayer(selector)) {
                    if (Luna._sizzle_.isValidComplex(selector)) {
                        tempResult = Luna._sizzle_.checkedElems(tempResult, Luna._sizzle_.toComplexSelectorObject(selector));
                    } else {
                        throw new Error('invalid selector2:' + selector);
                    }
                } else {
                    throw new Error('undesigned selector:' + selector);
                }
            }
            return tempResult;
        }
    });

})(window, window.Luna);
/*!======= sizzle.js =======*/
(function (window, Luna, undefined) {
    'use strict';

    Luna.extend({
        "sizzle": function (selector, context) {
            selector = selector.trim();
            var resultData = [],
                flag, elems, innerFlag;

            //第0部分：选择全部
            if (selector == '*') {
                elems = context.getElementsByTagName('*');
                for (flag = 0; flag < elems.length; flag++) {
                    resultData.push(elems[flag]);
                }
            }
            //第一部分：最单纯的选择器
            else if (Luna._sizzle_.isSingle(selector)) {
                if (Luna._sizzle_.isID(selector)) {
                    //id选择器 上下文只能是HTML文档，考虑id的唯一性，直接全局查找，因此id选择器不支持上下文查找，各种类型都一样
                    //浏览器支持情况：IE 6+, Firefox 3+, Safari 3+, Chrome 4+, and Opera 10+；
                    resultData.push(document.getElementById(selector.replace(/^#/, "")));
                } else if (Luna._sizzle_.isClass(selector)) {
                    //class选择器 上下文可以是HTML文档，XML文档及元素节点
                    if (context.getElementsByClassName) {
                        //浏览器支持情况：IE 9+, Firefox 3+, Safari4+, Chrome 4+, and Opera 10+；
                        elems = context.getElementsByClassName(selector.replace(/^./, ""));
                        for (flag = 0; flag < elems.length; flag++) {
                            resultData.push(elems[flag]);
                        }
                    } else {
                        elems = context.getElementsByTagName('*');
                        for (flag = 0; flag < elems.length; flag++) {
                            if (Luna(elems[flag]).hasClass(selector.replace(/^./, ""))) {
                                resultData.push(elems[flag]);
                            }
                        }
                    }
                } else if (Luna._sizzle_.isElemment(selector)) {
                    //元素选择器 上下文可以是HTML文档，XML文档及元素节点
                    elems = context.getElementsByTagName(selector);
                    for (flag = 0; flag < elems.length; flag++) {
                        resultData.push(elems[flag]);
                    }
                } else if (Luna._sizzle_.isAttr(selector)) {
                    if (!context.querySelectorAll) {
                        // 浏览器支持情况：IE 8+, Firefox 3.5+, Safari 3+, Chrome 4+, and Opera 10+；
                        // 上下文可以是HTML文档，XML文档及元素节点
                        elems = context.querySelectorAll(selector);
                        for (flag = 0; flag < elems.length; flag++) {
                            resultData.push(elems[flag]);
                        }
                    } else {
                        elems = context.getElementsByTagName('*');

                        var selector_exec;

                        if (/^\[([^=]+)]$/.test(selector)) {
                            selector_exec = /^\[([^=]+)\]$/.exec(selector);
                            for (flag = 0; flag < elems.length; flag++) {
                                if (!elems[flag].getAttribute || elems[flag].getAttribute(selector_exec[1]) != null) {
                                    resultData.push(elems[flag]);
                                }
                            }
                        } else {
                            selector_exec = /^\[([^=]+)=(["'])([^=]+)\2\]$/.exec(selector);
                            for (flag = 0; flag < elems.length; flag++) {
                                if (selector_exec[3] == Luna(elems[flag]).attr(selector_exec[1])) {
                                    resultData.push(elems[flag]);
                                }
                            }
                        }

                    }
                } else {
                    throw new Error('invalid selector1:' + selector);
                }
            }
            //第二部分：复合的单选择器
            else if (Luna._sizzle_.notLayer(selector)) {
                if (Luna._sizzle_.isValidComplex(selector)) {
                    var complexSelectorObj = Luna._sizzle_.toComplexSelectorObject(selector);
                    var needCheckResultArray = [];
                    if (!!complexSelectorObj._id_) { //如果存在id选择器
                        needCheckResultArray = [document.getElementById(complexSelectorObj._id_)];
                        return Luna._sizzle_.checkedElems(needCheckResultArray, complexSelectorObj);
                    } else if (!!complexSelectorObj._elem_) { //如果存在elem
                        needCheckResultArray = context.getElementsByTagName(complexSelectorObj._elem_);
                        return Luna._sizzle_.checkedElems(needCheckResultArray, complexSelectorObj);
                    } else if (!!complexSelectorObj._class_ && complexSelectorObj._class_.length > 0) {
                        if (context.getElementsByClassName) { //如果是class
                            //浏览器支持情况：IE 9+, Firefox 3+, Safari4+, Chrome 4+, and Opera 10+；
                            needCheckResultArray = context.getElementsByClassName(complexSelectorObj._class_[0]);
                            return Luna._sizzle_.checkedElems(needCheckResultArray, complexSelectorObj);
                        }
                    } else { //如果没办法提前过滤，就检测全部
                        needCheckResultArray = context.getElementsByTagName('*');
                        return Luna._sizzle_.checkedElems(needCheckResultArray, complexSelectorObj);
                    }
                } else {
                    throw new Error('invalid selector2:' + selector);
                }
            }
            //第三部分：关系选择器 【'>',"空","~","+"】【儿子选择器，子孙选择器，后续兄弟选择器，后续第一个兄弟选择器】
            else {
                //切割第三部分选择器为之前部分选择器，用关系符号分割
                var layerSelectorArray = selector.replace(/ *([>+~]) */g, '@$1@').replace(/ +/g, '@ @').split('@');

                //层次上检测
                for (flag = 0; flag < layerSelectorArray.length; flag++) {
                    if (layerSelectorArray[flag] == "") {
                        throw new Error('invalid selector3:' + selector);
                    }
                }

                //关系上没有问题以后，开始查找，内部错误会有对应的处理函数暴露，和这里没有关系
                var nodes = Luna.sizzle(layerSelectorArray[layerSelectorArray.length - 1], context);
                var helpNodes = [];
                for (flag = 0; flag < nodes.length; flag++) {
                    helpNodes.push({
                        "0": nodes[flag],
                        "length": 1
                    });
                }

                //过滤
                var filterSelector, filterLayer, _inFlag_, num, tempLuna, tempHelpNodes, tempFlag;
                for (flag = layerSelectorArray.length - 1; flag > 1; flag = flag - 2) {
                    filterSelector = layerSelectorArray[flag - 2];
                    filterLayer = layerSelectorArray[flag - 1];
                    if ('>' == filterLayer) { //如果是>
                        for (innerFlag = 0; innerFlag < nodes.length; innerFlag++) { //检测每个可能入选的节点
                            num = 0;
                            if (!!helpNodes[innerFlag] && helpNodes[innerFlag].length > 0) {
                                for (_inFlag_ = 0; _inFlag_ < helpNodes[innerFlag].length; _inFlag_++) { //检测判断是否合法路径，有一个合法即可
                                    tempLuna = Luna(helpNodes[innerFlag][_inFlag_]).parent().filter(filterSelector);
                                    if (tempLuna.length > 0) {
                                        helpNodes[innerFlag][num] = tempLuna;
                                        num++;
                                    }
                                }
                                helpNodes[innerFlag].length = num;
                            }
                        }
                    } else if ('~' == filterLayer) { //如果是~
                        for (innerFlag = 0; innerFlag < nodes.length; innerFlag++) { //检测每个可能入选的节点
                            num = 0;
                            if (!!helpNodes[innerFlag] && helpNodes[innerFlag].length > 0) {
                                tempHelpNodes = [];
                                for (_inFlag_ = 0; _inFlag_ < helpNodes[innerFlag].length; _inFlag_++) { //检测判断是否合法路径，有一个合法即可
                                    tempLuna = Luna(helpNodes[innerFlag][_inFlag_]).prevAll(filterSelector);
                                    for (tempFlag = 0; tempFlag < tempLuna.length; tempFlag++) {
                                        tempHelpNodes[num] = tempLuna[tempFlag];
                                        num++;
                                    }
                                }
                                helpNodes[innerFlag].length = num;
                                for (tempFlag = 0; tempFlag < tempHelpNodes.length; tempFlag++) {
                                    helpNodes[innerFlag][tempFlag] = tempHelpNodes[tempFlag];
                                }
                            }
                        }
                    } else if ('+' == filterLayer) { //如果是+
                        for (innerFlag = 0; innerFlag < nodes.length; innerFlag++) { //检测每个可能入选的节点
                            num = 0;
                            if (!!helpNodes[innerFlag] && helpNodes[innerFlag].length > 0) {
                                for (_inFlag_ = 0; _inFlag_ < helpNodes[innerFlag].length; _inFlag_++) { //检测判断是否合法路径，有一个合法即可
                                    tempLuna = Luna(helpNodes[innerFlag][_inFlag_]).prev().filter(filterSelector);
                                    if (tempLuna.length > 0) {
                                        helpNodes[innerFlag][num] = tempLuna;
                                        num++;
                                    }
                                }
                                helpNodes[innerFlag].length = num;
                            }
                        }
                    } else { //上面都不是，就只可能是空格了
                        for (innerFlag = 0; innerFlag < nodes.length; innerFlag++) {
                            num = 0;
                            if (!!helpNodes[innerFlag] && helpNodes[innerFlag].length > 0) {
                                tempHelpNodes = [];
                                for (_inFlag_ = 0; _inFlag_ < helpNodes[innerFlag].length; _inFlag_++) { //检测判断是否合法路径，有一个合法即可
                                    tempLuna = Luna(helpNodes[innerFlag][_inFlag_]).parents(filterSelector);
                                    for (tempFlag = 0; tempFlag < tempLuna.length; tempFlag++) {
                                        tempHelpNodes[num] = tempLuna[tempFlag];
                                        num++;
                                    }
                                }
                                helpNodes[innerFlag].length = num;
                                for (tempFlag = 0; tempFlag < tempHelpNodes.length; tempFlag++) {
                                    helpNodes[innerFlag][tempFlag] = tempHelpNodes[tempFlag];
                                }
                            }
                        }
                    }
                }
                //最后被留下的就是我们需要的
                for (flag = 0; flag < nodes.length; flag++) {
                    if (!!helpNodes[flag] && helpNodes[flag].length > 0) {
                        resultData.push(nodes[flag]);
                    }
                }

            }
            return resultData;
        }
    });

})(window, window.Luna);
/*!======= tool.js =======*/
(function(window, Luna, undefined) {
    'use strict';
    Luna.extend({
        /**
         * 合并若干个class
         */
        "uniqueClass": function() {
            var classString = '',
                flag = 0;
            for (; flag < arguments.length; flag++) {
                if (typeof arguments[flag] !== 'string') {
                    throw new Error('Only string is valid,not project!');
                }
                classString += arguments[flag] + " ";
            }
            classString = classString.trim();
            var classArray = classString.split(/ +/);
            var classObj = {};
            classArray.forEach(function(item) {
                classObj[item] = true;
            }, this);
            classString = '';
            for (var item in classObj) {
                if (classObj[item])
                    classString += item + " ";
            }

            return classString.trim();
        },

        /**
         * 删除已经存在的class或toggle，用flag来标记，flag为真表示删除
         */
        "operateClass": function(srcClass, opeClass, flag) {
            if (typeof srcClass !== 'string' || typeof opeClass !== 'string') {
                throw new Error('Only string is valid,not project!');
            }
            srcClass = srcClass.trim();
            opeClass = opeClass.trim();
            var srcClassArray = srcClass.split(/ +/);
            var opeClassArray = opeClass.split(/ +/);
            var classObj = {};
            srcClassArray.forEach(function(item) {
                classObj[item] = true;
            }, this);
            opeClassArray.forEach(function(item) {
                classObj[item] = flag ? false : !classObj[item];
            }, this);
            var classString = '';
            for (var item in classObj) {
                if (classObj[item])
                    classString += item + " ";
            }

            return classString.trim();
        },
        /**
         * 获取包括元素自己的字符串
         */
        "outerHTML": function(node) {
            return node.outerHTML || (function(n) {
                var div = document.createElement('div'),
                    h;
                div.appendChild(n);
                h = div.innerHTML;
                div = null;
                return h;
            })(node);
        },
        /**
         * 获取全部样式
         */
        'styles': function(dom, name) {
            if (arguments.length < 1 || (dom.nodeType !== 1 && dom.nodeType !== 11 && dom.nodeType !== 9)) {
                throw new Error('DOM is required!');
            }
            if (document.defaultView && document.defaultView.getComputedStyle) {
                if (name && typeof name === 'string') {
                    return document.defaultView.getComputedStyle(dom, null).getPropertyValue(name); //第二个参数是伪类
                } else {
                    return document.defaultView.getComputedStyle(dom, null);
                }
            } else {
                if (name && typeof name === 'string') {
                    return dom.currentStyle.getPropertyValue(name);
                } else {
                    return dom.currentStyle;
                }
            }
        },
        /**
         * 把指定文字复制到剪切板
         */
        'clipboard': function(text, callback, errorback) {
            Luna('body').prepend(Luna('<textarea id="clipboard-textarea" style="position:absolute">' + text + '</textarea>')[0]);
            window.document.getElementById("clipboard-textarea").select();
            try {
                window.document.execCommand("copy", false, null);
                if (!!callback) {
                    callback();
                }
            } catch (e) {
                if (!!errorback) {
                    errorback();
                }
            }
            Luna('#clipboard-textarea').remove();
        },

        /**
         * 退出全屏
         */
        "exitFullScreen": function() {
            if (!!document.exitFullscreen) {
                document.exitFullscreen();
            } else if (!!document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (!!document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else {
                console.error('退出全屏失败！');
            }
        },

        /**
         * 执行一定字符串的js代码
         */
        "eval": function(js) {
            return (new Function("return " + "" + js + ""))();
        }
    });
})(window, window.Luna);
/*!======= animation.base.js =======*/
(function (window, Luna, undefined) {
    'use strict';
    Luna.extend({
        /*提供动画效果*/
        "animation": function (doback, duration, callback) {
            Luna.clock.timer(function (deep) {
                //其中deep为0-100，单位%，表示改变的程度
                doback(deep);
            }, duration, callback);
        }
    });

    Luna.extend(Luna.clock, {
        //把tick函数推入堆栈
        "timer": function (tick, duration, callback) {
            if (!tick) {
                throw new Error('tick is required!');
            }
            duration = duration || Luna.clock.speeds;
            Luna.clock.timers.push({
                "createTime": new Date(),
                "tick": tick,
                "duration": duration,
                "callback": callback
            });
            Luna.clock.start();
        },

        //开启唯一的定时器timerId
        "start": function () {
            if (!Luna.clock.timerId) {
                Luna.clock.timerId = window.setInterval(Luna.clock.tick, Luna.clock.interval);
            }
        },

        //被定时器调用，遍历timers堆栈
        "tick": function () {
            var createTime, flag, tick, callback, timer, duration, passTime, needStop, deep,
                timers = Luna.clock.timers;
            Luna.clock.timers = [];
            Luna.clock.timers.length = 0;
            for (flag = 0; flag < timers.length; flag++) {
                //初始化数据
                timer = timers[flag];
                createTime = timer.createTime;
                tick = timer.tick;
                duration = timer.duration;
                callback = timer.callback;
                needStop = false;

                //执行
                passTime = (+new Date() - createTime) / duration;
                if (passTime >= 1) {
                    needStop = true;
                }
                passTime = passTime > 1 ? 1 : passTime;
                deep = 100 * passTime;
                tick(deep);
                if (passTime < 1) {
                    //动画没有结束再添加
                    Luna.clock.timers.push(timer);
                } else if (callback) {
                    callback();
                }
            }
            if (Luna.clock.timers.length <= 0) {
                Luna.clock.stop();
            }
        },

        //停止定时器，重置timerId=null
        "stop": function () {
            if (Luna.clock.timerId) {
                window.clearInterval(Luna.clock.timerId);
                Luna.clock.timerId = null;
            }
        }
    });
})(window, window.Luna);
/*!======= environment.js =======*/
(function (window, Luna, undefined) {
    'use strict';

    Luna.extend({
        /**
         * 切换到SVG模式
         */
        "SVG": function () {
            Luna._code_environment_ = 'SVG';
            return Luna(arguments[0], arguments[1], arguments[2]);
        },
        /**
         * 切换到HTML模式
         */
        "HTML": function () {
            Luna._code_environment_ = 'HTML';
            return Luna(arguments[0], arguments[1], arguments[2]);
        }
    });
})(window, window.Luna);
/*!======= environment.svg.js =======*/
(function (window, Luna, undefined) {
    'use strict';

    Luna.extend(Luna._SVG_config_, {
        "xlink": {
            "href": true,
            "title": true,
            "show": true,
            "type": true,
            "role": true,
            "actuate": true
        }
    });

})(window, window.Luna);
/*!======= XHR.base.js =======*/
(function (window, Luna, undefined) {
    'use strict';

    Luna.extend({

        /**
         * 获取XHR对象
         */
        "getXHR": function () {
            if (!!Luna.XHR) {
                return Luna.XHR;
            }

            if (window.XMLHttpRequest) {
                Luna.XHR = new window.XMLHttpRequest();
            } else {
                Luna.XHR = new window.ActiveXObject("Microsoft.XMLHTTP");
            }

            return Luna.XHR;
        },

        /**
         * 通过HTTP GET获取指定路径文件
         */
        "get": function (url, callback, errorback) {
            var xmlhttp = Luna.getXHR();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        if (callback) {
                            callback(this.responseText);
                        }
                    } else {
                        if (errorback) {
                            errorback();
                        }
                    }
                }
            };
            xmlhttp.open('get', url + "?Token=" + (new Date()).valueOf(), true);
            xmlhttp.send();
        },

        /**
         * 通过HTTP GET形式的加载JavaScript文件并在全局运行它
         */
        "getScript": function (url, callback, errorback) {
            Luna.get(url, function (js) {
                Luna.eval(js);
                callback();
            }, errorback);
        }
    });
})(window, window.Luna);
/*!======= date.base.js =======*/
(function (window, Luna, undefined) {
    'use strict';
    Luna.extend({
        /**
         * 判断是不是闰年
         */
        'isLeapYear': function (year) {
            if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 判断某年某月多少天
         */
        'getMonthDay': function (month, year) {
            var monthDay = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
            if (!!monthDay && monthDay > 0) {
                return monthDay;
            } else if (!!year && month >= 1 && month <= 12) {
                return Luna.isLeapYear(year) ? 29 : 28;
            }
            throw new Error('parameter is unexcepted!');
        },
        /**
         * 计算某年某月第一天是星期几
         */
        'getBeginWeek': function (year, month) {
            var beginWeek = new Date(year + "/" + month + "/1").getDay();
            if (beginWeek == 0) {
                return 7;
            }
            return beginWeek;
        }
    });
})(window, window.Luna);