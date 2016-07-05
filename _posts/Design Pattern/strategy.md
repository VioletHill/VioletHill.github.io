---
layout: post
title:  Strategy  
category: blog
description: 设计模式之－strategy(策略模式)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Strategy Pattern defines a family of algorithms,encapsulates each one,and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;策略模式定义了一系列的算法，并将每一个算法封装起来，而且使它们还可以相互替换。策略模式让算法独立于使用它的客户而独立变化。
</p>
<p>
	<h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;写一个类SortArray，该类中有一个大小为10的NSNumber的数组，同时对外提供一个sort方法，利用简单的插入排序对数字排序
</p>

<br>

<pre>#import &lt;Foundation/Foundation.h&gt;
@interface SortArray : NSObject

-(void) sort;

@end

</pre>
<br>

<pre name="code" class="objc">#import &quot;SortArray.h&quot;

@interface SortArray ()

@property (nonatomic, strong) NSMutableArray* array;

@end

@implementation SortArray {
    int n;
}

- (instancetype)init
{
    if (self = [super init]) {
        n = 10;
        for (int i = 0; i &lt; n; i++) {
            self.array[i] = @(arc4random() % 100);
        }
    }
    return self;
}

#pragma mark - getter

- (NSMutableArray*)array
{
    if (_array == nil) {
        if (n != 0) {
            _array = [[NSMutableArray alloc] initWithCapacity:n];
        } else {
            _array = [[NSMutableArray alloc] init];
        }
    }
    return _array;
}

#pragma mark - sort algorithm

- (void)sort
{
    for (int i = 0; i &lt; n; i++)
        for (int j = i + 1; j &lt; n; j++) {
            if ([self.array[i] compare:self.array[j]] == NSOrderedDescending) {
                swap(self.array[i], self.array[j]);
            }
        }
}

@end
</pre>
<br />
<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一个很简答的问题，如同我在template method中的代码一样，我们在init函数中初始化了一些随机数，然后提供sort方法，利用简单的插入排序，对这个NSNumber的数组进行排序。非常简单的排序算法，我们几行代码就可以搞定
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同样，在这个demo中，我需要你忘记sortedArrayUsingComparator这个方法。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，新的问题出现了，某个调用者觉得你这个插入排序的算法效率太低，需要换成快排或者其他的排序算法，
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候 我们遇到了一个问题，SortArray已经被封装过了 我们怎么可以去修改一个封装过了的代码？问题产生的原因在于 我们吧sort函数写死了，如果sort算法发生改变，我们不得不去修改原有的代码 这又违反了OCP原则(请注意这里和Template Method不一样的地方，这里 我们是需要修改整个算法，而Template Method只需要修改算法的一部分)
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 我们去思考一个新的解决办法，为了保证OCP原则 我们将sort里面的代码分离出去(因为这个是变化的，也就是整个类会发生改变的地方)，新建一个SortAlgorithm的抽象类，这个抽象类包含一个抽象方法 sortArray:(NSArray*)array,变成这样
</p>
<br>

<pre>#import &lt;Foundation/Foundation.h&gt;

@interface SortArray : NSObject

-(void) sort;

@end
</pre>
<br>

<pre name="code" class="objc">#import &quot;InsertSortAlgorithm.h&quot;;

@implementation InsertSortAlgorithm

- (void)sortArray:(NSArray*)array
{
    for (int i = 0; i &lt; array.count; i++)
        for (int j = i + 1; j &lt; array.count; j++) {
            if ([array[i] compare:array[j]] == NSOrderedDescending) {
                swap(array[i], array[j]);
            }
        }
}

@end</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同时 修改原来的SortArray，添加一个SortAlgorithm变量，修改sort函数，在sort函数中直接使用SortAlgorithm去调用对应的排序算法 变成这样
</p>

<pre>#import &lt;Foundation/Foundation.h&gt;
#import &quot;SortAlgorithm.h&quot;

@interface SortArray : NSObject

-(void) sort;

@property (nonatomic,strong) SortAlgorithm* sa;

@end
</pre>
<br>

<pre name="code" class="objc">#import &quot;SortArray.h&quot;

@interface SortArray ()

@property (nonatomic, strong) NSMutableArray* array;

@end

@implementation SortArray {
    int n;
}

- (instancetype)init
{
    if (self = [super init]) {
        n = 10;
        for (int i = 0; i &lt; n; i++) {
            self.array[i] = @(arc4random() % 100);
        }
    }
    return self;
}

#pragma mark - getter

- (NSMutableArray*)array
{
    if (_array == nil) {
        if (n != 0) {
            _array = [[NSMutableArray alloc] initWithCapacity:n];
        } else {
            _array = [[NSMutableArray alloc] init];
        }
    }
    return _array;
}

#pragma mark - sort algrithm

- (void)sort
{
    [self.sa sortArray:self.array];
}
</pre>
<br />
<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样 外部在调用的时候 只需要设置好对应的SortAlgorithm即可，这就是Strategy.
这时候 当需求发生改变的时候，比如 我们需要快速排序时，只需要重新写一个类QuickSortAlgorithm继承自Sortalgorithm即可，无需再去修改原本的SortArray.又一次做到了对修改封闭的原则
调用者在调用的时候也特别的简单，只需要 设置好对应的算法 像这样即可
</p>

<pre>SortArray* obj=[[SortArray alloc] init];
obj.sa=[[InserSortAlogtithm alloc] init];
[obj sort];
</pre>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这就是Strategy。回到定义，策略模式定义了一系列的算法，并将每一个算法封装起来，而且使它们还可以相互替换。策略模式让算法独立于使用它的客户而独立变化。这里的一系列算法指的就是各种的排序算法，我们把排序算法和需要排序的对象分割开，让所有的算法封装起来，而SortArray在响应变动的时候并不需要发生改变，他被独立了出来。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每次我再学习一个新的设计模式的时候 总会再想这样做得好处，后来 渐渐的也发现 设计模式 其实不会减少你得代码量 甚至可能会加大你得代码量 但是 他的好处在于一个你已经封装好了得类不需要在去做出修改 因为当项目一旦庞大的时候 你得任何一个修改都可能导致未知的错误出现 这反而会增加你得开发成本，所以 设计模式不是说去减少你得代码量 让你的开发变得更方便，而应该是帮助你长期维护一个项目时 显得更容易
</p>

</div>