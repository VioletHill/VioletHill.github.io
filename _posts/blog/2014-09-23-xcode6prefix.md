---
layout: post
title:  xcode6取消prefix.pch文件
category: blog
description: 从xcode5升级到xcode6 发现一个很神奇的地方，xocde6取消了prefix文件，这意味着将不再有把经常使用的文件放入预编译里面
---
<div class="container">
	<p>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://stackoverflow.com/questions/24158648/why-isnt-projectname-prefix-pch-created-automatically-in-xcode-6">Stackoverflow</a>上有一个人对此的解释是这样的：<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I suspect because of modules, which remove the need for the <code>&nbsp;#import &lt;Cocoa/Cocoa.h&gt;.</code><br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As to where to put code that you would put in a prefix header, there is no code you should put in a prefix header. Put your imports into the files that need them. Put your definitions into their own files. Put your macros...nowhere. Stop writing macros unless there is no other way (such as when you need __FILE__). If you do need macros, put them in a header and include it.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The prefix header was necessary for things that are huge and used by nearly everything in the whole system (like Foundation.h). If you have something that huge and ubiquitous, you should rethink your architecture. Prefix headers make code reuse hard, and introduce subtle build problems if any of the files listed can change. Avoid them until you have a serious build time problem that you can demonstrate is dramatically improved with a prefix header.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In that case you can create one and pass it into clang, but it's incredibly rare that it's a good idea.<br>
		<hr style="margin-top:20px; margin-bottom:10px"><br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;翻译过来 大致就是说 也许是因为组件单一模块的原因，所以 放弃了对<code>&lt;Cocoa/Cocoa.h&gt;</code>的import<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你不应该在你的prefix代码中放入任何的代码，把他们放在你确实需要放入的文件中。把你的定义放到属于他们的文件中。 尽量不要使用宏定义（define）。。除非是非不得已的时候，（这里 插一句 不使用宏定义的原因是 宏定义是在预编译的时候处理的 因此 当你修改宏定义的时候 会导致大量的代码被重新编译 另外 宏定义存在许多潜在的bug  是因为在预编译的时候，他并不会被发觉到的）。如果你确实 在被逼无奈需要使用宏定义，把他们放在需要被include的头文件中，而不是放在prefix文件中。 <br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prefix header文件是被那些大量使用 以及 几乎所有系统中的文件都需要被使用（例如 Foundation.h）。如果 你有一些东西大量存在，你应该重新思考你的架构问题你。因为 当你修改你prefix header的一些代码的时候，prefix header导致整个项目重新编译，这让你的代码重用变得困难，并且导致一些琐碎build的问题。所以 不要去使用prefix header 这样可以避免你大量的重新编译整个项目的时间 <br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你仍然想要使用预编译，你可以创建一个新的并且传递给编译器的前段，这种方法很少见（我没用过），但确实是一个不错的方法<br>
		<hr style="margin-top:20px; margin-bottom:10px"><br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加预编译文件的方法<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;we need to create own PCH file add new file -> other-> PCH file.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At the project 'Build Settings' option - set the value of 'Prefix Header' to your PCH file name, with the project name as prefix - i.e. for project named 'TestProject' and PCH file named 'MyPrefixHeaderFile', add the value 'TestProject/MyPrefixHeaderFile.pch' to the plist.

	<p>
</div>