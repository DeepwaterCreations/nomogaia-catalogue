g.aspenApp.controller('tabBarController', ['$scope', function($scope){

    $scope.showSaveMenu = false;

    $scope.clickSave = function(){
        SaveLoad.checkSave();
    };

    $scope.clickSaveAs = function(){
        SaveLoad.saveAs();
    };

    $scope.clickSaveCSV = function(){
        SaveLoad.saveAs(true);
    };

    $scope.clickSaveMenu = function(){
        $scope.showSaveMenu = !$scope.showSaveMenu;
    };

}]);
