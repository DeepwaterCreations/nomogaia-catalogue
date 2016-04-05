function Topic(catalog, category,subCategory, topic, description, module, source) {
    this.catalog = catalog;
    this.category = category;
    this.subCategory = subCategory;
    this.topic = topic;
    this.description = description;
    this.module = module;
    this.source = source;

    this.toData = function () {
        var result = new RowData();
        result.setData("Catalog", this.catalog);
        result.setData("Category", this.category);
        result.setData("Sub-Category", this.subCategory);
        result.setData("Topic", this.topic);
        result.setData("Description", this.description);
        result.setData("Module", this.module);
        result.setData("Source", this.source);
        return result;
    }

    this.toString = function () {
        var result = "";
        result += catalog;
        result += '\t';
        result += category;
        result += '\t';
        result += subCategory;
        result += '\t';
        result += topic;
        result += '\t';
        result += description;
        result += '\t';
        result += module;
        result += '\t';
        result += source;
        result += '\n';
        return result;
    }
}
