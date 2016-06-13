---
layout: post
section-type: post
title: 	AutoLayout
category: blog
description: iPhone 6 出来了～再也不能 if (iPhone5) 了 T_T,老老实实去用 AutoLayout 把
---

#### Auto Layout Is a Constraint-Based, Descriptive Layout System.
#### Auto Layout 是一种基于约束的，描述性的布局系统。

Auto Layout 是什么这个问题已经无需过多描述，如果你想知道如何在 UserInterface 上面操作 AutoLayout 的话,推荐你去 iTunes U 上看斯坦福老头的视频（2011版本 第九集），讲的特别好，如果你还不习惯英文，可以在[ 网易公开课 ](http://v.163.com/movie/2014/1/B/P/M9H7S9F1H_M9H80K2BP.html)上看。画质可能没有 iTunes 上面高。

好了，回到正题，这里 主要介绍下用代码实现的 AutoLayout。
在 iOS 6 版本以后，新加入了一个类：NSLayoutConstraint，对应的方法为：
	

	 Create constraints explicitly.  Constraints are of the form &quot;view1.attr1 = view2.attr2 * multiplier + constant
	 /*
	 If your equation does not have a second view and attribute, use nil and NSLayoutAttributeNotAnAttribute.
	 */
	 +(instancetype)constraintWithItem:(id)view1 attribute:(NSLayoutAttribute)attr1 relatedBy:(NSLayoutRelation)relation toItem:(id)view2 attribute:(NSLayoutAttribute)attr2 multiplier:(CGFloat)multiplier constant:(CGFloat)c;

	
例如：当我们使用如下的代码的时候
	
	NSLayoutConstraint* layout = [NSLayoutConstraint constraintWithItem:button
	                                                          attribute:NSLayoutAttributeBottom
	                                                          relatedBy:NSLayoutRelationEqual
	                                                             toItem:superView
	                                                          attribute:NSLayoutAttributeBottom
	                                                         multiplier:1.0
	                                                           constant:-10];
	
对应的约束是“button的底部（y） ＝ superview的底部 －10”。这个方法比较简单，理解公式即可。

在创建完约束后，你需要把他添加到view上才能生效，这里 对应的代码是

	[superView addConstraint:layout];
		
添加的规则很简单，分为下面3条：

* 对于两个同层级 view 之间的约束关系，添加到他们的父 view 上
* 对于两个不同层级 view 之间的约束关系，添加到他们最近的共同父 view 上
* 对于有层次关系的两个 view 之间的约束关系，添加到层次较高的父 view 上

关于这个 画一个类似二叉树的图就特别简单了

![Visual Format Language](/images/blog/20140930_1.png)

对于图中任意2个元素，找他们最近的公共父亲节点即可，对应 view 的关系就是 找到最近的 superview 即可。


在加入完 constraint 以后，你需要做的就是使用 setNeedsLayout 方法来使得 AutoLayout 生效，如果你以前用过 view 的 setNeedsDisplay，就会发现这两个方法的名称几乎是一样的.

当然，你需要对每个元素使用上下左右的约束（大多数情况下），这也许会让你的代码变得冗长冗长。。。于是，苹果又发明你一种类似象形文字一样的东西。。。叫做 Visual Format Language。 也许这种鬼语言咋看上去很玄乎。。。但是，其实 这真的是一种简单又直白的语言。

我们先抛开 Visual Format Language，让你描述画一张图，这张图上有两个 button，分别叫 a 和 b，这两个 button 之间距离间隔是 10，你想想看，你会怎么画，如果你画成这样，那么恭喜你，你已经学会了Visual Format Language：

![Visual Format Language](/images/blog/20140930_2.png)
 
 
而真正的 Visual Format Language也是这样的，对应上面的例子，字符串如下： [a]-10-[b]，其中[]里面夹杂的是元素，-10- 之间夹杂的是距离，[a]-10-[b] 就表示 a 和 b 之间的距离是 10。

有时候 我们可能需要借助于 superView,比如 让 a 充满整个 superView,这时候，对应的 Visual Format Language就是这样 |-0-[a]-0-|,其中｜ 表示 superview 的边界.

好了，接下来我写一个完整的代码，来约束这样一个描述，a 是 superview，他有一个叫做 b 的 subview，b 相对于 a 来说，距离 a 上面 10，高度是 20，距离左边 30，宽度是 40，约束如下：

	   __weak UIView* a; //假设 a 已经存在了
	  UIView* b = [[UIView alloc] init];
	  b.translatesAutoresizingMaskIntoConstraints=NO; //一定记住把这个关了
	  NSDictionary* dictionaryView = NSDictionaryOfVariableBindings(b);
	  NSArray* hLayout = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-30-[b]-40-|"; options:NSLayoutFormatAlignAllBaseline metrics:nil views:dictionaryView];
	  NSArray* vLayout=[NSLayoutConstraint constraintsWithVisualFormat:@"V:|-10-[b]-20-|"; options:NSLayoutFormatAlignAllBaseline metrics:nil views:dictionaryView];
	  [a addConstraints:hLayout];
	  [a addConstraints:vLayout];
	  
	  //iOS 8 可以直接使用  [NSLayoutConstraint activateConstraints:hLayout]; 代替  addConstraints:hLayout


解释一下上面的代码，我们假定 a(superview) 已经存在的情况下，创建了一个 b(subview)。之后，对 b 做一个绑定(`NSDictionaryOfVariableBindings(b)`)，相当于这样一行代码：

	 NSDictionary* dictionaryView=[NSDictionary dictionaryWithObject:b forKey:@"b"];	

之后，我们建立两个约束 分别是水平方向和垂直方向上的约束，其中 '|' 表示superview的边界，[] 表示元素，-x- 表示相距了 x 的点（retina上像素和点有一定差距），NSLayoutFormatAlignAllBaseline 是默认的排版方式，即从左向右，从上往下的排版(在 iOS 9 以后，部分国家地区是从右往左)。 dictionaryView 是绑定了 view 的名字和对象的字典.最后，我们按照添加约束的规则，找到 a 和 b 的“父节点 a”，最后让 a 把这一系列的约束加上去，这样就完成了一个对 b 相对于 a 的一个约束。


另外，我们对一个 view a 可能会需要如下的几种约束：

* V:[a(10)]高度是 10 的view a
* V:[a(>=10)]高度大于等于 10 的 view a
* V:|-[a(10)]-|高度是 10 的 view a在 superview 上垂直居中
* V:|-[b]-0-[a(==b)]-|先来一个 view b 然后下面接一个和 b 一样高的 view a



