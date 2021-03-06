﻿// holds the list of possible rights, rights holders, etc..
function DataOptions() {}

DataOptions.setCategoryHierarchy = function(CategoryHierarchy) {
    DataOptions.categoryHierarchy = categoryHierarchy;
}
    
// a getter for ColumnOptions
DataOptions.getColumnOptions = function (column) {
    if (column == "Catalog") {
        var result = DataOptions.categoryHierarchy.getCatalogs();
        result.unshift("-");
        return result;
    } else if (column == "Category") {
        var result = DataOptions.categoryHierarchy.getCategories();
        result.unshift("-");
        return result;
    } else if (column == "Sub-Category") {
        var result = DataOptions.categoryHierarchy.getSubCategories();
        result.unshift("-");
        return result;
    } else if (column == "Topic") {
        var result = DataOptions.categoryHierarchy.getTopics();
        result.unshift("-");
        return result;
    } else {
        if (DataOptions.columnOptions.hasOwnProperty(column)) {
            return DataOptions.columnOptions[column];
        } else {
            return [];
        }
    }
}

DataOptions.isNotEmpty = function ( data) {
    if (data == undefined
        || data == null
        || data == "-"
        || data.replace(/\t/g, "    ").trim() == "") {
        return false;
    }
    return true;
}

//Adds a new data option to the data list.
//Returns the index of the added data.
DataOptions.addCustom = function(column, data){
    if(!DataOptions.isNotEmpty(data)){
        return -1;
    } else if (!DataOptions.columnOptions.hasOwnProperty(column)) {
        console.err("WARNING: column ", column, " does not exist.");
        return -1;
    } else if (DataOptions.columnOptions[column].indexOf(data) >= 0 ||
            DataOptions.columnOptions[column].indexOf(data) >= 0){
        //The right or rights-holder we're trying to add already exists.
        var index = DataOptions.columnOptions[column].indexOf(data) ||
            DataOptions.columnOptions[column].indexOf(data); 
        return index;
    } else {
        DataOptions.columnOptions[column].push(data);
        return DataOptions.columnOptions[column].indexOf(data);
    }
};

DataOptions.loadFromFile = function (fileName) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(path.dirname(process.execPath), fileName);
    var buf = fs.readFileSync(filePath, "utf8");
    var result = [];
    buf.split("\n").forEach(function (line) {
        line = line.trim();
        if (line != "") {
            result.push(line);
        }
    })
    return result;
}

DataOptions.reset = function () {
    DataOptions.columnOptions = {
        "Impacted Rights": DataOptions.loadFromFile("Impacted Rights.csv"),
        "Impacted Rights-Holders": DataOptions.loadFromFile("Rightsholders.csv"),
        "Module": DataOptions.loadFromFile("Module.csv"),
        "Score": DataOptions.loadFromFile("Score.csv")
    }
}

// the options for a drop down in the key column
DataOptions.reset();

DataOptions.getDefaultValue = function (className) {
    if (className == "Score") {
        return DataOptions.columnOptions["Score"][0];
    } else if (className == "Module") {
        return DataOptions.columnOptions["Module"][0];
    }
    return undefined;
}

//Functions for saving and loading
DataOptions.toOut = function(){
    return DataOptions.columnOptions;
};

//"loadFromFile" loads the default options from a csv. This
//function unions those with the rights/rightsholders/so-on that the user 
//added for this particular project. It's what the load button in the corner
//of the screen calls when the user loads a project from json.
DataOptions.loadCustom = function(loaded_data){
    DataOptions.columnOptions = {
        "Impacted Rights": DataOptions.loadFromFile("Impacted Rights.csv"),
        "Impacted Rights-Holders": DataOptions.loadFromFile("Rightsholders.csv"),
        "Module": DataOptions.loadFromFile("Module.csv"),
        "Score": DataOptions.loadFromFile("Score.csv")
    }
    for (key in DataOptions.columnOptions) {
        if (loaded_data.hasOwnProperty(key)) {
            DataOptions.columnOptions[key] = Util.union(DataOptions.columnOptions[key], loaded_data[key]);
        }
    }
};
