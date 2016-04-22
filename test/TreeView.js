g.aspenApp.controller('treeController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.tableData = null;
    $scope.filteredTree = {};
    $scope.filteredList = [];
    $scope.search = "";

    g.onMonitorTablesChange(function (monitorTables) {
        $timeout(function () {
            $scope.tableData = monitorTables.backingData[0].tableData;
            $scope.tableData.onAddRow(function () {
                // info angular of changes
                $timeout(function () {
                    $scope.tableData = $scope.tableData;
                })
            });

            $scope.filteredTree = $scope.tableData.treeView;
            $scope.filteredList = $scope.tableData.rows;
            $scope.rightslist = function () {
                return DataOptions.columnOptions["Impacted Rights"];
            }
            $scope.rightsholderlist = function () {
                return DataOptions.columnOptions["Impacted Rights-Holders"];
            }
            $scope.moduleList = function () {
                return DataOptions.columnOptions["Module"];
            }
            $scope.scorevals = DataOptions.columnOptions["Score"];
            console.log("TableData set!", $scope.tableData);

            var timeoutId ="";

            $(".main").scroll(function (event) {
                clearTimeout(timeoutId);
                timeoutId= setTimeout(function () {
                    // do something
                    $timeout(function () {
                        console.log("I did it!");
                        var rows = $(".hasRowID");
                        var rowCount = 0;

                        for (var i = 0 ; i < rows.length; i++) {
                            var row = $(rows[i]);
                            var rowId = row.data("row");
                            var rowData = RowData.getRow(parseInt(rowId));
                            var lastOnScreen = rowData.onScreen;
                            rowData.onScreen = Util.checkVisible(row[0],100);
                            if (lastOnScreen && !rowData.onScreen) {
                                row.height(row.height());
                            }
                            if (!lastOnScreen && rowData.onScreen) {
                                row.height("auto");
                            }
                            if (rowData.onScreen) {
                                rowCount++;
                            }
                        }
                        // TODO we seem to be showing a random number of rows
                        console.log(rowCount);
                    });
                }, 500);
            })

            // TODO this does not work
            $(".main").trigger("scroll");
        });
    })

    // Colin, this seems like a really slow way
    $scope.updateFilteredRows = function (x) {
        var filteredRows = $scope.tableData.filterRows(x)
        $scope.filteredTree = {};
        $scope.filteredList = filteredRows;
        for (var i = 0; i < filteredRows.length; i++) {
            var newRow = filteredRows[i];
            if (!(newRow.getData("Catalog") in $scope.filteredTree)) {
                $scope.filteredTree[newRow.getData("Catalog")] = {};
            }
            if (!(newRow.getData("Category") in $scope.filteredTree[newRow.getData("Catalog")])) {
                $scope.filteredTree[newRow.getData("Catalog")][newRow.getData("Category")] = {};
            }
            if (!(newRow.getData("Sub-Category") in $scope.filteredTree[newRow.getData("Catalog")][newRow.getData("Category")])) {
                $scope.filteredTree[newRow.getData("Catalog")][newRow.getData("Category")][newRow.getData("Sub-Category")] = [];
            }
            $scope.filteredTree[newRow.getData("Catalog")][newRow.getData("Category")][newRow.getData("Sub-Category")].push(newRow);

        }
    }

    $scope.filtered = function (topic) {
        return $scope.search == "" || topic.hasTerm($scope.search);
    }

    //Row Edit UI

    //Retrieve lists of current rights and rights-holders for a given topic (RowData).
    $scope.getCurrentRights = function (rowData) {
        return rowData.getData("Impacted Rights");
    };
    $scope.getCurrentRightsholders = function (rowData) {
        return rowData.getData("Impacted Rights-Holders");
    };
    $scope.getModules = function (rowData) {
        return rowData.getData("Module");
    };

    $scope.addNewCatalog = function(catalog) {
        $timeout(function () {
            $scope.tableData.treeView[catalog] = {};
        });
    }
    $scope.isNewCatalog = function (catalog) {
        return $scope.tableData.treeView[catalog] !== undefined;
    }
    $scope.addNewCategory = function (catalog,catagory) {
        $timeout(function () {
            $scope.tableData.treeView[catalog][catagory] = {};
        });
    }
    $scope.isNewCategory = function (catalog, catagory) {
        return $scope.tableData.treeView[catalog][catagory] !== undefined;
    }
    $scope.addNewSubCategory = function (catalog, catagory, subCatagory) {
        $timeout(function () {
            $scope.tableData.treeView[catalog][catagory][subCatagory] = {};
        });
    }
    $scope.isNewSubCategory = function (catalog, catagory, subCatagory) {
        return $scope.tableData.treeView[catalog][catagory][subCatagory] !== undefined;
    }

    $scope.addNewTopic = function (catalog, category, subCategory, topic) {
        //??
        $timeout(function () {
            // add a row
            var rowAt = null;

            var myTopic = new Topic(catalog, category, subCategory, topic, "", DataOptions.getDefaultValue("Module"), "");
            for (var tabIndex in g.getMonitorTables().backingData) {
                if (tabIndex >= monitorTabs.getActiveMonitor()) {
                    var myTable = g.getMonitorTables().backingData[tabIndex];
                    if (rowAt == null) {
                        rowAt = myTable.addRow(myTopic.toData());
                        rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
                    } else {
                        var dataAt = rowAt.data;
                        var newData = new RowData(dataAt);
                        rowAt = myTable.addRow(newData);
                    }
                }
            }
        });
    }
    $scope.isNewTopic = function (catalog, catagory, subCatagory,topic) {
        return false;
    }

    $scope.addNewMod = function (newMod) {
        var list = $scope.moduleList();
        if (list.indexOf(newMod) == -1) {
            list.push(newMod);
        }
    }
    $scope.addNewRight = function (newRight) {
        var list = $scope.rightslist();
        if (list.indexOf(newRight) == -1) {
            list.push(newRight);
        }
    }
    $scope.addNewRightHolder = function (newRightHolder) {
        var list = $scope.rightsholderlist();
        if (list.indexOf(newRightHolder) == -1) {
            list.push(newRightHolder);
        }
    }

    //Add a right or rightsholder to the topic.
    $scope.addRight = function (rowData, rightname) {
        rowData.addRights(rightname);

    }
    $scope.addRightsholder = function (rowData, rightsholdername) {
        rowData.addRightsholders(rightsholdername);
    };

    //Or remove one.
    $scope.removeRight = function (rowData, rightname) {
        rowData.removeRights(rightname);
    };
    $scope.removeRightsholder = function (rowData, rightsholdername) {
        rowData.removeRightsholders(rightsholdername);
    };

    $scope.getScoreCategoryClass = getScoreCategoryClass; //What's with this global BS

    //A function that returns a function that is a getterSetter for the given topic (RowData).
    $scope.getSetData = function (rowData, columnName) {
        return function (data) {
            if (arguments.length) {
                //Set
                console.log("set to " + data);
                rowData.setData(columnName, data);
                console.log("result " + rowData.getData(columnName));
            }
            else {
                //Get
                var getval = rowData.getData(columnName);
                return getval;
            }
        };
    };

    $scope.init = function () {
        // resize
        var dragging = false;
        var startX = 0;
        $('#drag-bar').mousedown(function (e) {
            e.preventDefault();
            startX = e.pageX;
            dragging = true;
            var main = $('#tree-view .main');
            var ghostbar = $('<div>',
                             {
                                 id: 'ghostbar',
                                 css: {
                                     height: main.outerHeight(),
                                     top: main.offset().top,
                                     left: main.offset().left
                                 }
                             }).appendTo('#tree-view');

            ghostbar.css("left", e.pageX);
            $(document).mousemove(function (e) {
                ghostbar.css("left", e.pageX);
            });
        });

        $(document).mouseup(function (e) {
            if (dragging) {
                console.log(" width: " + $('#side-bar-rights').css("width") + " startX: " + startX + " e.pageX: " + e.pageX, e)
                $('#side-bar-rights').css("width",
                    ($('#side-bar-rights').width() +
                    startX - e.pageX) + "px");
                //$('#main').css("left", e.pageX + 2);
                $('#ghostbar').remove();
                $(document).unbind('mousemove');
                dragging = false;
            }
        });

        $("#addTopic").dialog({
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                }, {
                    id:"addTopicButton",
                    text: "Ok",
                    click: function () {
                        if (AddTopic.canAdd()) {
                            AddTopic.addTopic();
                            $(this).dialog("close");
                        } else {
                            AddTopic.highlightIncomplete();
                        }
                        
                    }
                }
            ],
            autoOpen: false,
            width: "90%"
        });

        $(".openAddTopic").click(function () {
            $("#addTopic").dialog("open");
            $(".ui-dialog").find("button").addClass("blueButton");
            AddTopic.canAdd();
        })

        $('#addRowTree').click(function () {
            //var rowAt = null;
            //for (var tabIndex in g.getMonitorTables().backingData) {
            //    if (tabIndex >= g.getMonitorTables().getActiveMonitor()) {
            //        var myTable = g.getMonitorTables().backingData[tabIndex];
            //        if (rowAt == null) {
            //            rowAt = myTable.addRow();
            //            rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
            //        } else {
            //            var dataAt = rowAt.data;
            //            var newData = new RowData(dataAt);
            //            rowAt = myTable.addRow(newData);
            //        }
            //    }
            //}
        });
    }


    g.drag = function (event) {
        //console.log("drag!", event);
        event.dataTransfer.setData("type", event.target.dataset.type);
        event.dataTransfer.setData("value", event.target.dataset.value);
    }

    g.drop = function (event) {
        event.preventDefault();
        var type = event.dataTransfer.getData("type");
        var value = event.dataTransfer.getData("value");
        var at = event.target;
        while (at.className.indexOf("hasRowID") === -1) {
            at = at.parentElement;
        }
        var row = at.dataset.row;
        //console.log("drop! type: " + type + " value:" + value + " rowId: " + row, event);
        $timeout(function () {
            RowData.getRow(parseInt(row)).acceptDrop(type, value);
        })

    }

    g.allowDrop = function (event) {
        //console.log("allow Drop!",event);
        event.preventDefault();
    }

    this.addMonitorTabEvent = function (that) { //Is this the best way to ensure I still have the right "this" available when the function is called remotely? Probably not, but it works.
        return function (id, count) {
        };
    }(this);

    this.changeMonitorTabEvent = function (that) {
        return function (newlyActiveTab) {
            //console.log("newly active tab:", monitorTables.backingData[newlyActiveTab]);
            $timeout(function () {
                $scope.tableData = monitorTables.backingData[newlyActiveTab].tableData;
                $scope.filteredTree = $scope.tableData.treeView;
                $scope.updateFilteredRows($scope.search);
            })
        }
    }(this);

    monitorTabs.addFunctions({
        addTab: this.addMonitorTabEvent,
        changeTab: this.changeMonitorTabEvent
    });
}]);

