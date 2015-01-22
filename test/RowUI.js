var dataList = {
    "1": ["cats", "dogs", "pigs"],
    "2": ["goats", "monkeys", "rhinos"],
    "3": ["cows", "chickens", "rats"]
};

function isInt(n) {
    return (typeof n == 'number' && n % 1 === 0);
}


function RowUI(table) {
    this.table = table;
    this.id = table.nextId();
    this.data = table.tableData.addRow();
    var myRow = this;

    this.toColumnName = function(column){
        return column.replace(/ /g, '_');
    }

    function generateOnSelect(className, backingList) {
        return function () {
            console.log(className, backingList);
            //todo remove the old one
            var list = $(this).find('Option');
            for (var option in list) {
                if (isInt(parseInt(option))) {
                    var value = list[option].value;
                    if (backingList.indexOf(value) == -1) {
                        // add to list
                        backingList.push(value);
                        // make the new one stick around
                        $(this).find('option[value="' + value + '"]').removeAttr('data-select2-tag');

                        // add it to the other rights holders lists
                        var rightsHoldersSelectList = $('.' + myRow.toColumnName(className));
                        for (var i = 0; i < rightsHoldersSelectList.length; i++) {
                            var rightsHoldersSelect = rightsHoldersSelectList[i];
                            if (rightsHoldersSelect != $(this)[0]) {
                                $(rightsHoldersSelect).append('<option value="' + value + '">' + value + '</option>');
                            }
                        }
                    }
                }
            }
        }
    }

    this.genHTMLStringElement = function (column) {
        if (column == "Catalog") {
            return '<td><select class="' + this.toColumnName(column) + '" style="width:100px"></select></td>';
        } else if (column == "Category") {
            return '<td><select  class="' + this.toColumnName(column) + '" style="width:100px"/></td>';
        } else if (column == "Topic") {
            return '<td><select  class="' + this.toColumnName(column) + '" style="width:100px"/></td>';
        } else if (column == "Input") {
            return '<td><input class="' + this.toColumnName(column) + '" type="text" value=""></td>';
        } else if (column == "Module") {
            return '<td><select  class="' + this.toColumnName(column) + '"/></td>';
        } else if (column == "Source") {
            return '<td><input class="' + this.toColumnName(column) + '" type="text" value=""></td>';
        } else if (column == "Impacted Rights") {
            return '<td><select  class="' + this.toColumnName(column) + '" multiple="multiple" style="width:100px"/></td>';
        } else if (column == "Impacted Rights-Holders") {
            return '<td><select  class="' + this.toColumnName(column) + '" multiple="multiple" style="width:100px"/></td>';
        } else if (column == "Score") {
            return '<td><input class="' + this.toColumnName(column) + '" type="number" value=""></td>';
        } else if (column == "Monitor") {
            return '<td><select  class="' + this.toColumnName(column) + '"/></td>';
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
        return myRow.getRow().find('.' +this.toColumnName(column));
    };
    // private
    this.getUIValue = function (column) {
        //return myRow.get(column).val();
        if (column == "Catalog") {
            return myRow.get(column).select2("val");
        } else if (column == "Category") {
            return myRow.get(column).select2("val");
        } else if (column == "Topic") {
            return myRow.get(column).select2("val");
        } else if (column == "Input") {

        } else if (column == "Module") {
            return myRow.get(column).select2("val");
        } else if (column == "Source") {

        } else if (column == "Impacted Rights") {

        } else if (column == "Impacted Rights-Holders") {

        } else if (column == "Score") {

        } else if (column == "Monitor") {

        } else {
            console.log("column: " + column + " not found");
            return '';
        }
    };
    // private
    this.setUIValue = function (column, value) {
        //myRow.get(column).val(value);
        if (column == "Catalog") {
            myRow.get(column).select2("val", value);
        } else if (column == "Category") {
            myRow.get(column).select2("val", value);
        } else if (column == "Topic") {
            myRow.get(column).select2("val", value);
        } else if (column == "Input") {

        } else if (column == "Module") {
            myRow.get(column).select2("val", value);
        } else if (column == "Source") {

        } else if (column == "Impacted Rights") {

        } else if (column == "Impacted Rights-Holders") {

        } else if (column == "Score") {

        } else if (column == "Monitor") {

        } else {
            console.log("column: " + column + " not found");
        }
    };
    this.getValue = function (column) {
        return myRow.data.getData(column);
        //return this.get(column).val();
    };
    this.setValue = function (column, value) {
        return myRow.data.setData(column, value);
        //return this.get(column).val(value);
    };

    // makes a select a select2
    this.toSelect2 = function (className) {
        var backingList= this.table.tableData.getColumnOptions(className);

        // make the rightsHolder a awesome multiselect
        this.get(className).select2({
            data: backingList,
        });
    }

    console.log(this);
    this.toSelect2("Catalog");
    this.toSelect2("Category");

    // makes a select a with add
    this.toSelect2WithAdd = function (className) {
        var backingList= this.table.tableData.getColumnOptions(className);

        console.log(className, backingList);
        // make the rightsHolder a awesome multiselect
        this.get(className).select2({
            data: backingList,
            tags: true,
        });

        // when rights holders is updated update the other rows
        this.get(className).on("select2:select", generateOnSelect(className, backingList));
    }

    this.toSelect2WithAdd("Impacted Rights-Holders");
    this.toSelect2WithAdd("Impacted Rights");
    this.toSelect2WithAdd("Topic");
    this.toSelect2WithAdd("Module");

   
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

    table.tableUI.rows.push(myRow);

    //TODO add the approprate listeners to data
}