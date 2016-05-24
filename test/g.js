function g() {
}
g.private = {};
g.private.monitorTables = null;
g.private.callOnMonitorTablesChange = [];
// takes a call back that takes monitorTables
g.onMonitorTablesChange = function (callBack) {
    if (g.private.monitorTables === null) {
        g.private.callOnMonitorTablesChange.push(callBack);
    } else {
        callBack(g.private.monitorTables);
    }
}

g.setMonitorTables = function (monitorTables) {
    g.private.monitorTables = monitorTables;
    for (var i = 0; i < g.private.callOnMonitorTablesChange.length; i++) {
        var func = g.private.callOnMonitorTablesChange[i];
        func(g.private.monitorTables);
    }
}

g.getMonitorTables = function () {
    return g.private.monitorTables;
}

g.getActiveMonitor = function () {
    return g.getMonitorTables().backingData[monitorTabs.getActiveMonitor()];
}

//This is the list of column names. Populate the html table from here.
g.columnList = ["Catalog", "Category", "Sub-Category", "Topic", "Description", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor"];//, "Delete"
