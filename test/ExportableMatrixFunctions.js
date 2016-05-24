// when this is exported g might not be defined for it
// lets be safe
if (g === undefined) {
    var g = {};
}


g.emf = {};

//g.emf.onMouseEnter = function (target) {
//    var element = document.getElementById(getColumnHeadID(target.dataset.rightsholdername));
//    element.className += " hoveredColumn";
//}

//g.emf.onMouseExit = function (target) {
//    var element = document.getElementById(getColumnHeadID(target.dataset.rightsholdername));
//    var classes = element.className.split(' ');
//    var newClasses = "";
//    for (var i = 0; i < classes.length; i++) {
//        var currentClass = classes[i];
//        if (currentClass !== "hoveredColumn" && currentClass != "") {
//            newClasses += currentClass;
//            if (i != classes.length - 1) {
//                newClasses += " ";
//            }
//        }
//    }
//    element.className = newClasses;
//}


g.emf.setToolTips = function () {
    var hasToolTips = $(".hasToolTip");
    for (var i = 0; i < hasToolTips.length; i++) {
        var current = hasToolTips[i];
        $(current).tooltip({ content: decodeURI(current.dataset.tooltip) });
        $(current).on("tooltipopen", function (scoreCategoryClass) {
            return function (event, ui) {
                ui.tooltip.addClass(scoreCategoryClass);
            }
        }(getScoreCategoryClass(parseInt(current.dataset.score))));
    }

    var cells = $(".analytics-cell");
    cells.each(function (i, cell) {
        $(cell).hover(function (event) {
            //On mouse hover, give the column header a class.
            $('#' + getColumnHeadID(cell.dataset.rightsholdername)).addClass("hoveredColumn");
        },
            function (event) {
                //On mouse hover end, remove the class.
                $('#' + getColumnHeadID(cell.dataset.rightsholdername)).removeClass("hoveredColumn");
            });
    });
}

//Adds a function to ALL STRINGS EVERYWHERE ALWAYS that returns a copy stripped of all non-alphanumeric characters. 
String.prototype.stripNonAlphanumeric = function () {
    return this.replace(/\W/g, "");
}

//TODO: These are ugly.
//I'm not actually sure what, if anything, we can do about that.
function getColumnHeadID(columnName) {
    var idString = "column" + columnName.stripNonAlphanumeric();
    return idString;
}

function getScoreCategoryClass(score) {
    if (score <= -12) {
        return "terrible";
    } else if (score <= -.5) {
        return "bad";
    } else if (score < .5) {
        return "okay";
    } else if (score < 12) {
        return "good";
    } else if (score >= 12) {
        return "great";
    }
}