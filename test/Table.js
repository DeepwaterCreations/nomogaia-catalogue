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

//Returns a new array of rows containing wrapper rows for all the rows in prevMonitor, except where there is a 
//row in newRows with the same column values, in which case the newRow member is inserted.
//When we export CSV, we leave out all unmodified rows, so now we need to recreate those rows and put them
//back in. What's important is to make sure that they all have the correct references to previous rows.
//prevMonitor, newRows: Arrays of rowData. 
function fillFromPreviousMonitor(prevMonitor, newRows){
    var newMonitor = [];
    //Iterate over each member of the previous monitor, and for each of those,
    //check its category values against all of the rows being added.     
    for(var i = 0; i < prevMonitor.length; i++){
        newRows.forEach(function(newRow){
            // var match = true;
            // g.columnList.forEach(function(column){
                // if(row[column] !== newRow[column]){
                    // match = false;
                // }                
            // })
            var match = (prevMonitor[i]["Catalog"] === newRow["Catalog"]) &&
                    (prevMonitor[i]["Category"] === newRow["Category"]) &&
                    (prevMonitor[i]["Sub-Category"] === newRow["Sub-Category"]) &&
                    (prevMonitor[i]["Topic"] === newRow["Topic"]); 

            //If there's a match, copy in the new row.
            if(match){
                newRow.modified = true;
                newRow.unHooked = false;
                newMonitor[i] = newRow;
            }            
        });
        //Otherwise, copy the previous monitor's row and set a parent id on it.
        if(newMonitor[i] === undefined){
            newMonitor[i] = prevMonitor[i];
            if(prevMonitor[i].id === undefined){
                throw "Previous monitor's row has no id";
            }
            newMonitor[i].parentID = prevMonitor[i].id; 
        }
    };
    return newMonitor;
}

function createTableFromFile(monitorArray, monitorTables){
    var newTable = new Table(monitorTables);
    var dataList = [];
    monitorArray.forEach(function (objRow) {
        var id = objRow["id"];
        var modified = objRow["modified"] || 'auto';
        var parentID = objRow["parentID"] || 'auto';
        var unHooked = objRow["unHooked"] || 'auto';
        if (parentID !== 'auto' && parentID !== -1) {
            //Search through the existing data and find the row with the id the new data points to.
            var refRow = RowData.getRow(parentID);
            //Once we've found the row being pointed to, make a new row that references it. 
            if (refRow !== undefined) {
                var newRowData = new RowData(newTable, id, modified, unHooked, refRow);
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
