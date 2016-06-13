---
layout: post
section-type: post
title: 	用 Passbook 制作自己的名片 2
category: blog
description: 这是接着上一篇的内容 完成最后的扫一扫部分
---

这是接着上一片博客 用 Passbook 制作自己的名片 1 的第二部分, 如果你还没有完成第一部分 那么建议你先把自己基本 Passbook 名片的基础功能完成 再来制作最后的扫一扫功能
   
截至上一篇博客为至, 我们完成了除了扫一扫的所有功能, 所以在这一篇博客中, 我们需要为自己的名片加入扫一扫的功能。

首先,我们回顾一下 pass.json 中的 barcode 字段，
   
	   "barcode": {
	        "message": "I'm qiufeng",
	        "format": "PKBarcodeFormatPDF417",
	        "messageEncoding": "utf-8",
	        "altText": "SCAN TO ADD"
	    },


这里有一个字段是 message, 这个字段我在上一篇文章中并没有做出解释。而且 在你的 passbook 中并没有被显示出来，其实，这个字段就是扫一扫后，passbook 读取到的信息。换句话说，在你上一篇制作的 passbook 名片中。你通过 passbook 去扫那个二维码 扫出来的结果是一个 String: I'm qiufeng，这时候 passbook 不明白这是什么意思。所以，就相当于没识别出来了。


如果你嗅觉敏锐一点，会发现如果我在message放入 .pkpass 文件的下载地址，是不是passbook就会自动下载那个。答案是肯定的！只要你在message那个字段上放上你的 .pkpass 文件的下载地址，那么就相当于完成了扫一扫的功能。比如 真实情况下，我的 barcode 真实是这样的:


	  "barcode": {
	        "message": "https://passbookcard.herokuapp.com/passbook/qiufeng",
	        "format": "PKBarcodeFormatPDF417",
	        "messageEncoding": "utf-8",
	        "altText": "SCAN TO ADD"
	    },


而 [https://passbookcard.herokuapp.com/passbook/qiufeng](https://passbookcard.herokuapp.com/passbook/qiufeng) 就是 .pkpass 文件的下载地址，怎么验证呢？很简单，把这个地址 copy 到浏览器中，就会出现一个你的 passbook 名片(当然 需要OS X系统)。


这时候，很多人和我当初一样，会犯这样一个错误，我只要把这个东西放到百度网盘或者甚至放到 GitHub 都行,然后得到文件的地址就可以了吧，答案是否定的，和普通文件下载不同的地方是，这里 passbook文件的扫一扫功能 需要你设定 http 中 header 的 'Content-Type' 为 'application/vnd.apple.pkpass'。换句话说，你光放一个文件是不行的，需要写一点的代码。而且 这些代码很简单。只要修改 http 的 header 然后返回那个文件就可以了。


所以，我们需要一个稳定的服务器。如果你和我一样，缺少一个稳定的服务器，那么 推荐你使用 [ heroku ](https://www.heroku.com) (可能要翻墙) ，heroku 是一个后端代码的托管中心，根据API的请求次数付费。如果，我们仅仅是做扫一扫这个功能，相当于是一个免费的服务。但是，这里需要声明一下，heroku可能有那么一点点不稳定或者是速度慢。。毕竟 天朝 你懂的 大家都为了和谐～～。我曾经试图去寻找中国类似的服务，但是很遗憾～～在欧洲发现一个。不过，貌似被天朝管制的更惨。所以最后还是选择了heroku，如果你有更好的服务商推荐给我，也可以发邮件告诉我～


如果你有自己稳定的服务器，那我推荐你还是弄到自己的服务器上吧！然后写点PHP 或者 Ruby 的代码 把 'Content-Type' 改为 'application/vnd.apple.pkpass'就可以了。那么，下面的文字你也就可以跳过了。


好了，接下来的工作 就是去 heroku 注册一个账号 然后创建一个 Ruby 的项目(如果你熟悉后端语言 比如PHP啊、Python啊 什么七七八八的 可以自己去完成),然后 按照 [heroku的教程](https://devcenter.heroku.com/articles/getting-started-with-ruby) 把环境部署好, 注意只需要完成到 Deploy the app, 然后 能够在本地创建自己的文件夹就可以了。

接下来，我们会使用 Ruby 的一个框架 [sinatra](https://github.com/sinatra/sinatra) 。请不要被吓倒，sinatra 很简单，可以去看看 GitHub 的教程。 3 行代码跑出一个网页， 并且可以不需要你任何基础。 如果需要本地环境， 也可以按照 GitHub 的教程搭建一个。

接着 我们写一点后端代码吧，创建一个 passbook.rb 的文件 内容如下:

	require 'rubygems'
	require 'sinatra'
	
	get '/passbook/qiufeng' do
	    headers 'Content-Type' =&gt; 'application/vnd.apple.pkpass'
	   	send_file File.join('pkpass','qiufeng.pkpass')
	end

很简单吧。这里，我把我的 qiufeng.pkpass 文件放到了一个叫做 pkpass 的文件夹下面，然后访问这个 url，就会返回这个文件。但是 我把 http 的Content-Type 修改了, 确保 Passbook 能够正确的扫描出来。好了，如果是仅仅是本地环境， 那么我们已经完成了全部的工作。但是 我们需要 heroku 环境 这样我们才能够 不需要自己的电脑做服务器 别人也能完成扫一扫的功能。

push 到 heroku 的文件会略有不同 需要多创建几个文件 一个是 Gemfile(没有 后缀 可以用vim创建) 内容如下：

	ruby '2.0.0'
	source 'https://rubygems.org'
	gem 'sinatra', '1.4.5'


一个是 config.ru, 内容如下:

	require './passbook'
	run Sinatra::Application


一个是 Gemfile.lock

	GEM
	  remote: https://rubygems.org/
	  specs:
	    rack (1.6.0)
	    rack-protection (1.5.3)
	      rack
	    sinatra (1.4.5)
	      rack (~&gt; 1.4)
	      rack-protection (~&gt; 1.4)
	      tilt (~&gt; 1.3, &gt;= 1.3.4)
	    tilt (1.4.1)
	
	PLATFORMS
	  ruby
	
	DEPENDENCIES
	  sinatra (= 1.4.5)



到此 我们完成了所有的工作， 你的目录文件夹看起来应该是这样的：

![](/images/blog/passbookcard2/file.png)


然后，我们把它 push 上去 访问你的 heroku 路径, 确保路径生效后, 然后 修改 pass.json 中 barcode，变成你自己的 url，这样就完成了最后的扫一扫功能。最后，多啰嗦一句，如果修改了 pass.json，别忘记 manifest.json 中的 SHA1 加密也会跟着改变。

好了，所有的工作都做完了 快给小伙伴们炫耀炫耀吧！

