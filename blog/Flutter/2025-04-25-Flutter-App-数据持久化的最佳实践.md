---
title: "Flutter App 数据持久化的最佳实践"
description: "flutter, isar, sqlite, drift, hive, 数据库"
slug: flutter-data-persistence
date: 2025-04-25
tags: [Flutter]
---

:::tip
本文由 Gemini DeepResearch 辅助撰写。
:::

在移动应用开发中，**数据持久化**（Data Persistence）指的是将数据安全可靠地存储在设备本地，以便在应用会话之间甚至设备重启后依然可以访问。
在 Flutter 应用中，数据持久化不仅关乎用户体验的连贯性，也直接关系到应用功能的完整性与专业度。

典型场景如：

- 保存用户主题设置、语言偏好（例如夜间模式）。
- 维护用户登录状态，避免每次打开 App 都需重新认证。
- 存储业务数据、图片视频离线缓存数据等。

正确选择持久化方案、合理设计存储结构，是开发高质量 Flutter 应用的基础。本文将系统介绍主流 Flutter 数据持久化技术及最佳实践，助您在项目中灵活应用、精准落地。

<!-- truncate -->

## 数据持久化方案概览

根据数据特性和存储需求不同，Flutter 中的数据持久化大致可分为以下几类：

| 分类             | 典型用途                         | 常用技术                                |
| ---------------- | -------------------------------- | --------------------------------------- |
| 键值对存储       | 配置项、小量状态保存             | `shared_preferences`、`hive`            |
| 关系型数据库     | 复杂结构化数据、关联查询         | `sqflite`、`drift`、`floor`             |
| 安全存储         | 敏感信息（如密码、令牌）         | `flutter_secure_storage`                |
| 文件存储         | 大型非结构化数据（如图片、缓存） | `dart:io` + `path_provider`             |
| 高性能对象数据库 | 离线缓存、大数据量、复杂嵌套结构 | `isar`、`objectbox`、`realm`、`sembast` |

## 常见的持久化方案

### 1. Key-Value 存储

#### SharedPreferences —— 简单配置存储

适合场景：

- 主题偏好、语言设置、首次启动标识、登录状态标记等少量简单数据。

示例代码：

```dart
import 'package:shared_preferences/shared_preferences.dart';

Future<void> saveThemePreference(String theme) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('appTheme', theme);
}

Future<String?> readThemePreference() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('appTheme');
}
```

优缺点总结：

- ✅ 简单易用，跨平台一致。
- ❌ 不支持复杂对象存储，且数据未加密。

---

#### Hive —— 高性能本地 NoSQL

适合场景：

- 本地缓存、偏好设置、用户数据、离线列表等。

基本使用：

```dart
import 'package:hive/hive.dart';

Future<void> saveThemeHive() async {
  var box = await Hive.openBox('settings');
  await box.put('theme', 'dark');
}

Future<String?> readThemeHive() async {
  var box = await Hive.openBox('settings');
  return box.get('theme');
}
```

存储自定义对象：（需要注册 TypeAdapter）

```dart
@HiveType(typeId: 0)
class User extends HiveObject {
  @HiveField(0)
  final String name;

  @HiveField(1)
  final int age;

  User(this.name, this.age);
}
```

优缺点总结：

- ✅ 极高的读写性能，可存储 Dart 对象。
- ✅ 内建 AES 加密，支持安全存储。
- ❌ 社区维护热度波动，处理复杂查询能力较弱。

### 2. 关系型数据库（SQL）

#### sqflite —— 原生 SQLite 操作

适合场景：

- 多表关联、复杂查询、需要事务管理的本地应用（如 To-Do、笔记、财务 App）。

建表与插入示例：

```dart
import 'package:sqflite/sqflite.dart';

final Database db = await openDatabase('my_db.db', version: 1,
  onCreate: (db, version) {
    return db.execute(
      'CREATE TABLE tasks(id INTEGER PRIMARY KEY, title TEXT, completed INTEGER)',
    );
  },
);

Future<void> insertTask(String title) async {
  await db.insert('tasks', {'title': title, 'completed': 0});
}
```

优缺点总结：

- ✅ 完整 SQL 支持，性能成熟稳定。
- ❌ 无类型安全，SQL 语句需开发者自行管理。

#### Drift —— 类型安全 + 响应式 SQLite 封装

适合场景：

- 要求类型安全、数据变化实时监听更新 UI 的应用。

简易示例：

```dart
@DriftDatabase(tables: [Todos])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(NativeDatabase.memory());

  @override
  int get schemaVersion => 1;
}

@DataClassName('Todo')
class Todos extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get content => text()();
}
```

### 3. 安全存储（加密）

#### flutter_secure_storage —— 安全保存敏感信息

适合场景：

- 登录令牌、API 密钥、用户密码等。

使用示例：

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

Future<void> saveToken(String token) async {
  await storage.write(key: 'auth_token', value: token);
}

