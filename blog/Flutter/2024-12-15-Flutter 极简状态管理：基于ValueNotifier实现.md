---
title: Flutter 极简状态管理：基于 ValueNotifier 实现
description: "Flutter 极简状态管理：基于 ValueNotifier 实现"
slug: flutter-valuenotifier
date: 2024-12-15
tags: [Flutter]
---

在 Flutter 开发中，状态管理方案的选择往往让开发者感到困惑。从 Stacked、Provider、Bloc 到全能的 GetX，从 web 端过来的 Redux、Mobx、Signal，再到最近很火的 Provider 的亲兄弟 Riverpod，各种方案都有其独特的优势和适用场景，但每一种都有一些地方让我难以理解或认同，要么规定了很多骚操作，要么模板代码太多，要么背后隐藏着太多 “魔法”，而我需要的是简单易懂、尽可能简洁、可扩展的方案。

于是便有了这篇文章，我要介绍一种不使用第三方状态管理方案的方法，它唯一用到的第三方包是 GetIt（但不是用于管理状态，而是依赖注入管理），而对于状态改变时重建 UI，会使用 Flutter 自带的 `ValueNotifier` 和 `ValueListenableBuilder` 类。

<!-- truncate -->

## 为什么不使用第三方状态管理管理方案？

我不是劝大家放弃正在使用的第三方状态管理方案，如果当前用着顺手就没必要改变。
我在不同的项目里也会选择不同的第三方状态管理方案，比如 Provider、GetX、Riverpod，我都有在项目中实际用过，不是说他们不好，这取决于项目的需求和个人的偏好。

我有的时候就不想选择第三方状态管理方案，主要考虑了以下几个主要原因：

- **复杂性与学习成本**
  - 第三方状态管理库通常具有复杂的概念和使用方式。例如，一些库引入了大量的抽象概念和设计模式，如 Redux 的单向数据流和多个中间件的概念，这对于初学者来说理解和掌握起来较为困难。
  - 学习和使用这些库需要花费大量的时间和精力去理解其内部机制、各种概念之间的关系以及如何正确地应用它们。这可能会导致开发周期延长，尤其是在项目初期需要快速搭建原型和实现基本功能时。
- **项目的依赖管理**
  - 引入第三方库会增加项目的依赖关系。不同的第三方库可能存在版本兼容性问题，当需要更新某个库时，可能会引发一系列的依赖冲突，需要花费额外的时间和精力去解决。
  - 过多的依赖也会增加应用的体积和构建时间，这对于移动应用来说是需要考虑的重要因素，尤其是在应用需要在资源有限的设备上运行时。

## `setState` 不够用吗？

Flutter 本身提供了一些基本的状态管理方式，如`setState`方法，对于简单的应用场景，开发者可以快速上手，通过在`StatefulWidget`中调用`setState`来更新 UI，这种方式直观且易于理解。

但是，对于复杂的应用场景，`setState`无法满足需求。例如，当应用具有多个页面和复杂的状态交互时，使用`setState`可能会导致代码结构混乱，难以维护。

随着应用的不断发展和功能的增加，`setState`无法很好地适应新的需求，缺乏足够的扩展性和灵活性来处理复杂的业务逻辑和状态转换。

最重要的是每次调用 `setState` 都会触发 UI 的重建，这可能会导致性能问题，尤其是在复杂的 UI 结构中。

所以，`setState` 通常用于更新局部状态，而不是全局状态。并且`setState` 通常与 UI 逻辑耦合，难以进行单元测试。

## 为什么选择 `ValueNotifier`？

`ValueNotifier`是一种特殊的观察者模式实现。它内部维护一个状态值，并提供了一种机制，当这个状态值发生变化时，能够通知所有注册的观察者。在 Flutter 中，UI 组件可以作为观察者，通过`ValueListenableBuilder`来监听`ValueNotifier`的状态变化。

例如，当一个 ValueNotifier 的状态值从`1`变为`2`时，所有与该 ValueNotifier 关联的`ValueListenableBuilder`都会收到通知，进而触发相关 UI 组件的重建。

在介绍具体实现之前，让我们先了解为什么要选择 `ValueNotifier`，它有什么优势：

