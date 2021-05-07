## nvm manage node version（windows, MacOS）

> node: v10.8.0（recommend）

First, uninstall the old version of node

### uninstall
- For windows (Commonly used method, software management such as some computer butler can be uninstalled)
- For MacOS
    ```sh
    sudo npm uninstall npm -g
    sudo rm -r /usr/local/lib/node*
    sudo rm -r /usr/local/bin/node*
    ```
### install nvm
- For Windows

    https://github.com/coreybutler/nvm-windows/releases
- For MacOS
    ```sh
    #In particular, this is to solve the problem that the following address https://raw.githubusercontent.com cannot be used
    sudo vi /etc/hosts

    i #(Enter i)

    #write at last line and Esc
    151.101.76.133 raw.githubusercontent.com # (Enter `wq!` to save and quit)

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
    ```

    install v10.8.0 again
    ```sh
    nvm install 10.8.0
    ```
    Posted at *YuQue*: https://www.yuque.com/docs/share/1746fe5a-731c-487a-8d4b-e297e0810e62