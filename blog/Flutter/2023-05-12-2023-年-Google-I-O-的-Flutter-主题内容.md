---
title: 2023 年 Google I/O 的 Flutter 主题内容
description: "2023 年 Google I/O 的 Flutter 主题内容"
slug: 2023-google-io
date: 2023-05-12
tags: [Flutter]
---

2023 年 的 Google I/O 大会 于 5 月 10 日开幕，采用现场直播的形式。

本届大会的核心主题是 AI，Google 为了对抗 OpenAI 的 ChatGPT 真是费了老大劲。

本文有选择的提取 Flutter 相关的主题演讲和 Codelab，偏向于纯 Flutter 开发相关的内容，过滤对 Google 业务相关的主题，比如 Material You 和 Firebase 等内容。

其实，我们在平时的开发中，只需要关注 Flutter 官网即可，那里就有最新的 Flutter 版本更新，已经今后的 Roadmap。Google I/O 提供的 Flutter 相关的演讲，更多是偏实践类的建议，或者 Google 员工在使用 Flutter 时是怎么考虑的，以及 Flutter Team 背后的故事。

<!-- truncate -->

## 主题演讲

### [Dart 和 Flutter 的新动态](https://io.google/2023/program/7a253260-3941-470b-8a4d-4253af000119/intl/zh/)

> 了解 Dart 和 Flutter 最新资讯，包括如何使用二者针对任意平台构建精美的原生应用。本次会议涉及突破性图形性能、无缝集成、新兴架构和平台以及开发者体验。

### [深入了解 Flutter 深层链接](https://io.google/2023/program/7a2f7209-f82e-44c6-a9a6-661f3d4e97dc/intl/zh/)

> 参加本次会议，深入了解 Flutter 的深层链接系统。了解为何遵循此处的最佳实践能改善用户体验并提高投资回报率。

### [重新思考 Dart 与 Android 的互操作性](https://io.google/2023/program/2f02692d-9a41-49c0-8786-1a22b7155628/intl/zh/)

> 过去，Flutter 仅支持通过基于消息的方法（即平台通道）与 Android 内容库集成。如今，Flutter 开发者可通过使用 JNI 桥接到 Android 系统 API 的新命令，轻松访问平台 API，而无需使用平台通道或插件。本次会议将深入探讨 Dart 如何自动创建跨语言互操作的绑定，演示如何在 Flutter 应用中直接从 Dart 调用 Jetpack 内容库。

### [Flutter、Dart 和 Raspberry Pi](https://io.google/2023/program/b21c56db-9cd5-46d8-8ea5-ea2c26ccc249/intl/zh/)

> 了解 Raspberry Pi 上的 Flutter 如何助力开发者构建令人兴奋的全新嵌入式用户界面。Raspberry Pi 最初作为计算机科学教学工具而推出，但自推出以来备受所有开发者推崇，已成为他们工具箱中的主要工具。该工具已成为 IoT 设备、游戏模拟器和自助服务终端等开发者项目的基础。以上便是 Flutter 和 Raspberry Pi 游戏机的特征。

### [Impeller 虚拟导览 - Flutter 的全新渲染引擎](https://io.google/2023/program/60b4bd9e-4159-473d-b031-edabb93d0e00/intl/zh/)

> Flutter 的全新渲染引擎旨在消除着色器编译卡顿并提供可预测的性能。本次演讲将讨论 Impeller 的设计及其如何适应更广泛的 Flutter 架构。我们会介绍 Impeller 的子框架，演示如何在 Flutter 应用中使用较低级别的 API。本次会议还将讨论 Impeller 如何实现新体验，例如 3D 支持。

### [使用 Dart 构建软件包](https://io.google/2023/program/4fc92976-a6da-49a8-904e-16386210eb62/intl/zh/)

> 了解使用 Pub 构建用于分发的 Dart 和 Flutter 软件包的最佳实践。了解如何运行测试、收集代码覆盖率、运行集成测试、处理破坏性更改等。

### [在 Flutter 中构建新一代界面](https://io.google/2023/program/37d7aabe-46e4-4fdf-a2b8-4f065daf95a9/intl/zh/)

> 探索 Flutter 中的新一代界面，体验着色器和动画的强大功能。了解如何使用自定义着色器和新动画包为界面增添迷人效果。

## Codelab

### [Flutter 中的自适应应用](https://codelabs.developers.google.com/codelabs/flutter-adaptive-app)

> 调整专为 Android 和 iOS 设计的 Flutter 应用，以便在原生桌面和 Web 上轻松运行。

### [在 Flutter 中构建新一代界面](https://codelabs.developers.google.com/codelabs/flutter-next-gen-uis)

> 探索 Flutter 中的新一代界面，体验着色器的强大功能。

[在 Flutter 插件中使用 FFI 使用 FFI 将原生 C 语言代码添加到 Android、iOS、Windows、macOS 和 Linux 上的 Flutter 应用。](https://codelabs.developers.google.com/codelabs/flutter-ffigen)

### [如何测试 Flutter 应用](https://codelabs.developers.google.com/codelabs/flutter-app-testing)

> 了解如何使用微件测试、集成测试和单元测试，全面地测试 Flutter 应用。

### [将 WebView 添加到您的 Flutter 应用中](https://codelabs.developers.google.com/codelabs/flutter-webview)

> 了解如何在 Android 和 iOS 上的 Flutter 应用中使用 Web 浏览器。

### [将您枯燥无味的 Flutter 应用变得生动有趣](https://codelabs.developers.google.com/codelabs/flutter-boring-to-beautiful)

> 借助 Material 3 的强大功能，增强 Flutter 音乐应用，将枯燥无味的应用变得生动有趣。

### [您的第一款 Flutter 应用](https://codelabs.developers.google.com/codelabs/flutter-codelab-first)

> 创建您的第一款 Flutter 应用，探索 Flutter 的工作原理。

### [探索 Dart 3](https://codelabs.developers.google.com/codelabs/dart-patterns-records)

> 探索如何在 Flutter 应用中使用记录和模式，了解 Dart 3 的功能。

### [编写 Flutter 桌面应用](https://codelabs.developers.google.com/codelabs/flutter-github-client)

> 了解如何使用 Flutter 为 Windows、macOS 和 Linux 构建原生桌面应用。
