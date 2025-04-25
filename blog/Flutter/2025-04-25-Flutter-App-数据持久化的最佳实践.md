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

## 引言

在移动应用开发中，数据持久化是将应用数据存储在设备本地以便在应用会话之间或应用关闭后仍然可用的关键过程 ^1^。对于 Flutter 应用而言，数据持久化不仅关乎用户体验的连贯性，更是应用实用价值的体现。试想一款笔记应用，用户辛勤记录的内容在应用关闭后消失无踪；或是一款任务管理应用，用户设定的待办事项在下次打开时荡然无存，这样的应用无疑会给用户带来极大的挫败感 ^1^。数据持久化使得用户能够从上次离开的地方继续操作，保持其设置、进度和个性化偏好 ^1^。无论是保存用户的主题偏好、语言选择，还是记录简单的应用状态（如用户登录状态），抑或是存储更复杂的用户数据，数据持久化都是确保应用实用性和用户满意度的基石 ^2^。因此，选择合适的数据持久化方案并遵循最佳实践，对于开发高质量的 Flutter 应用至关重要。

<!-- truncate -->

## 数据持久化方案

Flutter 框架提供了多种本地数据存储方案，以满足不同类型和复杂程度的数据持久化需求 ^2^。开发者可以根据应用的具体需求，例如数据量的大小、结构的复杂性、是否涉及敏感信息以及对性能的要求等，选择最合适的方案。这些方案主要可以分为以下几类：键值对存储、关系型数据库、安全存储和文件存储 ^2^。理解每种方案的特点和适用场景，是选择最佳实践的第一步。

- **键值对存储：** 适用于存储简单、轻量级的数据，例如用户的偏好设置或应用的简单状态 ^2^。

- **关系型数据库：** 适用于存储结构化数据，并需要进行复杂的查询和关联操作的场景 ^3^。

- **安全存储：** 专门用于存储敏感数据，例如用户的身份验证令牌或个人凭据，提供加密保护 ^3^。

- **文件存储：** 适用于存储大型非结构化数据，例如图片、音频或文档文件 ^2^。

Flutter 生态系统为这些类别提供了丰富的插件和库，使得开发者能够轻松地在应用中实现数据持久化功能。

### Key-Value 存储

- **Shared Preferences：轻量级的基本配置存储**
  shared_preferences 插件是 Flutter 中最常用且入门最简单的数据持久化方案之一 ^1^。它实际上是对 Android 上的 SharedPreferences API 和 iOS 上的 NSUserDefaults API 的封装 ^1^。shared_preferences 非常适合存储少量的原始数据类型，例如布尔值、数字、字符串以及字符串列表 ^1^。在应用中，它常用于保存用户界面的主题偏好、应用的语言选择、度量单位的设置、用户的登录状态以及是否已完成新手引导等基本配置信息 ^1^。
  使用 shared_preferences 非常简单，Flutter 提供了直接的 getter 和 setter 方法来操作不同数据类型的数据 ^1^。例如，保存主题偏好的代码如下 ^1^：

```Dart
import 'package:shared_preferences/shared_preferences.dart';

saveThemePreference(String theme) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('appTheme', theme);
}

读取主题偏好的代码如下 ^1^：
Dart
import 'package:shared_preferences/shared_preferences.dart';

readThemePreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? theme = prefs.getString('appTheme');
  print(theme);
}
```

shared_preferences 的优势在于其易用性和跨平台兼容性 ^1^。然而，它也存在一些局限性 ^1^。首先，它仅支持原始数据类型和字符串列表，无法直接存储复杂的对象或大型数据集 ^1^。其次，存储的数据没有进行加密，因此不适合存储敏感信息 ^1^。最后，它没有提供结构化的数据存储和查询机制 ^1^。虽然 shared_preferences 对于存储少量数据非常快速高效，但如果存储大量数据可能会导致性能问题 ^12^。因此，在选择 shared_preferences 时，开发者需要权衡其便利性与应用的数据需求。

- **Hive：快速的 NoSQL 数据库，适用于结构化数据**
  Hive 是一个用纯 Dart 编写的快速、轻量级的 NoSQL 键值数据库 ^3^。相较于 shared_preferences，Hive 提供了更强大的功能和更好的性能，尤其是在写入和删除操作方面 ^6^。Hive 的一个显著特点是它能够直接存储 Dart 对象，开发者只需要为自定义对象创建类型适配器（TypeAdapter）即可 ^5^。此外，Hive 内置了 AES-256 加密，可以用于存储对安全性有一定要求的非高度敏感数据 ^3^。
  在应用中，Hive 可以用于缓存数据、存储用户个人资料、应用状态等 ^5^。使用 Hive 的基本流程是打开一个 Box（类似于关系型数据库中的表），然后通过键值对的方式进行数据的添加和检索 ^18^。例如，存储一个用户偏好的主题可以使用类似以下代码 ^18^：

```Dart
var box = await Hive.openBox('userPreferences');
box.put('theme', 'dark');
String? theme = box.get('theme');
```

虽然 Hive 在性能和功能上优于 shared_preferences，但社区中也存在一些关于其稳定性和长期维护的讨论 ^32^。此外，Hive 在处理复杂的关联数据和提供强大的查询功能方面可能不如关系型数据库 ^32^。因此，对于需要高度结构化和复杂查询的应用，开发者可能需要考虑其他方案。

### SQLite

