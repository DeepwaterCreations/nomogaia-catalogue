function TreeView(categoryHierarchy) {
    this.hierarchy = categoryHierarchy;
    this.address = new Adress();
    var that = this;
    
    this.updateCurrentItems = function () {
        var currentItems = this.hierarchy.itemsForAdress(this.address);

        var uiList = $("#currentItems");

        uiList.empty();

        for (var i = 0; i < currentItems.length; i++) {
            var str = "<li class='expandable'>" + currentItems[i] + "</li>";
            uiList.append(str);
        }

        $(".expandable").click(function () {
            var me = $(this);
            var myName = me.text();
            that.address.append(myName);
            that.updateCurrentItems();
        });

    }
    
    this.updateCurrentItems();

    $("#up").click(function () {
        that.address.up();
        that.updateCurrentItems();
    });

    $("#home").click(function () {
        that.address.home();
        that.updateCurrentItems();
    })


    //var outerList = $("#outline");
    //var outlineString = TreeView.treeFromDictionary(categoryHierarchy.hierarchy);
    //outerList.append(outlineString);
    //$(".show-hide").click(function () {
    //    var me = $(this);
    //    var current = me.attr('data-shown');
    //    current = current == "true" ? "false" : "true";
    //    me.attr('data-shown', current);
    //    var text = current == "true" ? "hide" : "show";
    //    me.text(text)
    //});
}

// returns a html string 
//TreeView.treeFromDictionary = function (dict) {
//    var res = "";
//    for (var key in dict) {
//        res += "<li> " + key;
//        res += '<button class="show-hide" data-shown="false">show</button>'
//        // if dict[key] is not a topic recurse
//        if (!(dict[key] instanceof Topic)) {
//            res += " <ul>" + TreeView.treeFromDictionary(dict[key]) + " </ul>";
//        }
//        res += " </li>";
//    }
//    return res;
//}

// returns string
