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

//Holds the data for a single row.
RowData = function (rowData) {
    this.id = rowDataId++;

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

    this.setMonitor = function () {
        var monitor = 0;
        var at = this;
        while (at.rowData != null) {
            at = at.rowData;
            monitor++;
        }
        if (at != this) {
            monitor += at.getData("Monitor");
        }

        this.rowData = undefined;

        this.setData("Monitor",monitor);
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

            if (this.rowData != undefined) {
                console.log("Colin - breaking link", data, this.getData(columnName));
                // since a change has been made we no long are going to look to rowData
                // we are now our own independent grown-up data point!

                var that = this;
                //copy the data over from to data we were rapping
                columnList.forEach(function (columnName) {
                    that[columnName] = that.rowData.getData(columnName);
                });

                // now remove our listeners form rowData
                this.listeningWith.forEach(function (listener) {
                    that.rowData.removeListener(listener);
                });

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

    if (rowData == undefined) {
        this.rowData = null;
        //add empty data
        var that = this;
        columnList.forEach(function (columnName) {
            that[columnName] = "UNINITIALIZED";
        });
        // set Monitor
        this.setMonitor();
    } else {
        this.rowData = rowData;
        var that = this;
        // we want to listen to the changes to the row we are rapping so we pass it listeners that call our listeners
        columnList.forEach(function (columnName) {
            var listner = that.callMyListeners(that, columnName);
            that.listeningWith.push(listner);
            that.rowData.addListener(columnName, listner);
        });
    }


};