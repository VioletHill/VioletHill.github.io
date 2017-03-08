---
layout: post
title: 	AutoLayout 背后的秘密
category: blog
description: AutoLayout 究竟做了那些事情？
---

我们先看一个 Layout 的周期

![](/images/blog/20151127_1.png)

   项目以 Run Loop 的形式启动，当约束发生改变的时候，Layout Engine 会重新计算 Layout，之后到 Deferred Layout Pass, 最后，所有的布局完成
  
  约束的改变包括了下面几个方面:

  * 约束的 Activating 或 Deactivating
  * 改变 constant 或者 改变 priority
  * 添加或者删除视图
  
  
  当收到约束改变的通知以后，Engine 做的第一件事情就是重新计算 Layout，这里我猜想是计算包括优先级在内以及 instrinsicContentSize 的有效的约束，以及排除一些无效的约束，当 Layout Engine 收到新的值以后，会调用 superView 的 setNeedsLayout 方法，通知 superView 重新布局。这也就是为什么会导致延迟布局的原因。

---
  
  最后一步是 Deferred Layout Pass, 这一步过后，所有 view 的 frame 将被重新布局完毕，
  
  Deferred Layout Pass 包含了 2 个步骤
  
  * 对 constraints 的错误处理 (比如 你让一个 view 居中，但是没有设定它的宽度和高度，Deferred Layout Pass 会处理这些事情)
  * 重新布局 view 的位置
  
  完成 Layout 的布局以后，将 subview 的 frame 从 Layout Engine 中拷贝出来给视图，并且从父类开始，向下调用 layoutSubview() 方法
  
  
  WWDC 中还强调，最好不要去重写 layoutSubviews(), 如果你真的要这么做，那么你需要注意这么几件事情:
  
  * 当你的约束不足的时候，去重写 layoutSubviews, 补充不足的约束(比如 补充一些 没有使用 AutoLayout 的 subview 的 frame)
  * 一些 view 已经 layout 完毕了，还有一些 view 没有布局完成(应该是指和自己是兄弟 view 的视图)，不过它们马上就会被 layout。    
  
    #### Do ####
  
  * 调用 super.layoutSubviews() 

  * 所有的操作应该只在你这个 view 的 subtree 中
   
    #### Don't ####
  
  * 不要调用 setNeedUpdateConstraints()
  * 不要去操作不在这个 view 的 subtree 中的其它视图
  * 不要去盲目的在这里修改 constraint (我猜就是不要修改 constraint 的意思)
  
  整个 layout cycle 需要注意的两个事项：
  
  * 不要期望 frame 会立刻改变
  * 重写 layoutSubviews() 要小心
    
 
  
