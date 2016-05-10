g.aspenApp.controller('addController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.catalog = {
        name: "Catalog",
        prompt: "Select Catalog:",
        defaultValue: "",
        value: "",
        valid: function() {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.category = {
        name: "Category",
        prompt: "Select Category:",
        defaultValue: "",
        value: "",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.subCategory = {
        name: "SubCategory",
        prompt: "Select Sub-Category:",
        defaultValue: "",
        value: "",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.topic = {
        name: "Topic",
        prompt: "Enter Topic:",
        defaultValue: "",
        value: "",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.module = {
        name: "Module",
        prompt: "Enter Default Module:",
        defaultValue: "None",
        value: "None",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.source = {
        name: "Source",
        prompt: "Enter Recommended Source:",
        defaultValue: "",
        value: "",
        valid: function () {
            return true;
        }
    };
    $scope.description = {
        name: "Description",
        prompt: "Enter Description:",
        defaultValue: "",
        value: "",
        valid: function () {
            return true;
        }
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

    $scope.newCatalog = "";
    $scope.newCategory = "";
    $scope.newSubCategory = "";

    g.onMonitorTablesChange(function (monitorTables) {
        $timeout(function () {
            $scope.tableData = monitorTables.backingData[0].tableData;
            $scope.tree = $scope.tableData.treeView;
            $scope.topicAdder = new TopicAdder($scope.tree, $timeout);
            $scope.moduleList = function () {
                return DataOptions.getColumnOptions("Module");
            }
        });
    });


    $scope.canBack = function () {
        return $scope.index > 0;
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
        if ($scope.canBack()) {
            $scope.index--;
        }
    }

    $scope.canNext = function () {
        return $scope.index != $scope.list.length - 1;
    }

    $scope.canFinish = function () {
        for (var i = 0; i < $scope.list.length; i++) {
            if (!$scope.list[i].valid()) {
                return false;
            }
        }
        return true;
    }

    $scope.finish = function () {
        if ($scope.canFinish()) {
            console.log("finish!")
            $scope.topicAdder.addNewTopic($scope.tree, $scope.catalog.value, $scope.category.value, $scope.subCategory.value, $scope.topic.value, $scope.description.value, $scope.module.value, $scope.source.value)
            $("#addTopic").dialog("close");
            $scope.reset();
        }
    }

    $scope.next = function () {
        if ($scope.canNext()) {
            $scope.index++;
        }
    }

    $scope.reset = function () {
        for (var i = 0; i < $scope.list.length; i++) {
            $scope.list[i].value = $scope.list[i].defaultValue;
        }
        $scope.index = 0;
    }

    $scope.getPrompt = function () {
        return $scope.list[$scope.index].prompt;
    }
}]);
