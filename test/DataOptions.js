// holds the list of possible rights, rights holders, etc..
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
            return DataOptions.columnOptions[column].concat(DataOptions.customColumnOptions[column]);
        } else {
            return [];
        }
    }
}

//Adds a new data option to the custom data list.
//Returns the index of the added data.
DataOptions.addCustom = function(column, data){
    if(data === ""){
        return -1;
    } else if (!DataOptions.customColumnOptions.hasOwnProperty(column)) {
        console.err("WARNING: column ", column, " does not exist.");
        return -1;
    } else if(DataOptions.customColumnOptions[column].indexOf(data) >= 0 ||
            DataOptions.columnOptions[column].indexOf(data) >= 0){
        //The right or rights-holder we're trying to add already exists.
        var index = DataOptions.customColumnOptions[column].indexOf(data) || 
            DataOptions.columnOptions[column].indexOf(data); 
        return index;
    } else {
        DataOptions.customColumnOptions[column].push(data);
        return DataOptions.customColumnOptions[column].indexOf(data); 
    }
};

DataOptions.loadFromFile = function (fileName) {
    var fs = require('fs');
    var buf = fs.readFileSync(fileName, "utf8");
    var result = [];
    buf.split("\n").forEach(function (line) {
        line = line.trim();
        if (line != "") {
            result.push(line);
        }
    })
    return result;
}


// the options for a drop down in the key column
DataOptions.columnOptions = {
    "Impacted Rights": DataOptions.loadFromFile("Impacted Rights.csv"),
    "Impacted Rights-Holders": DataOptions.loadFromFile("Rightsholders.csv"),
    "Module": DataOptions.loadFromFile("Module.csv"),
    "Score": DataOptions.loadFromFile("Score.csv")
}
DataOptions.customColumnOptions = {
    "Impacted Rights": [],
    "Impacted Rights-Holders": [],
    "Module": [],
    "Score": []
}

DataOptions.getDefaultValue = function (className) {
    if (className == "Score") {
        return DataOptions.columnOptions["Score"][0];//25";//
    } else if (className == "Module") {
        return DataOptions.columnOptions["Module"][0];
    }
    return undefined;
}