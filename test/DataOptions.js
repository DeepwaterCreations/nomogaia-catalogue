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
        "Module": that.loadFromFile("Module.csv")
    }
    console.log("Colin", this);

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