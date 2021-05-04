## nvm管理node版本（windows, MacOS）

> node: v10.8.0（推荐）

首先，卸载旧版本node

### 卸载 
- For windows (常用的做法，软件管理如360安全卫士、电脑管家中卸载即可)
- For MacOS
    ```sh
    sudo npm uninstall npm -g
    sudo rm -r /usr/local/lib/node*
    sudo rm -r /usr/local/bin/node*
    ```
### 安装nvm
- For Windows

    https://github.com/coreybutler/nvm-windows/releases
- For MacOS
    ```sh
    #特别说明，此处是为解决以下地址https://raw.githubusercontent.com不能用的问题
    sudo vi /etc/hosts

    i #(Enter i)

    #write at last line and Esc
    151.101.76.133 raw.githubusercontent.com # (Enter `wq!` to save and quit)

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
    ```

    再安装v10.8.0
    ```sh
    nvm install 10.8.0
    ```
    已发布语雀: https://www.yuque.com/docs/share/1746fe5a-731c-487a-8d4b-e297e0810e62