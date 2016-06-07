g.aspenApp.controller('tabBarController', ['$scope', function($scope){

    $scope.clickSave = function(){
        SaveLoad.checkSave();
    };

    $scope.clickSaveAs = function(){
        SaveLoad.saveAs();
    };
}]);
