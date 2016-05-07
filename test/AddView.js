g.aspenApp.controller('addController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.catalog = {
        name: "Catalog",
        prompt: "Select Catalog:",
        defaultValue:"",
        value: ""
    };
    $scope.category = {
        name: "Category",
        prompt: "Select Category:",
        defaultValue:"",
        value: ""
    };
    $scope.subCategory = {
        name: "SubCategory",
        prompt: "Select Sub-Category:",
        defaultValue:"",
        value: ""
    };
    $scope.topic = {
        name: "Topic",
        prompt: "Enter Topic:",
        defaultValue:"",
        value: ""
    };
    $scope.module = {
        name: "Module",
        prompt: "Enter Default Module:",
        defaultValue:"None",
        value: "None"
    };
    $scope.source = {
        name: "Source",
        prompt: "Enter Recommended Source:",
        defaultValue:"",
        value: ""
    };
    $scope.description = {
        name: "Description",
        prompt: "Enter Description:",
        defaultValue:"",
        value: ""
    };
    $scope.index = 0;
    $scope.list = [
        $scope.catalog,
        $scope.category,
        $scope.subCategory,
        $scope.topic,
        $scope.module,
        $scope.source,
        $scope.description
    ]
    $scope.tree = {};
    $scope.at = $scope.tree;
    
    g.onMonitorTablesChange(function (monitorTables) {
        $timeout(function () {
            $scope.tableData = monitorTables.backingData[0].tableData;
            $scope.tree = $scope.tableData.treeView;
            $scope.at = $scope.tableData.treeView;
            $scope.topicAdder = new TopicAdder($scope.tree, $timeout);
            $scope.moduleList = function () {
                return DataOptions.getColumnOptions("Module");
            }
        });
    });

    $scope.moveTo = function (key) {
        $scope.at = $scope.at[key];
        $scope.list[$scope.index].value = key;
        $scope.index++;
        $scope.prompt = $scope.getPrompt();
        $scope.adder = "";
    }
    
    $scope.canBack = function(){
        return $scope.index >0;
    }

    $scope.canAdd = function () {
        return $scope.hasValue($scope.adder) && !($scope.adder.replace(/\t/g, "    ").trim() in $scope.at);
    }

    $scope.hasValue = function (string) {
        if (string == undefined
            || string == null
            || string == "-"
            || string.replace(/\t/g, "    ").trim() == "") {
            return false;
        }
        return true;
    }

    $scope.back = function () {
        if ($scope.canBack()){
            $scope.index--;
            $scope.list[$scope.index].value = $scope.list[$scope.index].defaultValue;
            $scope.prompt = $scope.getPrompt();
            $scope.at = $scope.tree;
            if ($scope.catalog.value != $scope.catalog.defaultValue) {
                $scope.at = $scope.at[$scope.catalog.value];
                if ($scope.category.value != $scope.category.defaultValue) {
                    $scope.at = $scope.at[$scope.category.value];
                    if ($scope.subCategory.value != $scope.subCategory.defaultValue) {
                        $scope.at = $scope.at[$scope.subCategory.value];
                    }
                }
            }
        }
    }

    $scope.canNext = function () {
        return $scope.index != $scope.list.length - 1;
    }

    $scope.canFinish = function(){
        return $scope.index == $scope.list.length-1;
    }
    $scope.finish = function () {
        if ($scope.canFinish()) {
            console.log("finish!")
            $scope.topicAdder.addNewTopic($scope.tree,$scope.catalog.value,$scope.category.value,$scope.subCategory.value,$scope.topic.value,$scope.description.value,$scope.module.value,$scope.source.value)
            $("#addTopic").dialog("close");
            $scope.reset();
        }
    }

    $scope.next = function () {
        if ($scope.canNext()) {
            if ($scope.index + 1 >= $scope.list.length) {
                //var myTopic = new Topic($scope.catalog.value, $scope.category.value, $scope.subCategory.value, $scope.topic.value, $scope.description.value, $scope.module.value, $scope.source.value);
                //console.log("adding a topic", myTopic);
                //categoryHierarchy.addTopic(myTopic);

                //var rowAt = null;

                //for (var tabIndex in g.getMonitorTables().backingData) {
                //    if (tabIndex >= monitorTabs.getActiveMonitor()) {
                //        var myTable = g.getMonitorTables().backingData[tabIndex];
                //        if (rowAt == null) {
                //            rowAt = myTable.addRow(myTopic.toData(myTable));
                //            rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
                //        } else {
                //            var dataAt = rowAt.data;
                //            var newData = new RowData(myTable, dataAt);
                //            rowAt = myTable.addRow(newData);
                //        }
                //    }
                //}

                //$("#addTopic").dialog("close");
                //$scope.reset();
            } else {
                $scope.index++;
                $scope.prompt = $scope.getPrompt();
            }
        }
    }

    $scope.reset = function () {
        for (var i = 0; i < $scope.list.length; i++) {
            $scope.list[i].value = $scope.list[i].defaultValue;
        }
        $scope.index = 0;
        $scope.at = $scope.tree;
    }

    $scope.getPrompt = function () {
        return $scope.list[$scope.index].prompt;
    }

    $scope.prompt = $scope.getPrompt();

}]);
