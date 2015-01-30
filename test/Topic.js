function Topic(catalog, category,subCategory, topic, description, module, source) {
    this.catalog = catalog;
    this.category = category;
    this.subCategory = subCategory;
    this.topic = topic;
    this.desctiption = description;
    this.module = module;
    this.source = source;

    this.toData = function () {
        var result = new RowData();
        result.setData("Catalog", this.catalog);
        result.setData("Category", this.category);
        result.setData("Sub-Category", this.subCategory);
        result.setData("Topic", this.topic);
        result.setData("Module", this.module);
        result.setData("Soucre", this.source);
        return result;
    }
}