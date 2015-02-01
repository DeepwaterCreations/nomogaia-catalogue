//When the tabs change, update the two HTML elements.

function MonitorTabs() {
    this.tabsDivList = [];
    this.tabsDivFunctions = [];

    this.addTabLabel = "Add";
    this.newTabLabel = "New Tab";
    this.addTabClass = "addTab"; //Should go in the list item that holds the "Add" tab.

    ////Generates the ID for the list item in the given tabs div that holds the "Add" tab.
    //this.getAddTabli = function (tabsDivID) {
    //    return tabsDivID + "AddTabli";
    //}


    //Closure for keeping track of how many tabs there are.
    this.tabCount = function () {
        count = 1;
        return function () {
            return count++;
        }
    }();

    //Add a new tab, for when the add tab button is clicked.
    this.addTab = function () {
        var count = this.tabCount();
        var id = "newTab" + count;
        var liString = '<li><a href="#' + id + '">' + this.newTabLabel + '</a></li>';
                
        var that = this; //Seriously, though, Javascript? SERIOUSLY?
        this.tabsDivList.forEach(function (tabsDiv) {
            tabsDiv.find('.' + that.addTabClass).before(liString);
            tabsDiv.tabs("refresh");
            //Call the listener functions?

            tabsDiv.append('<div id="' + id + '"></div>');

            tabsDiv.tabs("option", "active", count);
            tabsDiv.tabs("refresh");
        });
       
        this.tabsDivFunctions.forEach(function(tabsFunc){
            tabsFunc(id, count);
        });

        //This belongs in MatrixUI.
        //var tableTemplate = '<table id="matrixTable' + count + '" border="1"><thead><tr><th></th></tr></thead><tbody></tbody></table>';
                
        //return count;
    }

    //Makes the div a JqueryUI tabs widget, styles it as vertical, and adds it to the list.
    //tabsDivFunc will be called whenever a new tab is added so that each tabDiv can populate the tab appropriately.
    this.addTabsDiv = function (tabsDivID, tabsDivFunc) {
        this.tabsDivList.push($("#" + tabsDivID).tabs().addClass("ui-tabs-vertical ui-helper-clearfix"));
        $("#" + tabsDivID + " li").removeClass("ui-corner-top").addClass("ui-corner-left");

        //Add the "add tab" tab and binds its click event to the addTab function.
        $("#" + tabsDivID + " ul").append('<li class="' + this.addTabClass + '"><a href="#addMonitorTab">' + this.addTabLabel + '</a></li>'); //TODO: Make #addMonitorTab a var.
        var that = this;
        $("#" + tabsDivID).find('.' + this.addTabClass).on("click", function () {
            that.addTab.apply(that);
        });
        $("#" + tabsDivID).tabs("refresh");

        //Add the tabDiv's function to the list.
        this.tabsDivFunctions.push(tabsDivFunc);
    }       
        
    //INITIALIZATION:
    //this.addTabsDiv("monitorTabs");
};

var monitorTabs = new MonitorTabs();