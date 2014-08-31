---
layout: post
title:  Visitor
category: blog
description: 设计模式之－Visitor(访问者模式)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The visitor design pattern is a way of separating an algorithm from an object structure on which it operates. A practical result of this separation is the ability to add new operations to existing object structures without modifying those structures
</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表示一个作用于某对象结构中的各元素操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。
</p>
<p>
	<h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现在 我要写两个类，OperateA和OperateB，这两个类都有两个变量a和b，同时提供一个相同的方法 add，在OperateA中add单纯的返回a+b，在OperateB中，返回的是a*10+b(没什么意思，就是为了区别两个add函数)
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK，如果你面相对象的思想牛B一点，你可以让他们共同继承自一个叫做Operate的抽象类，然后这个抽象类有一个抽象方法add，代码如下：
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Operate : NSObject

@property (nonatomic) int a;
@property (nonatomic) int b;

- (int)add;

@end
</pre>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一个抽象类，add是一个抽象方法 不需要实现。接着， 让OperateA和OperateB继承Operate
</p>
<br />

<pre name="code" class="objc">#import &quot;Operate.h&quot;

@interface OperateA : Operate

@end</pre>

<pre name="code" class="objc">#import &quot;OperateA.h&quot;

@implementation OperateA

- (int)add
{
    return self.a + self.b;
}

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以上是OperateA的代码，接下去 我们看看OperateB的代码
</p>

<pre name="code" class="objc">#import &quot;Operate.h&quot;

@interface OperateB : Operate

@end</pre>
<br />

<pre name="code" class="objc">#import &quot;OperateB.h&quot;

@implementation OperateB

- (int)add
{
    return self.a * 10 + self.b;
}

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，以上代码在我看来已经是不错的了，但是 你发现了没有 如果我这时候需要为OperateA和OperateB添加一个sub函数。。。你要怎么办？去修改3个类。。这是非常糟糕的一件事情。因为OPC原则告诉我们 一个已经完成了的类是不能再去做修改的，这样才是符合面性对象的程序设计要求
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候，你可能会想到策略模式，没错 策略模式确实是一个不错的解决方法，但其实，对于我而言，策略模式每次都要让调用者自己选择算法，而我的OperateA和OperateB对应的add算法都是固定的。也就是说OperateA对应的add算法永远都是a＋b，所以 调用者不需要去选择算法。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但是，策略模式确实给了我们一种思路，我们需要把add这个方法抽调出来，变成一个Add类，该类提供两个方法 calWithMethodA以及calWithMehodB，然后让Add继承一个叫做Calculate的抽象函数(因为以后可能还会有Sub的加入)，变成这样：
</p>

<pre name="code" class="objc">#import &quot;Operate.h&quot;
@class Operate; //类的提前声明

@interface Calculate : NSObject

- (int)calWithMethodA:(Operate*)op;

- (int)calWithMethodB:(Operate*)op;

@end
</pre>
<br />

<p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意 Calculate是一个抽象函数，两个calWithMethod方法都是抽象方法，让Add类继承自Calculate，并且去实现这2个方法
</p>

<pre name="code" class="objc">#import &quot;Calculate.h&quot;

@interface Add : Calculate

@end</pre>
<br />

<pre name="code" class="objc">#import &quot;Add.h&quot;

@implementation Add

- (int)calWithMethodA:(Operate*)op
{
    return op.a + op.b;
}

- (int)calWithMethodB:(Operate*)op
{
    return op.a * 10 + op.b;
}

@end</pre>
<br />

<p>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候，我们已经按照策略模式把所谓的算法分离出来了，那原来的Operate类又该怎么修改呢？我们把原来的add方法删除，改成一个叫做calWithCalculate的方法，然后让cal方法去调用对应的算法，变成这样
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;
#import &quot;Calculate.h&quot;

@class Calculate; //可能需要使用类的提前声明，没有测试过这里

@interface Operate : NSObject

@property (nonatomic) int a;
@property (nonatomic) int b;

- (void)calWithCalculate:(Calculate*)cal;

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后 OperateA同样继承自Operate类，变成这样:
  
