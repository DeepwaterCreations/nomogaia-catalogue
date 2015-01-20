var id = 0;

var dataList = {
    "1": ["cats", "dogs", "pigs"],
    "2": ["goats", "monkeys", "rhinos"],
    "3": ["cows", "chickens", "rats"]
};

function RowUI() {
    this.id = id++;
    this.data = tableData.addRow();
    var myRow = this;

    this.genHTMLStringElement = function (column) {
        if (column == "Catalog") {
            return '<td><select class="Catalog"><option value="-">-</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></td>';
        } else if (column == "Category") {
            return '<td><select  class="Category"/></td>';
        } else if (column == "Topic") {
            return '<td><select  class="Topic"/></td>';
        } else if (column == "Input") {
            return '<td><input class="Input" type="text" value=""></td>';
        } else if (column == "Module") {
            return '<td><select  class="Module"/></td>';
        } else if (column == "Source") {
            return '<td><input class="Source" type="text" value=""></td>';
        } else if (column == "Impacted Rights") {
            return '<td><select  class="Impacted Rights"/></td>';
        } else if (column == "Impacted Rights-Holders") {
            return '<td><select  class="Impacted Rights-Holders"/></td>';
        } else if (column == "Score") {
            return '<td><input class="Source" type="text" value=""></td>';
        } else if (column == "Monitor") {
            return '<td><select  class="Monitor"/></td>';
        } else {
            console.log("column: "+ column +" not found");
            return '';
        }
    }

    // Colin thinks this goes outside the class
    //var getID = function () {
    //    var id = 0;
    //    return function () {
    //        return id++;
    //    };
    //}(); //Note the parentheses. This anonymous function is actually being called, and getID is its return value, not the function itself. This is apparently a standard Javascript thing even though it seems
    ////stupid that you can't tell if you're getting the function or its return value until you look at the very bottom.
    //this.id = getID();

    this.genHTMLString = function () {
        var HTMLstring = '<tr id=' + this.id + '>';
        for (var column in columnList) {
            console.log("looking for: " + columnList[column]);
            HTMLstring += this.genHTMLStringElement(columnList[column]);
        }
        HTMLstring += "</tr>"
        console.log(HTMLstring);
        return HTMLstring;
    };

    $('#myTable').append(this.genHTMLString());

    this.getRow = function () {
        return $('#' + myRow.id);
    };


    //Gets the html elements for the row
    this.get = function (column) {
        return myRow.getRow().find('.' + column);
    };
    // private
    this.getUIValue = function (column) {
        return myRow.get(column).val();
    };
    // private
    this.setUIValue = function (column, value) {
        return myRow.get(column).val(value);
    };
    this.getValue = function (column) {
        return myRow.data.getData(column);
        //return this.get(column).val();
    };
    this.setValue = function (column, value) {
        return myRow.data.setData(column, value);
        //return this.get(column).val(value);
    };

    // when category updates we need to update catalog too 
    var updateCategory = function () {
        myRow.setUIValue(myRow.data.getData("Category"));
        console.log("updateCategory was called");
        //var oldValue = myRow.get('Catalog').val();
        //console.log("oldVale:" + oldValue);
        for (var key in dataList) {
            var obj = dataList[key];
            var at = $.inArray(myRow.getValue('Category'), obj);
            if (at != -1) {
                myRow.setUIValue('Catalog', key);
                myRow.setValue('Catalog', key);
            }
        }
    }
    this.data.addListener('Category', updateCategory);


    // TODO put in a for loop when we have more columns
    this.get('Category').change(function () {
        myRow.data.setData('Category', myRow.getUIValue('Category'))
    });
    this.get('Catalog').change(function () {
        myRow.data.setData('Catalog', myRow.getUIValue('Catalog'))
    });

    // when catalog updates we need to update category too 
    var updateCatalog = function () {
        console.log(myRow);
        myRow.setUIValue(myRow.data.getData("Catalog"));
        console.log("updateCatalog was called");
        //remove everything for id+get
        var oldValue = myRow.get('Category').val();
        console.log("oldVale:"+oldValue);
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
            dataList[myRow.getValue('Catalog')].forEach(function (ele) {
                myRow.get('Category').append('<option value="' + ele + '">' + ele + '</option>');
            });
        }
        // see if the old value is still around:
        console.log(myRow.get("Category"));
        console.log(myRow.get("Category").find("option[value='" + oldValue + "']"));
        if (myRow.get("Category").find("option[value='" + oldValue + "']").lenght != 0) {
            // unselect the old option
            myRow.get("Category").find("option[value='-']").attr("selected", null);
            // select the new option
            myRow.get("Category").find("option[value='" + oldValue + "']").attr("selected", "selected");
            console.log("selecting");
        }
    };
    this.data.addListener('Catalog', updateCatalog);
    //this probably goes in a for loop too someday
    this.data.setData('Catalog',this.getUIValue('Catalog'));
    this.data.setData('Category',this.getUIValue('Category'));

    tableUI.rows.push(myRow);
    

    //TODO add the approprate listeners to data
}