# SZU-Intranet-DDNS: 一个适用于深大内网的 DDNS 工具（仅支持 DNSPod ）

## 安装

1. 下载仓库

    ```bash
    git clone https://github.com/aomnisz/szu-intranet-ddns
    cd szu-intranet-ddns
    ```

2. 安装依赖

    ```bash
    npm install
    ```

## 使用

1. 根据模板 `config.example.js` 来创建 `config.js`，并填写/修改其中的字段。

    ```bash
    cp config.example.js config.js
    vim config.js
    ```

2. 启动程序

    ```bash
    npm start
    ```