</p>

<pre name="code" class="objc">#import &quot;Operate.h&quot;

@interface OperateA : Operate

@end
</pre>
<br />

<pre name="code" class="objc">#import &quot;OperateA.h&quot;

@implementation OperateA

- (void)calWithCalculate:(Calculate*)cal
{
    [cal calWithMethodA:self];
}

@end</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OperateB其实一样，只是调用变成了calWithMethodB
</p>

<pre name="code" class="objc">#import &quot;OperateB.h&quot;

@implementation OperateB

- (void)calWithCalculate:(Calculate*)cal
{
    [cal calWithMethodB:self];
}

@end</pre>
<br />

<p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意 这里的诀窍就在于无论是Operate还是Calculate提供的抽象方法,对外的参数接口都是父类的指针，这样具体方法的实现中会根据对应的指针去寻找对应的子类实例。至此，我们的重构已经结束了，如果需要一个Sub方法，只需要在写一个Sub类，继承自Calculate，然后实现：

<pre>- (int)calWithMethodA:(Operate*)op;</pre>
<pre>-(int)calWithMethodB:(Operate*)op;</pre>


这两个方法即可，这样就完成了对算法的扩张，同时满足了OCP原则。
当然，真正的Visitor设计模式还提供了一个Context(相当于调用环境),让我们新建一个Context类，去调用这个OperateA和B吧
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;
#import &quot;Operate.h&quot;
#import &quot;Calculate.h&quot;

@interface Context : NSObject

- (void)addOperate:(Operate*)op;
- (void)removeOperate:(Operate*)op;
- (void)calWithCalculate:(Calculate*)cal;

@end
</pre>
<br />

<pre name="code" class="objc">#import &quot;Context.h&quot;

@implementation Context {
    NSMutableArray* array;
}

- (void)addOperate:(Operate*)op
{
    [array addObject:op];
}

- (void)removeOperate:(Operate*)op
{
    [array removeObject:op];
}

- (void)calWithCalculate:(Calculate*)cal
{
    for (Operate* op in array) {
        [op calWithCalculate:cal];
    }
}

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这就是整个Visitor模式了，客户端调用的时候 只需要这样
</p>

<pre name="code" class="objc">Context* context = [[Context alloc] init];
OperateA* opA = [[OperateA alloc] init];
OperateB* opB = [[OperateB alloc] init];

[context addOperate:opA];
[context addOperate:opB];
Add* add = [[Add alloc] init];
[context calWithCalculate:add];</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后 如果你需要添加一个对于OperateA与OperateB的sub方法，也只需要新建一个Sub类，去继承Calculate方法即可，不在需要修改原来已经封装好了的OperateA与OperateB了。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们回过头看看定义,表示一个作用于某对象结构中的各元素操作(OperateA与OperateB)。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作（添加Sub方法）。
    <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一切看起来似乎都很完美，但是发现了没有，如果现在出现一个OperateC怎么办？我需要一个calWithMethodC，这样 我需要修改好多类才能完成达到这个目的。是的没错，这就是Visitor的缺点，一定要记住，在你使用Visitor之前，OperateA和OperateB一定是固定不变的，这可能也是Visitor受到限制的原因之一。所以 GOF四人中有一个就说 大多数的情况你不需要使用Visitor模式，但是当你真正需要它的时候，代表你真正需要它了。。。
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 Visitor可能是所有设计模式中最难的一个了，理解这个设计模式需要有一定的耐心，当然,我发现如果你把它的思想和策略模式结合起来似乎变得很简单了，因为他们都是把具体的算法抽象了出来，不同的地方可能在于 Visitor是针对多个对象的一种抽象，而策略模式是针对一个对象的算法抽象.总之 你会发现，设计模式都是把具体的，可能以后会变得方法抽象出一个具体的抽象类，这样以后扩展的时候，新建一个类去实现这些抽象函数，这样做到了OCP原则。所以 其实设计模式并不是那么可怕，具体知道了为什么他要这么做 就显得不是那么困难了。
</P>

</div>