var headersList = ["Right", "impact"];

function rebuildImpactedRights() {

    var impactedRightsTable = $("#impactedRightsTable");
    //First clear what's already there.
    impactedRightsTable.empty();

    //Then, rebuild it.
    impactedRightsTable.append("<thead><tr></tr></thead>");
    impactedRightsTable.append("<tbody></tbody>");
    //Add the column headings
    headersList.forEach(function (rightsholderName) {
        impactedRightsTable.find("thead").find("tr").append('<th title="">' + rightsholderName + '</th>');
    });

    var myModule = "";

    //Add the rows
    table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {
        var rowString = '<tr class="' + rightName + '">';
        rowString += '<td>'+rightName+'</td>';
        
        //Generate the scores and push them into the htmlString.
        var rows = table.tableData.getRows("Impacted Rights", rightName);

        // if we are looking at a specific module
        // filter out all the rows not in that module
        if (myModule != "") {
            rows = rows.filter(function (row) {
                return row["Module"] == myModule;
            });
        }

        // find the average score for the rows
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
        rowString += '<td>' + average + '</td>';

        // actully add the row
        rowString += '</tr>';
        impactedRightsTable.find("tbody").append(rowString);
    });
}