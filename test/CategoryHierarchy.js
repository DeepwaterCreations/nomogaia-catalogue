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
                    topics[topic + ""] = description;
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
    };

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

    // returns a list of catalogs
    this.getCatalogs = function () {
        var result = [];
        for (var key in this.hierarchy) {
            result.push(key);
        }
        return result;
    };

    // returns a list of Categories for a given catalog
    this.getCategories = function (catalog) {
        var result = [];
        for (var key in this.hierarchy[catalog]) {
            result.push(key);
        }
        return result;
    };

    // returns a list of subCategories for a given catalog and category
    this.getSubCategories = function (catalog, category ) {
        var result = [];
        for (var key in this.hierarchy[catalog][category]) {
            result.push(key);
        }
        return result;
    };

    // returns a list of topics for a given catalog, category and SubCategories
    this.getTopics = function (catalog, category, subCategory) {
        var result = [];
        for (var key in this.hierarchy[catalog][category][subCategory]) {
            result.push(key);
        }
        return result;
    };

    // returns the description for a given  topic
    this.getDescription = function (topic) {
        var subCategory = this.getTopicSubCategory(topic);
        var category = this.getTopicCategory(topic);
        var catalog = this.getTopicCatalog(topic);
        return this.hierarchy[catalog][category][subCategory][topic];
    };

    // returns the subCategoreis that contains a given topic
    this.getTopicSubCategories = function (topic) {
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                var subCategories = categories[category];
                for (var subCategory in subCategories) {
                    var topics = subCategories[subCategory];
                    if (topic in topics) {
                        result.push(subCategory);
                    }
                }
            }
        }
        return result;
    }

    // returns the categories that contains a given topic
    this.getTopicCategories = function (topic) {
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                var subCategories = categories[category];
                for (var subCategory in subCategories) {
                    var topics = subCategories[subCategory];
                    if (topic in topics) {
                        result.push(category);
                    }
                }
            }
        }
        return result;
    }

    // returns the catalogss that contains a given topic
    this.getTopicCatalogs = function (topic) {
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                var subCategories = categories[category];
                for (var subCategory in subCategories) {
                    var topics = subCategories[subCategory];
                    if (topic in topics) {
                        result.push(catalog);
                    }
                }
            }
        }
        return result;
    }

    // returns the subCatories that contains a given topic
    this.getTopicSubCategories = function (topic) {
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                var subCategories = categories[category];
                for (var subCategory in subCategories) {
                    var topics = subCategories[subCategory];
                    if (topic in topics) {
                        result.push(subCategory);
                    }
                }
            }
        }
        return result;
    }

    // returns a list of Categories that could contain a subCategory
    this.getSubCategoryCategories = function (subCategory) {
        var result =[]
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                var subCategories = categories[category];
                if (subCategory in subCategories) {
                    result.push(category);
                }
            }
        }
        return result;
    }

    // returns a list of Catalogs that could contain a subCategory
    this.getSubCategoryCatalogs = function (subCategory) {
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                var subCategories = categories[category];
                if (subCategory in subCategories) {
                    result.push(catalog);
                }
            }
        }
        return result;
    }

    // returns a list of Catalogs that could contain a subCategory
    this.getCategoryCatalogs = function (category) {
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            if (category in categories) {
                result.push(catalog);
            }
        }
        return result;
    }

    console.log(this);


}