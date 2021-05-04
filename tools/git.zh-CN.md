# git

## git 远端仓库更新

```sh
git remote #先查看 remote
git remote <remote> #确认更改指定 remote
git remote set-url origin <url>
```

## 添加新分支到远程仓库

> 添加新分支到本地
```sh
git branch <name>
```
> 配置提交的远端仓库
```sh
git remote add <hostname> <url>
```
> 推送当前新分支，关联本地和远端
```sh
git push --set-upstream <hostname> <name>
```

> 删除远端分支
```sh
git push origin --delete <name>
```

## git clone

```sh
git clone [--template=<template_directory>]
          [-l] [-s] [--no-hardlinks] [-q] [-n] [--bare] [--mirror]
          [-o <name>] [-b <name>] [-u <upload-pack>] [--reference <repository>]
          [--dissociate] [--separate-git-dir <git dir>]
          [--depth <depth>] [--[no-]single-branch] [--no-tags]
          [--recurse-submodules] [--[no-]shallow-submodules]
          [--jobs <n>] [--] <repository> [<directory>]

```
上面的写法规则，意味着如果你要clone到一个指定目录，要这么来写：

`git clone <reponsitory> <directory>`

eg: 
```sh
git clone https://github.com/vuejs/vuex.git node_modules/vuex
```

## 前提：如果想恢复到历史某一版本的文件，请执行以下步骤
```sh
# Unstaged changes after reset
git reset <commit hash> <file>

# Use "git checkout -- <file>..." to discard changes in working directory
git checkout -- <file>
```

## 添加 tag 标签

查看
```sh
git tag
```
添加版本v1.0.0，加备注
```sh
git tag -a v1.0.0 -m 'release 1.0.0 version'
```
推送到远程同步
```sh
git push <branch> <tag> 
```
删除tag
```sh
git tag -d <tag>
git push origin :refs/tags/<tag>
```

## git large file delete
large file removed from git history, as it is a mistick commit

```sh
du -d 1 -h
```

>serch for all files
```sh
git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -5 | awk '{print$1}')"
```

output:
```info
ee6e62e5c70dfe3d8d382f271aea2ad876d3f579 public/images/avatar.png
c849ce91a9e7adf55d9124e9b5b842895121be70 public/images/verifycode.gif
028aa7f4f5e1755ed2c1cf1b72858c18eb99a3f8 src/assets/login_bg.png
f3d2503fc2a44b5053b0837ebea6e87a2d339a43 src/assets/logo.png
7e3b322909cd4a68cd2c91638414bcf44f675a22 yarn.lock
```
(but not the things i wanna)

>remove the file from local git

```sh
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch <your large commit file>' --prune-empty --tag-name-filter cat -- --all
```
input
```sh
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch VX-UI页面效果图2.zip' --prune-empty --tag-name-filter cat -- --all
```
output

```info
Rewrite 127d411d67170815165f08cc71681894ae1eb6fc (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 90bad86403560614f56aabe9e02a798d43680fc6 (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 76347560b7e67fbacc283feb8bfdee7f0911dbac (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 00a5cae18c98d7cca2b5b648f23ddcf03cca0c82 (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 88955524841bae200b309d1dd242f435433a308b (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 6a5a3b2f39d20dc1dc5f4c0bacfc00111342fe31 (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 43a54547aa9a59d86972db0a441bba3bea3db6fd (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite dc08ddb41799f45d04c3f47f93632ce52a796bd3 (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite b06517ef73b43c2830e41b94ef6f5de3d308ceb6 (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 6709c1aadb48e7fd6f0a8db356e03d824ce87463 (27/68) (1 seconds passed, remaining 1 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 52cabc7d5d2aca351581123e08d3b990b854e1fc (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 0432a8bd58dc6cd18139322500285c3b1137a3aa (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 5343e84689ea5456b6f7820014d12f24649a5102 (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 387d3760a2623d3fd83dd6a710cb82daa9ee3fe4 (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite beac34c4ddfb550fbb98ecfd63170bbbd83293fb (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite c1835e0a73caa48834478335a7aa348974d907a9 (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 37200a3860b01ea808c3694aa18cc3bbd32c11b6 (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 13d151da11458904ee2ec109f34aa668dacd0d45 (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 6e6f1f226c6f246a5f773a8fbf2b19b3ef73b90b (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 77ee2a36b1cfed30cc84c624efa604580f6a46ed (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite d6c62ac824d9156eaa561ff134d4b11f8d687646 (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite d5455fa75216a6c2ae14cb4ae1e2e791181a6c2d (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite 265e9012767f5c1d07e26048ba8922513e5d313d (55/68) (3 seconds passed, remaining 0 predicted)    rm 'VX-UI页面效果图2.zip'
Rewrite a568555139ac3455dcc45687948c90d445e03af0 (55/68) (3 seconds passed, remaining 0 predicted)
Ref 'refs/heads/fix409' was rewritten
Ref 'refs/heads/master' was rewritten
WARNING: Ref 'refs/heads/surfing' is unchanged
Ref 'refs/remotes/origin/master' was rewritten
WARNING: Ref 'refs/remotes/origin/master' is unchanged
WARNING: Ref 'refs/remotes/origin/surfing' is unchanged
WARNING: Ref 'refs/tags/v0.0.4' is unchanged
Ref 'refs/tags/v0.0.6' was rewritten
v0.0.4 -> v0.0.4 (80b5564f6127007a2b75dfb983c015e2b3f23cb2 -> 80b5564f6127007a2b75dfb983c015e2b3f23cb2)
v0.0.6 -> v0.0.6 (52cabc7d5d2aca351581123e08d3b990b854e1fc -> 2c85fe4b11c0a658ccf48befe8fe8d590edecb3b)
```

>then

```sh
git push origin master --force
```

>at last

```sh
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
```