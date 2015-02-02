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

function getToolTip(rows) {

    var tooltipContent = "";
    rows.forEach(function (row) {

        tooltipContent += '<b>' + row["Topic"] + ': '+ row["Score"]+ '</b>';
        tooltipContent += '<p>' + row["Input"] + '</p>';
    });

    return tooltipContent;
}

function getCell(myRows, classes) {
    return '<td class="' + classes + '">' + getAverage(myRows) + '</td>';
}

function rebuildImpactedRights(monitorTable) {

    var table = monitorTable.backingData[0];

    var impactedRightsTable = $("#impactedRightsTable");
    //First clear what's already there.
    impactedRightsTable.empty();

    //Then, rebuild it.
    impactedRightsTable.append("<thead></thead>");
    impactedRightsTable.append("<tbody></tbody>");
    //Add the column headings

    var headersList1 = ["", "Context"];
    var headersList2 = ["Right"];
    for (var i = 0; i < monitorTable.backingData.length; i++) {
        headersList2.push(i + "");
    }
    var headerWidths = { "Right": 1, "Context": monitorTable.backingData.length}

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
            headersList1.push(module);
            headerWidths[module + ""] = monitorTable.backingData.length;
            for (var i = 0; i < monitorTable.backingData.length; i++) {
                headersList2.push(i + "");
            }
        }
    })

    //Add the first row of headers
    var headerString1 = "<tr>"
    headersList1.forEach(function (header) {
        headerString1 += '<th title="">' + header + '</th>';
    });
    headerString1 += "</tr>";
    impactedRightsTable.find("thead").append(headerString1);

    //Add the second row of headers
    var headerString2 = "<tr>"
    headersList2.forEach(function (header) {
        headerString2 += '<th title="">' + header + '</th>';
    });
    headerString2 += "</tr>";
    impactedRightsTable.find("thead").append(headerString2);

    //Add the rows
    table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {

        // string Context/Module: {Monitor"+i : tooltip }
        var toolTips = {}

        if (table.tableData.getRows("Impacted Rights", rightName).length != 0) {

            var rowString = '<tr class="' + rightName + '">';

            // add the name
            rowString += '<td>' + rightName + '</td>';

            // add the context
            for (var i = 0; i < monitorTable.backingData.length; i++) {
                var myRows = filterRows(monitorTable.backingData[i].tableData.getRows("Impacted Rights", rightName), "None", true);
                if ("Context" in toolTips) {
                    toolTips["Context"]["Monitor" + i] = getToolTip(myRows);
                } else {
                    toolTips["Context"] = {};
                    toolTips["Context"]["Monitor" + i] = getToolTip(myRows);
                }
                rowString += getCell(myRows, rightName + " Monitor"+i + " Context");
            }
            
            //Add the cells
            modules.forEach(function (myModule) {

                // find the average score for the rows
                // add the context
                for (var i = 0; i < monitorTable.backingData.length; i++) {
                    var myRows = filterRows(monitorTable.backingData[i].tableData.getRows("Impacted Rights", rightName), myModule, false);
                    if (myModule + "" in toolTips) {
                        toolTips[myModule+""]["Monitor" + i] = getToolTip(myRows);
                    } else {
                        toolTips[myModule + ""] = {};
                        toolTips[myModule + ""]["Monitor" + i] = getToolTip(myRows);
                    }
                    rowString += getCell(myRows, rightName + " Monitor" + i + " " + myModule);
                }
                
            });
            // actully add the row
            rowString += '</tr>';
            impactedRightsTable.find("tbody").append(rowString);

            console.log("Colin", toolTips);
            // now we need to add all the tool tips
            for (var module in toolTips) {
                for (var monitor in toolTips[module]) {
                    impactedRightsTable.find("." + module + " ." + monitor).tooltip({ content: toolTips[module][monitor] });
                }
            }
        }
    });
}

