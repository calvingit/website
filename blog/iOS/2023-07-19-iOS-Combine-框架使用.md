---
title: iOS Combine 框架使用
description: "Combine 操作符"
slug:  ios-combine-framework
date: 2023-07-19
tags: [iOS]
---

Combine 框架是 Apple 提供的一种用于处理异步事件的强大工具。它允许我们以声明式的方式编写功能性反应式代码，简化了异步编程的复杂性。本文将深入探讨 Combine 框架中的常用操作符，帮助开发者更好地理解和应用这一框架。

<!-- truncate -->

## 什么是 Combine？

Combine 框架使得开发者能够通过组合事件处理操作符来定制异步事件的处理。它支持函数式编程范式，允许我们在时间流中处理和转换值。Combine 的核心概念包括发布者（Publisher）、操作符（Operators）和订阅者（Subscribers）。

## 主要概念

- **发布者（Publisher）**：可以发送一系列值或事件。
- **操作符（Operators）**：用于处理发布者发送的值，进行转换、过滤等操作。
- **订阅者（Subscriber）**：接收发布者发送的值并进行处理。

## 常用操作符

以下是一些常用的 Combine 操作符及其示例：

### 1. map

`map` 操作符用于将发布者发送的值进行转换。

```swift
let publisher = [1, 2, 3].publisher
let cancellable = publisher
    .map { $0 * 2 }
    .sink(receiveValue: { print($0) }) // 输出: 2, 4, 6
```

### 2. flatMap

`flatMap` 操作符可以将一个发布者的输出映射到另一个发布者。

```swift
let publisher = ["1", "2", "3"].publisher
let cancellable = publisher
    .flatMap { value in
        Just(Int(value) ?? 0)
    }
    .sink(receiveValue: { print($0) }) // 输出: 1, 2, 3
```

### 3. filter

`filter` 操作符用于根据条件过滤发布者发送的值。

```swift
let publisher = [1, 2, 3, 4, 5].publisher
let cancellable = publisher
    .filter { $0 % 2 == 0 }
    .sink(receiveValue: { print($0) }) // 输出: 2, 4
```

### 4. combineLatest

`combineLatest` 操作符用于组合多个发布者的最新值。

```swift
let publisher1 = PassthroughSubject<Int, Never>()
let publisher2 = PassthroughSubject<String, Never>()

let cancellable = publisher1.combineLatest(publisher2)
    .sink(receiveValue: { print("\($0), \($1)") })

publisher1.send(1)
publisher2.send("A")
// 输出: "1, A"
```

### 5. merge

`merge` 操作符用于将多个发布者合并为一个发布者。

```swift
let publisher1 = Just(1)
let publisher2 = Just(2)

let cancellable = publisher1.merge(with: publisher2)
    .sink(receiveValue: { print($0) }) // 输出: 1, 2
```

### 6. zip

`zip` 操作符用于将多个发布者的值配对。

```swift
let publisher1 = Just(1)
let publisher2 = Just("A")

let cancellable = publisher1.zip(publisher2)
    .sink(receiveValue: { print("\($0), \($1)") }) // 输出: "1, A"
```

## 错误处理

Combine 提供了多种方式来处理错误，例如使用 `catch` 和 `retry` 操作符。

```swift
enum MyError: Error {
    case somethingWentWrong
}

let publisher = Fail<Int, MyError>(error: .somethingWentWrong)

let cancellable = publisher
    .catch { error in Just(0) } // 捕获错误并返回默认值
    .sink(receiveValue: { print($0) }) // 输出: 0
```

## Combine 框架与 RxSwift 的比较

Combine 和 RxSwift 都是用于响应式编程的框架，但它们在设计、性能和使用方式上存在一些显著差异。本文将探讨这两个框架的相似性与区别，并提供 Combine 在处理网络请求时的示例。

### Combine 与 RxSwift 的相同点

- **响应式编程**：两者都基于响应式编程的理念，允许开发者以声明式的方式处理异步事件。

- **操作符**：大多数操作符在两个框架中具有相似的功能，例如 `map`、`filter` 和 `flatMap`。不过，它们的命名有所不同。例如，RxSwift 的 `Observable` 对应于 Combine 的 `Publisher`。

- **订阅机制**：两者都使用订阅者（Subscriber）来接收发布者（Publisher）发送的数据。

### Combine 与 RxSwift 的区别

| 特性         | Combine                         | RxSwift                                     |
| ------------ | ------------------------------- | ------------------------------------------- |
| **错误处理** | 每个 Publisher 需要定义错误类型 | Observable 不使用错误类型，可能抛出任意错误 |
| **性能**     | 经过优化，性能通常优于 RxSwift  | 性能良好，但在某些情况下不如 Combine        |
| **背压支持** | 内置背压支持                    | 不支持背压                                  |
| **API 设计** | 由 Apple 官方提供，无需外部依赖 | 第三方库，需要额外依赖                      |

## Combine 在处理网络请求时的示例

Combine 提供了 `dataTaskPublisher` 来简化网络请求的处理。以下是一个基本示例，展示如何使用 Combine 发起网络请求并处理响应。

```swift
import Foundation
import Combine

struct Post: Decodable {
    let userId: Int
    let id: Int
    let title: String
    let body: String
}

let url = URL(string: "https://jsonplaceholder.typicode.com/posts")!

let cancellable = URLSession.shared.dataTaskPublisher(for: url)
    .map(\.data) // 获取数据部分
    .decode(type: [Post].self, decoder: JSONDecoder()) // 解码为 Post 数组
    .sink(receiveCompletion: { completion in
        switch completion {
        case .finished:
            print("请求完成")
        case .failure(let error):
            print("发生错误: \(error)")
        }
    }, receiveValue: { posts in
        print("获取到 \(posts.count) 条数据")
        print(posts)
    })
```

在这个示例中，我们首先创建了一个 URL，然后使用 `dataTaskPublisher` 发起请求。通过 `map` 操作符提取数据部分，并使用 `decode` 操作符将 JSON 数据解码为 `Post` 模型数组。最后，通过 `sink` 方法处理请求完成和接收到的数据。

## 总结

Combine 和 RxSwift 都是强大的响应式编程工具，各有优缺点。Combine 的优势在于其性能优化和与 Apple 生态系统的紧密集成，而 RxSwift 则提供了更成熟的生态和更丰富的操作符。如果你正在开发 iOS 应用，选择哪个框架取决于你的具体需求和项目环境。通过掌握 Combine 的基本操作符和网络请求处理方式，开发者可以更高效地构建现代 iOS 应用。

参考资料:

- [The ultimate Combine framework tutorial in Swift](https://medium.com/@islammoussa.eg/all-in-one-guide-to-ios-combine-journey-from-basics-to-advanced-implementation-part2-054)
- [Using Combine](https://heckj.github.io/swiftui-notes/index_zh-CN.html)
- [All-In-One Guide to iOS Combine: Journey from Basics to Advanced Implementation part2](https://medium.com/@islammoussa.eg/all-in-one-guide-to-ios-combine-journey-from-basics-to-advanced-implementation-part2-05498d3fe395)
