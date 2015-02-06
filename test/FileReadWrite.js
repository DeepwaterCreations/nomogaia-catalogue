var fs = require('fs');

//What we're basically doing with these is using the button's onClick to trigger the (hidden) file input's onClick. That way, we get the dialog but not the
//standard filepath-and-"choose-file"-button UI element from the file input. See https://github.com/nwjs/nw.js/wiki/File-dialogs
$('#save').click(function () {
    var fileDialog = $("#saveFileDialog");
    fileDialog.on("change", function (event) {
        console.log("Nalyd - toOut " + $(this).val());

        var filew = fs.createWriteStream($(this).val());
        filew.write(JSON.stringify(monitorTables.toOut()));
    });
    fileDialog.trigger("click");
    //console.log("Colin - toOut", monitorTables.toOut());//JSON.stringify()
});

$('#load').click(function () {
    var fileDialog = $("#loadFileDialog");
    fileDialog.on("change", function (event) {
        console.log("Nalyd - toOut " + $(this).val());

        var filer = fs.createReadStream($(this).val());
        filer.setEncoding('utf8');
        filer.on('data', function (chunk) {
            console.log("Nalyd - chunk", chunk);
            $('#fileTextBox').val(chunk);
            //What we really need to do here instead of putting the chunks into the text box,
            //is to parse them and make a RowData. Right?
            var obj = jQuery.parseJSON(chunk);
            console.log("Nalyd - JSON ", obj);
            //Do I need to modify addTable in MonitorTables?
            //Do I want to clear the existing data?
            //Just call addTable directly and give it a new Table.
            //Also, the Table needs its TableData set properly.
        })
    });

    fileDialog.trigger("click");
    //console.log("Colin - row1", monitorTables);//JSON.stringify()
});

//-----
var filepath = "";

//When a file is selected, get the filepath and set 'filepath' to it.
$('#chooseFile').change(function (event) {
    filepath = $('#chooseFile').prop("value");
    console.log(filepath);
});

//When the read file button is clicked, read the file and put its contents in the div. 
$('#readFileButton').click(function () {
    if (filepath === "") {
        console.log("Error: No file selected");
        return;
    }

    var filer = fs.createReadStream(filepath);
    filer.setEncoding('utf8');
    filer.on('data', function (chunk) {
        console.log(chunk);
        $('#fileTextBox').val(chunk);
    })
});

//When the write file button is clicked, write the contents of the div's text box to
//the file specified by 'filepath'.
$('#writeFileButton').click(function () {
    if (filepath === "") {
        console.log("Error: No file selected");
        return;
    }

    var filew = fs.createWriteStream(filepath);
    filew.write($('#fileTextBox').val());
})
