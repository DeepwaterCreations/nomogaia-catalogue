// holds the list of possible rights, rights holders, etc..
function DataOptions() {}

DataOptions.setCategoryHierarchy = function(CategoryHierarchy) {
    DataOptions.categoryHierarchy = categoryHierarchy;
}
    

DataOptions.update = function (column, data) {
    if (Array.isArray(data)) {
        data.forEach(function (dat) {
            DataOptions.updateSingle(column, dat);
        });
    } else {
        DataOptions.updateSingle(column, data);
    }
}

DataOptions.updateSingle = function (column, data) {
    if (DataOptions.columnOptions[column].indexOf(data) == -1) {
        DataOptions.columnOptions[column].push(data);
    }

    // add it to the other rights holders lists
    var rightsHoldersSelectList = $('.' + toColumnName(column));
    for (var i = 0; i < rightsHoldersSelectList.length; i++) {
        var rightsHoldersSelect = rightsHoldersSelectList[i];
        if ( $(rightsHoldersSelect).find('[value="' + data + '"]').length == 0) {
            $(rightsHoldersSelect).append('<option value="' + data + '">' + data + '</option>');
        }
    }
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

DataOptions.getDefaultValue = function (className) {
    if (className == "Score") {
        return DataOptions.columnOptions["Score"][0];
    } else if (className == "Module") {
        return DataOptions.columnOptions["Module"][0];
    }
    return undefined;
}