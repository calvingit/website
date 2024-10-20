---
title: SwiftUI 的 Environment 变量
description: "SwiftUI 的 Environment 变量"
slug: swiftui-environment-value
date: 2023-05-07
tags: [iOS]
---

在 SwiftUI 中，环境变量是一种强大的机制，允许我们在视图层次结构中传递数据，而无需通过每个视图的参数进行显式传递。这种机制使得我们可以轻松地管理全局状态和配置。本文将深入探讨 SwiftUI 的环境变量，包括如何定义、使用和扩展它们。

<!-- truncate -->

## 什么是环境变量？

环境变量是 SwiftUI 中的一种特殊类型的值，它可以在视图层次中传播。通过使用 `@Environment` 属性包装器，我们可以访问这些值。环境变量通常用于传递信息，如主题、字体、用户设置等。

## 如何定义自定义环境值

要定义自定义环境值，我们需要遵循以下步骤：

1. **创建一个符合 `EnvironmentKey` 协议的结构体**：

   ```swift
   struct CustomKey: EnvironmentKey {
       static let defaultValue: Int = 0
   }
   ```

2. **扩展 `EnvironmentValues` 以添加新的环境值**：

   ```swift
   extension EnvironmentValues {
       var customValue: Int {
           get { self[CustomKey.self] }
           set { self[CustomKey.self] = newValue }
       }
   }
   ```

3. **在视图中使用自定义环境值**：

   ```swift
   struct ContentView: View {
       @Environment(\.customValue) var value: Int

       var body: some View {
           Text("Custom Value: \(value)")
       }
   }
   ```

4. **设置环境值**：
   ```swift
   struct ParentView: View {
       var body: some View {
           ContentView()
               .environment(\.customValue, 42)
       }
   }
   ```

## 读取和修改环境值

使用 `@Environment` 属性包装器，我们可以读取环境值。如果需要修改这些值，可以使用 `Binding` 来实现。

```swift
struct ToggleView: View {
    @Environment(\.toggleBinding) var toggle: Binding<Bool>

    var body: some View {
        Toggle("Enable Feature", isOn: toggle)
    }
}
```

## 环境中的绑定

绑定允许子视图不仅可以读取环境值，还可以修改它们。这是通过将绑定传递到环境中实现的。

```swift
struct ParentView: View {
    @State private var isEnabled = false

    var body: some View {
        ToggleView()
            .environment(\.toggleBinding, $isEnabled)
    }
}
```

## 动作和闭包

SwiftUI 还引入了一种新的动作模式，允许我们将闭包设置到环境中，以便在相关视图中触发。这种方法使得视图之间的交互更加简洁。

```swift
struct ActionKey: EnvironmentKey {
    static let defaultValue: () -> Void = {}
}

extension EnvironmentValues {
    var actionHandler: () -> Void {
        get { self[ActionKey.self] }
        set { self[ActionKey.self] = newValue }
    }
}
```

然后在视图中使用它：

```swift
struct ActionView: View {
    @Environment(\.actionHandler) var action

    var body: some View {
        Button("Trigger Action") {
            action()
        }
    }
}
```

## 使用类作为环境值

除了结构体，SwiftUI 也允许使用类作为环境值。这意味着我们可以修改类实例的属性，并且这些更改将在整个视图层次中反映出来。

```swift
class UserSettings: ObservableObject {
    @Published var username: String = "Guest"
}

struct UserSettingsKey: EnvironmentKey {
    static let defaultValue = UserSettings()
}

extension EnvironmentValues {
    var userSettings: UserSettings {
        get { self[UserSettingsKey.self] }
        set { self[UserSettingsKey.self] = newValue }
    }
}
```

## 总结

SwiftUI 的环境变量提供了一种灵活且强大的方式来管理应用程序中的状态和配置。通过自定义环境值、使用绑定以及利用动作模式，开发者可以构建出更为复杂且易于维护的用户界面。随着 SwiftUI 的不断发展，理解和掌握这些概念将有助于提升开发效率和代码质量。

参考资料：

- [Custom SwiftUI Environment Values Cheatsheet](https://www.fivestars.blog/articles/custom-environment-values-cheatsheet)

- [The SwiftUI Environment](https://www.fivestars.blog/articles/swiftui-environment-propagation)

- [Every SwiftUI Environment Value explained](https://www.fivestars.blog/articles/swiftui-environment-values)

- [Environment values](https://developer.apple.com/documentation/swiftui/environment-values)
