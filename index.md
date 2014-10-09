---
layout: base
---

<link rel="stylesheet" href="/css/home.css" type="text/css">
<script src="/js/write.js"></script>


<div class="container">

    <div class="jumbotron videoHide">
        <h2 id="hint">DESIGN. CODE. BUILD. INNOVATE</h2>

        <a id="watchBtn" class="btn btn-large btn-success" href="javascript:watchTheVideo()" style="margin-top:60px">Watch The Film</a>

        <p class="lead" style="margin-top:60px;" id="leadQuote">
            <em  id="quote" style="margin-right:2%"></em>
            <span id="quoteAuthor" style="opacity:0">- Aristotle</span>
        </p>
    </div>

    <div class="homeVideoDiv" style="display:none; text-align:center">
        <div class="homeVideoPlay">
            <div class="videoClose"></div>
            <video id="homeVideo" src="media/wwdc_start.mov" style="width:90%; max-width:900px" controls="controls" onended="videoEnd()"></video>
        </div>
    </div>
</div>
    
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
