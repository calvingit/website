---
title: 让iOS 13支持UIKit 的 #Preview 预览功能
description: "让iOS 13支持UIKit 的 #Preview 预览功能"
slug: enable-ios-13-to-preview
date: 2023-07-18
tags: [iOS]
---

2023 年 7 月 5 日，Apple 发布了 Xcode 15 Beta 3。为了尝鲜，我立马安装了一下，然后在 Release Notes 的 **Previews** 章节看到有这么一句话：

> The `#Preview` can now be used in projects with deployment targets prior to iOS 17 and macOS 14. Usages of `#Preview` for SwiftUI can also be previewed on OS versions earlier than iOS 17 and macOS 14 by adding `@available(iOS 16.0, macOS 13.0, *)` to the `#Preview` (or whichever version you’d like to preview). Usages of `#Preview` for UIKit & AppKit views and view controllers, and for widgets can’t be previewed on OS versions prior to iOS 17 and macOS 14. (110676526)

意思很简单，`#Preview` 支持 iOS 17 之前的 SwiftUI，但是不支持 iOS 17 之前的 UIKit 的 view 和 view controller 预览。刚高兴了一秒钟，立马被打回原型。

<!-- truncate -->

不过，这比我预想中要好一些了，我原以为 Swift 5.9 的 `Macro` 不支持老版本系统，像 `SwiftData` 一样，只能从 iOS 17 开始。但这是错误的，毕竟`Macro`是纯 Swift 的语法，跟其他的 UIKit 等 Framework 没有关系。其实这也容易证实，大部分自定义的`Macro`库都依赖官方的 [apple/swift-syntax](https://github.com/apple/swift-syntax) ，到这个仓库的 `Package.swift`看看， iOS 的最低支持版本是 v13。

## SwiftUI 预览

对于 SwiftUI 的预览，我其实已经很满意了，新的 `#Preview` 宏并没有减少很多代码。

对比一下旧方法和新方法：

```swift
import SwiftUI

struct SwiftUIView: View {
    var body: some View {
        Text("Hello, World!")
    }
}

// 旧方法
struct SwiftUIView_Preview: PreviewProvider {
    static var previews: some View {
        SwiftUIView()
    }
}

// 新方法
#Preview {
    SwiftUIView()
}
```

## UIKit 预览

可惜 UIView 和 UIViewController 的预览功能只支持 iOS 17，Apple 的做法有点不太厚道

```swift
@available(iOS 17.0, macOS 14.0, tvOS 17.0, *)
@freestanding(declaration) public macro Preview(_ name: String? = nil, traits: PreviewTrait<Preview.ViewTraits>..., body: @escaping () -> UIView) = #externalMacro(module: "PreviewsMacros", type: "Common")

@available(iOS 17.0, macOS 14.0, tvOS 17.0, *)
@freestanding(declaration) public macro Preview(_ name: String? = nil, traits: PreviewTrait<Preview.ViewTraits>..., body: @escaping () -> UIViewController) = #externalMacro(module: "PreviewsMacros", type: "Common")
```

目前我也只在简单的几个界面或者静态界面用用 SwiftUI，尤其是要保证 App 最低支持到 iOS 13 ，所以也就限制了只能使用 SwiftUI 1.0 的功能。真正能用 SwiftUI 开发全新 App 还得从 SwiftUI 2.0 开始，即最低版本支持到 iOS 14，因为 2.0 版本更新一大堆的基础功能，尤其是 LazyVGrid 和 LazyHGrid。

所以大部分是 UIKit 开发的界面，又想要拥有 SwiftUI 这么方便的预览功能，怎么办？

目前我想到的办法就是借由 SwiftUI 和 UIKit 之间的桥接协议，将需要预览的 UIView 使用 SwiftUI 包装一下。下面代码是一个简单的实现：

```swift
/// 预览 UIViewController
struct UIViewControllerPreviewWrapper<T: UIViewController>: UIViewControllerRepresentable {
    let viewController: T

    init(_ viewControllerBuilder: @escaping () -> T) {
        viewController = viewControllerBuilder()
    }

    func makeUIViewController(context: Context) -> T {
        return viewController
    }

    func updateUIViewController(_ uiViewController: T, context: Context) {}
}

/// 预览 UIView
struct UIViewPreviewWrapper<T: UIView>: UIViewRepresentable {

    let view: T
    init(_ viewBuilder: @escaping () -> T) {
        view = viewBuilder()
    }

    func makeUIView(context: Context) -> UIView {
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}

```

例如，我们创建了一个 `ViewController`，里面有一个 Button 和 Label ，点击 Button 会做 +1 操作，并将次数显示在 Label 上。如果是需要预览静态界面，在 xib 和 storyboard 上就可以，但是如果我们想要点击 Button 并实际响应的话，这两种方法都做不到。但是用上面的代码封装的预览功能就可以做到，使用方法也很简单：

```swift
struct UIViewController_Preview: PreviewProvider {
    static var previews: some View {
        UIViewControllerPreviewWrapper {
            let vc = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController()!
            return vc
        }
    }
}
```

当然，上面提到，SwiftUI 的 `#Preview` 向后支持到 iOS 13，我们也可以这样简化一下：

```swift
@available(iOS 13.0, *)
#Preview {
    UIViewControllerPreviewWrapper {
        let vc = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController()!
        return vc
    }
}
```

效果如下，可以点击 Button ，然后触发真实的点击事件：

![pW63hS](https://cdn.zhangwen.site/uPic/pW63hS.png)

## 总结

`#Preview` 的本质是跑了一个模拟器 App，所以 `#Preview` 只支持模拟器版本的 App。如果你的工程只支持真机调试，比如你使用了一些第三方 SDK，别人没有打包模拟器版本，那对不起 了，预览功能没法用。

## 参考

- [New Features in Xcode 15 Beta 3](https://developer.apple.com/documentation/xcode-release-notes/xcode-15-release-notes#New-Features-in-Xcode-15-Beta-3)
