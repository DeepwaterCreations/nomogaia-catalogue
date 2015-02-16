//Represents the data currently in the table. 
function TableData() {
    //Holds RowData objects.
    this.rows = [];

    //Adds a data row to the table. If a second argument is specified, 
    //it gets passed in as a listener function.
    //Returns the newly-added row.
    this.addRow = function (inRow) {
        if (inRow == undefined) {
            var newRow = new RowData();
        } else {
            var newRow = inRow;
        }
        this.rows.push(newRow);
        return newRow;
    };

    this.toOut = function () {
        var out = [];
        this.rows.forEach(function (row) {
            out.push(row.toOut());
        });
        return out;
    }

    //Returns an array with all the rows for which the "columnName" value contains "data". 
    //If "columnName" holds an array, includes the row in the return values if that array contains "data".
    this.getRows = function (columnName, data) {
        var matchingRows = [];

        if (columnName && data) {
            this.rows.forEach(function (row) {
                var rowValue = row.getData(columnName);
                if (rowValue=="UNINITIALIZED" || rowValue == undefined) return;
                if (rowValue.constructor === Array) {
                    if (rowValue.indexOf(data) >= 0)
                        matchingRows.push(row);
                }
                else if (rowValue === data)
                    matchingRows.push(row);
            });
        }
        else
            console.log("WARNING: Tried to find columns with either undefined column name, or undefined data.");

        return matchingRows;
    };

    this.log = function () {
        var i = 0;
        for (var row in this.rows) {
            this.rows[row].log();
            i++;
        }
    };


}