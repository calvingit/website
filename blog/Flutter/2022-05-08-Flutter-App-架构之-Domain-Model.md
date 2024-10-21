---
title: Flutter App 架构的 Domain 层
description: "Flutter App 架构的 Domain 层"
slug: flutter-app-domain-model
date: 2022-05-08
tags: [Flutter]
---

## Flutter App 架构的 Domain 层

在现代 Flutter 应用开发中，架构设计的清晰性和可维护性至关重要。Domain 层作为架构的核心部分，负责封装业务逻辑和数据模型，是实现良好架构的关键。本文将深入探讨 Flutter 应用中的 Domain 层，包括其定义、组成部分以及如何有效地实现和测试。

<!-- truncate -->

![Flutter App 架构图](https://cdn.zhangwen.site/uPic/flutter-app-architecture.png)

### 什么是 Domain 层？

Domain 层是应用程序架构中的一个重要层次，位于表示层（Presentation Layer）和数据层（Data Layer）之间。它主要负责管理业务逻辑和实体，确保应用程序的核心功能与用户界面和数据存储分离。这种分离使得代码更易于理解、维护和测试。

Domain 层的主要职责包括：

- **封装业务逻辑**：将与业务相关的逻辑集中管理，避免在 UI 或数据层中重复代码。

- **定义实体**：通过数据模型表示业务中的重要概念，如用户、产品、订单等。

- **提供接口**：通过接口与数据层进行交互，确保数据访问的灵活性和可替换性。

### Domain 模型的重要性

Domain 模型是对特定领域的抽象，它包含了行为和数据。根据领域驱动设计（DDD），一个好的 Domain 模型能够帮助开发者更好地理解业务需求，并确保应用程序能够有效地解决用户的问题。

在一个电商应用中，可能会有以下几个实体：

- **用户（User）**：包含 ID 和电子邮件等属性。

- **产品（Product）**：包含 ID、图片 URL、标题、价格和可用数量等属性。

- **购物车（Cart）**：包含商品列表和总价等信息。

- **订单（Order）**：包含商品列表、支付金额和订单状态等信息。

这些实体不仅定义了数据结构，还可以包含相关的业务逻辑，以便在操作这些数据时进行必要的验证和处理。

### 实现 Domain 模型

在 Dart 中，可以通过简单的数据类来实现这些模型。例如，一个 `Product` 类可以如下定义：

```dart
typedef ProductID = String;

class Product {
  Product({
    required this.id,
    required this.imageUrl,
    required this.title,
    required this.price,
    required this.availableQuantity,
  });

  final ProductID id;
  final String imageUrl;
  final String title;
  final double price;
  final int availableQuantity;

  factory Product.fromMap(Map<String, dynamic> map, ProductID id) {
    return Product(
      id: id,
      imageUrl: map['imageUrl'],
      title: map['title'],
      price: map['price'],
      availableQuantity: map['availableQuantity'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'imageUrl': imageUrl,
      'title': title,
      'price': price,
      'availableQuantity': availableQuantity,
    };
  }
}
```

在这个类中，除了基本属性外，还实现了 `fromMap` 和 `toMap` 方法，用于序列化和反序列化操作。这种设计确保了模型类的纯粹性，使其不依赖于外部服务或数据源。

### 在模型类中添加业务逻辑

虽然 Domain 层主要关注数据模型，但也可以在模型类中添加一些基本的业务逻辑。例如，可以为购物车（Cart）定义一个方法来添加商品：

```dart
class Cart {
  const Cart([this.items = const {}]);

  final Map<ProductID, int> items;

  Cart addItem({required ProductID productId, required int quantity}) {
    final copy = Map<ProductID, int>.from(items);
    copy[productId] = quantity + (copy[productId] ?? 0);
    return Cart(copy);
  }

  Cart removeItemById(ProductID productId) {
    final copy = Map<ProductID, int>.from(items);
    copy.remove(productId);
    return Cart(copy);
  }
}
```

这种设计允许我们以不可变的方式更新购物车，同时保持模型的简洁性。

### 测试 Domain 层的业务逻辑

由于 Domain 层通常不依赖于外部服务，因此它非常适合单元测试。可以轻松编写测试用例来验证业务逻辑是否正常工作。例如，可以为 `addItem` 方法编写如下测试：

```dart
void main() {
  group('add item', () {
    test('empty cart - add item', () {
      final cart = const Cart().addItem(productId: '1', quantity: 1);
      expect(cart.items, {'1': 1});
    });

    test('add same item twice', () {
      final cart = const Cart()
          .addItem(productId: '1', quantity: 1)
          .addItem(productId: '1', quantity: 1);
      expect(cart.items, {'1': 2});
    });
  });
}
```

通过这种方式，可以确保业务逻辑的正确性，并及时发现潜在的问题。

## 总结

Domain 层是 Flutter 应用架构中不可或缺的一部分，它通过封装业务逻辑和定义数据模型来提高代码的可读性和可维护性。在设计 Domain 层时，应关注以下几点：

- 清晰地定义实体及其关系。

- 将业务逻辑与 UI 和数据层分离。

- 确保模型类是不可变且易于测试的。

通过遵循这些原则，开发者可以构建出更为健壮且易于扩展的 Flutter 应用。

参考资料:

- https://codewithandrea.com/articles/flutter-app-architecture-domain-model/

- https://www.intelivita.com/blog/flutter-architecture/

- https://proandroiddev.com/app-architecture-domain-layer-b9f6aa839e33?gi=72c952be4798

- https://dev.to/marwamejri/flutter-clean-architecture-1-an-overview-project-structure-4bhf

- https://codewithandrea.com/articles/flutter-app-architecture-domain-model/
