---
layout: base
---

<link rel="stylesheet" href="/css/about.css"  type="text/css" />

<div class="container">
    <div class="profile-badge clearfix" style="margin-top:20px">
        <a href="https://github.com/violethill" target="_blank">
            <img height="50" width="50" alt="violethill" class="avatar" src="https://secure.gravatar.com/avatar/5bbb59c29057c32e635057070e14354d?s=220&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png">
            <span class="profile-name">QiuFeng</span>
        </a>
    </div>

    <hr style="margin-top:20px; margin-bottom:20px">

    <div id="description" style="margin-top:20px">
    	<p>
    		Hello, I'm a top notch Apple fanchild who loves push code. I'm a fulltime hacker who works best late at night (around <a href="#schedule" id="workTime"></a> o'clock). 
    	</p>
    	<br>

    	<p id="similarUsers">
    		My developer personality is very similar to <a href="#" class="similarUser"></a>'s but <span class="similarUser"></span> is more of a pusher. There is also an uncanny similarity between My activity stream and those of
    	</p>
    	<br>

    	<p id="friends">
        	It seems like I am—or should be—friends with <a href="#" class="friendName"></a>. With this in mind, it's worth noting that <span class="friendName"></span> has a more consistent weekly schedule. There is also an obvious connection between me and
        </p>
        <br>

        <p id="repositories">
        	These days, I'm most actively contributing to the repositories:
        </p>
        <br>

        <h3 id="stats" style="text-align:center">Statistics</h1>
        <hr>


        <p id="schedule">
        		The two following graphs show My average weekly and daily schedules. These charts give significant insight into My character as a developer. The colors in the charts indicate the fraction of events that are	<span class="eventTitle"></span>
        </p>

        <div class="hist-block">
            <div id="weekEvent" class="hist"></div>
            <div id="dayEvent" class="hist"></div>
        </div>

        <p>
        	<strong>Note</strong>: an attempt has been made to show these plots in in the correct timezone (based on QiuFeng's location listed on <a href="https://github.com/violethill">their GitHub profile</a>) but this procedure is imperfect at best.
        </p>

        <br>
        <p id="events">
        	You already know that QiuFeng loves pushing code but the following chart sheds some light onto what QiuFeng does with their open source time. In the full event stream analyzed for this report, there are a total of <strong id="eventTotal"></strong> events recorded for me. The colors in the pie chart below indicate the number of events that are
        	<span class="eventTitle"></span>
        </p>
        <div class="hist-block" style="text-align:center">
            <div id="eventChart"></div>
        </div>

        <p id="languages">
    		QiuFeng has contributed to repositories in <span id="totalLanug"></span> languages. In particular, QiuFeng seems to be a pretty serious<strong id="firstLanguage"></strong> expert with a surprisingly broad knowledge of <strong id="secondLanguage"></strong> as well. The following chart shows the number of contributions QiuFeng made to repositories mainly written in <span id="languagesTitle"></span>
        </p>
        <div class="hist-block">
            <div id="languageChart"></div>
        </div>

        <p>
		 	Remember that it is just meant to be a toy and not meant to be taken seriously 
		</p>
    </div>
</div>


<script>
	
	var colors=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#282828","#ee19f1"];

	$(document).ready(function(){

		$.getJSON("http://osrc.dfm.io/violethill.json",
			function(data){

				setWorkTime(data.usage.day);

				setSimilarUser(data.similar_users[0]);
				addMoreSimilarUsers(data.similar_users);

				setFriend(data.connected_users[0]);
				addMoreFriends(data.connected_users);

				addRepositories(data.repositories);

				setEventsTitle(data.usage.events);

				drawWeekEventBarChart(data.usage.events);
				drawDayEventBarChart(data.usage.events);

				setTotalEventLable(data.usage.events);

				drawEventChart(data.usage.events);

				addLanugTitle(data.usage.languages);
				drawLanguageChart(data.usage.languages);

				setFirstAndSecondLaunage(data.usage.languages);
			});	
	});

	function setWorkTime(data)
	{	
		var maxTime=-1;
		var time=0;
		for(var i=0; i<data.length; i++){
			if (data[i]>=maxTime){
				maxTime=data[i];
				time=i;
			}
		}
		$("#workTime").html(time);	
	}

	function setSimilarUser(userName)
	{
		$("a.similarUser").attr("href","http://osrc.dfm.io/"+userName.name);
		$(".similarUser").html(userName.name);
	}

	function addMoreSimilarUsers(data)
	{
		for (var i=1; i<data.length-1; i++)
		{
			var similarUser='<a href="http://osrc.dfm.io/'+data[i].name+'">'+data[i].name+'</a>';
			if (i<data.length-2) similarUser+=', ';
			else similarUser+=' ';
			$("#similarUsers").append(similarUser);
		}
		var similarUser='and <a href="http://osrc.dfm.io/'+data[data.length-1].name+'">'+data[data.length-1].name+'</a>.';
		$("#similarUsers").append(similarUser);
	}

	function setFriend(userName)
	{
		$("a.friendName").attr("href","http://osrc.dfm.io/"+userName.name);
		$(".friendName").html(userName.name);
	}

	function addMoreFriends(data)
	{
		for (var i=1; i<data.length-1; i++)
		{
			var friend='<a href="http://osrc.dfm.io/'+data[i].name+'">'+data[i].name+'</a>';
			if (i<data.length-2) friend+=', ';
			else friend+=' ';
			$("#friends").append(friend);
		}
		var friend='and <a href="http://osrc.dfm.io/'+data[data.length-1].name+'">'+data[data.length-1].name+'</a>.';
		$("#friends").append(friend);
	}

	function addRepositories(data)
	{
		for (var i=1; i<data.length-1; i++)
		{
			var res='<a href="https://github.com/'+data[i].repo+'">'+data[i].repo+'</a>';
			if (i<data.length-2) res+=', ';
			else res+=' ';
			$("#repositories").append(res);
		}
		var res='and <a href="https://github.com/'+data[data.length-1].repo+'">'+data[data.length-1].repo+'</a>.';
		$("#repositories").append(res);
	}

	function setEventsTitle(events)
	{
		for (var i=0; i<events.length-1; i++)
		{
			var title=getTitleWithType(events[i].type);
			var eventTitle='<strong class="eventype" style=" color:'+colors[i]+'">'+title+'</strong>';
			if (i<events.length-2) eventTitle+=', ';
			else eventTitle+=' ';

			$(".eventTitle").append(eventTitle);	
		}

		var title=getTitleWithType(events[events.length-1].type);
		var eventTitle='and <strong class="eventype" style=" color:'+colors[events.length-1]+'">'+title+'</strong>.';
		$(".eventTitle").append(eventTitle);	
	}

	function getTitleWithType(type)
	{
		if (type=="PushEvent") return "pushes";
		if (type=="CreateEvent") return "new repos or branches";
		if (type=="MemberEvent") return "new collaborations";
		if (type=="WatchEvent") return "watching";
		if (type=="IssuesEvent") return "new issues";
	}

	function drawBarChartWithConfig(id,categoriesArray,dataArray,tickInterval)
	{
		if (!tickInterval) tickInterval=1;

		var categoriesColor=[];
		for (var i=0; i<dataArray.length; i++)
		{
			categoriesColor[i]=colors[dataArray.length-1-i];
		}
		var option={
        	chart: {
            	type: 'column'
        	},
        	title: {
            	text: null
        	},
        	colors:categoriesColor,
        	xAxis: {
            	categories: categoriesArray,
            	tickInterval: tickInterval,
        	},
        	yAxis: {
            	title: {
                	text: null
                }
            },
            legend: {
            	enabled:false
      		},
        	plotOptions: {
        		column:{
        			stacking: 'normal',
        			groupPadding: 0,  
        			pointPadding: 0.1,
        			borderWidth: 0,
        		}
        	},
        	series: dataArray,
        	credits:{ 
                enabled:false
            }, 

    	};
    	$('#'+id).highcharts(option);
	}
	function drawWeekEventBarChart(data)
	{
		var categories=["S","M","T","W","T","F","S"];
		var dataArray=[];

		for (var i=0; i<data.length; i++)
		{
			dataArray[data.length-i-1]={name:data[i].type,data:data[i].week};
		}
		drawBarChartWithConfig("weekEvent",categories,dataArray);
	}

	function drawDayEventBarChart(data)
	{
		var categories=["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
		var dataArray=[];
		for (var i=0; i<data.length; i++)
		{
			dataArray[data.length-1-i]={name:data[i].type,data:data[i].day};
		}
		drawBarChartWithConfig("dayEvent",categories,dataArray,3);
	}

	function setTotalEventLable(data)
	{
		var total=0;
		for (var i=0; i<data.length; i++)
		{
			total+=data[i].total;
		}
		$("#eventTotal").html(total);
	}

	function drawPieChartWithConfig(id,categories,dataArray)
	{
		var option={
        	chart: {
            	type: 'pie',
        	},
        	colors:colors,
        	categories:categories,
        	title: {
            	text: null
        	},
            legend: {
            	enabled:false
      		},
        	plotOptions: {
        		pie:{
        			allowPointSelect: false,
                	cursor: 'pointer',
                	dataLabels: {
                    	enabled: false,
        			}
        		}
        	},
        	series: [{
        		name:"times",
            	data: dataArray
        	}],
        	credits:{ 
                enabled:false
            }, 
    	};
    	$('#'+id).highcharts(option);
	}

	function  drawEventChart(data)
	{
		var dataArray=[];
		var categories=[];
		for (var i=0; i<data.length; i++)
		{	
			categories[i]=getTitleWithType(data[i].type);
			dataArray[i]={name:categories[i],y:data[i].total};
		}
		console.log(dataArray);
		drawPieChartWithConfig("eventChart",categories,dataArray);
	}


	function addLanugTitle(data)
	{
		console.log(data);
		for (var i=0; i<data.length-1; i++)
		{
			var dataTitle='<strong class="eventype" style=" color:'+colors[i]+'">'+data[i].language+'</strong>';
			if (i<data.length-2) dataTitle+=', ';
			else dataTitle+=' ';

			$("#languagesTitle").append(dataTitle);	
		}

		var dataTitle='and <strong class="eventype" style=" color:'+colors[data.length-1]+'">'+data[data.length-1].language+'</strong>.';
		$("#languagesTitle").append(dataTitle);	
	}

	function drawLanguageChart(data)
	{
		var dataArray=[];
		var categories=[];
		for (var i=0; i<data.length; i++)
		{	
			categories[i]=data[i].language;
			dataArray[i]={name:categories[i],y:data[i].count};
		}
		console.log(dataArray);
		drawPieChartWithConfig("languageChart",categories,dataArray);
	}

	function setFirstAndSecondLaunage(data)
	{
		var first=-1;
		var firstCount=0;
		for (var i=0; i<data.length; i++)
		{
			if (data.count>firstCount)
			{
				first=i;
				firstCount=data.count;
			}
		}
		$("#firstLanguage").html(firstCount);

		var second=-1;
		var secondCount=0;
		for (var i=0; i<data.length; i++)
		{
			if (data.count>secondCount && i!=firstCount)
			{
				second=i;
				secondCount=data[i].count;
			}
		}
		$("#secondLanguage").html(secondCount);
	}
</script>