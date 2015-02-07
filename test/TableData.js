﻿//Represents the data currently in the table. 
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

    this.toOut = function () {
        var out = [];
        this.rows.forEach(function (row) {
            out.push(row.toOut());
        });
        return out;
    }

    this.populateFromJSON = function (objFromFile) {
        //Start by clearing the existing data.
        this.rows = [];

        var that = this;
        objFromFile[0].forEach(function (objRow) {
            that.addRow(new RowData().populateFromJSON(objRow));
        });
    }

    //Returns an array with all the rows for which the "columnName" value contains "data". 
    //If "columnName" holds an array, includes the row in the return values if that array contains "data".
    this.getRows = function (columnName, data) {
        if (columnName && data) {
            var matchingRows = [];
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

    this.loadFromFile = function (fileName) {
        var fs = require('fs');
        var buf = fs.readFileSync(fileName, "utf8");
        var result = [];
        buf.split("\n").forEach(function (line) {
            line = line.trim();
            if (line != "") {
                result.push(line);
            }
        })
        console.log("Colin", result);
        return result;
    }

    var that = this;

    // the options for a drop down in the key column
    this.columnOptions = {
        "Impacted Rights": that.loadFromFile("Impacted Rights.csv"),
        "Impacted Rights-Holders": that.loadFromFile("Rightsholders.csv"),
        "Module": that.loadFromFile("Module.csv")
    }
    console.log("Colin", this);

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