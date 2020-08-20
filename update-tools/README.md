# Update Tools
更新工具

## @vue-cli更新 <大版本升级>
1. 升级 v4.5.4

[原文] `vue-cli` now provides built-in option to choose Vue 3 preset when creating a new project.

[翻译] 当创建一个新项目，`vue-cli` 此时提供Vue 3预设值选项

> For macOS
```sh 
sudo npm update -g @vue/cli
```
2. 旧版本，`vue-cli`改版`@vue/cli`升级方案

node要求：>= 8.9+，

如果你还在用就旧版的node，建议使用nrm，在一个电脑上管理node多个版本

> 安装
```sh
npm install -g nrm
```
> 添加自定义镜像源
```sh
nrm add <registry> <url> [home]
```
> 切换
```sh
nrm use <registry>
```
> 删除镜像源
```sh
nrm del <registry>
```
## git bash 命令 <常用>
1. 添加新分支到远程仓库

> 添加新分支到本地
```sh
git branch <name>
```
> 配置提交的远端仓库
```sh
git remote add <name> <url>
```
> 推送当前新分支，关联本地和远端
```sh
git push --set-upstream <name> <name>
```
