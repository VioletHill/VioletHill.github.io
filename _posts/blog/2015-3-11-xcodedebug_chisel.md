---
layout: post
title: 	Xcode下调试神奇——Chisel
category: blog
description: Xcode下debug神奇 快速找到你的 ViewController
---


<div class="container">
  <p>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在接手一个新的项目的时候，常常因为无法找到对应的 ViewController 而烦恼，如果每次都要通过 Stroyboard 一步一步跟过去，这样的效率显然太过于低下。
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;于是，当我发现 facebook 的<a href="https://github.com/facebook/chisel"> Chisel </a>，终于有了原来那种弱智的替代方法。Chisel 是一款能够帮助快速 debug 的插件
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;安装方法很简单，一共两个步骤：
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一：打开终端：输入
<pre name="code" class="plain">brew update
brew install chisel</pre>
<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第一行命令通常可以省略，如果你没有安装过 brew,可以到<a href=" http://brew.sh">这里</a>看看.
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二步:
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首先确认一下路径 正常情况下 你的路径应该和我的一样, 打开终端，输入
<pre name="code" class="plain">cd /usr/local/opt/chisel/libexec/
ls</pre>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你应该会看到这样的一堆文件，如果能够看到 说明你安装正确，并且路径和我的是一样的 如果不同  那么 你需要自己去寻找一下你的路径
    <pre>commands     fblldbobjcruntimehelpers.py
fblldb.py     fblldbobjecthelpers.py
fblldbbase.py     fblldbviewcontrollerhelpers.py
fblldbinputhelpers.py   fblldbviewhelpers.py
    </pre>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来 在终端中输入：
    <pre>vim ~/.lldbinit</pre>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后把这段代码复制进去，如果你的路径和我不同 那么 复制你自己对应的路径
    <pre>command script import /usr/local/opt/chisel/libexec/fblldb.py</pre>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;好了 所有的部署工作都完成了，最后 重启 Xcode，运行项目的时候，只要点击暂停 然后在 Console 中输入 pvc 就可以看到现在的 ViewController 啦 当然 你可以输入 help 查看更多的命令 或者 进入 <a href="https://github.com/facebook/chisel">GitHub </a>寻求更多的帮助。
  </p>
</div>

