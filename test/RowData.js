//Holds the data for a single row.
RowData = function () {
    //Constructor code
    columnList.forEach(function (columnName) {
        this[columnName] = "UNINITIALIZED";
    });

    //"Class members"
    // is a dictonary columnName: [listeners...]
    this.listenFunctions = {};

    this.addListener = function (columnName, listenerFunction) {
        if (listenerFunction[columnName] == undefined) {
            this.listenFunctions[columnName] = [listenerFunction];
        } else {
            this.listenFunctions[columnName].push(listenerFunction);
        }

    };

    this.getData = function (columnName) {
        return this[columnName];
    };

    this.setData = function (columnName, data) {
        this[columnName] = data;
        //Also call the listener functions
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