---
layout: post
title:  Prototype  
category: blog
description: 设计模式之－prototype(原型模型)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prototype pattern refers to creating duplicate object while keeping performance in mind. This type of design pattern comes under creational pattern as this pattern provides one of the best way to create an object.
</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。
</p>
<p>
	<h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;写一个叫做Person的类，该类有2个属性 age和name
</p>
<br>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Person : NSObject

@property (nonatomic,strong) NSString* name;
@property (nonatomic,strong) NSNumber* age;

@end
</pre>

<p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK，大功告成，现在 我让你创建2个Person类的实例，一个叫做a，一个叫做b,这两个实例的age是一样的，都是10，但是一个name是a 一个name是b
</p>

<pre name="code" class="objc">    
    Person* a = [[Person alloc] init];
    a.name = @&quot;a&quot;;
    a.age = @(10);
    Person* b = [[Person alloc] init];
    b.name = @&quot;b&quot;;
    b.age = @(10);
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代码看起来也不是特别复杂。。现在 假设有好多好多属性 比如 sex height 等等呢？ 然后 所有属性除了名字不一样以外，其他都一样呢。。到这里 也许都不用我说，你一定会告诉我 写一个这样的函数不就好了吗？对！接下去 我们要为Person写一个叫做copy的函数，如下
</p>

<pre name="code" class="objc">-(Person*) copy
{
    Person* newPerson = [[Person alloc] init];
    newPerson.name = self.name;
    newPerson.age = self.age;
    return newPerson;
}
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样，当我们需要许多相同的属性的实例的时候，只要调用这个copy函数即可，而这就是Prototype,并没有任何高深的东西，就是简单的写了一个copy的函数
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但是 这又有什么用呢？ 开始 我也很疑惑这一点，其实 上面的例子就已经解释了他的其中一个用途。
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;另外 还有一种用途(原谅我看不懂许多地方写得书面语言。。)，在iOS的程序中，我们习惯使用MVC模式，这时候 如果Controller传入一个条件，然后Model根据这个条件处理自己的数据， 需要返回一个Person类的实例给controller，但是 我不想返回同一个指针啊，因为如果我返回了同一个指针给controller，那么他用指针修改这个Person 岂不是会修改我model中得数据？ 这时候 你会很显然的想到 我重新拷贝一份Person 返回给它不就好了？ 对。。这就是我认为Prototype的另外一个用途
</p>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 现在我们真正的回到iOS开发当中，之前写得那个copy也许不是完美的，因为iOS已经有copying这个协议了。。。因此 当我们在做iOS开发的时候，如果需要使用到Prototype，其实可以这样做:
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实现他NSCopying和NSMutableCopying(浅拷贝和深拷贝以及可变不可变的区别，这里不再做描述了)协议，然后重写copyWithZone和mutableCopyWithZone函数，像这样
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Person : NSObject&lt;NSCopying,NSMutableCopying&gt;

@property (nonatomic,strong) NSString* name;
@property (nonatomic,strong) NSNumber* age;

@end
</pre>
<br />

<pre name="code" class="objc">#import &quot;Person.h&quot;

@implementation Person

-(id) copyWithZone:(NSZone *)zone
{
    Person* person = [[[self class] allocWithZone:zone] init];
    person.name = [self.name copy];
    person.age = [self.age copy];
    return person;
}

-(id) mutableCopyWithZone:(NSZone *)zone
{
    Person* person = [[[self class] allocWithZone:zone] init];
    person.name = [self.name mutableCopy];
    person.age = [self.age mutableCopy];
    return person;
}

@end
</pre>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实现NSCopying和NSMutableCopying然后外部调用的时候 直接 [a copy]即可，这才是符合iOS开发的一个Prototype模型
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;整个Prototype模型全部结束了，特别特别的简单 就是为你的具体的类写一个拷贝的函数，在iOS中只需要去实现NSCopying和NSMutableCopying协议即可。而这样做的好处也就在于你的数据得到了成功的保护，因为Model层返回的一定是一个相当于备份的东西，而Controller层永远也无法修改真正的数据源。
<br />

</p>

</div>