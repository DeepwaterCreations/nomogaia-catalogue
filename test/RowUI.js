function isInt(n) {
    return (typeof n == 'number' && n % 1 === 0);
}

var toColumnName = function (column) {
    return column.replace(/ /g, '_');
}

function format(item) {
    var originalText = item.text;
    return "<div title ='" + originalText + "'>" + originalText + "</div>";
}

function RowUI(table, rowData) {
    this.table = table;
    this.id = table.nextId();
    if (rowData == undefined) {
        this.data = table.tableData.addRow();
    } else {
        this.data = rowData;
        this.table.tableData.addRow(rowData)
    }

    this.data.ui = this;

    this.table.tableUI.rows.push(this);


    //adds a new right or right holder to the existing rights and rights holders list
    this.generateOnSelect = function (className, backingList) {
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
        } else if (column == "Description") {
            return '<td><textarea disabled class="' + toColumnName(column) + ' catalog-readonly catalog-info catalog-input"></textarea></td>';
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
        } else if (column == "Delete") {
            return '<td><input class="blueButton ' + toColumnName(column) + '" type="button" value="Delete" /></td>';
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

    this.addHTML = function () {
        this.table.body.append(this.genHTMLString());
    }

    //get the jquery $() object assocated with this row
    this.myUI = null;
    this.getRow = function () {
        if (this.myUI == null) {
            this.myUI = table.getTable().find('#' + this.id);
        }
        return this.myUI;
    };

    //Gets the html elements for the row
    this.get = function (column) {
        return this.getRow().find('.' + toColumnName(column));
    };

    // private - get data values throught RowData or getValue
    this.getUIValue = function (column) {
        if (column == "Catalog") {
            return this.get(column).val();
        } else if (column == "Category") {
            return this.get(column).val();
        } else if (column == "Sub-Category") {
            return this.get(column).val();
        } else if (column == "Topic") {
            return this.get(column).val();
        } else if (column == "Description") {
            return this.get(column).val();
        } else if (column == "Input") {
            return this.get(column).val();
        } else if (column == "Module") {
            return this.get(column).val();
        } else if (column == "Source") {
            return this.get(column).val();
        } else if (column == "Impacted Rights") {
            return this.get(column).val();
        } else if (column == "Impacted Rights-Holders") {
            return this.get(column).val();
        } else if (column == "Score") {
            return this.get(column).val();
        } else if (column == "Monitor") {
            return this.get(column).val();
        } else {
            console.log("column: " + column + " not found");
            return '';
        }
    };
    // private - set data values throught RowData or setValue
    this.setUIValue = function (column, value) {
        if (column == "Catalog") {
            this.get(column).select2("val", value);
        } else if (column == "Category") {
            this.get(column).select2("val", value);
        } else if (column == "Sub-Category") {
            this.get(column).select2("val", value);
        } else if (column == "Topic") {
            this.get(column).select2("val", value);
        } else if (column == "Description") {
            this.get(column).val(value);
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
        var backingList = []//this.table.owner.dataOptions.getColumnOptions(className);
        //} else {
        //    var backingList = [rowData.getData(className)];
        //
        // make the className a awesome select
        this.get(className).select2({
            data: backingList,
            width: 'resolve',
            formatResult: format,
            formatSelection: format
        });
        if (rowData != undefined) {
            this.setUIValue(className, rowData.getData(className));
        }
    }


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
            this.setUIValue(className, DataOptions.getDefaultValue(className));
        }
    }



    // makes a select a with add
    this.toSelect2WithAdd = function (className) {
        var backingList = this.table.owner.dataOptions.getColumnOptions(className);
        // make classname a select2
        this.get(className).select2({
            data: backingList,
            tags: true
        });

        this.get(className).on("select2:select", this.generateOnSelect(className, backingList));

        if (rowData != undefined) {
            this.setUIValue(className, rowData.getData(className));
        } else {
            this.setUIValue(className, DataOptions.getDefaultValue(className));
        }
    }

    var that = this;

    this.canDelete = function () {
        return true;
    }

    this.delete = function () {
        if (that.canDelete()) {
            // remove it from the DOM
            that.getRow().remove();

            // if our data was a monitor tell it to unHook from it source
            that.data.tryUnHook();
            
            // remove this from the tableUI
            var at = table.tableUI.rows.indexOf(that);
            if (at != -1) {
                table.tableUI.rows.splice(at, 1);
            }
            // remove data form tableData
            var at = table.tableData.rows.indexOf(that.data);
            if (at != -1) {
                table.tableData.rows.splice(at, 1);
            }
            
            // delete monitors looking back to that
            if (that.data.child != null){
                that.data.child.ui.delete();
            }
        }
    }

    this.updateColumnOptions = function (column, list) {
        AddTopic.updateSelectColumnOptions(this.get(column), list);
    }

    // value can be a list, if it is of size one we are it will take it's first element
    this.setColumnSelect = function (column, value) {
        AddTopic.setColumnSelect(this.get(column), value);
    }


    // when catalog updates we need to update everything
    this.updateCatalog = function () {

        // first let's update category 
        that.updateColumnOptions('Category', that.table.owner.dataOptions.categoryHierarchy.getCategories(that.getValue('Catalog')));

        // let's update subCategory
        that.updateColumnOptions('Sub-Category', that.table.owner.dataOptions.categoryHierarchy.getSubCategories(that.getValue('Catalog')));

        // let's update topic
        that.updateColumnOptions('Topic', that.table.owner.dataOptions.categoryHierarchy.getTopics(that.getValue('Catalog')));

    };

    // when category updates we need to update catalog too 
    this.updateCategory = function () {

        if (that.getValue('Category') != "-") {
            // first let's update catalog 
            that.setColumnSelect('Catalog', that.table.owner.dataOptions.categoryHierarchy.getCategoryCatalogs(that.getValue('Category')));
        }

        // let's update subCategory
        that.updateColumnOptions('Sub-Category', that.table.owner.dataOptions.categoryHierarchy.getSubCategories(that.getValue('Catalog'), that.getValue('Category')));

        // let's update topic
        that.updateColumnOptions('Topic', that.table.owner.dataOptions.categoryHierarchy.getTopics(that.getValue('Catalog'), that.getValue('Category')));

    }

    // when subcategory updates we need to update the other columns
    this.updateSubCategory = function () {
        
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
    this.updateTopic = function () {

        
        if (that.getValue('Topic') != "-") {

            // first let's update catalog 
            that.setColumnSelect('Catalog', that.table.owner.dataOptions.categoryHierarchy.getTopicCatalogs(that.getValue("Topic")));

            // let's update Category
            that.setColumnSelect('Category', that.table.owner.dataOptions.categoryHierarchy.getTopicCategories(that.getValue("Topic")));

            // let's update Sub-Category
            that.setColumnSelect('Sub-Category', that.table.owner.dataOptions.categoryHierarchy.getTopicSubCategories(that.getValue("Topic")));

            // we need to set the module to the topics default module 
            var topicInstance = categoryHierarchy.getTopic(that.getValue('Topic'));
            that.data.setData("Description", topicInstance.description);
            that.data.setData("Module", topicInstance.module);
            that.data.setData("Source", topicInstance.source);

        }
    }


    this.init = function (rowData) {


        var start = window.performance.now();

        this.toSelect2final("Catalog");
        this.toSelect2final("Category");
        this.toSelect2final("Sub-Category");
        this.toSelect2final("Topic");

        this.toSelect2AllOptions("Score");

        this.toSelect2WithAdd("Impacted Rights-Holders");
        this.toSelect2WithAdd("Impacted Rights");
        this.toSelect2WithAdd("Module");

        //this.table.timeMakeSelect2 = window.performance.now() - start;
        //var start = window.performance.now();

        // add options to drop downs:
        this.updateColumnOptions('Catalog', this.table.owner.dataOptions.categoryHierarchy.getCatalogs());
        this.updateColumnOptions('Category', this.table.owner.dataOptions.categoryHierarchy.getCategories(this.getValue('Catalog')));
        this.updateColumnOptions('Sub-Category', this.table.owner.dataOptions.categoryHierarchy.getSubCategories(this.getValue('Catalog'), this.getValue('Category')));
        this.updateColumnOptions('Topic', this.table.owner.dataOptions.categoryHierarchy.getTopics(this.getValue('Catalog'), this.getValue('Category'), this.getValue("Sub-Category")));


        //this.table.timeUpdateColumnOptions += window.performance.now() - start;
        //var start = window.performance.now();

        //  if we have data update the UI to match
        if (rowData != undefined) {
            // if there are new values in rights/rights holders/module we want to add them
            var that = this;
            ["Impacted Rights-Holders", "Impacted Rights", "Module"].forEach(function (column) {
                if (rowData.getData(column) != DataOptions.getDefaultValue(column)) {
                    that.table.owner.dataOptions.update(column, rowData.getData(column));
                }
            });

            // push set UI values
            columnList.forEach(function (columnName) {
                if (rowData.getData(columnName) != DataOptions.getDefaultValue(columnName)) {
                    that.setUIValue(columnName, rowData.getData(columnName));
                }
            });
        }

        //this.table.timeUpdateUI += window.performance.now() - start;
        //var start = window.performance.now();

        var that = this;

        // pass UI changes on to the dataRow
        columnList.forEach(function (column) {
            var changef = function () {
                that.data.setData(column, that.getUIValue(column))
            };
            that.get(column).change(changef);
        });


        //this.table.timePassChanges += window.performance.now() - start;
        //var start = window.performance.now();

        //add our listeners
        this.data.addListener('Catalog', this.updateCatalog);
        this.data.addListener('Category', this.updateCategory);
        this.data.addListener('Sub-Category', this.updateSubCategory);
        this.data.addListener('Topic', this.updateTopic);
        //for the rest we loop
        columnList.forEach(function (columnName) {
            if (['Catalog', 'Category', 'Sub-Category', 'Topic'].indexOf(columnName) == -1) {
                that.data.addListener(columnName, function () {
                    that.setUIValue(columnName, that.data.getData(columnName))
                })
            }
        });


        //this.table.timeListenToData += window.performance.now() - start;
        //var start = window.performance.now();

        //if we do not have data update the data to match our UI
        if (rowData == undefined) {
            var that = this;
            columnList.forEach(function (columnName) {
                that.data.setData(columnName, that.getUIValue(columnName));
            });

            // even if row data is undefined we need to set the monitor
            this.setUIValue("Monitor", this.data.getData("Monitor"));
        }


        //this.table.timeUIToData += window.performance.now() - start;
        //var start = window.performance.now();

        this.get('Delete').click(function () {
            $("#deleteDialog").dialog({
                autoOpen: false,
                modal: true,
                buttons: [
                    {
                        text: "Ok",
                        click: function () {
                            that.delete();
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Cancel",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ],
                title: "Delete Topic?"
            });
            $(".ui-dialog").find("button").addClass("blueButton");
            var count = 0;
            var at = that.data;
            while (at.child != null) {
                at = at.child;
                count++;
            }
            $("#deleteDialogText").text("Are you sure you want to delete topic: " );
            $("#deleteDialogTopic").text(""+that.getValue("Topic") )
            $("#deleteDialogTopic").css("font-weight", "Bold");
            $("#deleteDialogMonitors").text("" + (count != 0 ? " and it's " + (count > 1 ? count + " monitors" : " monitor") : "") + "?");
            $("#deleteDialog").dialog("open");
        });
        //this.table.timeDelete += window.performance.now() - start;
    };
}