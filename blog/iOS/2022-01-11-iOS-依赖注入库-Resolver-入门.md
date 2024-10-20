---
title: iOS 依赖注入库 Resolver 入门
description: "iOS 依赖注入库 Resolver 入门"
slug: resolver
date: 2022-01-11
tags: [iOS]
---

为什么需要依赖注入，则不在本文讨论范围中。

## Why Resolver?

Swift 的依赖注入库有很多，比如 GitHub Star 数最多的[Swinject](https://github.com/Swinject/Swinject/)，也有大厂开源的如 Uber 的[Needle](https://github.com/uber/needle/)，百度的[CarbonGraph](https://github.com/baidu/CarbonGraph/), 其它的如[Cleanse](https://github.com/square/Cleanse)，以及本文介绍的[Resolver](https://github.com/hmlongco/Resolver)。

为什么技术选型时选择 Resolver？
最重要的一点是 Resolver 的接口设计非常简洁，能够适应各种依赖注入的场景。

<!-- truncate -->

作者 Michael Long 因此 Resolver 项目获得了 Google 颁发的 2021 年度[Open Source Peer Bonus](https://opensource.googleblog.com/2021/09/announcing-latest-open-source-peer-bonus-winners.html)奖项。

> 简单介绍一下这个奖，这是由 Google 内部员工提名，给一些知名的开源项目作者或者核心贡献者的奖项，包括但不限于 Google 自己的开源项目。2021 年度获奖的作者中大部分是 Google 自己的开源项目的贡献者，比如 TensorFlow、Flutter、Go 等。也有些另类的贡献者，如 CocoaPods 的 Orta，以及本文介绍的 Resolver 项目作者。

## 基本用法

Swift 语言级别支持的依赖注入方法包括以下三种：

- 构造函数注入
- 方法注入
- 属性注入
- 接口注入
- Service Locator

[Resolver](https://github.com/hmlongco/Resolver) 完全支持上面几种方法，且是线程安全的。

基本的用法如下:

**属性**

```swift
class MyViewController: UIViewController {
    var xyz: XYZViewModel = Resolver.resolve()
}
```

**协议**
任何对象都可以实现`Resolving`协议，只要实现这个协议，就有了一个默认的 resolver 变量。

```swift
class MyViewController: UIViewController, Resolving {
    lazy var viewModel: XYZViewModel = resolver.resolve()
}

class ABCExample: Resolving {
    lazy var service: ABCService = resolver.resolve()
}
```

**接口注入**
如果你是个依赖注入的强迫症患者，喜欢接口注入这种比较纯粹的方法，可以像下面一样：

```swift
class MyViewController: UIViewController {
    lazy var viewModel = makeViewModel()
}

extension MyViewController: Resolving {
  func makeViewModel() -> XYZViewModel { return resolver.resolve() }
}
```

当然也可以通过一个 readonly 的属性来达到目的：

```swift
extension MyViewController: Resolving {
    var myViewModel: XYZViewModel { return resolver.resolve() }
}
```

这种方法有个缺点是每次调用都生成一个新的 ViewModel，可能不是你想要的。

**可选注入**
当有些依赖对象是可选时，Resolver 使用`optional()`方法返回可选对象。

```swift
var abc: ABCService? = resolver.optional()
var xyz: XYZService! = resolver.optional()
```

这里就得指定变量的类型了，否则 Swift 的类型推断会报错。

## 注解注入

2019 年 Swift 5.1 带来了的新特性：[Property Wrappers](https://docs.swift.org/swift-book/LanguageGuide/Properties.html#ID617)，这使得 Resolver 有了更简便的注入方式，通过`@Injected`注解来达到依赖注入。

下面我们来看一个简单的注解使用:

```swift
class HomeViewController: UIViewController {
  @Injected var network: NetworkService
  @LazyInjected var storage: StorageService

  override void viewDidLoad() {
    super.viewDidLoad()

    let userId = storage.readUser().userId
    network.load(with: userId)
      ...
  }
}
```

`@Injected`使用非常简单，只需要在你的属性前面添加这个注解即可，无需手动初始化`network`对象，使用对象的时候直接调用。

`@Injected`是`HomeViewController`对象初始化完成就注入了，还有一个`@LazyInjected`注解，只有在真实调用的时候才会注入。

当然，上面的代码还不能直接使用，因为还没有注册注入对象。

## 注册服务

添加一个文件`AppDelegate+Injection.swift`，在里面粘贴如下代码：

```swift
extension Resolver: ResolverRegistering {
  public static func registerAllServices() {
    register { NetworkService() }
    register { StorageService() }
  }
}

```

扩展 Resolver，遵循`ResolverRegistering`协议，然后实现静态方法 `registerAllServices()`，在函数体内调用`register{}`注册所有需要的依赖对象。

Resolver 会利用 Swift 的类型推断来自动决定和注册返回值的类型，当然你也可以特别指定你的对象实现了哪些协议。

```swift
register { XYZCombinedService() }
      .implements(XYZFetching.self)
      .implements(XYZUpdating.self)
```

当你使用面向协议编程时，变量类型会更多的使用协议，而不是实现协议的类，如

```swift
protocol NetworkService {
  func load() -> [Any]
}

class NetworkServiceImpl: NetworkService {
  func load() -> [Any] {
    ...
    return []
  }
}

class HomeViewController {
  @Injected var network: NetworkService
}
```

这时，除了类似上面`.implements()`方法，还可以使用`as` 方法：

```swift
main.register { NetworkServiceImpl() as NetworkService }
```

协议还可以共享同一个实例，如`XYZCombinedService`对象初始化之后，后面的`resolve()`操作都是直接返回前面已经初始化的对象:

```swift
main.register { resolve() as XYZCombinedService as XYZFetching }
main.register { resolve() as XYZCombinedService as XYZUpdating }
main.register { XYZCombinedService() }
```

## 带参数的依赖注入

有时候，依赖对象初始化时，需要额外的参数。Resolver 提供了一个参数`args`，可以往`args`添加你想要的参数，这是一个 Swift 5.2 的[callAsFunction](https://docs.swift.org/swift-book/ReferenceManual/Declarations.html#ID622)的功能实现。

例如一个`NetworkService`需要区分测试环境和正式环境，它们的`baseURL`不一样。

我们可以这么做:

```swift
class ViewController: UIViewController, Resolving {
    var baseURL = "https://test.google.com"
    lazy var viewModel: NetworkService = resolver.resolve(args: baseURL)
}
```

注册的时候将 args 参数传递给构造函数即可：

```swift
register { (_, args) in
  NetworkService(baseURL: args())
}
```

**多个参数传递**

可以将`args`当做 Map 传递，实际 Resolver 接收到的是 `[String:Any?]`类型。

```swift
class ViewController: UIViewController, Resolving {
    lazy var viewModel: XYZViewModel = resolver.resolve(args: ["mode": true, "name": "Editing")
}

register { (_, args) in
    XYZViewModel(editMode: args("mode"), name: args("name"))
}
```

**可选参数传递**

```swift
register { (_, args) in
    XYZService(someOptionalValue: args.optional())
}
```

当你使用`@Injected`的时候，参数不可用，没法做到下面这样:

```swift
@Injected(args: baseURL) var network: NetworkService
```

虽然 Resolver 可以解决带参数的依赖注入，但是不太建议这么做，因为数据不适合用来注入，比如详情界面跳转携带的`userId`等。大家要更关注在 Service 类对象上，这些才是我们平常说的依赖。

## Scopes

Resolver 提出了一个 Scopes 概念，简单来说是控制一个依赖对象的生命周期。

大部分人习惯了单例，任何一个多个地方需要用到的对象，都可以用单例实现，避免重复生成对象。目的是没有错的，但是却用错了方法。

Resolver 建议我们使用 Scopes 来严格控制依赖对象的创建和销毁，有些依赖对象只存在于一个 ViewController，有的是应用级别的，有的不用了可以销毁。

Resolver 内置了 6 种 scopes：

- `.application`：

  > 在 App 运行期间，Resolver 会一直持有对象，且只在调用时初始化一次，每次都返回初始化的值。

- `.cached`：：

  > Resolver 会一直持有对象，且只在调用时初始化一次，每次都返回初始化的值。和`.application`不同的是，`.cached`可以重置所有对象，通过调用`ResolverScope.cached.reset()`释放掉所有持有的缓存依赖对象。

- `.graph`

  > 默认的 scopes，内部有一个决策循环，会重用已经创建的依赖对象。假如 A 依赖 B、C，B 和 C 都依赖 D，注册 A 对象时，会先注册 B 中的 D，到注册 C 时就不会重复注册 D 了，会重用 B 之前的 D。

- `.shared`

  > 弱引用对象，只适用于 class 类型，不适用 value 类型。当有一个强引用持有`resolve()`的对象，后续的调用都会返回同一个对象。当所有强引用释放掉了之后，`.shared` 的实例也会释放，直到下一次调用`resolve()`，这时会创建一个新的实例。

- `.unique`

  > 唯一的依赖对象，每次调用`resolve()`都会返回新的实例。

- `.container`

  > 有点类似`.cached`，在这个 scope 里面的对象会被缓存，直到缓存被重置或释放，或者 containner 不再存在。常用使用场景是用于依赖对象跟容器的生命周期一致的情况，比如在运行期手动创建 mock 和 testing，用完之后就释放掉。

**具体用法**

NetworkService 在整个 Application 生命周期中都唯一存在。

```swift
register { NetworkService() }
    .scope(.application)
```

**自定义缓存**

```swift
extension ResolverScope {
    static let session = ResolverScopeCache()
}
```

注册时指定`.session`：

```swift
register { NetworkService() }
    .scope(.session)
```

需要的时候进行重置:

```swift
ResolverScope.session.reset()
```

## 参考

- [Resolver Injection](https://github.com/hmlongco/Resolver/blob/master/Documentation/Injection.md#locator)

- [Property Wrappers](https://docs.swift.org/swift-book/LanguageGuide/Properties.html#ID617)

- [Resolver for iOS Dependency Injection: Getting Started](https://www.raywenderlich.com/22203552-resolver-for-ios-dependency-injection-getting-started)

- [Swift 5.1 Takes Dependency Injection to the Next Level](https://betterprogramming.pub/taking-swift-dependency-injection-to-the-next-level-b71114c6a9c6)
