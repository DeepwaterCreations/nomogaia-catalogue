﻿function arraysEqual(a, b) {
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

//Holds the data for a single row.
RowData = function (rowData) {
    this.id = rowDataId++;
    this.child = null;
    this.ui = null;

    // is a dictonary columnName: [listeners...]
    this.listenFunctions = {};

    // a list of functions we are using to listen to the row we are rapping
    this.listeningWith = [];

    this.toOut = function () {
        // we need a unique identifier for each one so we can "point" to other rowData if we have to
        var out = {};
        out["id"] = this.id;
        if (this.rowData == null) {
            var that = this;
            columnList.forEach(function (columnName) {
                out[columnName] = that[columnName];
            });
        } else {
            out["pointsTo"] = this.rowData.id;
        }
        console.log("Colin -toOut - row - me", this);
        console.log("Colin -toOut - row", out);
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

    this.tryUnHook = function(){
        if (this.rowData != null){
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

    this.setData = function (columnName, data) {
        var oldData = this.getData(columnName)

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
            setVisualizationsDirty();
            if (this.rowData != undefined) {
                // since a change has been made we no long are going to look to rowData
                // we are now our own independent grown-up data point!

                var that = this;
                //copy the data over from to data we were wrapping
                columnList.forEach(function (columnName) {
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
        }
    };

    this.setId = function (newId) {
        this.id = newId;
        rowDataId = Math.max(rowDataId, newId + 1);
    }

    if (rowData == undefined) {
        this.rowData = null;
        //add empty data
        var that = this;
        columnList.forEach(function (columnName) {
            that[columnName] = DataOptions.getDefaultValue(columnName);
        });
        // set Monitor
        this.setMonitor();
    } else {
        this.rowData = rowData;
        rowData.child = this;
        var that = this;
        // we want to listen to the changes to the row we are rapping so we pass it listeners that call our listeners
        columnList.forEach(function (columnName) {
            var listner = that.callMyListeners(that, columnName);
            that.listeningWith.push(listner);
            that.rowData.addListener(columnName, listner);
        });
    }


};