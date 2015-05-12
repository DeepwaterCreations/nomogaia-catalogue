//This is the list of column names. Populate the html table from here.
//TODO: This is a stupid place for this. Colin thinks maybe it belongs in TableData. 
var columnList = ["Catalog", "Category", "Sub-Category", "Topic", "Description", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor", "Delete"];

var fs = require("fs");

// load in the topic info
var filename = "TopicInfo515.txt";
var buf = fs.readFileSync(filename, "utf8");
// use it to create a categoryHierarchy
var categoryHierarchy = new CategoryHierarchy(buf);

// add the users own topics
var myTopics = "myTopics.txt";
var myTopicsBuf = fs.readFileSync(myTopics, "utf8");
categoryHierarchy.addSet(myTopicsBuf);


var monitorTables = new MonitorTables(categoryHierarchy);
var table = new Table(monitorTables);
monitorTables.push(table);

addMonitorTabsToImpactedRights(monitorTables)



var onClickAdd = function () {
    var rowAt = null;

    for (var tabIndex in monitorTables.backingData) {
        if (tabIndex >=monitorTabs.getActiveMonitor()) {
            var myTable = monitorTables.backingData[tabIndex];
            if (rowAt == null) {
                rowAt = myTable.addRow();
                rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
            } else {
                var dataAt = rowAt.data;
                var newData = new RowData(dataAt);
                rowAt = myTable.addRow(newData);
            }
        }
    }
};



monitorTabs.addTabsDiv("sideBar", {});

//Opens a dialog with some info about the application and its creators.
function openAboutDialog() {
    $("#aboutDialog").dialog("open");
    $(".ui-dialog").find("button").addClass("blueButton");
}


$(document).ready(function () {

    //Make the about dialog.
    $("#aboutDialog").dialog({
        buttons: [
            {
                text: "Okay",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ],
        autoOpen: false
    });

    //Make the add topic dialog.
    $("#addTopic").dialog({
        buttons: [
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ],
        autoOpen: false,
        width: "90%"
    });

    $("#openAddTopic").click(function () {
        $("#addTopic").dialog("open");
        $(".ui-dialog").find("button").addClass("blueButton");
    })

    //Any span styled with "link" will act as a hyperlink that opens the website specified in its "dest" attribute in a new browser window.
    var gui = require('nw.gui');
    $("span.link").click(function () {
        gui.Shell.openExternal($(this).attr("dest"));
    });

    // we need to add a tab b/f we add any rows
    // when we add rows the look to the tabs for their monitor
    monitorTabs.addTab();

    // we need to add all the rows with module =None to the table
    var topicList = categoryHierarchy.getAllTopics();
    var dataList = []
    topicList.forEach(function (topicInstance) {
        if (topicInstance.module == "None") {
            var data = topicInstance.toData();
            dataList.push(data);
        }
    });

    table.addRowsWrapped(dataList, function () {});

    AddTopic.initFields(monitorTables.dataOptions);

    $('#addRow').click(onClickAdd);
    //Hider.init();
    //$('.CatalogHeader').click(updateSearchColumn);

    $('#tabs').on('tabsactivate', function (event, data) {
        if (event.target === this) { //Filters to make sure this event came from the right source. Without it, we can get tabactivate events from the monitor tabs here as well as the actual page tabs. 
            if (data.newTab[0] === $("#matrixTab")[0]){
                matrix.rebuild(monitorTabs.getActiveMonitor());
            }
            if (data.newTab[0] === $("#impactRatingsTab")[0]){
                rebuildImpactedRights(monitorTables, monitorTabs.getActiveMonitor());
            }
        }
    });

    //$('#catalog').selectmenu();
    //$('#category').selectmenu();
    //$('#subcategory').selectmenu();

    autosave(5 * 60 * 1000); //Minutes * sec/min * ms/sec.
});