- **sqflite：直接操作 SQLite 数据库**
  sqflite 插件使得 Flutter 应用能够使用 SQLite 数据库，这是一个轻量级、无服务器的关系型数据库 ^3^。sqflite 提供了异步 API，允许开发者使用 SQL 语言在本地数据库中进行读写操作 ^3^。对于需要本地存储复杂和关联结构数据的应用，例如任务管理应用、笔记应用或个人财务跟踪应用，sqflite 是一个非常合适的选择 ^3^。
  sqflite 支持标准的 SQL 查询和 CRUD（创建、读取、更新、删除）操作 ^4^。其优点包括高效性、速度、跨平台兼容性以及对查询的完全控制 ^4^。开发者可以使用 SQL 语句灵活地操作数据，满足各种复杂的业务需求。例如，创建一个 dogs 表的代码片段如下 ^9^：

```Dart
await db.execute(
  'CREATE TABLE dogs(id INTEGER PRIMARY KEY, name TEXT, age INTEGER)',
);
```

虽然 sqflite 功能强大，但也存在一些潜在的缺点 ^3^。它不是类型安全的，这可能导致难以诊断的错误 ^3^。此外，开发者需要编写 SQL 查询语句，这可能需要一定的 SQL 知识。为了优化 sqflite 的性能，开发者可以采用一些策略，例如对大型查询使用后台 isolates、避免不必要的写入操作、批量执行查询以及使用事务 ^4^。

- **Drift：确保类型安全和响应式数据处理**
  Drift 是一个构建在 SQLite 之上的类型安全且响应式的持久化库 ^3^。Drift 的主要优势在于其类型安全性，它可以在编译时检查 SQL 查询的正确性，从而避免了许多运行时错误 ^36^。此外，Drift 还提供了响应式编程的支持，开发者可以使用 Streams 来监听数据库的变化并实时更新 UI ^3^。Drift 还支持自动生成 SQL 代码和数据库迁移 ^3^。对于需要存储复杂关联数据并对类型安全有较高要求的应用，Drift 是一个非常值得考虑的选择 ^3^。

- **Floor：使用 ORM 简化 SQLite 操作**
  Floor 是另一个基于 SQLite 的抽象层（ORM） ^26^。它通过注解的方式定义数据库实体和 DAO（数据访问对象），并自动生成类型安全的 API 来操作数据库 ^30^。Floor 提供了将 SQL 数据库表映射到 Dart 对象的功能，并支持数据库迁移 ^30^。与 Drift 类似，Floor 也提供了响应式 API，可以方便地实现 UI 的实时更新 ^30^。对于偏好使用 ORM 方式进行数据库操作的开发者，Floor 可以简化开发流程并提高代码的可维护性。

### 敏感信息的安全存储

对于处理用户特定或敏感数据的应用，例如存储用户的身份验证令牌、密码或 API 密钥，使用安全存储方案至关重要 ^1^。flutter_secure_storage 插件为此提供了一个便捷且安全的解决方案 ^1^。

flutter_secure_storage 使用平台特定的安全存储机制，例如 iOS 上的 Keychain 和 Android 上的 Keystore 或 EncryptedSharedPreferences ^5^。它提供了加密存储、安全的密钥管理、跨平台兼容性和简单的 API ^10^。开发者可以使用该插件安全地存储用户的身份验证令牌、个人凭据、API 密钥以及其他敏感的配置数据 ^10^。基本的数据写入、读取和删除操作如下所示 ^11^：

```Dart
final storage = new FlutterSecureStorage();
await storage.write(key: 'authToken', value: 'your_secure_token');
String? token = await storage.read(key: 'authToken');
await storage.delete(key: 'authToken');
```

使用 flutter_secure_storage 的最佳实践包括仅存储关键数据、安全地处理加密密钥、定期更新依赖项以及考虑集成生物识别身份验证以增强安全性 ^10^。对于任何处理敏感用户信息的应用，flutter_secure_storage 都是强烈推荐的选择。

### 文件缓存

文件存储允许直接在设备的存储空间中读取和写入数据文件 ，这通常通过结合使用 path_provider 插件来访问设备目录和 dart:io 库来进行文件操作 ^3^。文件存储适用于存储大型非结构化或二进制数据，例如图像、音频文件、文档以及缓存内容 。例如，读取和写入文件的基本代码如下 ^31^：

```Dart

import 'dart:io';
import 'package:path_provider/path_provider.dart';

Future<void> writeToFile(String text) async {
  final directory = await getApplicationDocumentsDirectory();
  final file = File('${directory.path}/my_file.txt');
  await file.writeAsString(text);
}

Future<String> readFile() async {
  final directory = await getApplicationDocumentsDirectory();
  final file = File('${directory.path}/my_file.txt');
  return await file.readAsString();
}
```

文件存储提供了最大的灵活性，但也意味着开发者需要比使用数据库更多地手动管理数据组织和检索 ^31^。对于需要处理媒体文件或其他非结构化数据的应用，文件存储提供了一种直接有效的方法。

## 如何选择最佳方案？

选择正确的数据持久化方法是影响 Flutter 应用功能、性能、安全性和可维护性的关键架构决策 ^3^。开发者应基于数据的特征（大小、复杂性、敏感性、关系）和应用的需求（离线访问、性能、查询需求）做出明智的选择 ^3^。以下是一些选择指南：

- 对于简单、非敏感的用户偏好设置，例如主题、语言等，shared_preferences 是一个快速且易于使用的选择。

- 对于需要存储更结构化的数据，并且对性能有一定要求，同时可以选择性地进行加密的场景，Hive 是一个不错的 NoSQL 数据库。

- 对于需要管理复杂关联数据，并需要使用 SQL 进行灵活查询和保证数据完整性的应用，SQLite（通过 sqflite、drift 或 floor）提供了强大的关系型数据库功能。

- 对于所有敏感数据，例如用户的身份验证令牌、密码和 API 密钥，必须使用 flutter_secure_storage 进行安全存储。

