﻿var tableId = 0;

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

    this.body =  this.getTable().find("tbody");

    //This next bit of code is for populating the HTML table. I have no idea where, ultimately, this
    //code should live, or what function it ought to be a part of, but for now, it's right here:
    var that = this;
    columnList.forEach(function (columnName) {
        that.getTable().find("tr").append("<th class='CatalogHeader' title=''><div><textarea class='" + toColumnName(columnName) + " resizable'>" + columnName + "</textarea><form class='searchInputForm'><input type='search' required placeholder='filter " + columnName + "' class='searchInput searchInput-" + toColumnName(columnName) + "' /><button tabindex='-1' class='close-icon' type='reset'></button></form></div></th>");
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
    this.addRow = function(data){
        var myRow=new RowUI(this,data);
        this.tableUI.rows.push(myRow);
        return myRow;
    }
}

function createTableFromJSON(objFromFile, tableIndex, monitorTables) {
    var newTable = new Table(monitorTables);
    objFromFile[tableIndex].backingData.forEach(function (objRow) {
        if ("pointsTo" in objRow) {
            var refRow = undefined;
            monitorTables.backingData.forEach(function (table) {
                var target = table.tableData.getRows("id", objRow["pointsTo"]);
                if (target.length === 1){
                    refRow = target[0];
                    return;
                }
            });
            if (refRow) {
                var newRowUI = newTable.addRow(refRow);
                newRowUI.setValue("id", objRow.id);
                rowDataID = Math.max(rowDataId, objRow.id + 1);
            }
            else
                console.log("WARNING: couldn't find a row with id " + objRow["pointsTo"]);
        }
        else {
            var newData = new RowData();
            columnList.forEach(function (columnName) {
                if(columnName in objRow)
                    newData.setData(columnName, objRow[columnName]);
            });
            newData.id = objRow.id;
            rowDataID = Math.max(rowDataId, objRow.id+1);

            var newRowUI = newTable.addRow(newData);
        }
        //Increment the loading bar's progress
        var loadValue = $("#loadingBar").progressbar("value");
        $("#loadingBar").progressbar("value", ++loadValue);
    });
    return newTable;
}