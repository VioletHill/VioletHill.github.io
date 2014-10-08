---
layout: base
---

<link rel="stylesheet" href="/css/photo.css" type="text/css" />
<link rel="stylesheet" href="/css/lightbox.css" type="text/css" />

<div class="container">
	<div class="container-fluid" id="ebayPhoto">
    </div>
</div>

<script src="/js/masonry.pkgd.min.js"></script>
<script src="/js/imagesloaded.3.1.8.js"></script>
<script src="/js/lightbox.2.7.1.js"></script>
 

<script>

    var photo=[];


    var indexI=0;
    var msnry; 

    $(document).ready(function(){

       // $container.masonry('bindResize');
        var  container = document.querySelector('#ebayPhoto');
        msnry = new Masonry( container );
 
        {% for photo in site.categories.ebay_photo %}
            var photoObj={};
            photoObj.smallImage='{{ photo.smallImage }}';
            photoObj.title='{{ photo.title }}';
            photoObj.album='{{ photo.album }}';
            photoObj.largeImg=' {{photo.largeImg }} ' ;
            photo.push(photoObj);
        {% endfor %}


        loadNext(0);
    })

    function loadNext(index){

        var $imgContainer=$('<a href="'+photo[index].largeImage+'" class="box span3" data-lightbox="'+photo[index].album +'" data-title="' + photo[index].title + '"></a>');
        $imgContainer.append('<br />');
        $imgContainer.append('<img class="flowImg" src="'+photo[index].smallImage+'">');

       $imgContainer.imagesLoaded(function(){
            $('#ebayPhoto').masonry().append( $imgContainer ).masonry( 'appended', $imgContainer );  
             if (index+1<photo.length) loadNext(index+1); 
        });
    }
</script>