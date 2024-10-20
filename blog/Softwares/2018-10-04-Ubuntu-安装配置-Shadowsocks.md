---
title: Ubuntu 安装配置 Shadowsocks
description: "Shadowsocks相比VPN来说会更好一些，更方便的定义规则"
slug: ubuntu-shadowsocks
date: 2018-10-04
tags: [Softwares]
---

Shadowsocks 相比 VPN 来说会更好一些，更方便的定义规则

<!-- truncate -->

## 安装

使用命令:

```bash
sudo apt-get install python-pip && export LC_ALL=C && pip install setuptools && pip install shadowsocks
```

## 配置

创建配置文件`/etc/shadowsocks.json`，内容如下:

```json
{
  "server": "0.0.0.0",
  "server_port": 8388,
  "local_address": "127.0.0.1",
  "local_port": 1080,
  "password": "zhangwen123",
  "timeout": 300,
  "method": "aes-256-cfb",
  "fast_open": false
}
```

修改服务器地址`server`。

## 启动

执行命令:

```bash
/usr/local/bin/ssserver -c /etc/shadowsocks.json
```

开机自启动：把上面的命令加在` /etc/rc.local`的末尾。
