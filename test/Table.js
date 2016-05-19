var tableId = 0;

// this class hold a TableData and a TableUI
// it is passed in to RowUI on create so that RowUI can access TableData
function Table(monitorTables) {
    this.owner = monitorTables;
    this.idCounter = 0;
    this.id = tableId++;

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

    this.tableData = new TableData();
    this.addRow = function (rowData) {
        if (rowData == undefined) {
            this.tableData.addRow();
        } else {
            this.tableData.addRow(rowData)
        }
        return rowData;
    }

    this.addRows = function (dataList) {
        var that = this;
        dataList.forEach(function (data) {
            that.tableData.addRow(data);
        })
    }


    this.hider = new Hider(this);

}

function createTableFromJSON(objFromFile, tableIndex, monitorTables) {
    var newTable = new Table(monitorTables);
    var dataList = [];
    objFromFile[tableIndex].backingData.forEach(function (objRow) {
        var modified = objRow["modified"];
        if ("pointsTo" in objRow) {
            var refRow = undefined || false;
            //Search through the existing data and find the row with the id the new data points to.
            refRow = RowData.getRow(objRow["pointsTo"]);
            //Once we've found the row being pointed to, make a new row that references it. 
            if (refRow) {
                var newRowData = new RowData(newTable, objRow.id, modified, refRow);
                dataList.push(newRowData);
            }
            else {
                console.log("WARNING: couldn't find a row with id " + objRow["pointsTo"]);
            }
        }
        else {
            var newRowData = new RowData(newTable, objRow.id, modified);
            g.columnList.forEach(function (columnName) {
                if (columnName in objRow)
                    newRowData.setData(columnName, objRow[columnName]);
            });
            dataList.push(newRowData);
        }
    });
    newTable.addRows(dataList);
    return newTable;
}