- 对于需要处理大型非结构化数据，例如图片、音频或文档文件的应用，文件存储提供了直接操作文件系统的能力。

在做出选择之前，开发者应仔细评估其应用的具体数据需求，权衡各种方案的优缺点，并选择最适合的持久化方法。

### Flutter 数据持久化选项比较分析

| 持久化方法             | 主要用例（ App 示例）                                                  | 支持的数据类型                                  | 存储容量 | 安全特性        | 查询能力    | 性能特点                         | 易用性   | 主要优点                                                                  | 主要缺点                                                                         |
| ---------------------- | ---------------------------------------------------------------------- | ----------------------------------------------- | -------- | --------------- | ----------- | -------------------------------- | -------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Shared Preferences     | 应用主题、语言选择、度量单位、登录状态、新手引导完成状态等基本配置信息 | 布尔值、整数、浮点数、字符串、字符串列表        | 小       | 无              | 无          | 读写速度快，适合小数据量         | 非常简单 | 易于使用，跨平台兼容                                                      | 仅支持原始数据类型，不适合存储敏感数据，没有结构化存储和查询机制                 |
| Hive                   | 缓存数据、用户偏好、应用状态、轻量级对象存储                           | 原始数据类型、Dart 对象（需自定义 TypeAdapter） | 中到大   | 可选（AES-256） | 有限        | 写入和删除操作非常快             | 简单     | 速度快，可以存储 Dart 对象，可选加密                                      | 社区维护存在不确定性，处理复杂关联数据和提供强大查询功能方面可能不如关系型数据库 |
| sqflite                | 任务管理、笔记应用、个人财务跟踪等需要存储复杂关联结构数据的应用       | SQL 支持的所有数据类型                          | 大       | 取决于 SQLite   | 强大（SQL） | 性能良好，尤其在查询方面         | 中等     | 功能强大，支持标准 SQL 查询，对数据有完全控制                             | 不是类型安全的，需要编写 SQL 查询语句，对于简单数据操作可能过于复杂              |
| Drift                  | 需要类型安全和响应式数据处理的复杂关系型数据存储                       | SQL 支持的所有数据类型                          | 大       | 取决于 SQLite   | 强大（SQL） | 性能良好，并提供响应式支持       | 中等     | 类型安全，提供响应式数据流，自动生成 SQL 代码，支持数据库迁移             | 学习曲线可能比 sqflite 稍高                                                      |
| Floor                  | 偏好使用 ORM 方式操作 SQLite 数据库的应用                              | SQL 支持的所有数据类型                          | 大       | 取决于 SQLite   | 强大（SQL） | 性能良好，并提供响应式支持       | 中等     | 提供 ORM 抽象，简化 SQLite 操作，类型安全，支持数据库迁移和响应式 UI 更新 | 可能不如 Drift 或 sqflite 灵活                                                   |
| Flutter Secure Storage | 存储用户的身份验证令牌、密码、API 密钥等敏感数据                       | 字符串（复杂数据类型可序列化为字符串后存储）    | 小       | 强制加密        | 无          | 读写速度取决于平台安全存储机制   | 简单     | 提供平台级别的安全存储，保护敏感数据                                      | 主要用于存储少量敏感数据，不支持复杂查询                                         |
| 文件存储               | 存储大型非结构化或二进制数据，例如图片、音频、文档文件、缓存内容等     | 任何文件类型                                    | 大       | 取决于文件系统  | 无          | 读写速度取决于文件大小和设备性能 | 中等     | 灵活性高，适用于存储各种类型的数据                                        | 需要手动管理数据组织和检索，对于结构化数据的操作不如数据库方便                   |

## 最佳实践与注意事项

有效实施 Flutter 应用的数据持久化需要开发者遵循一些最佳实践，以确保应用的性能、数据完整性和安全性。

- **高效的数据序列化和反序列化：** 当需要在 Dart 对象和可存储格式（如 JSON）之间转换数据时，应采用高效的序列化和反序列化技术 ^2^。可以使用诸如 json_serializable 之类的库或内置方法来实现高效的转换。

- **处理异步操作以获得最佳性能：** 数据持久化操作通常涉及 I/O 操作，应以异步方式执行，以避免阻塞主 UI 线程 ^3^。使用 async 和 await 关键字可以方便地实现异步操作 ^4^。

- **数据库优化策略以提高速度和效率：** 对于使用 SQLite 的应用，应采取适当的数据库优化策略，例如创建索引、避免不必要的写入操作、批量执行查询、使用事务以及启用 WAL（Write-Ahead Logging）模式 ^4^。对于 Hive 和 Isar 等 NoSQL 数据库，也应考虑其特定的优化策略，例如合理设计数据模型和使用索引。

- **维护数据完整性和确保安全性：** 对于涉及多个步骤的数据持久化操作，应使用事务来确保操作的原子性 ^4^。对于敏感数据，务必使用安全存储方案 ^10^。此外，还应实施数据验证和完整性检查机制 ^11^。

遵循这些最佳实践能够帮助开发者构建出性能良好、数据可靠且安全的 Flutter 应用。

### 高级策略

对于更复杂的应用，开发者可能需要考虑一些更高级的策略。

- **本地数据库同步策略：** 对于需要离线优先功能的应用，将本地数据与远程服务器同步至关重要 ^1^。这涉及到检测网络状态变化、选择合适的同步时机（例如立即同步或定时同步）、以及处理同步冲突等问题 ^55^。可以使用增量同步、数据压缩和批量操作等技术来优化同步过程 ^55^。Flutter 生态系统中也存在一些用于数据同步的库和服务，例如 Firebase 和 Appwrite ^1^。

