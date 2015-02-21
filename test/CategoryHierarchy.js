function CategoryHierarchy(string) {
    // string catalog : {string category : {string sub-category : {string topics : string description}}}
    this.hierarchy = {};

    this.dequote = function (string) {
        //console.log(string);
        //console.log(string.slice(0, 1));
        //console.log(string.slice(-1));
        if (string.slice(0, 1) == "\"" && string.slice(-1) == "\"") {
            return string.substring(1, string.length - 1);
        }
        return string;
    }

    this.addTopic = function(topicInstance){
        var catalog =topicInstance.catalog;
        var category = topicInstance.category;
        var subCategory = topicInstance.subCategory;
        var topicString = topicInstance.topicString;
        this.add(catalog, category, subCategory, topicString, topicInstance);
    }

    this.add = function (catalog, category, subCategory, topicString, topicInstance) {
        //console.log(catalog + "," + category + "," + subCategory + "," + topicString);
        if (catalog in this.hierarchy) {
            var categoryContains = this.hierarchy[catalog];
            if (category in categoryContains) {
                var subCategoryContains = categoryContains[category];
                if (subCategory in subCategoryContains) {
                    var topics = subCategoryContains[subCategory];
                    topics[topicString + ""] = topicInstance;
                } else {
                    var topicDescription = {}
                    topicDescription[topicString + ""] = topicInstance;

                    subCategoryContains[subCategory + ""] = topicDescription;
                }
            } else {
                var topicDescription = {}
                topicDescription[topicString + ""] = topicInstance;
                var subCategoryDescription = {}
                subCategoryDescription[subCategory + ""] = topicDescription;
                categoryContains[category + ""] = subCategoryDescription;
            }
        } else {
            var topicDescription = {}
            topicDescription[topicString + ""] = topicInstance;
            var subCategoryDescription = {}
            subCategoryDescription[subCategory + ""] = topicDescription;
            var CategoryDescription = {}
            CategoryDescription[category + ""] = subCategoryDescription;
            this.hierarchy[catalog + ""] = CategoryDescription;
        }
    };

    this.addSet = function (inputString) {
        var lines = inputString.split("\n");
        for (i in lines) {
            var line = lines[i];
            //TODO ignore commas in quotes
            // also handle quotes as in a,b,c,"yo dog"
            //console.log(line);
            var lineSplit = line.split("\t");
            if (lineSplit[0] != "") {
                var catalog = this.dequote(lineSplit[0].trim());
                var category = this.dequote(lineSplit[1].trim());
                var subCategory = this.dequote(lineSplit[2].trim());
                var topicString = this.dequote(lineSplit[3].trim());
                var description = this.dequote(lineSplit[4].trim());
                var module = this.dequote(lineSplit[5].trim());
                var source = this.dequote(lineSplit[6].trim());

                //console.log(catalog + ", " + category + ", " + subCategory + ", " + topicString + ", " + description + ", " + module + ", " + source);

                var topicInstance = new Topic(catalog, category, subCategory, topicString, description, module, source);

                this.add(catalog, category, subCategory, topicString, topicInstance);
            }
        }
    }

    this.addSet(string);

    this.subCategoriesDown = function (subCategories, subCategory, topicsDownIn) {
        if (subCategory == undefined || subCategory == '-') {
            for (var subCategory in subCategories) {
                topicsDownIn(subCategories[subCategory])
            }
        } else {
            if (subCategory in subCategories) {
                topicsDownIn(subCategories[subCategory]);
            }
        }
    }

    this.categoriesDown = function (categories, category, subCategory, subCategoriesDownIn, topicsDownIn) {
        if (category == undefined || category == '-') {
            for (var category in categories) {
                subCategoriesDownIn(categories[category], subCategory, topicsDownIn)
            }
        } else {
            if (category in categories) {
                subCategoriesDownIn(categories[category], subCategory, topicsDownIn);
            }
        }
    }

    this.catalogDown = function (catalog, category, categoriesDownIn, subCategory, subCategoriesDownIn, topicsDownIn) {
        if (catalog == undefined || catalog == '-') {
            for (var catalog in this.hierarchy) {
                categoriesDownIn(this.hierarchy[catalog], category, subCategory, subCategoriesDownIn, topicsDownIn)
            }
        } else {
            if (catalog in this.hierarchy) {
                categoriesDownIn(this.hierarchy[catalog], category, subCategory, subCategoriesDownIn, topicsDownIn);
            }
        }
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

        var myCategoriesDown = function (categories) {
            for (var category in categories) {
                if (result.indexOf(category) == -1) {
                    result.push(category);
                }
            }
        }

        this.catalogDown(catalog, undefined, myCategoriesDown);

        return result;
    };

    // returns a list of subCategories for a given catalog and category
    this.getSubCategories = function (catalog, category) {
        var result = [];

        var mySubCategoriesDown = function (subCategories) {
            for (var subCategory in subCategories) {
                if (result.indexOf(subCategory) == -1) {
                    result.push(subCategory);
                }
            }
        }

        this.catalogDown(catalog, category, this.categoriesDown, undefined, mySubCategoriesDown);

        return result;
    };

    // returns a list of topics for a given catalog, category and SubCategories
    this.getTopics = function (catalog, category, subCategory) {
        var result = [];

        var topicsDown = function (topics) {
            for (var topic in topics) {
                if (result.indexOf(topic) == -1) {
                    result.push(topic);
                }
            }
        }

        this.catalogDown(catalog, category, this.categoriesDown, subCategory, this.subCategoriesDown, topicsDown);

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
        if (topic == '-') {
            return this.getSubCategories();
        } else {
            var result = []
            for (var catalog in this.hierarchy) {
                var categories = this.hierarchy[catalog];
                for (var category in categories) {
                    var subCategories = categories[category];
                    for (var subCategory in subCategories) {
                        var topics = subCategories[subCategory];
                        if (topic in topics) {
                            if (result.indexOf(subCategory) == -1) {
                                result.push(subCategory);
                            }
                        }
                    }
                }
            }
            return result;
        }
    }

    // returns the categories that contains a given topic
    this.getTopicCategories = function (topic, subCategoryIn, catalogIn) {
        if (topic == '-') {
            return this.getCategories();
        } else {
            var result = []
            for (var catalog in this.hierarchy) {
                if (catalogIn == '-' || catalogIn == undefined || catalog == catalogIn) {
                    var categories = this.hierarchy[catalog];
                    for (var category in categories) {
                        var subCategories = categories[category];
                        for (var subCategory in subCategories) {
                            if (subCategoryIn == '-' || subCategoryIn == undefined || subCategory == subCategoryIn) {
                                var topics = subCategories[subCategory];
                                if (topic in topics) {
                                    if (result.indexOf(category) == -1) {
                                        result.push(category);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        }
    }

    // returns the catalogss that contains a given topic
    this.getTopicCatalogs = function (topic, subCategoryIn, categoryIn) {
        if (topic == '-') {
            return this.getCatalogs();
        }
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                if (categoryIn == '-' || categoryIn == undefined || category == categoryIn) {
                    var subCategories = categories[category];
                    for (var subCategory in subCategories) {
                        if (subCategoryIn == '-' || subCategoryIn == undefined || subCategoryIn == subCategory) {
                            var topics = subCategories[subCategory];
                            if (topic in topics) {
                                if (result.indexOf(catalog) == -1) {
                                    result.push(catalog);
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    // returns a list of Categories that could contain a subCategory
    this.getSubCategoryCategories = function (subCategory, catalogIn) {
        if (subCategory == '-') {
            return this.getCategories();
        }
        var result = []
        for (var catalog in this.hierarchy) {
            if (catalogIn == '-' || catalogIn == undefined || catalog == catalogIn) {
                var categories = this.hierarchy[catalog];
                for (var category in categories) {
                    var subCategories = categories[category];
                    if (subCategory in subCategories) {
                        if (result.indexOf(category) == -1) {
                            result.push(category);
                        }
                    }
                }
            }
        }
        return result;
    }

    // returns a list of Catalogs that could contain a subCategory
    this.getSubCategoryCatalogs = function (subCategory, categoryIn) {
        if (subCategory == '-') {
            return this.getCatalogs();
        }
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            for (var category in categories) {
                if (categoryIn == '-' || categoryIn == undefined || category == categoryIn) {
                    var subCategories = categories[category];
                    if (subCategory in subCategories) {
                        if (result.indexOf(catalog) == -1) {
                            result.push(catalog);
                        }
                    }
                }
            }
        }
        return result;
    }

    // returns a list of Catalogs that could contain a subCategory
    this.getCategoryCatalogs = function (category) {
        if (category == '-') {
            return this.getCatalogs();
        }
        var result = []
        for (var catalog in this.hierarchy) {
            var categories = this.hierarchy[catalog];
            if (category in categories) {
                if (result.indexOf(catalog) == -1) {
                    result.push(catalog);
                }
            }
        }
        return result;
    }

    this.getTopicInstance = function (topicString) {
        var catalog = this.getTopicCatalogs(topicString);
        var category = this.getTopicCategories(topicString);
        var subCategory = this.getTopicSubCategories(topicString);
        return this.hierarchy[catalog[0]][category[0]][subCategory[0]][topicString];
    }

    this.getTopic= function(topic){
        if (topic == '-') {
            return null;
        } else {
            for (var catalog in this.hierarchy) {
                var categories = this.hierarchy[catalog];
                for (var category in categories) {
                    var subCategories = categories[category];
                    for (var subCategory in subCategories) {
                        var topics = subCategories[subCategory];
                        if (topic in topics) {
                            return topics[topic];
                        }
                    }
                }
            }
            console("Colin - this is bad ");
        }
    }

    console.log("colin", this);
}