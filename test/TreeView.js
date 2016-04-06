g.aspenApp.controller('treeController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.tableData = null;

    g.onMonitorTablesChange(function (monitorTables) {
        $timeout(function(){
            $scope.tableData = monitorTables.backingData[0].tableData;
            $scope.rightslist = monitorTables.dataOptions.columnOptions["Impacted Rights"];
            $scope.rightsholderlist = monitorTables.dataOptions.columnOptions["Impacted Rights-Holders"];
            console.log("TableData set!", $scope.tableData);
        });
    })

    $scope.toggleExpand = function (that) {
        console.log("that: ",that)
        that.show = !that.show;
    }
}]);

//function TreeView(categoryHierarchy) {
    //this.hierarchy = categoryHierarchy;
    //this.address = new Adress();


    //var that = this;
    
    //this.update = function () {
    //    var currentItems = this.hierarchy.itemsForAdress(this.address);

    //    var uiList = $("#currentItems");

    //    uiList.empty();

    //    for (var i = 0; i < currentItems.length; i++) {
    //        var str = "<li class='expandable'>" + currentItems[i] + "</li>";
    //        uiList.append(str);
    //    }

    //    $(".expandable").click(function () {
    //        var me = $(this);
    //        var myName = me.text();
    //        that.address.append(myName);
    //        that.update();
    //    });

    //    var adressBar = $("#adressBar");
    //    adressBar.empty();



    //    var title = $("#title");

    //    if (this.address.catalog !== null) {
    //        adressBar.append('<button id="home">home</button>');
    //        $("#home").click(function () {
    //            that.address.home();
    //            that.update();
    //        })
    //        if (this.address.category !== null) {
    //            adressBar.append('<button id="catalog" class="adressButton">' + this.address.catalog + '</button>');
    //            if (this.address.subCategory !== null) {
    //                adressBar.append('<button id="category" class="adressButton">' + this.address.category + '</button>');
    //                if (this.address.topic !== null) {
    //                    //adressBar.append('<button id="subCategory" class="adressButton">' + this.address.subCategory + '</button>');
    //                    //adressBar.append('<button id="topic" class="adressButton">' + this.address.topic + '</button>');
    //                } else {
    //                    title.text(this.address.subCategory);
    //                }
    //            } else {
    //                title.text(this.address.category);
    //            }
    //        } else {
    //            title.text(this.address.catalog);
    //        }
    //    } else {
    //        title.text("home");
    //    }

    //    $(".adressButton").click(function () {
    //        that.address.rollBackTo($(this).text());
    //        that.update();
    //    });
    //}
    
    //this.update();

    //$("#up").click(function () {
    //    that.address.up();
    //    that.update();
    //});




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
//}

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
