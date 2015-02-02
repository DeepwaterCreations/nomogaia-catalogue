function MonitorTables() {
    // a list of tables 
    this.backingData = [];

    this.push = function(table){
        this.backingData.push(table);
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