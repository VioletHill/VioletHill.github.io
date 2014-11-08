---
layout: post
title: 	UIScrollView + UIImageView 下 touch事件无响应
category: blog
description: 解决UIScrollView + UIImageView 下 touch事件无响应
---
<div class="container">
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因为需要，我在做一个这样的效果，利用一个UIScrollView里面添加一些UIImageView,然后希望点击ImageView做到点击效果，或者去重写touch事件做一些事，类似代码如下：
		<pre name="code" class="objc">- (IBAction)selectBut:(id)sender
{
    scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(x, y, w, h)];
    scrollView.userInteractionEnabled = YES;
    int y = 0;
    for (int i = 0; i &lt; [myArray count]; i++) {
        UIImageView *image = [[UIImageView alloc] initWithFrame:CGRectMake(0, y, 75, 30)];
        image.userInteractionEnabled = YES;
        y = y + 35;
        [scrollView addSubview:image];
    }
    [self.view addSubview:scrollView];
    [scrollView setContentSize:CGSizeMake(150, 300)]
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event

{
    UITouch *touch = [touches anyObject];
    if ([touch tapCount] == 1) {
        NSLog(@&quot;One touch !!&quot;);
    }
}
</pre>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里我已经给ImageView的userInteractionEnabled设置为YES了(UIImageView的userInteractionEnabled默认为NO)，但是，无论我怎么做 最后touch事件还是无法响应，原因如下：Subviews of UIScrollview will never call touchesBegan method directly. You need to customized with subview to get touchesBegan properties of that added subview/customized view.
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;解决方法:customize the UIImageView with your own view inherited from UIImageView. Provide touch methods in that customized subclass and add it on your UIScrollView..
<br>
<br />
</p>
<pre name="code" class="objc"> @interface CustomImageView : UIImageView
 {
 }</pre>
<pre name="code" class="objc">@implementation CustomImageView

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
    }
    return self;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    NSLog(@&quot;%s&quot;, __FUNCTION__);
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if ([touch tapCount] == 2) {
        drawImageView.image = nil;
        return;
    }
}</pre>
	<br />
	<br />
	
</p>
<br>
</div>