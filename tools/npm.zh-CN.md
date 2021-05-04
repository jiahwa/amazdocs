# npm

## npm cli install
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

## npm low version cause `can't find folder` error

Accordation to my experience, npm <=v6.2.0, cannot support commannd: 

`{"vue-loader-v16": "npm:vue-loader@^16.0.0-beta.3"}`,

and new version v6.14.8+ don't have this problem.

So, when it happend, upgrade npm version with command:

```sh
npm i -g npm
```

## npm publish new packages

> Attention: before your publishment, run `npm run build` or others scripts command to create files build, always a folder as `./dist` 

```sh
npm login

npm publish

```