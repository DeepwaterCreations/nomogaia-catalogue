function Hider(myTable) {
    this.myTable = myTable;
    this.at = 0;
    this.rows = null;
    this.done = true;

    this.checkNext = function () {
        var row = this.rows[this.at]
        if (row != undefined) {
            var show = true;
            for (var columnIndex in columnList) {
                var column = toColumnName(columnList[columnIndex]);
                var searchString = this.myTable.getTable().find(".searchInput-" + column).val();
                searchString = (searchString == undefined ? "" : (searchString + "").toUpperCase());
                var columnValue = row.getValue(columnList[columnIndex]);
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
                    if (searchString != "" && columnValue == DataOptions.getDefaultValue(columnList[columnIndex])) {
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

    this.searchTable = function () {
        this.hide(this.myTable.tableUI.rows);
    };
    var that = this;
    this.myTable.getTable().find('.searchInput').keyup(function (e) {
        console.log("Colin", "started a search!");
        setTimeout(that.searchTable());
    });
    this.myTable.getTable().find('.searchInputForm').on('reset', function (e) {
        console.log("Colin", "started a search!");
        setTimeout(that.searchTable());
    });
}