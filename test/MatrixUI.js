function Matrix() {

    this.dirty = true;

    this.divID = "matrixTableDiv";

    this.matrixTablePrefix = "matrixTable";

    var tableTemplate = '<table id="' + this.matrixTablePrefix + '"><thead><tr><th></th></tr></thead><tbody></tbody></table>';
    $("#" + this.divID).append(tableTemplate);

    var undefinedRightNameFiller = "Right to Nothing Whatsoever";
    var undefinedRightsHolderNameFiller = "Nobody In Particular";

    var sortOptionsButtons = $("#matrixSortOptionsButtons").buttonset();
    sortOptionsButtons.on("change", function () {
        matrix.dirty = true;
        matrix.rebuild(monitorTabs.getActiveMonitor());
    });


    this.getDataForMatrix = function (monitor) {

        var data = monitorTables.backingData[monitor].tableData;
        var newestMonitorData = monitorTables.getNewestMonitorData().tableData;

        var rowHTMLList = [];

        var columnSortScores = {};

        //Add the rows
        //For each right, get the list of monitor table rows that contain that right. Iterate over the rights-holders, and for each one that the row item impacts, get the score and increment a count of scores.
        //Cell HTML strings go in an HTMLrow object mapped to rights-holder names. Then we can sort by rights and add rows in the rights order, or sort by rights-holders to add cells from each right in a particular column order.
        DataOptions.getColumnOptions("Impacted Rights").forEach(function (rightName) {
            rightName = rightName || undefinedRightNameFiller;

            var rowHTML = {
                header: '<th title="" class="rowHeader">' + rightName + '</th>',
                rowTag: '<tr id="' + getRowID(rightName) + '">',
                rowCloseTag: '</tr>',
                rowScore: undefined //A score of 0 is different from no score at all, yeah?
            }

            //Generate the scores and push them into the htmlString.
            var rows = data.getRows("Impacted Rights", rightName);
            rows = rows.filter(function (element, index, array) {
                return element.getData("Catalog") !== "Context";
            });
            var newestMonitorRows = newestMonitorData.getRows("Impacted Rights", rightName);
            newestMonitorRows = newestMonitorRows.filter(function (element, index, array) {
                return element.getData("Catalog") !== "Context";
            });
            DataOptions.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
                rightsholderName = rightsholderName || undefinedRightsHolderNameFiller;

                var scoreCount = 0;
                var scoreSum = 0;
                var sortScoreCount = 0;
                var sortScoreSum = 0;
                var tooltipContent = "";
                var cellClass = getDataCellClass(rightName, rightsholderName);
                rows.forEach(function (row) {
                    if (row.getData("Impacted Rights-Holders") && row.getData("Impacted Rights-Holders").indexOf(rightsholderName) > -1) {
                        scoreCount++;
                        scoreSum += parseInt(row.getData("Score"));
                        //Generate tooltip text displaying a title and the issue.
                        tooltipContent += getTooltipForRow(row);
                    }
                });
                //We also need data from the newest monitor, for the sake of sorting.
                newestMonitorRows.forEach(function (row) {
                    if (row.getData("Impacted Rights-Holders") && row.getData("Impacted Rights-Holders").indexOf(rightsholderName) > -1) {
                        sortScoreCount++;
                        sortScoreSum += parseInt(row.getData("Score"));
                    }
                });
                var cell = {
                    HTML: "",
                    score: "-"
                };
                if (scoreCount > 0) {
                    var avg = scoreSum / scoreCount;
                    cell.HTML = '<td data-columnhead="' + getColumnHeadID(rightsholderName) + '" data-tooltip="' + encodeURI(tooltipContent) + '" data-score="' + avg + '" title="" class="analytics-cell hasToolTip ' + cellClass.rowClass + ' ' + cellClass.colClass + ' ' + getScoreCategoryClass(avg) + '">' + avg.decRound(2) + '</td>';
                    //Also add a tooltip.
                    cell.tooltipContent = tooltipContent; //Leave this undefined to have no tooltip.
                    cell.score = avg;
                }
                else {
                    cell.HTML = '<td data-rightsholderName="' + rightsholderName + '" class="analytics-cell ' + cellClass.rowClass + ' ' + cellClass.colClass + '">-</td>';
                }
                //Get the newest monitor data, not the current monitor data, for sorting.
                //The row's score will be the sum of the cell data scores for that Right in the newest matrix.
                //The average is only to get the score for a single cell, which might have multiple underlying catalogue rows contributing.
                //This is also why we can use this same data for the column sort score list. 
                if (sortScoreCount > 0) {
                    var avg = sortScoreSum / sortScoreCount;
                    rowHTML.rowScore = (rowHTML.rowScore ? rowHTML.rowScore + Math.abs(avg) : Math.abs(avg));
                    columnSortScores[rightsholderName] = (columnSortScores[rightsholderName] ? columnSortScores[rightsholderName] + Math.abs(avg) : Math.abs(avg));
                }
                rowHTML[rightsholderName] = cell;

            });
            //This filters out the rows with no scoring cells.
            //if(rowHTML.rowScore !== undefined)
            //...but I guess we actually only want to filter out the rows with no data in any monitor at all.
            if (rightHasEntries(rightName))
                rowHTMLList.push(rowHTML);
        });
        return { rowHTMLList: rowHTMLList, columnSortScores: columnSortScores };
    }

    this.generateMatrixString = function (monitor) {
        var asString = "";


        //TODO: Figure out where these values ought to live, and where they come from.
        var sortByMostImpactedRight = $("#sortByRightsImpact:checked").val();
        var sortByMostImpactedRightsholder = $("#sortByRightsholdersImpact:checked").val();

        if (!monitorTables.backingData[monitor]) {
            console.log("ERROR: Monitor " + monitor + " is undefined.");
            return undefined;
        }
        var data = monitorTables.backingData[monitor].tableData;
        var newestMonitorData = monitorTables.getNewestMonitorData().tableData;

        // if we are ever converned about pref we could pass data in
        var dataForMatrix = this.getDataForMatrix(monitor);
        var rowHTMLList = dataForMatrix.rowHTMLList;
        var columnSortScores = dataForMatrix.columnSortScores;

        //Then, rebuild it.
        //$("#" + this.matrixTablePrefix).append('<thead><tr><th class="columnHeader">-</th></tr></thead>'); //Contains a blank <th> so there's space for a column of row names.
        //$("#" + this.matrixTablePrefix).append("<tbody></tbody>");

        //Add the column headings
        var sortedRightsholders = DataOptions.getColumnOptions("Impacted Rights-Holders");
        //Weed out the rightsHolders with no data in any monitor
        sortedRightsholders = sortedRightsholders.filter(function (value, index, array) {
            //return value in columnSortScores
            return rightsholderHasEntries(value);
        });
        //Do the sorting.
        if (sortByMostImpactedRightsholder) {
            sortedRightsholders.sort(function (a, b) {
                return columnSortScores[b] - columnSortScores[a];
            });
        }
        // open the head
        asString += '<thead><tr><th class="columnHeader">';

        sortedRightsholders.forEach(function (rightsholderName) {
            rightsholderName = rightsholderName || undefinedRightsHolderNameFiller; //This is a bit goofy, but in practice, I think we shouldn't have this ever. If we see it, it's an error. 
            var temp = '<th title="" id="' + getColumnHeadID(rightsholderName) + '" class="columnHeader">' + rightsholderName + '</th>';
            //$("#" + this.matrixTablePrefix).find("thead").find("tr").append(temp);
            asString += temp;
        });

        //close the head
        asString += '</th></tr></thead>';


        if (sortByMostImpactedRight) {
            rowHTMLList.sort(function (a, b) {
                return b.rowScore - a.rowScore;
            });
        }

        // open the body 
        asString += '<tbody>';

        //Add the cells
        rowHTMLList.forEach(function (rowHTML) {
            // open the cell
            //$("#" + this.matrixTablePrefix).find("tbody").append(rowHTML.rowTag + rowHTML.header + rowHTML.rowCloseTag);
            asString += rowHTML.rowTag + rowHTML.header;
            sortedRightsholders.forEach(function (rightsholderName) {
                //Add the cell
                //$("#" + this.matrixTablePrefix).find("tbody").find('tr').last().append(rowHTML[rightsholderName].HTML);
                asString += rowHTML[rightsholderName].HTML;
                //var cell = $("#" + this.matrixTablePrefix).find("tbody").find('tr').last().children().last(); //This is ugly. Unfortunately, append returns the thing receiving the appendage, not the thing being appended.
                //Give it a tooltip
                //if (rowHTML[rightsholderName].tooltipContent) {
                //    cell.tooltip({ content: rowHTML[rightsholderName].tooltipContent });
                //}
                //Style it if it has a score

                //When the user mouses over a cell, this makes the cell's column header become highlighted.
                //Row headers already do this via pure CSS. (You can put a hover selector on the <tr> to find the appropriate row head, but the column heads aren't exclusively enclosed
                //in an element with the cells below them, so we have to resort to javascript.) 
                //cell.hover(function (event) {
                //On mouse hover, give the column header a class.
                //$('#' + getColumnHeadID(rightsholderName)).addClass("hoveredColumn");
                //},
                //function (event) {
                //On mouse hover end, remove the class.
                //    $('#' + getColumnHeadID(rightsholderName)).removeClass("hoveredColumn");
                //});
            });
            asString += rowHTML.rowCloseTag;
        });

        //this.filter(monitorTables.backingData.length - 1);

        return asString;
    }

    //We need to know which table we're rebuilding in the function.
    //We also don't want to do this unless something has legitimately changed.
    this.rebuild = function (monitor) {
        if (!this.dirty)
            return;



        //First clear what's already there.
        $("#" + this.matrixTablePrefix).empty();
        $("#" + this.divID + " .nodata").remove();
        $("#matrixSortOptions").removeClass("hidden");
        $("#export-html").removeClass("hidden");

        var data = this.getDataForMatrix(monitor);
        var rowHTMLList = data.rowHTMLList;
        var columnSortScores = data.columnSortScores;

        if (!rowHTMLList.length) {
            //Display a message and disable the radio buttons if there is no data.
            $("#" + this.divID).append(noDataHTML);
            $("#matrixSortOptions").addClass("hidden");
            $("#export-html").addClass("hidden");
        }
        else {

            var asString = this.generateMatrixString(monitor);

            $("#" + this.matrixTablePrefix).append(asString);
            g.emf.setToolTips();
        }


        this.dirty = false;
        return $("#" + this.matrixTablePrefix); //Do we need this return value? I guess probably not, but we can at least check it for truthiness to see if the rebuild succeeded. 
    };

    //this.filter = function (monitor) {
    //    var keptColumns = {};
    //    var keptRows = {};

    //    var data = monitorTables.backingData[monitor].tableData;
    //    var DataOptions = monitorTables.dataOptions;

    //    //We're going to iterate over all the rows and columns to see which have scores. Each row/column that has at least one score in it, we'll keep. 
    //    DataOptions.getColumnOptions("Impacted Rights").forEach(function (rightName) {
    //        rightName = rightName || undefinedRightNameFiller;

    //var rows = data.getRowsWithScore("Impacted Rights", rightName);
    //DataOptions.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
    //    rightsholderName = rightsholderName || undefinedRightsHolderNameFiller;

    //            rows.forEach(function (row) {
    //                if (row.getData("Impacted Rights-Holders") && row.getData("Impacted Rights-Holders").indexOf(rightsholderName) > -1) {
    //                    keptRows[rightName] = true;
    //                    keptColumns[rightsholderName] = true;
    //                }
    //            });
    //        });
    //    });

    //    //Now, delete all the rows and columns that never made it onto the list.
    //    DataOptions.getColumnOptions("Impacted Rights").forEach(function (rightName) {
    //        rightName = rightName || undefinedRightNameFiller;

    //        if (!(rightName in keptRows))
    //            $("#" + getRowID(rightName)).remove();
    //    });

    //    DataOptions.getColumnOptions("Impacted Rights-Holders").forEach(function (rightsholderName) {
    //        rightsholderName = rightsholderName || undefinedRightsHolderNameFiller;

    //        if (!(rightsholderName in keptColumns)) {
    //            $("td." + getDataCellClass("", rightsholderName).colClass).remove();
    //            $("#" + getColumnHeadID(rightsholderName)).remove();
    //        }
    //    });
    //};

    this.addMonitorTabEvent = function (that) { //Is this the best way to ensure I still have the right "this" available when the function is called remotely? Probably not, but it works.
        return function (id, count) {
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

$('#export-matrix-button').click(function () {
    var fileDialog = $("#export-matrix-dialog");
    var HTMLbody = "<div id='matrixTableDiv'><table id='matrixTable'>" + matrix.generateMatrixString(monitorTabs.getActiveMonitor()) + "</table></div>";
    exportViewToHTML(fileDialog, HTMLbody);
});
