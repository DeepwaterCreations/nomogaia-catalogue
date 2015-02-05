// this class hold a TableData and a TableUI
// it is passed in to RowUI on create so that RowUI can access TableData
function Table(categoryHierarchy) {
    this.categoryHierarchy = categoryHierarchy;
    this.id = 0;
    this.nextId = function () {
        return this.id++;
    }

    this.toOut = function () {
        return this.tableData.toOut();
    }

    this.tableUI = new TableUI();
    this.tableData = new TableData(categoryHierarchy);
    this.addRow = function(data){
        var myRow=new RowUI(this,data);
        this.tableUI.rows.push(myRow);
        return myRow;
    }
}