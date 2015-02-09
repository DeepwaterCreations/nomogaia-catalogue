function MonitorTables() {
    // a list of tables 
    this.backingData = [];

    this.push = function (table) {
        this.backingData.push(table);
    }

    this.addTable = function (copyFrom) {
        var newTable = new Table();

        console.log("Colin - copying form:", copyFrom);

        if (copyFrom != undefined) {
            copyFrom.tableData.rows.forEach(function (row) {
                var newRowData = new RowData(row);
                newTable.tableUI.rows.push(new RowUI(newTable, newRowData));
            });
        }

        this.push(newTable);

        return newTable;
    }

    this.toOut = function () {
        var out = [];
        this.backingData.forEach(function (table) {
            out.push(table.toOut());
        });
        return out;
    }

    this.clear = function () {
        this.backingData.forEach(function (table) {
            table.removeTable();
        });
        this.backingData = [];
        return this;
    }

    var that = this;
    //this.addMonitorTabEvent = function (that) {
    //    return function (id, count) {
    //        that.addTable(monitorTables.backingData[monitorTables.backingData.length - 1]);
    //    };
    //}(this);

    this.changeMonitorTabEvent = function (that) {
        return function (newlyActiveTab) {
            // hide all the tables except the currently active one
            console.log("Colin - newlyActiveTab:" + newlyActiveTab);
            that.backingData.forEach(function (table) {
                if (table.id == newlyActiveTab) {
                    console.log("Colin - show table" + table.id);
                    table.getTable().show();
                } else {
                    console.log("Colin - hide table" + table.id);
                    table.getTable().hide();
                }
            });
        }
    }(this);

    this.divID = "catalogMonitorTabs"

    //monitorTabs.addTabsDiv(this.divID, {
        //addTab: this.addMonitorTabEvent,
        //changeTab: this.changeMonitorTabEvent
    //});
    monitorTabs.addFunctions({
        //addTab: this.addMonitorTabEvent,
        changeTab: this.changeMonitorTabEvent
    });
}