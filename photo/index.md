---
layout: base
---

<link rel="stylesheet" href="/css/photo.css" type="text/css" />

<link rel="stylesheet" href="css/screen.css">
<link rel="stylesheet" href="css/lightbox.css">

<div class="container">
	<div class="container-fluid" id="ebay_photo">

        {% for photo in site.categories.ebay_photo %}
        	<div class="box span3">
        		<br>
        		<img class="flowImg" src="{{photo.background}}" >
        		<br>
        		<br>
        		<p style="word-wrap: break-word">{{photo.message}}</p>
        		<br>
        	</div>  
        {% endfor %}
    </div>

</div>

<script src="/js/masonry.pkgd.min.js"></script>
<script src="/js/imagesloaded.3.1.8.js"></script>

<script src="/js/lightbox.min.2.7.1.js"></script>


<script>
    $(document).ready(function(){
        var $container=$("#ebay_photo");
        $container.imagesLoaded(function(){
            $container.masonry({
                itemSelector:'.box',
                isAnimated:true,
            })
        });
    })
</script>