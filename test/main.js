//Testing Node.js filesystem stuff
var fs = require('fs');

//This is the list of column names. Populate the html table from here.
var columnList = ["Catalog", "Category", "Sub-Category", "Topic", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor"];
//Here's where the tool tips for column headings are specified:
var columnListTooltips = {
    "Catalog" : "Shoeboxes.", 
    "Category": "Does this shirt fit properly?",
    "Sub-Category": "a box in a box",
    "Topic" : "Pants are for demons and breadcrumbs.", 
    "Input" : "SOCKS! SOCKS! SOCKS!", 
    "Module" : "What... are you eating under there?", 
    "Source" : "A watchband for your lovely timepiece.", 
    "Impacted Rights" : "Don't knock my smock, or I'll clean your clock.", 
    "Impacted Rights-Holders" : "The Cat in the Spat", 
    "Score" : "I just wanted an excuse to use the word 'cummerbund'.", 
    "Monitor" : "It's a bowtie. Bowties are cruel." 
};
//This next bit of code is for populating the HTML table. I have no idea where, ultimately, this
//code should live, or what function it ought to be a part of, but for now, it's right here:
columnList.forEach(function (columnName) {
    var tableID = "myTable";
    $("#" + tableID).find("tr").append("<th class='CatalogHeader' title=''>" + columnName + "</th>");
    $("#" + tableID).find("tr").children().last().tooltip({ content: columnListTooltips[columnName] });
});


var filename = "TopicInfo.txt";
var buf = fs.readFileSync(filename, "utf8");//
console.log(buf);

var categoryHierarchy = new CategoryHierarchy(buf);

var table = new Table(categoryHierarchy);

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

    //Sort the array of rows
    table.tableUI.rows.sort(function (firstRow, secondRow) {
        return firstRow.getValue('Catalog') - secondRow.getValue('Catalog');
    });

    //Empty the table and then repopulate it.
    $('myTable').empty();
    table.tableUI.rows.forEach(function (row) {
        row.addToTable();
    });

}

$(document).ready(function () {

    console.log("Colin - ready called")
    // we need to add all the rows with module =None to the table
    var topicList = categoryHierarchy.getTopics();
    //console.log("Colin", topicList);
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

    //Currently updates the matrix on every tab change. 
    //TODO: Make the matrix tab not be the first active one, or else change it so it builds on creation.
    $('#tabs').on('tabsactivate', function (event, data) {
        rebuildMatrix();
    });
    $('#matrixMonitorSelect').selectmenu({
        change: function (event, ui) {
            rebuildMatrix(this.val());
        }
    });

    $('#catalog').selectmenu();
    $('#category').selectmenu();
    $('#subcategory').selectmenu();
});