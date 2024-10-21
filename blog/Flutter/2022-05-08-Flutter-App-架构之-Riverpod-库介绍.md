---
title: Flutter App 架构之 Riverpod 库介绍
description: "Flutter App 架构之 Riverpod 库介绍"
slug: flutter-app-architecture-riverpod-introduction
date: 2022-05-08
tags: [Flutter]
---

Riverpod 是一个强大的状态管理库，旨在简化 Flutter 应用程序中的状态管理。作为 Provider 的演进版，Riverpod 提供了更灵活和可扩展的方式来处理应用程序的状态。本文将介绍 Riverpod 的基本使用，包括各种 Provider 类型的使用，以及与 Provider 的对比，并展示在真实开发场景中的应用。

<!-- truncate -->

## 安装 Riverpod

要开始使用 Riverpod，首先需要在 `pubspec.yaml` 文件中添加依赖：

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.3
```

安装后，运行以下命令获取依赖：

```bash
flutter pub get
```

## 基本概念

Riverpod 的核心概念是 Provider，它是一个用于管理和访问状态的对象。Provider 可以创建、读取和监听状态变化。

## Provider 类型

Riverpod 提供了多种类型的 Provider，以满足不同的需求：

1. **Provider**：最基本的 Provider，用于提供一个静态值。

   ```dart
   final helloWorldProvider = Provider<String>((ref) => 'Hello, Riverpod!');
   ```

2. **StateProvider**：用于管理简单的状态（如整数、布尔值等）。

   ```dart
   final counterProvider = StateProvider<int>((ref) => 0);
   ```

3. **FutureProvider**：用于处理异步操作，并提供其结果。

   ```dart
   final userDataProvider = FutureProvider<User>((ref) async {
     final response = await http.get('https://api.example.com/user');
     return User.fromJson(json.decode(response.body));
   });
   ```

4. **StreamProvider**：用于处理实时数据流。

   ```dart
   final chatMessagesProvider = StreamProvider<List<Message>>((ref) {
     return chatService.streamMessages();
   });
   ```

5. **NotifierProvider**：用于创建具有复杂状态逻辑的 Notifier 类。

   ```dart
   class CounterNotifier extends StateNotifier<int> {
     CounterNotifier() : super(0);

     void increment() => state++;
   }

   final counterNotifierProvider = NotifierProvider<CounterNotifier, int>(
       (ref) => CounterNotifier());
   ```

## 使用示例

以下是一个完整的示例，展示如何使用 Riverpod 创建一个简单的计数器应用：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final counterProvider = StateProvider<int>((ref) => 0);

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Counter App')),
        body: Center(child: Counter()),
      ),
    );
  }
}

class Counter extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider).state;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider).state++,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

## Riverpod 在真实开发场景中的具体应用

Riverpod 是 Flutter 状态管理库的一个重要版本，提供了更灵活、更强大的状态管理解决方案。它不仅简化了状态管理的实现，还提高了代码的可维护性和可测试性。本文将探讨 Riverpod 在真实开发场景中的具体应用，包括常见的使用案例和最佳实践。

### 1. 用户认证

在许多应用中，用户认证是一个常见的需求。通过使用 Riverpod，可以轻松管理用户的登录状态和相关信息。

**示例代码：**

```dart
final authProvider = StateProvider<User?>((ref) => null);

class AuthService {
  Future<void> signIn(String email, String password) async {
    // 实现用户登录逻辑
    ref.read(authProvider).state = User(email: email);
  }

