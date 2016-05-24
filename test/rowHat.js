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
        var rowData = RowData.getRow(this.id);
        if (rowData === null || rowData === undefined) {
            throw "rowData should be a thing! id: " + this.id;
        }
        while (rowData.rowData !== null && rowData.rowData !== undefined) {
            rowData = rowData.rowData;
        }
        return rowData;
    }

    var row = RowData.getRow(this.id);
    if (row.isHooked()) {
        var rowParentHat = rowHat.getRowHat(row.rowData.id);
        this.lastKnowHeight = rowParentHat.lastKnowHeight;
    }
}

rowHat.private = {};

rowHat.private.allRowHats = {};

rowHat.getRowHat = function (id) {
    if (!(id in rowHat.private.allRowHats)) {
        var newHat =  new rowHat(id);
        rowHat.private.allRowHats[id] = newHat;
        // if we have the parent populate with it's data?
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


