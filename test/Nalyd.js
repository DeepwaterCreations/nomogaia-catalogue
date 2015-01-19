function nalydMain() {

    //Testing Node.js filesystem stuff
    var fs = require('fs');
  
    var id = 0;

    //This is the list of column names. Populate the html table from here.
    var columnList = ["Project", "Catalog", "Category", "Topic", "Input", "Module", "Source", "Impacted Rights", "Impacted Rights-Holders", "Score", "Monitor"];
    //This next bit of code is for populating the HTML table. I have no idea where, ultimately, this
    //code should live, or what function it ought to be a part of, but for now, it's right here:
    columnList.forEach(function (columnName) {
        var tableID = "myTable";
        $("#" + tableID).find("tr").append("<th>" + columnName + "</th>");
    });

    //This is the meta-data that says what shape the table is, rather than what specific data is currently in
    //the table.
    function TableStructure() {
        this.rows = [];
    }
    var tableStructure = new TableStructure();

    //Represents the data currently in the table. 
    function TableData() {
        //Holds RowData objects.
        this.rows = [];

        //Holds the data for a single row.
        this.RowData = function () {
            //Constructor code
            columnList.forEach(function (columnName) {
                this[columnName] = "UNINITIALIZED";
            });

            //"Class members"
            this.listenFunctions = [];

            this.addListener = function (listenerFunction) {
                this.listenFunctions.push(listenerFunction);
            };

            this.setData = function (columnName, data) {
                this[columnName] = data;
                //Also call the listener functions
                this.listenFunctions.forEach(function (listenerfunction) {
                    listenerfunction(this);
                });
            };

            //Prints the data to the console for debugging purposes
            this.log = function () {
                columnList.forEach(function (columnName) {
                    console.log(this[columnName]);
                });
            };
        };

        //Adds a data row to the table. If a second argument is specified, 
        //it gets passed in as a listener function.
        //Returns the newly-added row.
        this.addRow = function (listenerFunc) {
            this.rows.push(new this.RowData());
            if (listenerFunc !== undefined) {
                this.rows[this.rows.length - 1].addListener(listenerFunc);
            }
            console.log("Adding row " + this.rows.length);
            return this.rows[this.rows.length - 1];
        };

        this.log = function () {
            var i = 0;
            for (var row in this.rows) {
                this.rows[row].log();
                i++;
            }
            console.log("There are " + i + " rows of data.");
        };

    }
    var tableData = new TableData();

    var dataList = {
        "1": ["cats", "dogs", "pigs"],
        "2": ["goats", "monkeys", "rhinos"],
        "3": ["cows", "chickens", "rats"]
    };

    function Row() {
        this.id = id++;

        this.genHTMLString = function () {
            var HTMLstring = '<tr id=' + this.id + '><td>';
            HTMLstring += '<select class="first"><option value="-">-</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></td><td><select  class="second"/></td></tr>';
            return HTMLstring;

        };

        $('#myTable').append(this.genHTMLString());

        this.getRow = function () {
            return $('#' + this.id);
        };
        //Gets the html elements for the row
        this.get = function (column) {
            return this.getRow().find('.' + column);
        };
        this.getValue = function (column) {
            return this.get(column).val();
        };
        this.setValue = function (column, value) {
            return this.get(column).val(value);
        };

        var myRow = this;

        this.get('second').change(

        function () {
            for (var key in dataList) {
                var obj = dataList[key];
                var at = $.inArray(myRow.getValue('second'), obj);
                if (at != -1) {
                    myRow.setValue('first', key);
                    //TODO this will not call
                    //this.firstUpdate();
                }
            }
        });

        var updateFirst = function () {
            //remove everything for id+get
            myRow.get('second')
                .find('option')
                .remove()
                .end();
            // now add back what we need
            if (myRow.getValue('first') == "-") {
                //todo u
                myRow.get('second').append('<option value="-">-</option>');
                for (var key in dataList) {
                    var obj = dataList[key];
                    obj.forEach(function (x1) {
                        myRow.get('second').append('<option value="' + x1 + '">' + x1 + '</option>');
                    });
                }
            } else {
                myRow.get('second').append('<option value="-">-</option>');
                console.log('myRow: ' + myRow.getValue);
                console.log('first: ' + myRow.get('first'));
                console.log('firstValue: ' + myRow.getValue('first'));
                dataList[myRow.getValue('first')].forEach(function (ele) {
                    myRow.get('second').append('<option value="' + ele + '">' + ele + '</option>');
                });
            }
        };

        this.dataUpdate = function () {
            //What should happen when the underlying data is changed?
        }

        this.get('first').change(updateFirst);
        updateFirst();

        tableStructure.rows.push(myRow);
        this.data = tableData.addRow(this.dataUpdate);
    }

    var searchTable = function () {
        console.log("searching table");
        var searchString = $('#searchInput').val();
        console.log(searchString);
        tableStructure.rows.forEach(function (row) {
            console.log(row);
            if (row.getValue('second').indexOf(searchString) > -1) {
                row.getRow().show();
            } else {
                row.getRow().hide();
            }
        });
    };

    var onClickAdd = function () {
        console.log("I was clicked");
        new Row(id);
        tableData.log();
    };

    function onClickSort() {
        console.log("Sort button clicked");

        //Sort the array of rows
        tableStructure.rows.sort(function (firstRow, secondRow) {
            return firstRow.getValue('first') - secondRow.getValue('first');
        });

        //Empty the table and then repopulate it.
        $('myTable').empty();
        tableStructure.rows.forEach(function (row) {
            row.addToTable();
        });

    }

    $('#addRow').click(onClickAdd);
    $('#searchInput').change(searchTable);
    $('#sortButton').click(onClickSort);
}