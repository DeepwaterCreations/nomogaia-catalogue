function MonitorTables() {
    // a list of tables 
    this.backingData = [];

    this.push = function(table){
        this.backingData.push(table);
    }

    this.addTable = function () {
        var newTable = new Table();

        //Gives it the values from the previous Table... I think. 
        //(We might instead want a method of Table that returns an appropriate clone. But we also want the previous Table's values to continue to be reflected in this one if someone goes back and 
        //changes them.)
        newTable.prototype = this.backingData[this.backingData.length-1]; 
        this.push(newTable);

        return newTable;
    }

    //getter and setter for count;
    //var getSetCount = (function () {
    //    var count = 0;
    //    return [function () {
    //        return count;
    //    },
    //    function (newCount) {
    //        count = newCount;
    //    }]
    //})();
    //getCount = getSetCount[0];
    //setCount = getSetCount[1];

    //this.add = function (table) {
    //    backingData.push(table);
    //}
}