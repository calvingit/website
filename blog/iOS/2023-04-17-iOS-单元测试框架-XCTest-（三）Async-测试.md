---
title: iOS 单元测试框架 XCTest （三）Async 测试
description: "iOS 单元测试框架 XCTest （三）Async 测试"
slug: xctest-async
date: 2023-04-17
tags: [iOS]
---

异步测试和 Expectation 是现代软件测试中的常见要求。异步测试是指涉及某种形式的异步行为的测试，例如网络请求或 UI 更新，这些行为不能由测试代码预测或控制。异步 Expectation 是对异步操作结果的断言，通常需要在一定的延迟或特定条件满足后进行。

在 XCTest 中，有几种处理异步测试和 Expectation 的方法。

## 使用 XCTestExpectation

`XCTestExpectation` 是 XCTest 提供的一个处理异步 Expectation 的类。您可以创建一个 Expectation 对象，并使用 `waitForExpectations(timeout:handler:)` 方法等待它被满足。例如：

```swift
func testAsyncOperation() {
    let expectation = XCTestExpectation(description: "Async operation completed")

    // 执行一些异步操作
    DispatchQueue.main.async {
        // 当异步操作完成时，标记Expectation已完成
        expectation.fulfill()
    }

    // 等待Expectation被满足
    wait(for: [expectation], timeout: 5.0)
}
```

<!-- truncate -->

在这个例子中，我们创建了一个带有描述的 Expectation 对象，然后在主队列上执行了一个异步操作。当异步操作完成时，我们调用 `fulfill()` 方法来标记 Expectation 已经被满足。最后，我们使用 `wait(for:timeout:)` 方法等待 Expectation 被满足。

### XCTWaiter

`XCTWaiter` 是 XCTest 框架中的一个类，它可以用于等待多个异步操作的完成。

在测试中，您可能需要等待多个异步操作完成，然后再继续执行测试代码。使用 `XCTWaiter`，您可以等待多个异步操作的完成，并验证它们是否成功完成。

下面是一个使用 `XCTWaiter` 等待多个异步操作完成的示例：

```swift
func testMultipleAsyncOperations() {
    let expectation1 = XCTestExpectation(description: "Async operation 1")
    let expectation2 = XCTestExpectation(description: "Async operation 2")

    DispatchQueue.global().async {
        // Perform async operation 1
        expectation1.fulfill()
    }

    DispatchQueue.global().async {
        // Perform async operation 2
        expectation2.fulfill()
    }

    let result = XCTWaiter.wait(for: [expectation1, expectation2], timeout: 1.0)

    XCTAssertEqual(result, .completed)
}
```

在这个例子中，我们创建了两个 `XCTestExpectation` 对象，并在两个不同的全局队列中执行异步操作。然后，我们使用 `XCTWaiter` 等待这两个期望，直到它们都被标记为已完成。最后，我们验证等待的结果是否为 `.completed`。

`XCTWaiter` 的 `wait(for:timeout:)` 方法需要传递两个参数：

- `expectations`：要等待的期望对象的数组。
- `timeout`：等待的超时时间。

当所有期望对象都被标记为已完成时，`wait(for:timeout:)` 方法会返回 `.completed`。如果等待超时或者其中一个期望对象失败，则会返回 `.timedOut` 或 `.incorrectOrder`。

总之，`XCTWaiter` 可以用于等待多个异步操作完成，并验证它们是否成功完成。

## 使用带有谓词的 XCTNSPredicateExpectation

您还可以使用 `XCTNSPredicateExpectation` 等待满足特定条件的 Expectation，例如网络响应或 UI 更新。例如：

```swift
func testNetworkRequest() {
    let expectation = XCTNSPredicateExpectation(predicate: NSPredicate(format: "count > 0"), object: data)

    // 执行一个网络请求来填充数据数组
    performNetworkRequest()

    // 等待数据数组被填充
    wait(for: [expectation], timeout: 5.0)
}
```

在这个例子中，我们创建了一个带有谓词的 Expectation 对象，该谓词检查 `data` 数组是否具有超过 0 个元素。然后，我们执行一个网络请求来填充 `data` 数组，并使用 `wait(for:timeout:)` 方法等待 Expectation 被满足。

## 使用带有处理程序的 XCTestExpectation

您还可以在 `XCTestExpectation` 中使用完成处理程序，在 Expectation 被满足后执行一些附加验证或清理操作。例如：

