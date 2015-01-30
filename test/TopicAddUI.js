//Step 1: Fill up the select menus.
//table.tableData.getColumnOptions("Catalog").forEach(function (catalogItem) {
//    $("#catalogSelect").append('<option>' + catalogItem + '</options>');
//});

//Step 2: When they click the button, dump it all into the CategoryHierarchy. 
function addNewTopic() {
    var catalog = $("#catalogSelect").val();
    var category = $("#categorySelect").val();
    var subcategory = $("#subcategorySelect").val();
    var topicname = $("#topicName").val();
    var topicdesc = $("#topicDescText").val();

    categoryHierarchy.add(catalog, category, subcategory, topicname, topicdesc);
};
$('#addTopicButton').click(addNewTopic);
