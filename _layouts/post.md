---
layout: base
---

<link rel="stylesheet" href="/highlight/xcode.css">
<link rel="stylesheet" href="/js/prettify/prettify.css" />
<link rel="stylesheet" href="/css/projects.css"  type="text/css" />

<div class="container">
    <h2 class="entry-title" style="text-align:center">{{ page.title }}</h2>
    <p class="entry-date" style="text-align:right">{{ page.date|date:"%Y-%m-%d" }}</p>
    <div class="cleafix"></div>
    <div>
        <hr>
        {{ content }}
  
  <br>
      <!-- JiaThis Button BEGIN -->
<div class="jiathis_style" style="float:right">
    <a class="jiathis_button_qzone"></a>
    <a class="jiathis_button_tsina"></a>
    <a class="jiathis_button_tqq"></a>
    <a class="jiathis_button_weixin"></a>
    <a class="jiathis_button_renren"></a>
    <a class="jiathis_button_fav"></a>
    <a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jtico jtico_jiathis" target="_blank"></a>
    <a class="jiathis_counter_style"></a>
</div>
<div class="clearfix"></div>
        <br>
        <div>
        {% assign find = '0' %}
        {% for post in site.categories.blog %}

            {%  if find == '1' %}
                {%  assign lastpost=post   %}
                {%  break %}
            {%  endif %}

            {%  if post.url == page.url %}
                {% assign find = '1' %}
            {%  endif %}

            {%  if find == '0' %}
                {%  assign nextpost=post %}
            {%  endif %}
        {% endfor %}

        {%  if lastpost %}
            <a href={{lastpost.url}}  style="float:left">上一篇：{{  lastpost.title }}</a>
        {% endif %}

        {%  if nextpost %}
            <a href={{nextpost.url}} style="float:right;">下一篇：{{  nextpost.title }}</a>
        {% endif %}
        </div>

        <div class="clearfix"></div>
        <hr>
    </div>   

<script type="text/javascript" src="http://v3.jiathis.com/code_mini/jia.js?uid=1396498463735181" charset="utf-8"></script>
<!-- JiaThis Button END -->

 <!--    <div id="disqus_container">
        <a href="#" class="comment" onclick="return false;">点击查看评论</a>
        <div id="disqus_thread"></div>
    </div>
 -->

    <!-- 多说评论框 start -->
    <div class="ds-thread" data-thread-key="{{page.date}}{{page.title}}" data-title="{{page.title}}" data-url="{{page.url}}"></div>
<!-- 多说评论框 end -->
<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
<script type="text/javascript">
var duoshuoQuery = {short_name:"qiufeng"};
    (function() {
        var ds = document.createElement('script');
        ds.type = 'text/javascript';ds.async = true;
        ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0] 
         || document.getElementsByTagName('body')[0]).appendChild(ds);
    })();
    </script>
<!-- 多说公共JS代码 end -->
</div>

<script src="/js/post.js" type="text/javascript"></script>

<script src="/highlight/highlight.js"></script>



    
