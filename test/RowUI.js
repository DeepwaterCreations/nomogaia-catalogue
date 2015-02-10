function isInt(n) {
    return (typeof n == 'number' && n % 1 === 0);
}

var toColumnName = function (column) {
    return column.replace(/ /g, '_');
}


function RowUI(table,rowData) {
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
            return '<td><select class="' + toColumnName(column) + '" style="width:100px"></select></td>';
        } else if (column == "Category") {
            return '<td><select  class="' + toColumnName(column) + '" style="width:200px"/></td>';
        } else if (column == "Sub-Category") {
            return '<td><select  class="' + toColumnName(column) + '" style="width:200px"/></td>';
        } else if (column == "Topic") {
            return '<td><select  class="' + toColumnName(column) + '" style="width:400px"/></td>';
        } else if (column == "Input") {
            return '<td><input class="' + toColumnName(column) + '" type="text" value=""></td>';
        } else if (column == "Module") {
            return '<td><select  class="' + toColumnName(column) + '"/></td>';
        } else if (column == "Source") {
            return '<td><input class="' + toColumnName(column) + '" type="text" value=""></td>';
        } else if (column == "Impacted Rights") {
            return '<td><select  class="' + toColumnName(column) + '" multiple="multiple" style="width:100px"/></td>';
        } else if (column == "Impacted Rights-Holders") {
            return '<td><select  class="' + toColumnName(column) + '" multiple="multiple" style="width:100px"/></td>';
        } else if (column == "Score") {
            return '<td><input class="' + toColumnName(column) + '" type="number" value=""></td>';
        } else if (column == "Monitor") {
            return '<td><div  class="' + toColumnName(column) + '"></div></td>';
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

    this.table.body.append(this.genHTMLString());

    this.getRow = function () {
        return table.getTable().find('#' + this.id);
    };

    //Gets the html elements for the row
    this.get = function (column) {
        return this.getRow().find('.' +toColumnName(column));
    };
    
    // private
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
            return this.get(column).val();
        } else if (column == "Monitor") {
            return this.get(column).text();
        } else{
            console.log("column: " + column + " not found");
            return '';
        }
    };
    // private
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
            this.get(column).val(value);
        } else if (column == "Monitor") {
            console.log("Colin - tried to set Monitor to: " + value);
            this.get(column).text(value);
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
    this.toSelect2 = function (className) {
        if (rowData == undefined) {
            var backingList = this.table.owner.dataOptions.getColumnOptions(className);
        } else {
            var backingList = [rowData.getData(className)];
        }

        // make the className a awesome multiselect
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
        var backingList = this.table.owner.dataOptions.getColumnOptions(className);
        // make classname a select2
        this.get(className).select2({
            data: backingList,
            tags: true,
        });

        this.get(className).on("select2:select", generateOnSelect(className, backingList));
    }

    this.toSelect2WithAdd("Impacted Rights-Holders");
    this.toSelect2WithAdd("Impacted Rights");
    this.toSelect2WithAdd("Module");

    // if we have data update the UI to match
    if (rowData != undefined) {
        // if there are new values in rights/rights holders/module we want to add them
        var that = this;
        ["Impacted Rights-Holders", "Impacted Rights", "Module"].forEach(function (column) {
            if (rowData.getData(column) != "UNINITIALIZED") {
                that.table.owner.dataOptions.update(column, rowData.getData(column));
            }
        });

        columnList.forEach(function (columnName) {
            if (rowData.getData(column) != "UNINITIALIZED") {
            that.setUIValue(columnName, rowData.getData(columnName));
            }
        });
    }
    
    // pass UI changes on to the dataRow
    for (var i in columnList) {
        var column = columnList[i];
        
        this.get(column).change(function(columnName){
            return function () {
                console.log("column changed, name: " + columnName + " value; " + myRow.getUIValue(columnName));
                myRow.data.setData(columnName, myRow.getUIValue(columnName))
            };
        }(column));
            
    }

    this.updateColumnOptions = function (column, list) {
        //remember the old value
        var oldValue = this.get(column).val();
        // unselect what they had selected
        //myRow.get(column).find("option[value='oldValue']").select2("val", "");


        if (list.length == 1) {
            oldValue = list[0];
        }

        //remove everything
        this.get(column)
        .find('option')
        .remove()
        .end();
        
        this.get(column).append('<option value="-">-</option>');
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
            this.get(column).select2("val", oldValue);
        } else {
            // select the new option
            //myRow.get(column).find("option[value='-']").attr("selected", "selected");
        }
    }

    // when catalog updates we need to update everything
    var updateCatalog = function () {
        console.log("catalog updated");

        // everyone one is "-" 
        console.log(this.getValue('Category') + " , " + this.getValue('Sub-Category') + " , " + this.getValue('Topic'));
        if ((this.getValue('Category') == '-') && (this.getValue('Sub-Category')) == '-' && (this.getValue('Topic') == '-')) {
            console.log("updating other columns");

            // first let's update category 
            this.updateColumnOptions('Category', this.table.categoryHierarchy.getCategories(this.getValue('Catalog')));

            // let's update subCategory
            this.updateColumnOptions('Sub-Category', this.table.categoryHierarchy.getSubCategories(this.getValue('Catalog')));

            // let's update topic
            this.updateColumnOptions('Topic', this.table.categoryHierarchy.getTopics(this.getValue('Catalog')));
        }
    };

    // when category updates we need to update catalog too 
    var updateCategory = function () {
        console.log("Category updated");

        // everyone more detailed one is "-" 
        if (this.getValue('Sub-Category') == '-' && this.getValue('Topic') == '-') {

            // first let's update catalog 
            this.updateColumnOptions('Catalog', this.table.categoryHierarchy.getCategoryCatalogs(this.getValue('Category')));

            // let's update subCategory
            this.updateColumnOptions('Sub-Category', this.table.categoryHierarchy.getSubCategories(this.getValue('Catalog'), this.getValue('Category')));

            // let's update topic
            this.updateColumnOptions('Topic', this.table.categoryHierarchy.getTopics(this.getValue('Catalog'), this.getValue('Category')));
        }

    }

    // when subcategory updates we need to update the other columns
    var updateSubCategory = function () {
        console.log("Colin - Sub-Category updated");

        // everyone more detailed one is "-" 
        if (this.getValue('Topic') == '-') {

            // first let's update catalog 
            this.updateColumnOptions('Catalog', this.table.categoryHierarchy.getSubCategoryCatalogs(this.getValue("Sub-Category")));

            // let's update subCategory
            this.updateColumnOptions('Category', this.table.categoryHierarchy.getSubCategoryCategories(this.getValue("Sub-Category")));

            // let's update topic
            this.updateColumnOptions('Topic', this.table.categoryHierarchy.getTopics(this.getValue('Catalog'), this.getValue('Category'), this.getValue("Sub-Category")));
        }
    }

    // when subcategory updates we need to update the other columns
    var updateTopic = function () {
        console.log("Topic updated, new value: " + this.getValue("Topic"));

        // first let's update catalog 
        this.updateColumnOptions('Catalog', this.table.categoryHierarchy.getTopicCatalogs(this.getValue("Topic")));

        // let's update Category
        this.updateColumnOptions('Category', this.table.categoryHierarchy.getTopicCategories(this.getValue("Topic")));

        // let's update Sub-Category
        this.updateColumnOptions('Sub-Category', this.table.categoryHierarchy.getTopicSubCategories(this.getValue("Topic")));
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
                that.setUIValue(columnName,that.data.getData(columnName))
            })
        }
    });

    // if we do not have data update the data to match our UI
    if (rowData == undefined) {
        var that = this;
        columnList.forEach(function (columnName) {
            that.data.setData(columnName, that.getUIValue(columnName));
        });
    }
}