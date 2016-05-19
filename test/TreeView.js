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
    $scope.activeView = "list";
    $scope.mo = {}
    $scope.mo.vis = false;
    $scope.mo.selectedModule = "";

    $scope.backgroundActivity = function () {
        return $scope.measurer.active;
    }

    $scope.setTreeView = function () {
        $scope.activeView = "tree";
        $scope.measurer.showAll();
        $scope.updateVisible();
    }
    $scope.setListView = function () {
        $scope.activeView = "list";
        $scope.measurer.showAll();
        $scope.updateVisible();
    }

    $scope.updateVisible = function (updateActive) {
        updateActive = (updateActive === undefined ? false : updateActive);

        clearTimeout(this.updateVisible_timeoutId);
        this.updateVisible_timeoutId = setTimeout(function () {
            // do something
            // I wish this did not effect scrolling so badly 
            $timeout(function () {
                var rows = $(".hasRowID");

                var showz = [];
                var dis = -1;
                var closest = null;
                for (var i = 0 ; i < rows.length; i++) {
                    var row = rows[i];
                    var show = Util.checkVisible(row, 500);
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
                        var h = window.getComputedStyle(row[0]).height;//row[0].getBoundingClientRect().height;
                        rowHat.getRowHat(rowData.id).lastKnowHeight = h;
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



    // we bring getRowHat in scope so we can callit from the UI
    $scope.getRowHat = function (id) {
        return rowHat.getRowHat(id);
    };

    $scope.measurer = { at: 0, list: [], reset: false, currentRunID: 0, active:false};

    $scope.measurer.showAll = function () {

        // we don't want to run while the splash screen is because that makes the animations really ugly!
        if (!($("#splash").is(":visible"))) {
            $scope.measurer.currentRunID = $scope.measurer.currentRunID + 1;
            $scope.measurer.reset = true;
            $scope.measurer.active = true;
            setTimeout(function () { $scope.measurer.measureNextSet($scope.measurer.currentRunID); },500);
        } else {
            setTimeout($scope.measurer.showAll, 1000);
        }
    }

    // takes a position and a list of RowData
    $scope.measurer.measureNextSet = function (runID) {
        if (runID == $scope.measurer.currentRunID) {
            if ($scope.measurer.reset) {
                $scope.measurer.at = 0;
                $scope.measurer.list = $(".hasRowID");//$scope.filteredList;
                $scope.measurer.reset = false;

            }

            var fmake = function (myRow, myRowUI) {
                return function () {
                    var h = window.getComputedStyle(myRowUI[0]).height;//row[0].getBoundingClientRect().height;
                    rowHat.getRowHat(myRow.id).lastKnowHeight = h;
                    //rowHat.getRowHat(myRow.id).lastKnowHeight = myRowUI.height();
                    myRowUI.height(rowHat.getRowHat(myRow.id).lastKnowHeight);
                    rowHat.getRowHat(myRow.id).onScreen = false;
                }
            }

            $timeout(function () {
                var toRun = [];
                for (var i = 0; i < 5; i++) {
                    if ($scope.measurer.at < $scope.measurer.list.length) {
                        var rowUI = $($scope.measurer.list[$scope.measurer.at]);
                        var rowId = rowUI.data("row");
                        var row = RowData.getRow(parseInt(rowId));
                        //var row = $(".hasRowID[data-row=" + row.id + "]");
                        if (!rowHat.getRowHat(row.id).onScreen && rowHat.getRowHat(row.id).lastKnowHeight === -1 && rowUI.length === 1) {
                            rowHat.getRowHat(row.id).onScreen = true;
                            toRun.push(fmake(row, rowUI));
                        }
                    }
                    $scope.measurer.at = $scope.measurer.at + 1;
                }
                if ($scope.measurer.at < $scope.measurer.list.length) {
                    toRun.push(function () {
                            $scope.measurer.measureNextSet(runID);
                    })
                } else {
                    $scope.measurer.active = false;
                }
                if (toRun.length > 0) {
                    $timeout(function () {
                        for (var i = 0; i < toRun.length; i++) {
                            toRun[i]();
                        }
                    }, 10);
                }

            });
        }
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
                }
                // we need to update what is on screen
                // we time this out because we want to give angular time to update before we update what is visible
                // atm the timeout is inside updateVisible
                $scope.updateVisible(true);
                $scope.measurer.showAll();
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
                rowData.setData(columnName, data ,true);
            }
            else {
                //Get
                var getval = rowData.getData(columnName);
                return getval;
            }
        };
    };

    $scope.expandTopicFromHeader = function (topic) {
        if ($scope.activeView === 'tree') {
            rowHat.getRowHat(topic.id).getRootHat().show = !rowHat.getRowHat(topic.id).getRootHat().show;
            $scope.updateVisible();
            $scope.updateActive(topic);
        }
    };

    //Opens a dialog to select a module, then creates a new row with the same information,
    //but a different module
    $scope.copyTopic = function(topic){
        $scope.mo.selectedModule = topic.Module;
        $( "#copyTopicModuleDialog" + topic.id).dialog({
            title: "Split Topic Into New Module",
            buttons: {
                "Make Topic": function(){
                    $scope.topicAdder.addNewTopic(topic.catalog,
                            topic.category,
                            topic.subCategory,
                            topic.topic,
                            topic.description,
                            $scope.mo.selectedModule,
                            topic.source);
                    $( this ).dialog( "close" );
                },
                "Cancel": function(){
                    $( this ).dialog( "close" );
                }
            }
        });
        $(".ui-dialog").find("button").addClass("blueButton");
        $(".ui-dialog-titlebar").addClass("greenDialogTitlebar");
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
                $('#side-bar-rights').css("width",
                    ($('#side-bar-rights').width() +
                    startX - e.pageX) + "px");
                //$('#main').css("left", e.pageX + 2);
                $('#ghostbar').remove();
                $(document).unbind('mousemove');
                dragging = false;
                $scope.updateVisible(false);
            }
        });
    }


    g.drag = function (event) {
        event.dataTransfer.setData("type", event.target.dataset.type);
        event.dataTransfer.setData("value", event.target.dataset.value);
    }

    g.doubleClick = function (event) {
        var type = event.target.dataset.type;
        var value = event.target.dataset.value;
        if ($scope.activeTopic != null) {

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
                }, 400);
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
        $timeout(function () {
            rowData.acceptDrop(type, value);
            $scope.dragData = null;
        })
    }

    g.allowDrop = function (event) {
        event.preventDefault();
    }

    g.dragEnter = function (event) {
        event.stopPropagation();
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
            $timeout(function () {
                $scope.tableData = monitorTables.backingData[newlyActiveTab].tableData;
                $scope.filteredTree = $scope.tableData.treeView;
                $scope.updateFilteredRows($scope.search);
                $scope.measurer.showAll();
                $scope.updateVisible(true);
            })
        }
    }(this);

    monitorTabs.addFunctions({
        addTab: this.addMonitorTabEvent,
        changeTab: this.changeMonitorTabEvent
    });
}]);
