---
layout: base
---

<link rel="stylesheet" href="/css/graffito.css" />

<div class="container">
    <div id="leftContainer"></div>
    <div id="rightContainer"></div>
    <div class="clearfix"></div>

    {% for graffito in site.categories.graffito %}
        <div class="block">
            <div class="content">
                <p>
                    {{ graffito.message }}
                </p>
                <p class="publishDate">
                    {{ graffito.publishDate }}
                </p>
                <br>
            </div>
        </div>
    {% endfor %}

    

</div>    

<script src="/js/graffito.js"> </script>