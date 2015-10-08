---
layout: post
title:  Template Method  
category: blog
description: 设计模式之－template method(模版方法)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The skeleton of an algorithm in an operation, deferring some steps to subclasses.- Template Method lets subclasses redefine certain steps of an algorithm without letting them to change the algorithm's structure.
</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。Template Method使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
</p>
<p>
	<h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;写一个类SortArray，该类中有一个大小为10的NSNumber的数组，同时对外提供一个sort方法，利用简单的插入排序对数字排序
</p>

<br>
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
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;解释一下上面的代码，我们在init函数(其他语言的构造函数)中，初始化了一个大小为10的数组，并且赋值一些随机数给他，然后提供一个对外的接口sort,sort利用插入排序给这个算法进行排序
	<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一个很简单的题目，我们只是拿这个举一个例子，尽管我也知道NSMutableArray有sortedArrayUsingComparator的方法,但是 这时候先忽略它吧！因为要求就是让我们自己写一个排序算法
	<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现在有这么一个问题，我在题目中并没有说怎么排序，按照从大到小或者是从小到大又或者是我自己定义的排序规则(比如：我在"同济足协"这个App中就很无耻的让我在同等条件下的排名 优先级高于其他人)。。可以肯定的是 不管怎么排序 &nbsp;除了 array[i]&gt;array[j]那个条件可能需要改变，其他都不用改变。于是 这里有一个解决办法是 &nbsp;把比较的那一行抽出来 利用函数指针让用户自己写一个比较函数 这是一种有效的解决方法。
	<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但是,Template Method为我们提供了另外一种解决方法,让我们来看看Template Method是怎么做的
	<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们改写这个类，让其成为一个抽象类，同时提供一个抽象函数&nbsp;<pre>- (NSComparisonResult)comparedA:(NSNumber*)a withB:(NSNumber*)b;</pre>
	<br />
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;将原来的sort函数变成这样(分别修改.h和.m文件)
	<br/>
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface SortArray : NSObject

/**
 *  添加一个无需实现的函数,留给子类去实现这个函数，同时 声明这个类是一个抽象类
 *
 *  @param a 传入比较的第一个数字
 *  @param b 传入比较的第二个数字
 *
 *  @return 返回比较结果
 */
- (NSComparisonResult)comparedA:(NSNumber*)a withB:(NSNumber*)b;

- (void)sort;

@end</pre>
<br />

<pre name="code" class="objc">#pragma mark - sort algorithm

- (void)sort
{
    for (int i = 0; i &lt; n; i++)
        for (int j = i + 1; j &lt; n; j++) {
            if ([self comparedA:self.array[i] withB:self.array[j]] == NSOrderedDescending) {    //修改这一行代码
                swap(self.array[i], self.array[j]);
            }
        }
}</pre>
<br />



<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现在，有两个调用者需要调用你的sort函数，也就是他们需要一个排好序的数组，第一个人需要一个从小到大排序的类，第二个人需要一个从大到小排序的类。这时候，你就不必再去写两个类提供给他们，也不需要去修改原来已经封闭好了的SortArray类的代码，你要做的就是告诉他们，新建两个类一个叫做AscendSortArray，一个叫做DescendSortArray，然后让这两个类都继承自SortArray,然后重写函数<pre>- (NSComparisonResult)comparedA:(NSNumber*)a withB:(NSNumber*)b;</pre>
	<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样做的好处就是 让调用着自己定义比较规则，而你已经封闭好了的代码无需要做任何修改，同时，你把所有的排序步骤都已经完成，他们也不需要知道排序的内部结构和算法实现，只需要约定去重写那个compared函数即可，因为从开始到最后，所有的步骤都帮你完成了，就像你在套一个模板一样，只有比较那个步骤，不同人的需求会不一样，其他地方都相同。所以，在其他地方，我都帮你实现好，留下那个不一样的地方留给你自己去实现，这就是Teamplate Method.
</p>
<br>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以AscendSortArray为例，调用者只需要这么做
</p>	
	
<pre>#import &lt;Foundation/Foundation.h&gt;
#import &quot;SortArray.h&quot;

@interface AscendSortArray : SortArray

@end</pre>
<br>
<pre name="code" class="objc">- (NSComparisonResult)comparedA:(NSNumber*)a withB:(NSNumber*)b
{
    return [a compare:b];   //自己定义比较规则，由于是升序排列 和默认的相同 因此 直接返回即可
}
</pre>
<br />
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们回头看一次定义&nbsp;定义一个操作中的算法的骨架，而将一些步骤延迟到子类中，我们在父类的Sort定义了所有的算法，就像你做所有事情都找模板一样，模板把能做的事情都给做了，同样，这里我们的父类把所有算法能做的事情也都给做了，留下一些可能会改变的 而不同人又有不同需求的地方留给子类自己去实现，同时约定调用者去实现一些需要实现的一些API。这样，调用可以在不必关心我们内部算法的实现的情况下，用最简单高效的办法达到自己想到的效果，而你自己已经封闭好的了类“SortArray”也可以做到不必因为各种需求的不同而频繁的修改自己，也保证了OCP的原则&nbsp;
</p>

</div>