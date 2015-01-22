// this class hold a TableData and a TableUI
// it is passed in to RowUI on create so that RowUI can access TableData
function Table() {
    this.tableUI = new TableUI();
    this.tableData = new TableData();
}