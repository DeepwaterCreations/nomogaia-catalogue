function TreeView(categoryHierarchy) {
    var outerList = $("#outline");

    var outlineString = TreeView.treeFromDictionary(categoryHierarchy.hierarchy);
    outerList.append(outlineString);
    $(".show-hide").click(function () {
        var me = $(this);
        var current = me.attr('data-shown');
        current = current == "true" ? "false" : "true";
        me.attr('data-shown', current);
        var text = current == "true" ? "hide" : "show";
        me.text(text)
    });
}

// returns a html string 
TreeView.treeFromDictionary = function (dict) {
    var res = "";
    for (var key in dict) {
        res += "<li> " + key;
        res += '<button class="show-hide" data-shown="false">show</button>'
        // if dict[key] is not a topic recurse
        if (!(dict[key] instanceof Topic)) {
            res += " <ul>" + TreeView.treeFromDictionary(dict[key]) + " </ul>";
        }
        res += " </li>";
    }
    return res;
}