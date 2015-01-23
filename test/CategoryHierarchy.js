function CategoryHierarchy(string) {
    // string catalog : list categories
    this.catalogContains = {};
    // string category : list sub-category
    this.categoryContains = {};
    // string sub-category : list topics
    this.subCategoryContains = {};
    var lines = string.split("\n");

    for (i in lines) {
        var line = lines[i];
        //TODO ignore commas in quotes
        // also handle quotes as in a,b,c,"yo dog"
        var lineSplit = line.split(",");
        var catalog = lineSplit[0];
        var category = lineSplit[1];
        var subCategory = lineSplit[2];
        var topic = lineSplit[3];

        console.log(catalog + "," + category + "," + subCategory + "," + topic);

        if (catalog in this.catalogContains) {
            if (this.catalogContains[catalog].indexOf(category) ==-1) {
                this.catalogContains[catalog].push(category);
            }
        } else {
            this.catalogContains[catalog] = [category];
        }

        if (category in this.categoryContains) {
            if (this.categoryContains[category].indexOf(subCategory) == -1) {
                this.categoryContains[category].push(subCategory);
            }
        } else {
            this.categoryContains[category] = [subCategory];
        }

        if (subCategory in this.subCategoryContains) {
            if (this.subCategoryContains[subCategory].indexOf(topic) == -1) {
                this.subCategoryContains[subCategory].push(topic);
            }
        } else {
            this.subCategoryContains[subCategory] = [topic];
        }

    }

    console.log(this);


}