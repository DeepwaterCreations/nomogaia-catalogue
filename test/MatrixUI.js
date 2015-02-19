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

    var undefinedRightNameFiller = "Right to Nothing Whatsoever";
    var undefinedRightsHolderNameFiller = "Nobody In Particular";

    //We need to know which table we're rebuilding in the function.
    //We also don't want to do this unless something has legitimately changed.
    //Maybe I want a monitor data structure lurking behind the UI that can keep track of such things?
    this.rebuild = function (monitor) {
        var matrixTableID = this.matrixTablePrefix;

        if (!monitorTables.backingData[monitor]) {
            console.log("ERROR: Monitor " + monitor + " is undefined.");
            return undefined;
        }
        var data = monitorTables.backingData[monitor].tableData;
        var options = monitorTables.dataOptions;

        //First clear what's already there.
        $("#" + matrixTableID).empty();
        $("#" + this.divID + " .nodata").remove();

        //Then, rebuild it.
        $("#" + matrixTableID).append('<thead><tr><th class="columnHeader"></th></tr></thead>'); //Contains a blank <th> so there's space for a column of row names.
        $("#" + matrixTableID).append("<tbody></tbody>");
  
        var rowHTMLList = [];
        
        //Add the rows
        //For each right, get the list of monitor table rows that contain that right. Iterate over the rights-holders, and for each one that the row item impacts, get the score and increment a count of scores.
        //Cell HTML strings go in an HTMLrow object mapped to rights-holder names. Then we can sort by rights and add rows in the rights order, or sort by rights-holders to add cells from each right in a particular column order.
        options.getColumnOptions("Impacted Rights").forEach(function (rightName) {
            rightName = rightName || undefinedRightNameFiller;

            var rowHTML = {
                header: '<th title="" class="rowHeader">' + rightName + '</th>',
                rowTag: '<tr id="' + getRowID(rightName) + '">',
                rowCloseTag: '</tr>',
                rowScore: undefined //A score of 0 is different from no score at all, yeah?
            }

            //$("#" + matrixTableID).find("tbody").append('<tr id="' + getRowID(rightName) + '"></tr>');
            //$("#" + matrixTableID).find("tbody").find('tr').last().append('<th title="" class="rowHeader">' + rightName + '</th>');

            //Generate the scores and push them into the htmlString.
            var rows = data.getRows("Impacted Rights", rightName);
            options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
                rightsholderName = rightsholderName || undefinedRightsHolderNameFiller;

                var scoreCount = 0;
                var scoreSum = 0;
                var tooltipContent = "";
                var cellClass = getDataCellClass(rightName, rightsholderName);
                rows.forEach(function (row) {
                    if (row.getData("Impacted Rights-Holders").indexOf(rightsholderName) > -1) {
                        scoreCount++;
                        scoreSum += parseInt(row.getData("Score"));
                        //Generate tooltip text displaying a title and the issue.
                        tooltipContent += '<b>' + row.getData("Topic") + ': '+ row.getData("Score")+ '</b>';
                        tooltipContent += '<p>' + row["Input"] + '</p>';
                    }
                });
                var cell = {
                    HTML: "",
                    score: "-"
                };
                if (scoreCount > 0) {
                    rowHTML.rowScore = (rowHTML.rowScore ? rowHTML.rowScore + scoreSum : scoreSum);
                    var avg = scoreSum / scoreCount;
                    //$("#" + matrixTableID).find("tbody").find('tr').last().append('<td title="" class="' + cellClass.rowClass + ', ' + cellClass.colClass + '">' + avg + '</td>');
                    cell.HTML = '<td title="" class="' + cellClass.rowClass + ', ' + cellClass.colClass + '">' + avg + '</td>';
                    //Also add a tooltip.
                    //var cell = $("#" + matrixTableID).find("tbody").find('tr').last().children().last();
                    //cell.tooltip({ content: tooltipContent });
                    cell.tooltipContent = tooltipContent; //Leave this undefined to have no tooltip.
                    //addScoreCategoryClass(cell.HTML, avg); //TODO: I'm not sure if this works. Can I change that function to return a bit of HTML I can stick into the string?
                    cell.score = avg;
                }
                else {
                    //$("#" + matrixTableID).find("tbody").find('tr').last().append('<td class="' + cellClass.rowClass + ', ' + cellClass.colClass + '">-</td>');
                    cell.HTML = '<td class="' + cellClass.rowClass + ', ' + cellClass.colClass + '">-</td>';
                }
                rowHTML[rightsholderName] = cell;

            });
            //This filters out the rows with no scoring cells.
            if(rowHTML.rowScore !== undefined)
                rowHTMLList.push(rowHTML); 
        });

        if (!rowHTMLList.length) {
            $("#" + matrixTableID).empty();
            $("#" + this.divID).append('<div class="nodata"><span>NO DATA</span></div>');
        }
        else {

            //Add the column headings
            //TODO: Here is where we sort columns. (Also make sure it's the same sorted list in the forEach inside the row adding.)
            options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
                rightsholderName = rightsholderName || undefinedRightsHolderNameFiller; //This is a bit goofy, but in practice, I think we shouldn't have this ever. If we see it, it's an error. 

                $("#" + matrixTableID).find("thead").find("tr").append('<th title="" id="' + getColumnHeadID(rightsholderName) + '" class="columnHeader">' + rightsholderName + '</th>');
            });

            //Add the cells
            //TODO: Here is where we sort rows.
            rowHTMLList.forEach(function (rowHTML) {
                $("#" + matrixTableID).find("tbody").append(rowHTML.rowTag + rowHTML.header + rowHTML.rowCloseTag);
                options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
                    //Add the cell
                    $("#" + matrixTableID).find("tbody").find('tr').last().append(rowHTML[rightsholderName].HTML);
                    var cell = $("#" + matrixTableID).find("tbody").find('tr').last().children().last(); //This is ugly. Unfortunately, append returns the thing receiving the appendage, not the thing being appended.
                    //Give it a tooltip
                    if(rowHTML[rightsholderName].tooltipContent)
                        cell.tooltip({ content: rowHTML[rightsholderName].tooltipContent });
                    //Style it if it has a score
                    if(rowHTML[rightsholderName].score !== "-")
                        addScoreCategoryClass(cell, parseInt(rowHTML[rightsholderName].score));
                    //When the user mouses over a cell, this makes the cell's column header become highlighted.
                    //Row headers already do this via pure CSS. (You can put a hover selector on the <tr> to find the appropriate row head, but the column heads aren't exclusively enclosed
                    //in an element with the cells below them, so we have to resort to javascript.) 
                    cell.hover(function (event) {
                        //On mouse hover, give the column header a class.
                        $('#' + getColumnHeadID(rightsholderName)).addClass("hoveredColumn");
                    },
                    function (event) {
                        //On mouse hover end, remove the class.
                        $('#' + getColumnHeadID(rightsholderName)).removeClass("hoveredColumn");
                    });
                });
            });

            this.filter(monitorTables.backingData.length - 1);
        }

        return $("#" + matrixTableID); //Do we need this return value? I guess probably not, but we can at least check it for truthiness to see if the rebuild succeeded. 
    };

    this.filter = function (monitor) {
        var keptColumns = {};
        var keptRows = {};
        
        var data = monitorTables.backingData[monitor].tableData;
        var options = monitorTables.dataOptions;
                
        //We're going to iterate over all the rows and columns to see which have scores. Each row/column that has at least one score in it, we'll keep. 
        options.getColumnOptions("Impacted Rights").forEach(function (rightName) {
            rightName = rightName || undefinedRightNameFiller;

            var rows = data.getRows("Impacted Rights", rightName);
            options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
                rightsholderName = rightsholderName || undefinedRightsHolderNameFiller;

                rows.forEach(function (row) {
                    if (row.getData("Impacted Rights-Holders").indexOf(rightsholderName) > -1) {
                        keptRows[rightName] = true;
                        keptColumns[rightsholderName] = true;
                    }
                });
            });
        });

        //Now, delete all the rows and columns that never made it onto the list.
        options.getColumnOptions("Impacted Rights").forEach(function (rightName) {
            rightName = rightName || undefinedRightNameFiller;

            if (!(rightName in keptRows))
                $("#" + getRowID(rightName)).remove();
        });

        options.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
            rightsholderName = rightsholderName || undefinedRightsHolderNameFiller;

            if (!(rightsholderName in keptColumns)) {
                $("td." + getDataCellClass("", rightsholderName).colClass).remove();
                $("#" + getColumnHeadID(rightsholderName)).remove();
            }
        });
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

//TODO: These are ugly. Also, why are they in this file when ImpactedRights uses them too?
//TODO: It would be neat to put stripNonAlphanumeric into the String prototype.
function stripNonAlphanumeric(string) {
    return string.replace(/\W/g, "");
}

function getColumnHeadID(columnName) {
    var idString = "column" + stripNonAlphanumeric(columnName); //Makes non-alphanumeric into nothing.
    return idString;
}

function getRowID(rightName) {
    var idString = "row" + stripNonAlphanumeric(rightName); //Makes non-alphanumeric into nothing.
    return idString;
}

function getDataCellClass(rightName, rightsHolderName) {
    var returnVal = {};
    returnVal.rowClass = "row" + stripNonAlphanumeric(rightName) + "Data";
    returnVal.colClass = "column" + stripNonAlphanumeric(rightsHolderName) + "Data";
    return returnVal;
}