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

Util.disToCenter = function (elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    //console.log(rect.bottom + " " + rect.top);
    return Math.abs( ((rect.bottom +rect.top)/2) - (viewHeight/2));
}

// takes two list
// the list are assume to have no duplcates
Util.union = function (lst1, lst2) {
    var res = [];
    for (var i = 0; i < lst1.length; i++) {
        res.push(lst1[i]);
    }
    for (var i = 0; i < lst2.length; i++) {
        if (res.indexOf(lst2[i])==-1) {
            res.push(lst2[i])
        }
    }
    return res;
}

//Util.checkVisible = function (elm) {

//    var vpH = $(window).height(), // Viewport Height
//        st = $(window).scrollTop(), // Scroll Top
//        y = $(elm).offset().top,
//        elementHeight = $(elm).height();

//    return ((y < (vpH + st)) && (y > (st - elementHeight)));
//}