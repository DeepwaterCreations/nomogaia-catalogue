function MonitorTables(categoryHierarchy) {
    // a list of tables 
    this.backingData = [];
    this.labels = []

    // We're storing the lists of rights and rights-holders that haven't been 
    // hidden for the project in MonitorTables so that they are saved and loaded between
    // sessions.
    this.shownRights = DataOptions.getColumnOptions("Impacted Rights").slice(0);
    this.shownRightsholders = DataOptions.getColumnOptions("Impacted Rights-Holders").slice(0);
    this.resetShownRights = function(){
        this.shownRights = DataOptions.getColumnOptions("Impacted Rights").slice(0);
    };
    this.resetShownRightsholders = function(){
        this.shownRightsholders = DataOptions.getColumnOptions("Impacted Rights-Holders").slice(0);
    };
    this.emptyShownRights = function(){
        this.shownRights = [];
    };
    this.emptyShownRightsholders = function(){
        this.shownRightsholders = [];
    };

    this.getNewestMonitorData = function () {
        return this.backingData[this.backingData.length - 1];
    }

    // dataOptions hold what values a drop can can hold
    //this.dataOptions = new DataOptions(categoryHierarchy);

    this.push = function (table) {
        this.backingData.push(table);
    }

    this.addTable = function (copyFrom, callBack) {
        var newTable = new Table(this);

        if (copyFrom != undefined) {
            var dataList = []
            copyFrom.tableData.rows.forEach(function (row) {
                dataList.push(new RowData(newTable, "auto", row));
            });
            newTable.addRows(dataList, callBack);
        }

        this.push(newTable);

        RecentFiles.setDirty();

        return newTable;
    }

    this.toOut = function () {
        var out = {};
        out.info = {};
        out.info.shownRights = this.shownRights;
        out.info.shownRightsholders = this.shownRightsholders;
        out.monitors = [];
        for (var i = 0; i < this.backingData.length; i++) {
            var monitorObj = {};
            monitorObj.label = this.monitorIntToString(i);
            monitorObj.backingData = this.backingData[i].toOut();
            out.monitors.push(monitorObj);
        }
        return out;
    }

    this.loadFile = function(loaded_data){
        this.clear();
        this.shownRights = loaded_data.info.shownRights;
        this.shownRightsholders = loaded_data.info.shownRightsholders;
        for (var i = 0; i < loaded_data.monitors.length; i++) {
            this.push(createTableFromJSON(loaded_data.monitors, i, this));
            $("#monitorNameField").val(loaded_data.monitors[i].label) //Ensures the new tab gets the proper label.
                monitorTabs.addTab();
        }
        g.setMonitorTables(this);
    };

    this.clear = function () {
        this.backingData = [];
        this.labels = [];
        tableId = 0;
        monitorTabs.clear();
        RowData.clear();
        rowHat.clear();
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
