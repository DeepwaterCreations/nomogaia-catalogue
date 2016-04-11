function AddTopic() { }

AddTopic.addTopic = function () {
    console.log("addTopic");

    var catalog = AddTopic.catalogSelectValue().replace(/\t/g, "    ").trim();
    var category = AddTopic.categorySelectValue().replace(/\t/g, "    ").trim();
    var subCategory = AddTopic.subcategorySelectValue().replace(/\t/g, "    ").trim();
    var topic = AddTopic.topicNameValue().replace(/\t/g, "    ").trim();
    var description = AddTopic.topicDescTextValue().replace(/\t/g, "    ").trim();
    var module = AddTopic.moduleSelectValue().replace(/\t/g, "    ").trim();
    var source = AddTopic.topicSourceTextValue().replace(/\t/g, "    ").trim();

    var myTopic = new Topic(catalog, category, subCategory, topic, description, module, source);

    var fs = require("fs");
    var path = require('path');
    var filename = path.join(path.dirname(process.execPath), "myTopics.txt");// "myTopics.txt";
    fs.appendFile(filename, myTopic.toString(), function (err) { });
    categoryHierarchy.addTopic(myTopic);
    // add a row
    var rowAt = null;

    for (var tabIndex in monitorTables.backingData) {
        if (tabIndex >= monitorTabs.getActiveMonitor()) {
            var myTable = monitorTables.backingData[tabIndex];
            if (rowAt == null) {
                rowAt = myTable.addRow(myTopic.toData());
                rowAt.data.setMonitor(monitorTabs.getActiveMonitorAsString());
            } else {
                var dataAt = rowAt.data;
                var newData = new RowData(dataAt);
                rowAt = myTable.addRow(newData);
            }
        }
    }

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

    $("#addTopic").dialog("close");
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

AddTopic.isNewTopic = function (catalog, category, subcat, topic) {
    if (catalog == "" || category == "" || subcat == "" || topic == "" || catalog == "-" || category == "-" || subcat == "-" || topic == "-") {
        return true;
    }

    return categoryHierarchy.getTopics(catalog, category, subcat).indexOf(topic) == -1;
}

AddTopic.isLegalTopicName = function (string) {
    if (string == null) {
        // seem we don't want to tell the user null is not allowed they know that
        return true;
    }
    return string.replace(/\t/g, "    ").trim() != "-";
}

AddTopic.canAdd = function () {
    var willReturn = true;

    var list = [$("#catalogSelect"),
                $("#categorySelect"),
                $("#subcategorySelect"),
                $("#moduleSelect"),
                $("#topicName")]
    for (var i in list) {
        v = list[i];
        if (!AddTopic.hasValue(v.val())) {
            $('#addTopicButton').addClass("off");
            v.addClass("incomplete");
            willReturn= false;
        } else {
            v.removeClass("incomplete");
        }
    }

    if (!AddTopic.isNewTopic(AddTopic.catalogSelectValue(), AddTopic.categorySelectValue(), AddTopic.subcategorySelectValue(), AddTopic.topicNameValue())) {
        $("#topicName").addClass("incomplete")
        $('#warning-topic').css('display', 'block');
        $('#warning-topic').text("! topic already exists");
        willReturn = false;
    } else if (!AddTopic.isLegalTopicName(AddTopic.topicNameValue())) {
        $("#topicName").addClass("incomplete")
        $('#warning-topic').css('display', 'block');
        $('#warning-topic').text("! '" + AddTopic.topicNameValue() + "' is not a legal topic name");
        willReturn = false;
    } else {
        $('#warning-topic').css('display', 'none');
    }

    if (willReturn) {
        $('#addTopicButton').removeClass("off");
    } else {
        $('#addTopicButton').addClass("off");
    }
    return willReturn;
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
    } else {
    }
}

AddTopic.setColumnSelect = function (target, value) {
    if (Array.isArray(value) && value.length == 1) {
        value = value[0];
    } else if (!Array.isArray(value)) {
    }
}


AddTopic.initFields = function (dataOptions) {

    AddTopic.canAdd();

    $("#catalogSelect").change(function () {
        //we need to check if the we changed to something new
        $(this).data("old", $(this).data("new") || "");
        $(this).data("new", $(this).val());

        if ($(this).data("old") != $(this).data("new")) {
            // first let's update category 
            AddTopic.updateSelectColumnOptions($("#categorySelect"), categoryHierarchy.getCategories(AddTopic.catalogSelectValue()));

            // let's update subCategory
            AddTopic.updateSelectColumnOptions($("#subcategorySelect"), categoryHierarchy.getSubCategories(AddTopic.catalogSelectValue()));
        }
        AddTopic.canAdd();
    })
    $("#categorySelect").change(function () {
        //we need to check if the we changed to something new
        $(this).data("old", $(this).data("new") || "");
        $(this).data("new", $(this).val());

        if ($(this).data("old") != $(this).data("new")) {

            if (AddTopic.categorySelectValue() != "-") {
                // first let's update catalog 
                AddTopic.setColumnSelect($("#catalogSelect"), categoryHierarchy.getCategoryCatalogs(AddTopic.categorySelectValue()));

            }
            // let's update subCategory
            AddTopic.updateSelectColumnOptions($("#subcategorySelect"), categoryHierarchy.getSubCategories(AddTopic.catalogSelectValue(), AddTopic.categorySelectValue()));
        }
        AddTopic.canAdd();
    })
    $("#subcategorySelect").change(function () {
        //we need to check if the we changed to something new
        $(this).data("old", $(this).data("new") || "");
        $(this).data("new", $(this).val());

        if ($(this).data("old") != $(this).data("new")) {

            if (AddTopic.subcategorySelectValue() != "-") {

                // first let's update catalog 
                AddTopic.setColumnSelect($("#catalogSelect"), categoryHierarchy.getSubCategoryCatalogs(AddTopic.subcategorySelectValue()));

                // let's update subCategory
                AddTopic.setColumnSelect($("#categorySelect"), categoryHierarchy.getSubCategoryCategories(AddTopic.subcategorySelectValue()));

            }
        }

        AddTopic.canAdd();
    })


    $("#topicName").keyup(function () {
        AddTopic.canAdd();
    });
    $("#topicDescTextBox").keyup(function () {
        AddTopic.canAdd();
    });
    $("#topicSourceTextBox").keyup(function () { AddTopic.canAdd(); });

    $("#addTopicButton").click(function () {
        if (AddTopic.canAdd()) {
            AddTopic.addTopic();
        }
    })
}
