function Util() { }


Util.checkVisible = function(elm, threshold) {
    threshold = threshold || 0;

    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    console.log(rect.bottom + " " + rect.top);
    var above = rect.bottom + threshold < 0;
    var below = rect.top - threshold >= viewHeight;

    return !above && !below;
}