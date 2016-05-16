// row hat is display data that sits atop a row
// like a hat
rowHat = function (id) {
    this.id = id;
    this.onScreen = false;
    this.lastKnowHeight = -1;
    this.filterDetails = null;
    this.show = false;
    this.showAbout = false;
    this.getRootHat = function () {
        var rowData = RowData.getRow(id);
        while (rowData.rowData !== undefined) {
            rowData = rowData.rowData;
        }
        return rowData;
    }
    
}

rowHat.private = {};

rowHat.private.allRowHats = {};

rowHat.getRowHat = function (id) {
    if (!(id in rowHat.private.allRowHats)) {
        rowHat.private.allRowHats[id] = new rowHat(id);
    }
    return rowHat.private.allRowHats[id];
}

rowHat.clearFilters = function () {
    RowData.forEach(function (row) {
        if (row.id === undefined) {
            throw { error: "dis is bad!" };
        }
        rowHat.getRowHat(row.id).filterDetails = null;
    })
}

rowHat.clear = function () {
    rowHat.private.allRowHats = {};
}


