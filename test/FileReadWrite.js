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
        if (!($(this).val())) return; //Maybe the user didn't specify a value.

        var filer = fs.createReadStream($(this).val());
        filer.setEncoding('utf8');
        filer.on('data', function (chunk) {
            $('#fileTextBox').val(chunk); //Puts the data in the text box. //TODO: We'll want to get rid of this eventually, but it's useful for testing.

            var obj = jQuery.parseJSON(chunk);
            monitorTables.clear().addTable(createTableFromJSON(obj));
        })

        $(this).val(""); //Reset the filepath so that the event will be called again.
    });

    fileDialog.trigger("click");
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
