//Testing Node.js filesystem stuff
var fs = require('fs');

//This is the list of column names. Populate the html table from here.
var columnList = ["Catalog", "Category", "Topic", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor"];
//This next bit of code is for populating the HTML table. I have no idea where, ultimately, this
//code should live, or what function it ought to be a part of, but for now, it's right here:
columnList.forEach(function (columnName) {
    var tableID = "myTable";
    $("#" + tableID).find("tr").append("<th>" + columnName + "</th>");
});

var tableUI = new TableUI();

var tableData = new TableData();

var searchTable = function () {
    console.log("searching table");
    var searchString = $('#searchInput').val();
    console.log(searchString);
    tableUI.rows.forEach(function (row) {
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
    new RowUI(id);
    tableData.log();
};

function onClickSort() {
    console.log("Sort button clicked");

    //Sort the array of rows
    tableUI.rows.sort(function (firstRow, secondRow) {
        return firstRow.getValue('Catalog') - secondRow.getValue('Catalog');
    });

    //Empty the table and then repopulate it.
    $('myTable').empty();
    tableUI.rows.forEach(function (row) {
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