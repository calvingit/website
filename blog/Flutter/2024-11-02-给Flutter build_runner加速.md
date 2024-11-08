---
title: 给Flutter build_runner加速
description: "加快Flutter build_runner的运行速度"
slug: flutter-build-runner
date: 2024-11-02
tags: [Flutter]
---


Flutter 的 dart sdk是不带反射功能的，导致社区需要开发一些注解工具来辅助生成一些模板代码，大部分都是基于官方的[build_runner](https://pub.dev/packages/build_runner)
工具。

但是在构建的时候，每次都去生成模板代码，非常耗时。尤其是当你的项目比较大时，有可能超过1分多钟来等待处理完成，而且每次都得重新编译，非常影响开发效率。

另外，你用的生成库越多，越影响生成速度。

常见的一些支持注解的库有：

- [freezed](https://pub.dev/packages/freezed)
- [retrofit](https://pub.dev/packages/retrofit)
- [json_serializable](https://pub.dev/packages/json_serializable)
- [mockito](https://pub.dev/packages/mockito)
- [hive](https://pub.dev/packages/hive)
- [auto_route](https://pub.dev/packages/auto_route)
- [injectable](https://pub.dev/packages/injectable)

解决方案就是给每个库指定特定文件，而不是每个runner都扫描全部文件。

创建一个`build.yaml`文件，设置参考如下：

```yaml
targets:
  $default:
    builders:
      freezed:
        enabled: true
        options:
          json: false
        generate_for:
          - lib/core/model/configuration.dart
          - lib/core/model/product.dart
          - lib/core/model/user.dart
          - lib/presentation/cubit/**/*_cubit.dart
          - lib/presentation/cubit/**/*_state.dart
      retrofit_generator|retrofit_generator:
        enabled: true
        generate_for:
          - lib/data/source/**/*api_source.dart
      json_serializable|json_serializable:
        enabled: true
        generate_for:
          - lib/data/source/**/dto/*dto.dart
      mockito|mockBuilder:
        enabled: true
        generate_for:
          - test/mocks/generate_mocks.dart
      hive_generator|hive_generator:
        enabled: true
        generate_for:
          - lib/data/source/persistent_storage/dto/*.dart
      auto_route_generator|auto_route_generator:
        enabled: true
        generate_for:
          - lib/presentation/app_router.dart
          - lib/presentation/page/**/*page.dart
      auto_route_generator|auto_router_generator:
        enabled: true
        generate_for:
          - lib/presentation/app_router.dart
      injectable_generator|injectable_builder:
        enabled: true
        generate_for:
          - lib/injection.dart
          - lib/core/use_case/**/*_use_case.dart
          - lib/data/repository/*_repository.dart
          - lib/data/service/*_service.dart
          - lib/data/source/**/*_source.dart
          - lib/presentation/cubit/**/*_cubit.dart
          - lib/presentation/app_router.dart
```