$(document).ready(function() {
    var $childrens=$(".block");
    var $leftContainer=$("#leftContainer");
    var $rightContainer=$("#rightContainer");
    for (var i=0; i<$childrens.length; i++){
        var $child=$($childrens[i]);
        $child.remove();
        if ($leftContainer.height() <= $rightContainer.height() ) { 
            $leftContainer.append($child);
        } else {
            $rightContainer.append($child);
        }
    }
});