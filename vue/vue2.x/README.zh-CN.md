# For vue 2 platform

## 目录介绍
```doc
常用接口API	作为工具书查阅和补充
dist		vue2.x源码，前端框架的实质就是自定义功能和用法的JavaScript
examples	vue官方在测试某些具体功能时给的例子，能看懂就证明已入门vue了
README.md	之前请阅读和资料链接
```

## vue 2 框架

官网地址：https://cn.vuejs.org/

GitHub地址：https://github.com/vuejs/vue

在线源码：https://github.com/jiahwa/vue/blob/dev/dist/vue.js

离线源码: [./dist/vue.js](./dist/vue.js)

## 重点内容

> [深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

vue 2响应式的实质，是 [getter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get) 和 [setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set)

补充：

- vue 3 大胆还引入了proxy特性，某种程度造成对IE的致命打击

- 关于 Proxy [看这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

> [箭头函数是 ES6 的特性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

其他的ES6特性很容易在网上找到，ES6是2015年发布的js版本，全称是ECMA2015

> 学习vue之前

Mozilla web开发技术学习：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript

[JavaScript初级-JavaScript基础](https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web/JavaScript_basics)

[JavaScript中级-理解客户端JavaScript框架](https://developer.mozilla.org/zh-CN/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks)

[JavaScript高级-继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

