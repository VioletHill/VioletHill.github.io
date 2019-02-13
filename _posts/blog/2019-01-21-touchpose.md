---
layout: post
title: Demo 神器 Touchpose
category: blog
description: 在 Demo  演示中，把 FingerPoint 全部展现出来
---

TouchPose 能够在你做 demo 工程演示的时候，把你的所有 FingerPoint 全部展示出来，良心推荐

    ![image](/images/blog/touchpose/touchpose.png)
    
安装方法(Swift 工程):

* 1. Clone Touchposé
    
```
$ git clone https://github.com/toddreed/Touchpose.git
```

* 2. 添加 Touchposé 文件

    将下面 2 个文件拖入工程
        
    * QTouchposeApplication.h
    * QTouchposeApplication.m
    
    ![image](/images/blog/touchpose/addfile.png)

* 3. 创建 bridge 文件（如果已经有了，可以跳过），把 `QTouchposeApplication.h` 加入到 bridge 文件中

```
#import "QTouchposeApplication.h"
```

* 4. 接下来是大头，在 Swift 工程中，因为 main.m 文件的取消，需要我们手动创建。所以，新建一个 Swift 文件，将其命名为 `main.swift`，插入以下代码

    ![image](/images/blog/touchpose/swiftfile.png)

```
//
//  main.swift
//  TouchPoseDemo
//
//  Created by Feng Qiu on 2019/1/20.
//  Copyright © 2019 www.qiufeng.me. All rights reserved.
//

import Foundation
import UIKit

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv, NSStringFromClass(QTouchposeApplication.self), NSStringFromClass(AppDelegate.self))

```

以上代码为 `Swift 4` 语言，如果无法编译，Google 一下对应的语言变化，主要是 `CommandLine.argc, CommandLine.unsafeArgv` 这两个参数

接着, 去你的 `AppDelegate.swift` 注释掉 `@UIApplicationMain`

```
import UIKit

//@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
}
```

* 5. 始终显示 touches

修改 `AppDelegate.swift` 的 `didFinishLaunchingWithOptions` 的方法，加入以下代码

```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    (application as! QTouchposeApplication).alwaysShowTouches = true
    //......
}
```

* 6. Done, enjoy your demo
