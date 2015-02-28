var tableId = 0;

// this class hold a TableData and a TableUI
// it is passed in to RowUI on create so that RowUI can access TableData
function Table(monitorTables) {
    this.owner = monitorTables;
    console.log("Colin, table id increased")
    this.idCounter = 0;
    this.id = tableId++;

    // TODO add a new tables to tables

    $("#tables").append('<table class="dataTable pure-table pure-table-bordered" id="table' + this.id + '"><thead><tr></tr></thead><tbody></tbody></table>')

    this.getTable = function () {
        return $("#table" + this.id);
    }

    this.body = this.getTable().find("tbody");

    //This next bit of code is for populating the HTML table. I have no idea where, ultimately, this
    //code should live, or what function it ought to be a part of, but for now, it's right here:
    var that = this;
    columnList.forEach(function (columnName) {
        that.getTable().find("tr").append("<th class='CatalogHeader' title=''><div><textarea class='" + toColumnName(columnName) + " resizable'>" + columnName + "</textarea><form class='searchInputForm'><input type='search' required placeholder='Filter " + columnName + "' class='searchInput searchInput-" + toColumnName(columnName) + "' /><button tabindex='-1' class='close-icon' type='reset'></button></form></div></th>");
        that.getTable().find("tr").children().last().find("textarea").attr("disabled", "disabled");
    });


    this.nextId = function () {
        return this.idCounter++;
    }

    this.toOut = function () {
        return this.tableData.toOut();
    }

    this.removeTable = function () {
        this.getTable().remove();
    }

    this.tableUI = new TableUI();
    this.tableData = new TableData();
    this.addRow = function (data) {
        var myRow = new RowUI(this, data);
        myRow.addHTML();
        myRow.init(data);
        this.tableUI.rows.push(myRow);
        return myRow;
    }

    this.addRows = function (dataList) {
        var that = this;
        var rowList = [];
        var HTMLstring
        var that = this;
        var d = new Date();
        var startedGettingString = d.getTime();
        dataList.forEach(function (data) {
            var myRow = new RowUI(that, data);
            HTMLstring += myRow.genHTMLString();
            rowList.push(myRow);
        })
        d = new Date();
        var finishedGettingString = d.getTime();
        console.log("Colin - RunTime - addingHTML:" + (finishedGettingString - startedGettingString));

        this.body.append(HTMLstring);
 
        var async = require('async');

        async.forEach(rowList, function (myRow, callback) {
            setTimeout(function () {
            myRow.init(myRow.data);
            if ($("#loadingBarDialog").hasClass('ui-dialog-content')) {
                var val = $("#loadingBar").progressbar("value") || 0;
                $("#loadingBar").progressbar("value", val + 1);
                if ($("#loadingBar").progressbar("value") > $("#loadingBar").progressbar("option", "max") - 1) {
                    $("#loadingBarDialog").dialog("destroy");
                }
            }
            callback();
            }, 0);
        }, function (err) {
        });
        console.log("Colin - Async: after all done");

        d = new Date();
        var finishedInitingRows = d.getTime();
        console.log("Colin - RunTime - initingRows:" + (finishedInitingRows - finishedGettingString));
    }

    this.addRowsWrapped = function(dataList){
        //Make a loading bar dialog
        $("#loadingBarDialog").dialog({
            dialogClass: "no-close",
            closeOnEscape: false,
            draggable: false,
            modal: true,
            resizable: false
        });
        // and the loading bar
        $("#loadingBar").progressbar({
            value: 0
        });

        var barMax = dataList.length;
        $("#loadingBar").progressbar("option", "max", barMax);

       this.addRows(dataList);
    }

}

function createTableFromJSON(objFromFile, tableIndex, monitorTables) {
    var newTable = new Table(monitorTables);
    var dataList = [];
    objFromFile[tableIndex].backingData.forEach(function (objRow) {
        if ("pointsTo" in objRow) {
            var refRow = undefined;
            monitorTables.backingData.forEach(function (table) {
                var target = table.tableData.getRows("id", objRow["pointsTo"]);
                if (target.length === 1) {
                    refRow = target[0];
                    return;
                }
            });
            if (refRow) {
                var newRowData = new RowData(refRow);
                newRowData.setValue("id", objRow.id);
                dataList.push(newRowData);
                rowDataID = Math.max(rowDataId, objRow.id + 1);
            }
            else
                console.log("WARNING: couldn't find a row with id " + objRow["pointsTo"]);
        }
        else {
            var newRowData = new RowData();
            columnList.forEach(function (columnName) {
                if (columnName in objRow)
                    newRowData.setData(columnName, objRow[columnName]);
            });
            newRowData.id = objRow.id;
            rowDataID = Math.max(rowDataId, objRow.id + 1);
            dataList.push(newRowData);
        }
        //Increment the loading bar's progress
        var loadValue = $("#loadingBar").progressbar("value");
        $("#loadingBar").progressbar("value", ++loadValue);
    });
    newTable.addRows(dataList);
    return newTable;
}