---
layout: post
title: 	用 Passbook 制作自己的名片 2
category: blog
description: 这是接着上一篇的内容 完成最后的扫一扫部分
---


<div class="container">
	<p>
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是接着上一片博客 用 Passbook制作自己的名片1 的第二部分, 如果你还没有完成第一部分 那么建议你先把自己基本Passbook名片的基础功能完成 再来制作最后的扫一扫功能
   截至上一篇博客为至, 我们完成了除了扫一扫的所有功能, 所以在这一篇博客中, 我们需要为自己的名片加入扫一扫的功能.

   首先,我们回顾一下pass.json中的 barcode字段，
  <pre name="code" class="plain"> &quot;barcode&quot;: {
        &quot;message&quot;: &quot;I'm qiufeng&quot;,
        &quot;format&quot;: &quot;PKBarcodeFormatPDF417&quot;,
        &quot;messageEncoding&quot;: &quot;utf-8&quot;,
        &quot;altText&quot;: &quot;SCAN TO ADD&quot;
    },
</pre>
<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这里有一个字段是 message, 这个字段我在上一篇文章中并没有做出解释。而且 在你的passbook中并没有被显示出来，其实 这个字段 就是扫一扫后，passbook读取到的信息.换句话说 在你上一篇制作的passbook名片中 你通过passbook去扫那个二维码 扫出来的结果是一个String: I'm qiufeng , 这时候 passbook不明白这是什么意思 所以 就相当于没识别出来了.
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你嗅觉敏锐一点,会发现 如果我在message放入 .pkpass文件的下载地址，是不是passbook就会自动下载那个。答案是肯定的！只要你在message那个字段上放上你的.pkpass文件的下载地址 那么就相当于完成了扫一扫的功能,比如 真实情况下,我的barcode真实是这样的:
    <br>
    <pre name="code" class="plain">&quot;barcode&quot;: {
        &quot;message&quot;: &quot;https://passbookcard.herokuapp.com/passbook/qiufeng&quot;,
        &quot;format&quot;: &quot;PKBarcodeFormatPDF417&quot;,
        &quot;messageEncoding&quot;: &quot;utf-8&quot;,
        &quot;altText&quot;: &quot;SCAN TO ADD&quot;
    },</pre>
<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;而 https://passbookcard.herokuapp.com/passbook/qiufeng 就是.pkpass文件的下载地址, 怎么验证呢 很简单 把这个地址copy到浏览器中，就会出现一个你的passbook名片(当然 需要OS X系统)。
    <br />

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这时候，很多人和我当初一样，会犯这样一个错误，我只要把这个东西放到百度网盘或者甚至放到github都行,然后得到文件的地址就可以了吧,答案是否定的，和普通文件下载不同的地方是，这里 passbook文件的扫一扫功能 需要你设定 http 中 header 的 'Content-Type' 为 'application/vnd.apple.pkpass'，换句话说 你光放一个文件是不行的 需要写一点的code 而且 这些code很简单 只要修改http的header然后返回那个文件就可以了。
    <br />

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所以 我们需要一个稳定的服务器，如果你和我一样，缺少一个稳定的服务器，那么 推荐你使用 <a href="https://www.heroku.com">heroku</a>(可能要翻墙) ，heroku是一个后端代码的托管中心,根据API的请求次数付费，如果 我们仅仅是做扫一扫这个功能 相当于是一个免费的服务。但是 这里需要声明一下  heroku可能有那么一点点不稳定或者是速度慢。。毕竟 天朝 你懂的 大家都为了和谐～～。我曾经试图去寻找中国类似的服务 但是很遗憾～～在欧洲发现一个 不过 貌似被天朝管制的更惨，所以最后还是选择了heroku, 如果你有更好的服务商推荐给我 也可以发邮件告诉我～
    <br />

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果你有自己稳定的服务器 那我推荐 你还是弄到自己的服务器上吧！然后写点PHP 或者 Ruby 的代码 把 'Content-Type' 改为 'application/vnd.apple.pkpass'就可以了。那么 下面的文字你也就可以跳过了

    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了，接下来的工作 就是去heroku注册一个账号 然后创建一个 Ruby 的项目(如果你熟悉后端语言 比如PHP啊、Python啊 什么七七八八的 可以自己去完成),然后 按照<a herf="https://devcenter.heroku.com/articles/getting-started-with-ruby">heroku的教程</a> 把环境部署好, 注意只需要完成到 Deploy the app, 然后 能够在本地创建自己的文件夹就可以了.
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来 我们会使用Ruby的一个框架<a href="https://github.com/sinatra/sinatra">sinatra</a>请不要被吓倒，sinatra很简单 可以去看看github的教程 3行代码跑出一个网页 并且可以不需要你任何基础 如果需要本地环境 也可以按照github的教程搭建一个

    接着 我们写一点后端代码吧，创建一个passbook.rb的文件 内容如下:
    <br />

<pre name="code" class="ruby">require 'rubygems'
require 'sinatra'

get '/passbook/qiufeng' do
    headers 'Content-Type' =&gt; 'application/vnd.apple.pkpass'
   	send_file File.join('pkpass','qiufeng.pkpass')
end</pre>
<br />
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;很简单吧 这里 我把我的qiufeng.pkpass文件 放到了一个叫做pkpass的文件夹下面, 然后访问这个url,就会返回这个文件，但是 我把http的Content-Type修改了, 确保Passbook能够正确的扫描出来。好了 如果是仅仅是本地环境 那么我们已经完成了全部的工作，但是 我们需要heroku环境 这样我们才能够 不需要自己的电脑做服务器 别人也能完成扫一扫的功能.

push到heroku的文件会略有不同 需要多创建几个文件 一个是 Gemfile(没有 后缀 可以用vim创建) 内容如下

<pre name="code" class="plain">ruby '2.0.0'
source 'https://rubygems.org'
gem 'sinatra', '1.4.5'
</pre>
<br />

一个是 config.ru, 内容如下:
<pre name="code" class="plain">require './passbook'
run Sinatra::Application</pre>
<br />

一个是 Gemfile.lock

<pre name="code" class="plain">GEM
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
  sinatra (= 1.4.5)</pre>
<br />



  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到此 我们完成了所有的工作， 你的目录文件夹看起来应该是这样的：
  <br />

  <div style="text-align:center">
        <img src="/images/blog/passbookcard2/file.png" />
  </div>

  <br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后 我们把它push上去 访问你的heroku路径, 确保路径生效后, 然后 修改pass.json中barcode，变成你自己的url，这样就完成了最后的扫一扫功能。最后 多啰嗦一句 应为pass.json的修改 别忘记 manifest.json中的SHA1加密。

  <br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 所有的工作都做完了 快给小伙伴们炫耀炫耀吧～～
</p>
</div>

