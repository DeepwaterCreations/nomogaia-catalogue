﻿//So we have rows associated with rights, and columns associated with impacted individuals, and the cells should hold the values.
//We also need to reflect that this data has changed over time. 
//Tooltips: Reasons for the scores, maybe also trend over time. 
//Also, we want to filter impacted rights holders so we don't see all of them.

//index.html can hold a blank table, like for the rows table.
//We want to: Iterate over the rights list, and for each item, add a table data with the name and then a series of table datas with the values for the list of impacted rights-holders.
//We also want to listen to the appropriate data values.
//And, we'll want tool tips on the table data elements. (So they'll need title='' !)

//Add the column headings
table.tableData.columnOptions["Impacted Rights-Holders"].forEach(function (rightsholderName) {
    $("#matrixTable").find("thead").find("tr").append('<th title="">' + rightsholderName + '</th>');
});

//Add the rows
//For each right, get the list of table rows that contain that right. Iterate over the rights-holders, and for each one that the row item impacts, get the score and increment a count of scores.
//Then put the averages in the table.
table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {
    var htmlString = '<tr><th title="">' + rightName + '</th>';

    //Generate the scores and push them into the htmlString.
    var rows = table.tableData.getRows("Impacted Rights", rightName);
    table.tableData.columnOptions["Impacted Rights-Holders"].forEach(function (rightsholderName){
        var scoreCount;
        var scoreSum = 0;
        rows.forEach(function (row) {
            console.log(row);
            if (row["Impacted Rights-Holders"].indexOf(rightsholderName) > -1) {
                scoreCount++;
                console.log(row["Score"]);
                scoreSum += parseInt(row["Score"]);
            }
        });
        if (scoreSum > 0) {
            var avg = scoreSum / scoreCount;
            htmlString += '<td>' + avg + '</td>';
        }
        else
            htmlString += '<td>-</td>'
    });

    htmlString += '</tr>';
    $("#matrixTable").find("tbody").append(htmlString);

});

