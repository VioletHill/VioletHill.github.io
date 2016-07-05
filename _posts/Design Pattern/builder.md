---
layout: post
title:  Builer
category: blog
description: 设计模式之－builder(建造者模式)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The intent of the Builder design pattern is to separate the construction of a complex object from its representation. By doing so, the same construction process can create different representations
</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;将一个复杂对象的构建与它的表示分离,使得同样的构建过程可以创建不同的表示.
</p>
<p>
	<h4>问题:</h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;相信每个人都写过简历吧，如果没有写过 也可以思考思考该怎么写了哦!  现在我已经有一个很棒的生成简历模板的程序了，一个叫做Resume的抽象类，他为你提供了好多方法createName，createAge, createWork。。。暂时先写3个把 现在 我把这个类给你

</p>
<br>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Resume : NSObject

- (void)createName;

- (void)createAge;

- (void)createWork;

@end
</pre>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后告诉你，当你需要去制作你自己的简历时，你只需要写一个类MyResume 继承自Resume,然后去重写这3个方法即可，然后依次调用createName，createAge，createWork就能制作出和模板一样的简历了。
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到这里，一切似乎都很简单，因为你按照我得要求 按照顺序的调用了这3个方法，然后生成了你自己的简历。
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但是 你得简历不会只有这3个东西啊~~ 我刚刚和你说了 暂时写3个把。。。如果这时候有很多很多属性，然后你漏调用了一个函数。。或者调用顺序出了问题。。。你也许就得不到和我的模板一样棒的简历了哦~~
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候 你会怪罪我 你写的这个类太烂了。。因为你强制要求我按照一个顺序去调用你得方法。而且那么多得函数 我怎么可能记得住呢。。。。没错 这都是我的问题，因为我强制要求你按照顺序去调用函数了，这就是一种不合理的设计方法。
</p>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候，我开始思考我的问题，于是，我又加了一个方法叫做create，create方法会帮你按照顺序去创建简历，你只需要在MyResume中重写那3个函数即可，变成这样
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Resume : NSObject

- (void)createName;

- (void)createAge;

- (void)createWork;

- (void)create;

@end
</pre>
<br />

<pre code_snippet_id="315288" snippet_file_name="blog_20140427_3_6744324" name="code" class="objc">#import &quot;Resume.h&quot;

@implementation Resume

- (void)create
{
    [self createName];
    [self createAge];
    [self createWork];
}

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;而你生成我简历的地方，也就不再需要强制你按照某个顺序去调用这些方法了，你只需要简单的重载即可。
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;
#import &quot;Resume.h&quot;

@interface MyResume : Resume

@end
</pre>
<br />

<pre name="code" class="objc">#import &quot;MyResume.h&quot;

@implementation MyResume

- (void)createName
{
    NSLog(@&quot;create name&quot;);
}

- (void)createAge
{
    NSLog(@&quot;create age&quot;);
}

- (void)createWork
{
    NSLog(@&quot;create work&quot;);
}
@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后，生成简历用这样的代码
<pre name="code" class="objc">    MyResume* myResume = [[MyResume alloc] init];
    [myResume create];
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到了这里，问题似乎完美解决了，其实 我也是这样认为的，但是Builder并不是这样做的，为什么我也不明白。上面那个解决方法有什么缺陷吗？我绞尽脑汁，想了一个不知道能不能说服自己的理由，就是 如果MyResume重写了create函数 怎么办？
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;于是，Builder做了一步工作 就是把create这个方法移到其他类当中。如下 Resume类去掉了create方法，变成一个抽象类
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface Resume : NSObject

- (void)createName;

- (void)createAge;

- (void)createWork;

@end
</pre>
<br>

<p>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加一个CreateResume的类，由他来createResume
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;
#import &quot;Resume.h&quot;

@interface CreateResume : NSObject

- (void)createTemplateResume:(Resume*)resume;

@end</pre>
<br />

<pre name="code" class="objc">#import &quot;CreateResume.h&quot;

@implementation CreateResume

- (void)createTemplateResume:(Resume *)resume
{
    [resume createName];
    [resume createAge];
    [resume createWork];
}

@end
</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样 外部调用的时候只要
</p>

<pre name="code" class="objc">    MyResume* myResume = [[MyResume alloc] init];
    CreateResume* createResume = [[CreateResume alloc] init];
    [createResume createTemplateResume:myResume];
</pre>

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到这里介绍完了整个Builer模式，回头看看定义:将一个复杂对象的构建与它的表示分离,使得同样的构建过程可以创建不同的表示.一个复杂的Resume对象，把它的构建分开，由一个叫做CreateResume的类控制这个实力的产生，这样做得好处是 用户可以不用关心我得Resume是怎么创建的，按照什么顺序创建的，他只要把每一个模块写好 createName createAge createWork都完成，然后 由CreateResume这个类去帮他产生这个对象
    <br />
</P>

</div>