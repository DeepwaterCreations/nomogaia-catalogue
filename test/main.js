//This is the list of column names. Populate the html table from here.
//TODO: This is a stupid place for this. Colin thinks maybe it belongs in TableData. 
var columnList = ["Catalog", "Category", "Sub-Category", "Topic", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor"];

var fs = require("fs");
var filename = "TopicInfoTest.txt";
var buf = fs.readFileSync(filename, "utf8");//
console.log(buf);

var categoryHierarchy = new CategoryHierarchy(buf);

var monitorTables = new MonitorTables(categoryHierarchy);
var table = new Table(monitorTables);
monitorTables.push(table);

addMonitorTabsToImpactedRights(monitorTables)

var searchTable = function () {
    table.tableUI.rows.forEach(function (row) {
        var show = true;
        for (var columnIndex in columnList) {
            var column = toColumnName(columnList[columnIndex]);
            var searchString = $(".searchInput-" + column).val();
            searchString = (searchString == undefined ? "" : (searchString + "").toUpperCase());
            var columnValue = row.getValue(columnList[columnIndex]);
            if (Array.isArray(columnValue)) {
                var brk = false;
                for (var index in columnValue) {
                    var currentColumnValue = columnValue[index];
                    currentColumnValue = (currentColumnValue == undefined ? "" : (currentColumnValue + "").toUpperCase());
                    if (currentColumnValue.indexOf(searchString) != -1) {
                        brk = true;
                        break;
                    }
                }
                if (brk) {
                    break;
                } else {
                    show = false;
                }
            }else{
                columnValue = (columnValue == undefined ? "" : (columnValue+"").toUpperCase());
                console.log("Colin ss: " + searchString + " cv: " + columnValue, row);
                if (columnValue.indexOf(searchString) == -1) {
                    show = false;
                    break;
                }
            }
        }
        if (show) {
            row.getRow().show();
        } else {
            row.getRow().hide();
        }
    
    });
};

var onClickAdd = function () {
    var rowAt = null;
    monitorTables.backingData.forEach(function (myTable) {
        if (rowAt == null) {
            rowAt = myTable.addRow();
        } else {
            var dataAt = rowAt.data;
            var newData = new RowData(dataAt);
            rowAt = myTable.addRow(newData);
        }
    });
};

monitorTabs.addTabsDiv("sideBar", {});

$(document).ready(function () {
    // we need to add all the rows with module =None to the table
    var topicList = categoryHierarchy.getTopics();
    topicList.forEach(function (topicString) {
        var topicInstance = categoryHierarchy.getTopicInstance(topicString);
        if (topicInstance.module == "None") {
            //console.log("Colin", topicInstance);
            var data = topicInstance.toData();
            var myRow = table.addRow(data);
            //myRow.setUIValue("Catalog", topicInstance.catalog);

            //myRow.setUIValue("Category", topicInstance.category);

            //myRow.setUIValue("Sub-Category", topicInstance.subCategory);

            //myRow.setUIValue("Topic", topicInstance.topic);
            //myRow.get("Topic").prop("disabled", true);
            //myRow.get("Sub-Category").prop("disabled", true);
            //myRow.get("Category").prop("disabled", true);
            //myRow.get("Catalog").prop("disabled", true);
            //myRow.setUIValue("Module", topicInstance.module);
            //myRow.setUIValue("Source", topicInstance.source);
        }
    });

    $('#addRow').click(onClickAdd);
    $('.searchInput').keyup(searchTable);
    $('.searchInputForm').on('reset', function (e) {
        setTimeout(searchTable);
    });
    //$('.CatalogHeader').click(updateSearchColumn);

    //TODO: Check event.target or ui.newTab or whatever to make sure the tab being activated is the relevant one.
    $('#tabs').on('tabsactivate', function (event, data) {
        if (event.target === this) { //Filters to make sure this event came from the right source. Without it, we can get tabactivate events from the monitor tabs here as well as the actual page tabs. 
            //if (data.newTab === $("#matrixTab")){ //TODO: This really shouldn't be a hard-coded string. //BUG: It never gets into this condition, and I don't know what data.newTab should be compared to.
            matrix.rebuild(monitorTabs.getActiveMonitor());
            //}
            rebuildImpactedRights(monitorTables, monitorTabs.getActiveMonitor());
        }
    });

    $('#catalog').selectmenu();
    $('#category').selectmenu();
    $('#subcategory').selectmenu();

    monitorTabs.addTab();
});