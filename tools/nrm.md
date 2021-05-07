## nrm manage mirroring

### npm install mirroring

Disadvantages: Cannot save historical mirror images (repository)
```sh
npm config set registry http://registry.npm.csii.com.cn/ #Set up company mirror source

npm view
```
OR

### nrm manage mirroring

> install
```sh
npm install -g nrm
```
> add custom mirror source
```sh
nrm add <registry> <url>
```
> switch
```sh
nrm use <registry>
```
> delete mirror source
```sh
nrm del <registry>
```
Posted at *YuQue*: https://www.yuque.com/docs/share/1746fe5a-731c-487a-8d4b-e297e0810e62