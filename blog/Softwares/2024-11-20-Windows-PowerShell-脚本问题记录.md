---
title: Windows PowerShell 脚本问题记录
description: "Windows PowerShell 脚本问题记录"
slug: powershell
date: 2024-11-20
tags: [Softwares]
---

现在的工作电脑以 Windows 为主，没了 Mac 的命令行，非常不习惯。项目中难免需要一些脚本来执行频繁的任务，Windows 下的批处理脚本BAT 非常垃圾，功能残缺，只好选择 PowerShell 来处理。

本文记录 PowerShell 脚本运行中遇到的问题，写脚本代码是不可能了，99%是 Claude 来完成，最多调整几个小地方。

<!-- truncate -->

## 1. 中文在控制台显示乱码

正确做法是 : 修改文件编码为**UTF-8 with BOM**。

:::tip

UTF-8 和 UTF-8 with BOM 的主要区别在于是否包含字节顺序标记（BOM，Byte Order Mark）。在类 Unix 系统和 Windows 系统中，对它们的支持和处理方式有所不同。

BOM 其实就是文件开头包含三个字节 (EF BB BF)，用于标识文件的编码是 UTF-8。

Windows 上的 PowerShell 默认使用 BOM 来识别脚本文件的编码。如果脚本文件是 UTF-8 无 BOM，某些字符（如非 ASCII 字符）可能被误解为 ANSI 编码，导致乱码。

类 Unix 系统默认使用 UTF-8 而不包含 BOM。常见的工具（如 cat、grep、vi/vim）不需要 BOM 来识别文件编码。BOM 被视为文件内容的一部分，可能会导致程序（如脚本解释器）出错。例如，Shell 脚本文件开头的 BOM 会导致 `#!/bin/bash` 无法正确解析。

:::

以下方法没有效果：

1. 文件编码改为"UTF-8"

```powershell

# 设置输出编码为 UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 设置控制台输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

```

2. 在控制台切换编码

```cmd
chcp 65001
```

3. 创建 $PROFILE 文件

```powershell
[System.Console]::OutputEncoding = [System.Console]::InputEncoding = [System.Text.Encoding]::UTF8
```

参考链接: https://answers.microsoft.com/zh-hans/windowsclient/forum/all/powershell%E6%89%A7%E8%A1%8C%E4%BB%A5utf/f0119b8a-5edf-48e4-a1a0-9a5fbbdb852e

## 2. param 执行报错

具体错误如下:

```cmd
param : 无法将“param”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
```

解决办法：**将 param 函数放在所有代码之前**

参考链接: https://www.cnblogs.com/wutou/p/17997760
