//var dataList = {
//    "1": ["cats", "dogs", "pigs"],
//    "2": ["goats", "monkeys", "rhinos"],
//    "3": ["cows", "chickens", "rats"]
//};

function isInt(n) {
    return (typeof n == 'number' && n % 1 === 0);
}


function RowUI(table,rowData) {
    this.table = table;
    this.id = table.nextId();
    if (rowData == undefined) {
        this.data = table.tableData.addRow();
    } else {
        this.data = rowData;
        this.table.tableData.addRow(rowData)
    }
    
    var myRow = this;

    this.toColumnName = function(column){
        return column.replace(/ /g, '_');
    }

    function generateOnSelect(className, backingList) {
        return function () {
            //todo remove the old one
            var list = $(this).find('Option');
            for (var option in list) {
                if (isInt(parseInt(option))) {
                    var value = list[option].value;
                    if (backingList.indexOf(value) == -1) {
                        // add to list
                        backingList.push(value);
                        // make the new one stick around
                        $(this).find("option[value='" + value + "']").removeAttr('data-select2-tag');

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
            return '<td><select  class="' + this.toColumnName(column) + '" style="width:200px"/></td>';
        } else if (column == "Sub-Category") {
            return '<td><select  class="' + this.toColumnName(column) + '" style="width:200px"/></td>';
        } else if (column == "Topic") {
            return '<td><select  class="' + this.toColumnName(column) + '" style="width:400px"/></td>';
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

    this.genHTMLString = function () {
        var HTMLstring = '<tr id=' + this.id + '>';
        for (var column in columnList) {
            HTMLstring += this.genHTMLStringElement(columnList[column]);
        }
        HTMLstring += "</tr>"
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
        } else if (column == "Sub-Category") {
            return myRow.get(column).select2("val");
        } else if (column == "Topic") {
            return myRow.get(column).select2("val");
        } else if (column == "Input") {
            return myRow.get(column).val();
        } else if (column == "Module") {
            return myRow.get(column).select2("val");
        } else if (column == "Source") {
            return myRow.get(column).val();
        } else if (column == "Impacted Rights") {
            return myRow.get(column).select2("val");
        } else if (column == "Impacted Rights-Holders") {
            return myRow.get(column).select2("val");
        } else if (column == "Score") {
            return myRow.get(column).val();
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
        } else if (column == "Sub-Category") {
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
        if (rowData == undefined) {
            var backingList = this.table.tableData.getColumnOptions(className);
        } else {
            var backingList = [rowData.getData(className)];
        }

        // make the rightsHolder a awesome multiselect
        this.get(className).select2({
            data: backingList,
        });
    }

    this.toSelect2("Catalog");
    this.toSelect2("Category");
    this.toSelect2("Sub-Category");
    this.toSelect2("Topic");

    // makes a select a with add
    this.toSelect2WithAdd = function (className) {
        var backingList = this.table.tableData.getColumnOptions(className);
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
    this.toSelect2WithAdd("Module");

    //TODO this probably goes in a for loop someday
    if (rowData != undefined) {
        this.setUIValue('Catalog', this.data.getData('Catalog'));
        this.setUIValue('Category', this.data.getData('Category'));
        this.setUIValue('Sub-Category', this.data.getData('Sub-Category'));
        this.setUIValue('Topic', this.data.getData('Topic'));
        this.setUIValue('Source', this.data.getData('Source'));
        this.setUIValue('Module', this.data.getData('Module'));
    }
    
    for (var i in columnList) {
        var column = columnList[i];
        
        this.get(column).change(function(columnName){
            return function () {
                console.log("column changed, name: " + columnName + " value; " + myRow.getUIValue(columnName));
                myRow.data.setData(columnName, myRow.getUIValue(columnName))
            };
        }(column));
            
    }
    
    //this.get('Catalog').change(function () {
    //    myRow.data.setData('Catalog', myRow.getUIValue('Catalog'))
    //});
    //this.get('Category').change(function () {
    //    myRow.data.setData('Category', myRow.getUIValue('Category'))
    //});

    this.updateColumnOptions = function (column, list) {
        //remember the old value
        var oldValue = myRow.get(column).val();
        // unselect what they had selected
        //myRow.get(column).find("option[value='oldValue']").select2("val", "");


        if (list.length == 1) {
            oldValue = list[0];
        }

        //remove everything
        myRow.get(column)
        .find('option')
        .remove()
        .end();
        
        myRow.get(column).append('<option value="-">-</option>');
        // now add back what we need
        list.forEach(function (ele) {
            myRow.get(column).append('<option value="' + ele + '">' + ele + '</option>');
        });
        // see if the old value is still around:
        //console.log(myRow.get(column));
        //console.log(myRow.get(column).find("option[value='" + oldValue + "']"));
        if (list.indexOf(oldValue)!= -1 ) {
            // select the new option
            //myRow.get(column).find("option[value='" + oldValue + "']").attr("selected", "selected");
            console.log("setting value")
            myRow.get(column).select2("val", oldValue);
        } else {
            // select the new option
            //myRow.get(column).find("option[value='-']").attr("selected", "selected");
        }
    }

    // when catalog updates we need to update everything
    var updateCatalog = function () {
        console.log("catalog updated");

        // everyone one is "-" 
        console.log(myRow.getValue('Category') + " , " + myRow.getValue('Sub-Category') + " , " + myRow.getValue('Topic'));
        if ((myRow.getValue('Category') == '-') && (myRow.getValue('Sub-Category')) == '-' && (myRow.getValue('Topic') == '-')) {
            console.log("updating other columns");

            // first let's update category 
            myRow.updateColumnOptions('Category', myRow.table.categoryHierarchy.getCategories(myRow.getValue('Catalog')));

            // let's update subCategory
            myRow.updateColumnOptions('Sub-Category', myRow.table.categoryHierarchy.getSubCategories(myRow.getValue('Catalog')));

            // let's update topic
            myRow.updateColumnOptions('Topic', myRow.table.categoryHierarchy.getTopics(myRow.getValue('Catalog')));
        }
    };

    // when category updates we need to update catalog too 
    var updateCategory = function () {
        console.log("Category updated");

        // everyone more detailed one is "-" 
        if (myRow.getValue('Sub-Category') == '-' && myRow.getValue('Topic') == '-') {

            // first let's update catalog 
            myRow.updateColumnOptions('Catalog', myRow.table.categoryHierarchy.getCategoryCatalogs(myRow.getValue('Category')));

            // let's update subCategory
            myRow.updateColumnOptions('Sub-Category', myRow.table.categoryHierarchy.getSubCategories(myRow.getValue('Catalog'), myRow.getValue('Category')));

            // let's update topic
            myRow.updateColumnOptions('Topic', myRow.table.categoryHierarchy.getTopics(myRow.getValue('Catalog'), myRow.getValue('Category')));
        }

    }

    // when subcategory updates we need to update the other columns
    var updateSubCategory = function () {
        console.log("Colin - Sub-Category updated");

        // everyone more detailed one is "-" 
        if (myRow.getValue('Topic') == '-') {

            // first let's update catalog 
            myRow.updateColumnOptions('Catalog', myRow.table.categoryHierarchy.getSubCategoryCatalogs(myRow.getValue("Sub-Category")));

            // let's update subCategory
            myRow.updateColumnOptions('Category', myRow.table.categoryHierarchy.getSubCategoryCategories(myRow.getValue("Sub-Category")));

            // let's update topic
            myRow.updateColumnOptions('Topic', myRow.table.categoryHierarchy.getTopics(myRow.getValue('Catalog'), myRow.getValue('Category'), myRow.getValue("Sub-Category")));
        }
    }

    // when subcategory updates we need to update the other columns
    var updateTopic = function () {
        console.log("Topic updated, new value: " + myRow.getValue("Topic"));

        // first let's update catalog 
        myRow.updateColumnOptions('Catalog', myRow.table.categoryHierarchy.getTopicCatalogs(myRow.getValue("Topic")));

        // let's update Category
        myRow.updateColumnOptions('Category', myRow.table.categoryHierarchy.getTopicCategories(myRow.getValue("Topic")));

        // let's update Sub-Category
        myRow.updateColumnOptions('Sub-Category', myRow.table.categoryHierarchy.getTopicSubCategories(myRow.getValue("Topic")));
    }

    //add our listeners
    this.data.addListener('Catalog', updateCatalog);
    this.data.addListener('Category', updateCategory);
    this.data.addListener('Sub-Category', updateSubCategory);
    this.data.addListener('Topic', updateTopic);
    //this probably goes in a for loop too someday
    if (rowData == undefined) {
        //this probably goes in a for loop too someday
        this.data.setData('Catalog', this.getUIValue('Catalog'));
        this.data.setData('Category', this.getUIValue('Category'));
        this.data.setData('Sub-Category', this.getUIValue('Sub-Category'));
        this.data.setData('Topic', this.getUIValue('Topic'));
        this.data.setData('Module', this.getUIValue('Module'));
    }

    //TODO add the approprate listeners to data
}