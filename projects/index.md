---
layout: base
---

<link rel="stylesheet" href="/css/projects.css"  type="text/css" />

<div class="container">
	<div class="container-fluid">
		<div id="iosProject">
			<h2>iOS</h2>
			{% for project in site.categosries.ios_projects %}
	         	 <div class="span4">
	        		<a href="{{project.url}}"><h3>{{ project.title }}</h3></a>
					<img src="{{project.image}}" class="projectIcon" />
					<br>
					<br>
					<p>
						<span class="projectItemCost">{{project.cost}}</span><br>
						<span class="projectItemInfo">Category</span>:<span class="projectItemInfo"> {{project.type}}</span><br>
						<span class="projectItemInfo">Released</span>:<span class="projectItemInfo"> {{project.released}}</span><br>
						<span class="projectItemInfo">Version</span>:<span class="projectItemInfo"> {{project.version}}</span><br>
						<span class="projectItemInfo">Size</span>:<span class="projectItemInfo"> {{project.size}}</span><br>
						<span class="projectItemInfo">{{project.copyright}}</span>
						<br>
						<br>
						<span class="projectItemTitle">Compatibility</span>:<span class="projectItemInfo"> {{project.require}}</span><br>
					</p>
	       	 	</div>
    		{% endfor %}
 		</div>
 		<script>
 			$("#iosProject").ready(function(){
 				var spans=$("#iosProject").find(".span4");
 				for (var i=0; i<=Math.floor(spans.length/3); i++){
 					if (i==0){
						$("#iosProject").find(".span4:lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 					}
 					else{
 						var selectG="gt("+(i*3-1)+")";
  						$("#iosProject").find(".span4:"+selectG+":lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 					}
 					
 				}
 			});
 		</script>
	</div>	

	<div class="container-fluid">
		<div id="tvOSProject">
			<h2>tvOS</h2>
			{% for project in site.categories.tvos_projects %}
	         	<div class="span4">
	        		<a href="{{project.url}}"><h3>{{ project.title }}</h3></a>
					<img src="{{project.image}}" class="tvosProjectIcon" />
					<br>
					<br>
					<p>
						<span class="projectItemCost">{{project.cost}}</span><br>
						<span class="projectItemInfo">Category</span>:<span class="projectItemInfo"> {{project.type}}</span><br>
						<span class="projectItemInfo">Released</span>:<span class="projectItemInfo"> {{project.released}}</span><br>
						<span class="projectItemInfo">Version</span>:<span class="projectItemInfo"> {{project.version}}</span><br>
						<span class="projectItemInfo">Size</span>:<span class="projectItemInfo"> {{project.size}}</span><br>
						<span class="projectItemInfo">{{project.copyright}}</span>
						<br>
						<br>
						<span class="projectItemTitle">Compatibility</span>:<span class="projectItemInfo"> {{project.require}}</span><br>
					</p>
	       	 	</div>
    		{% endfor %}
 		</div>

 		<script>
 			$("#tvOSProject").ready(function(){
 				var spans=$("#tvOSProject").find(".span4");
 				for (var i = 0; i<=Math.floor(spans.length/3); i++) {
 					if (i == 0) {
						$("#tvOSProject").find(".span4:lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 					} else {
 						var selectG="gt("+(i*3-1)+")";
  						$("#tvOSProject").find(".span4:"+selectG+":lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 					}
 				}
 			});
 		</script>
	</div>	

	<div class="container-fluid">
		<div id="androidProject">
			<h2>Android</h2>
			{% for project in site.categories.android_projects %}
           	 	<div class="span4">
	        		<a href="http://www.wandoujia.com/apps/me.qiufeng.www"><h3>{{ project.title }}</h3></a>
					<img src="{{project.image}}" class="projectIcon" />
					<br>
					<br>
					<p>
						<span class="projectItemCost">{{project.cost}}</span><br>
						<span class="projectItemInfo">Category</span>:<span class="projectItemInfo"> {{project.type}}</span><br>
						<span class="projectItemInfo">Released</span>:<span class="projectItemInfo"> {{project.released}}</span><br>
						<span class="projectItemInfo">Version</span>:<span class="projectItemInfo"> {{project.version}}</span><br>
						<span class="projectItemInfo">Size</span>:<span class="projectItemInfo"> {{project.size}}</span><br>
						<span class="projectItemInfo">{{project.copyright}}</span>
						<br>
						<br>
						<span class="projectItemTitle">Compatibility</span>:<span class="projectItemInfo"> {{project.require}}</span><br>
					</p>
	       	 	</div>
        	{% endfor %}
 		</div>

 		<script>
 			$("#androidProject").ready(function(){
 				var spans=$("#androidProject").find(".span4");
 				for (var i=0; i<=Math.floor(spans.length/3); i++){
 					if (i==0){
						$("#androidProject").find(".span4:lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 					}
 					else{
 						var selectG="gt("+(i*3-1)+")";
  						$("#androidProject").find(".span4:"+selectG+":lt(3)").wrapAll('<div class="row-fluid flowItem"></div>');
 					}
 					
 				}
 			});
 		</script>
	</div>	
</div>
