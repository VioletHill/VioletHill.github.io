---
layout: post
title: Composite
category: blog
description: 设计模式之－Composite(组合模式)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.
</p>
<p>
	&nbsp;&nbsp;将对象组合成树形结构以表示‘部分-整体’的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。
</p>
<p>
    <h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在提出关于Composite的具体问题的时候，我想先介绍自己当初是怎么认识这个设计模式的
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当时，我们需要做一个操作系统项目，模拟一个文件系统的操作，只要求做文件(相当于记事本吧)和文件夹两种类型的文件。然后，当时我并不知道Composite这个设计模式，但是，在我后来了解到Composite之后，我惊奇的发现。。当初我做的文件系统简直就是Composite。。。
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 说了一堆废话，不是想证明自己有多牛B，其实 我也是一个菜鸟，只是想表达 设计模式不是什么高深的东西，有时候 在我们不了解甚至不知道的情况下，如果你对你的代码负责，你想写出一个beauty的、对自己负责任的代码。那么， 在不经意间，你会不知不觉用到一个设计模式。回归正题，这一次 我们做一个文件系统吧！
    <br />
    <br>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不管对于文件夹还是文件，他们都是这些共同的操作：打开 获取大小 重命名等等，对于文件夹 我们还有添加文件或者添加文件夹的操作。这时候 你发现了文件有许许多多的共同操作，于是 我们可以让他们共同继承自一个叫做Entry的类，该类提供了open，rename，getSize等抽象方法(delete做起来比较麻烦，所以就先不弄delete了，用getSize来取代)，像这样：
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Entry : NSObject

@property (nonatomic, strong) NSString* name;
@property (nonatomic) int size;

- (void)open;
- (void)rename:(NSString*)newName;
- (int)getSize;

@end
</pre>

<pre name="code" class="objc">#import &quot;Entry.h&quot;

@implementation Entry

- (void)rename:(NSString*)newName
{
    self.name = newName;
}

@end</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这个类是一个抽象类，对于File和Directory(文件夹)而言，open和getSize(getSize Directory需要遍历这个文件夹下的所有目录)是不一样的操作。而rename是一样的，所以，我们在这个Entry中，只需要实现rename这个操作就可以。
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，接下来 我们看看file这个类的操作吧！操作一个文件比操作一个文件夹要容易的多(主要是getSize，实际中还有delete什么的) 我们可以这样完成这个类：
</p>

<pre name="code" class="objc">#import &quot;Entry.h&quot;

@interface File : Entry

@end
</pre>

<pre name="code" class="objc">#import &quot;File.h&quot;

@implementation File

- (void)open
{
    NSLog(@&quot;显示这个文件的内容&quot;);
}

- (int)getSize
{
    return self.size;
}

@end</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，这是文件的操作，文件夹的操作可能会复杂一点，首先 他应该比File多一个叫做add的方法(就是他应该有一个容器，能够容纳文件或者是文件夹）。  让我们看看Directory这个类
</p>

<pre name="code" class="objc">#import &quot;Entry.h&quot;

@interface Directory : Entry

- (void)add:(Entry*)entry; //比File多了一个添加entry的类，因为既可以添加文件 也可以添加文件夹 所以选择的是Entry

@end</pre>

<pre name="code" class="objc">#import &quot;Directory.h&quot;

@implementation Directory {
    NSMutableArray* dir;
    //这个容器存放这个目录下得所有文件和文件夹 如果你使用c++或者java 最好指定这个容器里面的元素都是Entry类
}

- (void)add:(Entry*)entry
{
    [dir addObject:entry];
}

- (void)open
{
    NSLog(@&quot;打开文件夹&quot;);
}

- (int)getSize
{
    int size = 0;
    for (Entry* entry in dir) {
        size += [entry getSize];
    }
    return size;
}

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这个就是Directory的类，重点看add和getSize这两个函数，add里面的元素都是Entry，这就保证了一个Directory里面既可以装下Directory又可以装下File；而getSize这个函数，采用了递归的方式，如果entry是一个File，那么会直接返回这个File的size 如果是一个Directory，又会再次利用同样的方式递归下去。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这就是一个典型的Composite了，这个设计的精髓就是 那个Directory，他既可以在容器中装一个File，又可以在容器中装一个Directory，然后这个容器中得Directory又可以继续递归下去，完全就和文件以及文件夹的性质一模一样。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;让我们回过头来看看定义：将对象组合成树形结构以表示‘部分-整体’的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。这句话其实很难懂，你可以想想树枝和叶子，上面的文件夹就是树枝，文件就是叶子，一根树枝上 可以有其他的分叉树枝，又可以有叶子。而当这个节点是叶子的时候，就没有下一层了，如果这个节点还是树枝，那么树枝上又可以继续挂树枝和叶子了。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总得来说，这个设计模式就是把文件和文件夹一视同仁，让文件夹多了一个add函数，然后文件夹那里可以不停的添加文件或者文件夹。其实 这不是一个什么复杂的设计模式，如果你用心去写一个文件系统 你真的会再不知不觉中自己发现这个设计模式。
</p>


</div>