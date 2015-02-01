//So we have rows associated with rights, and columns associated with impacted individuals, and the cells should hold the values.
//We also need to reflect that this data has changed over time. 
//Tooltips: Reasons for the scores, maybe also trend over time. 
//Also, we want to filter impacted rights holders so we don't see all of them.

//index.html can hold a blank table, like for the rows table.
//We want to: Iterate over the rights list, and for each item, add a table data with the name and then a series of table datas with the values for the list of impacted rights-holders.
//We also want to listen to the appropriate data values.
//And, we'll want tool tips on the table data elements. (So they'll need title='' !)

//Also, this monitor business. 
//I need to populote the dripdown.

function Matrix() {
    this.rebuild = function (monitor) {
        //First clear what's already there.
        $("#matrixTable").empty();

        //Then, rebuild it.
        $("#matrixTable").append("<thead><tr><th></th></tr></thead>"); //Contains a blank <th> so there's space for a column of row names.
        $("#matrixTable").append("<tbody></tbody>");
        //Add the column headings
        table.tableData.columnOptions["Impacted Rights-Holders"].forEach(function (rightsholderName) {
            $("#matrixTable").find("thead").find("tr").append('<th title="">' + rightsholderName + '</th>');
        });

        //Add the rows
        //For each right, get the list of table rows that contain that right. Iterate over the rights-holders, and for each one that the row item impacts, get the score and increment a count of scores.
        //Then put the averages in the table.
        table.tableData.columnOptions["Impacted Rights"].forEach(function (rightName) {
            $("#matrixTable").find("tbody").append('<tr class="' + rightName + '"></tr>');
            $("#matrixTable").find("tbody").find('tr').last().append('<th title="">' + rightName + '</th>');

            //Generate the scores and push them into the htmlString.
            var rows = table.tableData.getRows("Impacted Rights", rightName);
            //We won't need rows that don't match the selected monitor.
            console.log("Monitor is " + monitor);
            if (monitor) {
                rows = rows.filter(function (row) {
                    return ("Monitor" in row) && (row["Monitor"] === monitor);
                });
            }
            //If a row doesn't have rights-holders associated with it, we don't have a use for it, so filter them out.
            rows = rows.filter(function (row) {
                return "Impacted Rights-Holders" in row;
            });
            table.tableData.columnOptions["Impacted Rights-Holders"].forEach(function (rightsholderName) {
                var scoreCount = 0;
                var scoreSum = 0;
                var tooltipContent = "";
                rows.forEach(function (row) {
                    if (row["Impacted Rights-Holders"].indexOf(rightsholderName) > -1) {
                        scoreCount++;
                        scoreSum += parseInt(row["Score"]);
                        //Generate tooltip text displaying a title and the issue.
                        tooltipContent += '<b>' + row["Topic"] + '</b>';
                        tooltipContent += '<p>' + row["Input"] + '</p>';
                        //TODO: Also put in the individual score values, and maybe color-coding?
                    }
                });
                if (scoreCount > 0) {
                    var avg = scoreSum / scoreCount;
                    $("#matrixTable").find("tbody").find('tr').last().append('<td title="" class="' + rightsholderName + '">' + avg + '</td>');
                    //Also add a tooltip.
                    $("#matrixTable").find("tbody").find('tr').last().children().last().tooltip({ content: tooltipContent });
                    //TODO: Style with CSS? Somehow these need color-coded backgrounds, right?
                }
                else
                    $("#matrixTable").find("tbody").find('tr').last().append('<td class="' + rightsholderName + '">-</td>');
            });
        });
    };

    //TODO: Hook this up to the MonitorTabsUI stuff.
    this.addMonitorTabEvent = function (id, count) {
        var tableTemplate = '<table id="matrixTable' + count + '" border="1"><thead><tr><th></th></tr></thead><tbody></tbody></table>';
        $("#monitorTabs").find('#' + id, 'div').append(tableTemplate);
        //monitorTabs.append('<div id="' + id + '">' + tableTemplate + '</div>');
    };

    monitorTabs.addTabsDiv("monitorTabs", this.addMonitorTabEvent);
}
var matrix = new Matrix();

//Tablogic:
//Each new tab will build a new matrix. The build function should take monitor as an argument. Switching tabs, I guess, should also rebuild.
//This is slow and ugly, though.
//But I don't really see a good alternative. I'll have to iterate through the whole table just to change the values anyway. ...right?

//var monitorTabs = $("#monitorTabs").tabs();


//function addTab() {
//    var label = "New Tab";
//    var count = tabCount();
//    var id = "newTab" + count;
//    var liString = '<li><a href="#' + id + '">' + label + '</a></li>';
//    $("#addMonitorTabli").before(liString);

//    var tableTemplate = '<table id="matrixTable' + count + '" border="1"><thead><tr><th></th></tr></thead><tbody></tbody></table>'
//    monitorTabs.append('<div id="' + id + '">' + tableTemplate + '</div>');
//    monitorTabs.tabs("refresh");
//    return count;
//}
//$("#addMonitorTabli").on("click", function () {
//    monitorTabs.tabs("option", "active", addTab());
//});

//TODO: It might be overkill, but I could give the monitor tabs some booleans to let them not rebuild more than once when the data hasn't changed. 