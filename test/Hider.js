function Hider() {
}

Hider.at = 0;
Hider.rows = null;
Hider.done = true;

Hider.checkNext = function () {
    var row = Hider.rows[Hider.at]
    if (row != undefined) {
        var show = true;
        for (var columnIndex in columnList) {
            var column = toColumnName(columnList[columnIndex]);
            var searchString = $(".searchInput-" + column).val();
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
        Hider.at++;
        if (Hider.at %10 == 0) {
            setTimeout(function () { Hider.checkNext() }, 0);
        } else {
            Hider.checkNext()
        }
    } else {
        Hider.done = true;
    }
}

Hider.hide = function (rows) {
    Hider.at = 0;
    Hider.rows = rows;
    if (Hider.done) {
        setTimeout(function () { Hider.checkNext() }, 0);
    }
}

