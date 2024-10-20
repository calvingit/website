---
title: Ubuntu 安装配置ftp服务器
description: "FTP上传文件还是替代不了的，服务器操作需要这个"
slug: ubuntu-ftp
date: 2021-10-28
tags: [Softwares]
---

FTP 上传文件还是替代不了的，服务器操作需要这个

<!-- truncate -->

- 安装 vsftpd：`sudo apt-get install vsftpd`
- 新建 ftp 用户目录"/home/uftp"：`sudo mkdir /home/uftp`
- 新建 ftp 用户"uftp"，指定用户主目录和所用 shell：`sudo useradd -d /home/uftp -s /bin/bash uftp`
- 设置用户密码：`sudo passwd uftp`
- 修改目录/home/uftp 的所属者和所属组为 uftp：`sudo chown uftp:uftp /home/uftp`
- 新建用户列表文件/etc/vsftpd.user_list，用于存放允许访问 ftp 的用户：`sudo vi /etc/vsftpd.user_list`，在里面输入：uftp，保存退出
- 编辑配置文件/etc/vsftpd.conf，修改如下：

  ```sh
  1. 打开注释 write_enable=YES
  2. 添加信息 _file=/etc/vsftpd.user_list
  3. 添加信息 userlist_enable=YES
  4. 添加信息 userlist_deny=NO
  ```

- 重启服务：`sudo service vsftpd restart`
