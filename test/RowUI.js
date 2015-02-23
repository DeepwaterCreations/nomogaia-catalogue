function isInt(n) {
    return (typeof n == 'number' && n % 1 === 0);
}

var toColumnName = function (column) {
    return column.replace(/ /g, '_');
}


function RowUI(table, rowData) {
    this.table = table;
    this.id = table.nextId();
    if (rowData == undefined) {
        console.log("Colin - adding a row", rowData);
        this.data = table.tableData.addRow();
    } else {
        this.data = rowData;
        this.table.tableData.addRow(rowData)
    }

    var myRow = this;


    //adds a new right or right holder to the existing rights and rights holders list
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
                        var rightsHoldersSelectList = $('.' + toColumnName(className));
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
            return '<td><select class="' + toColumnName(column) + ' catalog-dropDown catalog-input" style="width: 100%;"/></td>';
        } else if (column == "Category") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-dropDown catalog-input" style="width: 100%;"/></td>';
        } else if (column == "Sub-Category") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-dropDown catalog-input" style="width: 100%;"/></td>';
        } else if (column == "Topic") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-dropDown catalog-input" style="width: 100%;"/></td>';
        } else if (column == "Input") {
            return '<td><textarea class="' + toColumnName(column) + ' catalog-text catalog-input" type="text" value=""></textarea></td>';
        } else if (column == "Module") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-dropDown catalog-input" style="width: 100%;"/></td>';
        } else if (column == "Source") {
            return '<td><textarea class="' + toColumnName(column) + ' catalog-text catalog-input" type="text" value=""></textarea></td>';
        } else if (column == "Impacted Rights") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-multi catalog-input" multiple="multiple" style="width: 100%;"/></td>';
        } else if (column == "Impacted Rights-Holders") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-multi catalog-input" multiple="multiple" style="width: 100%;"/></td>';
        } else if (column == "Score") {
            return '<td><select  class="' + toColumnName(column) + ' catalog-dropDown catalog-input" style="width: 100%;"/></td>';
        } else if (column == "Monitor") {
            return '<td><textarea disabled class="' + toColumnName(column) + ' catalog-readonly catalog-input"></textarea></td>';
        } else {
            console.log("column: " + column + " not found");
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

    this.table.body.append(this.genHTMLString());

    //get the jquery $() object assocated with this row
    this.getRow = function () {
        return table.getTable().find('#' + this.id);
    };

    //Gets the html elements for the row
    this.get = function (column) {
        return this.getRow().find('.' + toColumnName(column));
    };

    // private - get data values throught RowData or getValue
    this.getUIValue = function (column) {
        //return myRow.get(column).val();
        if (column == "Catalog") {
            return this.get(column).select2("val");
        } else if (column == "Category") {
            return this.get(column).select2("val");
        } else if (column == "Sub-Category") {
            return this.get(column).select2("val");
        } else if (column == "Topic") {
            return this.get(column).select2("val");
        } else if (column == "Input") {
            return this.get(column).val();
        } else if (column == "Module") {
            return this.get(column).select2("val");
        } else if (column == "Source") {
            return this.get(column).val();
        } else if (column == "Impacted Rights") {
            return this.get(column).select2("val");
        } else if (column == "Impacted Rights-Holders") {
            return this.get(column).select2("val");
        } else if (column == "Score") {
            return this.get(column).select2("val");
        } else if (column == "Monitor") {
            return this.get(column).val();
        } else {
            console.log("column: " + column + " not found");
            return '';
        }
    };
    // private - set data values throught RowData or setValue
    this.setUIValue = function (column, value) {
        //myRow.get(column).val(value);
        if (column == "Catalog") {
            this.get(column).select2("val", value);
        } else if (column == "Category") {
            this.get(column).select2("val", value);
        } else if (column == "Sub-Category") {
            this.get(column).select2("val", value);
        } else if (column == "Topic") {
            this.get(column).select2("val", value);
        } else if (column == "Input") {
            this.get(column).val(value);
        } else if (column == "Module") {
            this.get(column).select2("val", value);
        } else if (column == "Source") {
            this.get(column).val(value);
        } else if (column == "Impacted Rights") {
            this.get(column).select2("val", value);
        } else if (column == "Impacted Rights-Holders") {
            this.get(column).select2("val", value);
        } else if (column == "Score") {
            this.get(column).select2("val", value);
        } else if (column == "Monitor") {
            this.get(column).val(value);
        } else {
            console.log("column: " + column + " not found");
        }
    };
    this.getValue = function (column) {
        return this.data.getData(column);
    };
    this.setValue = function (column, value) {
        return this.data.setData(column, value);
    };

    // makes a select a select2
    // if a value is selected don't 
    this.toSelect2final = function (className) {
        //if (rowData == undefined) {
            var backingList = this.table.owner.dataOptions.getColumnOptions(className);
        //} else {
        //    var backingList = [rowData.getData(className)];
        //
        // make the className a awesome select
        this.get(className).select2({
            data: backingList,
            width: 'resolve'
        });
        if (rowData != undefined) {
            this.setUIValue(className, rowData.getData(className));
        }
    }

    this.toSelect2final("Catalog");
    this.toSelect2final("Category");
    this.toSelect2final("Sub-Category");
    this.toSelect2final("Topic");

    // makes a select a select2
    this.toSelect2AllOptions = function (className) {
        var backingList = this.table.owner.dataOptions.getColumnOptions(className);

        // make the className a awesome select
        this.get(className).select2({
            data: backingList,
            width: 'resolve'
        });

        if (rowData != undefined) {
            this.setUIValue(className, rowData.getData(className));
        } else {
            this.setUIValue(className, this.table.owner.dataOptions.getDefaultValue(className));
        }
    }

    this.toSelect2AllOptions("Score");

    // makes a select a with add
    this.toSelect2WithAdd = function (className) {
        var backingList = this.table.owner.dataOptions.getColumnOptions(className);
        // make classname a select2
        this.get(className).select2({
            data: backingList,
            tags: true
        });

        this.get(className).on("select2:select", generateOnSelect(className, backingList));

        if (rowData != undefined) {
            this.setUIValue(className, rowData.getData(className));
        } else {
            this.setUIValue(className, this.table.owner.dataOptions.getDefaultValue(className));
        }
    }

    this.toSelect2WithAdd("Impacted Rights-Holders");
    this.toSelect2WithAdd("Impacted Rights");
    this.toSelect2WithAdd("Module");

    // if we have data update the UI to match
    if (rowData != undefined) {
        // if there are new values in rights/rights holders/module we want to add them
        var that = this;
        ["Impacted Rights-Holders", "Impacted Rights", "Module"].forEach(function (column) {
            if (rowData.getData(column) != monitorTables.dataOptions.getDefaultValue(column)) {
                that.table.owner.dataOptions.update(column, rowData.getData(column));
            }
        });

        columnList.forEach(function (columnName) {
            if (rowData.getData(columnName) != monitorTables.dataOptions.getDefaultValue(columnName)) {
                that.setUIValue(columnName, rowData.getData(columnName));
            }
        });
    }

    // pass UI changes on to the dataRow
    for (var i in columnList) {
        var column = columnList[i];

        this.get(column).change(function (columnName) {
            return function () {
                myRow.data.setData(columnName, myRow.getUIValue(columnName))
            };
        }(column));

    }

    this.updateColumnOptions = function (column, list) {
        AddTopic.updateSelectColumnOptions(this.get(column), list);
    }

    // value can be a list, if it is of size one we are it will take it's first element
    this.setColumnSelect = function (column, value) {
        AddTopic.setColumnSelect(this.get(column), value);
    }

    var that = this;
    // when catalog updates we need to update everything
    var updateCatalog = function () {
        console.log("Colin-1 updateCatalog", that.getValue('Catalog'));

        // first let's update category 
        that.updateColumnOptions('Category', that.table.owner.dataOptions.categoryHierarchy.getCategories(that.getValue('Catalog')));

        // let's update subCategory
        that.updateColumnOptions('Sub-Category', that.table.owner.dataOptions.categoryHierarchy.getSubCategories(that.getValue('Catalog')));

        // let's update topic
        that.updateColumnOptions('Topic', that.table.owner.dataOptions.categoryHierarchy.getTopics(that.getValue('Catalog')));

    };

    // when category updates we need to update catalog too 
    var updateCategory = function () {
        console.log("Colin-1 updateCategory", that.getValue('Category'));

        if (that.getValue('Category')!= "-"){
            // first let's update catalog 
            that.setColumnSelect('Catalog', that.table.owner.dataOptions.categoryHierarchy.getCategoryCatalogs(that.getValue('Category')));
        }

        // let's update subCategory
        that.updateColumnOptions('Sub-Category', that.table.owner.dataOptions.categoryHierarchy.getSubCategories(that.getValue('Catalog'), that.getValue('Category')));

        // let's update topic
        that.updateColumnOptions('Topic', that.table.owner.dataOptions.categoryHierarchy.getTopics(that.getValue('Catalog'), that.getValue('Category')));

    }

    // when subcategory updates we need to update the other columns
    var updateSubCategory = function () {
        console.log("Colin-1 updateSubCategory", that.getValue('Sub-Category'));

        // everyone more detailed one is "-" 
        if (that.getValue('Sub-Category') != '-') {

            // first let's update catalog 
            that.setColumnSelect('Catalog', that.table.owner.dataOptions.categoryHierarchy.getSubCategoryCatalogs(that.getValue("Sub-Category")));

            // let's update subCategory
            that.setColumnSelect('Category', that.table.owner.dataOptions.categoryHierarchy.getSubCategoryCategories(that.getValue("Sub-Category")));
        }

        // let's update topic
        that.updateColumnOptions('Topic', that.table.owner.dataOptions.categoryHierarchy.getTopics(that.getValue('Catalog'), that.getValue('Category'), that.getValue("Sub-Category")));

    }

    // when subcategory updates we need to update the other columns
    var updateTopic = function () {

        console.log("Colin-1 updateTopic", that.getValue('Topic'));

        //TODO work in progress
        var topicInstance = that.table.owner.dataOptions.categoryHierarchy.getTopic(that.getValue("Topic"));
        if (topicInstance != null) {
            that.get("Topic").tooltip({ content: topicInstance.description });
        }

        if (that.getValue('Topic') != "-") {

            // first let's update catalog 
            that.setColumnSelect('Catalog', that.table.owner.dataOptions.categoryHierarchy.getTopicCatalogs(that.getValue("Topic")));

            // let's update Category
            that.setColumnSelect('Category', that.table.owner.dataOptions.categoryHierarchy.getTopicCategories(that.getValue("Topic")));

            // let's update Sub-Category
            that.setColumnSelect('Sub-Category', that.table.owner.dataOptions.categoryHierarchy.getTopicSubCategories(that.getValue("Topic")));
        }
    }

    //add our listeners
    this.data.addListener('Catalog', updateCatalog);
    this.data.addListener('Category', updateCategory);
    this.data.addListener('Sub-Category', updateSubCategory);
    this.data.addListener('Topic', updateTopic);
    //for the rest we loop
    var that = this;
    columnList.forEach(function (columnName) {
        if (['Catalog', 'Category', 'Sub-Category', 'Topic'].indexOf(columnName) == -1) {
            that.data.addListener(columnName, function () {
                console.log("Colin - data changed, name: " + columnName + " value; " + that.data.getData(columnName));
                that.setUIValue(columnName, that.data.getData(columnName))
            })
        }
    });

    // if we do not have data update the data to match our UI
    if (rowData == undefined) {
        var that = this;
        columnList.forEach(function (columnName) {
            that.data.setData(columnName, that.getUIValue(columnName));
        });

        // even if row data is undefined we need to set the monitor
        this.setUIValue("Monitor", this.data.getData("Monitor"));
    }
}