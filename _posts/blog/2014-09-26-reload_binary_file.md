---
layout: post
title:  xcode6 App被拒绝后再次上传binary文件问题
category: blog
description: 解决xcode6上传App被拒绝后，重新上传文件的问题
---
<div class="container">
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这两天被xcode折磨到死，新版本更新以后，好多应用程序都忙着为iPhone6适配，随之，iTunes connect也迎来了更新，于是。。就再昨天。。悲剧发生了
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在第一提交到binary文件后，我迅速意思到了一个bug。。。然后立马从itunes拒绝了刚刚上传的文件，接下来。。就更悲剧了，我再上传第二次binary的时候。。就发生了问题. error 如下：
	<p>
	<div style="text-align:center">
		<img src="/images/blog/20140926_1.jpg" />
	</div>
	<br>
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最后，七捣八捣鼓的，终于被我弄好了，解决的方法如下：<br>
		打开 Porject－> General -> Identity , 在version 和 build两个选项中，修改version的版本号，用build做为你真正的版本，也就是利用build做为你在代码中的版本号，我是这样做的：
	<p>
	<div style="text-align:center">
		<img src="/images/blog/20140926_2.jpg" />
	</div>
	<br>
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version上面数字的意思是 upload的时间 2014年9月26日，12点10分upload<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这样，你在代码中使用版本号 就这样
		<pre>	
			NSDictionary* infoDictionary = [[NSBundle mainBundle] infoDictionary];
			NSString* app_Version = [infoDictionary objectForKey:@"CFBundleVersion"];
		</pre>
		也就是用过build做为你的版本号<br>
		最后，在itunes connect上 你就可以看到新的build了，之后选择对应的build就可以喽！<br>
	</p>
</div>