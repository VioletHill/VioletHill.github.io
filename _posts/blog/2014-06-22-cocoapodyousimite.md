---
layout: post
title:  CocoaPods on Xcode 6 and Yosemite 
category: blog
description: 解决cocoapods 在 mac 10.10下报错
---
<div class="container">

<p>
	老子今天又给环境跪了。。。。。
</p>
<p>
	cocoapods 在升级完新系统以后无法工作
</p>
<p>
	解决cocoapods 在 mac 10.10下报错
</p>
<p>
	错误如下。
</p>
<p>
</p>
<p style="border:0px; font-family:Oxygen,'Helvetica Neue',Arial,sans-serif; font-size:18px; margin-top:0px; margin-bottom:1.5em; outline:0px; padding-top:0px; padding-bottom:0px; vertical-align:baseline; color:rgb(68,68,68); ">
	<span style="border:0px; font-family:Monaco,Consolas,'Andale Mono','DejaVu Sans Mono',monospace; font-size:15px; margin:0px; outline:0px; padding:0px; vertical-align:baseline; line-height:normal; color:red">/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require': cannot load such file -- xcodeproj/prebuilt/universal.x86_64-darwin14-2.0.0/xcodeproj_ext (LoadError)<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /Library/Ruby/Gems/2.0.0/gems/xcodeproj-0.16.1/lib/xcodeproj/ext.rb:6:in `rescue in&nbsp;'<br style="" />
	from /Library/Ruby/Gems/2.0.0/gems/xcodeproj-0.16.1/lib/xcodeproj/ext.rb:3:in `'<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /Library/Ruby/Gems/2.0.0/gems/xcodeproj-0.16.1/lib/xcodeproj.rb:30:in `'<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /Library/Ruby/Gems/2.0.0/gems/cocoapods-0.32.1/lib/cocoapods.rb:2:in `'<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/rubygems/core_ext/kernel_require.rb:55:in `require'<br style="" />
	from /Library/Ruby/Gems/2.0.0/gems/cocoapods-0.32.1/bin/pod:32:in `'<br style="" />
	from /usr/bin/pod:23:in `load'<br style="" />
	from /usr/bin/pod:23:in `&lt;main&gt;'</span>
</p>
<div>
	<code style="border:0px; font-family:Monaco,Consolas,'Andale Mono','DejaVu Sans Mono',monospace; font-size:15px; margin:0px; outline:0px; padding:0px; vertical-align:baseline; line-height:normal"><br />
	</code>
</div>
解决方法：
<p>
</p>
<ol class="task-list" style="padding:0px 0px 0px 30px; margin-top:15px; margin-right:0px; margin-left:0px; color:rgb(51,51,51); font-family:Helvetica,arial,freesans,clean,sans-serif; font-size:14px; line-height:23px; margin-bottom:0px!important">
	<li style="">
		Open Xcode 6
	</li>
	<li style="">
		Open Preferences
	</li>
	<li style="">
		Click the&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">Locations</code>&nbsp;tab
	</li>
	<li style="">
		Change the&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">Command Line Tools</code>&nbsp;version to&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">Xcode 6.0</code>
	</li>
	<li style="">
		Uninstall&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">cocoapods</code><br style="" />
		a.&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">$ sudo gem uninstall cocoapods</code><br style="" />
		
	</li>
	<li style="">
		Install&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">xcodeproj</code><br style="" />
		a.&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">$ sudo gem install xcodeproj</code><br style="" />
		
	</li>
	<li style="">
		Install&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">cocoapods</code><br style="" />
		a.&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">$ sudo gem install cocoapods</code><br style="" />
		
	</li>
	<li style="">
		Run&nbsp;<code style="font-family:Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size:12px; margin:0px; border:1px solid rgb(221,221,221); background-color:rgb(248,248,248); padding:0px">pod --version</code>&nbsp;to verify that it worked
	</li>
</ol>
<br />

<p>
</p>


</div>