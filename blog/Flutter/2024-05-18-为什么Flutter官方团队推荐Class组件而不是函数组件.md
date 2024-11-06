---
title: 为什么Flutter官方团队推荐Class组件而不是函数组件?
description: "为什么Flutter官方推荐类widget而不是函数widget?"
slug: Why-Flutter-Official-Recommends-Classes-Instead-of-Functions
date: 2024-05-18
tags: [Flutter]
---

:::tip

Update (2024-11-05): 阅读了一些新的文章，补充更多细节。

:::

在 Flutter 开发中，我们经常需要创建可重用的组件。这些组件可以是简单的 UI 元素，也可以是复杂的布局结构。

一般主要有两种方式来定义这些组件：

- 使用类（class）
- 使用函数（function）

很多人使用函数创建组件，更多的考虑是速度，更快的编码。不可否认的是，相比类组件而言，函数组件省了好几行代码，比如构造函数和变量定义部分。在我的工作中，也经常看见大量使用函数返回 widget 来创建组件，但是官方的 Flutter 团队更推荐使用类。

为什么？本文将详细探讨这一原因。

<!-- truncate -->

## 类的优势

### 性能优化

使用类创建的组件可以利用`const`构造函数，这有助于避免不必要的重建（rebuild），从而提高性能。

```dart
class Square extends StatelessWidget {
  const Square({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(width: 100, height: 100, color: Colors.red);
  }
}
```

在这个例子中，`Square`是一个无状态的组件，使用`const`关键字可以确保在父组件重建时，`Square`不会无缘无故地重建。

### 可测试性

使用类创建的组件更容易进行单元测试。例如，如果你有一个带有点赞按钮的组件，你可以单独测试这个类，而不需要设置其他不必要的值。

```dart
class LikeButton extends StatelessWidget {
  final VoidCallback onTap;

  const LikeButton({Key? key, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onTap,
      child: Icon(Icons.thumb_up),
    );
  }
}

// 测试代码
void main() {
  testWidgets('LikeButton test', (WidgetTester tester) async {
    bool tapped = false;
    await tester.pumpWidget(MaterialApp(
      home: LikeButton(
        onTap: () {
          tapped = true;
        },
      ),
    ));
    await tester.tap(find.byType(ElevatedButton));
    expect(tapped, true);
  });
}
```

### 准确性

使用类可以帮助减少因 context 使用不当而导致的错误。例如，当使用`Builder`时，如果上下文有多个，如`ctx`和`innerContext`，使用类可以减少混淆和错误。

```dart
class ThemedText extends StatelessWidget {
  final String text;

  const ThemedText(this.text, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: Theme.of(context).textTheme.headline4,
    );
  }
}
```

使用函数时，可能会错误地使用`BuildContext`，这在处理`InheritedWidgets`（如主题或提供者）时可能导致问题。

```dart
Widget builderWidget(BuildContext context) {
  return Container(
    color: Theme.of(context).primaryColor,
  );
}
```

### devtool 调试

在开发工具（devtool）中，你可以看到一个有意义的组件名称， 但看不到函数。这意味着，框架对类的管理更为精确，例如在动画和热重载（hot-reload）方面。

![flutter-devtools-class-function.png)](https://cdn.zhangwen.site/uPic/flutter-devtools-class-function.png)

尤其是当你使用函数参数，按条件返回不同的函数组件时，如 `isCircle ? circle() : square()`，就更加难以调试了，无法定位返回的具体类型。

我们来复习一下，框架如何判断组件是否需要更新：

```dart
static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType
        && oldWidget.key == newWidget.key;
}
```

大部分情况下，我们没有设置 key, 如果不用 class, old 和 new 都是 Container，所以不会更新。

### Key 定义

可以定义`Key`，这对于性能优化和组件识别非常重要。

使用函数时，动画可能不会按预期工作，因为框架无法识别函数返回的不同类型。例如，`AnimatedSwitcher`需要能够区分它的子组件，如果使用函数且没有`Key`，框架会认为子组件类型相同，从而无法正确执行动画。

```dart
Widget animateSwitcher(bool showCircle) {
  return AnimatedSwitcher(
    duration: const Duration(milliseconds: 500),
    child: showCircle ? const Circle() : const Square(),
  );
}
```

## 实践建议

虽然可以使用函数来创建组件，但最好的做法是将函数返回的组件封装在类中，以便进行优化，例如使`StatelessWidget`成为`const`。

```dart
Widget squareWidget() => const Square();

class Square extends StatelessWidget {
  const Square({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(width: 100, height: 100, color: Colors.red);
  }
}
```

避免在`build`方法中创建“金字塔”代码结构，这会使得代码难以阅读和维护。如果代码超过 80 个字符限制，考虑将其重构为函数或类。

考虑创建新的组件类，这是更好的方法。尝试使用“Refactor->Extract Flutter Widget”功能。如果你的代码与当前类耦合得太紧，你将无法提取组件。

## 参考文章

- [Velog - Flutter 위젯 분리 시 class vs function](https://velog.io/@viiviii/flutter-function-vs-class)
- [Stack Overflow - What is the difference between functions and classes to create reusable widgets?](https://stackoverflow.com/questions/53234825/what-is-the-difference-between-functions-and-classes-to-create-reusable-widgets)
- [Flutter DevTools - YouTube](https://www.youtube.com/watch?v=IOyq-eTRhvo)
- [Widget Refactoring in Flutter: Helper Methods vs Separate Widgets](https://medium.com/flutter-community/widget-refactoring-in-flutter-helper-methods-vs-separate-widgets-fd0b09c49bc5)
- [Writing Better Flutter Widgets: How to Choose Between Classes and Functions](https://medium.com/@ubermenschdeveloper/writing-better-flutter-widgets-how-to-choose-between-classes-and-functions-4cdab104c2f)
