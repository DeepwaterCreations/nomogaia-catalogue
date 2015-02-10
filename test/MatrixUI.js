//So we have rows associated with rights, and columns associated with impacted individuals, and the cells should hold the values.
//We also need to reflect that this data has changed over time. 
//Tooltips: Reasons for the scores, maybe also trend over time. 
//Also, we want to filter impacted rights holders so we don't see all of them.

//index.html can hold a blank table, like for the rows table.
//We want to: Iterate over the rights list, and for each item, add a table data with the name and then a series of table datas with the values for the list of impacted rights-holders.
//We also want to listen to the appropriate data values.
//And, we'll want tool tips on the table data elements. (So they'll need title='' !)


function Matrix() {

    this.divID = "matrixTableDiv";

    this.matrixTablePrefix = "matrixTable";

    var tableTemplate = '<table id="' + this.matrixTablePrefix + '"><thead><tr><th></th></tr></thead><tbody></tbody></table>';
    $("#" + this.divID).append(tableTemplate);

    //We need to know which table we're rebuilding in the function.
    //We also don't want to do this unless something has legitimately changed.
    //Maybe I want a monitor data structure lurking behind the UI that can keep track of such things?
    this.rebuild = function (monitor) {
        var matrixTableID = this.matrixTablePrefix; //TODO: Clean this up by directly replacing the former variable with the latter.

        if (!monitorTables.backingData[monitor]) {
            console.log("ERROR: Monitor " + monitor + " is undefined.");
            return undefined;
        }
        var data = monitorTables.backingData[monitor].tableData;
        var options = monitorTables.dataOptions;

        //First clear what's already there.
        $("#" + matrixTableID).empty();

        //Then, rebuild it.
        $("#" + matrixTableID).append("<thead><tr><th></th></tr></thead>"); //Contains a blank <th> so there's space for a column of row names.
        $("#" + matrixTableID).append("<tbody></tbody>");
        //Add the column headings
        options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
            $("#" + matrixTableID).find("thead").find("tr").append('<th title="" id="' + getColumnHeadID(rightsholderName) + '" class="columnHeader">' + rightsholderName + '</th>');
        });

        //Add the rows
        //For each right, get the list of table rows that contain that right. Iterate over the rights-holders, and for each one that the row item impacts, get the score and increment a count of scores.
        //Then put the averages in the table.
        options.getColumnOptions("Impacted Rights").forEach(function (rightName) {
            $("#" + matrixTableID).find("tbody").append('<tr></tr>');
            $("#" + matrixTableID).find("tbody").find('tr').last().append('<th title="" class="rowHeader">' + rightName + '</th>');

            //Generate the scores and push them into the htmlString.
            var rows = data.getRows("Impacted Rights", rightName);
            options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
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
                    }
                });
                if (scoreCount > 0) {
                    var avg = scoreSum / scoreCount;
                    $("#" + matrixTableID).find("tbody").find('tr').last().append('<td title="">' + avg + '</td>');
                    //Also add a tooltip.
                    var cell = $("#" + matrixTableID).find("tbody").find('tr').last().children().last();
                    cell.tooltip({ content: tooltipContent });
                    addScoreCategoryClass(cell, avg);
                }
                else
                    $("#" + matrixTableID).find("tbody").find('tr').last().append('<td>-</td>');
                //When the user mouses over a cell, this makes the cell's column header become highlighted.
                //Row headers already do this via pure CSS. (You can put a hover selector on the <tr> to find the appropriate row head, but the column heads aren't exclusively enclosed
                //in an element with the cells below them, so we have to resort to javascript.) 
                $("#" + matrixTableID).find("tbody").find('tr').last().children().last().hover(function (event) {
                    //On mouse hover, give the column header a class.
                    $('#' + getColumnHeadID(rightsholderName)).addClass("hoveredColumn");
                },
                function (event) {
                    //On mouse hover end, remove the class.
                    $('#' + getColumnHeadID(rightsholderName)).removeClass("hoveredColumn");
                });
            });
        });

        return $("#" + matrixTableID); //Do we need this return value? I guess probably not, but we can at least check it for truthiness to see if the rebuild succeeded. 
    };

    this.addMonitorTabEvent = function (that) { //Is this the best way to ensure I still have the right "this" available when the function is called remotely? Probably not, but it works.
        return function (id, count) {
            that.rebuild(monitorTabs.getActiveMonitor());
        };
    }(this);

    this.changeMonitorTabEvent = function (that) {
        return function (newlyActiveTab) {
            that.rebuild(newlyActiveTab); //The index of the tab is currently the same as the monitor. This might change, though. 
        }
    }(this);

    monitorTabs.addFunctions({
        addTab: this.addMonitorTabEvent,
        changeTab: this.changeMonitorTabEvent
    });    
}
var matrix = new Matrix();


function getColumnHeadID(rightsholderName) {
    var idString = "column" + rightsholderName.replace(/\W/g, ""); //Makes non-alphanumeric into nothing.
    return idString;
}