---
layout: base
---

<link rel="stylesheet" href="/css/home.css" type="text/css">

<hr class="videoHide">

<div class="container">

    <div class="jumbotron videoHide">
        <h2>DESIGN. CODE. BUILD. INNOVATE</h2>

        <a class="btn btn-large btn-success" href="javascript:watchTheVideo()" style="margin-top:40px">Watch The Film</a>

        <p class="lead" style="margin-top:40px">
            <em style="margin-right:2%">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</em>
            - Aristotle
        </p>
    </div>

    <div class="homeVideoDiv" style="display:none; text-align:center">
        <div class="homeVideoPlay">
            <div class="videoClose"></div>
            <video id="homeVideo" src="media/home.mp4" controls="controls" onended="videoEnd()"></video>
        </div>
    </div>
</div>
    
<hr class="videoHide">


<!--  java script code -->

<script>

function watchTheVideo(){
    $(".videoHide").fadeOut("medium",function(){
        $(".homeVideoDiv").fadeIn("medium",function(){
            var video=document.getElementById("homeVideo");
            video.load();
            video.play();
        });
        
    });
}

function videoEnd(){
    var video=document.getElementById("homeVideo");
    video.pause();
    $(".homeVideoDiv").fadeOut("medium",function(){
        $(".videoHide").fadeIn("medium");
    });
}

$(".homeDiv").ready(function(){
    $(".videoClose").click(function(){
        videoEnd();
    });
});

</script>
