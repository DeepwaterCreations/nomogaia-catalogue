function Util() { }


Util.checkVisible = function(elm, threshold) {
    threshold = threshold || 0;

    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    //console.log(rect.bottom + " " + rect.top);
    var above = rect.bottom + threshold < 0;
    var below = rect.top - threshold >= viewHeight;

    return !above && !below;
}

//Util.checkVisible = function (elm) {

//    var vpH = $(window).height(), // Viewport Height
//        st = $(window).scrollTop(), // Scroll Top
//        y = $(elm).offset().top,
//        elementHeight = $(elm).height();

//    return ((y < (vpH + st)) && (y > (st - elementHeight)));
//}