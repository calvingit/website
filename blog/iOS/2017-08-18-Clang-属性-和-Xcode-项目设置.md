---
title: Clang 属性 和 Xcode 项目设置
description: "Clang 属性 和 Xcode 项目设置"
slug: clang
date: 2017-08-18
tags: [iOS]
---

### 忽略 Warning "Unknown attribute 'xxx' ignored"

```objc
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wattributes"
//code
#pragma clang diagnostic pop



//定义宏里面用到#pragma时需要用_Pragma("")来代替：

#define OCPACK_BEGIN    \
_Pragma("clang diagnostic push")    \
<!-- truncate -->
_Pragma("clang diagnostic ignored \"-Wattributes\"")

#define OCPACK_END  \
_Pragma("clang diagnostic pop")

#define OCPACK_METHOD \
__attribute__((ocslite))
```

### 错误解决：Cannot specify -o when generating multiple output files

```sh
Showing All Errors Only
Cannot specify -o when generating multiple output files

解决办法：
Build setting中的 Enable Index-While-Building Functionality 设置为NO
```

### 错误解决：xcode9 输出的 SDK，xcode8 无法集成的解决方法

当低版本的 xcode 集成高版本的静态库时，会提示：Xcode Framework not found FileProvider for architecture x86_64/arm64

方法一：

依然使用高版本方法输出 SDK

SDK 方：

1、Build Settings 中 Link Frameworks Automatically 把默认 Yes 改成 No!

2、Build Phases 中 Link Binary With Libraries 添加对应的 Lib

接入方：

3、要求接也在 Build Phases 中 Link Binary With Libraries 添加对应的 Lib
方法二：

SDK 方用低版本的 xcode 输出 SDK
方法三：

接入方用高版本的 xcode 集成

### 低版本 iOS 上调用高版本 API 的检查

iOS 代码中经常会出现这样的情况：

- 工程的 target 是 iOS 8
- 代码中可能有调用 iOS 10 的 API

理论上在所有调用 iOS 10 的 API 时应判断此 API 是否 available

- 但开发过程中有可能会忘

编译器支持一个 warning flag: `-Wpartial-availability`来检测到这种情况

build 后会出现的 warning:

```sh
'xxxxx' is only avaialble on iOS 9.0 or newer
'xxxxx' has been explicitly marked partial here
```

开发修改完后可用#pragma 来 suppress 掉相应的 warning

```objc
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"

//code

#pragma clang diagnostic pop
```

### 指定 Objective-C 变量不被提前 release 的 attribute

```objc
// Mark local variables of type 'id' or pointer-to-ObjC-object-type so that values stored into that local variable are not aggressively released by the compiler during optimization, but are held until either the variable is assigned to again, or the end of the scope (such as a compound statement, or method definition) of the local variable.
#ifndef NS_VALID_UNTIL_END_OF_SCOPE
#if __has_attribute(objc_precise_lifetime)
#define NS_VALID_UNTIL_END_OF_SCOPE __attribute__((objc_precise_lifetime))
#else
#define NS_VALID_UNTIL_END_OF_SCOPE
#endif
#endif
```

### 变量作用域时自动执行指定方法

`__attribute__((cleanup(...)))`，用于修饰一个变量，在它的作用域结束时可以自动执行一个指定的方法

这样的写法可以将成对出现的代码写在一起，比如说一个 lock：

```objc
NSRecursiveLock *aLock = [[NSRecursiveLock alloc] init];
[aLock lock];
// 这里
//     有
//        100多万行
[aLock unlock]; // 看到这儿的时候早忘了和哪个lock对应着了
```

用了 onExit 之后，代码更集中了：

```objc

#define onExit\
    __strong void(^block)(void) __attribute__((cleanup(blockCleanUp), unused)) = ^


NSRecursiveLock *aLock = [[NSRecursiveLock alloc] init];
[aLock lock];
onExit {
    [aLock unlock]; // 妈妈再也不用担心我忘写后半段了
};
// 这里
//    爱多少行
//           就多少行
```

参考资料：

- [原贴](http://blog.sunnyxx.com/2014/09/15/objc-attribute-cleanup/)
- [其他一些常用的**attribute**介绍](https://nshipster.com/__attribute__/)

### \_\_builtin functions

```objc
//当前函数的返回地址：
void *addr = __builtin_return_address(0);
NSLog(@">>>>>>> %p", addr);

```

### Unavailable attribute

```objc
#define NS_AUTOMATED_REFCOUNT_UNAVAILABLE __attribute__((unavailable("not available in automatic reference counting mode")))
```
