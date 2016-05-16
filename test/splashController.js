g.aspenApp.controller('splashController', ['$scope', '$timeout', function ($scope, $timeout) {
    var list = RecentFiles.get();
    $scope.recentFiles = [];

    list.forEach(function (item) {
        SaveLoad.checkFile(item.path, function () {
            $scope.recentFiles.push(item);
        });
    });

    console.log("rf", $scope.recentFiles);
    $scope.hide = function () {
        setTimeout(function () {
            console.log("going");
            $("#splash").addClass("going");
            $("#splash #splash-content").addClass("going");
            $("#splash #splash-background").addClass("going");

            setTimeout(function () {
                console.log("gone");
                $("#splash").hide();
            }, 4000);// the length of this timeout needs to be kept syned with the length of the animation
        }, 0);
    }

    $scope.load = function (path) {
        SaveLoad.load(path, $scope.hide);
    }

    $scope.selectFile = function () {
        forceLoad = false;
        var fileDialog = $("#loadFileDialog");
        fileDialog.on("change", function (event) {
            var filename = $(this).val();
            if (!filename) return; //Maybe the user didn't specify a value.


            $scope.load(filename);

            $(this).val(""); //Reset the filepath so that the event will be called again.
        });

        fileDialog.trigger("click");
    }
}]);