
var fs = require("fs");

var path = require('path');

var gui = require('nw.gui');

// load in the topic info

var filename = path.join(path.dirname(process.execPath), "TopicInfo.txt");// "TopicInfo515.txt";
var buf = fs.readFileSync(filename, "utf8");
// use it to create a categoryHierarchy
var categoryHierarchy = new CategoryHierarchy(buf);
DataOptions.setCategoryHierarchy(categoryHierarchy);

var monitorTables = new MonitorTables(categoryHierarchy);
var table = new Table(monitorTables);
monitorTables.push(table);

addMonitorTabsToImpactedRights(monitorTables);

monitorTabs.addTabsDiv("#side-bar-monitors", {});

//Opens a dialog with some info about the application and its creators.
function openAboutDialog() {
    $("#aboutDialog").dialog("open");
    $(".ui-dialog").find("button").addClass("blueButton");
}


onload = function () {
    setTimeout(function () {
        gui.Window.get().show();
        gui.Window.get().maximize();
    },10);
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


    //Any span styled with "link" will act as a hyperlink that opens the website specified in its "dest" attribute in a new browser window.
    var gui = require('nw.gui');
    $("span.link").click(function () {
        gui.Shell.openExternal($(this).attr("dest"));
    });

    // we need to add a tab b/f we add any rows
    // when we add rows the look to the tabs for their monitor
    monitorTabs.addTab();

    //AddTopic.initFields();


    //Hider.init();
    //$('.CatalogHeader').click(updateSearchColumn);

    $('#tabs').on('tabsactivate', function (event, data) {
        if (event.target === this) { //Filters to make sure this event came from the right source. Without it, we can get tabactivate events from the monitor tabs here as well as the actual page tabs. 
            if (data.newTab[0] === $("#matrixTab")[0]) {
                matrix.rebuild(monitorTabs.getActiveMonitor());
            }
            if (data.newTab[0] === $("#impactRatingsTab")[0]) {
                rebuildImpactedRights(monitorTables, monitorTabs.getActiveMonitor());
            }
        }
    });

    $('#side-bar-monitors').hide();

    $('#monitor').click(function () {
        $('#side-bar-monitors').toggle();
    });

    //$('#addRowCatalog').click(function () {
    //    var rowAt = null;
    //    for (var tabIndex in monitorTables.backingData) {
    //        if (tabIndex >= monitorTables.getActiveMonitor()) {
    //            var myTable = monitorTables.backingData[tabIndex];
    //            if (rowAt == null) {
    //                rowAt = myTable.addRow();
    //                rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
    //            } else {
    //                var dataAt = rowAt.data;
    //                var newData = new RowData(myTable,"auto","auto","auto", dataAt);
    //                rowAt = myTable.addRow(newData);
    //            }
    //        }
    //    }
    //});

    //setTimeout(function () {
    //    console.log("should be animating!");
    //    $("#splash #sub-title").animate({
    //        opacity: 0,
    //    }, 1000, function () {
    //        $("#splash").hide();
    //    });
    //}, 100000);





    //$('#catalog').selectmenu();
    //$('#category').selectmenu();
    //$('#subcategory').selectmenu();

    SaveLoad.autosave(5 * 60 * 1000); //Minutes * sec/min * ms/sec. 5 * 60 * 1000
});


