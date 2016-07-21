var impactedRights_dirty = true; //Should be true whenever visible data has been changed and the table hasn't been rebuilt yet. //Colin, is there a better place for this to live?  

// context is true or false
function filterRows(rows, context) {
    rows = rows.filter(function (row) {
        return (row.getData("Catalog") == "Context") == context;
    });

    return rows;
}

function getAverage(rows) {
    var count = 0;
    var sum = 0;
    rows.forEach(function (row) {
        if (row.getData("Score") != DataOptions.getDefaultValue("Score")) {
        count++;
        sum += parseInt(row.getData("Score"));
        }
    });
    var average = 0;
    if (count != 0) {
        average = sum / count;
    } else {
        average="-"
    }

    return average;
}

// return zero for rows with no impact
function getAbsSumSort(rows) {
    var sum = 0;
    rows.forEach(function (row) {
        if (row.getData("Score") != DataOptions.getDefaultValue("Score")) {
        sum += Math.abs(row.getData("Score"));
        }
    });
    return sum;
}

function getFullToolTip(rows) {

    var tooltipContent = "";
    rows.forEach(function (row) {
        tooltipContent += getTooltipForRow(row);
    });

    if (tooltipContent == "") {
        tooltipContent = "No entires";
    }

    return tooltipContent;
}

function getCell(myRows, classes) {
    var avg = getAverage(myRows);
    if (typeof avg == "number")
        avg = avg.decRound(2);
    return '<td title="" class="' + classes + '">' + avg + '</td>';
}

function addMonitorTabsToImpactedRights(monitorTables) {
    //var that = this;
    var changeIRMonitorTabEvent = function (index) {
        rebuildImpactedRights(monitorTables, index)
    }

    this.divID = "impactedRightsMonitorTabs"

   monitorTabs.addFunctions({
       changeTab: changeIRMonitorTabEvent
   });
}

function rebuildImpactedRights(monitorTable, index) {

    if (!impactedRights_dirty)
        return;

    var table = monitorTable.backingData[index];

    var impactedRightsTable = $("#impactedRightsTable");
    //First clear what's already there.
    impactedRightsTable.empty();
    $("#" + this.divID + " .nodata").remove();

    //Then, rebuild it.
    impactedRightsTable.append("<thead></thead>");
    impactedRightsTable.append("<tbody></tbody>");
    
    //Add the column headings
    var headersList = ["", "Context", "Impact"];

    var allRights = DataOptions.getColumnOptions("Impacted Rights");

    var impactedRights = [];

    // we are not interested in rights with no entiries
    allRights.forEach(function (rightName) {
        if (rightHasEntries(rightName, monitorTable)) {
            impactedRights.push(rightName);
        }
    });

    //If there aren't any impacted rights, display "NO DATA"
    if (impactedRights.length === 0) {
        $("#" + this.divID).append(noDataHTML);
        return;
    }

    //Add the first row of headers
    var headerString = "<tr>"
    headersList.forEach(function (header) {
        var columnID = "";
        if (header)
            columnID = 'id = "' + getColumnHeadID(header) + '"';
        headerString += '<th title="" ' + columnID + ' class="columnHeader">' + header + '</th>';
    });
    headerString += "</tr>";
    impactedRightsTable.find("thead").append(headerString);

    //sort the rows by most impacted
    //TODO we should abs?
    //TODO this is really slow
    impactedRights.sort(function (rightA, rightB) {
        var rightARows = filterRows(monitorTable.getNewestMonitorData().tableData.getRowsWithScore("Impacted Rights", rightA), "", false);
        var rightBRows = filterRows(monitorTable.getNewestMonitorData().tableData.getRowsWithScore("Impacted Rights", rightB), "", false);
        var diff = getAbsSumSort(rightBRows) - getAbsSumSort(rightARows);
        if (diff != 0) {
            return diff;
        } else {
            var innerRightARows = filterRows(monitorTable.getNewestMonitorData().tableData.getRowsWithScore("Impacted Rights", rightA), "", true);
            var innerRightBRows = filterRows(monitorTable.getNewestMonitorData().tableData.getRowsWithScore("Impacted Rights", rightB), "", true);
            return getAbsSumSort(innerRightBRows) - getAbsSumSort(innerRightARows);
        }
    });
    
    //Generates and adds a cell for a given row and column to the impact ratings table.
    //row is the DOM element to which this cell is being added.
    //rightName is the name of the right this row represents.
    //columnHeadName is the string indicating which column the cell goes in. Currently, will be either "Context" or "Impact".  
    var addCellForRight = function(row, rightName, columnHeadName){
        var isContext = columnHeadName === "Context";
        var columnRows = filterRows(table.tableData.getRowsWithScore("Impacted Rights", rightName), isContext);
        var moduleClass = (columnHeadName === "Impact" ? "None" : columnHeadName);

        row.append(getCell(columnRows, toClassName(rightName) + " " + moduleClass));
        var cell = row.find("." + toClassName(rightName) + "." + moduleClass);
        cell.tooltip({ content: getFullToolTip(columnRows) });
        cell.on("tooltipopen", function (scoreCategoryClass) {
            return function (event, ui) {
                ui.tooltip.addClass(scoreCategoryClass);
            }
        }(getScoreCategoryClass(getAverage(columnRows))));
        cell.addClass(getScoreCategoryClass(getAverage(columnRows)));
        cell.addClass("hasToolTip");
        cell.hover(function (event) {
            //On mouse hover, give the column header a class.
            $('#' + getColumnHeadID(columnHeadName)).addClass("hoveredColumn");
        },
        function (event) {
            //On mouse hover end, remove the class.
            $('#' + getColumnHeadID(columnHeadName)).removeClass("hoveredColumn");
        }
        );
    };

    impactedRights.forEach(function (rightName) {
        // add an empty row
        impactedRightsTable.find("tbody").append('<tr class="' + toClassName(rightName) + '"></tr>');
        var rowBeingAdded = impactedRightsTable.find("." + toClassName(rightName));

        // add the title row
        rowBeingAdded.append('<th class="Right, rowHeader">' + rightName + '</th>')

        // add the context cell for this right
        addCellForRight(rowBeingAdded, rightName, "Context");

        //Add the non-context cell for this right
        addCellForRight(rowBeingAdded, rightName, "Impact");
    });


    impactedRights_dirty = false;
}

//Returns the table as an HTML string.
function generateImpactRatingsString(){
    return document.getElementById("impactedRightsTable").outerHTML;    
}

//Export HTML button functionality
$('#export-impactratings-button').click(function () {
    var fileDialog = $("#export-impactratings-dialog");
    var HTMLbody = generateImpactRatingsString();
    exportViewToHTML(fileDialog, HTMLbody);
});

