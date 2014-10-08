$(document).ready(function(){
	resizeLeftAndRight();
	startToShow();
	$(window).resize(function(){

		resizeLeftAndRight();
	});
});


function resizeLeftAndRight(){

	console.log("reasize");

	$leftContainer=$("#leftContainer");
	$rightContainer=$("#rightContainer");
	$container=$("#container");
	$mainDiv=$("#mainDiv");



	var top=( $mainDiv.height()-$container.height() )/ 2 ;
	$container.css({
		position:'relative',
		top:top+'px',
	});
}

function startToShow(){

}