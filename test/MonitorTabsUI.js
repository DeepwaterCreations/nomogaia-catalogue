

function MonitorTabs() {
    //this.TabsDiv = {
    //    tabsObj: "",
    //    addTab: function (id, count) { }, //id is the HTML id, count is the index of the new tab.
    //    changeTab: function (newlyActiveTab) { } //newlyActiveTab is the index of the activated tab.
    //};
    this.tabsDivList = []; //Stores tabDivs.


    this.addTabLabel = "Add";
    this.newTabLabel = "New Tab";
    this.addTabClass = "addTab"; //Should go in the list item that holds the "Add" tab.
    
    this.tabCount = 0;

    //Returns the index of the active monitor.
    //TODO: In practice, each monitor tab might not have its own monitor.
    //I need a dictionary of tabs to monitors. 
    this.activeTab = 0;
    this.getActiveMonitor = function () {
        return this.activeTab;
    };

    //When a tabDiv changes tabs, this is called to coordinate between all tabDivs.
    //TODO: This seems to get called too many times when I create a new tab? 
    this.changeToTab = function (source) {
        var newlyActiveTab = $(source).tabs("option", "active");
        if (newlyActiveTab === this.tabCount) return; //I *think* this is the case where it's the "add tab" tab? 
        this.activeTab = newlyActiveTab;
        console.log("Nalyd: activeTab: " + newlyActiveTab);
        console.log("Nalyd: tabCount: " + this.tabCount);

        this.tabsDivList.forEach(function (tabsDiv) {
            //if (tabsDiv.tabsObj.tabs("option", "active") !== newlyActiveTab){ //This if is being false when it shouldn't. I think the tabs("option", "active") is already up to date by the time we get here...? 
                tabsDiv.tabsObj.tabs("option", "active", newlyActiveTab);
                if("changeTab" in tabsDiv) tabsDiv.changeTab(newlyActiveTab);
            //}   
        });
    };

    //Add a new tab, for when the add tab button is clicked.
    $("#addMonitorDialog").dialog({ autoOpen: false, modal: true });
    this.addTab = function (event) {
        var count = this.tabCount++;
        var id = "newTab" + count;
        var liString = '<li><a href="#' + id + '">' + $("#monitorNameField").val() + '</a></li>';
           
        //Tell MonitorTables to create a new table.
        monitorTables.addTable();

        //Update the tabDivs so they display the new tab.
        var that = this; //Seriously, though, Javascript? SERIOUSLY?
        this.tabsDivList.forEach(function (tabsDiv) {
            tabsDiv.tabsObj.find('.' + that.addTabClass).before(liString);
            tabsDiv.tabsObj.append('<div id="' + id + '"></div>');

            tabsDiv.tabsObj.tabs("refresh");
            tabsDiv.tabsObj.tabs("option", "active", count);
            if("addTab" in tabsDiv) tabsDiv.addTab(id, count);
        });
    }
    var that = this;
    $("#addMonitorDialog").on("dialogclose", function () {
        that.addTab.apply(that);
    });

    //Makes the div a JqueryUI tabs widget, styles it as vertical, and adds it to the list.
    //tabsDivFunc will be called whenever a new tab is added so that each tabDiv can populate the tab appropriately.
    this.addTabsDiv = function (tabsDivID, functionObj) {
        var newTabsDiv = {};
        newTabsDiv.tabsObj = $("#" + tabsDivID).tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
        $("#" + tabsDivID + " li").removeClass("ui-corner-top").addClass("ui-corner-left");
        
        //Bind the activate event to a method for making sure all the tabsDivs are linked.
        var that = this;
        $("#" + tabsDivID).tabs({
            activate: function (event, ui) {
                that.changeToTab(event.target);
            }
        })

        //Add the "add tab" tab and binds its click event to the addTab function.
        $("#" + tabsDivID + " ul").append('<li class="' + this.addTabClass + '"><a href="#addMonitorTab">' + this.addTabLabel + '</a></li>'); //TODO: Make #addMonitorTab a var.
        $("#" + tabsDivID).find('.' + this.addTabClass).on("click", function () {
            $("#addMonitorDialog").dialog("open");
        });
        //Also give the add tab a div.
        $("#" + tabsDivID + " ul").after('<div id="addMonitorTab"></div>'); //TODO: Still make #addMonitorTab a var.

        $("#" + tabsDivID).tabs("refresh");

        //Add the functions.
        newTabsDiv.addTab = (functionObj.addTab || function () { });
        newTabsDiv.changeTab = (functionObj.changeTab || function () { });

        this.tabsDivList.push(newTabsDiv);
    }
};

var monitorTabs = new MonitorTabs();