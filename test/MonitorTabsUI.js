

function MonitorTabs() {
    this.tabsDivList = [];
    this.tabsDivAddTabFunctions = [];

    this.addTabLabel = "Add";
    this.newTabLabel = "New Tab";
    this.addTabClass = "addTab"; //Should go in the list item that holds the "Add" tab.
    
    //Closure for keeping track of how many tabs there are.
    this.tabCount = function () {
        count = 1;
        return function () {
            return count++;
        }
    }();

    //When a tabDiv changes tabs, this is called to coordinate between all tabDivs.
    this.changeToTab = function(activatedTab){
        if ($(activatedTab + " " + addTabClass).length > 0) return; //Should we handle the case where a new tab is created here, or elsewhere? Or will that call this automagically through the "activate" event?

        tabsDivList.forEach(function (tabsDiv) {
            //This is confusing. activatedTab is a DOM object, but the activate method
            //takes an index. How do I get that index short of iterating over the DOM
            //until I get a match?

        })
    };

    //Add a new tab, for when the add tab button is clicked.
    this.addTab = function () {
        var count = this.tabCount();
        var id = "newTab" + count;
        var liString = '<li><a href="#' + id + '">' + this.newTabLabel + '</a></li>';
                
        var that = this; //Seriously, though, Javascript? SERIOUSLY?
        this.tabsDivList.forEach(function (tabsDiv) {
            tabsDiv.find('.' + that.addTabClass).before(liString);
            tabsDiv.tabs("refresh");
            tabsDiv.append('<div id="' + id + '"></div>');

            tabsDiv.tabs("option", "active", count);
            tabsDiv.tabs("refresh");
        });
       
        this.tabsDivAddTabFunctions.forEach(function(tabsFunc){
            tabsFunc(id, count);
        });
    }

    //Makes the div a JqueryUI tabs widget, styles it as vertical, and adds it to the list.
    //tabsDivFunc will be called whenever a new tab is added so that each tabDiv can populate the tab appropriately.
    this.addTabsDiv = function (tabsDivID, tabsDivAddTabFunc) {
        this.tabsDivList.push($("#" + tabsDivID).tabs().addClass("ui-tabs-vertical ui-helper-clearfix"));
        $("#" + tabsDivID + " li").removeClass("ui-corner-top").addClass("ui-corner-left");

        //Bind the activate event to a method for making sure all the tabsDivs are linked.
        var that = this;
        $("#" + tabsDivID).tabs({
            activate: function (event, ui) {
                that.changeToTab(ui.newTab);
            }
        })

        //Add the "add tab" tab and binds its click event to the addTab function.
        $("#" + tabsDivID + " ul").append('<li class="' + this.addTabClass + '"><a href="#addMonitorTab">' + this.addTabLabel + '</a></li>'); //TODO: Make #addMonitorTab a var.
        $("#" + tabsDivID).find('.' + this.addTabClass).on("click", function () {
            that.addTab.apply(that);
        });
        $("#" + tabsDivID).tabs("refresh");

        //Add the tabDiv's function to the list.
        this.tabsDivAddTabFunctions.push(tabsDivAddTabFunc);
    }       
};

var monitorTabs = new MonitorTabs();