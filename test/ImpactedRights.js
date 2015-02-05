function rightHasEntries(rightName, monitorTables) {
    for (var i = 0; i < monitorTables.backingData.length; i++) {
        if (monitorTables.backingData[i].tableData.getRows("Impacted Rights", rightName).length != 0) {
            return true;
        }
    }
    return false;
}

function getBackGroundColor(score) {
    if (score <= -12) {
        return "#FF0000"; //Red
    } else if (score <= -.5) {
        return "#FF9933"; //Orange
    } else if (score < .5) {
        return "#FFFF33"; //Yellow
    } else if (score < 12) {
        return "#66FF99"; //Green
    } else {
        return "#52A4FF"; //Blue
    }
}

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
        count++;
        sum += parseInt(row["Score"]);
    });
    var average = 0;
    if (count != 0) {
        average = sum / count;
    }

    return average;
}

function toClassName(column) {
    return column.replace(/ /g, '_');
}

function getToolTip(rows) {

    var tooltipContent = "";
    rows.forEach(function (row) {

        tooltipContent += '<b>' + row["Topic"] + ': ' + row["Score"] + '</b>';
        if (row["Input"] != undefined) {
            tooltipContent += '<p>' + row["Input"] + '</p>';
        } else {
            tooltipContent += '<br>';
        }
    });

    if (tooltipContent == "") {
        tooltipContent = "No entires";
    }

    return tooltipContent;
}

function getCell(myRows, classes) {
    return '<td title="" class="' + classes + '">' + getAverage(myRows) + '</td>';
}

function rebuildImpactedRights(monitorTable, index) {

    var table = monitorTable.backingData[index];

    var impactedRightsTable = $("#impactedRightsTable");
    //First clear what's already there.
    impactedRightsTable.empty();

    //Then, rebuild it.
    impactedRightsTable.append("<thead></thead>");
    impactedRightsTable.append("<tbody></tbody>");
    //Add the column headings

    var headersList = ["Right", "Context"];


    var moduleIsUsed = function (module) {
        for (var j = 0; j < monitorTable.backingData.length; j++) {
            var myTable = monitorTable.backingData[j];
            for (var i = 0; i < myTable.tableData.rows.length; i++) {
                var row = myTable.tableData.rows[i];
                if (row.getData("Module") == module && row.getData("Catalog") != "Context" && row.getData("Score") != undefined && row.getData("Score") != "UNINITIALIZED") {
                    console.log("Colin - passed! ", row);
                    return true;
                }
            }
        }
        return false;
    }

    var modules = []

    table.tableData.getColumnOptions("Module").forEach(function (module) {
        if (moduleIsUsed(module)) {
            modules.push(module);
            headersList.push(module);
        }
    })

    //Add the first row of headers
    var headerString = "<tr>"
    headersList.forEach(function (header) {
        headerString += '<th title="">' + header + '</th>';
    });
    headerString += "</tr>";
    impactedRightsTable.find("thead").append(headerString);

    //Sort the right from most to least impacted

    var allRights = table.tableData.columnOptions["Impacted Rights"];

    var impactedRights = [];

    // we are not interested in rights with no entiries
    allRights.forEach(function (rightName) {
        if (rightHasEntries(rightName, monitorTable)) {
            impactedRights.push(rightName);
        }
    });

    //sort the rows by most impacted
    //TODO we are currently using the first table, would it be better to use the newest?
    impactedRights.sort(function (rightA, rightB) {
        var rightARows = filterRows(monitorTable.backingData[0].tableData.getRows("Impacted Rights", rightA), "", false);
        var rightBRows = filterRows(monitorTable.backingData[0].tableData.getRows("Impacted Rights", rightB), "", false);
        var diff = getAverage(rightBRows) - getAverage(rightARows);
        if (diff != 0) {
            return diff;
        } else {
            var innerRightARows = filterRows(monitorTable.backingData[0].tableData.getRows("Impacted Rights", rightA), "", true);
            var innerRightBRows = filterRows(monitorTable.backingData[0].tableData.getRows("Impacted Rights", rightB), "", true);
            return getAverage(innerRightBRows) - getAverage(innerRightARows);
        }
    });

    impactedRights.forEach(function (rightName) {

        //add an empty row
        impactedRightsTable.find("tbody").append('<tr class="' + toClassName(rightName) + '"></tr>');
        var rowBeingAdded = impactedRightsTable.find("." + toClassName(rightName));

        // add the title row
        rowBeingAdded.append('<td class="Right">' + rightName + '</td>')

        // add the context
        var contextRows = filterRows(table.tableData.getRows("Impacted Rights", rightName), "None", true);
        rowBeingAdded.append(getCell(contextRows, toClassName(rightName) + " Context"));
        console.log("Colin", rowBeingAdded.find("." + toClassName(rightName) + ".Context"));
        var cell = rowBeingAdded.find("." + toClassName(rightName) + ".Context");
        cell.tooltip({ content: getToolTip(contextRows) });
        cell.css("background-color", getBackGroundColor(getAverage(contextRows)));

        //Add the cells
        modules.forEach(function (myModule) {

            // find the average score for the rows
            var moduleRows = filterRows(table.tableData.getRows("Impacted Rights", rightName), myModule, false);
            rowBeingAdded.append(getCell(moduleRows, toClassName(rightName) + " " + myModule));
            var cell = rowBeingAdded.find("." + toClassName(rightName) + "." + myModule);
            cell.tooltip({ content: getToolTip(moduleRows) });
            cell.css("background-color", getBackGroundColor(getAverage(moduleRows)));
        });
    });
}

