//Holds the data for a single row.
RowData = function (rowData) {

    // is a dictonary columnName: [listeners...]
    this.listenFunctions = {};

    // a list of functions we are using to listen to the row we are rapping
    this.listeningWith = [];

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

    if (rowData == undefined) {
        this.rowData = null;
        //add empty data
        columnList.forEach(function (columnName) {
            this[columnName] = "UNINITIALIZED";
        });
    } else {
        this.rowData = rowData;
        // we want to listen to the changes to the row we are rapping so we pass it listeners that call our listeners
        columnList.forEach(function (columnName) {
            var listner = this.callMyListeners(this, columnName);
            this.listeningWith.push(listner);
            this.rowData.addListener(columnName, listner);
        });
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
                array.splice(index, 1);
                return;
            }
        }
    };

    this.getData = function (columnName) {
        if (this.rowData == undefined) {
            return this[columnName];
        } else {
            return this.getData(columnName);
        }
    };

    this.setData = function (columnName, data) {
        if (this.rowData != undefined) {
            // since a change has been made we no long are going to look to rowData
            // we are now our own independent grown-up data point!

            //copy the data over from to data we were rapping
            columnList.forEach(function (columnName) {
                this[columnName] = this.rowData[columnName];
            });

            // now remove our listeners form rowData
            this.listeningWith.forEach(function (listener) {
                this.rowData.removeListener(listener);
            });

            // stop rapping rowData
            this.rowData = null;
        }
        this[columnName] = data;
        // call the listeners
        if (columnName in this.listenFunctions) {
            this.listenFunctions[columnName].forEach(function (listenerfunction) {
                listenerfunction(this);
            });
        }
    };

    //Prints the data to the console for debugging purposes
    this.log = function () {
        columnList.forEach(function (columnName) {
            console.log(this[columnName]);
        });
    };
};
