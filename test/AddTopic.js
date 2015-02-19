function AddTopic() { }

AddTopic.addTopic = function () {
    console.log("Colin - I would add a topic")
    var catalog = AddTopic.categorySelectValue().replace(/\t/g, "    ").trim();
    var category = AddTopic.subcategorySelectValue().replace(/\t/g, "    ").trim();
    var subCategory = AddTopic.subcategorySelectValue().replace(/\t/g, "    ").trim();
    var topic = AddTopic.topicNameValue().replace(/\t/g,"    ").trim();
    var description = AddTopic.topicDescTextValue().replace(/\t/g, "    ").trim();
    var module = AddTopic.moduleSelectValue().replace(/\t/g, "    ").trim();
    var source = AddTopic.topicSourceTextValue().replace(/\t/g, "    ").trim();

    var myTopic = new Topic(catalog, category, subCategory, topic, description, module, source);

    var fs = require("fs");
    fs.appendFile("myTopics.txt", myTopic.toString(), function (err) { });
    categoryHierarchy.addTopic(myTopic);
    //TODO push this change to the approprate lists
    // oh boy that is going to suck

    //reset the values
    // we have to subcategory/category/catalog in this order
    $("#subcategorySelect").select2("val", "-");
    $("#categorySelect").select2("val", "-");
    $("#catalogSelect").select2("val", "-");
    
    $("#moduleSelect").val("None"); 
    $("#topicName").val("");
    $("#topicDescTextBox").val(""); 
    $("#topicSourceTextBox").val("");
}

AddTopic.makeSelect2 = function (select, backingList) {
    select.select2({
        data: backingList,
        tags: true
    });
}

AddTopic.makeSelect2NoAdd = function (select, backingList) {
    select.select2({
        data: backingList
    });
}

AddTopic.hasValue = function (string) {
    if (string == undefined
        || string == null
        || string == "-"
        || string.replace(/\t/g, "    ").trim() == "") {
        return false;
    }
    return true;
}

AddTopic.canAdd = function () {
    var list = [AddTopic.catalogSelectValue(),
                AddTopic.categorySelectValue(),
                AddTopic.subcategorySelectValue(),
                AddTopic.moduleSelectValue(),
                AddTopic.topicNameValue(),
                AddTopic.topicDescTextValue(),
                AddTopic.topicSourceTextValue()]
    for (var i in list) {
        v = list[i];
        if (!AddTopic.hasValue(v)) {
            $('#addTopicButton').addClass("off");
            return false;
        }
    }
    $('#addTopicButton').removeClass("off");
    return true;
}

AddTopic.catalogSelectValue = function () { return $("#catalogSelect").val(); };
AddTopic.categorySelectValue = function () { return $("#categorySelect").val(); };
AddTopic.subcategorySelectValue = function () { return $("#subcategorySelect").val(); };
AddTopic.moduleSelectValue = function () { return $("#moduleSelect").val(); };

AddTopic.topicNameValue = function () { return $("#topicName").val(); };
AddTopic.topicDescTextValue = function () { return $("#topicDescTextBox").val(); };
AddTopic.topicSourceTextValue = function () { return $("#topicSourceTextBox").val(); };

AddTopic.updateSelectColumnOptions = function (target, list) {
    //remember the old value
    var oldValue = target.val();

    if (list.length == 1) {
        oldValue = list[0];
    }

    //remove everything
    target
    .find('option')
    .remove()
    .end();

    target.append('<option value="-">-</option>');
    // now add back what we need
    list.forEach(function (ele) {
        target.append('<option value="' + ele + '">' + ele + '</option>');
    });
    // see if the old value is still around:
    if (list.indexOf(oldValue) != -1) {
        console.log("setting value")
        target.select2("val", oldValue);
    } else {
    }
}

AddTopic.initFields = function (dataOptions) {
    AddTopic.makeSelect2($("#catalogSelect"), dataOptions.getColumnOptions("Catalog"));
    AddTopic.makeSelect2($("#categorySelect"), dataOptions.getColumnOptions("Category"));
    AddTopic.makeSelect2($("#subcategorySelect"), dataOptions.getColumnOptions("Sub-Category"));
    AddTopic.makeSelect2NoAdd($("#moduleSelect"), dataOptions.getColumnOptions("Module"));

    AddTopic.canAdd();

    $("#catalogSelect").change(function () {

        // everyone one is "-" 
        if ((AddTopic.categorySelectValue() == '-') && AddTopic.subcategorySelectValue() == '-') {

            // first let's update category 
            AddTopic.updateSelectColumnOptions($("#categorySelect"), categoryHierarchy.getCategories(AddTopic.catalogSelectValue()));

            // let's update subCategory
            AddTopic.updateSelectColumnOptions($("#subcategorySelect"), categoryHierarchy.getSubCategories(AddTopic.catalogSelectValue()));
        }
        AddTopic.canAdd();
    })
    $("#categorySelect").change(function () {
        // everyone more detailed one is "-" 
        if (AddTopic.subcategorySelectValue() == '-') {

            // first let's update catalog 
            AddTopic.updateSelectColumnOptions($("#catalogSelect"), categoryHierarchy.getCategoryCatalogs(AddTopic.categorySelectValue()));

            // let's update subCategory
            AddTopic.updateSelectColumnOptions($("#subcategorySelect"), categoryHierarchy.getSubCategories(AddTopic.catalogSelectValue(), AddTopic.categorySelectValue()));
        }
        AddTopic.canAdd();
    })
    $("#subcategorySelect").change(function () {

        // first let's update catalog 
        AddTopic.updateSelectColumnOptions($("#catalogSelect"), categoryHierarchy.getSubCategoryCatalogs(AddTopic.subcategorySelectValue()));

        // let's update subCategory
        AddTopic.updateSelectColumnOptions($("#categorySelect"), categoryHierarchy.getSubCategoryCategories(AddTopic.subcategorySelectValue()));
        AddTopic.canAdd();
    })

    $("#topicName").keyup(function () { AddTopic.canAdd(); });
    $("#topicDescTextBox").keyup(function () { AddTopic.canAdd(); });
    $("#topicSourceTextBox").keyup(function () { AddTopic.canAdd(); });

    $("#addTopicButton").click(function () {
        if (AddTopic.canAdd()) {
            AddTopic.addTopic();
        }
    })
}