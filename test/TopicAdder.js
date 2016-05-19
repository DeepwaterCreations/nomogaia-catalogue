var TopicAdder = function ($timeout) {

    this.addNewCatalog = function (treeView, catalog) {
        //this.$timeout(function () {
        console.log("added new catalog", treeView);
        treeView[catalog] = {};
        //});
    }
    this.isNewCatalog = function (treeView, catalog) {
        return DataOptions.isNotEmpty(catalog) &&
            treeView[catalog] == undefined;
    }
    this.addNewCategory = function (treeView, catalog, category) {
        //this.$timeout(function () {
        console.log("added new category", treeView);
        if (this.isNewCatalog(treeView, catalog)) {
            this.addNewCatalog(treeView, catalog);
        }

        treeView[catalog][category] = {};
        //});
    }
    this.isNewCategory = function (treeView, catalog, category) {
        console.log("is new category :" + catalog + " , " + category, treeView)
        return DataOptions.isNotEmpty(category) &&
            treeView[catalog] != undefined &&
            DataOptions.isNotEmpty(category) &&
            treeView[catalog][category] == undefined;
    }
    this.addNewSubCategory = function (treeView, catalog, category, subCatagory) {
        //this.$timeout(function () {
        if (this.isNewCatalog(treeView, catalog)) {
            this.addNewCatalog(treeView, catalog);
        }
        if (this.isNewCategory(treeView, catalog, category)) {
            this.addNewCategory(treeView, catalog, category);
        }
        treeView[catalog][category][subCatagory] = [];
        //});
    }
    this.isNewSubCategory = function (treeView, catalog, category, subCatagory) {
        return DataOptions.isNotEmpty(catalog) &&
            treeView[catalog] != undefined &&
            DataOptions.isNotEmpty(category) &&
            treeView[catalog][category] != undefined &&
            DataOptions.isNotEmpty(subCatagory) &&
            treeView[catalog][category][subCatagory] == undefined;
    }

    this.isNewTopic = function (treeView, catalog, category, subCatagory, topic) {
        var isNew = function (topic, listOfTopics) {
            for (var i = 0; i < listOfTopics.length; i++) {
                if (listOfTopics[i].getData("Topic") == topic) {
                    return false;
                }
            }
            return true;
        }

        return DataOptions.isNotEmpty(catalog) &&
            treeView[catalog] != undefined &&
            DataOptions.isNotEmpty(category) &&
            treeView[catalog][category] != undefined &&
            DataOptions.isNotEmpty(subCatagory) &&
            treeView[catalog][category][subCatagory] != undefined &&
            DataOptions.isNotEmpty(topic) &&
            isNew(topic, treeView[catalog][category][subCatagory]);
    }

    this.addNewTopic = function (treeView, catalog, category, subCategory, topic, description, module, source) {

        description = description || "";
        module = module || DataOptions.getDefaultValue("Module");
        source = source || "";

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
                    var newData = new RowData(myTable,"auto","data", dataAt);
                    rowAt = myTable.addRow(newData);
                }
            }
        }
    }

    //this.isNewTopic = function (treeView, catalog, category, subCatagory, topic) {
    //    return DataOptions.isNotEmpty(catalog) &&
    //        DataOptions.isNotEmpty(category) &&
    //        DataOptions.isNotEmpty(subCatagory) &&
    //        DataOptions.isNotEmpty(topic) ;
    //        // this does not check if it is new dispite the title
    //}

    this.addNewMod = function (newMod) {
        DataOptions.addCustom("Module", newMod);
    }
}
