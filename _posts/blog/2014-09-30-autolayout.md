---
layout: post
title: 	Auto Layout
category: blog
description: iPhone6出来了～再也不能 if (iPhone5) 了 T_T,老老实实去用autolaytout把
---
<div class="container">
	<p>
		<h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto Layout Is a Constraint-Based, Descriptive Layout System.</h4>
		<h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto Layout是一种基于约束的，描述性的布局系统。</h4>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto Layout是什么这个问题已经无需过多描述，如果你想知道如何在UserInterface上面操作Auto Layout的话,推荐你去iTunes U上看斯坦福老头的视频（2011版本 第九集），讲的特别好，如果你还不习惯英文，可以在<a href＝"http://v.163.com/movie/2014/1/B/P/M9H7S9F1H_M9H80K2BP.html">网易公开课</a>上看。画面可能没有iTunes上面高。
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，回到正题，这里 主要介绍下用代码实现的Auto Layout。<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在ios6版本以后，新加入了一个类：NSLayoutConstraint，对应的方法为：
	</p>

<pre name="code" class="objc">/* Create constraints explicitly.  Constraints are of the form &quot;view1.attr1 = view2.attr2 * multiplier + constant&quot;
 If your equation does not have a second view and attribute, use nil and NSLayoutAttributeNotAnAttribute.
 */
+(instancetype)constraintWithItem:(id)view1 attribute:(NSLayoutAttribute)attr1 relatedBy:(NSLayoutRelation)relation toItem:(id)view2 attribute:(NSLayoutAttribute)attr2 multiplier:(CGFloat)multiplier constant:(CGFloat)c;</pre>
<br />

	<p>
		例如：当我们使用如下的代码的时候
	</p>
<pre name="code" class="objc">NSLayoutConstraint* layout = [NSLayoutConstraint constraintWithItem:button
                                                          attribute:NSLayoutAttributeBottom
                                                          relatedBy:NSLayoutRelationEqual
                                                             toItem:superView
                                                          attribute:NSLayoutAttributeBottom
                                                         multiplier:1.0
                                                           constant:-10];</pre>
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对应的约束是“button的底部（y） ＝ superview的底部 －10”。这个方法比较简单，理解公式即可。
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在创建完约束后，你需要把他添加到view上才能生效，这里 对应的代码是
		<pre name="code" class="objc">[superView addConstraint:layout];</pre>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加的规则很简单，分为下面3条：
		<ul>
			<li>对于两个同层级view之间的约束关系，添加到他们的父view上</li>
			<li>对于两个不同层级view之间的约束关系，添加到他们最近的共同父view上</li>
			<li>对于有层次关系的两个view之间的约束关系，添加到层次较高的父view上</li>
		</ul>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;关于这个 画一个类似二叉树的图就特别简单了
		<br>
		<br>
		<p style="text-align:center">
			<img src="/images/blog/20140930_1.png"/>
		</p>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于图中任意2个元素，找他们最近的公共父亲节点即可，对应view的关系就是 找到最近的superview即可。
		<br>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在加入完constraint以后，你需要做的就是使用 setNeedsLayout方法来使得autolayout生效，如果你以前用过view的setNeedsDisplay，就会发现这两个方法的名称几乎是一样的.
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当然，你需要对每个元素使用上下左右的约束（大多数情况下），这也许会让你的代码变得冗长冗长。。。于是，苹果又发明你一种类似象形文字一样的东西。。。叫做Visual Format Language。 也许这种鬼语言咋看上去很玄乎。。。但是，其实 这真的是一种简单又直白的语言。
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们先抛开Visual Format Language，让你描述画一张图，这张图上有两个button，分别叫a和b，这两个button之间距离间隔是10，你想想看，你会怎么画，如果你画成这样，那么恭喜你，你已经学会了Visual Format Language：<br>
		<br>
		 	<p style="text-align:center">
		   		<img src="/images/blog/20140930_2.png">
		    </p>
		 <br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;而真正的Visual Format Language也是这样的，对应上面的例子，字符串如下： [a]-10-[b]，其中[]里面夹杂的是元素，－10－之间夹杂的是距离，[a]-10-[b]就表示a和b之间的距离是10。<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有时候 我们可能需要借助于superView,比如 让a充满整个superView,这时候，对应的Visual Format Language就是这样 |-0-[a]-0-|,其中｜ 表示superview的边界.
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，接下来我写一个完整的代码，来约束这样一个描述，a是superview，他有一个叫做b的subview，b相对于a来说，距离a上面10，高度是20，距离左边30，宽度是40，约束如下：
		<br>
		<pre name="code" class="objc">    __weak UIView* a; //假设a已经存在了
    UIView* b = [[UIView alloc] init];
    b.translatesAutoresizingMaskIntoConstraints=NO; //一定记住把这个关了
    NSDictionary* dictionaryView = NSDictionaryOfVariableBindings(b);
    NSArray* hLayout = [NSLayoutConstraint constraintsWithVisualFormat:@&quot;H:|-30-[b]-40-|&quot; options:NSLayoutFormatAlignAllBaseline metrics:nil views:dictionaryView];
    NSArray* vLayout=[NSLayoutConstraint constraintsWithVisualFormat:@&quot;V:|-10-[b]-20-|&quot; options:NSLayoutFormatAlignAllBaseline metrics:nil views:dictionaryView];
    [a addConstraints:hLayout];
    [a addConstraints:vLayout];</pre>

	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;解释一下上面的代码，我们假定a（superview）已经存在的情况下，创建了一个b（subview）。之后，对b做一个绑定，相当于这样一行代码：
		<pre name="code" class="objc"> NSDictionary* dictionaryView=[NSDictionary dictionaryWithObject:b forKey:@&quot;b&quot;];</pre>	
		之后，我们建立两个约束 分别是水平方向和垂直方向上的约束，其中‘｜’表示superview的边界，［］表示元素，－x－表示相距了x的点（retina上像素和点有一定差距），NSLayoutFormatAlignAllBaseline是默认的排版方式，即从左向右，从上往下的排版。dictionaryView是绑定了view的名字和对象的字典.最后，我们按照添加约束的规则，找到a和b的“父节点a”，最后让a把这一系列的约束加上去，这样就完成了一个对b相对于a的一个约束。
		<br>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;另外，我们对一个view a可能会需要如下的几种约束：
		<ul>
			<li>V:[a(10)]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高度是10的view a</li>
			<li>V:[a(>=10)]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高度大于等于10的view a</li>
			<li>V:|-[a(10)]-|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高度是10的view a在superview上垂直居中</li>
			<li>V:|-[b]-0-[a(==b)]-|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;先来一个view b 然后下面接一个和b一样高的view a</li>
		</ul>
		如果你的view还没有生效，试试调用setNeedsLayout看看吧！
	</p>

	</p>
</div>