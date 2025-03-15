---
title: watch_it: 又又又又一个Flutter状态管理库
description: "watch_it, get_it, setState, state manage, riverpod, GetX, Provider"
slug: flutter-watch-it
date: 2025-03-15
tags: [Flutter]
---

在 Flutter 开发中，状态管理始终是一个核心话题。应用的复杂度越高，状态管理的选择就越影响开发效率和性能表现。[watch_it](https://pub.dev/packages/watch_it) 作为一种轻量级的状态管理工具，结合 [get_it](https://pub.dev/packages/get_it) 的服务定位功能，为开发者提供了一种简单而直观的方式来处理状态。本文将深入探讨 watch_it 的核心原理、典型场景，并分享一些实用的建议，助你在项目中游刃有余。

<!-- truncate -->

## 1. 状态管理的发展历程

Flutter 的状态管理方案经过了多次演进，每种方案都有其适用场景：

- **setState**：最基础的方式，小型应用用起来简单，但 widget 树深了就容易拖慢性能。
- **Provider**：借助 InheritedWidget，通过 context 传递状态。上手快，但复杂场景下样板代码多，优化起来有点费劲。
- **Riverpod**：Provider 的进阶版，控制更细腻，性能更优，不过 API 设计复杂，学习成本不低。
- **Bloc 等方案**：适合大型项目，架构清晰，但中小型应用用它就有点“杀鸡用牛刀”了。

而 **watch_it** 的出现，则为中小型项目或快速开发提供了一个新选择。它基于 **get_it**，减少了繁琐的代码，兼顾了易用性和性能，算得上是一个“轻装上阵”的好帮手。

## 2. watch_it 的核心原理

watch_it 的核心在于通过 **get_it** 注册状态对象，并利用观察者模式实现数据与 UI 的自动绑定。以下是它的关键组件：

- **get_it 服务定位器**：负责注册和管理状态对象，支持单例或工厂模式。
- **watch 函数族**：包括 `watch`、`watchIt`、`watchValue` 等，分别用于观察 `ChangeNotifier`、`Stream`、`Future` 等数据类型。
- **WatchingWidget 和 Mixin**：`WatchingWidget` 是一个封装了 watch_it 功能的基类，`WatchItMixin` 则能让现有 widget 轻松接入 watch_it。

**工作流程**：在 `build` 方法中调用 `watch` 函数，watch_it 会订阅目标数据的变化，一旦数据更新，就自动触发 widget 重建。这种机制有点像 React 的 Hooks，简单直接，状态和 UI 同步得毫不费力。

## 3. 与 get_it 的关系

**get_it** 是一个轻量级的服务定位器，专注全局对象管理。**watch_it** 在此基础上增加了状态管理能力：

- **注册与管理**：状态对象通过 `di.registerSingleton` 或 `di.registerFactory` 注册到 get_it。
- **观察与绑定**：watch_it 为 get_it 的对象增加了数据观察和自动重建功能。
- **全局访问**：通过全局变量 `di`，随时随地调用 `di<T>()` 获取对象。

这种设计把依赖注入和状态管理融为一体，一个状态对象注册一次，就能随处使用，省心又高效。

## 4. 典型应用场景及代码示例

下面通过三个场景，展示 watch_it 的实际用法：

### 示例 1：观察 ChangeNotifier

```dart
import 'package:flutter/material.dart';
import 'package:watch_it/watch_it.dart';

// 定义状态对象
class UserModel extends ChangeNotifier {
  String _name = 'Guest';
  String get name => _name;
  set name(String value) {
    _name = value;
    notifyListeners();
  }
}

// 注册状态对象
final di = GetIt.instance;
void setupDi() {
  di.registerSingleton<UserModel>(UserModel());
}

// 使用 watch_it 观察
class UserNameText extends WatchingWidget {
  @override
  Widget build(BuildContext context) {
    final userName = watchPropertyValue((UserModel m) => m.name);
    return Text('Hello, $userName');
  }
}

// 主应用
void main() {
  setupDi();
  runApp(MaterialApp(home: Scaffold(body: UserNameText())));
}
```

**说明**：`watchPropertyValue` 订阅了 `UserModel.name` 的变化，名字一改，界面立刻更新，简单得让人舒服。

### 示例 2：观察 Stream

```dart
import 'package:flutter/material.dart';
import 'package:watch_it/watch_it.dart';

// 定义服务
class DataService {
  final _controller = StreamController<String>();
  Stream<String> get dataStream => _controller.stream;

  void fetchData() async {
    await Future.delayed(Duration(seconds: 2));
    _controller.add('New Data');
  }
}

// 注册
void setupDi() {
  di.registerSingleton<DataService>(DataService());
}

// 使用 watch_it 观察
class DataDisplay extends WatchingWidget {
  @override
  Widget build(BuildContext context) {
    final data = watchStream((DataService s) => s.dataStream, initialValue: 'Loading...');
    return Column(
      children: [
        Text(data.hasData ? data.data! : 'Waiting...'),
        ElevatedButton(
          onPressed: () => di<DataService>().fetchData(),
          child: Text('Fetch Data'),
        ),
      ],
    );
  }
}
```

**说明**：`watchStream` 处理异步数据流，初始值让加载过程不那么“冷场”，用户体验更友好。

### 示例 3：事件处理

```dart
import 'package:flutter/material.dart';
import 'package:watch_it/watch_it.dart';

// 定义服务
class NotificationService extends ChangeNotifier {
  void showNotification(String message) {
    notifyListeners();
  }
}

// 注册
void setupDi() {
  di.registerSingleton<NotificationService>(NotificationService());
}

// 使用 watch_it 处理事件
class NotificationButton extends WatchingWidget {
  @override
  Widget build(BuildContext context) {
    registerChangeNotifierHandler(
      handler: (context, NotificationService service, cancel) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Notification Triggered')),
        );
      },
    );
    return ElevatedButton(
      onPressed: () => di<NotificationService>().showNotification('Hello'),
      child: Text('Show Notification'),
    );
  }
}
```

**说明**：`registerChangeNotifierHandler` 监听事件并触发回调，比如弹个 snackbar，完全不影响 widget 重建。

## 5. 性能优化建议与注意事项

为了让 watch_it 发挥最大作用，这里有一些实用建议：

- **精准观察**
  尽量观察具体属性，像 `watchPropertyValue((m) => m.name)` 这样，能少重建就少重建。

- **watch 函数的调用位置**
  `watch` 必须在 `build` 方法里用，而且调用顺序别乱，不然可能会出幺蛾子。

- **异步资源管理**
  用 `watchStream` 或 `watchFuture` 时，记得在 widget 销毁时取消订阅，别让内存泄漏找上门。

- **资源清理**
  在 `WatchingWidget` 里用 `onDispose` 释放资源，比如关掉 StreamController，干净利落。

- **测试驱动开发**
  给状态对象写点单元测试，确保逻辑靠谱，UI 行为也心里有数。

## 总结

**watch_it** 提供了一种简洁高效的状态管理方案，借助 **get_it** 的深度整合，让 Flutter 的状态管理变得更轻松。它特别适合中小型项目，API 简单，性能也不赖。希望这篇指南能给你一些启发，让状态管理不再是“拦路虎”。
