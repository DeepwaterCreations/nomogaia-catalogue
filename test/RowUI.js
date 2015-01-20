var id = 0;

var dataList = {
    "1": ["cats", "dogs", "pigs"],
    "2": ["goats", "monkeys", "rhinos"],
    "3": ["cows", "chickens", "rats"]
};

function RowUI() {
    this.id = id++;

    //var getID = function () {
    //    var id = 0;
    //    return function () {
    //        return id++;
    //    };
    //}(); //Note the parentheses. This anonymous function is actually being called, and getID is its return value, not the function itself. This is apparently a standard Javascript thing even though it seems
    ////stupid that you can't tell if you're getting the function or its return value until you look at the very bottom.
    //this.id = getID();

    this.genHTMLString = function () {
        var HTMLstring = '<tr id=' + this.id + '><td>';
        HTMLstring += '<select class="Catalog"><option value="-">-</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></td><td><select  class="Category"/></td></tr>';
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

    this.get('Category').change(

    function () {
        for (var key in dataList) {
            var obj = dataList[key];
            var at = $.inArray(myRow.getValue('Category'), obj);
            if (at != -1) {
                myRow.setValue('Catalog', key);
                //TODO this will not call
                //this.firstUpdate();
            }
        }
    });

    var updateCatalog = function () {
        //remove everything for id+get
        myRow.get('Category')
            .find('option')
            .remove()
            .end();
        // now add back what we need
        if (myRow.getValue('Catalog') == "-") {
            //todo u
            myRow.get('Category').append('<option value="-">-</option>');
            for (var key in dataList) {
                var obj = dataList[key];
                obj.forEach(function (x1) {
                    myRow.get('Category').append('<option value="' + x1 + '">' + x1 + '</option>');
                });
            }
        } else {
            myRow.get('Category').append('<option value="-">-</option>');
            console.log('myRow: ' + myRow.getValue);
            console.log('Catalog: ' + myRow.get('Catalog'));
            console.log('CatalogValue: ' + myRow.getValue('Catalog'));
            dataList[myRow.getValue('Catalog')].forEach(function (ele) {
                myRow.get('Category').append('<option value="' + ele + '">' + ele + '</option>');
            });
        }
    };

    this.get('Catalog').change(updateCatalog);
    updateCatalog();

    tableUI.rows.push(myRow);
    this.data = tableData.addRow();

    //TODO add the approprate listeners to data
}