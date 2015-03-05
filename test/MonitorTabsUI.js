function MonitorTabs() {
    //    addTab: function (id, count) { }, //id is the HTML id, count is the index of the new tab.
    //    changeTab: function (newlyActiveTab) { } //newlyActiveTab is the index of the activated tab.
    this.addTabFuncList = [];
    this.changeTabFuncList = [];
    this.tabsDiv = "";


    this.addTabLabel = "Add";
    this.newTabLabel = "Monitor #";
    this.addTabClass = "addTab"; //Should go in the list item that holds the "Add" tab.    
    this.addTabDivID = "AddTabDiv";

    this.tabCount = 0;

    //Returns the index of the active monitor.
    //TODO: In practice, each monitor tab might not have its own monitor.
    //I need a dictionary of tabs to monitors. 
    this.activeTab = 0; //TODO: Should this actually live in MonitorTables?
    this.getActiveMonitor = function () {
        return this.activeTab;
    };

    this.getActiveTable = function () {
        return monitorTables.backingData[this.getActiveMonitor()];
    }
    

    this.getActiveMonitorAsString = function () {
        return monitorTables.labels[this.getActiveMonitor()];
    };

    //Removes all the tabs.
    this.clear = function () {
        this.tabsDiv.find("li").not("." + this.addTabClass).remove(); //We want to keep the "Add" tab, of course.
        this.tabsDiv.find("div").not("#" + this.addTabDivID).remove();
        this.tabCount = 0;
        this.activeTab = 0;
    };

    //When a tabDiv changes tabs, this is called to coordinate between all tabDivs.
    //TODO: This seems to get called too many times when I create a new tab? 
    this.changeToTab = function (source) {
        var newlyActiveTab = $(source).tabs("option", "active");
        if (newlyActiveTab === this.tabCount) return; //I *think* this is the case where it's the "add tab" tab? 
        this.activeTab = newlyActiveTab;
        setVisualizationsDirty();
        this.changeTabFuncList.forEach(function (func) {
            func(newlyActiveTab);
        });
    };


    //Defines the dialog that appears when the add tab is clicked.
    $("#addMonitorDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: [
            {
                text: "Ok",
                click: function () {
                    monitorTabs.addTabCallback();
                    $(this).dialog("close");
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ],
        close: function (event, ui) {
            monitorTabs.tabsDiv.tabs("option", "active", monitorTabs.getActiveMonitor());
        },
        title: "Add New Monitor"
    });
    $(".ui-dialog").find("button").addClass("blueButton");

    //Add a new tab, for when the add tab button is clicked. This function is called by the add monitor dialog
    //when it closes.
    this.addTab = function (event) {         
        var count = this.tabCount++;
        var id = "monitorTab" + count;

        //Label gets the value provided in the dialog, or else makes a default value based on whether this is the first tab.
        var label = ($("#monitorNameField").val() || (count === 0 ? "Initial" : this.newTabLabel + count));
        var liString = '<li><a href="#' + id + '">' + label + '</a></li>'; //TODO: Would it be cool to label monitors with dates?
        monitorTables.labels.push(label);
        $("#monitorNameField").val("");

        this.tabsDiv.find('.' + this.addTabClass).before(liString);
        this.tabsDiv.append('<div id="' + id + '"></div>');
        this.tabsDiv.tabs("refresh");

        this.addTabFuncList.forEach(function (func) {
            func(id, count);
        });

        this.tabsDiv.tabs("option", "active", count); //Switch to the newly-created tab.
    }
    this.addTabCallback = function (that) {
        return function () {
            monitorTables.addTable(monitorTables.backingData[monitorTables.backingData.length - 1]
                , function () { that.addTab.apply(that); }
                );
            
        }
    }(this);

    //Makes the div a JqueryUI tabs widget and styles it as vertical.
    this.addTabsDiv = function (tabsDivID, functionObj) {
        $("#" + tabsDivID).append("<ul></ul>");
        this.tabsDiv = $("#" + tabsDivID).tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
        $("#" + tabsDivID + " li").removeClass("ui-corner-top").addClass("ui-corner-left");
        
        //Bind the activate event to a method for making sure all the tabsDivs are linked.
        var that = this;
        $("#" + tabsDivID).tabs({
            activate: function (event, ui) {
                that.changeToTab(event.target);
            }
        })

        //Add the "add tab" tab and binds its click event to open the add monitor dialog.
        $("#" + tabsDivID + " ul").append('<li class="' + this.addTabClass + '"><a href="#' + this.addTabDivID + '">' + this.addTabLabel + '</a></li>');
        $("#" + tabsDivID).find('.' + this.addTabClass).on("click", function () {
            $("#addMonitorDialog :input").val("");
            $("#monitorNameField").attr("placeholder",  that.newTabLabel + "" + (that.tabCount));
            $("#addMonitorDialog").dialog("open");
        });
        //Also give the add tab a div.
        $("#" + tabsDivID + " ul").after('<div id="' + this.addTabDivID + '"></div>');

        $("#" + tabsDivID).tabs("refresh");

        //Add the functions.
        this.addFunctions(functionObj);
    }

    this.addFunctions = function (functionObj) {
        if ("addTab" in functionObj)
            this.addTabFuncList.push(functionObj.addTab);
        if ("changeTab" in functionObj)
            this.changeTabFuncList.push(functionObj.changeTab);
    }
};

var monitorTabs = new MonitorTabs();