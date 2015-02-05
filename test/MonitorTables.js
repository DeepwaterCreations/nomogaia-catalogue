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
        //changes them, so there should definitely be a prototype in here somewhere.)
        newTable.prototype = this.backingData[this.backingData.length-1]; //This doesn't get the scores, though... 
        this.push(newTable);

        return newTable;
    }

    this.toOut = function () {
        var out = [];
        this.backingData.forEach(function (table) {
            out.push(table.toOut());
        });
        return out;
    }
}