- **Flutter 数据库的模式迁移管理：** 当应用的数据模型发生变化时，需要进行数据库模式迁移以更新本地数据库的结构 ^9^。开发者应采取最佳实践来处理迁移，例如在 sqflite 中使用 onCreate 和 onUpgrade 回调，利用 Drift 和 Floor 提供的迁移功能，以及对模式变更进行版本控制 ^9^。

- **数据模型版本控制的最佳实践：** 随着应用的发展，数据模型可能会发生变化，需要对数据模型进行版本控制 ^68^。可以采用语义化版本控制、使用迁移脚本以及在应用中处理不同版本模型等策略 ^66^。

理解和应用这些高级主题，能够帮助开发者构建出更加健壮和可维护的复杂 Flutter 应用。

### 团队协作：数据持久化文档的重要性

在团队开发环境中，清晰的沟通和对所选数据持久化策略的共同理解至关重要 ^2^。开发者需要记录数据模型、数据库模式以及数据持久化实现背后的逻辑 ^2^。使用一致的编码标准和架构模式（如 MVVM）有助于提高代码的可读性和可维护性 ^38^。版本控制系统（如 Git）在管理数据持久化层的变更方面也起着重要作用 ^68^。良好的团队协作和完善的文档能够确保数据持久化策略得到正确实施和维护，从而提高开发效率并降低集成风险。

## 总结

数据持久化是构建可靠、高效且用户友好的 Flutter 应用的基础。开发者需要根据应用的具体需求，仔细权衡各种数据持久化方案的优缺点，并选择最合适的方案。无论是使用 shared_preferences 存储简单的用户偏好，使用 Isar 或 Drift 管理结构化数据，使用 flutter_secure_storage 保护敏感信息，还是使用文件存储处理大型非结构化数据，都需要遵循最佳实践，并考虑到性能、数据完整性和安全性。对于更复杂的应用，还需要关注数据同步、模式迁移和数据模型版本控制等高级主题。通过清晰的沟通、完善的文档和持续学习，开发者可以充分利用 Flutter 提供的丰富数据持久化选项，构建出高质量的应用，为用户提供卓越的使用体验。

- 未来展望：新兴趋势与进步

Flutter 的生态系统持续发展，其对数据持久化方案的影响也在不断显现 ^14^。诸如 Isar、ObjectBox、Realm、Sembast 和 Mimir 等新兴数据库提供了更快的性能、更易用的 API 以及对更复杂数据类型的支持 ^3^。未来，我们可以期待在安全存储和数据同步解决方案方面看到更多的进步 ^10^。紧跟这些新兴趋势和进步，将有助于开发者构建出更强大、更高效的 Flutter 应用。

## 参考文章

1. A Beginner's Guide to Persisting Data with Shared Preferences in ..., [https://www.appwriters.dev/blog/a-beginners-guide-to-persisting-data-with-shared-preferences-in-flutter](https://www.appwriters.dev/blog/a-beginners-guide-to-persisting-data-with-shared-preferences-in-flutter)

