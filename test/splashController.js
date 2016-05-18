g.aspenApp.controller('splashController', ['$scope', '$timeout', function ($scope, $timeout) {
    var list = RecentFiles.get();
    $scope.recentFiles = [];
    $scope.loading = false;

    list.forEach(function (item) {
        SaveLoad.checkFile(item.path, function () {
            $scope.recentFiles.push(item);
        });
    });

    $scope.hide = function () {
        setTimeout(function () {
            $("#splash").addClass("going");
            $("#splash #splash-content").addClass("going");
            $("#splash #splash-background").addClass("going");

            setTimeout(function () {
                $("#splash").hide();
            }, 4000);// the length of this timeout needs to be kept syned with the length of the animation
        }, 0);
    }

    $scope.load = function (path) {
        $scope.loading = true;
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