1. 状态隔离与精确更新

   - `ValueNotifier`能够很好地隔离应用中的状态，使得每个状态都能被独立管理。例如，在一个具有多个数据展示区域的应用中，不同的状态可以使用各自的`ValueNotifier`进行管理。当某个状态发生变化时，只有与该状态相关的 UI 部分会收到通知并更新，避免了不必要的 UI 重建，提高了应用的性能和响应速度。
   - 与其他可能导致大量 UI 重建的状态管理方式相比，`ValueNotifier`更加精确地控制了状态变化对 UI 的影响。例如，使用`ChangeNotifier`时，可能会因为状态的一处更新而导致过多的 UI 组件重建，即使这些组件与更新的状态并无直接关联。

2. 支持不可变状态
   `ValueNotifier`支持不可变状态的管理，这符合现代编程中对数据一致性和可预测性的要求。在处理复杂的业务逻辑和多线程环境下，不可变状态能够减少因数据意外修改而导致的错误，提高应用的稳定性。

3. 与 Flutter 框架的集成
   `ValueNotifier`是 Flutter 框架自带的组件，无需引入额外的第三方库，这使得应用的依赖关系更加简单，减少了因第三方库版本冲突或兼容性问题带来的风险。

相比其他方案：

- **Provider**：需要额外依赖，使用 `Context` 和 `InheritedWidget`。
- **GetX**：功能强大但概念较多，存在一定学习成本。
- **Bloc**：适合大型应用，但对于简单场景可能过于复杂。
- **Riverpod**：功能强大，但是学习曲线较陡峭。

## 如何基于`ValueNotifier`实现状态管理？

一个良好的状态管理解决方案需要具备以下能力：

- 为 UI 层提供指向状态管理层的引用
- 把 UI 事件通知给状态管理层
- 给 UI 层提供一种监听状态变化的方式
- 在状态变化后重建 UI

下面我们逐个来看这些方面。

### 为 UI 层提供对状态管理层的引用

- **在有状态组件中创建实例**
  我们可以在应用的某个页面组件中，如`MyPage`，在其有状态组件`_MyPageState`中创建状态管理类的实例。

```dart
class MyPage extends StatefulWidget {
  //...
class _MyPageState extends State<MyPage> {
  final manager = MyPageManager();
  //...
```

- **使用 GetIt 获取引用**
  另一种方式是使用`GetIt`来获取状态管理类的引用。在`MyPage`组件的`build`方法中可以这样获取：

```dart
class MyPage extends StatelessWidget {
  @Override
  Widget build(BuildContext context) {
    final manager = getIt<MyPageManager>();
    // return...
  }
```

使用`GetIt`时需要注意遵循不在 UI 层直接修改状态的原则，而是通过调用状态管理类的方法来进行状态的更新。

### 通知状态管理层关于 UI 事件

当用户在 UI 层进行操作时，例如点击按钮，UI 层需要通知状态管理层。假设点击按钮的处理方法在状态管理类`MyPageManager`中定义为`handleButtonClick`，在 UI 层的按钮点击事件处理中可以这样调用：

```dart
onPressed: () {
  final stateManager = getIt<MyPageManager>();
  stateManager.handleButtonClick();
},
```

如果页面打开时需要执行一些初始化逻辑，比如加载初始数据，可以在有状态组件的`initState`方法中进行处理：

```dart
@override
void initState() {
  super.initState();
  manager.loadInitialData();
}
```

### 为 UI 层提供监听状态变化的方法

在状态管理类中，我们使用 `ValueNotifier` 来处理状态的变化。例如，对于某个计数器状态，我们可
以创建一个 ValueNotifier：

```dart
final counterNotifier = ValueNotifier<int>(0);
```

当计数器的值发生变化时，可以更新 `ValueNotifier` 的值：

```dart
counterNotifier.value = newCounterValue;
```

对于更复杂的状态，比如一个包含多个字段的用户信息对象，我们可以创建一个扩展 `ValueNotifier` 的类。假设我们有一个`UserInfo`类来表示用户信息，我们可以创建`UserInfoNotifier`如下：

```dart
class UserInfoNotifier extends ValueNotifier<UserInfo> {
  UserInfoNotifier() : super(UserInfo());
  //在实际应用中，此处可能需要获取服务层的引用，用于更新用户信息
  // final _userService = getIt<UserService>();
  void updateUserInfo() {
    //在实际应用中，此处可能需要从服务层获取新的用户信息并更新
    // final newUserInfo = _userService.getUpdatedUserInfo();
    value = newUserInfo;
  }
```

这样，在状态管理类`MyPageManager`中，我们可以使用这些 `ValueNotifier` 来管理状态。

