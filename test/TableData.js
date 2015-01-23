//Represents the data currently in the table. 
function TableData() {
    //Holds RowData objects.
    this.rows = [];

    //Holds the data for a single row.
    this.RowData = function () {
        //Constructor code
        columnList.forEach(function (columnName) {
            this[columnName] = "UNINITIALIZED";
        });

        //"Class members"
        // is a dictonary columnName: [listeners...]
        this.listenFunctions = {};

        this.addListener = function (columnName, listenerFunction) {
            if (listenerFunction[columnName] == undefined) {
                this.listenFunctions[columnName] = [listenerFunction];
            } else {
                this.listenFunctions[columnName].push(listenerFunction);
            }

        };

        this.getData = function (columnName) {
            return this[columnName];
        };

        this.setData = function (columnName, data) {
            this[columnName] = data;
            //Also call the listener functions
            this.listenFunctions[columnName].forEach(function (listenerfunction) {
                listenerfunction(this);
            });
        };

        //Prints the data to the console for debugging purposes
        this.log = function () {
            columnList.forEach(function (columnName) {
                console.log(this[columnName]);
            });
        };

    };

    //Adds a data row to the table. If a second argument is specified, 
    //it gets passed in as a listener function.
    //Returns the newly-added row.
    this.addRow = function () {
        var newRow = new this.RowData();
        this.rows.push(newRow);
        console.log("Adding row " + this.rows.length);
        return newRow;
    };

    //Returns an array with all the rows for which the "columnName" value contains "data". 
    //If "columnName" holds an array, includes the row in the return values if that array contains "data".
    this.getRows = function (columnName, data) {
        if (columnName && data) {
            var matchingRows = [];
            this.rows.forEach(function (row) {
                if (row[columnName].isArray()) {
                    if (row[columnName].contains(data))
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
        console.log("There are " + i + " rows of data.");
    };

    // the options for a drop down in the key column
    this.columnOptions = {
        "Catalog": ["-","1", "2", "3"],
        "Impacted Rights": ["right to Internet", "right to pizza", "right to sleep"],
        "Impacted Rights-Holders": ["colin", "chris", "poulami"],
        "Topic": ["topic", "topcana", "topdog"],
        "Module":["sun","mooon","stars"]
    }

    // a getter for ColumnOptions
    this.getColumnOptions = function (column) {
        if (this.columnOptions.hasOwnProperty(column)) {
            return this.columnOptions[column];
        } else {
            console.log("column: " + column + " not found");
            return [];
        }
    }

}