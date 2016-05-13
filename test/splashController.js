g.aspenApp.controller('splashController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.list = [{
        date: "01/01/15",
        name: "File"
    }, {
        date: "01/02/15",
        name: "Other File"
    }]

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
}]);