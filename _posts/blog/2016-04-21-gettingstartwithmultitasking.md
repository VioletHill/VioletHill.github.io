---
layout: post
title: 	让你的 App 开启 Multitasking 之旅
category: blog
description: App UI 适配 Multitasking
---

让我们先对 Multitasking 作一个简单的介绍：

###### 硬件要求： iPad Pro, iPad Air, iPad Air 2, and iPad mini 2 以及以后设备.
###### 软件要求： iOS 9 以其以后的操作系统

### Slide Over：

Slide Over 可以让你在不离开一个 App 的情况下，快速的启动另外一个 App 查找一些有用的信息，比如快速你的 iMessage、邮件 或者是创建一个备忘录之类的。

操作方式很简单，从 iPad 的最右边开始，用滑动手势从右向左滑动，即可滑动出 Slide Over 页面，当你需要切换 Slide Over 的 App 时，只需要在 Slide Over 界面从上向下滑动，就可以切换其他 App


![Slide Over](/images/blog/GettingStartWithMultitasking/ipad-ios9-slide-over.jpg)

### Split View:

Split View 的概念就是你可以在一个 iPad 中同时使用 2 个 App, 就像下图一样。如果你想关闭其中的任意一个 App, 只需要继续拖动中间的示器即可

当然，Split View 需要 App 的支持，例如：Safari, Notes, Photos, Maps, 这些 App 都支持了 Split View


![Split View](/images/blog/GettingStartWithMultitasking/ipad-ios9-split-view.jpg)


## 如何为 iPad 适配 Multitasking

* 使用 iOS 9 以后的 SDK
* 让设备支持所有方向 （Portrait, Upside Down, Landscape Left, Landscape Right）
* 使用 Launch Storyboards

---

对于所有的 UI 适配，使用 AutoLayout（在 iOS 9 以后， AutoLayout 支持了 Right-to-left language） 适配，否则，你的 App 很难适配 Multitasking， 由于 Multitasking 的特殊性，以下几个代码需要更新到新版本：

* ###UIScreen & UIWindows

		 UIScreen.bounds  //返回的是屏幕的 bounds， 也就是设备的 bounds， 有可能不在是你 App 运行环境的 bounds 了
		 UIWindows.bounds //返回你 App 运行环境的 bounds，并且 origin 永远返回 (0，0)
		 
	所以 如果你之前使用 UIScreen 来进行布局的话，尽快更换为 AutoLayout, 或者使用 UIWindows.bounds

* ###SizeClass 的应用

	SizeClass 是在 iOS 8 中提出的概念，对于宽度分为 Horizontally Regular 和 Horizontally Compact，在 iOS 8 中可以区分 iPhone 和 iPad，以及 iPhone 的横屏布局。现在，同样适用于 Slide Over 以及 Split View， 在 Slide Over 中，宽度类型为 Horizontally Compact，在 Split View 为 Horizontally Regular
	
	所以，下面的代码将被时代抛弃：
	
		if UIInterfaceOrientationIsLandscape(interfaceOrientation) {
			...
		}
		
	原因在于，当一个 App 处在 Slide Over 的时候，即使他是横屏，仍然可以模拟出 Portrait 的状态，如 Slide Over
	
    取而代之的可以使用这种方法：
    
    	if view.bounds.size.width > view.bounds.size.height {
    		...
    	}
    	
    	推荐
    	if traitCollection.horizontalSizeClass == .Regular {
    		... 
		}
		
* ###旋转设备更新
 
  在以前，你可能写过这样的代码：
  		
  		willRotateToInterfaceOrientation
  		didRotateFromInterfaceOrientation
  		willAnimateRotationToInterfaceOrientation
  		
  同样，因为时代的更新，这些代码也将逐渐被废弃，事实上，我们看到 UIKit 的头文件中，这些代码已经被废弃了
  		
  		@available(iOS, introduced=2.0, deprecated=8.0, message="Implement viewWillTransitionToSize:withTransitionCoordinator: instead")
    	public func willRotateToInterfaceOrientation(toInterfaceOrientation: UIInterfaceOrientation, duration: NSTimeInterval)
	
  取而代之的是，使用如下的新 API:
  
  		@available(iOS 8.0, *)
    	public func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator)
    	
  
设备发生 Sizes Change 的生命周期：


![Slide Over](/images/blog/GettingStartWithMultitasking/size-change.jpg)


由于某些 Resize 情况下,  SizeClass 不会发生改变，所以 有可能 `traitCollectionDidChnage`, 但是 因为 size 的变化， 所以仍然会触发 `viewWillTransitionToSize`

* ### UIPopoverPresentationController	
	`UIPopoverPresentationController` 在模式为 Popover 时，SizeClass 为 Compact 会显示为 Popover 的形式，为 Regular 时，会自动变成 FullScreen。
	
	如果想改变这个状况，可以实现 UIAdaptivePresentationControllerDelegate 中的：
	
		@available(iOS 8.3, *)
    	optional public func adaptivePresentationStyleForPresentationController(controller:UIPresentationController, traitCollection: UITraitCollection) -> UIModalPresentationStyle
	
* ### Keyboard
	
	由于 Multitasking 的介入，所以 当你在使用其他 App 的时候，你的任何一个界面都可能被唤起键盘，因为在 Split View 下，任何一个 App 都可以唤起键盘，所以，如果你想要更好的体验，可以使用下面的 Notification 处理键盘事件：
		
		UIKeyboardWillShowNotification
		UIKeyboardDidShowNotification
		UIKeyboardWillHideNotification
		UIKeyboardDidHideNotification
		UIKeyboardWillChangeFrameNotification
		UIKeyboardDidChangeFrameNotification
	
	
适配 Multitasking 的几个建议:

*  Be flexible
*  Auto Layout
*  Size Classes in Xcode
*  Adaptivity Callbacks
*  High-level API
*  Split View Controller
 
  

