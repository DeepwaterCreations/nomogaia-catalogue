$('#save').click(function () {
    var fileDialog = $("#saveFileDialog");
    fileDialog.change(function (event) {
        //Stuff...?
        console.log("Nalyd - toOut " + $(this).val());
    });
    fileDialog.trigger("click");
    console.log("Colin - toOut", monitorTables.toOut());//JSON.stringify()
});

$('#load').click(function () {
    console.log("Colin - row1", monitorTables);//JSON.stringify()
});

//-----
var filepath = "";

//When a file is selected, get the filepath and set 'filepath' to it.
$('#chooseFile').change(function (event) {
    filepath = $('#chooseFile').prop("value");
    console.log(filepath);
});

//When the read file button is clicked, read the file and put its contents in the div. 
var fs = require('fs');
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
