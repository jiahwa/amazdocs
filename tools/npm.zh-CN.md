# npm

## npm cli 安装
在package.json 同级目录下执行以下操作

- 安装dependencies 和 devDependencies 中的所有 npm 包

    `npm install`
- 仅安装 dependencies 下的所有 npm 包

    `npm install —production`

- 忽略可选项安装

    `npm install --no-optional --verbose`

eg: ERROR
```sh
    npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.4 (node_modules\fsevents):
    npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.4: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
```
解释: 某些包依赖fsevents包,而fsevents包是MacOS系统下,在Windows/Linux下会提示警告,但不会安装

## npm 低版本引起 `can't find folder` 错误

根据我的经历 npm <= v6.2.0，不能支持命令: 

`{"vue-loader-v16": "npm:vue-loader@^16.0.0-beta.3"}`,

并且新版本v6.14.8 +都没有此问题。

因此，发生这种情况时，请使用以下命令升级npm版本：

```sh
npm i -g npm
```

## npm 发布新软件包

> 注意：在发布之前，请运行npm run build或其他脚本命令来创建文件，并且经常将文件夹命名为./dist

```sh
npm login

npm publish

```