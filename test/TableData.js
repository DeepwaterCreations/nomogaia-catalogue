//Represents the data currently in the table. 
function TableData() {
    //Holds RowData objects.
    this.rows = [];
    // this is a view of rows sorted by
    // {Catalog:{Category:{Sub-Category:[...rows...]}}
    this.treeView = {};



    //Adds a data row to the table. If a second argument is specified, 
    //it gets passed in as a listener function.
    //Returns the newly-added row.
    this.addRow = function (inRow) {
        if (inRow === undefined) {
            var newRow = new RowData();
        } else {
            var newRow = inRow;
        }
        this.rows.push(newRow);

        if (!(newRow.getData("Catalog") in this.treeView)) {
            this.treeView[newRow.getData("Catalog")] = {};
        }
        if (!(newRow.getData("Category") in this.treeView[newRow.getData("Catalog")])) {
            this.treeView[newRow.getData("Catalog")][newRow.getData("Category")] = {};
        }
        if (!(newRow.getData("Sub-Category") in this.treeView[newRow.getData("Catalog")][newRow.getData("Category")])) {
            this.treeView[newRow.getData("Catalog")][newRow.getData("Category")][newRow.getData("Sub-Category")] = [];
        }
        this.treeView[newRow.getData("Catalog")][newRow.getData("Category")][newRow.getData("Sub-Category")].push(newRow);
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
                
        this.rows.forEach(function (row) {
            var rowValue = row.getData(columnName);
            if (rowValue == DataOptions.getDefaultValue(columnName) || rowValue == undefined) return;
            if (rowValue.constructor === Array) {
                if (rowValue.indexOf(data) >= 0)
                    matchingRows.push(row);
            }
            else if (rowValue === data)
                matchingRows.push(row);
        });
        
        return matchingRows;
    };

    //wraps getRows and only returns rows with a none default score
    this.getRowsWithScore = function (columnName, data) {
        var matchingRows = this.getRows(columnName, data);
        var withScore = [];

        matchingRows.forEach(function (row) { 
            if (row.getData("Score") != DataOptions.getDefaultValue("Score")) {
                withScore.push(row);
            }
        });

        return withScore;
    };

    this.log = function () {
        var i = 0;
        for (var row in this.rows) {
            this.rows[row].log();
            i++;
        }
    };


}