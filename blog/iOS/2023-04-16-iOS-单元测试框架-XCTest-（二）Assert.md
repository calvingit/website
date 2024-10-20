---
title: iOS 单元测试框架 XCTest （二）Assert
description: "iOS 单元测试框架 XCTest （二）Assert"
slug: xctest-asserts
date: 2023-04-16
tags: [iOS]
---

在 iOS 开发中，单元测试是一种验证代码正确性的重要手段。XCTest 是 Apple 提供的官方单元测试框架，它提供了一系列的断言（Assert）方法来帮助我们验证测试用例的预期结果。本文将详细介绍 XCTest 中的断言（Assert）使用方法。

<!-- truncate -->

## 断言（Assert）基础

断言是单元测试中的核心，它用于验证代码的某个特定条件是否为真。如果条件为真，则测试通过；如果条件为假，则测试失败。XCTest 提供了多种断言方法，以适应不同的测试场景。

## 基本断言方法

以下是一些基本的断言方法：

- `XCTAssertTrue`：验证一个条件是否为真。
- `XCTAssertFalse`：验证一个条件是否为假。
- `XCTAssertEqual`：验证两个值是否相等。
- `XCTAssertNotEqual`：验证两个值是否不相等。
- `XCTAssertNil`：验证一个对象是否为 nil。
- `XCTAssertNotNil`：验证一个对象是否不为 nil。

## 使用断言

下面是一个简单的示例，展示如何在单元测试中使用断言：

```swift
func testExample() {
    let expectedValue = 10
    let actualValue = someFunction()

    // 验证函数返回值是否等于预期值
    XCTAssertEqual(actualValue, expectedValue, "函数返回值不等于预期值")

    // 验证对象是否为nil
    XCTAssertNotNil(someObject, "对象不应该为nil")

    // 验证条件是否为真
    XCTAssertTrue(someCondition, "条件应该为真")
}
```

## 异步断言

在处理异步代码时，我们可能需要等待某个异步操作完成。XCTest 提供了异步断言方法来处理这种情况：

- `XCTAssertNoThrow`：验证一个闭包执行时是否抛出异常。
- `XCTAssertThrows`：验证一个闭包执行时是否抛出特定的异常。

使用异步断言的示例：

```swift
func testAsyncOperation() {
    let expectation = self.expectation(description: "异步操作完成")

    someAsyncFunction { result in
        // 验证异步操作的结果
        XCTAssertEqual(result, expectedResult, "异步操作结果不正确")

        // 标记异步操作完成
        expectation.fulfill()
    }

    // 等待异步操作完成
    waitForExpectations(timeout: 5.0) { error in
        if let error = error {
            XCTFail("异步操作超时: \(error)")
        }
    }
}
```

## 自定义断言

如果 XCTest 提供的断言方法不能满足需求，我们可以自定义断言方法。自定义断言可以更精确地描述测试失败的原因。

```swift
func XCTAssertCustom<T: Equatable>(_ expression1: @autoclosure () throws -> T, == expression2: @autoclosure () throws -> T, file: StaticString = #file, line: UInt = #line) {
    do {
        let value1 = try expression1()
        let value2 = try expression2()
        XCTAssertEqual(value1, value2, file: file, line: line)
    } catch {
        XCTFail("自定义断言失败: \(error)", file: file, line: line)
    }
}
```

## 总结

断言是单元测试中验证代码正确性的重要工具。XCTest 提供了丰富的断言方法，包括基本断言、异步断言和自定义断言，以适应不同的测试需求。正确使用断言可以提高测试的准确性和可读性。
