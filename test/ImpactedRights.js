function getAverage(rows, module) {
    // if we are looking at a specific module
    // filter out all the rows not in that module
    if (module != "") {
        rows = rows.filter(function (row) {
            return row.getData("Module") == module;
        });
    }

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

function rebuildImpactedRights(monitorTable) {

    var table = monitorTable.backingData[0];

    var impactedRightsTable = $("#impactedRightsTable");
    //First clear what's already there.
    impactedRightsTable.empty();

    //Then, rebuild it.
    impactedRightsTable.append("<thead></thead>");
    impactedRightsTable.append("<tbody></tbody>");
    //Add the column headings

    var headersList1 = ["Right"];//"context", "impact"

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
        }
    })

    //Add the first row of headers
    var headerString = "<tr>"
    headersList1.forEach(function (rightsholderName) {
        headerString += '<th title="">' + rightsholderName + '</th>';
    });
    headerString += "</tr>";
    impactedRightsTable.find("thead").append(headerString);

    //Add the rows
    table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {
        if (table.tableData.getRows("Impacted Rights", rightName).length != 0) {

            var rowString = '<tr class="' + rightName + '">';

            // add the name
            rowString += '<td>' + rightName + '</td>';

            // add the 
            rowString += '<td>' + rightName + '</td>';
            //Add the cells
            modules.forEach(function (myModule) {

                // find the average score for the rows
                var average = getAverage(table.tableData.getRows("Impacted Rights", rightName), myModule);
                rowString += '<td>' + average + '</td>';
            });
            // actully add the row
            rowString += '</tr>';
            impactedRightsTable.find("tbody").append(rowString);
        }
    });
}