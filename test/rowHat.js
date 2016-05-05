// row hat is display data that sits atop a row
// like a hat
rowHat = function () {
    this.onScreen = false;
    this.lastKnowHeight = -1;
    this.filterDetails = null;
}

rowHat.private = {};

rowHat.private.allRowHats = {};

rowHat.getRowHat = function (id) {
    if (!(id in rowHat.private.allRowHats)) {
        rowHat.private.allRowHats[id] = new rowHat();
    }
    return rowHat.private.allRowHats[id];
}

rowHat.clearFilters = function () {
    RowData.forEach(function (row) {
        rowHat.getRowHat(row.id).filterDetails = null;
    })
}
