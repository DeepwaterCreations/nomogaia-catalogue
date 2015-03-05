var impactedRights_dirty = true; //Should be true whenever visible data has been changed and the table hasn't been rebuilt yet. //Colin, is there a better place for this to live?  

// context is true or false
function filterRows(rows, module, context) {
    // if we are looking at a specific module
    // filter out all the rows not in that module
    if (module != "") {
        rows = rows.filter(function (row) {
            return row.getData("Module") == module;
        });
    }

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
        average = (sum / count).decRound(2);
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
    return '<td title="" class="' + classes + '">' + getAverage(myRows) + '</td>';
}

function addMonitorTabsToImpactedRights(monitorTables) {
    //var that = this;
    var changeIRMonitorTabEvent = function (index) {
        console.log("Colin - changeIRMonitorTabEvent index:" + index);
        rebuildImpactedRights(monitorTables, index)
    }

    this.divID = "impactedRightsMonitorTabs"

   monitorTabs.addFunctions({
       changeTab: changeIRMonitorTabEvent
   });
}

function rebuildImpactedRights(monitorTable, index) {
    console.log("Colin - rebuildImpactedRights");

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

    var headersList = ["", "Context"];

    var moduleIsUsed = function (module) {
        for (var j = 0; j < monitorTable.backingData.length; j++) {
            var myTable = monitorTable.backingData[j];
            for (var i = 0; i < myTable.tableData.rows.length; i++) {
                var row = myTable.tableData.rows[i];
                if (row.getData("Module") == module && row.getData("Catalog") != "Context" && row.getData("Score") != undefined && row.getData("Impacted Rights") != DataOptions.getDefaultValue("Impacted Rights")) {
                    console.log("Colin - passed! ", row);
                    return true;
                }
            }
        }
        return false;
    }

    var modules = []

    table.owner.dataOptions.getColumnOptions("Module").forEach(function (module) {
        if (moduleIsUsed(module)) {
            modules.push(module);
            headersList.push(module);
        }
    })

    //Sort the right from most to least impacted

    var allRights = table.owner.dataOptions.getColumnOptions("Impacted Rights");

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
        headerString += '<th title="" ' + columnID + ' class="columnHeader">' + (header == "None" ? "Impact" : header) + '</th>';
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

    impactedRights.forEach(function (rightName) {

        // add an empty row
        impactedRightsTable.find("tbody").append('<tr class="' + toClassName(rightName) + '"></tr>');
        var rowBeingAdded = impactedRightsTable.find("." + toClassName(rightName));

        // add the title row
        rowBeingAdded.append('<th class="Right, rowHeader">' + rightName + '</th>')

        // add the context
        var contextRows = filterRows(table.tableData.getRowsWithScore("Impacted Rights", rightName), "None", true);
        rowBeingAdded.append(getCell(contextRows, toClassName(rightName) + " Context"));
        var cell = rowBeingAdded.find("." + toClassName(rightName) + ".Context");
        cell.tooltip({ content: getFullToolTip(contextRows) });
        cell.on("tooltipopen", function (scoreCategoryClass) {
            return function (event, ui) {
                ui.tooltip.addClass(scoreCategoryClass);
            }
        }(getScoreCategoryClass(getAverage(contextRows))));
        cell.addClass(getScoreCategoryClass(getAverage(contextRows)));
        cell.hover(function (event) {
                //On mouse hover, give the column header a class.
                $('#' + getColumnHeadID("Context")).addClass("hoveredColumn"); //TODO: Maybe "Context" shouldn't be hard-coded.
            },
            function (event) {
                //On mouse hover end, remove the class.
                $('#' + getColumnHeadID("Context")).removeClass("hoveredColumn");
            }
        );

        //Add the cells
        modules.forEach(function (myModule) {
            // find the average score for the rows
            var moduleRows = filterRows(table.tableData.getRowsWithScore("Impacted Rights", rightName), myModule, false);
            rowBeingAdded.append(getCell(moduleRows, toClassName(rightName) + " " + myModule));
            var cell = rowBeingAdded.find("." + toClassName(rightName) + "." + myModule);
            cell.tooltip({ content: getFullToolTip(moduleRows) });
            cell.on("tooltipopen", function (scoreCategoryClass) {
                return function (event, ui) {
                    ui.tooltip.addClass(scoreCategoryClass);
                }
            }(getScoreCategoryClass(getAverage(moduleRows))));
            cell.addClass(getScoreCategoryClass(getAverage(moduleRows)));
            cell.hover(function (event) {
                    //On mouse hover, give the column header a class.
                    $('#' + getColumnHeadID(myModule)).addClass("hoveredColumn");
                },
                function (event) {
                    //On mouse hover end, remove the class.
                    $('#' + getColumnHeadID(myModule)).removeClass("hoveredColumn");
                }
            );
        });
    });
    impactedRights_dirty = false;
}

