﻿function MonitorTables(categoryHierarchy) {
    // a list of tables 
    this.backingData = [];
    this.labels = []

    this.getNewestMonitorData = function () {
        return this.backingData[this.backingData.length - 1];
    }

    // dataOptions hold what values a drop can can hold
    this.dataOptions = new DataOptions(categoryHierarchy);

    this.push = function (table) {
        this.backingData.push(table);
    }

    this.addTable = function (copyFrom, callBack) {
        var newTable = new Table(this);

        if (copyFrom != undefined) {
            var dataList = []
            copyFrom.tableData.rows.forEach(function (row) {
                dataList.push( new RowData(row));
            });
            newTable.addRows(dataList, callBack);
        }

        this.push(newTable);

        FilenameRememberer.setDirty();

        return newTable;
    }

    this.toOut = function () {
        var out = [];
        for (var i = 0; i < this.backingData.length; i++) {
            var monitorObj = {};
            monitorObj.label = this.monitorIntToString(i);
            monitorObj.backingData = this.backingData[i].toOut();
            out.push(monitorObj);
        }
        return out;
    }

    this.clear = function () {
        this.backingData.forEach(function (table) {
            table.removeTable();
        });
        this.backingData = [];
        this.labels = [];
        tableId = 0;
        monitorTabs.clear();
        return this;
    }

    this.monitorStringToInt = function (string) {
        return monitorTables.labels.indexOf(string);
    };

    this.monitorIntToString = function (int) {
        return monitorTables.labels[int];
    };

    var that = this;
    //this.addMonitorTabEvent = function (that) {
    //    return function (id, count) {
    //        that.addTable(monitorTables.backingData[monitorTables.backingData.length - 1]);
    //    };
    //}(this);

    this.changeMonitorTabEvent = function (that) {
        return function (newlyActiveTab) {
            // do nothing
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