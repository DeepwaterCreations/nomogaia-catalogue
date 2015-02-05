var tableId = 0;

// this class hold a TableData and a TableUI
// it is passed in to RowUI on create so that RowUI can access TableData
function Table(categoryHierarchy) {
    this.categoryHierarchy = categoryHierarchy;
    console.log("Colin, table id increased")
    this.id = tableId++;

    // TODO add a new tables to tables

    $("#tables").append('<table id="table'+this.id+'"><thead><tr></tr></thead><tbody></tbody></table>')

    this.getTable = function () {
        return $("#table" + this.id);
    }

    this.body =  this.getTable().find("tbody");

    //Here's where the tool tips for column headings are specified:
    var columnListTooltips = {
        "Catalog": "Shoeboxes.",
        "Category": "Does this shirt fit properly?",
        "Sub-Category": "a box in a box",
        "Topic": "Pants are for demons and breadcrumbs.",
        "Input": "SOCKS! SOCKS! SOCKS!",
        "Module": "What... are you eating under there?",
        "Source": "A watchband for your lovely timepiece.",
        "Impacted Rights": "Don't knock my smock, or I'll clean your clock.",
        "Impacted Rights-Holders": "The Cat in the Spat",
        "Score": "I just wanted an excuse to use the word 'cummerbund'.",
        "Monitor": "It's a bowtie. Bowties are cruel."
    };
    //This next bit of code is for populating the HTML table. I have no idea where, ultimately, this
    //code should live, or what function it ought to be a part of, but for now, it's right here:
    var that = this;
    columnList.forEach(function (columnName) {
        that.getTable().find("tr").append("<th class='CatalogHeader' title=''>" + columnName + "</th>");
        that.getTable().find("tr").children().last().tooltip({ content: columnListTooltips[columnName] });
    });

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