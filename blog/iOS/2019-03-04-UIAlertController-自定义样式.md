---
title: UIAlertController 自定义样式
description: "UIAlertController 自定义样式"
slug: ios-uialertcontroller
date: 2019-03-04
tags: [iOS]
---

## 修改 UITextField 高度

如果是简单的弹框输入文字，即可在 UIAlertController 里添加 UITextField，在修改 UITextField 的高度时需要用到约束才有效。

<!-- truncate -->

不能直接改 frame.size.height，这样无效，需要添加约束：

swift:

```swift
alertController.addTextField { textField in
    let heightConstraint = NSLayoutConstraint(item: textField, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: 100)
    textField.addConstraint(heightConstraint)
}
```

objective-c:

```objc
NSLayoutConstraint * heightConstraint = [NSLayoutConstraint constraintWithItem:textField attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:32];
[textField addConstraint: heightConstraint];
```
