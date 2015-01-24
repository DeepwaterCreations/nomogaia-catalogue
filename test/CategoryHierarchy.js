function CategoryHierarchy(string) {
    // string catalog : {string category : {string sub-category : {string topics : string description}}}
    this.hierarchy = {};
    var lines = string.split("\n");

    this.add = function (catalog, category, subCategory, topic, description) {
        console.log(catalog + "," + category + "," + subCategory + "," + topic);
        if (catalog in this.hierarchy) {
            var categoryContains = this.hierarchy[catalog];
            if (category in categoryContains) {
                var subCategoryContains = categoryContains[category];
                if (subCategory in subCategoryContains) {
                        var topics = subCategoryContains[subCategory];
                        topics[topic+""] =  description ;
                } else {
                    var topicDescription = {}
                    topicDescription[topic + ""] = description;
                    
                    subCategoryContains[subCategory + ""] = topicDescription;
                }
            } else {
                var topicDescription = {}
                topicDescription[topic + ""] = description;
                var subCategoryDescription = {}
                subCategoryDescription[subCategory + ""] = topicDescription;
                categoryContains[category + ""] = subCategoryDescription;
            }
        } else {
            var topicDescription = {}
            topicDescription[topic + ""] = description;
            var subCategoryDescription = {}
            subCategoryDescription[subCategory + ""] = topicDescription;
            var CategoryDescription = {}
            CategoryDescription[category + ""] = subCategoryDescription;
            this.hierarchy[catalog + ""] = CategoryDescription;
        }
    }

    for (i in lines) {
        var line = lines[i];
        //TODO ignore commas in quotes
        // also handle quotes as in a,b,c,"yo dog"
        var lineSplit = line.split(",");
        var catalog = lineSplit[0];
        var category = lineSplit[1];
        var subCategory = lineSplit[2];
        var topic = lineSplit[3];
        var description = "";


        this.add(catalog, category, subCategory, topic, description);
    }

    console.log(this);


}