### 在状态变化后重建 UI

UI 层通过 `ValueListenableBuilder` 来监听状态的变化并重建相应的组件。例如，对于显示计数器值的 `Text` 组件，我们可以这样使用 `ValueListenableBuilder`：

```dart
class CounterWidget extends StatelessWidget {
  const CounterWidget({Key? key}) : super(key: key);
  @Override
  Widget build(BuildContext context) {
    final myPage = getIt<MyPageManager>();

    return ValueListenableBuilder<int>(
      valueListenable: myPage.counterNotifier,
      builder: (context, value, child) {
        return Text(
          '$value',
          style: Theme.of(context).textTheme.headline2,
          //如果此处的组件有子组件且不受状态变化影响，可以通过child参数传递
          // child: UnchangedChildWidget(),
        );
      },
    );
  }
```

当计数器的值发生变化时，`ValueListenableBuilder`会自动重建 `Text` 组件，显示新的计数器值。

**PS**：有时候用`ValueListenableBuilder`包裹部件挺麻烦的，不过如果在 VS Code 或者 Android Studio 中使用快捷键调出上下文菜单，可以选择**Wrap with StreamBuilder**，然后再把`StreamBuilder`修改为`ValueListenableBuilder`就行。
![None](https://cdn.zhangwen.site/uPic/1*eZ980GDkpjdKIv7wf5U-qQ.png)
我推荐保持简单，所有情况都使用`ValueNotifier`和`ValueListenableBuilder`，不过如果决定暴露`Stream`、`Future`或者`ChangeNotifier`，也有对应的构建器部件：

- **Stream**：使用[StreamBuilder](https://www.youtube.com/watch?v=MkKEWHfy99Y)。
- **Future**：使用[FutureBuilder](https://www.youtube.com/watch?v=ek8ZPdWj4Qo)。
- **ChangeNotifier**：使用[ListenableBuilder](https://api.flutter.dev/flutter/widgets/ListenableBuilder-class.html)。

但如果追求极简和简单，其实不需要`StreamBuilder`、`FutureBuilder`或者`ChangeNotifier`，所有情况都用`ValueNotifier`和`ValueListenableBuilder`就行，在状态管理类里处理`Future`和`Stream`相关的内容。

## 最佳实践建议

### 1. 状态管理

- 将相关状态组合在一起
- 使用不可变状态模型
- 实现 `copyWith` 方法便于状态更新
- 避免过大的状态对象

### 2. 性能优化

- 合理拆分状态粒度
- 使用多个 `ValueListenableBuilder` 而不是一个大的状态
- 避免频繁的状态更新

### 3. 代码组织

- 遵循单一职责原则
- 将业务逻辑从 UI 中分离
- 使用服务层封装外部依赖
- 统一状态更新模式

### 4. 错误处理

```dart
class SafeValueNotifier<T> extends ValueNotifier<T> {
  final void Function(Object error)? onError;

  SafeValueNotifier(T value, {this.onError}) : super(value);

  void safeUpdate(T Function() updater) {
    try {
      value = updater();
    } catch (e) {
      onError?.call(e);
    }
  }
}
```

## 适用场景

`ValueNotifier` 特别适合以下场景：

1. **小型到中型项目**

   - 业务逻辑相对简单
   - 状态管理需求不复杂
   - 团队规模较小

2. **快速原型开发**

   - 需要快速验证想法
   - 不需要复杂的状态管理框架
   - 重视开发效率

3. **学习和教学**
   - 理解状态管理基本概念
   - 掌握 Flutter 原生功能
   - 为学习更复杂的框架打基础

## 注意事项

1. **内存管理**

   - 及时释放不需要的监听器
   - 避免循环引用
   - 在 `dispose` 时清理资源

2. **状态更新**

   - 确保状态更新在正确的时机
   - 避免在构建过程中更新状态
   - 处理异步状态更新

3. **测试**
   - 编写单元测试验证业务逻辑
   - 使用集成测试验证状态流转
   - 模拟各种错误场景

## 总结

`ValueNotifier` 作为 Flutter 原生提供的状态管理方案，虽然简单但足以应对大多数开发场景。通过合理的架构设计和最佳实践，我们可以构建出易于维护、性能优良的应用。在选择状态管理方案时，应该根据项目需求和团队特点做出合适的选择，而不是盲目追求复杂的解决方案。
