g.aspenApp.controller('treeController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.tableData = null;
    $scope.filteredTree = {};
    $scope.filteredList = [];
    $scope.search = "";
    $scope.timeoutId = "";
    $scope.dragData = null;
    $scope.rightsLocked = true;
    $scope.rightsholdersLocked = true;
    $scope.shownRights = DataOptions.columnOptions["Impacted Rights"].slice(0);
    $scope.shownRightsholders = DataOptions.columnOptions["Impacted Rights-Holders"].slice(0);
    $scope.activeTopic = null;

    $scope.updateVisible = function () {
        clearTimeout(this.updateVisible_timeoutId);
        this.updateVisible_timeoutId = setTimeout(function () {
            // do something
            $timeout(function () {
                var rows = $(".hasRowID");

                var showz = [];
                var dis = -1;
                var closest = null;
                for (var i = 0 ; i < rows.length; i++) {
                    var row = rows[i];
                    var show = Util.checkVisible(row, 500)
                    showz.push(show);
                    if (show) {
                        var myDis = Util.disToCenter(row);
                        if ((closest === null || myDis < dis) && $(row).height != 0) {
                            dis = myDis;
                            closest = row;
                        }

                    }
                }

                if (closest != null) {
                    var rowId = $(closest).data("row");
                    var rowData = RowData.getRow(parseInt(rowId));
                    $scope.activeTopic = rowData;
                }

                // we have to split this up in to two loops if we start modifying onScreen the DOM starts changing
                // and the measurements of the rest of the elements are wrong
                for (var i = 0 ; i < rows.length; i++) {
                    var row = $(rows[i]);
                    var rowId = row.data("row");
                    var rowData = RowData.getRow(parseInt(rowId));
                    var lastOnScreen = rowData.onScreen;
                    if (lastOnScreen) {
                        rowData.lastKnowHeight = row.height();
                    }
                    if (!showz[i]) {//&& row.height() !=0 //  lastOnScreen &&
                        row.height(rowData.lastKnowHeight);
                    }
                    if (!lastOnScreen && showz[i]) {
                        row.height("auto");
                    }
                    rowData.onScreen = showz[i]
                }
            });
        }, 50);
    }

    $scope.showAll = function () {
        RowData.forEach(function (row) {
            row.onScreen = true;
        })
        // so this is a drity little hak
        // we want to update what is visible as soon as the UI finishes loading 
        // we put it in a timeout and angluar is such a but it does not let anything run till it is done
        // so my little timeout gets called when UI is loaded just like I want it to be
        setTimeout(function () {
            $scope.updateVisible();
            //console.log("updated visible");
        }, 100);//the time of the timeout does not really matter
    }

    window.addEventListener('resize', $scope.updateVisible);

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

            $("#tree-view .main .body").scroll($scope.updateVisible)

        });
    });

    // Colin, this seems like a really slow way
    $scope.updateFilteredRows = function (x) {
        clearTimeout(this.updateFilteredRows_timeoutId);
        this.updateFilteredRows_timeoutId = setTimeout(function () {
            var filteredRows = $scope.tableData.filterRows(x);
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
            // we need to update what is on screen
            $scope.updateVisible();

        }, 50);
    }

    $scope.filtered = function (topic) {
        return $scope.search == "" || topic.hasTerm($scope.search);
    }

    $scope.updateActive = function (topic) {
        $scope.activeTopic = topic;
    }

    //Row Edit UI

    //Retrieve lists of current rights and rights-holders for a given topic (RowData).
    $scope.getCurrentRights = function (rowData) {
        var res = rowData.getData("Impacted Rights");
        if (res == null) {
            return [];
        }
        return res;
    };
    $scope.getCurrentRightsholders = function (rowData) {
        var res = rowData.getData("Impacted Rights-Holders");
        if (res == null) {
            return [];
        }
        return res;
    };
    $scope.getModules = function (rowData) {
        return rowData.getData("Module");
    };

    $scope.addNewCatalog = function (catalog) {
        $timeout(function () {
            $scope.tableData.treeView[catalog] = {};
        });
    }
    $scope.isNewCatalog = function (catalog) {
        return $scope.tableData.treeView[catalog] !== undefined;
    }
    $scope.addNewCategory = function (catalog, catagory) {
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
                        rowAt = myTable.addRow(myTopic.toData(myTable));
                        rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
                    } else {
                        var dataAt = rowAt.data;
                        var newData = new RowData(myTable, dataAt);
                        rowAt = myTable.addRow(newData);
                    }
                }
            }
            $scope.updateFilteredRows($scope.search);
        });
    }
    $scope.isNewTopic = function (catalog, catagory, subCatagory, topic) {
        return false;
    }

    // topic is a data row
    $scope.delete = function (topic) {
        $("#deleteDialog").dialog({
            autoOpen: false,
            modal: true,
            buttons: [
                {
                    text: "Ok",
                    click: function () {
                        topic.delete();
                        $timeout(function () {
                            $scope.updateFilteredRows($scope.search);
                        })
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
        var at = topic;
        while (at.child != null) {
            at = at.child;
            count++;
        }
        $("#deleteDialogText").text("Are you sure you want to delete topic: ");
        $("#deleteDialogTopic").text("" + topic.getData("Topic"))
        $("#deleteDialogTopic").css("font-weight", "Bold");
        $("#deleteDialogMonitors").text("" + (count != 0 ? " and it's " + (count > 1 ? count + " monitors" : " monitor") : "") + "?");
        $("#deleteDialog").dialog("open");
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
            $scope.shownRights.push(newRight);
        }
    }
    $scope.addNewRightHolder = function (newRightHolder) {
        var list = $scope.rightsholderlist();
        if (list.indexOf(newRightHolder) == -1) {
            list.push(newRightHolder);
            $scope.shownRightsholders.push(newRightHolder);
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

    //Show or hide a right in the sidebar.
    $scope.toggleRight = function (right) {
        var idx = $scope.shownRights.indexOf(right);
        if (idx > -1) {
            //Remove the right
            $scope.shownRights.splice(idx, 1);
        } else {
            //Add the right, referencing the master list to give it the proper index.
            var new_idx = $scope.rightslist().indexOf(right);
            $scope.shownRights.splice(new_idx, 0, right);
        }
    };
    //Ditto for -holders
    $scope.toggleRightsholder = function (rightsholder) {
        var idx = $scope.shownRightsholders.indexOf(rightsholder);
        if (idx > -1) {
            //Remove the rightsholder
            $scope.shownRightsholders.splice(idx, 1);
        } else {
            //Add the rightsholder, referencing the master list to give it the proper index.
            var new_idx = $scope.rightsholderlist().indexOf(rightsholder);
            $scope.shownRightsholders.splice(new_idx, 0, rightsholder);
        }
    };

    $scope.showAllRights = function () {
        //Reset the shown rights list to match the master list
        $scope.shownRights = DataOptions.columnOptions["Impacted Rights"].slice(0);
    };
    $scope.hideAllRights = function () {
        //Empty the shown rights list
        $scope.shownRights = [];
    };
    $scope.showAllRightsholders = function () {
        $scope.shownRightsholders = DataOptions.columnOptions["Impacted Rights-Holders"].slice(0);
    };
    $scope.hideAllRightsholders = function () {
        $scope.shownRightsholders = [];
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
                //$scope.activeTopic = rowData;
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
                $scope.updateVisible();
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
                    id: "addTopicButton",
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
            //            var newData = new RowData(myTable,dataAt);
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

    g.doubleClick = function (event) {
        if ($scope.activeTopic != null) {
            //console.log("double click!", event);
            var type = event.target.dataset.type;
            var value = event.target.dataset.value;
            $timeout(function () {
                $scope.activeTopic.acceptDrop(type, value);
            })
        }
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
            $scope.dragData = null;
        })
    }

    g.allowDrop = function (event) {
        //console.log("allow Drop!",event);
        event.preventDefault();
    }

    g.dragEnter = function (event) {
        event.stopPropagation();
        //console.log("enter!")
        var type = event.dataTransfer.getData("type");
        var value = event.dataTransfer.getData("value");
        var at = event.target;
        while (at.className.indexOf("hasRowID") === -1) {
            at = at.parentElement;
        }
        var row = at.dataset.row;
        $timeout(function () {
            $scope.dragData =
                {
                    type: type,
                    row: row,
                    value: value,
                }
        });
    }

    g.dragExit = function (event) {
        console.log("exit!")
        if ($scope.dragData !== null) {
            var type = event.dataTransfer.getData("type");
            var value = event.dataTransfer.getData("value");
            var at = event.target;
            while (at.className.indexOf("hasRowID") === -1) {
                at = at.parentElement;
            }
            var row = at.dataset.row;
            if (row == $scope.dragData.row) {
                $timeout(function () { $scope.dragData = null; })
            }
        }
    }

    g.killDragData = function (event) {
        $timeout(function () { $scope.dragData = null; })
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
