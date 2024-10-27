---
title: 迁移Ghost数据库MariaDB到 MySQL 8.0
description: "迁移Ghost数据库MariaDB到 MySQL 8.0"
slug: ghost-migrate-from-mariadb-to-mysql
date: 2022-12-26
tags: [Softwares]
---

本次更新花费 10 分钟左右，基本上纯 docker 命令操作，不难。

当然，为了避免一些瞎操作导致灾难事件，可以先做个系统备份。

<!-- truncate -->

1. 停止 **ghost** 容器
2. dump **mariadb** 数据库

```sql
sudo docker exec blog_mariadb_1 mysqldump --user ghost --password=ghost ghost > db_backup.sql
```

3. 停止 **mariadb** 容器
4. 编辑 `docker-compose.yml` 文件

假如原先是：

```yaml
  mariadb:
    image: 'mariadb:latest'
    restart: always
    volumes:
      - mariadb:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=ghost
      - MYSQL_DATABASE=ghost
      - MYSQL_USER=ghost
      - MYSQL_PASSWORD=ghost

  ghost:
    image: 'ghost:alpine'
    restart: always
    depends_on:
      - mariadb
    volumes:
      - ./ghost:/var/lib/ghost/content
    environment:
      - database__client=mysql
      - database__connection__host=mariadb
```

改成：

```yaml
  mysql:
    image: 'mysql:8.0'
    restart: always
    volumes:
      - mysql:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=ghost
      - MYSQL_DATABASE=ghost
      - MYSQL_USER=ghost
      - MYSQL_PASSWORD=ghost

  ghost:
    image: 'ghost:alpine'
    restart: always
    depends_on:
      - mysql
    volumes:
      - ./ghost:/var/lib/ghost/content
    environment:
      - database__client=mysql
      - database__connection__host=mysql
```

5. 启动 **mysql** 容器

```bash
sudo docker-compose up -d mysql
```

这里会自动创建 `ghost`数据库，后续导入用到。

6. 导入备份的数据，这里遇到个问题，通过 `docker exec` 导入失败，所以我先复制到容器内，然后进入容器 **bash**：

```bash
sudo docker cp db_backup.sql  blog_mysql_1:/
sudo docker exec -it blog_mysql_1 /bin/bash
```

然后执行 mysql 的命令导入：

```bash
mysql --user ghost --password=ghost ghost < /db_backup.sql
```

数据不多的话，很快就完成了，然后输入`exit`退出容器。

8. 删除创建的容器，再重新创建

```bash
sudo docker-compose down --remove-orphans && sudo docker-compose up -d
```

至此，所有操作基本上完成了，再次访问博客应该没啥问题了。
