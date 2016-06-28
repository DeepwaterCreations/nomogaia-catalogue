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

    this.toCSV = function () {
        return this.tableData.toCSV();
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

function createTableFromFile(monitorArray, monitorTables){
    var newTable = new Table(monitorTables);
    var dataList = [];
    monitorArray.forEach(function (objRow) {
        var id = objRow["id"];
        var modified = objRow["modified"] ||'auto';
        var parentID = objRow["parentID"] || 'auto';
        var unHooked = objRow["unHooked"] || 'auto';
        if (parentID !== 'auto' && parentID != -1) {
            //Search through the existing data and find the row with the id the new data points to.
            var refRow = RowData.getRow(parentID);
            //Once we've found the row being pointed to, make a new row that references it. 
            if (refRow!= undefined) {
                var newRowData = new RowData(newTable, id, modified,unHooked, refRow);
                dataList.push(newRowData);
            }
            else {
                console.log("WARNING: couldn't find a row with id " + parentID);
            }
        }
        else {
            var newRowData = new RowData(newTable, id, modified, unHooked);
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