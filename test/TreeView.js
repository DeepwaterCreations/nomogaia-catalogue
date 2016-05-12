g.aspenApp.controller('treeController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.tableData = null;
    $scope.filteredTree = {};
    $scope.filteredList = [];
    $scope.search = "";
    $scope.timeoutId = "";
    $scope.dragData = null;
    $scope.rightsLocked = true;
    $scope.rightsholdersLocked = true;
    $scope.activeTopic = null;
    $scope.mo = {}
    $scope.mo.vis = false;
    // $scope.mo.moduleShowAdd = false;
    $scope.mo.newMod = '';

    $scope.updateVisible = function (updateActive) {
        updateActive = (updateActive === undefined ? false : updateActive);

        clearTimeout(this.updateVisible_timeoutId);
        this.updateVisible_timeoutId = setTimeout(function () {
            // do something
            // I wish this did not effect scrolling so badly 
            $timeout(function () {
                //console.log("update visible");

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

                if (updateActive && closest != null) {
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
                    var lastOnScreen = rowHat.getRowHat(rowData.id).onScreen;
                    if (lastOnScreen && row.height() > 0) {
                        rowHat.getRowHat(rowData.id).lastKnowHeight = row.height();
                    }
                    if (!showz[i] && rowHat.getRowHat(rowData.id).lastKnowHeight != -1) {
                        row.height(rowHat.getRowHat(rowData.id).lastKnowHeight);
                    }
                    if (!lastOnScreen && showz[i]) {
                        row.height("auto");
                    }
                    rowHat.getRowHat(rowData.id).onScreen = showz[i]
                }
            });
        }, 50);
    }



    $scope.showAll = function () {
        //console.log("showing all");
        setTimeout(function () {
            $scope.measureRow(0, $scope.filteredList);
        }, 1000);
        //RowData.forEach(function (row) {
        //    row.onScreen = true;
        //})
        // so this is a drity little hak
        // we want to update what is visible as soon as the UI finishes loading 
        // we put it in a timeout and angluar is such a butt it does not let anything run till it is done
        // so my little timeout gets called when UI is loaded just like I want it to be
        //setTimeout(function () {
        //$scope.updateVisible();
        //console.log("updated visible");
        //}, 100);//the time of the timeout does not really matter
    }

    // we bring getRowHat in scope so we can callit from the UI
    $scope.getRowHat = function (id) {
        return rowHat.getRowHat(id);
    };

    // takes a position and a list of RowData
    $scope.measureRow = function (at, list) {
        var fmake = function (myRow, myRowUI) {
            return function () {

                rowHat.getRowHat(myRow.id).lastKnowHeight = myRowUI.height();
                myRowUI.height(rowHat.getRowHat(myRow.id).lastKnowHeight);
                rowHat.getRowHat(myRow.id).onScreen = false;
            }
        }

        $timeout(function () {
            var toRun = [];
            for (var i = 0; i < 5; i++) {
                if (at < list.length) {
                    var row = list[at];
                    var rowUI = $(".hasRowID[data-row=" + row.id + "]");
                    if (!rowHat.getRowHat(row.id).onScreen && rowHat.getRowHat(row.id).lastKnowHeight === -1 && rowUI.length === 1) {
                        rowHat.getRowHat(row.id).onScreen = true;
                        toRun.push(fmake(row, rowUI));
                    }
                }
                at = at + 1;
            }
            if (toRun.length > 0) {
                $timeout(function () {
                    for (var i = 0; i < toRun.length; i++) {
                        toRun[i]();
                    }
                    //console.log("measuring a chunk!");
                }, 10);
            }
            if (at < list.length) {
                setTimeout($scope.measureRow(at, list), 10)
            }
        });
    }

    window.addEventListener('resize', $scope.updateVisible);

    g.onMonitorTablesChange(function (monitorTables) {
        $timeout(function () {
            $scope.tableData = monitorTables.backingData[0].tableData;
            $scope.tableData.onAddRow(function () {
                // info angular of changes
                $timeout(function () {
                    $scope.tableData = $scope.tableData;
                    $scope.updateFilteredRows($scope.search);
                })
            });

            $scope.filteredTree = $scope.tableData.treeView;
            $scope.filteredList = $scope.tableData.rows;
            $scope.topicAdder = new TopicAdder($scope.tableData.treeView, $timeout);
            $scope.rightslist = function () {
                return DataOptions.getColumnOptions("Impacted Rights");
            }
            $scope.rightsholderlist = function () {
                return DataOptions.getColumnOptions("Impacted Rights-Holders");
            }
            $scope.moduleList = function () {
                return DataOptions.getColumnOptions("Module");
            }
            $scope.scorevals = DataOptions.getColumnOptions("Score");
            //console.log("TableData set!", $scope.tableData);

            $scope.shownRights = function () {
                return monitorTables.shownRights;
            };
            $scope.showAllRights = function () {
                monitorTables.resetShownRights();
            }
            $scope.hideAllRights = function () {
                monitorTables.emptyShownRights();
            };

            $scope.shownRightsholders = function () {
                return monitorTables.shownRightsholders;
            };
            $scope.showAllRightsholders = function () {
                monitorTables.resetShownRightsholders();
            };
            $scope.hideAllRightsholders = function () {
                monitorTables.emptyShownRightsholders();
            };

            $("#tree-view .main .body").scroll(function () { $scope.updateVisible(true); })
        });
    });

    $scope.updateFilteredRows = function (x) {
        clearTimeout(this.updateFilteredRows_timeoutId);
        this.updateFilteredRows_timeoutId = setTimeout(function () {
            $timeout(function () {
                console.log("filter rows");
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

                // we need to get the details on why each row is shown
                rowHat.clearFilters();
                for (var i = 0; i < filteredRows.length; i++) {
                    var row = filteredRows[i];
                    rowHat.getRowHat(row.id).filterDetails = row.hasTermDetails(x);
                    //$scope.filterDetails[filteredRows[i].id] = 
                }

                //console.log("done filtering!", $scope.filterDetails);
                // we need to update what is on screen
                // we time this out because we want to give angular time to update before we update what is visible
                //setTimeout(
                $scope.updateVisible();
                //, 100);
            })
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
        return $scope.getCurrent(rowData, "Impacted Rights");
    };
    $scope.getCurrentRightsholders = function (rowData) {
        return $scope.getCurrent(rowData, "Impacted Rights-Holders");
    };

    $scope.getCurrent = function (rowData, type) {
        var res = rowData.getData(type);
        if (res == null) {
            res = [];
        }
        if ($scope.dragData != null && $scope.dragData.type == type && $scope.dragData.row == rowData.id && res.indexOf($scope.dragData.value) == -1) {
            res.push($scope.dragData.value);
        }
        return res;
    }

    $scope.getModules = function (rowData) {
        return rowData.getData("Module");
    };

    $scope.addModule = function(){
        //TODO: What if the module can't be added for some reason?
        //TODO: Select the newly added module
        //TODO: Remove the text thingy when the add button is clicked.
        $scope.topicAdder.addNewMod($scope.mo.newMod);
        $scope.mo.newMod = '';
        // $scope.mo.moduleShowAdd = false; 
    };

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

    $scope.addNewRight = function (newRight) {
        // var list = $scope.rightslist();
        // if (list.indexOf(newRight) == -1) {
        //     list.push(newRight);
        //     $scope.shownRights().push(newRight);
        // }
        if (DataOptions.addCustom("Impacted Rights", newRight) > -1) {
            $scope.shownRights().push(newRight);
        }
    }
    $scope.addNewRightHolder = function (newRightHolder) {
        // var list = $scope.rightsholderlist();
        // if (list.indexOf(newRightHolder) == -1) {
        //     list.push(newRightHolder);
        //     $scope.shownRightsholders().push(newRightHolder);
        // }
        if (DataOptions.addCustom("Impacted Rights-Holders", newRightHolder) > -1) {
            $scope.shownRightsholders().push(newRightHolder);
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
        var idx = $scope.shownRights().indexOf(right);
        if (idx > -1) {
            //Remove the right
            $scope.shownRights().splice(idx, 1);
        } else {
            //Add the right, referencing the master list to give it the proper index.
            var new_idx = $scope.rightslist().indexOf(right);
            $scope.shownRights().splice(new_idx, 0, right);
        }
    };
    //Ditto for -holders
    $scope.toggleRightsholder = function (rightsholder) {
        var idx = $scope.shownRightsholders().indexOf(rightsholder);
        if (idx > -1) {
            //Remove the rightsholder
            $scope.shownRightsholders().splice(idx, 1);
        } else {
            //Add the rightsholder, referencing the master list to give it the proper index.
            var new_idx = $scope.rightsholderlist().indexOf(rightsholder);
            $scope.shownRightsholders().splice(new_idx, 0, rightsholder);
        }
    };

    $scope.getScoreCategoryClass = getScoreCategoryClass; //What's with this global BS

    //A function that returns a function that is a getterSetter for the given topic (RowData).
    $scope.getSetData = function (rowData, columnName) {
        return function (data) {
            if (arguments.length) {
                //Set
                //console.log("set to " + data);
                rowData.setData(columnName, data);
                //console.log("result " + rowData.getData(columnName));
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

        //$("#addTopic").dialog({
        //    buttons: [
        //        {
        //            text: "Cancel",
        //            click: function () {
        //                $(this).dialog("close");
        //            }
        //        }, {
        //            id: "addTopicButton",
        //            text: "Ok",
        //            click: function () {
        //                if (AddTopic.canAdd()) {
        //                    AddTopic.addTopic();
        //                    $(this).dialog("close");
        //                } else {
        //                    AddTopic.highlightIncomplete();
        //                }

        //            }
        //        }
        //    ],
        //    autoOpen: false,
        //    width: "90%"
        //});

        $(".openAddTopic").click(function () {
            $("#addTopic").dialog("open");
            $(".ui-dialog").find("button").addClass("blueButton");
            AddTopic.canAdd();
        })

        // $('#addRowTree').click(function () {
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
        //});
    }


    g.drag = function (event) {
        //console.log("drag!", event);
        event.dataTransfer.setData("type", event.target.dataset.type);
        event.dataTransfer.setData("value", event.target.dataset.value);
    }

    g.doubleClick = function (event) {
        var type = event.target.dataset.type;
        var value = event.target.dataset.value;
        if ($scope.activeTopic != null) {
            //console.log("double click!", event);

            $timeout(function () {
                $scope.activeTopic.acceptDrop(type, value);
                $scope.dragData =
                    {
                        type: type,
                        row: $scope.activeTopic.id,
                        value: value,
                    };
                $timeout(function () {
                    $scope.dragData = null;
                },400);
            });
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
        var rowData = RowData.getRow(parseInt(row));
        $scope.updateActive(rowData);
        //console.log("drop! type: " + type + " value:" + value + " rowId: " + row, event);
        $timeout(function () {
            rowData.acceptDrop(type, value);
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
                $scope.showAll();
                $scope.updateVisible(true);
            })
        }
    }(this);

    monitorTabs.addFunctions({
        addTab: this.addMonitorTabEvent,
        changeTab: this.changeMonitorTabEvent
    });

    $scope.showModuleDropdown = function(){
        //TODO
    };
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