  void signOut() {
    ref.read(authProvider).state = null;
  }
}
```

在 UI 中，可以通过 `authProvider` 来获取当前用户状态并更新界面：

```dart
class UserProfile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).state;

    return Scaffold(
      appBar: AppBar(title: Text('User Profile')),
      body: Center(
        child: user != null
            ? Text('Welcome, ${user.email}')
            : Text('Please log in.'),
      ),
    );
  }
}
```

### 2. 数据获取与缓存

在处理 API 数据时，使用 `FutureProvider` 和 `StreamProvider` 可以有效地管理异步数据获取和实时数据流。

**示例代码：**

```dart
final userDataProvider = FutureProvider<User>((ref) async {
  final response = await http.get('https://api.example.com/user');
  return User.fromJson(json.decode(response.body));
});
```

在 UI 中，可以轻松处理加载状态和错误：

```dart
class UserScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsyncValue = ref.watch(userDataProvider);

    return userAsyncValue.when(
      data: (user) => Text('User: ${user.name}'),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

### 3. 表单管理

Riverpod 可以帮助简化表单状态的管理，尤其是在处理多个输入字段时。

**示例代码：**

```dart
final nameProvider = StateProvider<String>((ref) => '');
final emailProvider = StateProvider<String>((ref) => '');

class RegistrationForm extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final name = ref.watch(nameProvider).state;
    final email = ref.watch(emailProvider).state;

    return Column(
      children: [
        TextField(
          onChanged: (value) => ref.read(nameProvider).state = value,
          decoration: InputDecoration(labelText: 'Name'),
        ),
        TextField(
          onChanged: (value) => ref.read(emailProvider).state = value,
          decoration: InputDecoration(labelText: 'Email'),
        ),
        ElevatedButton(
          onPressed: () {
            // 提交表单逻辑
          },
          child: Text('Register'),
        ),
      ],
    );
  }
}
```

### 4. 状态共享与跨组件通信

Riverpod 的设计使得在不同组件之间共享状态变得简单。例如，在一个购物车应用中，可以使用 `StateNotifier` 来管理购物车的状态。

**示例代码：**

```dart
class CartNotifier extends StateNotifier<List<Product>> {
  CartNotifier() : super([]);

  void addProduct(Product product) {
    state = [...state, product];
  }

  void removeProduct(Product product) {
    state = state.where((item) => item.id != product.id).toList();
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, List<Product>>((ref) {
  return CartNotifier();
});
```

在 UI 中，可以通过 `cartProvider` 来访问和修改购物车状态：

```dart
class CartScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartItems = ref.watch(cartProvider);

    return ListView.builder(
      itemCount: cartItems.length,
      itemBuilder: (context, index) {
        return ListTile(title: Text(cartItems[index].name));
      },
    );
  }
}
```

## 与 Provider 的对比

虽然 Riverpod 是从 Provider 演变而来的，但它在许多方面进行了改进：

- **编译时安全性**：Riverpod 提供了更强的类型安全性，可以在编译时捕获错误，而不是在运行时。

- **无需 BuildContext**：在 Riverpod 中，您可以通过 `ref` 对象访问 Provider，而不需要依赖于 BuildContext。这使得代码更加简洁和易于测试。

- **更灵活的依赖注入**：Riverpod 支持更复杂的依赖注入模式，使得管理和组合多个 Provider 更加高效。

- **支持异步和流**：Riverpod 的 FutureProvider 和 StreamProvider 提供了对异步操作和实时数据流的内置支持，使得处理这些场景更加方便。

- **性能优化**：Riverpod 在性能方面进行了优化，确保只有受影响的部分会重新构建，从而减少不必要的重绘。

## 总结

Riverpod 是一个功能强大且灵活的状态管理库，适用于 Flutter 应用程序。它通过提供多种类型的 Provider 和改进的依赖注入机制，使得状态管理变得更加高效和可维护。在真实开发场景中，Riverpod 可以帮助开发者轻松管理复杂应用中的各种状态，从而提高开发效率和代码质量。

参考文章:

- https://kamranhccp.hashnode.dev/flutter-riverpod-20-the-full-ultimate-guide
- https://blog.csdn.net/eclipsexys/article/details/124811671
- https://juejin.cn/post/7163925807893577735
- https://riverpod.dev/docs/introduction/getting_started
- https://www.dbestech.com/tutorials/flutter-riverpod-new-version
- https://blog.stackademic.com/flutter-app-architecture-inspiring-domain-driven-design-d681e5e7c0c6?gi=9f48a45ccd83
- https://docs.flutter.cn/data-and-backend/state-mgmt/options/
- https://www.intelivita.com/blog/flutter-architecture/
