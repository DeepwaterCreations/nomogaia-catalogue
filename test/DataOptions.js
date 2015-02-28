// holds the list of possible rights, rights holders, etc..
function DataOptions(categoryHierarchy) {
    this.categoryHierarchy = categoryHierarchy;

    this.loadFromFile = function (fileName) {
        var fs = require('fs');
        var buf = fs.readFileSync(fileName, "utf8");
        var result = [];
        buf.split("\n").forEach(function (line) {
            line = line.trim();
            if (line != "") {
                result.push(line);
            }
        })
        console.log("Colin", result);
        return result;
    }

    var that = this;

    // the options for a drop down in the key column
    this.columnOptions = {
        "Impacted Rights": that.loadFromFile("Impacted Rights.csv"),
        "Impacted Rights-Holders": that.loadFromFile("Rightsholders.csv"),
        "Module": that.loadFromFile("Module.csv"),
        "Score": that.loadFromFile("Score.csv")
    }

    this.update = function (column, data) {
        if (Array.isArray(data)) {
            var that = this;
            data.forEach(function (dat) {
                that.updateSingle(column, dat);
            });
        } else {
            this.updateSingle(column, data);
        }
    }

    this.updateSingle = function (column, data) {
        if (this.columnOptions[column].indexOf(data) == -1) {
            this.columnOptions[column].push(data);
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
    this.getColumnOptions = function (column) {
        if (column == "Catalog") {
            var result = this.categoryHierarchy.getCatalogs();
            result.unshift("-");
            return result;
        } else if (column == "Category") {
            var result = this.categoryHierarchy.getCategories();
            result.unshift("-");
            return result;
        } else if (column == "Sub-Category") {
            var result = this.categoryHierarchy.getSubCategories();
            result.unshift("-");
            return result;
        } else if (column == "Topic") {
            var result = this.categoryHierarchy.getTopics();
            result.unshift("-");
            return result;
        } else {
            if (this.columnOptions.hasOwnProperty(column)) {
                return this.columnOptions[column];
            } else {
                console.log("column: " + column + " not found");
                return [];
            }
        }
    }
}

DataOptions.getDefaultValue = function (className) {
    if (className == "Score") {
        return "-";
    } else if (className == "Module") {
        return "None";
    }
    return undefined;
}