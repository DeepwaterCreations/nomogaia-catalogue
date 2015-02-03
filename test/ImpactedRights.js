function rightHasEntries(rightName, monitorTables) {
    for (var i=0;i<monitorTables.backingData.length;i++) {
        if (monitorTables.backingData[i].tableData.getRows("Impacted Rights", rightName).length != 0) {
            return true;
        }
    }
    return false;
}

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
                if (row.getData("Module") == module) {
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

    //Add the rows
    table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {

        if (rightHasEntries(rightName,monitorTable)) {

            //add an empty row
            impactedRightsTable.find("tbody").append('<tr class="' + toClassName(rightName) + '"></tr>');
            var rowBeingAdded = impactedRightsTable.find("." + toClassName(rightName));

            // add the title row
            rowBeingAdded.append('<td class="Right">' + rightName + '</td>')

            // add the context
            var contextRows = filterRows(table.tableData.getRows("Impacted Rights", rightName), "None", true);
            rowBeingAdded.append(getCell(contextRows, toClassName(rightName) + " Context"));
            console.log("Colin", rowBeingAdded.find("." + toClassName(rightName) + ".Context"));
            rowBeingAdded.find("." + toClassName(rightName) + ".Context").tooltip({ content: getToolTip(contextRows) });

            //Add the cells
            modules.forEach(function (myModule) {

                // find the average score for the rows
                var moduleRows = filterRows(table.tableData.getRows("Impacted Rights", rightName), myModule, false);
                rowBeingAdded.append(getCell(moduleRows, toClassName(rightName) + " " + myModule));
                rowBeingAdded.find("." + toClassName(rightName) + "." + myModule).tooltip({ content: getToolTip(moduleRows) });

            });
        }
    });
}

