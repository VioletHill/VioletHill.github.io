---
layout: base
---

<link rel="stylesheet" href="/css/blog.css" />

<div class="container content blog">
    <div class="section">
        <ul class="artical-list">
        {% for post in site.categories.blog %}
            <li class="articalHide">        
                <div>
                    <a href="{{ post.url }}"><h4>{{ post.title }}</h4></a>
                    <div class="title-desc">
                        <span>
                            {{ post.description }}
                        </span>
                     </div>
                </div>
                <hr>
            </li>
        {% endfor %}
        </ul>

        <div class="pagination pagination-simall pagination-right">
            <ul id="pageUl">
            </ul>
        </div>
    </div>
</div>

<script>
    var pageCount=5;
    var totalPage=0;
    var articals;
    $(".artical-list").ready(function(){
        articals=$(".artical-list").find("li");
        totalPage=Math.floor(articals.length/pageCount);
        if (totalPage>0){
            addPageNum(totalPage);
            setPage(0);
        }
        else{
            articals.removeClass('articalHide');
        }
    });

    function setPage(page)
    {
        $("#pageUl").find("li").removeClass('active');
        $("#pageUl").find("li:eq("+page+")").addClass('active');
        articals.addClass('articalHide');
        for (var i=page*pageCount; i<pageCount*(page+1); i++){
            if (i == articals.length) break;
            $(articals[i]).removeClass('articalHide');
        }
    }

    function addPageNum(totalPage)
    {
        for (var i=0; i<=totalPage; i++)
        {
            var li='<li><a href="javascript:setPage('+i+')">'+(i+1)+'</a></li>';
            $("#pageUl").append(li);
        }
        
    }

</script>