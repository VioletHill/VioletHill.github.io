---
layout: base
---

<link rel="stylesheet" href="/css/message.css" type="text/css" />

<div class="container">
	<div class="container-fluid" id="ebay_photo">
        {% for photo in site.categories.ebay_photo %}
        	<div class="span4 ">
        		<br>
        		<img class="image" class="flowImg" src="{{photo.background}}" >
        		<br>
        		<br>
        		<p style="word-wrap: break-word">{{photo.message}}</p>
        		<br>
        	</div>  
        {% endfor %}
    </div>
    
    <script>
 		$("#ebay_photo").ready(function(){
 			var spans=$("#ebay_photo").find(".span4");
 			for (var i=0; i<=Math.floor(spans.length/3); i++){
 				if (i==0){
					$("#ebay_photo").find(".span4:lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 				}
 				else{
 					var selectG="gt("+(i*3-1)+")";
  					$("#ebay_photo").find(".span4:"+selectG+":lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 				}
 					
 			}
 		});
 	</script>

</div>