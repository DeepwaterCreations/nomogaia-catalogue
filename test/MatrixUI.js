//So we have rows associated with rights, and columns associated with impacted individuals, and the cells should hold the values.
//We also need to reflect that this data has changed over time. 
//Tooltips: Reasons for the scores, maybe also trend over time. 
//Also, we want to filter impacted rights holders so we don't see all of them.

//index.html can hold a blank table, like for the rows table.
//We want to: Iterate over the rights list, and for each item, add a table data with the name and then a series of table datas with the values for the list of impacted rights-holders.
//We also want to listen to the appropriate data values.
//And, we'll want tool tips on the table data elements. (So they'll need title='' !)


function Matrix() {

    this.divID = "matrixMonitorTabs";

    this.matrixTablePrefix = "matrixTable";

    //We need to know which table we're rebuilding in the function.
    //We also don't want to do this unless something has legitimately changed.
    //Maybe I want a monitor data structure lurking behind the UI that can keep track of such things?
    this.rebuild = function (monitor) {
        var matrixTableID = this.matrixTablePrefix + monitor;

        if (!monitorTables.backingData[monitor]) {
            console.log("ERROR: Monitor " + monitor + " is undefined.");
            return undefined;
        }
        var data = monitorTables.backingData[monitor].tableData;

        //First clear what's already there.
        $("#" + matrixTableID).empty();

        //Then, rebuild it.
        $("#" + matrixTableID).append("<thead><tr><th></th></tr></thead>"); //Contains a blank <th> so there's space for a column of row names.
        $("#" + matrixTableID).append("<tbody></tbody>");
        //Add the column headings
        data.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
            $("#" + matrixTableID).find("thead").find("tr").append('<th title="">' + rightsholderName + '</th>');
        });

        //Add the rows
        //For each right, get the list of table rows that contain that right. Iterate over the rights-holders, and for each one that the row item impacts, get the score and increment a count of scores.
        //Then put the averages in the table.
        data.getColumnOptions("Impacted Rights").forEach(function (rightName) {
            $("#" + matrixTableID).find("tbody").append('<tr class="' + rightName + '"></tr>');
            $("#" + matrixTableID).find("tbody").find('tr').last().append('<th title="">' + rightName + '</th>');

            //Generate the scores and push them into the htmlString.
            var rows = data.getRows("Impacted Rights", rightName);
            data.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
                var scoreCount = 0;
                var scoreSum = 0;
                var tooltipContent = "";
                rows.forEach(function (row) {
                    if (row.getData("Impacted Rights-Holders").indexOf(rightsholderName) > -1) {
                        scoreCount++;
                        scoreSum += parseInt(row.getData("Score"));
                        //Generate tooltip text displaying a title and the issue.
                        tooltipContent += '<b>' + row.getData("Topic") + ': '+ row.getData("Score")+ '</b>';
                        tooltipContent += '<p>' + row["Input"] + '</p>';
                        //TODO: Also put in the individual score values, and maybe color-coding?
                    }
                });
                if (scoreCount > 0) {
                    var avg = scoreSum / scoreCount;
                    $("#" + matrixTableID).find("tbody").find('tr').last().append('<td title="" class="' + rightsholderName + '">' + avg + '</td>');
                    //Also add a tooltip.
                    var cell = $("#" + matrixTableID).find("tbody").find('tr').last().children().last();
                    cell.tooltip({ content: tooltipContent });
                    cell.css("background-color", getBackGroundColor(avg));
                }
                else
                    $("#" + matrixTableID).find("tbody").find('tr').last().append('<td class="' + rightsholderName + '">-</td>');
            });
        });

        return $("#" + matrixTableID); //Do we need this return value? I guess probably not, but we can at least check it for truthiness to see if the rebuild succeeded. 
    };

    this.addMonitorTabEvent = function (that) { //Is this the best way to ensure I still have the right "this" available when the function is called remotely? Probably not, but it works.
        return function (id, count) {
            var tableTemplate = '<table id="matrixTable' + count + '" border="1"><thead><tr><th></th></tr></thead><tbody></tbody></table>';
            $("#" + that.divID).find('#' + id, 'div').append(tableTemplate);
            that.rebuild(monitorTabs.getActiveMonitor());
        };
    }(this);

    this.changeMonitorTabEvent = function (that) {
        return function (newlyActiveTab) {
            that.rebuild(newlyActiveTab); //The index of the tab is currently the same as the monitor. This might change, though. 
        }
    }(this);

    monitorTabs.addTabsDiv(this.divID, {
        addTab: this.addMonitorTabEvent,
        changeTab: this.changeMonitorTabEvent
    });

    //Bind the monitor tab activate event so that the table can be repopulated appropriately.
    //TODO: Implement this. Make sure we don't repopulate when we don't need to.
}
var matrix = new Matrix();
