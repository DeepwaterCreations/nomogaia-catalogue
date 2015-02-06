//Testing Node.js filesystem stuff
var fs = require('fs');

//This is the list of column names. Populate the html table from here.
var columnList = ["Catalog", "Category", "Sub-Category", "Topic", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score"];

var filename = "TopicInfoTest.txt";
var buf = fs.readFileSync(filename, "utf8");//
console.log(buf);

var categoryHierarchy = new CategoryHierarchy(buf);

var monitorTables = new MonitorTables();
var table = new Table(categoryHierarchy);
monitorTables.push(table);

var searchColumn = 'Category';

var updateSearchColumn = function () {
    searchColumn = $(this).text();
}

var searchTable = function () {
    var searchString = $('#searchInput').val();
    table.tableUI.rows.forEach(function (row) {
        if (row.getValue(searchColumn).indexOf(searchString) > -1) {
            row.getRow().show();
        } else {
            row.getRow().hide();
        }
    });
};

var onClickAdd = function () {
    table.addRow();
};

function onClickSort() {
    //
}

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
            myRow.get("Topic").prop("disabled", true);
            myRow.get("Sub-Category").prop("disabled", true);
            myRow.get("Category").prop("disabled", true);
            myRow.get("Catalog").prop("disabled", true);
            //myRow.setUIValue("Module", topicInstance.module);
            //myRow.setUIValue("Source", topicInstance.source);
        }
    });

    $('#addRow').click(onClickAdd);
    $('#searchInput').keyup(searchTable);
    $('#sortButton').click(onClickSort);
    $('.CatalogHeader').click(updateSearchColumn);

    $('#save').click(function () {
        console.log("Colin - toOut",monitorTables.toOut());//JSON.stringify()
    });
    $('#load').click(function () {
        console.log("Colin - row1", monitorTables);//JSON.stringify()
    });

    //TODO: Check event.target or ui.newTab or whatever to make sure the tab being activated is the relevant one.
    $('#tabs').on('tabsactivate', function (event, data) {
        if (event.target === this) { //Filters to make sure this event came from the right source. Without it, we can get tabactivate events from the monitor tabs here as well as the actual page tabs. 
            //if (data.newTab === $("#matrixTab")){ //TODO: This really shouldn't be a hard-coded string. //BUG: It never gets into this condition, and I don't know what data.newTab should be compared to.
            matrix.rebuild(monitorTabs.getActiveMonitor());
            //}
            rebuildImpactedRights(monitorTables, 0);
        }
    });

    $('#catalog').selectmenu();
    $('#category').selectmenu();
    $('#subcategory').selectmenu();

    monitorTabs.addTab();
});