
var TopicAdder = function ($timeout) {
   
    this.addNewCatalog = function (treeView,catalog) {
        //this.$timeout(function () {
            console.log("added new catalog", treeView);
            treeView[catalog] = {};
        //});
    }
    this.isNewCatalog = function (treeView, catalog) {
        return !treeView[catalog] !== undefined;
    }
    this.addNewCategory = function (treeView, catalog, catagory) {
        //this.$timeout(function () {
            console.log("added new category", treeView);
            treeView[catalog][catagory] = {};
        //});
    }
    this.isNewCategory = function (treeView, catalog, catagory) {
        return !treeView[catalog][catagory] !== undefined;
    }
    this.addNewSubCategory = function (treeView, catalog, catagory, subCatagory) {
        //this.$timeout(function () {
            console.log("added new sub category", treeView);
            treeView[catalog][catagory][subCatagory] = {};
        //});
    }
    this.isNewSubCategory = function (treeView, catalog, catagory, subCatagory) {
        return !treeView[catalog][catagory][subCatagory] !== undefined;
    }

    this.addNewTopic = function (treeView, catalog, category, subCategory, topic, description, module, source) {
        //??
        description = description || "";
        module = module || DataOptions.getDefaultValue("Module");
        source = source || "";
        //this.$timeout(function () {
            // add a row
            console.log("added new topic", treeView);
            var rowAt = null;

            var myTopic = new Topic(catalog, category, subCategory, topic, description, module, source);
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
        //});
    }
    this.isNewTopic = function (treeView, catalog, catagory, subCatagory, topic) {
        return true;
    }

    this.addNewMod = function (newMod) {
        var list = $scope.moduleList();
        if (list.indexOf(newMod) == -1) {
            list.push(newMod);
        }
    }
}