window.onload = function(){
    // public variables
    var vLetter = '"We are what we repeatedly do. Excellence, then, is not an act, but a habit."';

    var pen="<img id='penImg' src='images/pen.gif' style='position:absolute; left:0px; top:0px; display:none' />";
 

    $("#quote").html("");
    $(".videoHide").append(pen);

    for (var i=0; i<vLetter.length; i++) {
        var span='<span style="opacity:0">'+vLetter[i]+'</span>';
        $("#quote").append(span);
    }

    var childrens=$("#quote").find("span");


    var letterIndex=0;
    var doStep = function () {
        // current char
        if (letterIndex>=childrens.length) {
            writeEnd();
            return ;
        }

        var offset=$(childrens[letterIndex]).offset();

        $("#penImg").css({
            display:"block",
            top:offset.top+10+"px",
            left:offset.left+"px",
        });

        $(childrens[letterIndex++]).css({
            opacity:"1"
        });
        
        // next step
        setTimeout(doStep, 50);
    }

    var writeEnd=function() {
        $("#penImg").remove();
        $("#quoteAuthor").delay(500).animate({opacity:1},"3000") ;
    }

    setTimeout(doStep, 2000);


};