Future<String?> readToken() async {
  return await storage.read(key: 'auth_token');
}
```

优缺点总结：

- ✅ 平台原生加密保障。
- ✅ 简单高效。
- ❌ 仅适合小数据量存储。

### 4. 文件存储

适合场景：

- 缓存大文件（如图片、文档）、日志记录。

读写示例：

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

Future<void> writeFile(String fileName, String content) async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File('${dir.path}/$fileName');
  await file.writeAsString(content);
}

Future<String> readFile(String fileName) async {
  final dir = await getApplicationDocumentsDirectory();
  final file = File('${dir.path}/$fileName');
  return await file.readAsString();
}
```

### 5. 高性能对象数据库（新兴趋势）

#### Isar —— 超高性能嵌入式数据库

特点：

- 零依赖，纯 Dart。
- 支持复杂查询、关系嵌套、索引优化。
- 事务与 Streams 内建，超高速读写。

#### 其他方案

- ObjectBox：极快写入，适合嵌套对象。
- Realm：自动云同步。
- Sembast：基于 JSON 的轻量键值存储。

## 如何选择持久化方案？

| 场景                          | 推荐方案                             |
| ----------------------------- | ------------------------------------ |
| 简单配置项                    | `shared_preferences`                 |
| 简单对象缓存                  | `hive`                               |
| 复杂关联数据（需要 SQL 查询） | `sqflite` / `drift` / `floor`        |
| 敏感信息存储                  | `flutter_secure_storage`             |
| 大型文件存储                  | `path_provider` + `dart:io` 文件操作 |
| 大规模数据、高并发            | `isar` / `objectbox`                 |

## 实际项目数据持久化架构示例

以中大型 Flutter 应用为例，推荐以下存储层架构设计：

### 架构图概览

```text
[Data Repository]
     ↓
[Local Storage Abstraction Layer]
     ↓
[Storage Engine: (Hive/Isar/sqflite)]
```

### 关键分层

1. **Repository 层（业务逻辑接口）**
   - 暴露统一 API，如 `saveUserProfile(User user)`、`loadUserProfile()`。
   - 屏蔽存储实现细节。

2. **Storage Abstraction 层（存储接口）**
   - 定义抽象存储接口 `StorageService`。
   - 支持灵活切换后端（Hive、Isar、Sqflite等）。

3. **具体存储实现层（Storage Engine）**
   - 基于选定技术（如 Hive、Isar、Sqflite）实现持久化逻辑。
   - 封装底层 API，统一错误处理和日志记录。

### 示例接口设计

```dart
abstract class StorageService {
  Future<void> save<T>(String key, T value);
  Future<T?> read<T>(String key);
  Future<void> delete(String key);
}

class HiveStorageService implements StorageService {
  @override
  Future<void> save<T>(String key, T value) async {
    final box = await Hive.openBox('defaultBox');
    await box.put(key, value);
  }

  @override
  Future<T?> read<T>(String key) async {
    final box = await Hive.openBox('defaultBox');
    return box.get(key) as T?;
  }

  @override
  Future<void> delete(String key) async {
    final box = await Hive.openBox('defaultBox');
    await box.delete(key);
  }
}
```

通过这种分层设计，应用能轻松切换底层存储方案，并保持业务代码的稳定性和可维护性。

## 最佳实践总结

- **异步处理**：所有持久化操作必须 `async/await`，避免阻塞主线程。
- **加密敏感数据**：不要明文存储密码、Token。
- **模式迁移**：数据库升级时，确保数据迁移逻辑完善。
- **合理建模**：保持数据结构清晰，避免冗余。
- **规范文档**：统一团队规范，记录存储层协议及变更历史。

## 未来展望

未来，Flutter 数据持久化方向将呈现如下趋势：

- 零配置高性能数据库（如 Isar）逐步替代传统 SQL 层操作。
- 端到端加密、本地隐私保护成为标配需求。
- 本地存储自动与云端同步（如 Realm Sync、Firebase Sync）普及化。
- 更丰富的离线优先设计模式与冲突解决策略标准化。

开发者应持续学习并在项目中灵活运用，以应对不断变化的技术挑战。

## 参考资料

1. [Data Persistence on Flutter - Kodeco](https://www.kodeco.com/5965747-data-persistence-on-flutter)
2. [Local Data Persistence - Code With Andrea Pro](https://pro.codewithandrea.com/get-started-flutter/intro/11-local-data-persistence)
3. [Solving Data Persistence Challenges in Flutter with SQLite - Blup](https://www.blup.in/blog/solving-data-persistence-challenges-in-flutter-with-sqlite)
4. [Hive Pros/Cons : r/FlutterDev - Reddit](https://www.reddit.com/r/FlutterDev/comments/gqbka2/hive_proscons/)
5. [The Pros and Cons of Using Hive Software - ProjectManagers.net](https://projectmanagers.net/the-pros-and-cons-of-using-hive-software/)
6. [Isar Database - Worth it at this point? : r/FlutterDev - Reddit](https://www.reddit.com/r/FlutterDev/comments/1cj5dhf/isar_database_worth_it_at_this_point/)
7. [Persistent storage architecture: SQL - Flutter Documentation](https://docs.flutter.dev/app-architecture/design-patterns/sql)
8. [ObjectBox](https://objectbox.io)
9. [Isar](https://isar.dev/)
