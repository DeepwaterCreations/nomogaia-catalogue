//Here's a handy function to test if an array contains a given element.
//NOPE, just use indexOf, noob!
//Array.prototype.contains = function (data) {
//    return this.forEach(function (element) {
//        if (element === data)
//            return true;
//    });
//};

//Testing Node.js filesystem stuff
var fs = require('fs');

//This is the list of column names. Populate the html table from here.
var columnList = ["Catalog", "Category", "Topic", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor"];
//Here's where the tool tips for column headings are specified:
var columnListTooltips = {
    "Catalog" : "Shoeboxes.", 
    "Category" : "Does this shirt fit properly?", 
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
    $("#" + tableID).find("tr").append("<th title=''>" + columnName + "</th>");
    $("#" + tableID).find("tr").children().last().tooltip({ content: columnListTooltips[columnName] });
});

var table = new Table();

var searchTable = function () {
    console.log("searching table");
    var searchString = $('#searchInput').val();
    console.log(searchString);
    table.tableUI.rows.forEach(function (row) {
        console.log(row);
        if (row.getValue('Category').indexOf(searchString) > -1) {
            row.getRow().show();
        } else {
            row.getRow().hide();
        }
    });
};

var onClickAdd = function () {
    console.log("I was clicked");
    new RowUI(table);
    table.tableData.log();
};

function onClickSort() {
    console.log("Sort button clicked");

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
    $('#addRow').click(onClickAdd);
    $('#searchInput').change(searchTable);
    $('#sortButton').click(onClickSort);

    // code colin is testing
    colinMain();
});