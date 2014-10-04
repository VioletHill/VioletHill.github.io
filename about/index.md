---
layout: base
---

<link rel="stylesheet" href="/css/about.css"  type="text/css" />

<div class="container"style="width:1000px">
	<div class="infoContainer">
		<h3>Education</h3>
		<br>
		<p><span class="title">School</span><span class="info">Tongji University, Shanghai, China</span></p>
		<p><span class="title">Major</span><span class="info">Software Engineering</span></p>
		<p><span class="title">Degree</span><span class="info">Bachelor</span></p>
		<p><span class="title">Direction</span><span class="info">iOS and Web development</span></p>

		<hr>
	</div>

	<!-- var colors=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#282828","#ee19f1"]; -->


	<div class="infoContainer"  style="width:1000px">
		<h3>Skills</h3>
		<br>
		<div class="skillContainer">
			<span class="title">Favorite</span>
			<span class="barContainer">
				<div class="progress progress-striped active" style="margin-bottom:0">
  					<div class="bar" style="width: 90%; background-color:#1f77b4">
  						<div class="info barInfo">Objective-C</div>
  					</div>
  				</div>
			</span>
		</div>	
		<div style="clear:both"></div>

		<div class="skillContainer">
			<span class="title">Learning</span>			
			<span class="barContainer">
				<div class="progress progress-striped active" style="margin-bottom:0">
  					<div class="bar" style="width: 10%; background-color:#ff7f0e">
  						<div class="info barInfo">Swift</div>
  					</div>
				</div>
			</span>
		</div>
		<div style="clear:both"> </div>

		<div class="skillContainer">
			<span class="title">Interesting</span>
			<span class="barContainer">
				<div class="progress progress-striped active" style="margin-bottom:0">
  					<div class="bar" style="width: 60%; background-color:#2ca02c">
						<div class="info barInfo">JavaScript</div>
  					</div>
				</div>
			</span>
		</div>
		<div style="clear:both"></div>

		<div class="skillContainer">
			<span class="title">Love</span>
			<span class="barContainer">
				<div class="progress progress-striped active" style="margin-bottom:0">
  					<div class="bar" style="width: 60%; background-color:#d62728">
						<div class="info barInfo">HTML</div>
  					</div>
				</div>
			</span>
		</div>
		<div style="clear:both"></div>

		<div class="skillContainer">
			<span class="title">Like</span>
			<span class="barContainer">
				<div class="progress progress-striped active" style="margin-bottom:0">
  					<div class="bar" style="width: 50%; background-color:#9467bd">
						<div class="info barInfo">PHP</div>
  					</div>
				</div>
			</span>
		</div>
		<div style="clear:both"></div>

		<div class="skillContainer">
			<span class="title">Familiar</span>
			<span class="barContainer">
				<div class="progress progress-striped active" style="margin-bottom:0">
  					<div class="bar" style="width: 30%; background-color:#282828">
						<div class="info barInfo">Java</div>
  					</div>
				</div>
			</span>
		</div>
		<div style="clear:both"></div>

		<hr>
	</div>


	<div class="infoContainer" style="width:1000px">
		<h3>Experiences</h3>
		<br>
	
		
		

		<div id="timeline">
			<ul id="dates">
				<li><a href="#time2012">2012</a></li>
				<li><a href="#time2013">2013</a></li>
				<li><a href="#time2014">2014</a></li>
			</ul>
			<ul id="issues">
				<li id="time2012">
					<div>
						<p><span class="title">Sep.</span><span class="info">Assistant Of "C Language" Course</span></p>
						<p><span class="title">Sep.</span><span class="info">Became A Member Of "Tongji Apple Club"</span></p>
						<p><span class="title">Nov.</span><span class="info">Volunteer Of "Challenge Cup"</span></p>
						<p><span class="title">Dec.</span><span class="info">Silver Prize Of "IBM Master the Mainframe Contest China"</span></p>
					</div>
				</li>
				<li id="time2013">
					<div>
						<p><span class="title">May.</span><span class="info">Volunteer Of "Challenge Cup"</span></p>
						<p><span class="title">Sep.</span><span class="info">Assistant Of "Java Language" Course</span></p>
						<p><span class="title">Sep.</span><span class="info">Chairman Of Tongji Football Association</span></p>
						<p><span class="title">Oct.</span><span class="info">Training Of "Start Your Road At SAP"</span></p>
						<p><span class="title">Nov.</span><span class="info">Volunteer Of SAP Future IT Leader Summit 2013</span></p>
					</div>
				</li>
				<li id="time2014">
					<div>
						<p><span class="title">Jan.</span><span class="info">Science And Technology Scholarship Of Tongji University</span></p>
						<p><span class="title">Feb.</span><span class="info">Volunteer Of  FTC</span></p>
						<p><span class="title">Apr.</span><span class="info">Intern Of eBay</span></p>
						<p><span class="title">Sep.</span><span class="info">Intern Of baixing.com</span></p>
					</div>
				</li>
			</ul>
		</div>
	</div>

	
</div>

<script src="/js/jquery.timelinr-0.9.54.js"></script>

<script> 
		$(function(){
			$().timelinr({
					arrowKeys: 'true'
			});
		});
</script>
