var noDataHTML = '<div class="nodata"><span>No Data</span><h6>Add rights, rightsholders and scores to the rows in the catalogue</h4></div>';

function getTooltipForRow(row) {
    var tooltipContent = "";
    tooltipContent += '<p class="head"><b>Topic</b> "' + row.getData("Topic") + '" <b>contributes score:</b> <span class="score ' + getScoreCategoryClass(row.getData("Score")) +'">' + row.getData("Score") + '</p>';
    tooltipContent += '<p class="body">' + (row.getData("Input") || "<i>No input</i>") + '</p>';
    return tooltipContent;
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