```swift
func testAsyncOperation() {
    let expectation = XCTestExpectation(description: "Async operation completed")

    // 执行一些异步操作
    DispatchQueue.main.async {
        // 当异步操作完成时，标记Expectation已完成
        expectation.fulfill()
    }

    // 等待Expectation被满足
    wait(for: [expectation], timeout: 5.0) { error in
        // 处理任何错误或执行其他验证
        XCTAssertNil(error)
    }
}
```

在这个例子中，我们创建了一个带有描述和完成处理程序的 Expectation 对象。然后，在主队列上执行了一个异步操作，并使用 `wait(for:timeout:handler:)` 方法等待 Expectation 被满足。在完成处理程序中，我们检查是否有任何错误，并在需要时执行其他验证。

## 使用 Async/Await 并发测试

在 Swift 5.5 及更高版本中，可以使用 Async/Await 来编写测试。

下面是一个使用异步/等待测试异步代码的示例：

```swift
func testDownloadWebDataWithConcurrency() async throws {
    // Create a URL for a webpage to download.
    let url = URL(string: "https://apple.com")!

    // Use an asynchronous function to download the webpage.
    let dataAndResponse: (data: Data, response: URLResponse) = try await URLSession.shared.data(from: url, delegate: nil)

    // Assert that the actual response matches the expected response.
    let httpResponse = try XCTUnwrap(dataAndResponse.response as? HTTPURLResponse, "Expected an HTTPURLResponse.")
    XCTAssertEqual(httpResponse.statusCode, 200, "Expected a 200 OK response.")
}
```

可以指定 `MainActor`来使测试代码在主线程允许。

```swift
@MainActor
func testImageConfigurationCompletionCallback() async {
    let viewController = ImageViewController()
    let imageURL = URL(string: "https://source.unsplash.com/random/300x200")!
    let imageConfigurationExpectation = expectation(description: "Image should be configured")
    viewController.configureImage(using: imageURL, completion: {
        imageConfigurationExpectation.fulfill()
    })
    await fulfillment(of: [imageConfigurationExpectation])
}
```

## XCTKVOExpectation 测试 KVO

`XCTKVOExpectation` 用于需要验证某个属性是否在特定时刻发生了更改，或者是否以期望的方式更改。使用 `XCTKVOExpectation`，可以等待属性更改，并验证其值是否符合预期。

下面是一个使用 `XCTKVOExpectation` 测试 KVO 行为的示例：

```swift
func testPersonNameChanged() {
    let person = Person(name: "John")
    let expectation = XCTKVOExpectation(keyPath: #keyPath(Person.name), object: person, expectedValue: "Jane")

    DispatchQueue.global().async {
        person.name = "Jane"
    }

    wait(for: [expectation], timeout: 1.0)
}
```

在这个例子中，我们创建了一个 `Person` 对象，并使用 `XCTKVOExpectation` 来等待其名称属性更改为 "Jane"。然后，我们在全局队列上异步更改 `person` 对象的名称属性。最后，我们使用 `wait(for:timeout:)` 方法等待期望被满足。

`XCTKVOExpectation` 的构造函数需要传递三个参数：

- `keyPath`：要观察的属性的键路径。
- `object`：要观察的对象。
- `expectedValue`：期望属性更改的值。

当属性更改时，`XCTKVOExpectation` 会自动标记为已完成，并验证属性的新值是否等于预期值。

## XCTNSNotificationExpectation 测试通知

当通知发送时，`XCTNSNotificationExpectation` 会自动标记为已完成，并验证通知的信息是否符合预期。

下面是一个使用 `XCTNSNotificationExpectation` 测试通知行为的示例：

```swift
  func testNotification() {
      let notificationName = Notification.Name("MyNotification")
      let objectToPostNotification = NSObject()
      let expectation = self.expectation(forNotification: notificationName, object: objectToPostNotification, handler: nil)

      DispatchQueue.global().async {
          NotificationCenter.default.post(name: notificationName, object: objectToPostNotification)
      }

      waitForExpectations(timeout: 5) { (error) in
          if let error = error {
              XCTFail("Expectation failed with error: \(error)")
          }
      }
  }
```

在这个示例中，我们创建了一个 `XCTNSNotificationExpectation` 对象来监听名为 "MyNotification" 的通知。然后，我们异步发送了这个通知，并使用 `waitForExpectations` 方法等待通知的到来。如果在 5 秒内收到通知，测试将成功通过；否则，测试将失败。

## 总结

总的来说，XCTest 提供了几个强大的工具来处理异步测试和 Expectation。通过使用这些工具，您可以编写稳健和可靠的测试，涵盖各种异步场景。
