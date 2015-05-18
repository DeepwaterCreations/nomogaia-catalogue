var tableId = 0;

// this class hold a TableData and a TableUI
// it is passed in to RowUI on create so that RowUI can access TableData
function Table(monitorTables) {
    this.owner = monitorTables;
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
        that.getTable().find("tr").append("<th class='CatalogHeader' title=''><div><textarea class='" + toColumnName(columnName) + " resizable'>" + columnName + "</textarea><div class='searchInputForm'><input type='search' required placeholder='Filter " + columnName + "' class='searchInput searchInput-" + toColumnName(columnName) + "' /><button tabindex='-1' class='close-icon' type='reset'></button></div></div></th>");
        that.getTable().find("tr").children().last().find("textarea").attr("disabled", "disabled");
    });

    this.nextId = function () {
        return this.idCounter++;
    }

    this.toOut = function () {
        var out = this.tableData.toOut();
        return out;
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

    this.addRows = function (dataList, outerCallBack) {
        this.getTable().parent().hide();

        var that = this;
        var rowList = [];
        var HTMLstring

        //var d = new Date();
        //var startedGettingString = d.getTime();

        dataList.forEach(function (data) {
            var myRow = new RowUI(that, data);
            HTMLstring += myRow.genHTMLString();
            rowList.push(myRow);
        })
        d = new Date();
        var finishedGettingString = d.getTime();
        this.body.append(HTMLstring);

        //console.log("Colin - RunTime - addingHTML:" + (finishedGettingString - startedGettingString));

        


        //var startedBigLoop = window.performance.now();
        //this.timeMakeSelect2 = 0;
        //this.timeUpdateColumnOptions = 0;
        //this.timePassChanges = 0;
        //this.timeListenToData = 0;
        //this.timeUIToData = 0;
        //this.timeDelete = 0


        rowList.forEach(function (myRow) {
            setTimeout(function () {
            myRow.init(myRow.data);
            if ($("#loadingBarDialog").hasClass('ui-dialog-content')) {
                var val = $("#loadingBar").progressbar("value") || 0;
                $("#loadingBar").progressbar("value", val + 1);
                if (outerCallBack != undefined) {
                    if ($("#loadingBar").progressbar("value") == $("#loadingBar").progressbar("option", "max")) {
                        outerCallBack();
                        //d = new Date();
                        //var finishedInitingRows = d.getTime();
                        //console.log("Colin - RunTime - initingRows:" + (finishedInitingRows - finishedGettingString));
                        //console.log("Colin - makeSelect2: " + that.timeMakeSelect2);
                        //console.log("Colin - update column options: " + that.timeUpdateColumnOptions);
                        //console.log("Colin - pass changes to data: " + that.timePassChanges);
                        //console.log("Colin - listen to data: " + that.timeListenToData);
                        //console.log("Colin - time UI to data: " + that.timeUIToData);
                        //console.log("Colin - table", that);
                    }
                }
            }
            }, 0);
        });
    }

    this.addRowsWrapped = function (dataList, callBack) {
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

        var adjustedCallBack = function () {
            $("#loadingBarDialog").dialog("destroy");
            that.getTable().parent().show();
            if (callBack != undefined) {
                callBack();
            }

        }

        this.addRows(dataList, adjustedCallBack);
    }

    this.hider = new Hider(this);

}

function createTableFromJSON(objFromFile, tableIndex, monitorTables) {
    var newTable = new Table(monitorTables);
    var dataList = [];
    objFromFile[tableIndex].backingData.forEach(function (objRow) {
        if ("pointsTo" in objRow) {
            var refRow = undefined;
            //Search through the existing data and find the row with the id the new data points to.
            monitorTables.backingData.forEach(function (table) {
                var target = table.tableData.getRows("id", objRow["pointsTo"]);
                if (target.length === 1) {
                    refRow = target[0];
                    return;
                }
            });
            //Once we've found the row being pointed to, make a new row that references it. 
            if (refRow) {
                var newRowData = new RowData(refRow);
                newRowData.setId("id", objRow.id);
                dataList.push(newRowData);
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
            newRowData.setId(objRow.id);
            dataList.push(newRowData);
        }
    });
    newTable.addRows(dataList, function () {
        $("#loadingBarDialog").dialog("destroy");
        newTable.getTable().parent().show();
    });
    return newTable;
}