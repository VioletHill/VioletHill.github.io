---
layout: post
title: 	制作自己的 CocoaPods
category: blog
description: 在 GitHub 中制作一个自己的 CocoaPods
---

本文以 GitHub 中的 [QIULaunchAnimation](https://github.com/VioletHill/QIULaunchAnimation) 为例，介绍如何制作一个自己的 Cocoapods

首先，确保你已经安装了 Cocoapods, 并且版本大于 0.33。接着，我们打开 Terminal, 输入

`$ pod spec create QIULaunchAnimation`

该命令会在你的当前目录下创建一个 QIULaunchAnimation.podspec 的文件，打开文件可以逐一看到所有的内容，并且每一项内容都有详细的介绍是干嘛的。这里我们直接省略，截取我们需要的内容如下：

`#`
`#  Be sure to run ``pod spec lint QIULaunchAnimation.podspec`` to ensure this is a`

`#  valid spec and to remove all comments including this before submitting the spec.`

`#`

`#  To learn more about Podspec attributes see http://docs.cocoapods.org/specification.html`

`#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/`

`#`

`Pod::Spec.new do |s|`

` s.name         = "QIULaunchAnimation"`

` s.version      = "0.0.1"`

`  s.summary      = "Launch animation like Twitter"`
                   
`  s.homepage     = "https://github.com/VioletHill/QIULaunchAnimation"`

 ` s.license      = 'MIT' ` 
 
 ` s.author       = { "QiuFeng" => "qfviolethill@163.com" }`
 ` s.source       = { :git => "https://github.com/VioletHill/QIULaunchAnimation.git", :tag => "0.0.1" }`
 
`  s.source_files = 'src/*.{h,m}'`
` s.framework  = 'UIKit'`

`  s.platform     = :ios, '7.0'`

`  s.requires_arc = true  `


`end`

这里需要注意的几点:
* license 是必须的
* s.source_files 显示你的的 pods 中包含了哪些文件
* platform 中显示了仅仅支持 iOS

具体的 license 中内容可以参见[这里](https://github.com/VioletHill/QIULaunchAnimation/blob/master/LICENSE)

之后把你的代码 push 到 GitHub 上，并且打上 tag 0.01 (和上述 s.source 中描述的相同即可)


###Trunk (利用 Trunk 发布你的库)

最后一步，把你的代码发布到 Cocoapods 官方管理中，这样别人就能通过 

`pod search QIULaunchAnimation` 

寻找到这个库。

首先 在  Terminal 中输入:

`$ pod trunk register your@email.com "QiuFeng"`

接着去你的邮箱里查收一个链接，表示注册 trunk 成功， 然后输入

`pod trunk push NAME.podspec`

成功之后，在终端看到如下:

`Validating podspec`

 `-> QIULaunchAnimation (0.0.1)`

`Updating spec repo master`

接着 运行 

`pod search QIULaunchAnimation`

即可搜索到这个库了