//function TreeView(categoryHierarchy) {
//this.hierarchy = categoryHierarchy;
//this.address = new Adress();


//var that = this;

//this.update = function () {
//    var currentItems = this.hierarchy.itemsForAdress(this.address);

//    var uiList = $("#currentItems");

//    uiList.empty();

//    for (var i = 0; i < currentItems.length; i++) {
//        var str = "<li class='expandable'>" + currentItems[i] + "</li>";
//        uiList.append(str);
//    }

//    $(".expandable").click(function () {
//        var me = $(this);
//        var myName = me.text();
//        that.address.append(myName);
//        that.update();
//    });

//    var adressBar = $("#adressBar");
//    adressBar.empty();



//    var title = $("#title");

//    if (this.address.catalog !== null) {
//        adressBar.append('<button id="home">home</button>');
//        $("#home").click(function () {
//            that.address.home();
//            that.update();
//        })
//        if (this.address.category !== null) {
//            adressBar.append('<button id="catalog" class="adressButton">' + this.address.catalog + '</button>');
//            if (this.address.subCategory !== null) {
//                adressBar.append('<button id="category" class="adressButton">' + this.address.category + '</button>');
//                if (this.address.topic !== null) {
//                    //adressBar.append('<button id="subCategory" class="adressButton">' + this.address.subCategory + '</button>');
//                    //adressBar.append('<button id="topic" class="adressButton">' + this.address.topic + '</button>');
//                } else {
//                    title.text(this.address.subCategory);
//                }
//            } else {
//                title.text(this.address.category);
//            }
//        } else {
//            title.text(this.address.catalog);
//        }
//    } else {
//        title.text("home");
//    }

//    $(".adressButton").click(function () {
//        that.address.rollBackTo($(this).text());
//        that.update();
//    });
//}

//this.update();

//$("#up").click(function () {
//    that.address.up();
//    that.update();
//});




//var outerList = $("#outline");
//var outlineString = TreeView.treeFromDictionary(categoryHierarchy.hierarchy);
//outerList.append(outlineString);
//$(".show-hide").click(function () {
//    var me = $(this);
//    var current = me.attr('data-shown');
//    current = current == "true" ? "false" : "true";
//    me.attr('data-shown', current);
//    var text = current == "true" ? "hide" : "show";
//    me.text(text)
//});
//}

// returns a html string 
//TreeView.treeFromDictionary = function (dict) {
//    var res = "";
//    for (var key in dict) {
//        res += "<li> " + key;
//        res += '<button class="show-hide" data-shown="false">show</button>'
//        // if dict[key] is not a topic recurse
//        if (!(dict[key] instanceof Topic)) {
//            res += " <ul>" + TreeView.treeFromDictionary(dict[key]) + " </ul>";
//        }
//        res += " </li>";
//    }
//    return res;
//}
