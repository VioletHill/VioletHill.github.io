---
layout: post
title:  State
category: blog
description: 设计模式之－State(状态模式)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Allow an object to alter its behavior when its internal state changes. The object will appear to change its class. 

</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当一个对象的内在状态改变时允许改变其行为,这个对象看起来像是改变了其类。
</p>
<p>
	<h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现在 给你一个叫做step的变量，当step等于1的时候，输出a；等于2的时候，输出b，等于3的时候，输出c。不要找step和输出之间的规律。。。因为这个asc码值的规律我也知道。。。实际中不会这么巧的- -，我只是给个简单的例子。然后 step从1转换到2，最后转换到3（step只是一种状态的模拟，所以也忽略这个1，2，3的规律）
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，我相信 大部分的人代码会这样写。。。包括我基本也会这样
</p>
<pre name="code" class="objc">- (void)printWithStep:(int)step
{
    if (step == 1)
        NSLog(@&quot;a&quot;);
    else if (step == 2)
        NSLog(@&quot;b&quot;);
    else if (step == 3)
        NSLog(@&quot;c&quot;);
}
</pre>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用的地方这样调用,先别考虑用循环了，因为上下的do something可能是不一样的 
</p>

<pre name="code" class="objc">int step = 1;
[self printWithStep:step];
step++;
//do something...
[self printWithStep:step];
step++;
//do something...
[self printWithStep:step];
</pre>
<br />

<p>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代码其实并不复杂。。。我们仅仅以输出作为一个简单的demo，好了现在step又来2个属性，等于4的时候输出d，然后你又可以在代码中添加一个else if 语句了。。当然 你牛B一点可以和我说写个switch语句会更棒。是的，switch同样很棒，但是，当状态多了。。switch感觉也晕了。。。
     <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候,我们需要一种更棒的设计方法，叫做State模式，简单的说State模式就是为了取代switch而产生的。
     <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们发现这里打印abcd其实都是一种行为，我们现在要做得就是把具体的“行为“抽象出来，然后发现他们的共同点，他们都有一个print操作，以及一个step++的操作（切换状态），于是,我们定义一个共同的抽象父类叫做State，提供两个抽象方法,一个叫做:print，一个叫做:getNextState，代码如下：
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface State : NSObject

- (void)print;

- (State*)getNextState;

@end</pre>
<br />

<p>
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，记住上面那个是抽象类，所以不需要去实现这两个方法，现在 我们新建一个类叫做StateA 他就是用来完成打印A的操作。
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;
#import &quot;State.h&quot;

@interface StateA : State

- (void)print;

- (State*)getNextState;

@end</pre>
<br />

<pre name="code" class="objc">#import &quot;StateA.h&quot;
#import &quot;StateB.h&quot;

@implementation StateA

- (void)print
{
    NSLog(@&quot;a&quot;);
}

- (State*)getNextState
{
    return [[StateB alloc] init];
}

@end</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们看看上面的代码(StateB的代码也是一样的)，StateA继承了State，并且重写了print和getNextState的方法,在print中 我们做了一样的操作:打印a，但是getNextState的时候，我们直接返回一个StateB。 到这里，其实State模式就基本结束了，但是，设计模式的书上会说 我们还需要一个调用State的类Context，好吧 我们就按照书上说的 在新建一个类 叫做Context，这个类的作用就是调用State
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Context : NSObject

- (void)changeState;

@end
</pre>
<br />

<pre name="code" class="objc">#import &quot;Context.h&quot;
#import &quot;State.h&quot;
#import &quot;StateA.h&quot;

@implementation Context {
    State* state;
}

- (instancetype)init
{
    if (self = [super init]) {
        state = [[StateA alloc] init];
    }
    return self;
}

- (void)changeState
{
    [state print];
    state = [state getNextState];
}

@end</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们看看上面的代码解释一下上面的代码，在init中，赋值state为初始值，每次changeState的时候就取调用print 然后重新赋值一个getNextState。
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们看看上面的代码好了 到这里 我们就完成了整个State设计模式的内容，这样调用者调用的时候就只要
</p>

<pre name="code" class="objc">Context* context = [[Context alloc] init];
[context changeState];
[context changeState];
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这就是整个State设计模式，也许，我觉得你会和我一样疑惑，这到底有什么用呢？一个switch语句就能解决的问题，被分割成了这么多类。。确实是这样的，但是 state模式也由他得优点，不知道你发现没有，StateB的变化只受到来自StateA的影响，而且 调用Context的那个人（也就是调用你代码的那个）他根本不需要关心到你的state是怎么变化的，他只需要知道我要变化到下一个state就调用changeState即可(当然 你可以在原来的基础上增加 changeToLastState(转到上一个状态))，另外 如果我需要新增加一个状态 打印e，也不需要去动原来已经完成了得代码，这就是他的优势所在，请你记住，设计模式不是帮助你减少代码量。。而是让你的代码更加灵活，更容易维护。State在我看来就是为了取代switch而产生的，但是和switch的区别在于，如果你的switch每次过后都会改变状态，那么建议你改用State模式，也许代码量增大了，但是，它的维护性真的是显而易见的
</p>

</div>