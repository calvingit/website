---
title: Flutter App 架构之 Repository 模式
description: "Flutter App 架构之 Repository 模式"
slug: flutter-app-repository-pattern
date: 2022-05-08
tags: [Flutter]
---

:::info

2024.10.20 更新: 补充 Repository 与状态管理结合的解决方案

:::

在 Flutter 应用开发中，Repository 模式是一种重要的架构设计模式，它帮助我们有效地管理和访问不同数据源的数据。通过将数据访问逻辑与业务逻辑和用户界面分离，Repository 模式能够提高代码的可维护性和可测试性。本文将深入探讨 Repository 模式的定义、使用场景、实现细节以及如何进行测试。

![Flutter App 架构图](https://cdn.zhangwen.site/uPic/repository-pattern.png)

<!-- truncate -->

## 什么是 Repository 模式？

Repository 模式是一种用于访问数据的设计模式，旨在将数据源的实现细节与应用程序的其他部分隔离。具体来说，Repository 的主要职责包括：

- **封装数据源**：将对外部数据源（如 REST API、本地数据库等）的访问封装在一个单独的类中。
- **转换数据格式**：将数据传输对象（DTO）转换为领域模型（Entities），使其能够被应用程序的其他层使用。
- **支持数据缓存**：在需要时，可以选择性地实现数据缓存，以提高性能。

通过这种方式，应用程序的其他部分（如 Domain 层和 Presentation 层）不需要关心具体的数据获取和存储细节，从而实现了良好的代码分离。

## 何时使用 Repository 模式？

Repository 模式特别适合以下场景：

- **复杂的数据层**：当应用程序需要处理多个不同的数据源和复杂的 API 时，Repository 模式可以帮助简化这一过程。
- **多样化的数据访问**：如果需要同时访问本地数据库、远程 API 或设备特定的 API（如相机、位置等），Repository 模式可以提供统一的接口。
- **易于维护**：当第三方 API 发生变化时，只需更新 Repository 的实现，而不必修改应用程序的其他部分。

## Repository 模式的实践

以下是一个简单的示例，展示如何在 Flutter 应用中实现 Repository 模式。假设我们要从 OpenWeatherMap API 获取天气数据。

### 定义 Repository 接口

首先，我们定义一个抽象类 `WeatherRepository`，用于声明获取天气数据的方法：

```dart
abstract class WeatherRepository {
  Future<Weather> getWeather({required String city});
}
```

### 实现 Repository

接下来，我们创建一个具体的 `HttpWeatherRepository` 类，实现上述接口，并负责实际的数据请求：

```dart
import 'package:http/http.dart' as http;

class HttpWeatherRepository implements WeatherRepository {
  HttpWeatherRepository({required this.api, required this.client});

  final OpenWeatherMapAPI api;
  final http.Client client;

  @override
  Future<Weather> getWeather({required String city}) async {
    // TODO: 发送请求，解析响应，并返回 Weather 对象或抛出错误
  }
}
```

### JSON 数据解析

我们还需要定义一个 `Weather` 类，用于表示天气模型，并实现 JSON 解析逻辑：

```dart
class Weather {
  // TODO: 声明所需属性

  factory Weather.fromJson(Map<String, dynamic> json) {
    // TODO: 解析 JSON 并返回验证后的 Weather 对象
  }
}
```

## 初始化 Repository

一旦定义了 Repository，我们需要将其初始化并提供给应用程序中的其他部分。可以使用依赖注入（DI）库，例如 `get_it` 或 `Provider`：

```dart
import 'package:get_it/get_it.dart';

GetIt.instance.registerLazySingleton<WeatherRepository>(
  () => HttpWeatherRepository(api: OpenWeatherMapAPI(), client: http.Client()),
);
```

## 测试 Repository

在测试中，我们通常希望用模拟或假对象替换真实的网络请求，以提高测试速度和可靠性。可以通过创建一个模拟类来实现这一点：

```dart
import 'package:mocktail/mocktail.dart';

class MockWeatherRepository extends Mock implements HttpWeatherRepository {}

void main() {
  test('获取天气数据', () async {
    final mockWeatherRepository = MockWeatherRepository();
    when(() => mockWeatherRepository.getWeather(city: 'London'))
        .thenAnswer((_) async => Weather(...));

    final weather = await mockWeatherRepository.getWeather(city: 'London');
    expect(weather, isA<Weather>());
  });
}
```

## 抽象类还是具体类

在创建 Repository 时，有人可能会问是否真的需要抽象类。

以下是两种方法的一些优缺点：

### 使用抽象类

- **优点**：

  - 清晰地展示接口，便于理解。
  - 可以轻松切换不同实现，例如从 `HttpWeatherRepository` 切换到 `DioWeatherRepository`。

- **缺点**：
  - 增加了额外的代码量。

### 使用具体类

- **优点**：

  - 减少了样板代码。

- **缺点**：
  - 如果需要更换实现，可能需要修改更多地方。

一般的选择，大部分肯定会跟 Java 或者其他面向对象语言一样的先写抽象类接口，再写具体实现。

但是，在我看来，使用具体类也无可厚非。因为 Dart 语言的特性，你可以继承任意一个类，然后通过重写方法来达到目的。写 mock 的时候，直接用 mock 类继承你的具体类即可。所以，如果一个接口只定义了一个方法，那么可以省略抽象类，直接写具体类。

## Repository 与状态管理结合的解决方案

Flutter 提供了多种状态管理解决方案，包括 BLoC、Provider 和 Riverpod。每种解决方案都有其独特的优点和适用场景。

### BLoC（Business Logic Component）

BLoC 是一种基于事件驱动的状态管理模式，适合处理复杂的 UI 状态和业务逻辑。它通过 Stream 来响应事件并更新状态。

**集成示例**：

1. **定义事件和状态**：

```dart
abstract class WeatherEvent {}

class FetchWeather extends WeatherEvent {
  final String city;

  FetchWeather(this.city);
}

abstract class WeatherState {}

class WeatherInitial extends WeatherState {}

class WeatherLoading extends WeatherState {}

class WeatherLoaded extends WeatherState {
  final Weather weather;

  WeatherLoaded(this.weather);
}

class WeatherError extends WeatherState {
  final String message;

  WeatherError(this.message);
}
```

2. **创建 BLoC**：

```dart
class WeatherBloc extends Bloc<WeatherEvent, WeatherState> {
  final WeatherRepository repository;

  WeatherBloc(this.repository) : super(WeatherInitial());

  @override
  Stream<WeatherState> mapEventToState(WeatherEvent event) async* {
    if (event is FetchWeather) {
      yield WeatherLoading();
      try {
        final weather = await repository.getWeather(city: event.city);
        yield WeatherLoaded(weather);
      } catch (e) {
        yield WeatherError(e.toString());
      }
    }
  }
}
```

3. **在 UI 中使用 BLoC**：

```dart
class WeatherScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => WeatherBloc(RepositoryProvider.of<WeatherRepository>(context)),
      child: Scaffold(
        appBar: AppBar(title: Text('Weather')),
        body: BlocBuilder<WeatherBloc, WeatherState>(
          builder: (context, state) {
            if (state is WeatherLoading) {
              return Center(child: CircularProgressIndicator());
            } else if (state is WeatherLoaded) {
              return Text('Temperature: ${state.weather.temperature}');
            } else if (state is WeatherError) {
              return Text('Error: ${state.message}');
            }
            return Container();
          },
        ),
      ),
    );
  }
}
```

### Provider

Provider 是 Flutter 官方推荐的状态管理解决方案，它通过 ChangeNotifier 和 InheritedWidget 来实现状态共享。

**集成示例**：

1. **创建 ChangeNotifier**：

```dart
class WeatherNotifier extends ChangeNotifier {
  final WeatherRepository repository;
  Weather? weather;
  String? errorMessage;

  WeatherNotifier(this.repository);

  Future<void> fetchWeather(String city) async {
    try {
      weather = await repository.getWeather(city: city);
      errorMessage = null;
    } catch (e) {
      errorMessage = e.toString();
    }
    notifyListeners();
  }
}
```

2. **在 UI 中使用 Provider**：

```dart
class WeatherScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => WeatherNotifier(RepositoryProvider.of<WeatherRepository>(context)),
      child: Scaffold(
        appBar: AppBar(title: Text('Weather')),
        body: Consumer<WeatherNotifier>(
          builder: (context, notifier, child) {
            if (notifier.weather != null) {
              return Text('Temperature: ${notifier.weather!.temperature}');
            } else if (notifier.errorMessage != null) {
              return Text('Error: ${notifier.errorMessage}');
            }
            return Center(child: CircularProgressIndicator());
          },
        ),
      ),
    );
  }
}
```

### Riverpod

Riverpod 是一个灵活且强大的状态管理库，提供了更好的编译时安全性和灵活性。

**集成示例**：

1. **定义 Provider**：

```dart
final weatherRepositoryProvider = Provider<WeatherRepository>((ref) => HttpWeatherRepository(client: http.Client(), apiKey: 'YOUR_API_KEY'));

final weatherProvider = FutureProvider.family<Weather, String>((ref, city) async {
  final repository = ref.watch(weatherRepositoryProvider);
  return await repository.getWeather(city: city);
});
```

2. **在 UI 中使用 Riverpod**：

```dart
class WeatherScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final city = 'London'; // 示例城市

    AsyncValue<Weather> weather = ref.watch(weatherProvider(city));

    return Scaffold(
      appBar: AppBar(title: Text('Weather')),
      body: weather.when(
        data: (weatherData) => Text('Temperature: ${weatherData.temperature}'),
        loading: () => Center(child: CircularProgressIndicator()),
        error: (error, stack) => Text('Error: $error'),
      ),
    );
  }
}
```

## 总结

通过使用 Repository 模式，可以有效地隐藏数据层的实现细节，使得应用程序的其他部分能够直接处理类型安全的模型类。这种模式不仅提高了代码的可维护性，也使得应用程序对第三方库或 API 的变化更加健壮。在设计 Flutter 应用架构时，考虑引入 Repository 模式，将有助于构建更清晰、更易于扩展和测试的代码结构。

另外，将 Repository 模式与 Flutter 的状态管理解决方案结合使用，可以有效地分离数据访问逻辑和 UI 状态管理。这种架构不仅提高了代码的可维护性，还增强了应用程序的可测试性。无论是使用 BLoC、Provider，还是 Riverpod，都可以根据项目需求选择合适的状态管理方案，以实现最佳的开发体验和应用性能。

参考文章：

- https://blog.csdn.net/gitblog_00068/article/details/139366383
- https://flutter.ducafecat.com/pubs/state-management-packages
- https://juejin.cn/post/7163925807893577735
- https://www.rtcdeveloper.cn/cn/community/blog/23871
- https://docs.flutter.cn/community/tutorials/state-management-package-getx-provider-analysis/
- https://blog.csdn.net/eclipsexys/article/details/124811671
- https://dev.to/marwamejri/flutter-clean-architecture-1-an-overview-project-structure-4bhf
- https://docs.flutter.cn/data-and-backend/state-mgmt/options/
- https://codewithandrea.com/articles/flutter-repository-pattern/