2. Data Persistence on Flutter - Kodeco, [https://www.kodeco.com/5965747-data-persistence-on-flutter](https://www.kodeco.com/5965747-data-persistence-on-flutter)

3. Local Data Persistence - Code With Andrea Pro, [https://pro.codewithandrea.com/get-started-flutter/intro/11-local-data-persistence](https://pro.codewithandrea.com/get-started-flutter/intro/11-local-data-persistence)

4. Solving Data Persistence Challenges in Flutter with SQLite - Blup, [https://www.blup.in/blog/solving-data-persistence-challenges-in-flutter-with-sqlite](https://www.blup.in/blog/solving-data-persistence-challenges-in-flutter-with-sqlite)

5. 4 Ways to Store Data Locally with your Flutter apps. - CompSciWithIyush, [https://cswithiyush.hashnode.dev/4-ways-to-store-data-locally-with-your-flutter-apps](https://cswithiyush.hashnode.dev/4-ways-to-store-data-locally-with-your-flutter-apps)

6. Data persistence in flutter - DEV Community, [https://dev.to/tentanganak/data-persistence-in-flutter-3902](https://dev.to/tentanganak/data-persistence-in-flutter-3902)

7. How does Flutter handle app storage and data persistence? - GTCSYS, [https://gtcsys.com/faq/how-does-flutter-handle-app-storage-and-data-persistence/](https://gtcsys.com/faq/how-does-flutter-handle-app-storage-and-data-persistence/)

8. Persistence - Flutter Documentation, [https://docs.flutter.dev/cookbook/persistence](https://docs.flutter.dev/cookbook/persistence)

9. Persist data with SQLite - Flutter Documentation, [https://docs.flutter.dev/cookbook/persistence/sqlite](https://docs.flutter.dev/cookbook/persistence/sqlite)

10. Flutter Secure Storage – Safeguard Your Data in Mobile Apps - Langate Software, [https://langate.com/news-and-blog/comprehensive-guide-to-flutter-secure-storage-safeguarding-data-in-mobile-apps/](https://langate.com/news-and-blog/comprehensive-guide-to-flutter-secure-storage-safeguarding-data-in-mobile-apps/)

11. Storing Data in Secure Storage in Flutter | Blog | Digital.ai, [https://digital.ai/catalyst-blog/flutter-secure-storage/](https://digital.ai/catalyst-blog/flutter-secure-storage/)

12. How to Optimize App Development Using Flutter SharedPreferences - DhiWise, [https://www.dhiwise.com/post/optimize-app-development-using-flutter-sharedpreferences](https://www.dhiwise.com/post/optimize-app-development-using-flutter-sharedpreferences)

13. Benefits of shared_preferences and secure_storage in Flutter, [https://programtom.com/dev/2024/07/01/flutter-shared_preferences-and-secure_storage/](https://programtom.com/dev/2024/07/01/flutter-shared_preferences-and-secure_storage/)

14. Store key-value data on disk - Flutter Documentation, [https://docs.flutter.dev/cookbook/persistence/key-value](https://docs.flutter.dev/cookbook/persistence/key-value)

15. Persistence | Flutter University - GitBook, [https://flutteruniversity.gitbook.io/docs/learn-flutter/intermediate/persistence](https://flutteruniversity.gitbook.io/docs/learn-flutter/intermediate/persistence)

16. dart - Disadvantage of using Shared Preferences in Flutter - Stack ..., [https://stackoverflow.com/questions/72095228/disadvantage-of-using-shared-preferences-in-flutter](https://stackoverflow.com/questions/72095228/disadvantage-of-using-shared-preferences-in-flutter)

17. ELI5: Provider and state management VS shared preferences : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/nqp53p/eli5_provider_and_state_management_vs_shared/](https://www.reddit.com/r/FlutterDev/comments/nqp53p/eli5_provider_and_state_management_vs_shared/)

18. Data Storage for Flutter - OnePub, [https://onepub.dev/Blog?id=apsdavuhno](https://onepub.dev/Blog?id=apsdavuhno)

19. Flutter local database storage - dart - Stack Overflow, [https://stackoverflow.com/questions/75742236/flutter-local-database-storage](https://stackoverflow.com/questions/75742236/flutter-local-database-storage)

20. What do you guys use for local data storage? : r/flutterhelp - Reddit, [https://www.reddit.com/r/flutterhelp/comments/13mpcjt/what_do_you_guys_use_for_local_data_storage/](https://www.reddit.com/r/flutterhelp/comments/13mpcjt/what_do_you_guys_use_for_local_data_storage/)

21. Flutter App Development: Build Offline Support with Hive and SQLite - Softloom it Training, [https://softloomittraining.com/flutter-app-development-build-offline-support-with-hive-and-sqlite/](https://softloomittraining.com/flutter-app-development-build-offline-support-with-hive-and-sqlite/)

22. Flutter Hive Tutorial: Setting Up and Using Local Data in Flutter Project - DhiWise, [https://www.dhiwise.com/post/flutter-hive-tutorial%E2%80%93setting-up-and-using-local-data-in-flutter](https://www.dhiwise.com/post/flutter-hive-tutorial%E2%80%93setting-up-and-using-local-data-in-flutter)

23. Unpacking Flutter hives - NVISO Labs, [https://blog.nviso.eu/2024/03/13/unpacking-flutter-hives/](https://blog.nviso.eu/2024/03/13/unpacking-flutter-hives/)

24. Perform CRUD operations in Flutter with Hive - OpenReplay Blog, [https://blog.openreplay.com/perform-crud-operations-in-flutter-with-hive/](https://blog.openreplay.com/perform-crud-operations-in-flutter-with-hive/)

25. How to Add a Local Database Using Hive in Flutter - OnlyFlutter, [https://onlyflutter.com/how-to-add-a-local-database-using-hive-in-flutter/](https://onlyflutter.com/how-to-add-a-local-database-using-hive-in-flutter/)

26. Flutter databases overview - updated 2025 - Greenrobot, [https://greenrobot.org/database/flutter-databases-overview/](https://greenrobot.org/database/flutter-databases-overview/)

27. Top 7 Flutter Local Database in 2024 - BigOhTech, [https://bigohtech.com/flutter-local-database/](https://bigohtech.com/flutter-local-database/)

28. Top Flutter NoSQL Database, Key-value store, Document database ..., [https://fluttergems.dev/nosql-database/](https://fluttergems.dev/nosql-database/)

29. Best Local Database for Flutter Apps: A Complete Guide, [https://dinkomarinac.dev/best-local-database-for-flutter-apps-a-complete-guide](https://dinkomarinac.dev/best-local-database-for-flutter-apps-a-complete-guide)

30. Top 10 Flutter Databases for Efficient App Development in 2024 - Blup, [https://www.blup.in/blog/top-10-flutter-databases-for-efficient-app-development-in-2024](https://www.blup.in/blog/top-10-flutter-databases-for-efficient-app-development-in-2024)

31. Choose the Best Data Storage Solution for Your Flutter App - QuickCoder, [https://quickcoder.org/choose-the-best-data-storage-solution-for-your-flutter-app/](https://quickcoder.org/choose-the-best-data-storage-solution-for-your-flutter-app/)

32. Hive Pros/Cons : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/gqbka2/hive_proscons/](https://www.reddit.com/r/FlutterDev/comments/gqbka2/hive_proscons/)

33. The Pros and Cons of Using Hive Software - ProjectManagers.net, [https://projectmanagers.net/the-pros-and-cons-of-using-hive-software/](https://projectmanagers.net/the-pros-and-cons-of-using-hive-software/)

34. Isar Database - Worth it at this point? : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/1cj5dhf/isar_database_worth_it_at_this_point/](https://www.reddit.com/r/FlutterDev/comments/1cj5dhf/isar_database_worth_it_at_this_point/)

35. Flutter Database Concepts - Scaler Topics, [https://www.scaler.com/topics/flutter-tutorial/flutter-database/](https://www.scaler.com/topics/flutter-tutorial/flutter-database/)

36. Best Local Database for Flutter - Tagline Infotech LLP, [https://taglineinfotech.com/blog/best-local-database-for-flutter/](https://taglineinfotech.com/blog/best-local-database-for-flutter/)

37. Using SQLite with Flutter – SQLServerCentral, [https://www.sqlservercentral.com/articles/using-sqlite-with-flutter](https://www.sqlservercentral.com/articles/using-sqlite-with-flutter)

38. Persistent storage architecture: SQL - Flutter Documentation, [https://docs.flutter.dev/app-architecture/design-patterns/sql](https://docs.flutter.dev/app-architecture/design-patterns/sql)

39. A beginners Guide to Integrating Sqflite in Flutter Projects - Finotes, [https://www.blog.finotes.com/post/a-beginners-guide-to-integrating-sqflite-in-flutter-projects](https://www.blog.finotes.com/post/a-beginners-guide-to-integrating-sqflite-in-flutter-projects)

40. SQLite in Flutter: The Complete Guide - DEV Community, [https://dev.to/arslanyousaf12/sqlite-in-flutter-the-complete-guide-11nj](https://dev.to/arslanyousaf12/sqlite-in-flutter-the-complete-guide-11nj)

41. An In-Depth Walkthrough with Flutter Databases: SQLite and Local - DhiWise, [https://www.dhiwise.com/post/a-walkthrough-with-flutter-databases-sqlite-and-local](https://www.dhiwise.com/post/a-walkthrough-with-flutter-databases-sqlite-and-local)

42. Flutter Database Solutions - JustAcademy, [https://www.justacademy.co/blog-detail/flutter-database-solutions](https://www.justacademy.co/blog-detail/flutter-database-solutions)

43. High performance sqlite for Flutter (optimized sqlite3) : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/12bhpxh/high_performance_sqlite_for_flutter_optimized/](https://www.reddit.com/r/FlutterDev/comments/12bhpxh/high_performance_sqlite_for_flutter_optimized/)

44. Flutter Database Comparison: sqlite_async, sqflite, ObjectBox and Isar, [https://www.powersync.com/blog/flutter-database-comparison-sqlite-async-sqflite-objectbox-isar](https://www.powersync.com/blog/flutter-database-comparison-sqlite-async-sqflite-objectbox-isar)

45. whether hive or sqflite good for handling large amount of data in flutter - Stack Overflow, [https://stackoverflow.com/questions/70911794/whether-hive-or-sqflite-good-for-handling-large-amount-of-data-in-flutter](https://stackoverflow.com/questions/70911794/whether-hive-or-sqflite-good-for-handling-large-amount-of-data-in-flutter)

46. Top Open Source Packages Every Flutter Developer Should Know in 2025, [https://verygood.ventures/blog/top-open-source-packages-every-flutter-developer-should-know-in-2025](https://verygood.ventures/blog/top-open-source-packages-every-flutter-developer-should-know-in-2025)

47. Using Floor Database in Flutter 2025: A Complete Guide - Quash, [https://quashbugs.com/blog/exploring-flutters-floor-library-for-efficient-data-persistence](https://quashbugs.com/blog/exploring-flutters-floor-library-for-efficient-data-persistence)

48. Flutter application security considerations - Cossack Labs, [https://www.cossacklabs.com/blog/flutter-application-security-considerations/](https://www.cossacklabs.com/blog/flutter-application-security-considerations/)

49. juliansteenbakker/flutter_secure_storage: A Flutter plugin for securely storing sensitive data using encrypted storage. - GitHub, [https://github.com/juliansteenbakker/flutter_secure_storage](https://github.com/juliansteenbakker/flutter_secure_storage)

50. Flutter's Best Practices for High-Performing and User-Friendly Apps for 2023 (II), [https://www.flutterdirectory.com/flutters-best-practices-for-high-performing-and-user-friendly-apps-for-2023-ii/](https://www.flutterdirectory.com/flutters-best-practices-for-high-performing-and-user-friendly-apps-for-2023-ii/)

51. Mastering Local Data Storage in Flutter: A Comprehensive Guide - Flutterexperts, [https://flutterexperts.com/mastering-local-data-storage-in-flutter-a-comprehensive-guide/](https://flutterexperts.com/mastering-local-data-storage-in-flutter-a-comprehensive-guide/)

52. Flutter Data Persistence: Store Key-Value with SharedPreferences - Blup, [https://www.blup.in/blog/flutter-data-persistence-store-key-value-data-on-disk-in-flutter-with-sharedpreferences](https://www.blup.in/blog/flutter-data-persistence-store-key-value-data-on-disk-in-flutter-with-sharedpreferences)

53. When to persist data in Flutter (onPause equivalent) - Stack Overflow, [https://stackoverflow.com/questions/66254488/when-to-persist-data-in-flutter-onpause-equivalent](https://stackoverflow.com/questions/66254488/when-to-persist-data-in-flutter-onpause-equivalent)

54. Building a Robust Local Storage Service in Flutter - DEV Community, [https://dev.to/arafaysaleem/building-a-robust-local-storage-service-in-flutter-2gkj](https://dev.to/arafaysaleem/building-a-robust-local-storage-service-in-flutter-2gkj)

55. Navigating Offline Database in Flutter: A Comprehensive Guide - DhiWise, [https://www.dhiwise.com/post/navigating-offline-database-in-flutter-a-comprehensive-guide](https://www.dhiwise.com/post/navigating-offline-database-in-flutter-a-comprehensive-guide)

56. flutter data storage: local storage vs cloud storage - Stack Overflow, [https://stackoverflow.com/questions/54731640/flutter-data-storage-local-storage-vs-cloud-storage](https://stackoverflow.com/questions/54731640/flutter-data-storage-local-storage-vs-cloud-storage)

57. When to store data locally vs cloud? : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/rukjog/when_to_store_data_locally_vs_cloud/](https://www.reddit.com/r/FlutterDev/comments/rukjog/when_to_store_data_locally_vs_cloud/)

58. Offline-first support - Flutter Documentation, [https://docs.flutter.dev/app-architecture/design-patterns/offline-first](https://docs.flutter.dev/app-architecture/design-patterns/offline-first)

59. Local caching - Flutter Documentation, [https://docs.flutter.dev/get-started/fundamentals/local-caching](https://docs.flutter.dev/get-started/fundamentals/local-caching)

60. Supercharge Flutter Apps with the RxDB Database, [https://rxdb.info/articles/flutter-database.html](https://rxdb.info/articles/flutter-database.html)

61. Conflict resolution - Flutter - AWS Amplify Gen 1 Documentation, [https://docs.amplify.aws/gen1/flutter/prev/build-a-backend/more-features/datastore/conflict-resolution/](https://docs.amplify.aws/gen1/flutter/prev/build-a-backend/more-features/datastore/conflict-resolution/)

62. Building Offline Apps with Flutter: Mastering Local Data Management - Virva infotech, [https://www.virvainfotech.com/how-to-build-offline-apps-with-flutter](https://www.virvainfotech.com/how-to-build-offline-apps-with-flutter)

63. What database you use in 2020 with your flutter and why? : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/hikhgy/what_database_you_use_in_2020_with_your_flutter/](https://www.reddit.com/r/FlutterDev/comments/hikhgy/what_database_you_use_in_2020_with_your_flutter/)

64. Need Help Migrating Database and Preventing Data Loss in Flutter App (Sqflite) - Reddit, [https://www.reddit.com/r/flutterhelp/comments/1jlmv3h/need_help_migrating_database_and_preventing_data/](https://www.reddit.com/r/flutterhelp/comments/1jlmv3h/need_help_migrating_database_and_preventing_data/)

65. Local development with schema migrations | Supabase Docs, [https://supabase.com/docs/guides/local-development/overview](https://supabase.com/docs/guides/local-development/overview)

66. Data schema migration : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/1cut33w/data_schema_migration/](https://www.reddit.com/r/FlutterDev/comments/1cut33w/data_schema_migration/)

67. Flutter SQLITE how to migrate database to new structure on app update? - Stack Overflow, [https://stackoverflow.com/questions/75811477/flutter-sqlite-how-to-migrate-database-to-new-structure-on-app-update](https://stackoverflow.com/questions/75811477/flutter-sqlite-how-to-migrate-database-to-new-structure-on-app-update)

68. Version Control Best Practices For Flutter | Restackio, [https://www.restack.io/p/flutter-best-practices-answer-version-control-cat-ai](https://www.restack.io/p/flutter-best-practices-answer-version-control-cat-ai)

69. Guide to app architecture - Flutter Documentation, [https://docs.flutter.dev/app-architecture/guide](https://docs.flutter.dev/app-architecture/guide)

70. Performance best practices - Flutter Documentation, [https://docs.flutter.dev/perf/best-practices](https://docs.flutter.dev/perf/best-practices)

71. Semantic Versioning | Flutter Inner Source, [https://innersource.flutter.com/sdlc/semver/](https://innersource.flutter.com/sdlc/semver/)

72. Architecture design patterns - Flutter Documentation, [https://docs.flutter.dev/app-architecture/design-patterns](https://docs.flutter.dev/app-architecture/design-patterns)

73. Data Versioning Explained: Guide, Examples & Best Practices - lakeFS, [https://lakefs.io/blog/data-versioning/](https://lakefs.io/blog/data-versioning/)

74. Best Practices for Flutter Development - Walturn, [https://www.walturn.com/insights/best-practices-for-flutter-development](https://www.walturn.com/insights/best-practices-for-flutter-development)

75. What are the best practices for versioning with a data driven web app and many devs?, [https://stackoverflow.com/questions/608973/what-are-the-best-practices-for-versioning-with-a-data-driven-web-app-and-many-d](https://stackoverflow.com/questions/608973/what-are-the-best-practices-for-versioning-with-a-data-driven-web-app-and-many-d)

76. Starting a Flutter App: Our Comprehensive Guide for Large Team Collaboration, [https://www.willowtreeapps.com/craft/starting-a-flutter-app-our-comprehensive-guide-for-large-team-collaboration](https://www.willowtreeapps.com/craft/starting-a-flutter-app-our-comprehensive-guide-for-large-team-collaboration)

77. Best Practices In Flutter - JustAcademy, [https://justacademy.co/blog-detail/best-practices-in-flutter](https://justacademy.co/blog-detail/best-practices-in-flutter)

78. Mastering the Flutter Framework Best Practices for Efficient Development - MoldStud, [https://moldstud.com/articles/p-mastering-the-flutter-framework-best-practices-for-efficient-development](https://moldstud.com/articles/p-mastering-the-flutter-framework-best-practices-for-efficient-development)

79. Best Practices for Software Development Using Flutter - advansappz, [https://advansappz.com/best-practices-for-software-development-using-flutter/](https://advansappz.com/best-practices-for-software-development-using-flutter/)

80. Persistent storage architecture: Key-value data - Flutter Documentation, [https://docs.flutter.dev/app-architecture/design-patterns/key-value-data](https://docs.flutter.dev/app-architecture/design-patterns/key-value-data)

81. How do you architect your Flutter apps? Research for flutter.dev docs - Reddit, [https://www.reddit.com/r/FlutterDev/comments/192h8l0/how_do_you_architect_your_flutter_apps_research/](https://www.reddit.com/r/FlutterDev/comments/192h8l0/how_do_you_architect_your_flutter_apps_research/)

82. How to persist list of data - flutter - Stack Overflow, [https://stackoverflow.com/questions/60470918/data-persistence-how-to-persist-list-of-data](https://stackoverflow.com/questions/60470918/data-persistence-how-to-persist-list-of-data)

83. Flutter architectural overview, [https://docs.flutter.dev/resources/architectural-overview](https://docs.flutter.dev/resources/architectural-overview)

84. Very good layered architecture in Flutter, [https://verygood.ventures/blog/very-good-flutter-architecture](https://verygood.ventures/blog/very-good-flutter-architecture)

85. Architecture recommendations and resources - Flutter Documentation, [https://docs.flutter.dev/app-architecture/recommendations](https://docs.flutter.dev/app-architecture/recommendations)

86. A Deep Dive into Hive and Shared Preferences for Mastering Local Storage Solutions in Flutter - MoldStud, [https://moldstud.com/articles/p-a-deep-dive-into-hive-and-shared-preferences-for-mastering-local-storage-solutions-in-flutter](https://moldstud.com/articles/p-a-deep-dive-into-hive-and-shared-preferences-for-mastering-local-storage-solutions-in-flutter)

87. Flutter: Advantages, Disadvantages and Future Scopes | GeeksforGeeks, [https://www.geeksforgeeks.org/flutter-advantages-disadvantages-and-future-scopes/](https://www.geeksforgeeks.org/flutter-advantages-disadvantages-and-future-scopes/)

88. Flutter local database storage - Stack Overflow, [https://stackoverflow.com/questions/75742236/flutter-local-database-storage/75742375](https://stackoverflow.com/questions/75742236/flutter-local-database-storage/75742375)

89. Best Local Database for Flutter Apps: A Complete Guide : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/1ib9t2e/best_local_database_for_flutter_apps_a_complete/](https://www.reddit.com/r/FlutterDev/comments/1ib9t2e/best_local_database_for_flutter_apps_a_complete/)

90. Future of Flutter 2025: Trends and Predictions - Ahex Technologies, [https://ahex.co/future-of-flutter-trends-predictions/](https://ahex.co/future-of-flutter-trends-predictions/)

91. Top Flutter App Development Trends in 2025 - SolGuruz, [https://solguruz.com/blog/top-flutter-app-development-trends/](https://solguruz.com/blog/top-flutter-app-development-trends/)

92. What's new in the docs - Flutter Documentation, [https://docs.flutter.dev/release/whats-new](https://docs.flutter.dev/release/whats-new)

93. Future of Flutter Trends and Predictions for 2025 : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/1hhsnrq/future_of_flutter_trends_and_predictions_for_2025/](https://www.reddit.com/r/FlutterDev/comments/1hhsnrq/future_of_flutter_trends_and_predictions_for_2025/)

94. Flutter App Development Insights for 2024 - Program-Ace, [https://program-ace.com/blog/flutter-app-development-insights/](https://program-ace.com/blog/flutter-app-development-insights/)

95. Overview of the Flutter database market in 2023 with a comprehensive comparison matrix : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/141hwqp/overview_of_the_flutter_database_market_in_2023/](https://www.reddit.com/r/FlutterDev/comments/141hwqp/overview_of_the_flutter_database_market_in_2023/)

96. A Complete Flutter Roadmap for 2025 - igmGuru, [https://www.igmguru.com/blog/flutter-roadmap](https://www.igmguru.com/blog/flutter-roadmap)

97. 10 Best Flutter Projects with Source Code in 2025 - GeeksforGeeks, [https://www.geeksforgeeks.org/flutter-projects-with-source-code/](https://www.geeksforgeeks.org/flutter-projects-with-source-code/)

98. Google's Flutter Roadmap has been updated for 2025 : r/FlutterDev - Reddit, [https://www.reddit.com/r/FlutterDev/comments/1jrz4cd/googles_flutter_roadmap_has_been_updated_for_2025/](https://www.reddit.com/r/FlutterDev/comments/1jrz4cd/googles_flutter_roadmap_has_been_updated_for_2025/)

99. Continuing to Rely on Flutter in 2025: A Smart Choice [Update] - Blog - Codigee, [https://codigee.com/blog/continuing-to-rely-on-flutter-a-smart-choice](https://codigee.com/blog/continuing-to-rely-on-flutter-a-smart-choice)

100. Flutter vs. React Native in 2025 — Detailed Analysis - Nomtek, [https://www.nomtek.com/blog/flutter-vs-react-native](https://www.nomtek.com/blog/flutter-vs-react-native)

101. Understanding Isar Flutter: A Comprehensive Guide - DhiWise, [https://www.dhiwise.com/post/exploring-isar-flutter-a-powerful-database-for-flutter](https://www.dhiwise.com/post/exploring-isar-flutter-a-powerful-database-for-flutter)

102. Android Archives - Page 2 of 3 - ObjectBox, [https://objectbox.io/category/android/page/2/](https://objectbox.io/category/android/page/2/)

103. Implementing Isar Database in Your Flutter Project: A Comprehensive Guide, [https://atuoha.hashnode.dev/implementing-isar-database-in-your-flutter-project-a-comprehensive-guide](https://atuoha.hashnode.dev/implementing-isar-database-in-your-flutter-project-a-comprehensive-guide)

104. 【Local DB】Convenient and Fast! An Overview and How to Use Isar Database!!, [https://flutterdevelop.blog/en/isar-database-basic/](https://flutterdevelop.blog/en/isar-database-basic/)

105. Isar Database: Home, [https://isar.dev/](https://isar.dev/)

106. chyiiiiiiiiiiii/isar_example_app: Simple and easy-understand example for Isar database - GitHub, [https://github.com/chyiiiiiiiiiiii/isar_example_app](https://github.com/chyiiiiiiiiiiii/isar_example_app)
