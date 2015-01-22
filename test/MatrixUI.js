//So we have rows associated with rights, and columns associated with impacted individuals, and the cells should hold the values.
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
table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {
    $("#matrixTable").find("tbody").append('<tr><th title="">' + rightName + '</th></tr>');
});