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



//Rounding.
Number.prototype.decRound = function (places) {
    var dec = Math.pow(10,places);
    return Math.round(this.valueOf() * dec) / dec;
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

//Call this when data has changed or when a new monitor is made visible.
function setVisualizationsDirty() {
    impactedRights_dirty = true;
    matrix.dirty = true;
}

//Returns true if there is a row for which the specified right/rightsholder is one of the data items.  
function rightHasEntries(rightName) {
    for (var i = 0; i < monitorTables.backingData.length; i++) {
        if (monitorTables.backingData[i].tableData.getRowsWithScore("Impacted Rights", rightName).length != 0) {
            return true;
        }
    }
    return false;
}

function rightsholderHasEntries(rightsholderName) {
    for (var i = 0; i < monitorTables.backingData.length; i++) {
        if (monitorTables.backingData[i].tableData.getRowsWithScore("Impacted Rights-Holders", rightsholderName).length != 0) {
            return true;
        }
    }
    return false;
}

function generateHTMLout(javascript, css, html) {
    return '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8" /><script>' + javascript + '</script><style>'+css+'</style><title></title></head><body>' + html+'</body></html>';
}