---
layout: post
title:  Singleton
category: blog
description: 设计模式之－Singleton(单例模式)
---
<div class="container">
<p>
	<h4>定义:</h4>
	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The singleton pattern is a design pattern that restricts the instantiation of a class to one object.
</p>
<p>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保证一个类仅有一个实例，并提供一个访问它的全局访问点。
</p>
<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单例模式应该是所有设计模式中最简单的一个了，相信不少人也都用过。我第一次接触到单例模式是在cocos2d中,cocos2d中大量运用了单例模式，那么 什么是单例模式呢？
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在一般的项目中，用户的简单的设置一般会被我保存在一个叫做UserData(NSUserdefaults)的类当中，很显然，在整个程序中，我只需要一个UserData，然后 无论哪一个类都能够获得这个类的实例，于是 我们创建一个静态方法叫做sharedUserData，这样无论哪个类想要调用UserData，只要调用sharedUserData即可或者这个类的实例
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代码如下：
</p>

<pre name="code" class="objc">#import &lt;Foundation/Foundation.h&gt;

@interface UserData : NSObject

+ (UserData*)sharedUserData;

+ (void)purge;

@end
</pre>

<pre name="code" class="objc">#import &quot;UserData.h&quot;

@implementation UserData

static UserData* _sharedUserData;
+ (UserData*)sharedUserData
{
    if (_sharedUserData == nil) {
        _sharedUserData = [[UserData alloc] init];
    }
    return _sharedUserData;
}

+ (void)purge
{
    _sharedUserData = nil;
}

@end
</pre>
<br />

<p>    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;purge是销毁这个单例(运行环境xcode5 采用了ARC)。当然，一般情况不写purge也没事.这样 无论任何类要取得这个单例只要:
</p>
<p><span style="color:rgb(79,129,135)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UserData</span>* userData=[<span style="color:rgb(79,129,135)">UserData</span><span style="color:rgb(49,89,93)">sharedUserData</span>];
</p>
<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后再通过userData这个实例去获取对应的用户数据(注意 我这里说了是简单的用户设定的数据，不是数据库)即可。好了 这就是单例了，他保证了整个项目中UserData这个类只被alloc了一次。然后UserData所有的数据设置都再UserData里面进行，整个项目都在共享这个UserData的数据，这就是单例的好处。如果你考虑到线程安全(也就是多线程情况)，你可以这样写:
</p>

<pre name="code" class="objc">static UserData* _sharedUserData;
+ (UserData*)sharedUserData
{
    static dispatch_once_t userDataToken;
    dispatch_once(&amp;userDataToken, ^() {
        _sharedUserData=[[UserData alloc] init];
    });
    return _sharedUserData;
}</pre>
<br />

<p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这就是一个iOS的线程安全单例。单例模式很简单，但是项目中也常常用到，所以 如果你不懂线程安全或者不安全 就用下面这个吧 因为它永远是对的。
</p>

</div>