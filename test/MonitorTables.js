function MonitorTables(categoryHierarchy) {
    // a list of tables 
    //Each table in this array is a new monitor.
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

    this.addTable = function (copyFrom) {
        var newTable = new Table(this);

        if (copyFrom != undefined) {
            var dataList = []
            copyFrom.tableData.rows.forEach(function (row) {
                dataList.push(new RowData(newTable, "auto", "auto","auto", row));
            });
            newTable.addRows(dataList);
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

    // returns a string
    this.toCSV = function () {
        var str = "";
        str += RowData.CSVHeader();
        for (var i = 0; i < this.backingData.length; i++) {
            str += this.backingData[i].toCSV();
        }
        return str;
    }


    this.loadCSV = function (str) {
        this.clear();
        var parse_result = Papa.parse(str, { header: true });
        if(parse_result.errors){
            parse_result.errors.forEach(function(error){
                console.error(error.message + " ROW #: " + error.row);
            });
        }
        var loaded_data = parse_result.data;
        var new_monitors = {};
        var new_monitor_names = [];

        for (var i = 0; i < loaded_data.length; i++) {
            var row = loaded_data[i];

            //Put parsed rows into an object keyed by monitor labels.
            //Each monitor label key should have as its value an array of rows representing that monitor.
            //We also maintain an array of monitor labels in order so we can iterate over it in order later.
            var monitorLabel = row["Monitor"];
            if (new_monitors[monitorLabel] === undefined) {
                new_monitors[monitorLabel] = [];
                new_monitor_names.push(monitorLabel);
            } 
            new_monitors[monitorLabel].push(row);
        }

        var prev_monitor = [];
        for(var i = 0; i < new_monitor_names.length; i++){
            var label = new_monitor_names[i];
            var new_monitor = new_monitors[label];

            //Rights and Rights-holders are stored as comma-separated strings, but
            //we'd rather have them as arrays. 
            new_monitor.forEach(function(row){
                if(row["Impacted Rights"] !== ""){
                    row["Impacted Rights"] = row["Impacted Rights"].split(','); 
                }
                if(row["Impacted Rights-Holders"] !== ""){
                    row["Impacted Rights-Holders"] = row["Impacted Rights-Holders"].split(','); 
                }
            });

            if(i === 0){
                var max_id = 0;
                new_monitor.forEach(function(row){
                    //If we imported from JSON, everything would already have IDs, but we aren't
                    //storing that in the CSV, so we'll have to reassign them from scratch. 
                    //Note that RowData (semi-)intelligently sets its own max row id count when it sees a 
                    //number higher than its current max.
                    row.id = row.id || max_id++;
                    row.parentID = row.parentID || -1;
                    //We can't know for sure if a row in the first monitor has been modified, since we have
                    //nothing to compare it to. However, there are some fields we should expect to see as 
                    //certain values if they haven't been modified, so we can at least catch some cases.
                    row.modified = row.modified ||
                        row["Impacted Rights"] !== "" ||
                        row["Impacted Rights-Holders"] !== "" ||
                        row["Score"] !== "-";
                    row.unHooked = row.unHooked || false;
                });
            }else{
                new_monitor = fillFromPreviousMonitor(prev_monitor, new_monitor);
            }
            this.push(createTableFromFile(new_monitor, this));
            prev_monitor = new_monitor;
             
            //Add the UI element to select this monitor 
            $("#monitorNameField").val(label);
            monitorTabs.addTab();
        }
        g.setMonitorTables(this);
    }

    this.loadFile = function (loaded_data) {
        console.log("clearing out old data");
        this.clear();
        this.shownRights = loaded_data.info.shownRights;
        this.shownRightsholders = loaded_data.info.shownRightsholders;
        for (var i = 0; i < loaded_data.monitors.length; i++) {
            var monitorArray = loaded_data.monitors[i].backingData;
            this.push(createTableFromFile(monitorArray, this));
            $("#monitorNameField").val(loaded_data.monitors[i].label); //Ensures the new tab gets the proper label.
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
