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
        // none async
        //rowList.forEach(function (myRow) {
        //    myRow.init();
        //    that.tableUI.rows.push(myRow);
        //});

    //    var Parallel = require('paralleljs');
    //    var p2 = new Parallel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);

    //    var p = new Parallel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    //log = function () { console.log("Colin - Async", arguments); });

        //p.map(function (num) {
        //    for (var i = 0; i < 100000; i++) { }
        //    console.log("Colin - Async: num " + num);
        //    return num*num;
        //}).then(log);

        //p2.map(function (num) {
        //    console.log("colin - async: started " + dataList[num].id);
        //    dataList[num].init();
        //    console.log("colin - async: finished " + dataList[num].id);
        //    return num;
        //});


        //console.log("Colin - Async: data", p);


        //function async(myrow, callback) {
        //    settimeout(function () {
        //        console.log("colin - async: started " + myrow.id);
        //        myrow.init();
        //        console.log("colin - async: finished " + myrow.id);
        //    }, 0);
        //}
        //function final() { console.log('done', results); }


        //rowlist.foreach(function (myrow) {
        //    async(myrow)
        //});

        var async = require('async');

        //function async(arg, callback) {
        //    console.log('do something with \'' + arg + '\', return 1 sec later');
        //    setTimeout(function () { callback(arg * 2); }, 1000);
        //}
        var pb = $("#progressbar");
        async.forEach(rowList, function (myRow, callback) {
            //setTimeout(function () {
            
            pb.progressbar("value", (100*rowList.indexOf(myRow))/(rowList.length+0.0));
            myRow.init(myRow.data);
            var val = $("#loadingBar").progressbar("value") || 0;
            $("#loadingBar").progressbar("value", val + 1);
            //}, 1000);
            callback();
        }, function (err) {
            // do i need to do anything?
            //console.log("Colin - Async: all done");
        });
        console.log("Colin - Async: after all done");

        //rowList.forEach(function (myRow) {
        //    //myRow.init();
        //    that.tableUI.rows.push(myRow);
        //});

        d = new Date();
        var finishedInitingRows = d.getTime();
        console.log("Colin - RunTime - initingRows:" + (finishedInitingRows - finishedGettingString));
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