g.aspenApp.controller('addController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.catalog = {
        name: "Catalog",
        prompt: "Select Catalog",
        defaultValue: "",
        value: this.defaultValue,
        valid: function() {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.category = {
        name: "Category",
        prompt: "Select Category",
        defaultValue: "",
        value: "",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.subCategory = {
        name: "SubCategory",
        prompt: "Select Sub-Category",
        defaultValue: "",
        value: "",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.topic = {
        name: "Topic",
        prompt: "Select Topic",
        defaultValue: "",
        value: "",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.module = {
        name: "Module",
        prompt: "Enter Default Module",
        defaultValue: "None",
        value: "None",
        valid: function () {
            return DataOptions.isNotEmpty(this.value);
        }
    };
    $scope.source = {
        name: "Source",
        prompt: "Enter Recommended Source",
        defaultValue: "",
        value: "",
        valid: function () {
            return true;
        }
    };
    $scope.description = {
        name: "Description",
        prompt: "Enter Description",
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
        //$scope.source,
        //$scope.description
    ]
    $scope.tree = {};
    $scope.overlayTree = {};

    $scope.newElementText = {};
    $scope.newElementText.newCatalog = "";
    $scope.newElementText.newCategory = "";
    $scope.newElementText.newSubCategory = "";
    $scope.newElementText.newTopic = "";
    $scope.newElementText.newModule = "";


    g.onMonitorTablesChange(function (monitorTables) {
        $timeout(function () {
            $scope.tableData = monitorTables.backingData[0].tableData;
            $scope.tree = $scope.tableData.treeView;
            $scope.topicAdder = new TopicAdder($timeout);
            $scope.moduleList = function () {
                return DataOptions.getColumnOptions("Module");
            }
        });
    });

    $scope.getCatalogs = function () {
        var res = [];
        for (var key in $scope.tree) {
            res.push(key);
        }
        for (var key in $scope.overlayTree) {
            if ($scope.isNew(key, res)) {
                res.push(key);
            }
        }
        return res;
    }

    $scope.getCategories = function (catalog) {
        var res = [];
        if (catalog in $scope.tree) {
            for (var key in $scope.tree[catalog]) {
                res.push(key);
            }
        }
        if (catalog in $scope.overlayTree) {
            for (var key in $scope.overlayTree[catalog]) {
                if ($scope.isNew(key, res)) {
                
                    res.push(key);
                }
            }
        }
        return res;
    }

    $scope.getSubCategories = function (catalog, category) {
        var res = [];
        if (catalog in $scope.tree && category in $scope.tree[catalog]) {
            for (var key in $scope.tree[catalog][category]) {
                res.push(key);
            }
        }
        if (catalog in $scope.overlayTree && category in $scope.overlayTree[catalog]) {
            for (var key in $scope.overlayTree[catalog][category]) {
                if ($scope.isNew(key, res)) {
                    res.push(key);
                }
            }
        }
        return res;
    }

    $scope.getTopics = function (catalog, category, subCategory) {
        var res = [];
        if (catalog in $scope.tree && category in $scope.tree[catalog] && subCategory in $scope.tree[catalog][category]) {
            for (var i = 0; i < $scope.tree[catalog][category][subCategory].length; i++) {
                res.push($scope.tree[catalog][category][subCategory][i].getData("Topic"));
            }
        }
        if (catalog in $scope.overlayTree && category in $scope.overlayTree[catalog] && subCategory in $scope.overlayTree[catalog][category]) {
            for (var i = 0; i < $scope.overlayTree[catalog][category][subCategory].length; i++) {
                var key = $scope.overlayTree[catalog][category][subCategory][i];
                if ($scope.isNew(key, res)) {
                    res.push(key);
                }
            }
        }
        return res;
    }

    $scope.addOverlayTopic = function (catalog, category, subCategory, topic) {
        if ($scope.overlayTree[catalog] === undefined){
            $scope.overlayTree[catalog] ={};
        }
        if ($scope.overlayTree[catalog][category] === undefined){
            $scope.overlayTree[catalog][category] ={};
        }
        if ($scope.overlayTree[catalog][category][subCategory] === undefined){
            $scope.overlayTree[catalog][category][subCategory] =[];
        }
        $scope.overlayTree[catalog][category][subCategory].push(topic);
    }

    $scope.legalCatalog = function (catalog) {
        return DataOptions.isNotEmpty(catalog) &&
            ($scope.tree[catalog] != undefined || $scope.overlayTree[catalog] != undefined);
    }
    $scope.legalCategory = function (catalog,category) {
        return $scope.legalCatalog(catalog) &&
            (DataOptions.isNotEmpty(category) &&
                (($scope.tree[catalog] != undefined && $scope.tree[catalog][category] != undefined) || ($scope.overlayTree[catalog] != undefined && $scope.overlayTree[catalog][category] != undefined)));
    }
    $scope.legalSubCategory = function (catalog, category, subCategory) {
        return $scope.legalCatalog(catalog) &&
            $scope.legalCategory(catalog, category) &&
            (DataOptions.isNotEmpty(category) &&
                (($scope.tree[catalog] !== undefined
            && $scope.tree[catalog][category] !== undefined
            && $scope.tree[catalog][category][subCategory] != undefined) || (
              $scope.overlayTree[catalog] != undefined
             && $scope.overlayTree[catalog][category] != undefined
            && $scope.overlayTree[catalog][category][subCategory] != undefined)));
    }

    $scope.isNew = function (str, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == str) {
                return false;
            }
        }
        return true;
    }

    $scope.legalNewCatalog = function (catalog) {
        return DataOptions.isNotEmpty(catalog) && $scope.isNew (catalog,$scope.getCatalogs());
    }

    $scope.legalNewCategory = function (catalog,category) {
        return DataOptions.isNotEmpty(category) && $scope.isNew(category, $scope.getCategories(catalog));
    }

    $scope.legalNewSubCategory = function (catalog,category,subCategory) {
        return DataOptions.isNotEmpty(subCategory) && $scope.isNew(subCategory, $scope.getSubCategories(catalog, category));
    }

    $scope.legalNewTopic = function (catalog, category, subCategory,topic) {
        return DataOptions.isNotEmpty(topic) && $scope.isNew(topic, $scope.getTopics(catalog, category, subCategory));
    }

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
            $scope.topicAdder.addNewTopic(
                    $scope.catalog.value, 
                    $scope.category.value, 
                    $scope.subCategory.value, 
                    $scope.topic.value, 
                    $scope.description.value, 
                    $scope.module.value, 
                    $scope.source.value);
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
        $scope.overlayTree = {};
    }

    $scope.getPrompt = function () {
        return $scope.list[$scope.index].prompt;
    }

    $scope.legalNewModule = function (newModule) {
        return DataOptions.isNotEmpty(newModule) && $scope.isNew(newModule, $scope.moduleList());
    }

    $scope.addNewCatalog = function(){
        $scope.topicAdder.addNewCatalog($scope.overlayTree, $scope.newElementText.newCatalog);
        $scope.catalog.value = $scope.newElementText.newCatalog;
        $scope.newElementText.newCatalog = '';
    };

    $scope.addNewCategory = function(){
        $scope.topicAdder.addNewCategory($scope.overlayTree, $scope.catalog.value, $scope.newElementText.newCategory);
        $scope.category.value = $scope.newElementText.newCategory;
        $scope.newElementText.newCategory = '';
    };

    $scope.addNewSubCategory = function(){
        $scope.topicAdder.addNewSubCategory($scope.overlayTree, $scope.catalog.value, $scope.category.value, $scope.newElementText.newSubCategory);
        $scope.subCategory.value = $scope.newElementText.newSubCategory;
        $scope.newElementText.newSubCategory = '';
    };

    $scope.addNewOverlayTopic = function(){
        $scope.addOverlayTopic($scope.catalog.value, $scope.category.value, $scope.subCategory.value, $scope.newElementText.newTopic);
        $scope.topic.value = $scope.newElementText.newTopic;
        $scope.newElementText.newTopic = '';
    };

    $scope.addNewModule = function(){
        $scope.topicAdder.addNewMod($scope.newElementText.newModule);
        $scope.module.value = $scope.newElementText.newModule;
        $scope.newElementText.newModule = '';
    };
}]);
