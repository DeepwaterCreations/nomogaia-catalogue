//Represents the data currently in the table. 
function TableData(categoryHierarchy) {
    //Holds RowData objects.
    this.rows = [];

    this.categoryHierarchy = categoryHierarchy;

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

    //Returns an array with all the rows for which the "columnName" value contains "data". 
    //If "columnName" holds an array, includes the row in the return values if that array contains "data".
    this.getRows = function (columnName, data) {
        if (columnName && data) {
            var matchingRows = [];
            this.rows.forEach(function (row) {
                if (!(columnName in row)) return;
                if (row[columnName].constructor === Array) {
                    if (row[columnName].indexOf(data) >= 0)
                        matchingRows.push(row);
                }
                else if (row[columnName] === data)
                    matchingRows.push(row);
            });
            return matchingRows;
        }
    };

    this.log = function () {
        var i = 0;
        for (var row in this.rows) {
            this.rows[row].log();
            i++;
        }
    };

    // the options for a drop down in the key column
    this.columnOptions = {
        "Impacted Rights": ["right to Internet", "right to pizza", "right to sleep"],
        "Impacted Rights-Holders": ["colin", "chris", "poulami"],
        "Module":["sun","mooon","stars"]
    }


    // a getter for ColumnOptions
    this.getColumnOptions = function (column) {
        if (column == "Catalog") {
            var result = this.categoryHierarchy.getCatalogs();
            result.unshift("-");
            return result;
        } else if (column == "Category") {
            var result = this.categoryHierarchy.getCategories();
            result.unshift("-");
            return result;
        } else if (column == "Sub-Category") {
            var result = this.categoryHierarchy.getSubCategories();
            result.unshift("-");
            return result;
        } else if (column == "Topic") {
            var result = this.categoryHierarchy.getTopics();
            result.unshift("-");
            return result;
        } else {
            if (this.columnOptions.hasOwnProperty(column)) {
                return this.columnOptions[column];
            } else {
                console.log("column: " + column + " not found");
                return [];
            }
        }
    }

}