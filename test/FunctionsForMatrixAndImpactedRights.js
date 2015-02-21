var noDataHTML = '<div class="nodata"><span>No Data</span><h6>Add rights, rightsholders and scores to the rows in the catalogue</h4></div>';

function getTooltipForRow(row) {
    var tooltipContent = "";
    tooltipContent += '<b>Topic "' + row.getData("Topic") + '" contributes score: ' + row.getData("Score") + '</b>';
    tooltipContent += '<p>' + (row["Input"] || "<i>No input</i>") + '</p>';
    return tooltipContent;
}

function addScoreCategoryClass(element, score) {
    if (score <= -12) {
        element.addClass("terrible");
    } else if (score <= -.5) {
        element.addClass("bad");
    } else if (score < .5) {
        element.addClass("okay");
    } else if (score < 12) {
        element.addClass("good");
    } else if (score >= 12) {
        element.addClass("great");
    }
    return element;
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

function getRowID(rightName) {
    var idString = "row" + rightName.stripNonAlphanumeric(); 
    return idString;
}

function getDataCellClass(rightName, rightsholderName) {
    var returnVal = {};
    returnVal.rowClass = "row" + rightName.stripNonAlphanumeric() + "Data";
    returnVal.colClass = "column" + rightsholderName.stripNonAlphanumeric() + "Data";
    return returnVal;
}

function toClassName(column) {
    return column.stripNonAlphanumeric();
}