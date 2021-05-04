## nrm管理镜像

### npm安装镜像

缺点：不能保存历史镜像(仓库)
```sh
npm config set registry http://registry.npm.csii.com.cn/ #设置公司镜像源

npm view #查看
```
OR

### nrm管理镜像

> 安装
```sh
npm install -g nrm
```
> 添加自定义镜像源
```sh
nrm add <registry> <url>
```
> 切换
```sh
nrm use <registry>
```
> 删除镜像源
```sh
nrm del <registry>
```
已发布语雀: https://www.yuque.com/docs/share/1746fe5a-731c-487a-8d4b-e297e0810e62