g.aspenApp.controller('tabBarController', ['$scope', function($scope){

    $scope.clickSaveAs = function(){
        SaveLoad.saveAs();
    };
}]);
