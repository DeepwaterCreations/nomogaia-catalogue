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

DataOptions.isNotEmpty = function ( data) {
    if (data == undefined
        || data == null
        || data == "-"
        || data.replace(/\t/g, "    ").trim() == "") {
        return false;
    }
    return true;
}

//Adds a new data option to the custom data list.
//Returns the index of the added data.
DataOptions.addCustom = function(column, data){
    if(!DataOptions.isNotEmpty(data)){
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

//Functions for saving and loading
DataOptions.toOut = function(){
    //Possibly someday we might want to make a new object to return and add
    //filepaths to default rights/holders alongside the customColumnOptions
    //object.
    return DataOptions.customColumnOptions;
};

//"loadFromFile" loads the default options from a csv. This
//function instead loads rights/rightsholders/so-on that the user 
//added for this particular project. It's what the load button in the corner
//of the screen calls when the user loads a project from json.
DataOptions.loadCustom = function(loaded_data){
    //In the future, we might have to break up loaded_data and set its fields to 
    //different things, but for now, the only thing we care about saving and loading is a
    //single object anyway, so we go ahead and save and load it directly instead of wrapping it
    //in a bigger structure.
    DataOptions.customColumnOptions = loaded_data;
};
