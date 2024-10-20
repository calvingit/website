---
title: Flutter App 架构的 Presentation 层
description: "Flutter App 架构的 Presentation 层"
slug: flutter-app-presentation-layer
date: 2022-05-08
tags: [Flutter]
---


在 Flutter 应用开发中，Presentation 层是用户界面与业务逻辑之间的桥梁。它负责展示数据并处理用户输入，同时确保业务逻辑与 UI 代码的分离。这种分离使得代码更加可测试和易于维护，尤其是在应用变得复杂时。本文将深入探讨 Flutter 应用中的 Presentation 层，包括其结构、功能以及如何有效实现。
<!-- truncate -->

![Flutter App 架构图](https://cdn.zhangwen.site/uPic/flutter-app-architecture.png)

## Presentation 层的定义

Presentation 层主要负责以下几个方面：

- **展示数据**：将从 Domain 层获取的数据以用户友好的方式呈现。
- **处理用户输入**：响应用户的操作，例如按钮点击和表单提交。
- **管理状态**：维护 UI 的状态，例如加载状态、错误状态和成功状态。

通过将这些职责集中在 Presentation 层，可以实现更好的代码组织和可读性。

## 设计模式与分离关注点

在实现 Presentation 层时，采用合适的设计模式至关重要。常用的设计模式包括：

- **MVVM（Model-View-ViewModel）**：通过 ViewModel 来管理 UI 状态和业务逻辑，使得 View 只关注展示数据。
- **BLoC（Business Logic Component）**：通过流（Streams）来处理事件和状态变化，保持 UI 的反应式。

在 Flutter 中，使用 `Provider` 和 `Riverpod` 等状态管理库可以有效地实现这些模式。

## 使用控制器管理业务逻辑

在 Presentation 层中，控制器负责协调 UI 和业务逻辑。控制器可以持有业务逻辑、管理小部件状态，并与数据层交互。例如，在一个简单的认证流程中，可以定义一个控制器来处理用户登录：

```dart
class SignInScreenController extends AsyncNotifier<void> {
  @override
  FutureOr<void> build() {
    // 初始化
  }

  Future<void> signInAnonymously() async {
    final authRepository = ref.read(authRepositoryProvider);
    state = const AsyncLoading();
    state = await AsyncValue.guard(authRepository.signInAnonymously);
  }
}
```

该控制器通过 `AsyncNotifier` 管理异步操作的状态，如加载、成功和错误。这种结构使得 UI 组件可以专注于展示，而不必担心业务逻辑。

## 实现示例：简单认证流程

假设我们有一个简单的认证流程，用户可以匿名登录。以下是实现过程的关键步骤：

1. **定义 AuthRepository**：用于处理认证相关操作。

   ```dart
   abstract class AuthRepository {
     Stream<AppUser?> authStateChanges();
     Future<AppUser> signInAnonymously();
     Future<void> signOut();
   }
   ```

2. **创建 SignInScreen 小部件**：负责展示登录界面。

   ```dart
   class SignInScreen extends ConsumerWidget {
     const SignInScreen({Key? key}) : super(key: key);

     @override
     Widget build(BuildContext context, WidgetRef ref) {
       final AsyncValue<void> state = ref.watch(signInScreenControllerProvider);
       return Scaffold(
         appBar: AppBar(title: const Text('Sign In')),
         body: Center(
           child: ElevatedButton(
             child: state.isLoading ? const CircularProgressIndicator() : const Text('Sign in anonymously'),
             onPressed: state.isLoading ? null : () => ref.read(signInScreenControllerProvider.notifier).signInAnonymously(),
           ),
         ),
       );
     }
   }
   ```

3. **处理状态变化**：使用 `ref.listen` 来监听状态变化并显示错误信息。

   ```dart
   ref.listen<AsyncValue>(
     signInScreenControllerProvider,
     (_, state) {
       if (!state.isLoading && state.hasError) {
         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.error.toString())));
       }
     },
   );
   ```

## 总结

通过将业务逻辑与 UI 分离，Presentation 层使得 Flutter 应用更加模块化和可维护。使用控制器来管理状态和交互，可以提高代码的可测试性，并减少重复代码。在设计 Presentation 层时，应关注以下几点：

- 使用合适的设计模式来分离关注点。
- 利用控制器来管理业务逻辑和 UI 状态。
- 确保 UI 组件只关注展示和用户交互。

这种结构不仅提升了代码质量，也为未来的扩展和维护奠定了基础。

参考文章:

- [Flutter App Architecture: The Presentation Layer](https://codewithandrea.com/articles/flutter-presentation-layer/)
