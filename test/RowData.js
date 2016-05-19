function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

//TODO to closure?
var rowDataId = 0;

g.allRowData = {};

//Holds the data for a single row.
RowData = function (table, inId, inModified, rowData) {
    if (inId && inId != "auto") {
        this.id = inId;
        rowDataId = Math.max(rowDataId, inId + 1);
    }else{
        this.id = rowDataId++;
    }

    if (inModified && inModified != "auto") {
        this.modified = inModified;
    } else {
        this.modified = false;
    }

    g.allRowData[this.id] = this;
    this.child = null;
    this.ui = null;
    this.table = table;
    

    // is a dictonary columnName: [listeners...]
    this.listenFunctions = {};

    // a list of functions we are using to listen to the row we are rapping
    this.listeningWith = [];

    this.toOut = function () {
        // we need a unique identifier for each one so we can "point" to other rowData if we have to
        var out = {};
        out["id"] = this.id;
        out["modified"] = this.modified;
        if (this.rowData == null) {
            var that = this;
            g.columnList.forEach(function (columnName) {
                out[columnName] = that[columnName];
            });
        } else {
            out["pointsTo"] = this.rowData.id;
        }
        return out;
    }

    // generates a function that calls our listeners
    this.callMyListeners = function (myRowData, columnName) {
        return function (caller) {
            //Also call the listener functions
            if (columnName in myRowData.listenFunctions) {
                myRowData.listenFunctions[columnName].forEach(function (listenerfunction) {
                    listenerfunction(caller);
                });
            }
        }
    }

    this.hasTerm = function (data) {
        return this.hasTermDetails(data).length != 0;
    }

    // returns detains about where data appears in the row
    // the result is a list of objects
    // each object has:
    //  .columnName: the column it appears in
    //  .data: what was found
    //  .before: the charaters before
    //  .after: the charaters after
    this.hasTermDetails = function (data) {
        var res = [];

        var checkString = function (rowValue, columnName) {
            var pad = 45;
            if (rowValue.toLowerCase().indexOf(data.toLowerCase()) >= 0) {
                var startsAt = rowValue.toLowerCase().indexOf(data.toLowerCase());
                res.push({
                    columnName: columnName,
                    data: rowValue.substring(startsAt, startsAt + data.length),
                    before: (Math.max(startsAt - pad, 0) != 0 ? "..." : "") + rowValue.substring(Math.max(startsAt - pad, 0), startsAt),
                    after: rowValue.substring(startsAt + data.length, Math.min(startsAt + data.length + pad, rowValue.length)) + (Math.min(startsAt + data.length + pad, rowValue.length) != rowValue.length ? "..." : "")
                });
            }
        }


        for (var i = 0; i < g.columnList.length; i++) {
            var columnName = g.columnList[i];
            var rowValue = this.getData(columnName);
            if (rowValue == DataOptions.getDefaultValue(columnName) || rowValue == undefined) {
            } else if (rowValue.constructor === Array) {
                for (var j = 0; j < rowValue.length; j++) {
                    checkString(rowValue[j], columnName);
                }
            } else if (rowValue.toLowerCase().indexOf(data.toLowerCase()) >= 0) {
                checkString(rowValue, columnName);
            }
        }
        return res;
    }

    this.setMonitor = function (val) {
        if (val == undefined) {
            var monitor = 0;
            var at = this;
            while (at.rowData != null) {
                at = at.rowData;
                monitor++;
            }
            if (at != this) {
                monitor += monitorTables.monitorStringToInt(at.getData("Monitor"));
            }

            this.rowData = undefined;

            this.setData("Monitor", monitorTables.monitorIntToString(monitor));
        } else {
            this.setData("Monitor", val);
        }
    }

    this.addListener = function (columnName, listenerFunction) {
        if (listenerFunction[columnName] == undefined) {
            this.listenFunctions[columnName] = [listenerFunction];
        } else {
            this.listenFunctions[columnName].push(listenerFunction);
        }
    };

    this.removeListener = function (listenerFunction) {
        for (var columnName in this.listenFunctions) {
            var index = this.listenFunctions[columnName].indexOf(listenerFunction);
            if (index > -1) {
                this.listenFunctions[columnName].splice(index, 1);
                return;
            }
        }
    };

    this.getData = function (columnName) {
        if (this.rowData == undefined) {
            return this[columnName];
        } else {
            return this.rowData.getData(columnName);
        }
    };

    this.delete = function() {
        console.log("erase me");
        this.tryUnHook();

        var at = table.tableData.rows.indexOf(this);
        if (at != -1) {
            table.tableData.rows.splice(at, 1);
        }

        // delete monitors looking back to that
        if (this.child != null) {
            this.child.ui.delete();
        }
    }

    this.tryUnHook = function () {
        if (this.rowData != null) {
            this.unHook();
        }
    }

    this.unHook = function (columnName) {
        // now remove our listeners form rowData
        this.listeningWith.forEach(function (listener) {
            that.rowData.removeListener(listener);
        });

        // tell our source that we are no longer it's monitor
        this.rowData.child = null;
    }

    //Helper functions so we can add new rights/rightsholders without clobbering
    //the existing rights or fussing around with the stuff this function
    //does every single time. 
    this.addRights = function (rights) {
        var current_rights = this.getData("Impacted Rights") || [];
        var next_rights = [];
        for (var i = 0; i < current_rights.length; i++) {
            next_rights.push(current_rights[i]);
        }
        for (var i = 0; i < rights.length; i++) {
            if (next_rights.indexOf(rights[i]) == -1) {
                next_rights.push(rights[i]);
            }
        }
        this.setData("Impacted Rights", next_rights);
    };
    this.addRightsholders = function (rightsholders) {
        var current_rightsholders = this.getData("Impacted Rights-Holders") || [];
        var next_rightsholders = [];
        for (var i = 0; i < current_rightsholders.length; i++) {
            next_rightsholders.push(current_rightsholders[i]);
        }
        for (var i = 0; i < rightsholders.length; i++) {
            if (next_rightsholders.indexOf(rightsholders[i]) == -1) {
                next_rightsholders.push(rightsholders[i]);
            }
        }
        this.setData("Impacted Rights-Holders", next_rightsholders);
    };

    this.removeRights = function (rights) {
        if (typeof rights === 'string')
            rights = [rights];

        var topic_rights = this.getData("Impacted Rights") || [];
        rights.forEach(function (right) {
            var index = topic_rights.indexOf(right);
            if (index >= 0) {
                topic_rights.splice(index, 1);
            }
        });

        this.setData("Impacted Rights", topic_rights);
    };
    this.removeRightsholders = function (rightsholders) {
        if (typeof rightsholders === 'string')
            rightsholders = [rightsholders];

        var topic_rightsholders = this.getData("Impacted Rights-Holders") || [];
        rightsholders.forEach(function (rightsholder) {
            var index = topic_rightsholders.indexOf(rightsholder);
            if (index >= 0) {
                topic_rightsholders.splice(index, 1);
            }
        });

        this.setData("Impacted Rights-Holders", topic_rightsholders);
    };

    this.acceptDrop = function (type, value) {
        var toAdd = [];
        toAdd.push(value);
        if (type == "Impacted Rights-Holders") {
            this.addRightsholders(toAdd);
        } else if (type == "Impacted Rights") {
            this.addRights(toAdd);
        }
    }

    this.setData = function (columnName, data, updateModified) {
        var oldData = this.getData(columnName)
        updateModified = updateModified || false;

        // we need to know if the data is different
        var changed;

        // if the data is an array we use a different comparision
        if (Array.isArray(data) && Array.isArray(oldData)) {
            changed = !arraysEqual(data, oldData)
        } else {
            changed = data != oldData
        }

        // we only need to do something if the new value is different that the old value
        if (changed) {
            this.modified = this.modified || updateModified;
            setVisualizationsDirty();
            if (this.rowData != undefined) {
                // since a change has been made we no long are going to look to rowData
                // we are now our own independent grown-up data point!

                var that = this;
                //copy the data over from to data we were wrapping
                g.columnList.forEach(function (columnName) {
                    that[columnName] = that.rowData.getData(columnName);
                });

                // remove our referances to us from our source data
                this.unHook();

                //now update Monitor
                //this will stop wrapping rowData for us
                this.setMonitor();

            }
            this[columnName] = data;
            // call the listeners
            if (columnName in this.listenFunctions) {
                this.listenFunctions[columnName].forEach(function (listenerfunction) {
                    listenerfunction(this);
                });
            }

            //This puts a * in the titlebar to inform the user that there are changes to save.
            RecentFiles.setDirty();
        }
    };

    //this.setId = function (newId) {
    //    this.id = newId;
    //    rowDataId = Math.max(rowDataId, newId + 1);
    //}

    if (rowData == undefined) {
        this.rowData = null;
        //add empty data
        var that = this;
        g.columnList.forEach(function (columnName) {
            that[columnName] = DataOptions.getDefaultValue(columnName);
        });
        // set Monitor
        this.setMonitor();
    } else {
        this.rowData = rowData;
        rowData.child = this;
        var that = this;
        // we want to listen to the changes to the row we are wrapping so we pass it listeners that call our listeners
        g.columnList.forEach(function (columnName) {
            var listner = that.callMyListeners(that, columnName);
            that.listeningWith.push(listner);
            that.rowData.addListener(columnName, listner);
        });
    }
};

RowData.getRow = function (id) {
    return g.allRowData[id];
}

// f takes a data row
RowData.forEach = function (f) {
    for (var i = 0; i < rowDataId; i++) {
        // not every u < rowDataId is in g.allRowData
        if (i in g.allRowData) {
            f(g.allRowData[i]);
        }
    }
}

// f takes a data row
RowData.clear = function (f) {
    g.allRowData = {};
}

RowData.getRowList = function () {
    var res = [];
    RowData.forEach(function (row) {
        res.push(row);
    })
    return res;
}