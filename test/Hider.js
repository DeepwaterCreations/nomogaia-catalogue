﻿function Hider(myTable) {
    this.myTable = myTable;
    this.at = 0;
    this.rows = null;
    this.done = true;

    this.checkNext = function () {
        var row = this.rows[this.at]
        if (row != undefined) {
            var show = true;
            for (var columnIndex in g.columnList) {
                var column = toColumnName(g.columnList[columnIndex]);
                var searchString = this.myTable.getTable().find(".searchInput-" + column).val();
                searchString = (searchString == undefined ? "" : (searchString + "").toUpperCase());
                var columnValue = row.getValue(g.columnList[columnIndex]);
                if (Array.isArray(columnValue)) {
                    var hasMatch = false;
                    for (var index in columnValue) {
                        var currentColumnValue = columnValue[index];
                        currentColumnValue = (currentColumnValue == undefined ? "" : (currentColumnValue + "").toUpperCase());
                        if (currentColumnValue.indexOf(searchString) != -1) {
                            hasMatch = true;
                            break;
                        }
                    }
                    if (!hasMatch) {
                        show = false;
                    }
                } else {
                    if (searchString != "" && columnValue == DataOptions.getDefaultValue(g.columnList[columnIndex])) {
                        show = false;
                    } else {
                        columnValue = (columnValue == undefined ? "" : (columnValue + "").toUpperCase());
                        if (columnValue.indexOf(searchString) == -1) {
                            show = false;
                        }
                    }
                }
                if (!show) {
                    break;
                }
            }
            if (show) {
                row.getRow().show();
            } else {
                row.getRow().hide();
            }
            this.at++;
            if (this.at % 10 == 0) {
                var that = this;
                setTimeout(function () { that.checkNext() }, 0);
            } else {
                this.checkNext()
            }
        } else {
            this.done = true;
        }
    }

    this.hide = function (rows) {
        this.at = 0;
        this.rows = rows;
        if (this.done) {
            var that = this;
            setTimeout(function () { that.checkNext() }, 0);
        }
    }
}